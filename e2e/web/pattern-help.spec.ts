import { test, expect, type Page } from '@playwright/test'
import { existsSync } from 'node:fs'
import path from 'node:path'

/**
 * The palo description in the pattern help dialog.
 *
 * This text used to come from Wikipedia when the reader's language had an
 * article and there was a network, and from a hard-coded English string
 * otherwise — so four locales never saw anything but English, and neither did
 * anyone offline. It is translated text now, and the point of that change is
 * that it is what actually renders. Nothing in the unit suite can say so: the
 * catalogues can hold every key and the dialog still show none of it.
 *
 * Wikipedia is refused in every test here rather than the whole network being
 * cut, because the page itself is served over HTTP: going properly offline
 * would stop the app loading at all and prove nothing.
 */

const built = path.resolve(process.cwd(), 'dist/pwa/index.html')

/** Open the help dialog for one palo, in one language, with Wikipedia refused. */
const openPatternHelp = async (page: Page, locale: string) => {
  await page.route('**://*.wikipedia.org/**', route => route.abort())

  await page.addInitScript(([code]) => {
    // useStorage keeps plain strings for string refs — no JSON quoting.
    localStorage.setItem('selected-context-name', 'flamenco')
    localStorage.setItem('selected-pattern-name', 'solea')
    localStorage.setItem('is-up-to-date-v4', 'true')
    localStorage.setItem('palmas-locale', code as string)
  }, [locale])

  await page.goto('/#/flamenco/solea')
  await page.locator('#patternHelpBtn').click()
  await page.waitForSelector('#patternHelpDialog .q-dialog__inner')

  // Wait for the description itself. The locale is a lazy import, so reading
  // straight away would pass on English in every language.
  const body = page.locator('#patternHelpDialog .q-dialog__inner')
  await expect(body.locator('p').first()).not.toBeEmpty()
  return (await body.innerText()).trim()
}

test.describe('the palo description', () => {
  test.skip(!existsSync(built), 'Build it first: quasar build')

  test('renders with Wikipedia unreachable', async ({ page }) => {
    // The case the old arrangement handled worst: the fetch failed and every
    // reader, in every language, fell back to the English string.
    const text = await openPatternHelp(page, 'en-US')
    expect(text).toContain('Soleá is a sad 12 beats-based palo')
    expect(text).toContain('Sevilla, Cádiz and others')
  })

  test.describe('is translated', () => {
    // One per script. es-ES had a Wikipedia article and so rarely showed the
    // app's own text; ja-JP and ar were never mapped to a Wikipedia at all.
    const cases = [
      { locale: 'es-ES', fragment: 'La soleá es un palo triste' },
      { locale: 'fr-FR', fragment: 'La soleá est un palo triste' },
      { locale: 'ja-JP', fragment: '哀感のある12拍系の palo' },
      { locale: 'ar', fragment: 'palo حزين' }
    ]

    for (const { locale, fragment } of cases) {
      test(locale, async ({ page }) => {
        const text = await openPatternHelp(page, locale)
        expect(text).toContain(fragment)
        // And the English is not what actually rendered.
        expect(text).not.toContain('Soleá is a sad 12 beats-based palo')
      })
    }
  })
})
