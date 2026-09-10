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
| Name | `Palmas: Flamenco Metronome` | 30 |
| Subtitle | `Compás y palmas` | 30 |
| SKU | `palmas` | — |

The record was created on 10 September 2026. App **names are unique across the
App Store** and are claimed on a first-come basis, and bare "Palmas" turned out
to be taken — a search had found nothing using it, but a search is indicative
and the reservation is the real test. So the store name leads with *Palmas* and
adds a descriptor, which is what makes it unique. It is also better for search
than the bare name would have been: the name is the most heavily weighted field,
"flamenco" and "metronome" are what people actually type, and "Palmas" alone
competes with Las Palmas.

This is the **store** name only. The name under the icon is still `Palmas` —
that is `CFBundleDisplayName`, set in the project, and it is a separate field.
Apple expects the two to read as the same app, which leading with *Palmas*
satisfies.

The SKU is internal and never shown, but it is permanent, and removing an app
record retires it for good. The record also holds the Bundle ID - which is why
the ID vanished from the New App dropdown once it existed - and deleting the
record may well retire the ID with it. That is not worth finding out, since the
Bundle ID is the one thing this file exists to keep: fix the record, never
delete and recreate it.

Creating it reported "one or more registration errors" and closed the dialog,
but had in fact succeeded. Check the Apps list before trying again.

## Licensing risk on the App Store

A risk accepted knowingly, on 10 September 2026, when answering App Store
Connect's content-rights question.

The code is AGPL-3.0, and most of it was written by Olivier Ricordeau and
Jérémie Sieffert, who do not support the changes this fork makes. AGPL §10 says
recipients may not have *"further restrictions"* imposed on them, and the Free
Software Foundation's position is that Apple's App Store terms are exactly that.
It has been enforced on complaint: GNU Go was removed in 2010 after the FSF
objected, and VLC in 2011 after one of its own GPL contributors did - VLC
returned only in 2013, after relicensing. Apps such as Signal ship GPL code on
the App Store because their owners hold the copyright and grant themselves an
exception. This project holds copyright on its own changes, not on upstream's.

Submitted anyway, for three reasons. Upstream meant to publish there
themselves: iOS support was added to A Compás in October 2022 (`b0a0797`,
"Updated Capacitor to v4 + Added iOS", by the contributor Pierre Mardon), and a
project that intended to ship through the App Store is unlikely to object to it
on licence grounds. The app is free. And the
consequence of an objection is removal, not something worse - a cost judged
acceptable.

If an upstream author does object, the app comes down. The clean alternative,
should it ever be wanted, is an explicit App Store exception from them for the
code they own.

The audio is not part of this risk. Upstream's README declares every `.wav` in
`audio/` CC0, which permits redistribution without conditions. The jaleos are
credited to Aziz Andry. Upstream's README once credited him for the palmas
sordas too, until the v3 rewrite in November 2022, and the sorda files have been
changed since - most recently in April 2023, "Changed samples" - so whether that
credit should return is upstream's to say. The Wikipedia text the palo help
fetches is CC BY-SA, attributed by a link to the article.

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
which is why the name under the icon is *Palmas* alone, whatever the store
listing says. "Compás y palmas" there would render as *Compás y P…*, hiding the
half that distinguishes it. The launcher never shows the store name, so that one
is free to be longer.

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
