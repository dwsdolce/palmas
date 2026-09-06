import { test, expect, type Page } from '@playwright/test'
import { existsSync } from 'node:fs'
import path from 'node:path'

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

const built = path.resolve(process.cwd(), 'dist/spa/index.html')

const openChangelog = async (page: Page, locale: string, marker: string) => {
  await page.addInitScript(([code]) => {
    localStorage.setItem('is-up-to-date-v4', 'true')
    localStorage.setItem('palmas-locale', code as string)
  }, [locale])

  await page.goto('/#/changelog')

  // Wait on the bullet count rather than on any text: it is the same in every
  // language, and it is zero in the failure this guards against — `tm()`
  // returning nothing renders a release with no notes at all, not an error.
  await expect(page.locator('.q-item i.mdi-circle')).toHaveCount(14)

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
    expect(text).toContain('868')
    expect(text).toContain('Palmas is a new app')
    expect(text).toContain('Python is no longer needed to build')

    // Fourteen notes, not an empty list dressed up as a release.
    const bullets = page.locator('.q-item i.mdi-circle')
    await expect(bullets).toHaveCount(14)
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
        await expect(page.locator('.q-item i.mdi-circle')).toHaveCount(14)
      })
    }
  })
})
