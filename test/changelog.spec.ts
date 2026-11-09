import { describe, it, expect } from 'vitest'
import changelog from 'src/assets/data/changelog'
import enUS from 'src/i18n/en-US'

// The data file carries metadata; the notes live in the catalogues under
// doc.changelog.releases.<id> so that they are translated. That split is the
// thing worth checking: an entry whose id names no catalogue key renders an
// empty release, and a catalogue key no entry points at is never shown at all.
//
// Whether every *locale* carries those notes is test/i18n.spec.ts's job - it
// requires each locale to hold every key en-US does, arrays included, so a
// release added in English alone fails there rather than here.
const releases = (enUS as unknown as {
  doc: { changelog: { releases: Record<string, string[]> } }
}).doc.changelog.releases

describe('changelog data', () => {
  it('has entries', () => {
    expect(changelog.length).toBeGreaterThan(0)
  })

  it.each(changelog.map((e, i) => [e.version, e, i] as const))('%s is well formed', (_v, entry, index) => {
    expect(entry.version).toMatch(/^\d+\.\d+\.\d+$/)
    expect(Number.isNaN(Date.parse(entry.date)), `${entry.date} is not a date`).toBe(false)

    // vue-i18n reads a dot as a path separator, so an id containing one would
    // silently resolve to a nested object rather than the release's notes.
    expect(entry.id, `${entry.id} must not contain a dot`).not.toMatch(/\./)

    const notes = releases[entry.id]
    expect(notes, `no notes at doc.changelog.releases.${entry.id}`).toBeDefined()
    // The newest entry is the release in progress, begun the moment the last
    // one shipped and empty until its notes are written. Every shipped release
    // must have them.
    if (index > 0) expect(notes!.length, `${entry.version} shipped with no notes`).toBeGreaterThan(0)
    for (const note of notes!) expect(note.trim()).not.toBe('')
  })

  it('lists each version once', () => {
    const versions = changelog.map(e => e.version)
    expect(versions.filter((v, i) => versions.indexOf(v) !== i)).toEqual([])
  })

  it('has no release notes that no entry points at', () => {
    const ids = new Set(changelog.map(e => e.id))
    expect(Object.keys(releases).filter(id => !ids.has(id))).toEqual([])
  })

  it('runs newest first', () => {
    const dates = changelog.map(e => Date.parse(e.date))
    expect(dates.every((d, i) => i === 0 || d <= dates[i - 1]!)).toBe(true)
  })
})
