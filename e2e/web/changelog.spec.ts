import { test, expect, type Page } from '@playwright/test'
import { existsSync } from 'node:fs'
import path from 'node:path'
import enUS from '../../src/i18n/en-US/index'

/**
 * The release notes on the changelog page.
 *
 * The notes moved from the data file into the message catalogues so they could
 * be translated. The page reads them with `tm()`, which returns an array and
 * resolves against the current locale with no per-key fallback — so a locale
 * that had not loaded, or a key path that did not resolve, would render a
 * release with an empty bullet list rather than fail. Only a real browser can
 * say which of those happened.
 */

const built = path.resolve(process.cwd(), 'dist/pwa/index.html')

/**
 * How many notes every release together has, counted from the English
 * catalogue rather than typed here. A typed count broke the first time a
 * release was added: 1.0.1's entry made fourteen notes fifteen, and CI failed
 * on a test of the page rather than on anything wrong with it.
 */
const NOTE_COUNT = Object.values(enUS.doc.changelog.releases)
  .reduce((total, notes) => total + notes.length, 0)

/** The build number a release's entry shows beside its version, as "(931)". */
const buildShownFor = (page: Page, version: string) =>
  page.locator('.row', { has: page.locator('.q-chip', { hasText: version }) })
    .locator('.text-caption.q-ml-sm')

const openChangelog = async (page: Page, locale: string, marker: string) => {
  await page.addInitScript(([code]) => {
    localStorage.setItem('palmas-locale', code as string)
  }, [locale])

  await page.goto('/#/changelog')

  // Wait on the bullet count rather than on any text: it is the same in every
  // language, and it is zero in the failure this guards against — `tm()`
  // returning nothing renders a release with no notes at all, not an error.
  await expect(page.locator('.q-item i.mdi-circle')).toHaveCount(NOTE_COUNT)

  // The locale is a lazy import. Settle before reading, or this passes on
  // English in every language.
  await expect(page.locator('.q-page')).toContainText(marker)
  return (await page.locator('.q-page').innerText()).trim()
}

test.describe('the changelog', () => {
  test.skip(!existsSync(built), 'Build it first: quasar build')

  test('shows the version, build and every note', async ({ page }) => {
    const text = await openChangelog(page, 'en-US', 'Palmas is a new app')
    expect(text).toContain('1.0.0')
    expect(text).toContain('Palmas is a new app')
    expect(text).toContain('Python is no longer needed to build')

    // Every note, not an empty list dressed up as a release.
    const bullets = page.locator('.q-item i.mdi-circle')
    await expect(bullets).toHaveCount(NOTE_COUNT)
  })

  /**
   * A shipped release shows the build it went out as, frozen when the next
   * release began; the newest shows the build being run, the same number the
   * header carries. 1.0.0's was once typed by hand as 868 while the header of
   * the same app said 931, and nothing noticed.
   */
  test('shows each release with the build it is, matching the header for the newest', async ({ page }) => {
    await openChangelog(page, 'en-US', 'Palmas is a new app')

    await expect(buildShownFor(page, '1.0.0')).toHaveText('(931)')

    // The header reads "v1.0.1 (935)": version, then the build being run.
    const header = page.getByText(/^v\d+\.\d+\.\d+ \(\d+\)$/)
    const [, version, build] = /^v(\S+) \((\d+)\)$/.exec((await header.innerText()).trim())!
    await expect(buildShownFor(page, version!)).toHaveText(`(${build})`)
  })

  test.describe('is translated', () => {
    const cases = [
      { locale: 'es-ES', fragment: 'Palmas es una aplicación nueva' },
      { locale: 'de', fragment: 'Palmas ist eine neue App' },
      { locale: 'zh-CN', fragment: 'Palmas 是一个新应用' },
      { locale: 'fa', fragment: 'یک برنامهٔ تازه است' }
    ]

    for (const { locale, fragment } of cases) {
      test(locale, async ({ page }) => {
        const text = await openChangelog(page, locale, fragment)
        expect(text).toContain(fragment)
        expect(text).not.toContain('Palmas is a new app')
        await expect(page.locator('.q-item i.mdi-circle')).toHaveCount(NOTE_COUNT)
      })
    }
  })
})
