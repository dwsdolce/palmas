# Store listing

The text and identifiers Palmas is published under. This file exists because
these were decided once, in conversation, and nothing in the code records them:
a store listing lives in Apple's and Google's consoles, not in the build.

## Identifiers

| | |
|---|---|
| Bundle ID (Apple) | `com.dolcesfogato.palmas` |
| `applicationId` (Android) | `com.dolcesfogato.palmas` |
| Electron `appId` | `com.dolcesfogato.palmas` |

The same string everywhere, taken from a domain this project controls.

**It cannot be changed after the first publish.** A store listing is bound to
its identifier permanently — a new one means a new listing, with no shared
reviews, ratings or installs. If any of this is to be revisited, it has to be
revisited before the first upload, not after.

## Apple App Store

| Field | Value | Limit |
|---|---|---|
| Name | `Palmas` | 30 |
| Subtitle | `Compás y palmas` | 30 |

App **names are unique across the App Store** and are claimed on a first-come
basis in App Store Connect. Nothing found in a search used a bare "Palmas" —
the neighbours are all geographic (Las Palmas, Palmas del Mar) or unrelated
clubs and restaurants — but a search is indicative, not authoritative. The
reservation is the real test.

## Google Play

| Field | Value | Limit |
|---|---|---|
| Title | `Palmas` | 30 |
| Short description | `Compás y palmas — metrónomo flamenco` | 80 |

Play permits duplicate titles and enforces uniqueness only on the package name,
so the title is not at risk in the way the Apple name is.

## Why these

*Palmas* are the handclaps that carry the compás, which is what the app plays.
Short enough to survive the launcher, which truncates to about 11 characters —
that is why the descriptive phrase is a subtitle rather than part of the name.
"Compás y palmas" as a title would render on a home screen as *Compás y P…*,
hiding the half that distinguishes it.

*Compás y palmas* is standard flamenco pedagogy phrasing (Taller Flamenco in
Sevilla runs a course under that exact name), which is good for search and
means nobody can claim it. The conjunction is **y**, not *e* — Spanish only
elides to *e* before an /i/ sound, and *palmas* begins with /p/.

The name deliberately avoids "A Compás". See the fork section in
[the README](../README.md) for why that matters: the upstream authors do not
support these changes, and the AGPL that permits this fork also permits
requiring that modified versions be marked as different.

## Before either store

- **Artwork is done.** The mark is a script P inside a ring of twelve dots, in
  `#f44336` — the app's own primary colour. It replaced A Compás's circled A and
  `Compás` wordmark, which had been shipping under the Palmas name while every
  string already said Palmas. Sources are in
  [resources/artwork](../resources/artwork/README.md); the icon set is generated
  from `logo.svg` by the build itself.
- **Apple is the reachable route.** There is a developer account, and iOS
  builds need the Mac that already exists. The build flattens the alpha channel
  out of the app icon on its own, which App Store Connect rejects and which only
  fails at upload.
- **Do not tick "make available on Mac"** under Pricing and Availability. The
  app cannot decode audio in that runtime, so it would ship a silent metronome.
  See [Do not offer this app on the Mac](ios.md#do-not-offer-this-app-on-the-mac).
  The Mac already has the Electron build.
- **The privacy policy is live** at
  <https://www.dolcesfogato.com/palmas/privacy.html>, which is the URL App Store
  Connect asks for.
- **Play is not, yet.** A personal developer account created after 13 Nov 2023
  must run a closed test with **12 testers opted in continuously for 14 days**
  before it can even apply for production access, and Google now checks that
  those testers actually used the app. Plus the one-off $25 fee. Organisation
  accounts are exempt but need a real legal entity and a D-U-N-S number.
  A signed APK served directly from the site, or F-Droid, needs none of this.
