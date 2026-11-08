#!/usr/bin/env node

// Refuse to run or build against a stale release identity.
//
// The rule, the same one every Guitar Tap edition enforces (guitar_tap's
// _release_guard.py, GuitarTap's and GuitarTapWeb's check-release-ready.sh):
// **any development after a release must roll the version number AND roll the
// release notes.** Until both are done the tree claims to be a release that has
// already shipped, and everything built from it is mislabelled - the header, the
// changelog, a bug report, an App Store upload.
//
// Two conditions, both reported in one run so they can be fixed in one pass:
//
//   1. STALE VERSION - package.json's version is already tagged (v<version>)
//      and HEAD has moved past that tag.
//   2. UN-ROLLED RELEASE NOTES - src/assets/data/changelog.ts still has the
//      shipped release as its newest entry, or more than one entry takes its
//      build from `process.env.APP_BUILD`.
//
// Why the second matters: the newest entry's build number is never typed. It is
// `process.env.APP_BUILD`, the git commit count the build stamps into the header,
// so the two cannot disagree. That is right for the release in progress and
// wrong for any release already shipped - left in place, a shipped release's
// entry silently re-labels itself with every new build. 1.0.0's entry was typed
// by hand as 868 and shipped as 931; this is what stops that happening again.
// Rolling over means freezing the shipped entry at the build it went out as,
// `git rev-list --count v<version>`, and adding a new entry above it.
//
// Both conditions are gated on HEAD having moved past the last release, so at
// the tag itself nothing fires - rebuilding the release just cut is legitimate.
// They fire on the first commit after a release and go quiet once the version is
// bumped and the notes rolled: once per release cycle, not once per run.
//
// Only Palmas's own tags count, the ones starting with "v". A clone that fetched
// from A Compás also holds its bare tags - 1.0.2 through 4.1.5 - and matching a
// bare version would take Palmas 1.0.2 for A Compás's.
//
// Skips silently when it cannot evaluate: no git, or no Palmas tag yet. There is
// deliberately no override; an escape hatch gets used once under time pressure
// and then shipped from.
//
// Run by quasar.config.js before every build and dev server, in every mode.
// Not by `yarn test` or `quasar prepare`: the version means nothing to either.
//
// Usage: node scripts/check-release-ready.mjs

import { execFileSync } from 'node:child_process'
import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const NOTES_REL = 'src/assets/data/changelog.ts'

/** The build line that binds an entry to the build being made. */
const AUTOBIND = /^\s*build: process\.env\.APP_BUILD,?\s*$/gm

const gitIn = root => (...args) => {
  try {
    return execFileSync('git', ['-C', root, ...args], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim()
  } catch {
    return null
  }
}

/**
 * Every reason the tree at `root` is not ready, as messages. Empty when it is,
 * or when there is nothing to judge it against.
 */
export function releaseProblems (root) {
  const git = gitIn(root)

  if (git('rev-parse', '--git-dir') === null) return []

  const latestTag = git('describe', '--tags', '--abbrev=0', '--match', 'v[0-9]*')
  if (!latestTag) return []

  // Nothing developed since the last release: nothing to roll yet.
  const ahead = Number(git('rev-list', '--count', `${latestTag}..HEAD`) ?? 0)
  if (!(ahead > 0)) return []

  const problems = []
  const latestVersion = latestTag.slice(1)

  // ------------------------------------------------------ 1. stale version
  let version
  try {
    version = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8')).version
  } catch {
    version = undefined
  }

  if (typeof version !== 'string' || version === '') {
    problems.push('"version" could not be read from package.json.')
  } else if (git('rev-parse', '-q', '--verify', `refs/tags/v${version}`) !== null) {
    const versionAhead = Number(git('rev-list', '--count', `v${version}..HEAD`) ?? 0)
    if (versionAhead > 0) {
      problems.push(`STALE VERSION NUMBER

  package.json says ${version}, which is already released (tag v${version}
  exists), but HEAD is ${versionAhead} commit(s) newer.

  Every platform reads its version from there, so this would label newer code
  as the released ${version} - in the header, the changelog, the App Store.

  FIX: bump "version" in package.json to the next release number.
       Tag the new version only at release time.`)
    }
  }

  // ----------------------------------------------- 2. release notes rolled
  const notesPath = path.join(root, NOTES_REL)
  if (!existsSync(notesPath)) {
    problems.push(`RELEASE NOTES MISSING

  ${NOTES_REL} could not be read, so the roll-over after ${latestTag}
  cannot be verified.`)
  } else {
    const notes = readFileSync(notesPath, 'utf8')
    const entries = notes.slice(notes.indexOf('export default'))
    const topVersion = entries.match(/^\s*version: '([^']+)'/m)?.[1]
    const autobound = (notes.match(AUTOBIND) ?? []).length
    const shippedBuild = git('rev-list', '--count', latestTag)

    if (topVersion === latestVersion) {
      problems.push(`RELEASE NOTES NOT ROLLED OVER after ${latestTag}

  ${NOTES_REL} still has ${latestVersion} as its newest entry, so the next
  build would show ${latestVersion}'s already-shipped notes under a new build
  number, with nowhere to say what has changed since.

  FIX:
    1. Freeze the ${latestVersion} entry at the build it shipped as - replace
       'build: process.env.APP_BUILD' with build: '${shippedBuild}'.
    2. Add a new entry above it for the release in progress, with
       build: process.env.APP_BUILD and a translation in every locale.`)
    } else if (autobound > 1) {
      problems.push(`RELEASE NOTES: MORE THAN ONE ENTRY TAKES THE CURRENT BUILD

  'build: process.env.APP_BUILD' appears ${autobound} times in ${NOTES_REL}.
  It is the build being made, so only the newest, unreleased entry may use it;
  a shipped entry that still does re-labels itself on every build.

  FIX: freeze every entry but the newest at the build it shipped as -
       'git rev-list --count v<version>' gives that number.`)
    }
  }

  return problems
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isMain) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
  const problems = releaseProblems(root)
  if (problems.length > 0) {
    const bar = '='.repeat(72)
    console.error(`${bar}\nBLOCKED - this tree is not ready for development after a release.\n`)
    console.error(problems.join('\n\n'))
    console.error(bar)
    process.exit(1)
  }
}
