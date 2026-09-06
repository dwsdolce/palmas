import { test, expect, type Page } from '@playwright/test'
import { existsSync } from 'node:fs'
import path from 'node:path'

/**
 * The "?" beside a control.
 *
 * These captions used to be hover tooltips, which on iOS showed for exactly as
 * long as the finger was down and then vanished. They now open on click, on
 * every platform, and on no other gesture — so the same specs run under both
 * input models, and a difference between them is a failure.
 *
 * Nothing in the unit suite can cover this: it is a pointer and touch
 * interaction against a real renderer.
 */

const built = path.resolve(process.cwd(), 'dist/pwa/index.html')

test.describe('the help buttons', () => {
  test.skip(!existsSync(built), 'Build it first: quasar build')

  /** Land on a pattern with the first-run dialogs already dealt with. */
  const open = async (page: Page) => {
    await page.addInitScript(() => {
      // useStorage keeps plain strings for string refs — no JSON quoting.
      localStorage.setItem('selected-context-name', 'flamenco')
      localStorage.setItem('selected-pattern-name', 'abandolaos')
      // Otherwise the update dialog sits in front of everything, and
      // dismissing it reloads the page.
      localStorage.setItem('is-up-to-date-v4', 'true')
    })
    await page.goto('/#/flamenco/abandolaos')
    await page.getByRole('button', { name: 'Rhythm options' }).first().click()
    await page.waitForSelector('.q-dialog__inner')

    // Quasar animates the dialog in with a scale transform, and boundingBox()
    // does not wait for animations: measured mid-flight, a 44px button reports
    // about 10px. Settle before touching anything.
    await page.waitForFunction(() => {
      const dialog = document.querySelector('.q-dialog__inner')
      if (!dialog) return false
      const transform = getComputedStyle(dialog).transform
      return transform === 'none' || transform === 'matrix(1, 0, 0, 1, 0, 0)'
    })

    return page.locator('.q-dialog__inner button:has(i.mdi-help-circle)').first()
  }

  const captionShown = (page: Page) => page.locator('.help-menu').isVisible()

  test('opens on a click and stays open', async ({ page }) => {
    const help = await open(page)

    await help.click()
    await expect(page.locator('.help-menu')).toBeVisible()

    // The caption used to be dismissed the instant the finger lifted.
    await page.waitForTimeout(1500)
    expect(await captionShown(page), 'the caption did not stay open').toBe(true)
  })

  test('closes on a second click', async ({ page }) => {
    const help = await open(page)
    await help.click()
    await expect(page.locator('.help-menu')).toBeVisible()

    await help.click()
    await expect(page.locator('.help-menu')).toBeHidden()
  })

  test('closes on Escape and hands focus back', async ({ page }) => {
    const help = await open(page)
    await help.click()
    await expect(page.locator('.help-menu')).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(page.locator('.help-menu')).toBeHidden()
    await expect(help).toBeFocused()
  })

  test('does nothing on hover', async ({ page }) => {
    const help = await open(page)

    await help.hover()
    await page.waitForTimeout(600)
    // Hover was the whole problem: it is unreachable with a finger, and a "?"
    // is documented as a click target on both Apple platforms.
    expect(await captionShown(page), 'hovering opened the caption').toBe(false)
  })

  test('opens from the keyboard', async ({ page }) => {
    const help = await open(page)

    await help.focus()
    await page.keyboard.press('Enter')
    await expect(page.locator('.help-menu')).toBeVisible()
  })

  test('presents a target big enough to hit', async ({ page }) => {
    const help = await open(page)

    // 44px is what Apple asks for and what WCAG 2.5.5 asks for. These rendered
    // at 17px until QBtn's padding="none" was removed — it writes min-width and
    // min-height of 0 inline, which no stylesheet rule can outrank.
    //
    // Polled rather than measured once: boundingBox() does not wait for
    // animations, and on a loaded machine a single reading can land while the
    // dialog is still scaling in, reporting a fraction of the real size.
    await expect.poll(async () => {
      const box = await help.boundingBox()
      return Math.min(box?.width ?? 0, box?.height ?? 0)
    }).toBeGreaterThanOrEqual(44)
  })

  test('describes itself to a screen reader', async ({ page }) => {
    const help = await open(page)

    await expect(help).toHaveAttribute('aria-label', 'Help')
    await expect(help).toHaveAttribute('aria-expanded', 'false')

    await help.click()
    await expect(help).toHaveAttribute('aria-expanded', 'true')
    // The caption itself is what the button points at, not its name.
    const describedBy = await help.getAttribute('aria-describedby')
    expect(describedBy).toBeTruthy()
    await expect(page.locator(`#${describedBy}`)).toBeVisible()
  })
})
