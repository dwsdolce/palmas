import { vi } from 'vitest'

// happy-dom has no Web Audio and no media element support. Nothing here
// decodes real audio: the specs assert scheduling, not sound.
class StubAudioContext {
  baseLatency = 0
  outputLatency = 0
  decodeAudioData () { return Promise.resolve({ duration: 0, sampleRate: 44100 }) }
}
vi.stubGlobal('AudioContext', StubAudioContext)

// Format detection calls canPlayType on a detached <audio>; happy-dom returns
// undefined, which would make loadSounds throw before any assertion runs.
if (typeof window !== 'undefined' && window.HTMLMediaElement) {
  window.HTMLMediaElement.prototype.canPlayType = () => 'probably'
}

// happy-dom leaves `localStorage` alone when the property already exists, and
// Node 22 and later define a global one that is inert unless the process was
// started with --localstorage-file. On those versions the suite therefore runs
// with no storage at all: every `window.localStorage?.clear()` quietly skips,
// and anything asserting that a value was persisted is testing nothing. It is
// invisible until a spec dereferences it without the `?.`, which is how it
// surfaced - passing on CI's Node 24, failing on a developer's Node 26.
//
// A plain in-memory Storage, installed only when there is not a working one.
const storageWorks = (() => {
  try {
    const existing = (globalThis as { localStorage?: Storage }).localStorage
    if (existing === undefined || existing === null) return false
    existing.setItem('__probe__', '1')
    existing.removeItem('__probe__')
    return true
  } catch {
    return false
  }
})()

if (!storageWorks) {
  const entries = new Map<string, string>()
  const memory: Storage = {
    get length () { return entries.size },
    clear: () => entries.clear(),
    getItem: (key: string) => entries.has(key) ? entries.get(key) as string : null,
    key: (index: number) => [...entries.keys()][index] ?? null,
    removeItem: (key: string) => { entries.delete(key) },
    setItem: (key: string, value: string) => { entries.set(key, String(value)) }
  }
  Object.defineProperty(globalThis, 'localStorage', {
    value: memory,
    configurable: true,
    writable: true
  })
}
