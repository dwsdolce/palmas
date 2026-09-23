import { test, expect, type Page } from '@playwright/test'
import { existsSync } from 'node:fs'
import path from 'node:path'

/**
 * What a new user meets, and what an old one keeps.
 *
 * Palmas used to open on a dialog headed "App initialization", telling everyone
 * their settings had to be re-initialized and offering one button: Reload app.
 * It appeared on every fresh install, because it was shown whenever a flag was
 * missing from storage. App Review saw it and rejected the app, reporting that
 * it "loaded with error requires reload upon launch".
 *
 * It is gone, and nothing replaced it: settings now hold only what the user
 * chose, and anything older is migrated on the way in. Both halves are tested
 * here, in the browser, because both are about what happens on launch.
 */

const built = path.resolve(process.cwd(), 'dist/pwa/index.html')

const noWikipedia = (page: Page) =>
  page.route('**://*.wikipedia.org/**', route => route.abort())

test.describe('the first launch', () => {
  test.skip(!existsSync(built), 'Build it first: quasar build')

  test('opens straight into the metronome, with nothing to dismiss', async ({ page }) => {
    await noWikipedia(page)
    await page.goto('/')

    // The compás is drawn and the play button is there: the app is usable
    // without anything being dismissed first.
    await page.waitForSelector('.mute-target')
    await expect(page.locator('#playBtn')).toBeVisible()

    // No dialog of any kind, and in particular no persistent one over the app.
    await expect(page.locator('.q-dialog')).toHaveCount(0)
    await expect(page.getByText('Reload app')).toHaveCount(0)
  })

  test('writes no choices until one is made', async ({ page }) => {
    await noWikipedia(page)
    await page.goto('/')
    await page.waitForSelector('.mute-target')

    const stored = await page.evaluate(() => ({
      version: localStorage.getItem('settings-version'),
      choices: localStorage.getItem('pattern-choices')
    }))

    expect(stored.version).toBe('1')
    expect(stored.choices).toBeNull()

    // Silence a beat, and only then is there something to store.
    await page.locator('.mute-target').nth(2).click()
    await expect.poll(() => page.evaluate(() => localStorage.getItem('pattern-choices')))
      .toContain('mutedSlots')
  })
})

test.describe('settings written by an older version', () => {
  test.skip(!existsSync(built), 'Build it first: quasar build')

  /** A record in the shape the app wrote before settings held choices only. */
  const legacy = [{
    name: 'solea',
    label: 'Soleá',
    context: 'flamenco',
    tempo: 96,
    swing: 0,
    globalDecay: 0.5,
    improvisation: false,
    humanization: false,
    prestartBeat: { value: 0, label: 'Off' },
    mutedSlots: [4],
    instruments: [
      { label: 'Palmas claras', value: 'clara', enabled: true, eighthNotes: false, volume: -4 }
    ]
  }]

  test('are migrated on launch, and nothing is lost', async ({ page }) => {
    await noWikipedia(page)
    await page.addInitScript(([records]) => {
      localStorage.setItem('patterns', JSON.stringify(records))
      localStorage.setItem('is-up-to-date-v4', 'true')
      localStorage.setItem('selected-context-name', 'flamenco')
      localStorage.setItem('selected-pattern-name', 'solea')
      localStorage.setItem('mute-hint-seen', 'true')
    }, [legacy])

    await page.goto('/#/flamenco/solea')
    await page.waitForSelector('.mute-target')

    // Not a dialog in sight, where the old app would have offered to wipe this.
    await expect(page.locator('.q-dialog')).toHaveCount(0)

    // The tempo and the silenced beat are still the user's.
    await expect(page.locator('.q-knob')).toContainText('96')
    await expect(page.locator('.mute-target [class*="dot-"] span')).toHaveCount(1)

    const stored = await page.evaluate(() => ({
      legacy: localStorage.getItem('patterns'),
      flag: localStorage.getItem('is-up-to-date-v4'),
      choices: JSON.parse(localStorage.getItem('pattern-choices') ?? '{}')
    }))

    expect(stored.legacy).toBeNull()
    expect(stored.flag).toBeNull()
    expect(stored.choices.solea.tempo).toBe(96)
    expect(stored.choices.solea.mutedSlots).toEqual([4])
    expect(stored.choices.solea.instruments.clara.volume).toBe(-4)
  })
})
