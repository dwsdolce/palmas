// @vitest-environment node
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
// @ts-expect-error - a plain .mjs script, no type declarations
import { releaseProblems } from '../scripts/check-release-ready.mjs'

/**
 * The release guard, against real git repositories made for each test.
 *
 * The rule: after a release, roll the version and the release notes before
 * building anything else. These are the states a tree can be in around a
 * release, and what the guard must say about each.
 */

type Entry = { version: string, build: string }

let root: string

const git = (...args: string[]) =>
  execFileSync('git', ['-C', root, ...args], { stdio: 'ignore' })

/** package.json and a changelog.ts in the shape the real one has. */
const writeTree = (version: string, entries: Entry[]) => {
  writeFileSync(path.join(root, 'package.json'), JSON.stringify({ name: 'palmas', version }, null, 2))
  const body = entries.map(e => `  {
    id: 'v${e.version.replaceAll('.', '_')}',
    version: '${e.version}',
    date: '2026-01-01',
    build: ${e.build}
  }`).join(',\n')
  mkdirSync(path.join(root, 'src/assets/data'), { recursive: true })
  writeFileSync(path.join(root, 'src/assets/data/changelog.ts'),
    `// build: process.env.APP_BUILD in a comment must not count\nexport default [\n${body}\n]\n`)
}

const commit = (message: string) => {
  git('add', '-A')
  git('-c', 'user.name=test', '-c', 'user.email=test@example.com', 'commit', '-q', '--allow-empty', '-m', message)
}

const AUTO = 'process.env.APP_BUILD'

beforeEach(() => {
  root = mkdtempSync(path.join(tmpdir(), 'palmas-release-guard-'))
  git('init', '-q')
})

afterEach(() => rmSync(root, { recursive: true, force: true }))

/** A released 1.0.0, tagged v1.0.0, whose newest entry still auto-binds. */
const released = () => {
  writeTree('1.0.0', [{ version: '1.0.0', build: AUTO }])
  commit('1.0.0')
  git('tag', 'v1.0.0')
}

describe('the release guard', () => {
  it('says nothing outside a git repository', () => {
    rmSync(path.join(root, '.git'), { recursive: true, force: true })
    writeTree('1.0.0', [{ version: '1.0.0', build: AUTO }])
    expect(releaseProblems(root)).toEqual([])
  })

  it('says nothing before Palmas has a release of its own', () => {
    writeTree('1.0.0', [{ version: '1.0.0', build: AUTO }])
    commit('first')
    expect(releaseProblems(root)).toEqual([])
  })

  it("ignores A Compás's bare tags, even one matching the version", () => {
    // A clone that fetched upstream holds tags like 1.0.2. Taking that for
    // Palmas 1.0.2 would judge the tree against an unrelated upstream commit.
    writeTree('1.0.2', [{ version: '1.0.2', build: AUTO }])
    commit('upstream')
    git('tag', '1.0.2')
    commit('later')
    expect(releaseProblems(root)).toEqual([])
  })

  it("judges the tree by Palmas's last release when a bare tag is nearer", () => {
    // A merge from A Compás can bring a bare tag in after Palmas's own. Judged
    // against that tag, the un-rolled 1.0.0 notes below would go unnoticed.
    released()
    commit('merge from upstream')
    git('tag', '4.2.0')
    commit('a fix')

    const problems = releaseProblems(root).join('\n')
    expect(problems).toContain('RELEASE NOTES NOT ROLLED OVER after v1.0.0')
  })

  it('lets the tagged release itself be rebuilt', () => {
    released()
    expect(releaseProblems(root)).toEqual([])
  })

  it('stops the first commit after a release, naming both things to roll', () => {
    released()
    commit('a fix')

    const problems = releaseProblems(root).join('\n')
    expect(problems).toContain('STALE VERSION NUMBER')
    expect(problems).toContain('RELEASE NOTES NOT ROLLED OVER after v1.0.0')
  })

  it('still stops it with the version bumped but the notes not rolled', () => {
    released()
    writeTree('1.0.1', [{ version: '1.0.0', build: AUTO }])
    commit('bump only')

    const problems = releaseProblems(root)
    expect(problems).toHaveLength(1)
    expect(problems[0]).toContain('NOT ROLLED OVER')
    // The fix names the build to freeze at, from the tag: one commit, so 1.
    expect(problems[0]).toContain("build: '1'")
  })

  it('stops a shipped entry that still takes the current build', () => {
    released()
    writeTree('1.0.1', [
      { version: '1.0.1', build: AUTO },
      { version: '1.0.0', build: AUTO }
    ])
    commit('new entry, old one not frozen')

    const problems = releaseProblems(root)
    expect(problems).toHaveLength(1)
    expect(problems[0]).toContain('MORE THAN ONE ENTRY TAKES THE CURRENT BUILD')
  })

  it('passes once the version is bumped and the notes rolled', () => {
    released()
    writeTree('1.0.1', [
      { version: '1.0.1', build: AUTO },
      { version: '1.0.0', build: "'1'" }
    ])
    commit('rolled')
    expect(releaseProblems(root)).toEqual([])
  })
})
