# Working on Palmas

A flamenco metronome, forked from [A Compás](https://gitlab.com/acompas/acompas)
(AGPL-3.0) and now its own project. Four targets from one codebase: **web**,
**desktop** (Electron, packaged for macOS/Windows/Linux), **iOS** and
**Android** (Capacitor).

## Getting a machine ready

```bash
yarn setup          # checks prerequisites and fixes what it can
yarn setup --check  # report only
```

Per-platform detail is in [`docs/setup.md`](docs/setup.md), and the build for
each target in [`docs/desktop.md`](docs/desktop.md),
[`docs/ios.md`](docs/ios.md) and [`docs/android.md`](docs/android.md). Read
those rather than reinventing the steps: they record traps that cost real time.

## Commands

```bash
yarn dev            # web, hot reload
yarn test           # Vitest
yarn test:e2e       # Playwright: the Electron app, and the web app in a browser
yarn lint
yarn build          # PWA (installable, works offline)
yarn build:desktop  # Electron, signed if credentials are present
yarn audio          # regenerate the playable formats from the .wav masters
```

**`tsconfig.json` extends `.quasar/tsconfig.json`, which Quasar generates.**
Without it every test fails to transform with `TSCONFIG_ERROR`. `postinstall`
runs `quasar prepare`; run it by hand if you ever delete `.quasar`.

## The one idea worth understanding first

The **compás** is the theory and the **palmas** are its realization, and the app
is named after the second. `accents` is the pulse of the palo and carries no
sound; each instrument sequence is one way of playing _against_ that pulse, so
they frequently disagree — in abandolaos the pulse falls on 6/2/4 while the
palmas claras strike 1/3, which looks like a bug and is not one.

`src/composables/visualization.ts` is the single encoding all three views draw
from, and its comments explain the colour choices and why media 1 is the
accented sound. Start there before changing anything about the display.

## Things that will cost you an hour

- **`ELECTRON_RUN_AS_NODE`** is exported by VS Code's plugin host and inherited
  by every shell it spawns. It makes Electron run as plain Node — no window, no
  `BrowserWindow` — and the failure reads as a broken build. See
  [`docs/desktop.md`](docs/desktop.md).
- **QBtn's `padding="none"`** writes `min-width: 0` and `min-height: 0` as an
  _inline_ style, which no stylesheet rule can outrank. Help buttons rendered at
  17px against a 44px rule because of it.
- **`boundingBox()` does not wait for animations.** Quasar scales dialogs in, so
  a single measurement can land mid-animation and report a fraction of the real
  size. Poll instead.
- **Audio masters live in `audio/`, not `public/`.** Everything in `public/` is
  copied verbatim into every build, so sources there ship to users.
  `public/audio/` is generated and gitignored.

## Before you call something done

Run `yarn lint` and `yarn test`, and build the targets you touched — a build
that compiles is not evidence the app runs. Several bugs here passed the whole
suite and were only visible on a device: a blank Electron window, marks drawn in
a colour that could not be seen, a status bar inset counted twice.

If a test has never failed, it has proved nothing. Break the fix deliberately
and watch the test go red before trusting it.
