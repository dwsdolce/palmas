# Building the desktop app (Electron)

Electron builds only ever produce a package for the machine you are on —
electron-builder does not cross-compile a macOS `.dmg` from Windows, or the
reverse. Run the build on the platform you want a package for.

## Contents

**Every build**

* [Building](#building) — one command on every platform
* [The Electron runtime](#the-electron-runtime) — the one prerequisite
  `yarn install` does not provide
* [Icons on Linux](#icons-on-linux) — why a set, not one file
* [Window association on Linux](#window-association-on-linux) — StartupWMClass
* [rpmbuild, for the .rpm](#rpmbuild-for-the-rpm) — Linux only
* [What comes out](#what-comes-out)
* [When a build fails](#when-a-build-fails) — indexed by what you saw

**Once, ever**

* [Signing on macOS](#signing-on-macos) — Developer ID and notarisation
* [Signing on Windows](#signing-on-windows) — and why it is off

**Reference**

* [Doing it by hand](#doing-it-by-hand) — the commands underneath the script
* [Upgrading over an older install](#upgrading-over-an-older-install)

---

## Building

```bash
yarn build:desktop
```

That is the whole thing, on all three platforms.
[packaging/build-desktop.mjs](../packaging/build-desktop.mjs) checks the project
can actually be packaged, picks up signing credentials if you have any, clears
the previous output, runs the build, and then says what it produced and what
each artefact is for. On macOS it also signs, notarises and staples the disk
image — see [Signing on macOS](#signing-on-macos).

| What you want | Command |
|---|---|
| Installers for this platform | `yarn build:desktop` |
| Just the app directory — much faster, and what the end-to-end tests launch | `yarn build:desktop --unpacked` |
| macOS: stop after the `.app`, no disk image | `yarn build:desktop --app` |

`--unpacked` writes `dist/electron/UnPackaged`; the full build writes
`dist/electron/Packaged`.

### The Electron runtime

**A machine set up by `setup.ps1` / `setup.sh` needs nothing here** — the script
fetches this, and [says so](../README.md#what-it-covers-and-what-it-does-not) as
part of guaranteeing the desktop build works.

It gets its own section because it is the one desktop prerequisite that
`yarn install` does not provide. The `electron` package on npm is a wrapper
around a ~150MB runtime downloaded separately, and Electron 44 removed the
postinstall hook that used to fetch it, so an install leaves a package that
looks complete around a binary that is not there.

That means it can go missing on a machine that has built before — after an
Electron version bump, or on a `node_modules` installed without the setup
script. The build then stops with
[The Electron runtime is missing](#the-electron-runtime-is-missing-so-there-is-nothing-to-package).
Re-run the setup script, or fetch it directly:

```bash
npx install-electron
```

Either way it is paid for once per machine rather than once per clone: the
download is cached outside the project — `~/.cache/electron` on Linux,
`~/Library/Caches/electron` on macOS, `%LOCALAPPDATA%\electron\Cache` on
Windows.

### Icons on Linux

The `.deb` and `.rpm` install a set of eight — 16 through 512 — into the
matching `/usr/share/icons/hicolor/<size>x<size>/apps/` directories, generated
into `src-electron/electron-assets/icons/linux/` by the build itself and pointed
at by `linux.icon` in [quasar.config.js](../quasar.config.js).

The build generates them only when the target is Linux, so that directory is
absent on a Mac or a Windows machine. That is expected rather than a broken
checkout: electron-builder does not cross-compile, so those icons could never be
used there.

A set rather than the single `icon.png` the other platforms use, because
electron-builder does not resize for Linux: given one file it passes it through
untouched, and the package ends up with a lone `512x512` entry. Only the
applications menu notices. The taskbar and a desktop shortcut take their icon
from the running window, which [electron-main.ts](../src-electron/electron-main.ts)
sets directly — so those look right while the menu, the one place that goes
through the icon theme, falls back to a generic icon. The AppImage never
notices either: it embeds the icon as `.DirIcon` at the root of its AppDir and
does not consult the theme at all.

`linux.icon` is an absolute path, and has to be. electron-builder runs against
`dist/electron/UnPackaged` rather than the repository root, so a
project-relative path resolves to nothing — and resolving to nothing is silent:
the source list falls through to the `icon.png` Quasar sets, and the build
succeeds with one icon again. Quasar passes absolute paths for its own icon
defaults for the same reason. If the menu icon ever goes generic again, count
the icons in the package before anything else:

```bash
dpkg-deb -c dist/electron/Packaged/*.deb | grep hicolor
```

### Window association on Linux

`package.json` sets `desktopName`, and `linux.syncDesktopName` in
[quasar.config.js](../quasar.config.js) makes the `.desktop` entry's
`StartupWMClass` follow it. Both are needed, and the reason is that the two
names involved are not the same string:

```
xprop WM_CLASS   ->  "palmas", "palmas"     what the window reports
StartupWMClass   ->  palmas                 what the entry claims
```

Without `syncDesktopName`, `StartupWMClass` falls back to `productName` —
`Palmas`, with a capital — and no longer matches, so the desktop environment
cannot tell that a running window belongs to the installed entry. Pinning the
window creates a second launcher instead of pinning the entry, and the window
does not group under the menu item it was started from.

The trap is that none of that looks broken. The window opens, and it shows the
right icon, because the icon comes from `BrowserWindow` in
[electron-main.ts](../src-electron/electron-main.ts) painting it onto the
window directly — nothing to do with the `.desktop` entry. Only the
association is missing, and nothing reports it.

Check it against a running window rather than assuming:

```bash
xprop WM_CLASS      # then click the window
grep StartupWMClass /usr/share/applications/palmas.desktop
```

### rpmbuild, for the .rpm

Linux only, and only for one of the three artefacts. `.deb` and `.rpm` are built
by electron-builder's fpm target, and fpm shells out to `rpmbuild` for the rpm —
which Debian-family machines, the ones most likely to be building this, do not
have installed by default:

```bash
sudo apt install rpm         # Debian, Ubuntu, Mint
sudo dnf install rpm-build   # Fedora, RHEL
```

[packaging/build-desktop.mjs](../packaging/build-desktop.mjs) checks for it
before starting, because fpm's own failure arrives several minutes into a build
and buried in its output. If you would rather not install it, drop `'rpm'` from
`electron.builder.linux.target` in [quasar.config.js](../quasar.config.js) and
the other two still build.

fpm itself needs nothing: electron-builder downloads it on the first Linux
package build and caches it under `~/.cache/electron-builder`.

### What comes out

| Host | Artefacts |
|---|---|
| **Windows** | `palmas-<version>-x64-setup.exe` — installer: wizard, choice of directory, Start Menu and desktop shortcuts, an entry in Settings → Apps<br>`palmas-<version>-x64-portable.exe` — portable: runs without installing, leaves nothing behind |
| **macOS** | `palmas-<version>-arm64.dmg` — signed, notarised and stapled when credentials are configured |
| **Linux** | `palmas-<version>-x86_64.AppImage` — portable: `chmod +x` and run, no root and no package manager, and the only one of the three a Debian *and* a Fedora user can both be handed<br>`palmas-<version>-amd64.deb` — Debian, Ubuntu, Mint<br>`palmas-<version>-x86_64.rpm` — Fedora, RHEL, openSUSE |

The two Windows executables differ only by their `-setup` and `-portable`
suffixes, which is why the script describes each one as it reports them rather
than just listing filenames.

### The version on an artefact

`<version>` above is four components — `1.0.0.880` — where the fourth is the git
commit count, the same build number the app shows as "1.0.0 (880)" and the same
scheme every other project here uses. It appears in the filename *and* in the
package metadata, so `dpkg -I` and `rpm -qip` agree with the name on disk:

```
Version: 1.0.0.880          # deb
Version: 1.0.0.880          # rpm, with Release: 1
```

That is set by `extraMetadata.version` in [quasar.config.js](../quasar.config.js),
not by electron-builder's `buildNumber` option. `buildNumber` looks like the
right lever and is not: it leaves the version at three components and hands the
fourth to fpm as `--iteration`, which is the Debian revision and the RPM
release — giving `1.0.0-880` and `Release: 880` instead.

**macOS spells the same thing differently**, and gets it spelled out in the
`mac` block rather than inheriting the four-component string. Apple splits a
version across two keys — `CFBundleShortVersionString`, the marketing version,
capped at three integers, and `CFBundleVersion`, the build — so the `.dmg`
carries `1.0.0` and `880` separately. That is what
[src-capacitor/ios/App/set-version.sh](../src-capacitor/ios/App/set-version.sh)
stamps for iOS, so both Apple builds agree, and neither is a shape App Store
Connect would refuse.

**Windows carries it in the exe's own resource** — `VIProductVersion`,
`FileVersion` and `ProductVersion` all read `1.0.0.880`, matching the
`VSVersionInfo` block that `pdfarranger-qt` and `marklens-ports` stamp with
PyInstaller. That takes both `buildNumber` and `buildVersion`, set together and
only when building on Windows: electron-builder composes `VIProductVersion`
from major, minor, patch and `buildNumber`, so without it the fourth slot is
zero; but `buildNumber` alone also makes `buildVersion` default to
*version*`.`*buildNumber*, which on an already-four-component version compounds
to `1.0.0.880.880` and lands in `FileVersion`.

Gating on the host platform is sound for the same reason this script exists at
all — electron-builder does not cross-compile, so the host *is* the target. On
Linux `buildNumber` is precisely what must not be set, for the fpm reason
above.

A shallow clone has no commit history to count, so the build number collapses
to `1`. `actions/checkout` defaults to `fetch-depth: 1`, which is why the
workflow asks for the full history.

## When a build fails

### The installed app does nothing when launched

Symptom: the installer finishes, you leave *"Run Palmas"* ticked, and nothing
appears — no window, no error, no crash dialog. Starting the same app from its
Start Menu entry or desktop icon works.

Check the icon first. An app that starts from a shortcut is installed correctly,
whatever the installer's checkbox did, and the two known causes are different
problems:

**The first launch can simply be slow.** `Palmas.exe` is around 233MB and its
`app.asar` another 30MB — about 400MB installed — and the build is unsigned, so
Windows Defender scans the lot the first time it runs. That can take tens of
seconds during which nothing at all appears on screen. Later launches are quick
because the scan has already happened.

**Or `ELECTRON_RUN_AS_NODE` was inherited.** This only applies if the installer
was started **from a terminal**: VS Code sets that variable in every shell it
spawns, the installer inherits it, and the app it launches inherits it in turn.
In that mode `Palmas.exe` behaves as a plain Node binary with no script to run
and exits 0 at once - no window, nothing on stderr, nothing in the event log.
Started from Explorer or from a shortcut, the variable is not there and the
problem cannot arise.

The application cannot defend against the second case: Electron never loads the
main process, so no code of ours runs to notice. Only the launching environment
can put it right, by starting the app from a shortcut or by clearing the
variable — see below.

If neither fits, note that the installer launches the app through the shortcut
it just created, using `ExecShellAsUser`, and never checks whether that
succeeded. A silent failure there looks exactly like this and leaves no trace.
`nsis: { runAfterFinish: false }` in `quasar.config.js` removes the checkbox
rather than offering one that might do nothing.

### The app exits immediately with no window

If Electron exits with no window, or the main process fails with `The requested
module 'electron' does not provide an export named 'BrowserWindow'`, check for
`ELECTRON_RUN_AS_NODE` in the environment:

```bash
echo $ELECTRON_RUN_AS_NODE            # anything but empty is the problem
```

```powershell
$env:ELECTRON_RUN_AS_NODE             # PowerShell
```

It makes the Electron binary run as plain Node, so there is no `app`, no
`BrowserWindow` and no window. **VS Code's plugin host exports it and every shell
it spawns inherits it**, so a terminal inside an editor can have it set even
though no dotfile does — which makes this most likely to bite exactly when you
are working in an IDE.

`yarn build:desktop` unsets it for its own build. For anything else:

```bash
env -u ELECTRON_RUN_AS_NODE npx quasar dev -m electron   # bash / zsh / Cygwin
```

```powershell
Remove-Item Env:ELECTRON_RUN_AS_NODE                     # PowerShell
```

### `dist/electron is in use, so the previous build cannot be cleared`

Windows will not delete a file anything holds open. A second build running in
another terminal is the usual cause; a running copy of the app is the other.
Close it and try again.

### `The Electron runtime is missing, so there is nothing to package`

The `electron` package is a wrapper; its runtime is downloaded separately and
`yarn install` does not do it — see [The Electron runtime](#the-electron-runtime).
Re-run `setup.ps1` / `setup.sh`, which fetches it, or do it directly:

```bash
npx install-electron
```

`node node_modules/electron/install.js` is the same script under another name,
and is what the error message quotes because it needs no `node_modules/.bin` on
PATH.

### `No application bundle was produced under dist/electron/Packaged` (macOS)

electron-builder ran but wrote no `.app`. Read back through the build output for
the real failure — a signing error is the usual one, and it does not always stop
the build.

### Notarisation fails with a CloudKit "Record not found"

Stapling ran against a submission Apple never accepted. The script checks the
verdict rather than the exit status precisely to avoid this, so seeing it means
stapling was run by hand. Check the submission first:

```bash
xcrun notarytool info <submission-id> --keychain-profile <profile>
```

### Stale state after an update

Delete local storage in the browser (or the app's user data directory) after an
app update.

---

# Setting the machine up

Signing is opt-in on every platform, and **nothing here is needed to build**. A
build with no credentials configured is unsigned, which is the right outcome for
anyone who is not the maintainer, and the script says so as it goes.

Credentials live in a file outside the repository, so no certificate or identity
is ever baked into the source and there is a single place to edit them. The
build reads `~/.config/macsign.env` on macOS and `~/.config/winsign.env` on
Windows; set `PALMAS_SIGN_ENV` to override the path.

## Signing on macOS

`quasar build -m electron` on its own produces an unsigned application, which is
what you want locally: it launches without Gatekeeper interfering. Distributing
one to another Mac needs it signed with a Developer ID, notarized by Apple and
stapled, which `yarn build:desktop` does when it finds
`~/.config/macsign.env`:

```bash
export APPLE_SIGNING_IDENTITY="Developer ID Application: Your Name (TEAMID)"
export APPLE_KEYCHAIN_PROFILE="notarytool-profile"
export CODESIGN_IDENTITY="Developer ID Application: Your Name (TEAMID)"
export NOTARY_PROFILE="notarytool-profile"
```

Store the notary profile once with `xcrun notarytool store-credentials`. Without
the file the script says so and builds unsigned, so it works for anyone who is
not the maintainer.

Both the application and the disk image make the trip to Apple: electron-builder
notarizes and staples the `.app`, and the script then signs, notarizes and
staples the image around it. The image is what someone downloads, and a stapled
ticket is what lets Gatekeeper clear it without a round trip to Apple.

Use `--app` to stop after the `.app` and skip the image entirely, which is
faster when you only want something to run locally.

> The macOS half of this used to be a separate zsh script,
> `packaging/build_mac`. It is now part of `build-desktop.mjs`, so there is one
> command on every platform. Two hard-won details came across with it and are
> commented where they live: electron-builder's `APPLE_API_KEY` variables
> collide with the ones in the settings file but mean different things, and
> `notarytool` exits 0 when Apple *answers*, not when Apple *approves*.

## Signing on Windows

> ⚠️ **Windows builds are unsigned**, and Windows will say so. Downloading and
> running the installer raises *"Windows protected your PC"*, and the user has
> to choose **More info → Run anyway**. That is worth saying on any download
> page, or it looks like a malware warning.

Signing needs a certificate. Since 2023 code-signing keys must live on a
hardware token or cloud HSM, which puts a certificate at a few hundred a year —
hard to justify for a free application, and the reason this is off by default.
To turn it on, put a `.pfx` and its password in `~/.config/winsign.env`:

```bash
CSC_LINK="/path/to/certificate.pfx"
CSC_KEY_PASSWORD="..."
```

The script picks them up on its own. Without the file it builds unsigned and
tells you it did.

Linux packages are not signed at all; there is nothing to configure.

## Doing it by hand

The script wraps Quasar; these are the commands underneath it.

```bash
# Build and run the desktop app in development, with devtools
npx quasar dev -m electron

# Build and package for production
npx quasar build -m electron

# Stop after the unpacked app directory
npx quasar build -m electron -s
```

`yarn build:electron`, `yarn build:electron:dev` and `yarn build:electron:prod`
are thin aliases for the same thing.

Doing it this way skips what the script adds: the preflight checks, unsetting
`ELECTRON_RUN_AS_NODE` (see
[The app exits immediately](#the-app-exits-immediately-with-no-window)), loading
signing credentials, clearing stale output, notarising the macOS image, and
explaining the results. Reach for it when you want to pass a flag the script
does not, or to see the raw Quasar output.

## Upgrading over an older install

Upgrades need no special handling: electron-builder's NSIS install script calls
`uninstallOldVersion` before installing, so an existing copy is removed first.
Settings in `%APPDATA%` survive an uninstall.

> Both of those stop at the rename. The fork changed `appId` from
> `audio.acompas.app` to `com.dolcesfogato.palmas` and `productName` from
> `Acompas` to `Palmas`, and each guarantee above is keyed to one of them.
> NSIS finds the previous install by `appId`, so it does not see an old Acompas
> and the two sit side by side in Settings → Apps; Electron derives its user
> data directory from `productName`, so settings under `%APPDATA%\Acompas`
> (`~/Library/Application Support/Acompas` on macOS) are not inherited and
> Palmas starts fresh. Uninstall the old one by hand. This applies once, to
> machines that ran a build from before the rename.
