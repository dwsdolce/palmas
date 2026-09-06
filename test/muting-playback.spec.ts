import { describe, it, expect, beforeEach, vi } from 'vitest'
import flamenco from 'src/assets/data/patterns/flamenco'
import type { PatternState } from 'src/utils/types'

/**
 * That a muted beat is actually silent.
 *
 * The store tests say the data is right; this says no sound is scheduled, which
 * is the only claim a player cares about. Both instruments that can make one are
 * covered, and they reach the audio by different routes:
 *
 *   a sequenced instrument - reads its line from `sequences`
 *   the jaleos             - never touch `sequences` at all, and are improvised
 *
 * The jaleos are the reason this file exists. An overlay that nulls the muted
 * slots of `sequences` silences everything above and leaves them shouting, and
 * nothing about the sequence code would show it.
 */

const rec = vi.hoisted(() => ({
  starts: [] as { time: number }[],
  muted: new Set<number>()
}))

vi.mock('tone', () => {
  class Sequence {
    callback: (time: number, note: number) => void
    events: number[]
    loop = false
    constructor (cb: (time: number, note: number) => void, events: number[]) {
      this.callback = cb
      this.events = events
    }
    start () { return this }
    stop () { return this }
    dispose () {}
  }
  class Player {
    volume = { value: 0 }
    constructor (public buffer?: unknown) {}
    connect () { return this }
    start (time: number) { rec.starts.push({ time }) }
    dispose () {}
  }
  class Channel {
    volume = { value: 0 }
    toDestination () { return this }
    connect () { return this }
    dispose () {}
  }
  class Reverb {
    decay = 0
    wet = { value: 0 }
    toDestination () { return this }
    connect () { return this }
    dispose () {}
  }
  return {
    Sequence, Player, Channel, Reverb,
    Draw: { schedule: (cb: () => void) => cb() },
    getContext: () => ({
      rawContext: { baseLatency: 0, outputLatency: 0 },
      decodeAudioData: () => Promise.resolve({ duration: 0.4, sampleRate: 44100 })
    }),
    getTransport: () => ({ bpm: { value: 120 }, start () {}, stop () {}, cancel () {}, position: 0 }),
    context: { state: 'running', resume: () => Promise.resolve() },
    supported: true,
    start: () => Promise.resolve(),
    loaded: () => Promise.resolve()
  }
})

const pattern = (flamenco as PatternState[]).find(p => p.name === 'solea')!

vi.mock('src/stores/patterns', () => ({
  usePatternStore: () => ({
    selectedData: pattern,
    selectedPattern: {
      name: pattern.name,
      improvisation: false,
      humanization: false,
      prestartBeat: { value: 0, label: '0' },
      swing: 0
    },
    instrument: (type: string) => ({
      enabled: type === 'clara' || type === 'jaleos',
      eighthNotes: false
    }),
    isMuted: (slot: number) => rec.muted.has(slot)
  })
}))

vi.mock('src/stores/session', () => ({
  useSessionStore: () => ({ audioVisualOffset: 0 })
}))

vi.mock('src/boot/i18n', () => ({ t: (key: string) => key }))

vi.mock('quasar', async (importOriginal) => {
  const actual = await importOriginal<typeof import('quasar')>()
  return {
    ...actual,
    Platform: { is: { electron: false, mobile: false, desktop: true } },
    Loading: { show: () => {}, hide: () => {} },
    Notify: { create: () => {} },
    Dialog: { create: () => ({ onOk: () => ({ onCancel: () => ({}) }) }) }
  }
})

const { useMetronome } = await import('src/composables/metronome')

const SLOTS = pattern.nbBeatsInPattern
const loopSeq = Array.from({ length: SLOTS }, (_, i) => i)

/** Drive one pass of the compás for one instrument, and report which slots sounded. */
const slotsThatSounded = (type: string): number[] => {
  const { buildSequence } = useMetronome()
  const seq = buildSequence(pattern.name, false, type, loopSeq, true) as unknown as {
    callback: (time: number, note: number) => void
  }

  const sounded: number[] = []
  for (let slot = 0; slot < SLOTS; slot++) {
    const before = rec.starts.length
    seq.callback(slot * 0.25, slot)
    if (rec.starts.length > before) sounded.push(slot)
  }
  return sounded
}

describe('a muted beat is silent', () => {
  beforeEach(async () => {
    rec.starts.length = 0
    rec.muted.clear()
    vi.restoreAllMocks()

    // The players only exist once the samples have been decoded, and the
    // sequence reaches into sounds[type] without checking.
    const { loadSounds } = useMetronome()
    vi.stubGlobal('fetch', () => Promise.resolve({
      ok: true, status: 206, arrayBuffer: () => Promise.resolve(new ArrayBuffer(8))
    }))
    await loadSounds()
  })

  describe('a sequenced instrument', () => {
    it('sounds on the slots its line strikes, when nothing is muted', () => {
      const sounded = slotsThatSounded('clara')
      expect(sounded.length).toBeGreaterThan(0)
    })

    it('does not sound on a muted slot', () => {
      const before = slotsThatSounded('clara')
      const target = before[0]!

      rec.starts.length = 0
      rec.muted.add(target)
      const after = slotsThatSounded('clara')

      expect(after).not.toContain(target)
      // and nothing else was affected
      expect(after).toEqual(before.filter(slot => slot !== target))
    })

    it('falls silent entirely when every slot is muted', () => {
      for (let slot = 0; slot < SLOTS; slot++) rec.muted.add(slot)
      expect(slotsThatSounded('clara')).toEqual([])
    })
  })

  describe('the jaleos', () => {
    /**
     * They fire on 2% of slots, 6% of accented ones. Forcing the roll past both
     * thresholds makes them fire on every eligible slot, so their absence on a
     * muted one means the mute, not the odds.
     */
    const alwaysFire = () => vi.spyOn(Math, 'random').mockReturnValue(0.999)

    it('sound on every slot when the roll always succeeds', () => {
      alwaysFire()
      expect(slotsThatSounded('jaleos').length).toBeGreaterThan(0)
    })

    it('do not sound on a muted slot', () => {
      alwaysFire()
      const before = slotsThatSounded('jaleos')
      const target = before[0]!

      rec.starts.length = 0
      rec.muted.add(target)

      expect(slotsThatSounded('jaleos')).not.toContain(target)
    })

    it('are silenced on a muted accent, which is where they most want to fire', () => {
      alwaysFire()
      const accent = pattern.accents[0]!
      rec.muted.add(accent)

      expect(slotsThatSounded('jaleos')).not.toContain(accent)
    })
  })
})
