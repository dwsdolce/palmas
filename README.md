# Palmas

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-AGPL--3.0-green)

A flamenco metronome — *compás y palmas* — available on multiple platforms:

* Web application (available at [https://www.dolcesfogato.com/palmas/](https://www.dolcesfogato.com/palmas/))
* Mobile application using [Capacitor](https://capacitorjs.com)
* Desktop application (Electron)

## Relationship to A Compás

Palmas is a modified version of [A Compás](https://gitlab.com/acompas/acompas)
by Olivier Ricordeau and Jérémie Sieffert, who wrote the great majority of this
code and hold copyright in it from 2014 to 2023. It is distributed under the
same AGPL-3.0 licence, which is what makes this fork possible.

It is renamed because it is not their work any more: they neither review nor
support these changes, and shipping them under their name would misrepresent
both projects. Palmas is published separately, under its own application
identifiers, and bugs here are not their problem — report them
[on this repository](https://github.com/dwsdolce/palmas/issues).

Changes made in this fork include a Node toolchain in place of Python,
cross-platform setup and packaging scripts, subfolder-relative web hosting,
lazily loaded locales, removal of the analytics, and a content security policy.
See the commit history for the full account.

## Key Features

- 🎵 Multiple authentic flamenco rhythms (palos)
- 🎨 Visual animations with multiple display modes:
  - Dots visualization (default)
  - Counter display
  - Clock display
- 🌓 Light/Dark theme support
- 🌐 Multilingual support - Available in 9 languages:
  - English, Spanish, French, Italian, German
  - Arabic, Persian (Farsi), Japanese, Chinese (Simplified)
- 📱 Mobile-optimized with keep-awake functionality
- 📝 Built-in changelog viewer
- 🎛️ Customizable tempo, prestart beats, and swing options
- 🔊 High-quality audio samples with multiple instruments

It is based on the following technologies :
 - [Quasar framework](https://quasar.dev)
 - [vue.js](https://vuejs.org)
 - [Pinia](https://pinia.vuejs.org)
 - [Tonejs](https://tonejs.github.io)

For what every dependency is actually for, and which layer of the app it belongs
to, see [docs/stack.md](docs/stack.md).

## Contact

Issues and merge requests go to
[github.com/dwsdolce/palmas](https://github.com/dwsdolce/palmas).

The A Compás Slack is the upstream project's, not this one's — please do not
take questions about Palmas there.

## Thanks

 - The jaleo sounds are recordings of Aziz Andry.

---

# Getting started

## Quick start

Three steps. The setup script handles the rest — including installing Node.js if
this machine does not already have it.

**1. Clone the project.**

```bash
git clone https://github.com/dwsdolce/palmas.git
cd palmas
```

**2. Run the setup script.** Choose by **the shell you are typing into**, not by
your operating system:

```powershell
powershell -ExecutionPolicy Bypass -File .\setup.ps1
```

```bash
./setup.sh
```

**3. Start the app.**

```bash
yarn dev
```

It opens at <http://localhost:9000/>.

### Which script, and why the long Windows command

Pick by shell, because on Windows both are common:

* At a `PS>` or `C:\>` prompt — **`setup.ps1`**.
* At a `$` prompt — **`setup.sh`**. That includes Git Bash, Cygwin and WSL *on
  Windows*, and it includes those terminals inside VS Code. Running
  `./setup.ps1` there makes bash try to parse PowerShell and produces a screen
  of `command not found` and `syntax error near unexpected token`.

Both scripts do the same job; only the language differs.

The Windows command is spelled out in full because Windows refuses to run local
scripts by default, with:

```
.\setup.ps1 : File ...\setup.ps1 cannot be loaded because running scripts is
disabled on this system.
```

`-ExecutionPolicy Bypass -File` applies to that one invocation and changes
nothing about the machine. If you would rather allow local scripts generally —
read [setup.ps1](setup.ps1) first, it is short — then
`Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` lets you use the shorter
`.\setup.ps1` from then on.

### What the setup script does

You do not need to work out first whether Node.js is on the machine. The script
determines that, which is not something you could reasonably be expected to know
anyway — plenty of applications install Node without ever mentioning it.

1. **`setup.ps1` / `setup.sh`** check for a usable Node and install one if there
   is none. That is *all* they do. They exist only because the main script is
   written in Node, and so cannot be the thing that discovers Node is missing.
2. **`scripts/setup.mjs`** takes over: the Node version this project needs,
   Yarn, ffmpeg, the project's dependencies — both of them, since
   `src-capacitor` is a second install that even the web build requires — and
   the Electron runtime, which no install fetches on its own.

It changes **nothing** without asking, asks only where there is a real decision
to make, and is safe to run repeatedly — re-running it is how you resume after a
step that needs a new terminal.

To see what it would do without changing anything, add `--check`:

```powershell
powershell -ExecutionPolicy Bypass -File .\setup.ps1 --check
```

```bash
./setup.sh --check
```

#### What it covers, and what it does not

When it finishes cleanly, **`yarn build`, `yarn build:desktop`, `yarn test` and
`yarn test:e2e` all work on this machine**. That is the whole promise, and it is
deliberately the same promise on macOS, Windows and Linux: the web build is
cheap enough that there is no reason not to have it everywhere, and the desktop
build has to happen on each platform anyway, because electron-builder does not
cross-compile.

The tests are in the promise because building is not the bar —
[CLAUDE.md](CLAUDE.md) asks for lint, tests and a run of what you touched before
calling anything done, and a suite that cannot start is a suite that gets
skipped. Both things this covers that `yarn install` does not fetch — the
Electron runtime and Playwright's chromium — fail far from their cause: fifty
red specs and an "Executable doesn't exist" reads as a broken suite rather than
a missing download.

**Android and iOS are not part of it.** Their toolchains are large, they are set
up once on whichever machine you choose to build them from, and they ask
questions no script should answer for you — which JDK, an IDE or the
command-line SDK, which Apple team. Xcode cannot be installed non-interactively
at all. Each has its own one-time setup, written out in full:

* [docs/android.md](docs/android.md#setting-the-machine-up) — JDK 21, the
  Android SDK, `JAVA_HOME` and `ANDROID_HOME`, API 36, an emulator, a keystore.
* [docs/ios.md](docs/ios.md#setting-the-machine-up) — Xcode, CocoaPods, the
  signing team. macOS only.

Do the setup script first either way: both build on the same Node, Yarn and
dependencies it installs.

### Doing it by hand

[docs/setup.md](docs/setup.md) is the same work done manually, with the
reasoning behind every step: what each prerequisite is for, the Node version
manager question, the Windows shell and PATH traps, and what `yarn install`
generates. Read it if the script fails, if you would rather not run a script
that installs things, or if you want to know what is being checked and why.

### Starting over

Everything the setup produces is gitignored, so deleting it never touches a
tracked file. To return to an earlier state:

```bash
rm -rf src-capacitor/node_modules          # redo just the Capacitor install
rm -rf node_modules .quasar                # redo the dependency install
node scripts/format-audio.mjs unconvert    # redo the audio generation
```

`rm -rf node_modules src-capacitor/node_modules .quasar dist` plus that
`unconvert` puts you back to a freshly cloned tree. Re-running the setup script
then rebuilds all of it; budget a few minutes, most of it ffmpeg converting the
audio masters. The `unconvert` command needs no dependencies, so it still works
with `node_modules` deleted.

## Run the app

```bash
yarn dev        # serve with hot reload at localhost:9000
yarn build      # build for production into dist/pwa
yarn preview    # serve that production build at localhost:4173
```

`yarn preview` is how you run the *built* app. You cannot simply open
`dist/pwa/index.html`: the browser blocks module scripts over `file://`, and the
app would not load. `yarn preview` serves it properly, returning a real 404 for
a missing asset so that a broken build still looks broken. It is the same server
the end-to-end tests and the CI smoke test use:
[scripts/serve-static.mjs](scripts/serve-static.mjs).

The Quasar CLI is a project dependency rather than a global install, so run it
through yarn as above, or with `npx quasar dev` / `npx quasar build`. A bare
`quasar` command only works if you happen to have one installed globally, which
is why every command in these docs uses `yarn` or `npx`.

> ⚠️ **On Windows, `yarn dev` in Windows PowerShell may fail** with *"cannot be
> loaded because running scripts is disabled on this system"*. That is not this
> project: npm installs a `yarn.ps1` shim, PowerShell prefers it over
> `yarn.cmd`, and `Restricted` — Microsoft's default for Windows PowerShell —
> forbids running it. Fix it once, per-user and without elevation:
>
> ```powershell
> Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
> ```
>
> Or use cmd, PowerShell 7, or any POSIX shell, none of which are affected. See
> [docs/setup.md](docs/setup.md#a-note-on-windows-shells) for the detail.

## Building for a specific platform

| Target | Build from | Command | Guide |
|---|---|---|---|
| Web (PWA) | macOS, Windows, Linux | `yarn build` | see [Run the app](#run-the-app) above |
| Desktop (Electron) | macOS, Windows, Linux | `yarn build:desktop` | [docs/desktop.md](docs/desktop.md) |
| Android | macOS, Windows, Linux | `npx quasar build -m capacitor -T android` | [docs/android.md](docs/android.md) |
| iOS | macOS only | `npx quasar build -m capacitor -T ios` | [docs/ios.md](docs/ios.md) |

The names, subtitles and identifiers the app is published under are in
[docs/store-listing.md](docs/store-listing.md), along with what each store
requires before it will accept a first release.

Each build runs on the platform it targets — electron-builder does not
cross-compile, and the mobile toolchains are the vendors' own.
`yarn build:desktop` checks its prerequisites, picks up signing credentials if
you have any, and describes what it produced; on macOS it also signs, notarises
and staples the disk image.

> ⚠️ The desktop build needs Electron's runtime, a separate ~150MB download that
> `yarn install` does not fetch — Electron 44 removed the postinstall hook that
> used to. **The setup script fetches it**, so this matters only if you set the
> machine up by hand, or if it goes missing later after an Electron version
> bump: `yarn build:desktop` then stops with *"The Electron runtime is
> missing"*, and the Electron end-to-end tests have nothing to launch. Re-run
> the setup script, or `npx install-electron`. See
> [docs/desktop.md](docs/desktop.md#the-electron-runtime).

## Tests

```bash
yarn test          # unit and component tests (Vitest), ~6s
yarn test:watch    # the same, re-running on change
yarn test:e2e      # Electron and web end-to-end tests (Playwright)
```

`yarn install` prepares the project via `quasar prepare`, so a fresh clone can
lint and test without a build; run `npx quasar prepare` by hand if you ever
delete `.quasar`.

`yarn test` runs in CI on every push. It covers four things:

- **Pattern data** - every sequence is as long as `nbBeatsInPattern`, accents
  fall inside the pattern and ascend, tempos are ordered, names are unique.
  These lock in properties that are easy to break by hand-editing the data.
- **Translations** - every locale defines exactly the interface keys `en-US`
  does, with nothing excluded. The release history is not interface text and
  lives in `src/assets/data/changelog.ts`, untranslated on purpose: six of the
  nine locales had fallen five to eight releases behind, so their readers saw a
  changelog that simply stopped. One English list beats a truncated translated
  one, and the drift cannot come back.
- **The store** - patterns load with their context, instrument lookup works,
  and selecting a pattern produces a playable instrument list.
- **Audio/visual sync** - the dots and the samples are driven from the same
  slot index, and the visual is offset from the audible event by exactly the
  output latency. See below.

`yarn test:e2e` needs a build first — `yarn build` for the web specs and
`npx quasar build -m electron` for the Electron ones. Each group skips itself
with a message if its build is missing. The Electron specs also need the
Electron runtime, which the setup script installs — see
[docs/desktop.md](docs/desktop.md#the-electron-runtime) if they report it
missing.

The Electron specs launch the app and check that a window opens with a populated
`#q-app`, that every image loads, that a sample decodes, and that nothing logs an
error - the white-page class of failure. The web specs serve `dist/pwa` with
[scripts/serve-static.mjs](scripts/serve-static.mjs) and drive the help controls
under both touch and pointer input.

### The sync tests

The metronome schedules audio at the transport time and the dots at that time
*plus* the output latency, so the visual matches the click you hear rather than
the moment the sample is queued. The compensation is `baseLatency +
outputLatency` plus the manual offset slider, which allows 500ms with no clamp
against the beat grid.

A slot is an eighth note: 231ms at 130 BPM. So an offset above ~230ms lights the
dot while the *next* slot is sounding, which looks like a strong beat shown
against a weak one. `test/metronome-sync.spec.ts` documents that with a
deliberately failing case (`it.fails`); once the offset is clamped to one slot,
turn it into a plain `it`.

## Licensing

The source code is published under the terms of the GNU [AGPL license](https://www.gnu.org/licenses/agpl-3.0.html) (see the LICENSE file at the
root of the git repository).
There is an exception to this : the drumkits. All the .wav files located in audio/ are licensed under the terms of the [CC0 license](https://creativecommons.org/publicdomain/zero/1.0).

## Contributing to the project

If you're a musician and would like to contribute, you can submit new rhythms.
Palmas is getting more generalistic and will ultimately be able to play any
kind of rhythm. See [docs/contributing.md](docs/contributing.md) for the pattern,
sequence and sound formats with worked examples. You can also contribute to the
code by submitting a merge request.

## Roadmap / To do

### Platform Support
- Package and publish the iOS app (currently implemented but not published)
- Complete Windows desktop support (Electron - see [docs/desktop.md](docs/desktop.md))
- Consider Android TV support

### Features
- Add more sound samples and drumkits
- Add more rhythmic patterns (palos)
- Add more visualization options
