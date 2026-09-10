import { test, expect, type Page } from '@playwright/test'
import { existsSync } from 'node:fs'
import path from 'node:path'

/**
 * Muting, as a player meets it.
 *
 * The unit tests cover the store and prove no audio is scheduled. What they
 * cannot show is the part a teacher actually uses: that tapping a dot marks it,
 * that the count appears, and that there is a way back. All of it is in the
 * rendered page or it does not exist.
 */

const built = path.resolve(process.cwd(), 'dist/pwa/index.html')

/** Soleá, nothing muted, first-run dialogs dealt with, hint already seen. */
const open = async (page: Page) => {
  await page.route('**://*.wikipedia.org/**', route => route.abort())
  await page.addInitScript(() => {
    localStorage.setItem('is-up-to-date-v4', 'true')
    localStorage.setItem('selected-context-name', 'flamenco')
    localStorage.setItem('selected-pattern-name', 'solea')
    // The hint is its own set of tests below. Here it would only get in the way.
    localStorage.setItem('mute-hint-seen', 'true')
  })
  await page.goto('/#/flamenco/solea')
  await page.waitForSelector('.mute-target')
}

const chip = (page: Page) => page.locator('.mute-count')
const hint = (page: Page) => page.locator('.mute-hint')
const slashed = (page: Page) => page.locator('.mute-target [class*="dot-"] span')

const openOptions = async (page: Page) => {
  await page.locator('.mdi-tune-vertical-variant').click()
  await page.waitForSelector('#optDialog .muted-beats')
  return page.locator('#optDialog .muted-beats')
}

test.describe('muting a beat', () => {
  test.skip(!existsSync(built), 'Build it first: quasar build')

  test('offers a tap target for every visible slot, and no more', async ({ page }) => {
    await open(page)
    // Soleá is 24 slots counted as 12 beats. With the drawn instrument not
    // playing eighth notes, the odd slots are hidden - and hidden slots keep
    // their place in the layout, so they would still be under the pointer if
    // they were not excluded.
    await expect(page.locator('.mute-target')).toHaveCount(12)
  })

  test('marks the beat, and says how many are silenced', async ({ page }) => {
    await open(page)
    await expect(chip(page)).toHaveCount(0)

    await page.locator('.mute-target').nth(2).click()

    await expect(slashed(page)).toHaveCount(1)
    await expect(chip(page)).toContainText('1')

    await page.locator('.mute-target').nth(5).click()
    await expect(slashed(page)).toHaveCount(2)
    await expect(chip(page)).toContainText('2')
  })

  test('restores the beat when it is tapped again', async ({ page }) => {
    await open(page)
    const target = page.locator('.mute-target').nth(2)

    await target.click()
    await expect(slashed(page)).toHaveCount(1)

    await target.click()
    await expect(slashed(page)).toHaveCount(0)
    // The count goes with it: nothing muted, nothing said.
    await expect(chip(page)).toHaveCount(0)
  })

  test('clears every mute from the chip', async ({ page }) => {
    await open(page)
    for (const n of [2, 5, 9]) await page.locator('.mute-target').nth(n).click()
    await expect(slashed(page)).toHaveCount(3)

    await chip(page).locator('.q-chip__icon--remove').click()

    await expect(slashed(page)).toHaveCount(0)
    await expect(chip(page)).toHaveCount(0)
  })

  test('keeps the mutes across a reload, and per pattern', async ({ page }) => {
    await open(page)
    await page.locator('.mute-target').nth(2).click()
    await expect(chip(page)).toContainText('1')

    await page.reload()
    await page.waitForSelector('.mute-target')
    await expect(slashed(page)).toHaveCount(1)

    // Another pattern is untouched by it.
    await page.goto('/#/flamenco/buleria-12')
    await page.waitForSelector('.mute-target')
    await expect(chip(page)).toHaveCount(0)
  })

  /**
   * Bossa Nova draws accented slots that carry no numeral, so those columns
   * hold less than the labelled ones beside them. Every column is stretched to
   * the row's height, and `dotStyle`'s marginTop is what puts the dots on one
   * centre line - which only works from a flex-start baseline. Giving the tap
   * target a `justify-content` centred the short columns' contents and dropped
   * those dots below the line, which no other test could see.
   */
  test('the tap target leaves every dot on one centre line', async ({ page }) => {
    await open(page)
    await page.goto('/#/afro-brazilian/bossa-nova')

    // Soleá's dots are already on screen, so waiting for `.mute-target` proves
    // nothing - it is satisfied before the route has changed anything. Wait for
    // a count only Bossa Nova can produce.
    const dots = page.locator('.top-panel span[class*="dot-"]:not(.invisible)')
    await expect.poll(() => dots.count()).toBeGreaterThan(12)

    // One line per row, not one line for the compás: on a phone it wraps, and
    // two rows are rightly two lines. Which row a dot is on is read from the
    // grid cell holding it, never from the dot - the dot's own centre is what
    // is being tested, so grouping by it would pass whatever it did.
    const spreads = await page.evaluate(() => {
      const byRow = new Map<number, number[]>()
      for (const dot of document.querySelectorAll('.top-panel span[class*="dot-"]:not(.invisible)')) {
        const row = Math.round(dot.closest('.column')!.getBoundingClientRect().top)
        const box = dot.getBoundingClientRect()
        byRow.set(row, [...(byRow.get(row) ?? []), box.top + box.height / 2])
      }
      return [...byRow.values()].map(centres => Math.max(...centres) - Math.min(...centres))
    })

    expect(spreads.length).toBeGreaterThan(0)
    for (const spread of spreads) expect(spread).toBeLessThan(2)
  })

  test('can be operated from the keyboard', async ({ page }) => {
    await open(page)
    const target = page.locator('.mute-target').nth(2)

    await target.focus()
    await expect(target).toHaveAttribute('aria-pressed', 'false')

    await page.keyboard.press('Enter')
    await expect(target).toHaveAttribute('aria-pressed', 'true')
    await expect(slashed(page)).toHaveCount(1)
  })
})

