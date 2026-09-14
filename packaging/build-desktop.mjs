#!/usr/bin/env node
//
// Build the desktop application for whichever platform you are on.
//
//   node packaging/build-desktop.mjs              installers for this platform
//   node packaging/build-desktop.mjs --unpacked   just the app directory, no installers
//   node packaging/build-desktop.mjs --app        macOS: stop after the .app, no disk image
//   node packaging/build-desktop.mjs --help
//
// electron-builder does not cross-compile: run this on the platform you want a
// package for. One script rather than one per platform, because Node is
// necessarily present - you cannot build an Electron app without it - so the
// bootstrap problem that justifies setup.ps1 and setup.sh does not apply here.
//
// Signing is opt-in everywhere. Credentials live in a file outside the
// repository, and without it the build simply goes unsigned, which is the right
// outcome for anyone who is not the maintainer.

import { existsSync, readFileSync, rmSync, readdirSync, statSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import os from 'node:os'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
process.chdir(ROOT)

const WIN = process.platform === 'win32'
const MAC = process.platform === 'darwin'

// VS Code's plugin host exports ELECTRON_RUN_AS_NODE=1 and every shell it
// spawns inherits it, so a build started from an editor terminal gets it even
// though no dotfile sets it. It makes the Electron binary run as plain Node -
// no app, no BrowserWindow, no window - and the failure reads as a broken
// build rather than a broken environment. Nothing here ever wants it set.
delete process.env.ELECTRON_RUN_AS_NODE

if (process.argv.includes('--help')) {
  console.log('Usage: node packaging/build-desktop.mjs [--unpacked | --app]')
  console.log('  (no options)  build the installers for this platform')
  console.log('  --unpacked    stop after the unpacked app directory - much faster,')
  console.log('                and what the end-to-end tests launch')
  console.log('  --app         macOS only: stop after the signed .app, leaving the')
  console.log('                disk image unsigned and un-notarised')
  process.exit(0)
}

const unpackedOnly = process.argv.includes('--unpacked')
const appOnly = process.argv.includes('--app')

if (unpackedOnly && appOnly) {
  console.error('\nERROR: --unpacked and --app cannot be combined.\n')
  process.exit(1)
}
if (appOnly && !MAC) {
  console.error('\nERROR: --app is macOS only; there is no .app on this platform.\n')
  process.exit(1)
}

// ------------------------------------------------------------------ helpers

const heading = title => console.log(`\n${title}\n${'-'.repeat(title.length)}`)

const fail = message => {
  console.error(`\nERROR: ${message}\n`)
  process.exit(1)
}

/** Run a command, letting its output through. Returns the exit status. */
function run (command, args) {
  const result = spawnSync(command, args, { stdio: 'inherit' })
  if (result.error !== undefined) throw result.error
  return result.status
}

/** Run a command and capture stdout and stderr together, as `cmd 2>&1` does. */
function capture (command, args) {
  const result = spawnSync(command, args, { encoding: 'utf8' })
  if (result.error !== undefined) throw result.error
  return { status: result.status, output: `${result.stdout ?? ''}${result.stderr ?? ''}` }
}

/** Read a shell-style settings file: KEY=value, optional `export`, optional quotes. */
function readSettings (file) {
  if (!existsSync(file)) return {}

  const values = {}
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    const match = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/)
    if (match === null) continue

    const [, name, rest] = match
    // Strip a trailing comment only when the value is not quoted, and then the
    // surrounding quotes. A password may legitimately contain a '#'.
    const raw = rest.trim()
    const quoted = /^(['"])(.*)\1\s*$/.exec(raw)
    const value = quoted === null ? raw.replace(/\s+#.*$/, '').trim() : quoted[2]
    // These files are written to be `source`d, and ours rely on it: the Tauri
    // aliases are defined as "$CODESIGN_IDENTITY", and one path as "$HOME/...".
    // Left as written they reach electron-builder verbatim, which reports no
    // such identity in the keychain, skips signing, and ships an unsigned app
    // that only Apple's notary service rejects. Single quotes suppress
    // expansion, as in a shell, so a password containing a '$' survives.
    values[name] = quoted?.[1] === "'" ? value : expand(value, values)
  }
  return values
}

/**
 * Substitute $NAME and ${NAME}, preferring a name defined earlier in the same
 * file over the surrounding environment. An undefined name becomes empty and a
 * backslash escapes the '$', both as a shell would have it.
 */
function expand (value, values) {
  const reference = /\\?\$(?:\{([A-Za-z_][A-Za-z0-9_]*)\}|([A-Za-z_][A-Za-z0-9_]*))?/g
  return value.replace(reference, (whole, braced, bare) => {
    if (whole.startsWith('\\')) return whole.slice(1)
    const name = braced ?? bare
    // A '$' that no name follows is literal, as it is in a shell.
    if (name === undefined) return whole
    return values[name] ?? process.env[name] ?? ''
  })
}

const megabytes = bytes => `${(bytes / 1024 / 1024).toFixed(1)} MB`

const PACKAGED = path.join(ROOT, 'dist', 'electron', 'Packaged')

/**
 * Locate the application bundle by extension rather than by name. The script
 * this replaces looked for a hard-coded `Acompas.app`, so it stopped finding
 * anything the moment the app was renamed - and reported that as a build which
 * had produced nothing.
 */
function findAppBundle () {
  if (!existsSync(PACKAGED)) return undefined
  for (const entry of readdirSync(PACKAGED)) {
    const full = path.join(PACKAGED, entry)
    if (!statSync(full).isDirectory()) continue
    const bundle = readdirSync(full).find(name => name.endsWith('.app'))
    if (bundle !== undefined) return path.join(full, bundle)
  }
  return undefined
}

/** The first executable named `name` on PATH, or null. */
function onPath (name) {
  for (const dir of (process.env.PATH ?? '').split(path.delimiter)) {
    if (dir === '') continue
    const candidate = path.join(dir, name)
    if (existsSync(candidate)) return candidate
  }
  return null
}

// ------------------------------------------------------------------ preflight

heading('Checking the project')

if (!existsSync(path.join(ROOT, 'node_modules'))) {
  fail('Dependencies are not installed. Run: node scripts/setup.mjs')
}

// The `electron` package is a wrapper around a runtime downloaded separately,
// and as of Electron 44 no install fetches it: the postinstall hook that used
// to is gone, replaced by an `install-electron` command. So a clean `yarn
// install` reaches here with nothing for electron-builder to package, and the
// error it gives on its own says very little.
if (!existsSync(path.join(ROOT, 'node_modules', 'electron', 'path.txt'))) {
  fail('The Electron runtime is missing, so there is nothing to package.\n' +
    '       Fix it with: npx install-electron')
}

const quasar = path.join(ROOT, 'node_modules', '@quasar', 'app-vite', 'bin', 'quasar.js')
if (!existsSync(quasar)) fail('The Quasar CLI was not found. Run: node scripts/setup.mjs')

// The Linux build produces an AppImage, a .deb and an .rpm. Only the .rpm
// needs anything from outside the project: electron-builder's fpm target
// shells out to rpmbuild, which Debian-family machines - the ones most likely
// to be building this - do not have by default. fpm fails deep inside its own
// output when it is missing, so catch it here where the fix fits on one line.
if (!WIN && !MAC && !unpackedOnly && onPath('rpmbuild') === null) {
  fail('rpmbuild is missing, so the .rpm cannot be built.\n' +
    '       Install it:  sudo apt install rpm       (Debian, Ubuntu, Mint)\n' +
    '                    sudo dnf install rpm-build (Fedora, RHEL)\n' +
    '       Or drop \'rpm\' from electron.builder.linux.target in quasar.config.js.')
}

console.log(`  platform    ${process.platform} ${process.arch}`)
console.log(`  electron    ${JSON.parse(readFileSync(path.join(ROOT, 'node_modules/electron/package.json'), 'utf8')).version}`)

// ------------------------------------------------------------------- signing

heading('Signing')

// One file per platform, outside every repository, so no credential is baked
// into the source and there is a single place to edit it. macsign.env is the
// name the other macOS ports here already use.
const settingsFile = process.env.PALMAS_SIGN_ENV ??
  path.join(os.homedir(), '.config', MAC ? 'macsign.env' : 'winsign.env')

const settings = readSettings(settingsFile)

if (MAC) {
  // The zsh script this replaces `source`d the settings file, so every exported
  // name in it reached electron-builder through the environment. Copy them all
  // across for the same reason, then correct the two that cannot be passed
  // through as written.
  for (const [name, value] of Object.entries(settings)) process.env[name] = value

  // CSC_NAME wants the common name on its own: given the full string,
  // electron-builder refuses with "Please remove prefix 'Developer ID
  // Application:' from the specified name". codesign, used further down for the
  // disk image, takes either form, so only this one is trimmed.
  const identity = settings.APPLE_SIGNING_IDENTITY ?? settings.CODESIGN_IDENTITY
  if (identity !== undefined && identity !== '') {
    process.env.CSC_NAME = identity.replace(/^Developer ID Application: /, '')
  }

  // electron-builder takes notarisation credentials from one of three sets of
  // environment variables, tried in this order:
  // APPLE_ID/APPLE_APP_SPECIFIC_PASSWORD/APPLE_TEAM_ID, then
  // APPLE_API_KEY/APPLE_API_KEY_ID/APPLE_API_ISSUER, then APPLE_KEYCHAIN_PROFILE.
  //
  // The API key set is a trap for this settings file, because the names collide
  // but the meanings do not: electron-builder wants APPLE_API_KEY to be the path
  // to the .p8 file and APPLE_API_KEY_ID to be the key id, whereas the file
  // holds the id in APPLE_API_KEY and the path in APPLE_API_KEY_PATH. Worse, the
  // check fails closed - any one of the three being set makes all three
  // mandatory - so passing the file through unaltered aborts the build with
  // "Env vars APPLE_API_KEY, APPLE_API_KEY_ID and APPLE_API_ISSUER need to be
  // set" and never reaches the keychain profile, which would have worked as it
  // stands.
  if (settings.APPLE_API_KEY_PATH !== undefined &&
      settings.APPLE_API_KEY !== undefined &&
      settings.APPLE_API_ISSUER !== undefined) {
    process.env.APPLE_API_KEY_ID = settings.APPLE_API_KEY
    process.env.APPLE_API_KEY = settings.APPLE_API_KEY_PATH
  } else {
    // Incomplete, so let the keychain profile answer for it instead.
    delete process.env.APPLE_API_KEY
    delete process.env.APPLE_API_KEY_ID
    delete process.env.APPLE_API_ISSUER
  }

  if (process.env.CSC_NAME === undefined || process.env.CSC_NAME === '') {
    console.log('  no signing identity configured - building unsigned.')
    console.log('  Gatekeeper will warn on another Mac; the user has to right-click')
    console.log('  then Open. To sign and notarise instead, put this in')
    console.log(`  ${settingsFile}:`)
    console.log('\n      export APPLE_SIGNING_IDENTITY="Developer ID Application: Your Name (TEAMID)"')
    console.log('      export APPLE_KEYCHAIN_PROFILE="notarytool-profile"')
    console.log('      export CODESIGN_IDENTITY="Developer ID Application: Your Name (TEAMID)"')
    console.log('      export NOTARY_PROFILE="notarytool-profile"\n')
    console.log('  Store the notary profile once with: xcrun notarytool store-credentials\n')
  } else {
    console.log(`  signing as ${process.env.CSC_NAME}`)
  }
} else if (WIN) {
  // electron-builder reads a PKCS#12 certificate from CSC_LINK (a path or a
  // base64 blob) and its password from CSC_KEY_PASSWORD. Both must be present
  // for signing to happen at all.
  const link = settings.CSC_LINK ?? settings.WIN_CSC_LINK
  const password = settings.CSC_KEY_PASSWORD ?? settings.WIN_CSC_KEY_PASSWORD

  if (link !== undefined && password !== undefined) {
    process.env.CSC_LINK = link
    process.env.CSC_KEY_PASSWORD = password
    console.log(`  signing with the certificate named in ${settingsFile}`)
  } else {
    console.log('  no certificate configured - building unsigned.')
    console.log('  Windows SmartScreen will warn on another machine; the user has to')
    console.log('  choose "More info" then "Run anyway". To sign instead, put this in')
    console.log(`  ${settingsFile}:`)
    console.log('\n      CSC_LINK="/path/to/certificate.pfx"')
    console.log('      CSC_KEY_PASSWORD="..."\n')
  }
} else {
  console.log('  Linux packages are not signed; nothing to configure.')
}

// -------------------------------------------------------------------- build

heading('Building')

// Only the packaged output goes. node_modules, the generated icons and the
// converted audio are left alone - regenerating them costs minutes and nothing
// in them goes stale between packaging runs.
//
// The retries are for Windows, where a file cannot be deleted while anything
// holds it open. A second build running in another terminal is the usual
// reason, and an unhandled EPERM here is a stack trace pointing at node:fs
// rather than at the thing you actually have to do.
try {
  rmSync(path.join(ROOT, 'dist', 'electron'), {
    recursive: true,
    force: true,
    maxRetries: 5,
    retryDelay: 300
  })
} catch (error) {
  if (error.code !== 'EPERM' && error.code !== 'EBUSY') throw error
  fail('dist/electron is in use, so the previous build cannot be cleared.\n' +
    '       Another build running in a second terminal is the usual cause;\n' +
    '       a running copy of the app is the other. Close it and try again.')
}

const args = [quasar, 'build', '-m', 'electron']
if (unpackedOnly) args.push('-s')

console.log(`\n  $ node ${args.map(a => (a === quasar ? 'node_modules/@quasar/app-vite/bin/quasar.js' : a)).join(' ')}\n`)

const build = spawnSync(process.execPath, args, { stdio: 'inherit' })
if (build.error !== undefined) throw build.error
if (build.status !== 0) fail('quasar build -m electron failed')

// -------------------------------------------------------- notarise (macOS)

// quasar.config.js reads CSC_NAME to decide whether to sign and notarise, so by
// this point electron-builder has signed the .app with the hardened runtime and
// notarised and stapled it. That leaves the disk image itself unstapled, and the
// image is what a user downloads - a stapled ticket is what lets Gatekeeper
// clear it without a round trip to Apple. So the image goes to Apple as well.
if (MAC && !unpackedOnly) {
  heading('macOS disk image')

  const bundle = findAppBundle()
  if (bundle === undefined) fail('No application bundle was produced under dist/electron/Packaged')
  console.log(`  built ${path.relative(ROOT, bundle)}`)

  if (appOnly) {
    console.log('\n  --app given, so the disk image is left unsigned and un-notarised.\n')
    process.exit(0)
  }

  // The image keeps the name electron-builder gave it: the artifactName in
  // quasar.config.js already makes it <name>-<version>-<arch>.dmg, the pattern
  // every other project here names its artefacts by.
  const imageName = readdirSync(PACKAGED).find(name => name.endsWith('.dmg'))
  if (imageName === undefined) fail('No disk image was produced under dist/electron/Packaged')
  const image = path.join(PACKAGED, imageName)

  const codesignIdentity = process.env.CODESIGN_IDENTITY
  const notaryProfile = process.env.NOTARY_PROFILE

  if (codesignIdentity === undefined || codesignIdentity === '') {
    console.log(`  CODESIGN_IDENTITY is not set - leaving ${imageName} unsigned.`)
    console.log('  Gatekeeper will warn on first launch; right-click > Open to bypass.')
  } else {
    console.log(`  signing ${imageName}`)
    // --force because electron-builder has already signed the image it produced
    // and codesign refuses an existing signature otherwise ("is already
    // signed"). Re-signing with the same identity is a no-op in effect, and
    // keeps the step honest if electron-builder ever stops signing it.
    if (run('/usr/bin/codesign', ['--force', '-s', codesignIdentity, image]) !== 0) {
      fail('Signing the disk image failed')
    }

    if (notaryProfile === undefined || notaryProfile === '') {
      console.log('  NOTARY_PROFILE is not set - skipping notarisation.')
    } else {
      console.log(`  notarizing ${imageName} - this waits on Apple and can take minutes`)

      // notarytool exits 0 when Apple answers, not when Apple approves: a
      // rejected submission still returns success and prints "status: Invalid".
      // Checking only the exit status therefore carries on to stapling, which
      // fails with a CloudKit "Record not found" that says nothing about the
      // real problem. The verdict is read out of the output instead, and the
      // log - which names the offending binaries - is fetched before giving up.
      let notary = capture('xcrun',
        ['notarytool', 'submit', image, '--wait', '--keychain-profile', notaryProfile])
      console.log(notary.output)
      const submission = /\bid: (\S+)/.exec(notary.output)?.[1]

      // Losing the connection while polling is not a failed submission. The
      // upload has already happened and Apple keeps processing regardless, so a
      // dropped request here - "The request timed out", routine on a slow link
      // and a large image - used to throw away a build that had in fact been
      // accepted. Rejoin the wait instead; notarytool wait prints the same
      // verdict line.
      if (notary.status !== 0 && submission !== undefined) {
        console.log(`  lost contact while waiting - rejoining submission ${submission}`)
        notary = capture('xcrun',
          ['notarytool', 'wait', submission, '--keychain-profile', notaryProfile])
        console.log(notary.output)
      }

      if (notary.status !== 0) {
        if (submission !== undefined) {
          console.error('\n  The submission may still be processing. Check it with:')
          console.error(`      xcrun notarytool info ${submission} --keychain-profile ${notaryProfile}`)
          console.error('  and if it was accepted, staple without rebuilding:')
          console.error(`      xcrun stapler staple ${image}`)
        }
        fail('Notarizing the disk image failed')
      }

      if (!notary.output.includes('status: Accepted')) {
        console.error('  Notarisation did not succeed - fetching the log')
        if (submission !== undefined) {
          run('xcrun', ['notarytool', 'log', submission, '--keychain-profile', notaryProfile])
        }
        fail('Apple did not accept the disk image')
      }

      console.log(`  stapling ${imageName}`)
      if (run('xcrun', ['stapler', 'staple', image]) !== 0) {
        fail('Stapling the disk image failed')
      }
    }
  }
}

// ------------------------------------------------------------------ results

heading('Produced')

const unpacked = path.join(ROOT, 'dist', 'electron', 'UnPackaged')
if (unpackedOnly) {
  if (!existsSync(unpacked)) fail('No unpacked application appeared under dist/electron')
  console.log(`  ${path.relative(ROOT, unpacked)}`)
  console.log('\n  This is what the end-to-end tests launch: yarn test:e2e\n')
  process.exit(0)
}

if (!existsSync(PACKAGED)) fail('No packages appeared under dist/electron/Packaged')

// Describe each artefact rather than just listing it. On Windows the installer
// and the portable build differ by one word in the filename, which is not
// nearly enough to tell them apart when you are looking for something to ship.
const describe = name => {
  // The installer is told apart by the -setup suffix quasar.config.js gives it;
  // electron-builder's own default, "Palmas Setup 1.0.0.exe", is not used.
  if (WIN && name.endsWith('-setup.exe')) return 'installer - wizard, shortcuts, uninstall entry'
  if (WIN && name.endsWith('.exe')) return 'portable - runs without installing, no shortcuts'
  if (name.endsWith('.dmg')) return 'disk image - this is what you distribute'
  if (name.endsWith('.AppImage')) return 'portable - chmod +x and run'
  if (name.endsWith('.deb')) return 'Debian/Ubuntu package'
  if (name.endsWith('.rpm')) return 'Fedora/RHEL package'
  return ''
}

const artefacts = readdirSync(PACKAGED)
  .filter(name => statSync(path.join(PACKAGED, name)).isFile())
  .sort()

if (artefacts.length === 0) fail(`Nothing was written to ${path.relative(ROOT, PACKAGED)}`)

for (const name of artefacts) {
  const size = megabytes(statSync(path.join(PACKAGED, name)).size)
  console.log(`  ${size.padStart(9)}  ${name}`)
  const note = describe(name)
  if (note !== '') console.log(`             ${note}`)
}

console.log(`\n  in ${path.relative(ROOT, PACKAGED)}\n`)
