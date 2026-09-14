# TODO

Work that is known about and not done. Each entry is a line and a pointer: the
reasoning lives next to the thing it concerns — in `docs/`, in the code, or in
the commit that introduced it — and restating it here would only create a second
copy to fall out of date. If an item needs a paragraph, the paragraph belongs
where the work does.

## Release

- **App Store review, then the 1.0.0 release.** 1.0.0 (915) was submitted on
  2026-09-10 and is waiting for Apple's review. The desktop and Android builds of
  the same commit are already in the draft GitHub release. Once Apple approves,
  publish that release and add the README's Download section and a live version
  badge in place of the static one. If Apple asks for changes, rebuild every
  platform from the fixed commit and replace the draft's files before publishing.
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
