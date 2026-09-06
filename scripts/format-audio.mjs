#!/usr/bin/env node
//
// Convert the .wav masters in audio/ into the formats the app plays, writing
// them into public/audio/ under the same tree.
//
// The masters used to live in public/audio beside their output, and everything
// in public/ is copied verbatim into every build - so 51 MB of source files
// nobody can play shipped in the web deploy, the desktop app and the Android
// APK, which was 91 MB of which about three quarters was waste. Sources belong
// where they cannot be served, the same reason resources/artwork exists.
//
// Only the .wav files are committed; everything under public/audio is generated
// and gitignored. `yarn audio` runs this, and `yarn install` runs that, so a
// fresh clone gets playable audio without a manual step. The install passes
// --optional, so a missing ffmpeg warns instead of failing the whole
// dependency install.
//
// This was a Python script until the Windows setup showed what that cost:
// `python3` is not a command Windows supplies under that name, so `yarn
// install` failed on a machine that had everything else it needed. Node is
// already a hard requirement, so rewriting it here removes an interpreter from
// the prerequisites rather than adding a way to find one.

import { accessSync, constants, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import path from 'node:path'

// Every path below is relative to the repository root, so anchor there rather
// than trusting the caller's directory - the same thing packaging/build-desktop.mjs
// does. `yarn audio` would be fine either way; `node scripts/format-audio.mjs`
// from anywhere else would not.
process.chdir(path.resolve(import.meta.dirname, '..'))

const SOURCEDIR = 'audio'
const OUTPUTDIR = 'public/audio'
const SOUNDSDATA = 'src/assets/data/soundsData.ts'

/**
 * The formats the app actually reaches, newest-preferred first.
 *
 * mp4 and ogg were dropped: metronome.ts picks flac when the browser reports
 * it, and every engine since roughly 2017 does - including WKWebView, verified
 * by playing the app on an iPhone. The two of them added 6.3 MB to every
 * download to cover a case that cannot arise. mp3 stays as the one fallback,
 * for an engine old enough to report no flac support.
 */
const EXTENSIONS = ['flac', 'mp3']

/** Where a master's generated output goes: audio/x/y.wav -> public/audio/x/y */
function outputBase (wav) {
  return path.join(OUTPUTDIR, path.relative(SOURCEDIR, wav).slice(0, -'.wav'.length))
}

/**
 * The medias the app actually asks for, as `src` values from soundsData.
 *
 * The masters are a library and the app plays a selection from it: 57 of the
 * 321 under audio/. Converting the rest generated 24 MB that nothing ever
 * fetches - and public/ is copied verbatim into every build, so that rode along
 * in the web deploy, the Electron app, the iOS app and the Android APK. This is
 * the same waste the note at the top of this file describes, one step further
 * down: moving the masters out fixed the sources, and this fixes the output.
 *
 * Nothing is lost by it. The masters stay committed under audio/, so adding a
 * media to soundsData is all it takes for this to generate it on the next run.
 *
 * Read with a regex rather than imported, because this is a plain .mjs script
 * and soundsData is TypeScript. That is fragile in one direction only - a
 * change to how the file is written would match fewer entries, never more - so
 * a suspiciously small answer stops the run rather than quietly shipping an
 * app with no audio in it.
 */
function referencedMedias () {
  if (!existsSync(SOUNDSDATA)) {
    console.error(`ERROR: cannot find ${SOUNDSDATA}, so there is no way to tell`)
    console.error('which medias the app uses. Refusing to guess.')
    process.exit(1)
  }

  const source = readFileSync(SOUNDSDATA, 'utf8')
  const medias = new Set([...source.matchAll(/src:\s*'([^']+)'/g)].map(m => m[1]))

  // Ten instruments carrying 58 medias between them at the time of writing.
  // A handful would mean the pattern stopped matching, not that the app shrank.
  if (medias.size < 20) {
    console.error(`ERROR: found only ${medias.size} medias in ${SOUNDSDATA}.`)
    console.error('That looks like a parse failure rather than a real change.')
    process.exit(1)
  }
  return medias
}

/** The output bases those medias resolve to, for comparing against a master. */
function referencedBases () {
  return new Set([...referencedMedias()].map(
    src => path.join(OUTPUTDIR, ...src.split('/'))
  ))
}

/** The first executable named `name` on PATH, or null - shutil.which in Node. */
function which (name) {
  // On Windows the name on disk carries an extension that the command line
  // omits, and PATHEXT is the list to try.
  const extensions = process.platform === 'win32'
    ? (process.env.PATHEXT ?? '.COM;.EXE;.BAT;.CMD').split(';')
    : ['']

  for (const dir of (process.env.PATH ?? '').split(path.delimiter)) {
    if (dir === '') continue
    for (const extension of extensions) {
      const candidate = path.join(dir, name + extension)
      try {
        if (!statSync(candidate).isFile()) continue
        accessSync(candidate, constants.X_OK)
        return candidate
      } catch {
        // Not here, or not runnable. Keep looking.
      }
    }
  }
  return null
}

/** Recurse a directory, yielding its .wav files in a stable order. */
function * walk (dir) {
  const entries = readdirSync(dir, { withFileTypes: true })
    .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))

  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) yield * walk(full)
    else if (entry.name.endsWith('.wav')) yield full
  }
}

