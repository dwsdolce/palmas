import { describe, it, expect, beforeEach, vi } from 'vitest'
import flamenco from 'src/assets/data/patterns/flamenco'
import type { PatternState } from 'src/utils/types'

/**
 * Recovering from an audio context whose clock has died.
 *
 * On a Lenovo tablet, switching to another app and back left the context
 * reporting "running" over a clock that never moved again: play went to Stop,
 * nothing sounded, nothing moved, and only restarting the app fixed it. The
 * state check that guarded play passed, because the state was lying.
 *
 * So the contexts here have a clock that either moves on every read or never
 * moves at all, independently of what `state` says - which is the one
 * distinction the fix is built on.
 */

type FakeContext = {
  id: number
  alive: boolean
  disposed: boolean
  lookAhead: number
  transport: { started: number, bpm: { value: number }, swing: number, start: () => void, stop: () => void, cancel: () => void, position: number }
  draw: { schedule: (cb: () => void) => void }
  rawContext: { state: string, readonly currentTime: number, baseLatency: number, outputLatency: number, resume: () => Promise<void> }
  state: string
  decodeAudioData: () => Promise<unknown>
  dispose: () => void
}

const rec = vi.hoisted(() => {
  let ids = 0
  const makeContext = (alive: boolean): FakeContext => {
    let t = 0
    const ctx: FakeContext = {
      id: ids++,
      alive,
      disposed: false,
      lookAhead: 0.1,
      transport: {
        started: 0,
        bpm: { value: 120 },
        swing: 0,
        start () { this.started++ },
        stop () {},
        cancel () {},
        position: 0
      },
      draw: { schedule: (cb: () => void) => cb() },
      rawContext: {
        // Reports running either way. Only the clock tells them apart.
        state: 'running',
        get currentTime () { if (ctx.alive) t += 0.01; return t },
        baseLatency: 0,
        outputLatency: 0,
        resume: () => Promise.resolve()
      },
      state: 'running',
      decodeAudioData: () => Promise.resolve({ duration: 0.4, sampleRate: 44100 }),
      dispose () { ctx.disposed = true }
    }
    return ctx
  }

  return {
    makeContext,
    // Replaced in beforeEach. The mock module is not re-evaluated by
    // vi.resetModules, so a context left here would carry into the next test.
    current: makeContext(true),
    created: [] as FakeContext[],
    nextIsAlive: true,
    players: 0,
    notices: [] as string[]
  }
})

vi.mock('tone', () => {
  const makeContext = rec.makeContext

  class Context {
    constructor () {
      const ctx = makeContext(rec.nextIsAlive)
      rec.created.push(ctx)
      return ctx as unknown as Context
    }
  }
  class Node {
    volume = { value: 0 }
    decay = 0
    ready = Promise.resolve()
    toDestination () { return this }
    connect () { return this }
    dispose () {}
  }
  class Player extends Node {
    constructor () { super(); rec.players++ }
    start () {}
  }
  class Sequence {
    state = 'stopped'
    disposed = false
    loop = false
    start () { this.state = 'started'; return this }
    stop () { this.state = 'stopped'; return this }
    dispose () { this.disposed = true }
  }

  return {
    Context,
    Player,
    Channel: Node,
    Reverb: Node,
    Sequence,
    getContext: () => rec.current,
    setContext: (ctx: FakeContext) => { rec.current = ctx },
    getTransport: () => rec.current.transport,
    getDraw: () => rec.current.draw,
    start: () => Promise.resolve(),
    loaded: () => Promise.resolve(),
    supported: true
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
    prestartBeat: 0,
    tempo: 120,
    swing: 0,
    globalDecay: 0.3,
    instruments: [],
    instrument: () => ({ enabled: true, eighthNotes: false }),
    isMuted: () => false
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
    Platform: { is: { electron: false, mobile: true, desktop: false } },
    Loading: { show: () => {}, hide: () => {} },
    Notify: { create: ({ message }: { message: string }) => { rec.notices.push(message) } },
    Dialog: { create: () => ({ onOk: () => ({ onCancel: () => ({}) }) }) }
  }
})

/** A fresh singleton per test, loaded and ready, on a context with the given clock. */
const loadedMetronome = async ({ clockAlive }: { clockAlive: boolean }) => {
  vi.resetModules()
  const { useMetronome } = await import('src/composables/metronome')
  const metronome = useMetronome()
  await metronome.loadSounds()
  await metronome.reinitialize()
  metronome.soundsIsLoaded.value = true
  rec.current.alive = clockAlive
  return metronome
}

describe('an audio context whose clock has died', () => {
  beforeEach(() => {
    rec.current = rec.makeContext(true)
    rec.created.length = 0
    rec.nextIsAlive = true
    rec.players = 0
    rec.notices.length = 0
    vi.stubGlobal('fetch', () => Promise.resolve({
      ok: true, status: 206, arrayBuffer: () => Promise.resolve(new ArrayBuffer(8))
    }))
  })

  it('is replaced when play is pressed, although it reports running', async () => {
    const metronome = await loadedMetronome({ clockAlive: false })
    const dead = rec.current
    const playersBefore = rec.players

    await metronome.startSequences()

    expect(rec.created).toHaveLength(1)
    expect(rec.current).toBe(rec.created[0])
    expect(dead.disposed).toBe(true)
    // The transport that started is the new context's, not the dead one's.
    expect(rec.current.transport.started).toBe(1)
    expect(dead.transport.started).toBe(0)
    // The samples were decoded again, onto the new context.
    expect(rec.players).toBeGreaterThan(playersBefore)
    expect(rec.notices).toEqual([])
  })

  it('is left alone when its clock is moving', async () => {
    const metronome = await loadedMetronome({ clockAlive: true })
    const healthy = rec.current

    await metronome.startSequences()

    expect(rec.created).toHaveLength(0)
    expect(rec.current).toBe(healthy)
    expect(healthy.transport.started).toBe(1)
  })

  it('fails play out loud when the new context is dead as well', async () => {
    const metronome = await loadedMetronome({ clockAlive: false })
    rec.nextIsAlive = false

    await expect(metronome.startSequences()).rejects.toThrow(/not advancing/)

    expect(rec.created).toHaveLength(1)
    expect(rec.current.transport.started).toBe(0)
    expect(rec.notices).toEqual(['notify.startSequencesFailed'])
  })

  it('is rebuilt on return to the app, so the next play just works', async () => {
    const metronome = await loadedMetronome({ clockAlive: false })

    await metronome.recoverAudio()

    expect(rec.created).toHaveLength(1)
    expect(rec.current.alive).toBe(true)
  })

  it('is not touched on return before the samples have ever loaded', async () => {
    const metronome = await loadedMetronome({ clockAlive: false })
    metronome.soundsIsLoaded.value = false

    await metronome.recoverAudio()

    expect(rec.created).toHaveLength(0)
  })

  it('is rebuilt once, however many ask at the same moment', async () => {
    const metronome = await loadedMetronome({ clockAlive: false })

    // Coming back to the app and pressing play straight away.
    await Promise.all([
      metronome.recoverAudio(),
      metronome.rebuildAudioEngine(),
      metronome.rebuildAudioEngine()
    ])

    expect(rec.created).toHaveLength(1)
  })
})
