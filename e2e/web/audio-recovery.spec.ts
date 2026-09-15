import { test, expect, type Page } from '@playwright/test'
import { existsSync } from 'node:fs'
import path from 'node:path'

/**
 * Recovering from an audio context whose clock has died, in a real engine.
 *
 * On a Lenovo tablet (Android 15, WebView 131), leaving the app while it
 * played made Chromium stop and then close its audio output about twenty
 * seconds later, and never open it again. The context went on reporting
 * "running" over a clock that no longer moved: Play went to Stop, nothing
 * sounded, the compás stood still, and only restarting the app helped.
 *
 * The unit tests prove the logic against a mocked Tone.js. This proves the part
 * a mock cannot: that replacing the context for real - Tone.setContext, the
 * samples decoded again onto the new one, the transport and Draw that belong to
 * it - leaves an app whose beat actually moves. The dead clock is produced the
 * way the tablet produced it: state "running", currentTime frozen.
 */

const built = path.resolve(process.cwd(), 'dist/pwa/index.html')

const open = async (page: Page) => {
  await page.route('**://*.wikipedia.org/**', route => route.abort())
  await page.addInitScript(() => {
    localStorage.setItem('is-up-to-date-v4', 'true')
    localStorage.setItem('mute-hint-seen', 'true')
    localStorage.setItem('selected-context-name', 'flamenco')
    localStorage.setItem('selected-pattern-name', 'solea')
    // The counter view prints the beat, which is the plainest sign that the
    // audio clock is driving the page.
    localStorage.setItem('visualization-mode', 'counter')

    const w = window as unknown as {
      __contexts: AudioContext[]
      __freezeRunningClocks: () => number
    }
    w.__contexts = []
    const Native = window.AudioContext
    window.AudioContext = class extends Native {
      constructor (...args: ConstructorParameters<typeof AudioContext>) {
        super(...args)
        w.__contexts.push(this)
      }
    }
    // Stop the clock of every context that is currently running, while leaving
    // its state alone - which is what the tablet did.
    w.__freezeRunningClocks = () => {
      let frozen = 0
      for (const ctx of w.__contexts) {
        if (ctx.state !== 'running') continue
        const at = ctx.currentTime
        Object.defineProperty(ctx, 'currentTime', { configurable: true, get: () => at })
        frozen++
      }
      return frozen
    }
  })
  await page.goto('/#/flamenco/solea')
  await page.waitForSelector('#playBtn')
}

const contexts = (page: Page) => page.evaluate(() =>
  (window as unknown as { __contexts: AudioContext[] }).__contexts.length)

/** The beat labels the counter shows over a couple of seconds. */
const beatsShown = async (page: Page) => {
  const seen = new Set<string>()
  for (let i = 0; i < 12; i++) {
    const text = (await page.locator('#Counter').innerText()).trim()
    if (text) seen.add(text)
    await page.waitForTimeout(200)
  }
  return seen
}

test.describe('an audio context whose clock has died', () => {
  test.skip(!existsSync(built), 'Build it first: yarn build')

  test('plays normally when nothing is wrong', async ({ page }) => {
    await open(page)
    await page.click('#playBtn')

    // More than one label means the counter is moving with the beat.
    await expect.poll(async () => (await beatsShown(page)).size, { timeout: 15_000 })
      .toBeGreaterThan(1)
  })

  test('is replaced when play is pressed, and the beat moves again', async ({ page }) => {
    await open(page)

    // Play and stop first, as on the tablet: before the first press the
    // browser holds the context suspended, and the clock that died there had
    // been running.
    await page.click('#playBtn')
    await expect.poll(async () => (await beatsShown(page)).size, { timeout: 15_000 })
      .toBeGreaterThan(1)
    await page.click('#playBtn')
    await expect(page.locator('#playBtn .mdi-play')).toBeVisible()
    const before = await contexts(page)

    const frozen = await page.evaluate(() =>
      (window as unknown as { __freezeRunningClocks: () => number }).__freezeRunningClocks())
    expect(frozen).toBeGreaterThan(0)

    await page.click('#playBtn')

    // A new context was made to take over from the frozen one...
    await expect.poll(() => contexts(page), { timeout: 15_000 }).toBeGreaterThan(before)
    // ...and the beat moves on it, which only happens if the transport, the
    // samples and Draw all came across.
    await expect.poll(async () => (await beatsShown(page)).size, { timeout: 15_000 })
      .toBeGreaterThan(1)
    // Not a failure dressed up as a recovery.
    await expect(page.locator('.q-notification')).toHaveCount(0)
    await expect(page.locator('#playBtn .mdi-stop')).toBeVisible()
  })
})
