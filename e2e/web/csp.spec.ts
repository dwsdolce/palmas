import { test, expect, type Page } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'

/**
 * The Content-Security-Policy in index.html.
 *
 * A CSP fails silently by design: the browser drops the offending request,
 * logs to a console nobody is watching, and the app carries on looking fine
 * with no sound, or no header image, or no help text. Nothing in the unit
 * suite can see that — it needs a real renderer enforcing a real policy.
 *
 * So this listens for securitypolicyviolation itself rather than waiting for
 * a violation to happen to break some other assertion. That caught the first
 * break outright: vue-i18n's default message compiler builds every translation
 * with `Function("return ...")`, so the policy blanked the entire app until
 * the build switched to the JIT compiler.
 *
 * It did not catch the second one. Tone.js loads its AudioWorklet from a blob
 * URL, and the refusal surfaced only in Android's WebView log — here it left
 * no violation event, just a failed support probe. So these assertions are a
 * floor, not a guarantee: a policy change still has to be run on the desktop
 * and Android builds, which share this index.html.
 */

const built = path.resolve(process.cwd(), 'dist/pwa/index.html')

type Violation = { directive: string, blocked: string }

declare global {
  interface Window { __cspViolations: Violation[] }
}

test.describe('the content security policy', () => {
  test.skip(!existsSync(built), 'Build it first: quasar build')

  // A policy that is not there cannot be violated, and every assertion below
  // would pass on a build that lost the meta tag. Check it exists first.
  test('is actually served', () => {
    const html = readFileSync(built, 'utf8')
    expect(html, 'the CSP meta tag is missing from the production build')
      .toContain('Content-Security-Policy')
  })

  /** Land on a pattern, with the violation collector installed first. */
  const open = async (page: Page, locale?: string) => {
    await page.addInitScript((chosen) => {
      window.__cspViolations = []
      // Registered before any app code runs, so a violation raised while the
      // bundle is still parsing is caught too.
      document.addEventListener('securitypolicyviolation', (event) => {
        // This lib's event map does not carry securitypolicyviolation, so the
        // parameter widens to Event.
        const e = event as SecurityPolicyViolationEvent
        window.__cspViolations.push({
          directive: e.effectiveDirective || e.violatedDirective,
          blocked: e.blockedURI
        })
      })
      // useStorage keeps plain strings for string refs — no JSON quoting.
      localStorage.setItem('selected-context-name', 'flamenco')
      localStorage.setItem('selected-pattern-name', 'abandolaos')
      localStorage.setItem('is-up-to-date-v4', 'true')
      if (chosen) localStorage.setItem('palmas-locale', chosen)
    }, locale)

    await page.goto('/#/flamenco/abandolaos')
    await expect(page.locator('#playBtn')).toBeVisible()

    // Nothing should open a dialog here, and that is worth asserting. While
    // the policy was blocking Tone's worklet, the support probe failed and the
    // app covered itself with "Update your browser!" — which is how the break
    // first showed itself, as help.spec.ts timing out on a click it could not
    // land. Keep that a failure rather than something to dismiss and move past.
    await expect(page.locator('.q-dialog')).toHaveCount(0)

    // Sample loading puts a Quasar overlay over the page.
    await expect(page.locator('#q-loading')).toHaveCount(0)
  }

  const violations = (page: Page) => page.evaluate(() => window.__cspViolations)

  /** Fails with the directive and the URL, not just a count. */
  const expectNoViolations = async (page: Page, during: string) => {
    const found = await violations(page)
    const detail = found.map(v => `${v.directive} blocked ${v.blocked}`).join('\n  ')
    expect(found, `the policy blocked something ${during}:\n  ${detail}`).toEqual([])
  }

  test('lets the app load its own bundle, styles and images', async ({ page }) => {
    await open(page)

    // The header images resolve through BASE_URL, which is the part most
    // likely to fall outside 'self' on a subfolder deployment.
    await expect(page.locator('img').first()).toBeVisible()
    await expectNoViolations(page, 'while loading the page')
  })

  test('lets the metronome start', async ({ page }) => {
    await open(page)
    await page.locator('#playBtn').click()

    // Tone.js resumes the AudioContext, fetches the samples and may create an
    // audio worklet. media-src, worker-src and script-src all get exercised
    // here, and a block on any of them means an app that never makes a sound.
    await page.waitForTimeout(3000)
    await expectNoViolations(page, 'while starting the metronome')
  })

  test('lets the pattern help reach Wikipedia', async ({ page }) => {
    await open(page)
    await page.locator('#patternHelpBtn').click()
    await page.waitForSelector('.q-dialog__inner')

    // "{count} beats" is the only interpolated message in the catalogs, and
    // this dialog is where it renders. It is the check on the JIT message
    // compiler the policy forced us onto: were it compiling wrongly, the
    // placeholder would survive into the text instead of becoming a number.
    await expect(page.locator('.q-dialog__inner h6').first()).toHaveText(/^\d+ beats$/)

    // The fetch may fail for want of a network; that is not what is under
    // test. What matters is that the policy did not refuse to send it.
    await page.waitForTimeout(4000)
    await expectNoViolations(page, 'while opening the pattern help')
  })

  test('lets a locale chunk load', async ({ page }) => {
    // Locales are lazy imports. A policy that blocked one would leave the app
    // sitting in English with nothing on screen to say why.
    await open(page, 'es-ES')

    // Quasar's Lang plugin writes the language pack's ISO name onto <html>,
    // so this is only 'es' once the chunk has actually arrived and applied.
    await expect(page.locator('html')).toHaveAttribute('lang', /^es/)
    await expectNoViolations(page, 'while loading a locale chunk')
  })
})