function * wavFiles (directory) {
  const root = directory ? path.join(SOURCEDIR, directory) : SOURCEDIR
  if (!existsSync(root)) {
    // A mistyped subdirectory used to convert nothing and report success.
    console.error(`ERROR: no such directory: ${root}`)
    process.exit(1)
  }
  yield * walk(root)
}

/** Report the absent converter, and return the exit status to stop with. */
function missingFfmpeg (optional) {
  const label = optional ? 'WARNING' : 'ERROR'
  console.log(`${label}: ffmpeg not found, so the audio cannot be generated.`)
  console.log('The app will not play anything without it.')
  console.log('Install it, then run `yarn install` again or `yarn audio` on its own:')
  console.log('  macOS    brew install ffmpeg')
  console.log('  Windows  winget install Gyan.FFmpeg')
  console.log('  Linux    sudo apt install ffmpeg')
  return optional ? 0 : 1
}

/** Run an external tool, working around how Windows exposes some of them. */
function spawnTool (executable, args) {
  const suffix = executable.slice(-4).toLowerCase()

  // Node refuses to spawn .bat/.cmd directly (it is the fix for
  // CVE-2024-27980), so a shim-style ffmpeg - Scoop installs one - has to name
  // the interpreter. A shell command line is a single string, hence the
  // quoting; without this the failure is a bare EINVAL that says nothing.
  if (process.platform === 'win32' && (suffix === '.bat' || suffix === '.cmd')) {
    const line = [executable, ...args].map(arg => `"${arg.replace(/"/g, '""')}"`).join(' ')
    return spawnSync(process.env.COMSPEC ?? 'cmd.exe', ['/d', '/s', '/c', `"${line}"`], {
      stdio: 'inherit',
      windowsVerbatimArguments: true
    })
  }
  return spawnSync(executable, args, { stdio: 'inherit' })
}

/** Remove directories left empty under public/audio once the unused output goes. */
function pruneEmptyDirs (dir) {
  if (!existsSync(dir)) return false
  let empty = true
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (!pruneEmptyDirs(full)) empty = false
    } else {
      empty = false
    }
  }
  if (empty && dir !== OUTPUTDIR) rmSync(dir, { recursive: true })
  return empty
}

function convert (directory, optional) {
  let converted = 0
  let skipped = 0
  let pruned = 0

  const wanted = referencedBases()

  // Looked up on the first file that actually needs converting, not on entry.
  // Everything here is generated against the .wav masters, so a tree that is
  // already up to date - a fresh clone with a warm CI cache, or a second
  // `yarn install` - needs no converter at all, and demanding one there fails
  // a build that had nothing to do.
  let ffmpeg

  for (const wav of wavFiles(directory)) {
    const base = outputBase(wav)

    // A master in the library that no instrument names. Delete anything an
    // earlier run generated from it, so a tree built before this check shrinks
    // on the next `yarn audio` instead of staying 24 MB heavier until someone
    // notices and removes it by hand.
    if (!wanted.has(base)) {
      for (const extension of EXTENSIONS) {
        const out = `${base}.${extension}`
        if (existsSync(out)) {
          rmSync(out)
          pruned++
        }
      }
      continue
    }

    const wavModified = statSync(wav).mtimeMs
    mkdirSync(path.dirname(base), { recursive: true })

    for (const extension of EXTENSIONS) {
      const out = `${base}.${extension}`

      // Already generated and no older than its source: nothing to do.
      if (existsSync(out) && statSync(out).mtimeMs >= wavModified) {
        skipped++
        continue
      }

      if (ffmpeg === undefined) ffmpeg = which('ffmpeg')
      if (ffmpeg === null) return missingFfmpeg(optional)

      // A converter that is present but fails is a real error in both modes:
      // --optional forgives ffmpeg being absent, nothing else.
      const run = spawnTool(ffmpeg, ['-y', '-loglevel', 'error', '-i', wav, out])
      if (run.error !== undefined) throw run.error
      if (run.status !== 0) {
        console.error(`ERROR: ffmpeg exited ${run.status} converting ${wav}`)
        return 1
      }
      converted++
    }
  }

  if (pruned > 0) pruneEmptyDirs(OUTPUTDIR)

  const unused = pruned > 0 ? `, ${pruned} removed as unused` : ''
  console.log(`Audio: ${converted} converted, ${skipped} already up to date${unused}.`)
  return 0
}

function unconvert (directory) {
  let removed = 0
  for (const wav of wavFiles(directory)) {
    const base = outputBase(wav)
    for (const extension of EXTENSIONS) {
      const out = `${base}.${extension}`
      if (existsSync(out)) {
        rmSync(out)
        removed++
      }
    }
  }
  console.log(`Audio: removed ${removed} generated files.`)
  return 0
}

function showHelp () {
  console.log('Usage: node scripts/format-audio.mjs [convert|unconvert] [directory] [--optional]')
  console.log('  convert     Generate the playable formats from the .wav masters')
  console.log('  unconvert   Delete the generated formats')
  console.log('  directory   Limit to a subdirectory of audio/ (optional)')
  console.log('  --optional  Warn instead of failing when ffmpeg is not installed')
}

const args = process.argv.slice(2)
const flags = args.filter(arg => arg.startsWith('-'))
const words = args.filter(arg => !arg.startsWith('-'))

const action = words[0] ?? '--help'
const directory = words[1]

if (action === 'convert') {
  process.exit(convert(directory, flags.includes('--optional')))
} else if (action === 'unconvert') {
  process.exit(unconvert(directory))
} else {
  showHelp()
  process.exit(words.length === 0 ? 0 : 1)
}
