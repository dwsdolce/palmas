import { test, expect, type Page } from '@playwright/test'
import { existsSync } from 'node:fs'
import path from 'node:path'

/**
 * Right-to-left layout.
 *
 * Quasar's layout JS honours the language's direction and pads the page
 * container on the side the drawer should occupy; its stylesheet, compiled in
 * one direction only, kept the drawer anchored at `left: 0` regardless. The two
 * disagreed: the gap opened on one side of the page and the drawer covered the
 * content on the other. Nothing in the unit suite can see that — it is entirely
 * a matter of computed geometry in a laid-out browser.
 */

const built = path.resolve(process.cwd(), 'dist/pwa/index.html')

// Wide enough that the drawer pushes the content instead of floating over it,
// which is the arrangement where the two sides can disagree.
const WIDTH = 1600
const DRAWER = 300

const load = async (page: Page, locale: string) => {
  await page.setViewportSize({ width: WIDTH, height: 900 })
  await page.addInitScript(([code]) => {
    localStorage.setItem('is-up-to-date-v4', 'true')
    localStorage.setItem('palmas-locale', code as string)
    localStorage.setItem('selected-context-name', 'flamenco')
    localStorage.setItem('selected-pattern-name', 'solea')
  }, [locale])
  await page.goto('/#/flamenco/solea')
  await expect(page.locator('.q-drawer')).toBeVisible()

  return page.evaluate(() => {
    const box = (sel: string) => {
      const el = document.querySelector(sel)
      if (el === null) return null
      const r = el.getBoundingClientRect()
      return { left: Math.round(r.left), right: Math.round(r.right) }
    }
    const container = document.querySelector('.q-page-container') as HTMLElement
    const panel = document.querySelector('.top-panel')
    return {
      htmlDir: document.documentElement.getAttribute('dir'),
      bodyDirection: getComputedStyle(document.body).direction,
      panelDirection: panel === null ? null : getComputedStyle(panel).direction,
      drawer: box('.q-drawer'),
      padLeft: getComputedStyle(container).paddingLeft,
      padRight: getComputedStyle(container).paddingRight
    }
  })
}

test.describe('right-to-left layout', () => {
  test.skip(!existsSync(built), 'Build it first: quasar build')

  for (const locale of ['ar', 'fa']) {
    test(`${locale} puts the drawer and the space for it on the same side`, async ({ page }) => {
      const l = await load(page, locale)

      expect(l.htmlDir).toBe('rtl')
      // The dir attribute alone is not enough: Quasar's stylesheet sets
      // `direction: ltr` on html, body and #q-app, and an author rule outranks
      // the attribute. Left unchecked, Arabic lays out with an LTR base
      // direction and sentence-final punctuation jumps to the far left.
      expect(l.bodyDirection).toBe('rtl')

      // Drawer against the right edge...
      expect(l.drawer?.right).toBe(WIDTH)
      expect(l.drawer?.left).toBe(WIDTH - DRAWER)
      // ...and the room made for it on that same side.
      expect(l.padRight).toBe(`${DRAWER}px`)
      expect(l.padLeft).toBe('0px')
    })
  }

  test('en-US is the mirror of that', async ({ page }) => {
    const l = await load(page, 'en-US')

    expect(l.htmlDir).toBe('ltr')
    expect(l.bodyDirection).toBe('ltr')
    expect(l.drawer?.left).toBe(0)
    expect(l.drawer?.right).toBe(DRAWER)
    expect(l.padLeft).toBe(`${DRAWER}px`)
    expect(l.padRight).toBe('0px')
  })

  test('the compás still runs 1 to 12 left to right in Arabic', async ({ page }) => {
    // Text mirrors; a rhythm does not. The clock face cannot mirror — its
    // numerals run clockwise from a fixed 12 — so a mirrored row of dots would
    // have the two views disagreeing about which way time runs.
    const l = await load(page, 'ar')
    expect(l.panelDirection).toBe('ltr')

    const labels = await page.locator('.top-panel .column span').filter({ hasText: /^\d+$/ })
      .allInnerTexts()
    expect(labels.slice(0, 3)).toEqual(['1', '2', '3'])
    expect(labels[labels.length - 1]).toBe('12')
  })
})
