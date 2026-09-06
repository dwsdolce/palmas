import { describe, it, expect, beforeEach, vi } from 'vitest'
import flamenco from 'src/assets/data/patterns/flamenco'
import type { PatternState } from 'src/utils/types'

// Recorders shared with the mock factories below. vi.mock is hoisted above the
// imports, so anything it closes over has to be hoisted with it.
const rec = vi.hoisted(() => ({
  draws: [] as { time: number }[],
  starts: [] as { time: number }[],
  ctx: { baseLatency: 0, outputLatency: 0 },
  offsetMs: 0
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
    // The real Draw defers to requestAnimationFrame; we record the scheduled
    // time and run the callback straight away, which is what makes the skew
    // between the visual and the audible event observable.
    Draw: { schedule: (cb: () => void, time: number) => { rec.draws.push({ time }); cb() } },
    getContext: () => ({
      rawContext: rec.ctx,
      decodeAudioData: () => Promise.resolve({ duration: 0.4, sampleRate: 44100 })
    }),
    getTransport: () => ({ bpm: { value: 120 }, start () {}, stop () {}, cancel () {}, position: 0 }),
    context: { state: 'running', resume: () => Promise.resolve() },
    supported: true,
    start: () => Promise.resolve(),
    loaded: () => Promise.resolve()
  }
})

const pattern = (flamenco as PatternState[]).find(p => p.name === 'siguiriya')!

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
    // Only the instrument under test is enabled, so the recorded starts belong
    // to one sequence and can be matched slot for slot.
    instrument: (type: string) => ({ enabled: type === 'clara', eighthNotes: true }),
    // Nothing is muted here: this suite is about sync, and muting is covered by
    // test/muting.spec.ts.
    isMuted: () => false
  })
}))

vi.mock('src/stores/session', () => ({
  useSessionStore: () => ({ audioVisualOffset: rec.offsetMs })
}))

vi.mock('src/boot/i18n', () => ({ t: (key: string) => key }))

// Quasar's Platform is populated by the framework plugin, which nothing
// installs here; the rest of the package is left alone so real helpers work.
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

/** Seconds per slot. Slots are eighth notes: Tone.Sequence's default subdivision. */
const slotDuration = (bpm: number) => 60 / bpm / 2

/**
 * Runs one pass of the compas, driving the visual sequence and the instrument
 * sequence with the same slot times, and returns what each path scheduled.
 */
const runCompas = (bpm: number) => {
  const { buildSequence } = useMetronome()
  rec.draws.length = 0
  rec.starts.length = 0

  const visual = buildSequence(pattern.name, false, 'event', loopSeq, true) as unknown as {
    callback: (time: number, note: number) => void
  }
  const audio = buildSequence(pattern.name, false, 'clara', loopSeq, true) as unknown as {
    callback: (time: number, note: number) => void
  }

  const visualBySlot = new Map<number, number>()
  const audioBySlot = new Map<number, number>()

  for (let slot = 0; slot < SLOTS; slot++) {
    const time = slot * slotDuration(bpm)

    const drawsBefore = rec.draws.length
    visual.callback(time, slot)
    if (rec.draws.length > drawsBefore) visualBySlot.set(slot, rec.draws.at(-1)!.time)

    const startsBefore = rec.starts.length
    audio.callback(time, slot)
    if (rec.starts.length > startsBefore) audioBySlot.set(slot, rec.starts.at(-1)!.time)
  }

  return { visualBySlot, audioBySlot }
}

describe('metronome audio/visual sync', () => {
  beforeEach(async () => {
    rec.ctx.baseLatency = 0
    rec.ctx.outputLatency = 0
    rec.offsetMs = 0
    const { loadSounds } = useMetronome()
    vi.stubGlobal('fetch', () => Promise.resolve({
      ok: true, status: 206, arrayBuffer: () => Promise.resolve(new ArrayBuffer(8))
    }))
    await loadSounds()
  })

  it('drives the dots and the samples from the same slot index', () => {
    const { visualBySlot, audioBySlot } = runCompas(pattern.defaultTempo)

    // Every counted beat draws, and nothing draws off-grid.
    expect([...visualBySlot.keys()]).toEqual(loopSeq.filter(s => s % 2 === 0))
    // Every slot that sounds is a slot the pattern actually fills.
    for (const slot of audioBySlot.keys()) {
      expect(pattern.sequences.clara![slot], `slot ${slot}`).toBeTruthy()
    }
  })

  it('offsets the visual from the audible event by exactly the output latency', () => {
    rec.ctx.outputLatency = 0.02
    const { visualBySlot, audioBySlot } = runCompas(pattern.defaultTempo)
    expect(audioBySlot.size, 'no audio scheduled - the test would pass vacuously').toBeGreaterThan(0)

    for (const [slot, audioTime] of audioBySlot) {
      const visualTime = visualBySlot.get(slot)
      if (visualTime === undefined) continue
      expect(visualTime - audioTime, `slot ${slot}`).toBeCloseTo(0.02, 6)
    }
  })

  it('applies the same compensation whatever the tempo', () => {
    rec.ctx.outputLatency = 0.02
    rec.offsetMs = 60

    for (const bpm of [pattern.minTempo, pattern.defaultTempo, pattern.maxTempo]) {
      const { visualBySlot, audioBySlot } = runCompas(bpm)
      expect(audioBySlot.size, `no audio at ${bpm} BPM`).toBeGreaterThan(0)

      for (const [slot, audioTime] of audioBySlot) {
        const visualTime = visualBySlot.get(slot)
        if (visualTime === undefined) continue
        // Latency is a fixed number of seconds, not a fraction of a beat, so
        // the offset must not scale with the tempo.
        expect(visualTime - audioTime, `${bpm} BPM, slot ${slot}`).toBeCloseTo(0.08, 6)
      }
    }
  })

  // There is deliberately no assertion that the visual lands inside its own
  // slot. Tone.Draw fires when the context clock reaches the scheduled time,
  // so a visual scheduled at T + L appears exactly as the audio queued at T
  // reaches the speakers - and that is right however large L is. On a
  // Bluetooth output at 300 BPM the true latency spans three slots, and
  // compensating by three slots is correct, not broken.
  //
  // What can be wrong is the offset not matching the real latency, which no
  // test can detect: the app is never told what the true delay is. The slider
  // is the only place that knows, and it reports milliseconds, which say
  // nothing about how many beats they amount to at the tempo in play.
  it('offsets the visual by the configured latency and nothing else', () => {
    rec.ctx.baseLatency = 0.005
    rec.ctx.outputLatency = 0.015
    rec.offsetMs = 250

    const { visualBySlot, audioBySlot } = runCompas(pattern.defaultTempo)
    expect(audioBySlot.size).toBeGreaterThan(0)

    for (const [slot, audioTime] of audioBySlot) {
      const visualTime = visualBySlot.get(slot)
      if (visualTime === undefined) continue
      expect(visualTime - audioTime, `slot ${slot}`).toBeCloseTo(0.27, 6)
    }
  })
})
