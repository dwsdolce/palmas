# TODO

Work that is known about and not done. Each entry is a line and a pointer: the
reasoning lives next to the thing it concerns — in `docs/`, in the code, or in
the commit that introduced it — and restating it here would only create a second
copy to fall out of date. If an item needs a paragraph, the paragraph belongs
where the work does.

## Release

- **iOS build and App Store submission.** Needs the Mac. [docs/ios.md](docs/ios.md)
  has the flow, but its *Uploading to App Store Connect* section is written from
  Apple's documentation and has never been walked end to end.
- **First real run of the macOS signing path.**
  [packaging/build-desktop.mjs](packaging/build-desktop.mjs) absorbed the old
  `packaging/build_mac` in `6d16ddb`; `codesign` and `notarytool` cannot be
  exercised from Windows, so that half has never executed. Worth doing on the
  same trip as the iOS build.
- **Play Store account.** $25, and a personal account must run a closed test with
  12 testers opted in for 14 continuous days before it can apply for production
  access. See [docs/store-listing.md](docs/store-listing.md).
- **Review the machine-translated text**, Spanish, Farsi and Arabic especially.
  The palo descriptions and the release notes were translated in `7d8ba0e` and
  are unreviewed; the place names in ar/fa/ja/zh were transliterated rather than
  left in Latin script, which is the choice most worth a second opinion.

## Features

- **[Muting beats, and user-defined patterns](docs/proposals/muting-and-user-patterns.md)**
  — silence individual beats, asked for directly by a flamenco master in Spain;
  then creating and editing user patterns, then import/export. Three features,
  specified separately. Build and ship the first on its own, then decide on the
  other two. The decisions that gate it are settled in the proposal.
