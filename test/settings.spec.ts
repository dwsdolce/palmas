import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import {
  CHOICES_KEY,
  VERSION_KEY,
  SETTINGS_VERSION,
  choicesFromLegacy,
  migrateSettings
} from 'src/utils/settings'

vi.mock('src/composables/metronome', async () => (await import('./helpers/app-mocks')).metronomeMock())
vi.mock('src/composables/keep-awake', async () => (await import('./helpers/app-mocks')).keepAwakeMock())
vi.mock('vue-router', async () => (await import('./helpers/app-mocks')).routerMock())
vi.mock('src/boot/i18n', async () => (await import('./helpers/app-mocks')).i18nMock())
vi.mock('quasar', async (importOriginal) => (await import('./helpers/app-mocks')).quasarMock(importOriginal as never))

const { usePatternStore } = await import('src/stores/patterns')

/**
 * One record as the pre-1 app wrote it: the user's choices and a copy of the
 * app's own data around them.
 */
const legacyRecord = {
  name: 'solea',
  context: 'flamenco',
  tempo: 96,
  swing: 0,
  globalDecay: 0.7,
  improvisation: true,
  humanization: false,
  prestartBeat: { value: 4, label: '4' },
  mutedSlots: [4, 18],
  instruments: [
    { label: 'Palmas claras', value: 'clara', enabled: true, eighthNotes: true, volume: -3 },
    { label: 'Cajón', value: 'cajon', enabled: false, eighthNotes: false, volume: 0 }
  ]
}

describe('migrating stored settings', () => {
  beforeEach(() => window.localStorage.clear())

  it('keeps every choice a previous version stored', () => {
    window.localStorage.setItem('patterns', JSON.stringify([legacyRecord]))

    migrateSettings(window.localStorage)

    const choices = JSON.parse(window.localStorage.getItem(CHOICES_KEY) ?? '{}')
    expect(choices.solea).toEqual({
      tempo: 96,
      swing: 0,
      globalDecay: 0.7,
      improvisation: true,
      humanization: false,
      prestartBeat: 4,
      mutedSlots: [4, 18],
      instruments: {
        clara: { enabled: true, eighthNotes: true, volume: -3 },
        cajon: { enabled: false, eighthNotes: false, volume: 0 }
      }
    })
  })

  it('stores nothing the app already knows', () => {
    const choices = choicesFromLegacy([legacyRecord])
    const stored = JSON.stringify(choices)

    // Labels, instrument names as values, and the pattern's context are the
    // app's to say. None of them belongs in settings.
    expect(stored).not.toContain('Palmas claras')
    expect(stored).not.toContain('flamenco')
    expect(stored).not.toContain('"label"')
  })

  it('removes the keys nothing reads any more', () => {
    window.localStorage.setItem('patterns', JSON.stringify([legacyRecord]))
    window.localStorage.setItem('is-up-to-date-v4', 'true')

    migrateSettings(window.localStorage)

    expect(window.localStorage.getItem('patterns')).toBeNull()
    expect(window.localStorage.getItem('is-up-to-date-v4')).toBeNull()
  })

  it('stamps a first install and writes nothing else', () => {
    migrateSettings(window.localStorage)

    expect(window.localStorage.getItem(VERSION_KEY)).toBe(String(SETTINGS_VERSION))
    expect(window.localStorage.getItem(CHOICES_KEY)).toBeNull()
  })

  it('leaves settings alone once they are current', () => {
    window.localStorage.setItem(VERSION_KEY, String(SETTINGS_VERSION))
    window.localStorage.setItem(CHOICES_KEY, JSON.stringify({ solea: { tempo: 111 } }))
    window.localStorage.setItem('patterns', 'anything at all')

    migrateSettings(window.localStorage)

    const choices = JSON.parse(window.localStorage.getItem(CHOICES_KEY) ?? '{}')
    expect(choices.solea.tempo).toBe(111)
    // Not this migration's to clean up: it ran before this key was written.
    expect(window.localStorage.getItem('patterns')).toBe('anything at all')
  })

  it('starts clean rather than failing on settings it cannot read', () => {
    window.localStorage.setItem('patterns', '{ this is not json')

    expect(() => migrateSettings(window.localStorage)).not.toThrow()
    expect(window.localStorage.getItem(VERSION_KEY)).toBe(String(SETTINGS_VERSION))
  })

  it('skips a record with no pattern name', () => {
    expect(choicesFromLegacy([{ tempo: 120 }, legacyRecord])).toEqual({
      solea: expect.objectContaining({ tempo: 96 })
    })
  })
})

/**
 * The other half of the arrangement: settings hold choices, and the pattern
 * decides what a choice can mean. A choice that no longer fits its pattern is
 * brought back into range when it is read, with nothing said to the user.
 */
describe('a choice read against its pattern', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    window.localStorage.clear()
  })

  const open = async (name = 'solea') => {
    const store = usePatternStore()
    await store.initAll('flamenco', name)
    return store
  }

  it('gives the pattern itself when nothing was chosen', async () => {
    const store = await open()

    expect(store.tempo).toBe(store.selectedData.defaultTempo)
    expect(store.mutedCount).toBe(0)
    expect(store.selectedPattern.instruments[0].enabled).toBe(true)
    expect(window.localStorage.getItem(CHOICES_KEY)).toBeNull()
  })

  it('offers an instrument the pattern gained after the choice was made', async () => {
    const store = await open()
    store.choices = { solea: { instruments: { clara: { volume: -6 } } } }

    const offered = store.selectedPattern.instruments.map(i => i.value)
    expect(offered).toEqual(store.instruments.map(i => i.value))
    expect(offered.length).toBeGreaterThan(1)
    expect(store.instrument('clara').volume).toBe(-6)
  })

  it('ignores a choice for an instrument the pattern does not have', async () => {
    const store = await open()
    store.choices = { solea: { instruments: { trombone: { enabled: true } } } }

    expect(store.selectedPattern.instruments.some(i => i.value === 'trombone')).toBe(false)
  })

  it('brings a tempo outside the pattern back into range', async () => {
    const store = await open()
    const { minTempo, maxTempo } = store.selectedData

    store.choices = { solea: { tempo: maxTempo + 500 } }
    expect(store.tempo).toBe(maxTempo)

    store.choices = { solea: { tempo: minTempo - 500 } }
    expect(store.tempo).toBe(minTempo)
  })

  it('falls back to the first prestart beat when the chosen one is gone', async () => {
    const store = await open()
    store.choices = { solea: { prestartBeat: 999 } }

    expect(store.prestartBeat).toBe(store.selectedData.prestartBeats[0].value)
  })
})
