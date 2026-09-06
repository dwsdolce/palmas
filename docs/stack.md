# The technology stack

Palmas is a web application wearing a native shell. Every pixel you see is a
web page: it runs in a browser tab on [www.dolcesfogato.com/palmas/](https://www.dolcesfogato.com/palmas/), inside
a `WKWebView` on iOS, and inside Chromium on the desktop — the same code in all
three. What changes is the container.

That shape explains the dependency list. One set of packages builds a web
application, a second wraps it in something installable, and a third never ships
at all.

Versions below are what is installed in `node_modules`, which can sit ahead of
the range declared in `package.json` — `dompurify` is declared `^3.1.6` and
installed at `3.2.6`.

---

## What you see

The interface, its language, and its motion. **Ships to users.**

### `vue` — 3.5.42
The framework everything else is built on. You describe what the screen should
look like for a given state; Vue keeps the DOM matching it.

### `quasar` — 2.28.0
A component library and design system for Vue — buttons, dialogs, drawers,
toggles, dark mode, the responsive grid. It is why the app looks consistent
without hand-written CSS for every control.

Three of its plugins are switched on in `quasar.config.js`: `Notify` (the toast
that tells you to select an instrument), `Loading`, and `Dialog`.

### `pug` — 3.0.4
An indentation-based template language used instead of HTML. Every `.vue` file
here declares `<template lang="pug">`, which is why the markup has no closing
tags. It compiles to plain HTML at build time, so it costs the user nothing.

### `vue-router` — 5.3.0
Maps URLs to screens; each palo has its own address. v5 is a hard peer
requirement of `@quasar/app-vite` v3, not an independent choice. Uses real URLs on the web
and hash URLs (`#/flamenco/solea`) in the native builds, because there is no
server to ask for a path when the page is loaded from inside the app bundle.
See `vueRouterMode` in `quasar.config.js`.

### `vue-i18n` — 9.14.5
Translation. Text lives in per-language files under `src/i18n/` rather than in
components. Nine languages, including Arabic and Persian, which read right to
left.

There is deliberately **no** i18n build plugin. `@intlify/vite-plugin-vue-i18n`
was here until the app-vite v3 upgrade, by which point it could no longer be
resolved and had been inert for a while. Its successor,
`@intlify/unplugin-vue-i18n`, does load — and breaks the app: it defaults to
`runtimeOnly`, aliasing vue-i18n to a build with no message compiler, and these
messages are `.ts` modules rather than the JSON/YAML resources such plugins
exist to precompile. Every translated control silently vanished while the build
still reported success.

### `animejs` — 3.2.2
A small animation library: given a target and a property, it interpolates over
time. Used for the pulse on each dot as its beat lands — scale up, ease back
down. See `src/components/DrawDots.vue`.

### `@quasar/extras` — 1.18.0
Icon sets and fonts packaged for Quasar. Only `mdi-v7` (Material Design Icons)
is enabled; the other five are commented out so they are never downloaded.

### `vue-global-events` — 3.0.1
Lets a component listen for keyboard events on the whole window without manually
adding and removing listeners. Powers the keyboard shortcuts.

---

## What it remembers

Shared state, and the parts that survive a restart. **Ships to users.**

### `pinia` — 2.3.1
The state store. Rather than passing data down through components, everything
reads from a central place and updates flow outward. Two stores here:
`patterns` holds the selected palo, tempo, instruments and beat events;
`session` holds preferences such as dark mode and the audio/visual offset.

### `@vueuse/core` — 10.11.1
A large collection of small Vue utilities, of which this app uses essentially
one: `useStorage`, which mirrors a value into `localStorage` automatically. It
is why your tempo, language and chosen pattern are still there next time.

---

## What makes the sound

The hard part, and the reason a metronome is not just a timer. **Ships to
users.**

### `tone` — 15.1.22
A framework over the browser's Web Audio API. Its value is scheduling:
JavaScript timers drift audibly, so Tone schedules notes against the audio
hardware clock instead, looking ahead and queueing events before they are due.

In `src/composables/metronome.ts`:

| Tone concept | Role here |
| --- | --- |
| `Transport` | The clock that tempo and swing act on |
| `Sequence` | One per instrument, playing that instrument's pattern array |
| `Player` | Holds each decoded sample |
| `Channel` | Mixes quarter- and eighth-note layers |
| `Reverb` | Adds room |
| `Draw` | Schedules dot animations against the same clock, so sight and sound stay together |

---

## The written material

Help pages, palo descriptions, the changelog. **Ships to users.**

### `marked` — 14.1.4
Turns Markdown into HTML. The help text and palo documentation are authored as
Markdown inside the translation files.

### `dompurify` — 3.4.14
Strips anything dangerous out of HTML before it is inserted into the page —
standard practice whenever generated HTML is injected, and what closes off
cross-site scripting. Paired with `marked`: parse, then sanitize, then render.
Some of that text is fetched from Wikipedia, so it is not all locally authored.

---

## The native shell

What turns a web page into something you install. **Ships to users.**

### `@capacitor/core` — 7.6.8
Wraps the web app in a real native application: a Swift or Kotlin project
containing a full-screen web view, plus a bridge that lets JavaScript call
native code. The web assets are copied inside the app bundle and served through
a custom URL scheme, so the app works with no network at all.

That scheme handler is also where the iOS audio bug lived: it answers requests
for media files with a response that `fetch()` reads as a failure. See the
comment in `loadSounds()` in `src/composables/metronome.ts`.

### `@capacitor/app` · `splash-screen` · `status-bar` — 7.1.2 / 7.0.5 / 7.0.6
Small official plugins exposing native behaviour to JavaScript: lifecycle events
such as pause and resume, the launch splash, and the colour and style of the
status bar.

### `@capacitor-community/keep-awake` — 7.1.0
Stops the screen sleeping. For a metronome propped on a music stand, this is not
a nicety.

### `electron` — 44.0.0
The desktop equivalent: bundles Chromium and Node.js into a Mac or Linux
application. Heavier than Capacitor — the browser engine ships with the app
rather than being borrowed from the operating system. `@electron/remote` lets
the page reach a few main-process APIs; `electron-builder` produces the
installers.

---

## What builds it

Runs on your machine. **None of this reaches a user.**

### `@quasar/app-vite` — 3.8.1
The build system and CLI. It owns `quasar dev` and `quasar build`, wires Vue,
the router, the store and Quasar together, and knows how to target each platform
— the reason `-m capacitor -T ios` means anything.

It carries its own Vite (8.2.2 here) rather than taking it as a dependency.
The project moved v1 → v2 → v3 in one sitting; each hop broke the config in a
different way, which is documented in the commit messages for `b56921f` and
`2a3d4fa`.

### `typescript` — 5.9.3
JavaScript with type annotations, checked at build time and then erased. The
pattern and sound data are typed (`src/utils/types.ts`), which is what makes a
malformed sequence a build error rather than silence at runtime.

### `eslint` — 8.57.1 and `prettier` — 3.9.6
ESLint catches suspect code; Prettier formats it. `eslint-config-prettier`
switches off the ESLint rules that would argue with Prettier, and
`eslint-plugin-vue` teaches ESLint about `.vue` files.

### `autoprefixer` — 10.5.4
Adds vendor prefixes to CSS for the browsers listed in the build target, so you
write the standard property once.

### `electron-builder` — 26.15.3
Packages the Electron app into a `.dmg` or Linux package, handling signing and
metadata. Selected in `quasar.config.js` via `bundler: 'builder'`.

### `@capacitor/cli` — 7.6.8
Copies built web assets into the native projects and keeps their plugin lists in
sync. Quasar calls it for you during a Capacitor build.

---

## Declared but not carrying weight

Six packages that had accumulated here were removed on 2026-08-30:
`pug-plain-loader` (a webpack loader in a project that builds with Vite),
`electron-packager` (the config selects `builder`; also deprecated upstream),
`@types/dompurify` (DOMPurify 3 ships its own types), `@vue/devtools` (app-vite
v3 uses `vite-plugin-vue-devtools` and installs it on demand),
`@capacitor/assets` (this project generates icons from the build itself) and
`@vue/language-plugin-pug` (editor tooling, and never wired into
`vueCompilerOptions` so it was not doing even that).

What remains looks unused to a naive grep but is not:

| Package | Why a search does not find it |
| --- | --- |
| `@types/animejs` | anime.js ships no types of its own, so this is genuinely load-bearing despite nothing importing it by name. |
| `@quasar/extras` | Named in `quasar.config.js` as `'mdi-v7'`, not by package path. |
| `eslint`, `eslint-plugin-vue`, `@typescript-eslint/*` | Invoked through ESLint's config, never imported. |
| `typescript`, `autoprefixer` | Invoked by the build, never imported. |
| `electron-builder`, `@capacitor/cli`, `@capacitor/android` | Run as tooling by `quasar build`, never imported. |

--- | --- |
| `pug-plain-loader` | A **webpack** loader. This project builds with Vite, which handles Pug through Quasar directly. Almost certainly left from the pre-Vite era. |
| `electron-packager` | The alternative Electron bundler. The config selects `builder`, so this path is never taken. Also deprecated upstream in favour of Electron Forge. |
| `@types/dompurify` | Type definitions for DOMPurify. Version 3 ships its own types, so this stub is redundant and can conflict. |
| `@types/animejs` | Types for anime.js, which ships none of its own — so this one **is** doing real work even though nothing imports it by name. Keep it. |
| `@vue/devtools` | The standalone Vue debugging app, launched when `vueDevtools` is enabled in `quasar.config.js`. Its bundled Electron fails to install, so enabling it currently breaks `quasar dev`. |
| `@capacitor/assets` | A CLI that generates app icons and splash screens from a source image. Run by hand, if at all — this project uses Quasar's Icon Genie instead, driven by `scripts/icons.mjs`. |
| `@vue/language-plugin-pug` | Teaches the Vue editor tooling to understand Pug templates. It improves your editor, not the build. |

---

## Not a package

The audio samples are not a dependency. The 321 `.wav` masters live in `audio/`,
outside `public/` so that they are never served, and
`scripts/format-audio.mjs` generates `flac` and `mp3` into `public/audio` — for
the 57 medias `soundsData.ts` actually names, not for all 321. That is about
2.4 MB shipped against 52 MB of sources kept back, and it is what makes the
service worker's offline cache a reasonable thing to ask of a phone.

Getting there took three passes, each of which looked complete at the time. It
used to be five formats side by side in `public/`, which meant every build — the
web deploy, the desktop app, the Android APK — carried 51 MB of masters nobody
can play plus `mp4` and `ogg` that no engine since 2017 ever selects; the APK
was 91 MB, roughly three quarters of it waste. Moving the masters out and
dropping the dead formats took it to 29 MB. Generating only the referenced
medias took it to 9.4 MB, because converting the whole library had been
shipping 24 MB of hydrogen samples that nothing has ever asked for.
