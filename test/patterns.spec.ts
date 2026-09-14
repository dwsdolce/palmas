import { describe, it, expect } from 'vitest'
import { readdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { PatternState } from 'src/utils/types'

const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src/assets/data/patterns')
const files = readdirSync(dir).filter(f => f.endsWith('.ts'))

const patterns: (PatternState & { __file: string })[] = []
for (const file of files) {
  const mod = await import(/* @vite-ignore */ path.join(dir, file))
  for (const p of (mod.default ?? []) as PatternState[]) {
    patterns.push({ ...p, __file: file })
  }
}

// beatLabels rides in `sequences` but is the counted-beat label row, not an
// instrument: its values are labels ('&', 2, 3) rather than sample indices.
const INSTRUMENT_SEQUENCES = (p: PatternState) =>
  Object.entries(p.sequences ?? {}).filter(
    ([name, seq]) => name !== 'beatLabels' && Array.isArray(seq)
  ) as [string, (number | null)[]][]

describe('pattern data', () => {
  it('loads every pattern file', () => {
    expect(files.length).toBeGreaterThan(0)
    expect(patterns.length).toBeGreaterThan(0)
  })

  it.each(patterns.map(p => [p.__file, p.name, p] as const))(
    '%s / %s has sequences the length of nbBeatsInPattern',
    (_file, _name, pattern) => {
      for (const [instrument, seq] of INSTRUMENT_SEQUENCES(pattern)) {
        expect(seq.length, `${pattern.name}.${instrument}`).toBe(pattern.nbBeatsInPattern)
      }
    }
  )

  it.each(patterns.map(p => [p.__file, p.name, p] as const))(
    '%s / %s has accents inside the pattern, strictly ascending',
    (_file, _name, pattern) => {
      const accents = pattern.accents ?? []
      for (const accent of accents) {
        expect(accent, `${pattern.name} accent`).toBeGreaterThanOrEqual(0)
        expect(accent, `${pattern.name} accent`).toBeLessThan(pattern.nbBeatsInPattern)
      }
      const ascending = accents.every((v, i) => i === 0 || v > accents[i - 1]!)
      expect(ascending, `${pattern.name} accents ${accents.join(',')}`).toBe(true)
    }
  )

  // An accent is a slot index, on the same grid as the instruments. Fourteen
  // patterns inherited from A Compás had theirs written on a grid half the size
  // - Bossa Nova's [0, 3, 6, 10, 13] is its clave counted in sixteen steps,
  // while its instruments play that clave on slots 0, 6, 12, 20 and 26 of
  // thirty-two - so the red discs fell between the counted beats and on slots
  // nothing played. Whether a palo's accents are musically right is not
  // something a test can say; landing on the grid's counted beats is.
  it.each(patterns.map(p => [p.__file, p.name, p] as const))(
    '%s / %s has every accent on a counted beat',
    (_file, _name, pattern) => {
      const labels = (pattern.sequences.beatLabels ?? []) as (string | number | null)[]
      const offGrid = (pattern.accents ?? []).filter(slot => (labels[slot] ?? null) === null)
      expect(offGrid, `${pattern.name} accents on slots with no beat label`).toEqual([])
    }
  )

  it.each(patterns.map(p => [p.__file, p.name, p] as const))(
    '%s / %s orders its tempos min <= slow <= default <= fast <= max',
    (_file, _name, p) => {
      expect(p.minTempo).toBeLessThanOrEqual(p.slowTempo)
      expect(p.slowTempo).toBeLessThanOrEqual(p.defaultTempo)
      expect(p.defaultTempo).toBeLessThanOrEqual(p.fastTempo)
      expect(p.fastTempo).toBeLessThanOrEqual(p.maxTempo)
    }
  )

  it('has no duplicate pattern names', () => {
    const names = patterns.map(p => p.name)
    expect(names.filter((n, i) => names.indexOf(n) !== i)).toEqual([])
  })
})

// The compas and its realization are different things: `accents` is the
// theoretical pulse and carries no sound (the README is explicit that it is
// "just a visual help"), while each instrument sequence is one way of playing
// against that pulse. The click is the exception - it is the audible form of
// the pulse itself, so it is the one instrument whose strongest hits must land
// exactly on the accents. That is what makes it a trustworthy reference when
// the dots and the palmas disagree, as they do in abandolaos, where the pulse
// falls on 6/2/4 and the palmas claras on 1/3.
//
// It holds for the flamenco family only. Elsewhere the click marks the bar
// start and `accents` carries the whole rhythmic cell.
describe('flamenco click matches the compas', () => {
  const flamenco = patterns.filter(p => p.__file === 'flamenco.ts' && p.name !== 'simple-click')

  it('covers the flamenco patterns', () => {
    expect(flamenco.length).toBeGreaterThan(10)
  })

  it.each(flamenco.map(p => [p.name, p] as const))(
    "%s: the click's strongest hits are exactly the accents",
    (_name, pattern) => {
      const click = pattern.sequences.click as (number | null)[] | undefined
      expect(click, `${pattern.name} has no click sequence`).toBeDefined()

      const strongest = click!
        .map((value, slot) => (value === 1 ? slot : null))
        .filter((slot): slot is number => slot !== null)

      expect(strongest).toEqual([...pattern.accents])
    }
  )
})
