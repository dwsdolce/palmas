import { describe, it, expect, beforeEach, vi } from 'vitest'

/**
 * What the metronome does when the app leaves the screen and comes back.
 *
 * Leaving stops it on a phone or tablet - where the OS was going to silence it
 * anyway - and leaves it running on a desktop, where a background tab or
 * window keeps playing and practising against it from elsewhere is a real use.
 * Coming back checks the audio and rebuilds it if its clock has died.
 */

const rec = vi.hoisted(() => ({
  native: false,
  mobile: true,
  playing: false,
  stops: 0,
  recoveries: 0,
  appStateListener: null as null | ((state: { isActive: boolean }) => void)
}))

vi.mock('quasar/wrappers', () => ({ boot: (fn: unknown) => fn }))
vi.mock('quasar', () => ({
  Platform: { is: { get mobile () { return rec.mobile } } }
}))
vi.mock('@capacitor/core', () => ({
  Capacitor: { isNativePlatform: () => rec.native }
}))
vi.mock('@capacitor/app', () => ({
  App: {
    addListener: (event: string, fn: (state: { isActive: boolean }) => void) => {
      if (event === 'appStateChange') rec.appStateListener = fn
      return Promise.resolve({ remove: () => {} })
    }
  }
}))
vi.mock('src/stores/patterns', () => ({
  usePatternStore: () => ({
    get isPlaying () { return rec.playing },
    stop: () => { rec.stops++; rec.playing = false; return Promise.resolve() }
  })
}))
vi.mock('src/composables/metronome', () => ({
  useMetronome: () => ({ recoverAudio: () => { rec.recoveries++; return Promise.resolve() } })
}))

/** Run the boot file, and hand back the page-visibility handler it installed. */
const bootLifecycle = async () => {
  vi.resetModules()
  let onVisibility: (() => void) | null = null
  const spy = vi.spyOn(document, 'addEventListener').mockImplementation((type, fn) => {
    if (type === 'visibilitychange') onVisibility = fn as () => void
  })
  const { default: run } = await import('src/boot/audio-lifecycle')
  await (run as unknown as () => Promise<void>)()
  spy.mockRestore()
  return onVisibility as (() => void) | null
}

const setHidden = (hidden: boolean) => {
  Object.defineProperty(document, 'hidden', { configurable: true, get: () => hidden })
}

describe('leaving the app and coming back', () => {
  beforeEach(() => {
    rec.native = false
    rec.mobile = true
    rec.playing = false
    rec.stops = 0
    rec.recoveries = 0
    rec.appStateListener = null
  })

  describe('in the installed app', () => {
    beforeEach(() => { rec.native = true })

    it('stops the metronome when the app leaves the screen while playing', async () => {
      await bootLifecycle()
      rec.playing = true

      rec.appStateListener!({ isActive: false })

      expect(rec.stops).toBe(1)
    })

    it('does nothing on leaving when nothing is playing', async () => {
      await bootLifecycle()

      rec.appStateListener!({ isActive: false })

      expect(rec.stops).toBe(0)
    })

    it('checks the audio when the app comes back', async () => {
      await bootLifecycle()

      rec.appStateListener!({ isActive: true })

      expect(rec.recoveries).toBe(1)
      expect(rec.stops).toBe(0)
    })

    it('listens to the app lifecycle, not page visibility', async () => {
      // Capacitor keeps the WebView running when the activity pauses, so the
      // page is never told it was hidden - visibilitychange would never fire.
      const onVisibility = await bootLifecycle()

      expect(rec.appStateListener).not.toBeNull()
      expect(onVisibility).toBeNull()
    })
  })

  describe('in a mobile browser', () => {
    it('stops when the page is hidden, and recovers when it is shown', async () => {
      const onVisibility = await bootLifecycle()
      rec.playing = true

      setHidden(true)
      onVisibility!()
      expect(rec.stops).toBe(1)

      setHidden(false)
      onVisibility!()
      expect(rec.recoveries).toBe(1)
    })
  })

  describe('on a desktop', () => {
    beforeEach(() => { rec.mobile = false })

    it('keeps playing in a background tab', async () => {
      const onVisibility = await bootLifecycle()
      rec.playing = true

      setHidden(true)
      onVisibility!()

      expect(rec.stops).toBe(0)
      expect(rec.playing).toBe(true)
    })

    it('still checks the audio when the tab comes back', async () => {
      const onVisibility = await bootLifecycle()

      setHidden(false)
      onVisibility!()

      expect(rec.recoveries).toBe(1)
    })
  })
})
