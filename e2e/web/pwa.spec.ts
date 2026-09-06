import { test, expect } from '@playwright/test'
import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer, type Server } from 'node:http'
import type { AddressInfo } from 'node:net'
import path from 'node:path'

/**
 * That the built app is actually installable, and actually works offline.
 *
 * The rest of the web suite is served from the root of a test server, which is
 * the one shape this cannot be tested in: the site lives at
 * /palmas/palmas_web/, and every path Quasar writes from `build.publicPath`
 * comes out absolute. An absolute `/manifest.json` or `/sw.js` resolves to the
 * domain root, 404s, and leaves a site that looks completely normal and simply
 * never offers to install. Nothing short of serving it from a subdirectory
 * shows that.
 *
 * So this spec stands up its own server with the app under the real deploy
 * path, and asks the three questions that matter: does the manifest load, does
 * the worker take control, and can you still hear anything with the network
 * gone.
 */

const dist = path.resolve(process.cwd(), 'dist/pwa')
const MOUNT = '/palmas/palmas_web/'

const TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.flac': 'audio/flac',
  '.mp3': 'audio/mpeg'
}

let server: Server
let origin: string

test.beforeAll(async () => {
  server = createServer((request, response) => {
    const url = new URL(request.url ?? '/', 'http://localhost')

    if (!url.pathname.startsWith(MOUNT)) {
      response.writeHead(404).end('not under the mount point')
      return
    }

    let rest = url.pathname.slice(MOUNT.length)
    if (rest === '') rest = 'index.html'

    // Contain the path to the served directory: a test fixture that can read
    // anything on the machine is a worse idea than the test is a good one.
    const file = path.join(dist, ...rest.split('/'))
    if (!file.startsWith(dist) || !existsSync(file) || !statSync(file).isFile()) {
      response.writeHead(404).end('not found')
      return
    }

    response.writeHead(200, {
      'Content-Type': TYPES[path.extname(file)] ?? 'application/octet-stream',
      // The worker is fetched again to find a new version; a cached one here
      // would make this test pass against a stale build.
      'Cache-Control': 'no-cache'
    })
    createReadStream(file).pipe(response)
  })

  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve))
  origin = `http://127.0.0.1:${(server.address() as AddressInfo).port}`
})

test.afterAll(async () => {
  await new Promise<void>(resolve => { server.close(() => { resolve() }) })
})

/** Load the app at the deploy path and wait for its worker to be in charge. */
const install = async (page: import('@playwright/test').Page) => {
  await page.route('**://*.wikipedia.org/**', route => route.abort())
  await page.addInitScript(() => {
    localStorage.setItem('is-up-to-date-v4', 'true')
    localStorage.setItem('mute-hint-seen', 'true')
  })

  await page.goto(origin + MOUNT)
  // `ready` resolves once a worker is activated, and precaching happens during
  // install - so this is also the point at which the audio is on disk.
  await page.evaluate(() => navigator.serviceWorker.ready.then(() => undefined))

  // clientsClaim takes effect for pages loaded before the worker existed; the
  // reload is what makes this deterministic rather than a race.
  await page.reload()
  await page.waitForSelector('.top-panel')
}

test.describe('the built app as a PWA', () => {
  test.skip(!existsSync(path.join(dist, 'index.html')), 'Build it first: yarn build')

  test('ships a service worker and a manifest beside index.html', async () => {
    expect(existsSync(path.join(dist, 'sw.js'))).toBe(true)
    expect(existsSync(path.join(dist, 'manifest.json'))).toBe(true)
  })

  test('links a manifest that resolves at the deploy path', async ({ page }) => {
    await page.goto(origin + MOUNT)

    const href = await page.locator('link[rel="manifest"]').getAttribute('href')
    expect(href).toBe('manifest.json')

    // Fetched through the page so it resolves the way the browser would.
    const manifest = await page.evaluate(async (url) => {
      const response = await fetch(url as string)
      return response.ok ? await response.json() : null
    }, href)

    expect(manifest).not.toBeNull()
    expect(manifest.name).toBe('Palmas')
    expect(manifest.icons.length).toBeGreaterThan(0)

    // Relative, so the same build installs from whatever folder it is put in.
    expect(manifest.start_url).toBe('./')
    expect(manifest.scope).toBe('./')
  })

  test('serves every icon the manifest promises', async ({ page }) => {
    await page.goto(origin + MOUNT)

    const missing = await page.evaluate(async () => {
      const manifest = await (await fetch('manifest.json')).json()
      const checked = await Promise.all(
        manifest.icons.map(async (icon: { src: string }) => {
          const response = await fetch(icon.src)
          return response.ok ? null : icon.src
        })
      )
      return checked.filter(Boolean)
    })

    expect(missing).toEqual([])
  })

  test('registers a worker that takes control of the page', async ({ page }) => {
    await install(page)

    const controlled = await page.evaluate(
      () => navigator.serviceWorker.controller !== null
    )
    expect(controlled).toBe(true)
  })

  test('runs with the network gone, audio included', async ({ page, context }) => {
    await install(page)

    await context.setOffline(true)
    await page.reload()

    // The app itself renders from cache.
    await page.waitForSelector('.top-panel')
    await expect(page.locator('.mute-target').first()).toBeVisible()

    // And so does a sample, which is the part that makes it a metronome rather
    // than a picture of one.
    //
    // Asked of the Cache Storage rather than by fetching. Loading the app once
    // puts every sample in the ordinary HTTP cache, and the browser will serve
    // from that while offline whether or not a service worker ever saw the
    // file - so a plain `fetch().ok` here passes with precaching switched off
    // entirely. It did. Only the named cache says what the worker actually
    // holds, and that is the thing that survives a browser clearing its own.
    const cached = await page.evaluate(async () => {
      const found: Record<string, boolean> = { flac: false, mp3: false }
      for (const name of await caches.keys()) {
        const cache = await caches.open(name)
        // Precache entries carry a __WB_REVISION__ query, so match the path.
        if (await cache.match('audio/acompas/clara/clara_1.flac', { ignoreSearch: true })) found.flac = true
        if (await cache.match('audio/acompas/clara/clara_1.mp3', { ignoreSearch: true })) found.mp3 = true
      }
      return found
    })

    // Both formats: the mp3 fallback exists for engines that cannot decode
    // flac, and it has to be present precisely when there is no network to go
    // and fetch it from.
    expect(cached).toEqual({ flac: true, mp3: true })
  })
})
