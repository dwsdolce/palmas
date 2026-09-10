# TODO

Work that is known about and not done. Each entry is a line and a pointer: the
reasoning lives next to the thing it concerns — in `docs/`, in the code, or in
the commit that introduced it — and restating it here would only create a second
copy to fall out of date. If an item needs a paragraph, the paragraph belongs
where the work does.

## Release

- **App Store submission.** The iOS build itself now runs, signs and installs on
  device. What remains untried is [docs/ios.md](docs/ios.md)'s *Uploading to App
  Store Connect* section, which is written from Apple's documentation and has
  never been walked end to end. Needs the Mac.
- **Play Store account.** $25, and a personal account must run a closed test with
  12 testers opted in for 14 continuous days before it can apply for production
  access. See [docs/store-listing.md](docs/store-listing.md).
- **Review the machine-translated text**, Spanish, Farsi and Arabic especially.
  The palo descriptions and the release notes were translated in `7d8ba0e` and
  are unreviewed; the place names in ar/fa/ja/zh were transliterated rather than
  left in Latin script, which is the choice most worth a second opinion. So are
  the strings that used to be hardcoded English: the reset options, the context
  names and the screen-reader labels (`doc.reset.options`, `contexts`, `aria`).
  Of those, *Fundamental Global* is the one to look at first - the English name
  is itself unusual, so every translation of it is an interpretation.

## Features

- **[User patterns, and sharing them](docs/proposals/muting-and-user-patterns.md)**
  — muting shipped in `fb2e071`. What remains of that proposal is creating and
  editing patterns in the app, then import/export, specified separately there
  along with the one decision still open: whether a user can create a context.

## Clean-up

- **The non-flamenco patterns index their accents by beat, not by slot.** Bossa
  Nova declares `accents: [0, 3, 6, 10, 13]` while its instruments strike slots
  0, 6, 12, 20, 26 — the same numbers doubled. So it draws accent dots where
  nothing plays, and skews the jaleos' 6% accent weighting onto the wrong slots.
  16 patterns are affected: the four Afro-Brazilian, `cascara` and `mozambique`,
  the four Fundamental Global and the four Ternary African. The 12 flamenco
  patterns and the two Cuban claves are right. Doubling every accent lands each
  one on a slot some instrument actually strikes, in all 16, which is the
  evidence — but which accents a palo carries is a musical call rather than a
  mechanical one, so the fix is not a script. Inherited from A Compás.
