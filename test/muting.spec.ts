import { describe, it, expect, beforeEach, vi } from 'vitest'
import { nextTick } from 'vue'
import { setActivePinia, createPinia } from 'pinia'

vi.mock('src/composables/metronome', async () => (await import('./helpers/app-mocks')).metronomeMock())
vi.mock('src/composables/keep-awake', async () => (await import('./helpers/app-mocks')).keepAwakeMock())
vi.mock('vue-router', async () => (await import('./helpers/app-mocks')).routerMock())
vi.mock('src/boot/i18n', async () => (await import('./helpers/app-mocks')).i18nMock())
vi.mock('quasar', async (importOriginal) => (await import('./helpers/app-mocks')).quasarMock(importOriginal as never))

const { usePatternStore } = await import('src/stores/patterns')

/**
 * Muting, as the store holds it.
 *
 * Slots, not beats: `nbBeatsInPattern` counts subdivisions, two per beat, so
 * soleá's twelve beats are twenty-four slots and beat 10 is slot 18. Every
 * number here is a slot index.
 */
describe('muting', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    window.localStorage?.clear()
  })

  const openPattern = async (name = 'solea') => {
    const store = usePatternStore()
    await store.initAll('flamenco', name)
    return store
  }

  it('starts with nothing muted', async () => {
    const store = await openPattern()
    expect(store.mutedCount).toBe(0)
    expect(store.isMuted(0)).toBe(false)
  })

  it('mutes a slot, and unmutes it when tapped again', async () => {
    const store = await openPattern()

    store.toggleMute(18)
    expect(store.isMuted(18)).toBe(true)
    expect(store.mutedCount).toBe(1)

    store.toggleMute(18)
    expect(store.isMuted(18)).toBe(false)
    expect(store.mutedCount).toBe(0)
  })

  it('keeps the stored slots sorted, whatever order they were tapped in', async () => {
    const store = await openPattern()
    for (const slot of [18, 4, 22, 0]) store.toggleMute(slot)
    expect(store.selectedPattern.mutedSlots).toEqual([0, 4, 18, 22])
  })

  it('lets every slot be muted at once', async () => {
    const store = await openPattern()
    const slots = store.selectedData.nbBeatsInPattern

    for (let slot = 0; slot < slots; slot++) store.toggleMute(slot)

    // A silent pattern whose compás is still drawn is a usable exercise, not a
    // state to guard against.
    expect(store.mutedCount).toBe(slots)
    expect(store.visualizedSequence.every(value => value === null)).toBe(true)
  })

  it('clears every mute at once', async () => {
    const store = await openPattern()
    for (const slot of [0, 6, 18]) store.toggleMute(slot)
    expect(store.mutedCount).toBe(3)

    store.clearMutes()
    expect(store.mutedCount).toBe(0)
  })

  describe('the drawn sequence', () => {
    it('reads a muted slot as silent, so no strike is drawn on it', async () => {
      const store = await openPattern()

      const struck = store.visualizedSequence
        .map((value, slot) => (value === null ? null : slot))
        .filter((slot): slot is number => slot !== null)
      expect(struck.length).toBeGreaterThan(0)

      const target = struck[0]!
      store.toggleMute(target)

      expect(store.visualizedSequence[target]).toBeNull()
      // and only that one changed
      for (const slot of struck.slice(1)) {
        expect(store.visualizedSequence[slot]).not.toBeNull()
      }
    })

    it('leaves the compás alone - accents are not muted, only sound is', async () => {
      const store = await openPattern()
      const accents = [...store.selectedData.accents]

      for (const slot of accents) store.toggleMute(slot)

      // What a muted beat still is: a beat, and an accented one. Muting removes
      // the sound, not the pattern - which is what lets the dots go on showing
      // where you are while you count through the silence.
      expect(store.selectedData.accents).toEqual(accents)
    })
  })

  describe('persistence', () => {
    it('keeps mutes per pattern, and does not leak between them', async () => {
      const store = await openPattern('solea')
      store.toggleMute(18)
      expect(store.mutedCount).toBe(1)

      await store.initPattern('flamenco', 'buleria-12')
      expect(store.mutedCount).toBe(0)

      await store.initPattern('flamenco', 'solea')
      expect(store.isMuted(18)).toBe(true)
    })

    it('writes them where a restart will find them', async () => {
      const store = await openPattern()
      store.toggleMute(18)

      // useStorage batches its write to the next flush, so the value is in the
      // store before it is in localStorage.
      await nextTick()

      const stored = JSON.parse(window.localStorage.getItem('patterns') ?? '[]')
      const solea = stored.find((p: { name: string }) => p.name === 'solea')
      expect(solea.mutedSlots).toEqual([18])
    })

    it('reads a pattern saved before muting existed', async () => {
      // Every record written by an earlier version has no mutedSlots at all.
      const store = await openPattern()
      delete store.selectedPattern.mutedSlots

      expect(store.mutedCount).toBe(0)
      expect(() => store.toggleMute(4)).not.toThrow()
      expect(store.isMuted(4)).toBe(true)
    })
  })
})