/**
 * The two ways a player finds out muting is there at all.
 *
 * Nothing on a dot says it can be tapped, so without these the feature is
 * reachable only by someone who has already been told about it. That makes
 * their absence a silent failure rather than a broken one, which is exactly the
 * kind a test has to catch.
 */
test.describe('finding out that muting exists', () => {
  test.skip(!existsSync(built), 'Build it first: quasar build')

  /** As above, but a first-time user: the hint has not been seen. */
  const openFresh = async (page: Page, mode = 'dots') => {
    await page.route('**://*.wikipedia.org/**', route => route.abort())
    await page.addInitScript(([view]) => {
      localStorage.setItem('is-up-to-date-v4', 'true')
      localStorage.setItem('selected-context-name', 'flamenco')
      localStorage.setItem('selected-pattern-name', 'solea')
      localStorage.setItem('visualization-mode', view as string)
    }, [mode])
    await page.goto('/#/flamenco/solea')
    await page.waitForSelector('.top-panel')
  }

  test('the hint is there on a first visit', async ({ page }) => {
    await openFresh(page)
    await expect(hint(page)).toBeVisible()
  })

  test('dismissing the hint is remembered', async ({ page }) => {
    await openFresh(page)
    await hint(page).locator('.q-chip__icon--remove').click()
    await expect(hint(page)).toHaveCount(0)

    await page.reload()
    await page.waitForSelector('.mute-target')
    await expect(hint(page)).toHaveCount(0)
  })

  test('silencing a beat retires the hint for good', async ({ page }) => {
    await openFresh(page)
    await expect(hint(page)).toBeVisible()

    await page.locator('.mute-target').nth(2).click()
    await expect(hint(page)).toHaveCount(0)

    // Even once the beat is restored: the point was made.
    await page.locator('.mute-target').nth(2).click()
    await expect(slashed(page)).toHaveCount(0)
    await expect(hint(page)).toHaveCount(0)
  })

  test('the hint stays away from the views that cannot be tapped', async ({ page }) => {
    await openFresh(page, 'counter')
    await expect(page.locator('.top-panel')).toBeVisible()
    await expect(hint(page)).toHaveCount(0)
  })

  test('Rhythm Options says how many are silenced, and clears them', async ({ page }) => {
    await open(page)
    for (const n of [2, 5]) await page.locator('.mute-target').nth(n).click()

    const row = await openOptions(page)
    await expect(row.locator('.muted-count')).toHaveText('2')

    await row.locator('.clear-mutes').click()
    await expect(row.locator('.muted-count')).not.toHaveText('2')

    await page.keyboard.press('Escape')
    await expect(slashed(page)).toHaveCount(0)
    await expect(chip(page)).toHaveCount(0)
  })

  /**
   * It was last in the dialog to begin with, which put it off the bottom of a
   * phone screen - a route to the feature that you had to scroll to find is not
   * a route to the feature.
   */
  test('the Rhythm Options row comes before the settings, not after', async ({ page }) => {
    await open(page)
    const row = await openOptions(page)
    const firstToggle = page.locator('#optDialog .q-toggle').first()

    // Quasar scales the dialog in, so a single measurement can land mid
    // animation. Poll until both agree.
    await expect.poll(async () => {
      const above = await row.boundingBox()
      const below = await firstToggle.boundingBox()
      return above && below ? above.y < below.y : null
    }).toBe(true)
  })

  test('Rhythm Options offers nothing to clear when nothing is silenced', async ({ page }) => {
    await open(page)
    const row = await openOptions(page)

    await expect(row.locator('.muted-count')).not.toHaveText('0')
    await expect(row.locator('.clear-mutes')).toBeDisabled()
  })
})
