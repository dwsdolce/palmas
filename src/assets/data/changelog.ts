/**
 * Release history, shown on the changelog page.
 *
 * Metadata only. The prose for each release lives in the message catalogues
 * under `doc.changelog.releases.<id>`, so it is translated like everything else
 * the app says. `id` is what joins the two, rather than `version`: vue-i18n
 * reads a dot as a path separator, so "1.0.0" would nest three levels deep.
 *
 * This history is Palmas's own and starts at 1.0.0. The file previously held
 * A Compás's, which ended at 3.2.7 in August 2024 and never covered their 4.x
 * line at all - so it was not the upstream changelog so much as a stale fragment
 * of it. Upstream's own history lives with upstream:
 * https://gitlab.com/acompas/acompas
 *
 * `build` is the git commit count at release, the same build number the header
 * shows beside the version and the same one CFBundleVersion and the Android
 * versionCode carry. It is what identifies which build a bug report came from,
 * since a version alone can cover many. It is never typed for a release in
 * progress:
 *
 *   - the newest entry takes `process.env.APP_BUILD`, the commit count the build
 *     stamps into the header, so the changelog and the header cannot disagree;
 *   - once a release ships, its entry is frozen at the build it shipped as,
 *     `git rev-list --count v<version>`, and a new entry starts above it.
 *
 * scripts/check-release-ready.mjs refuses to build until that roll-over is done.
 * 1.0.0's entry was typed by hand as 868 and shipped as 931, which is why.
 *
 * The notes were untranslated for a while, because keeping nine locales in step
 * with a growing record had already failed once: six of them fell five to eight
 * releases behind, and their readers saw a changelog that simply stopped with no
 * sign anything was missing. What makes it hold now is that test/i18n.spec.ts
 * requires every locale to carry every key en-US has, arrays included - so a
 * release written in English and nowhere else fails the suite rather than
 * shipping silently.
 *
 * Newest first. Entries are rendered as markdown.
 */

export interface ChangelogEntry {
  /** Key into `doc.changelog.releases` in the message catalogues. */
  id: string
  version: string
  date: string
  /** `process.env.APP_BUILD` on the newest entry; the shipped build, frozen, on every other. */
  build?: string
}

export default [
  {
    // TODO(1.0.2): before releasing, write this release's notes in all nine
    // locales and set the date. Until it has notes the changelog page does not
    // show it, and the test allows only this newest entry to be empty.
    id: 'v1_0_2',
    version: '1.0.2',
    date: '2026-11-08',
    build: process.env.APP_BUILD
  },
  {
    id: 'v1_0_1',
    version: '1.0.1',
    date: '2026-11-08',
    // Frozen at the build it shipped as - `git rev-list --count v1.0.1`.
    build: '935'
  },
  {
    id: 'v1_0_0',
    version: '1.0.0',
    date: '2026-09-03',
    // Frozen at the build it shipped as - `git rev-list --count v1.0.0`.
    build: '931'
  }
] as ChangelogEntry[]
