import { describe, it, expect, beforeEach, vi } from 'vitest'
import { nextTick } from 'vue'
import { setActivePinia, createPinia } from 'pinia'

// The store reaches for the audio graph, the router and analytics on setup.
// None of that is under test here, so each is replaced with the smallest thing
// that satisfies the destructuring in the store's own setup function.
vi.mock('src/composables/metronome', async () => (await import('./helpers/app-mocks')).metronomeMock())
vi.mock('src/composables/keep-awake', async () => (await import('./helpers/app-mocks')).keepAwakeMock())
vi.mock('vue-router', async () => (await import('./helpers/app-mocks')).routerMock())
vi.mock('src/boot/i18n', async () => (await import('./helpers/app-mocks')).i18nMock())
vi.mock('quasar', async (importOriginal) => (await import('./helpers/app-mocks')).quasarMock(importOriginal as never))

const { usePatternStore } = await import('src/stores/patterns')

type Store = ReturnType<typeof usePatternStore>

describe('patterns store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    window.localStorage?.clear()
  })

  it('exposes every pattern, each tagged with its context', async () => {
    const store = usePatternStore()
    await store.initStore()

    expect(store.data.length).toBeGreaterThan(0)
    for (const pattern of store.data) {
      expect(pattern.context, `${pattern.name} has no context`).toBeTruthy()
      expect(pattern.name).toBeTypeOf('string')
    }
  })

  it('finds an instrument by its value and nothing by a bogus one', async () => {
    const store = usePatternStore()
    await store.initAll('flamenco', 'siguiriya')

    const known = store.instruments[0]
    expect(known).toBeDefined()
    expect(store.instrument(known!.value)).toEqual(known)
    expect(store.instrument('not-an-instrument')).toBeUndefined()
  })

  it('selects a pattern and builds its playable instrument list', async () => {
    const store = usePatternStore()
    await store.initAll('flamenco', 'siguiriya')

    expect(store.selectedData.name).toBe('siguiriya')
    expect(store.selectedPattern.tempo).toBe(store.selectedData.defaultTempo)
    // beatLabels is the counted-beat label row, never a playable instrument.
    expect(store.instruments.map(i => i.value)).not.toContain('beatLabels')
    // Something has to be audible when a pattern is first loaded.
    expect(store.instruments.filter(i => i.enabled).length).toBeGreaterThan(0)
  })

  describe('the visualized instrument', () => {
    it('is always one you can hear', async () => {
      const store = usePatternStore()
      await store.initAll('flamenco', 'siguiriya')

      expect(store.visualizedInstrument).toBeDefined()
      expect(store.selectedInstruments.map(i => i.value))
        .toContain(store.visualizedInstrument!.value)
    })

    it('answers with the only enabled instrument without being told', async () => {
      const store = usePatternStore()
      await store.initAll('flamenco', 'abandolaos')

      expect(store.selectedInstruments.length).toBe(1)
      expect(store.visualizedInstrument!.value).toBe(store.selectedInstruments[0]!.value)
    })

    it('honours a deliberate choice', async () => {
      const store = usePatternStore()
      await store.initAll('flamenco', 'abandolaos')
      store.selectInstruments('click', true)

      store.visualizeInstrument('click')

      expect(store.visualizedInstrument!.value).toBe('click')
      expect(store.visualizedSequence).toEqual(store.selectedData.sequences.click)
    })

    it('ignores a choice you cannot hear', async () => {
      const store = usePatternStore()
      await store.initAll('flamenco', 'abandolaos')
      const enabled = store.selectedInstruments[0]!.value

      store.visualizeInstrument('cajon')

      expect(store.selectedInstruments.map(i => i.value)).not.toContain('cajon')
      expect(store.visualizedInstrument!.value).toBe(enabled)
    })

    it('falls back when the chosen instrument is switched off', async () => {
      const store = usePatternStore()
      await store.initAll('flamenco', 'abandolaos')
      store.selectInstruments('click', true)
      store.visualizeInstrument('click')
      expect(store.visualizedInstrument!.value).toBe('click')

      store.selectInstruments('click', false)

      expect(store.visualizedInstrument!.value).not.toBe('click')
      expect(store.selectedInstruments.map(i => i.value))
        .toContain(store.visualizedInstrument!.value)
    })

    it('reports eighth notes for the drawn instrument, not the mixer at large', async () => {
      const store = usePatternStore()
      await store.initAll('flamenco', 'abandolaos')
      store.selectInstruments('cajon', true)
      store.visualizeInstrument('cajon')
      store.toggleEighthNotes('cajon')

      expect(store.visualizedHasEighthNotes).toBe(true)

      const other = store.selectedInstruments.find(i => i.value !== 'cajon')!
      store.visualizeInstrument(other.value)
      expect(store.visualizedHasEighthNotes).toBe(false)
      // The cajón still has eighths on. That is the whole distinction: the
      // views follow the instrument being drawn, not the mixer at large.
      expect(store.instrument('cajon')!.eighthNotes).toBe(true)
    })
  })

  describe('play', () => {
    it('puts isPlaying back if the start fails', async () => {
      const store = usePatternStore()
      await store.initAll('flamenco', 'abandolaos')

      const { useMetronome } = await import('src/composables/metronome')
      const metronome = useMetronome()
      vi.mocked(metronome.startSequences).mockRejectedValueOnce(new Error('no audio'))

      await store.play()

      // Left true, the button reads as "stop" and the next tap stops a
      // silence instead of starting - which looks like a dead button.
      expect(store.isPlaying).toBe(false)
    })

    it('stays playing when the start succeeds', async () => {
      const store = usePatternStore()
      await store.initAll('flamenco', 'abandolaos')

      await store.play()

      expect(store.isPlaying).toBe(true)
    })
  })

  /**
   * What stops playback, and what does not.
   *
   * Only changing the pattern stops it: the new pattern needs its own
   * sequences. Everything else is adjusted while it plays - that is the point
   * of silencing a beat or bringing in the cajón mid-exercise.
   *
   * This broke once without any test noticing. The store watched the selected
   * pattern to stop on a change of pattern, and that object used to be the same
   * one for as long as you stayed on a pattern. When settings came to hold
   * choices only, it became an object rebuilt from them, so every choice looked
   * like a new pattern and stopped the metronome.
   */
  describe('while playing', () => {
    // Watchers run on the next tick, and some of the store's are async.
    const settle = async () => {
      for (let i = 0; i < 5; i++) {
        await nextTick()
        await Promise.resolve()
      }
    }

    const playing = async () => {
      const store = usePatternStore()
      await store.initAll('flamenco', 'solea')
      await store.play()
      await settle()
      expect(store.isPlaying).toBe(true)
      return store
    }

    it.each([
      ['silencing a beat', (s: Store) => s.toggleMute(4)],
      ['bringing in an instrument', (s: Store) => s.selectInstruments('cajon', true)],
      ['changing a volume', (s: Store) => s.selectVolume({ instrument: 'clara', volume: -5 })],
      ['switching eighth notes', (s: Store) => s.toggleEighthNotes('clara')],
      ['changing the tempo', (s: Store) => { s.tempo = 140 }]
    ])('keeps playing after %s', async (_label, act) => {
      const store = await playing()

      act(store)
      await settle()

      expect(store.isPlaying).toBe(true)
    })

    it('stops when the pattern changes', async () => {
      const store = await playing()

      // What MainPage does when the route moves to another pattern.
      await store.initContext('flamenco')
      await store.initPattern('flamenco', 'buleria-12')
      await settle()

      expect(store.isPlaying).toBe(false)
    })
  })
})
