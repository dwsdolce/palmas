# Muting beats, and user-defined patterns

**Status:** 📋 Proposed. Investigation done, spec below. No code.

**Goal:** Let a player silence individual beats of a pattern — asked for directly
by a flamenco master in Spain, who wants a student to supply the missing beat and
be caught if they drift. That request leads on to creating and editing patterns
in the app rather than by writing files, and to sharing them, which is a much
larger feature and is kept separate here.

These are **three features**, not one, and the first is worth shipping alone:

1. **Muting** — silence beats of an existing pattern. Small; changes nothing.
2. **User patterns** — copy a predefined pattern, then edit it. Substantial.
3. **Import / export** — share pattern files. Needs validation of untrusted input.

---

## Current state (investigation, 2026-09-05)

**A silent beat is already representable.** An instrument sequence is
`(number | null)[]` — `null` is silence, `1`/`2`/`3` select the sample by strength.
Muting a beat means putting `null` in a slot. No new concept is required.

**There is one seam.** Sequence data is read in four places, all from
`selectedData.sequences`:

| Reader | Purpose |
|---|---|
| `composables/metronome.ts:312` | playback |
| `stores/patterns.ts:237` (`visualizedSequence`) | all three visualizations |
| `stores/patterns.ts:199` (`beatLabels`) | the numerals |
| `stores/patterns.ts:268` (`buildPattern`) | the mixer's instrument list |

A single computed that overlays user edits onto the authored sequences feeds all
of them. Playback, dots, counter and clock follow with no further work.

**Except the jaleos, which bypass that seam entirely.** `metronome.ts` returns
before the sequence loop for `type == 'jaleos'` and calls `improviseJaleo()`
instead — they are improvised, not sequenced, and have no line in `sequences` to
put a `null` into. A sequence-level overlay would therefore silence every
instrument *but* the jaleos, in the one context where they are likely to be on.
Muting has to gate that call as well.

**Per-pattern user state is already persisted.** `PatternSetting` is stored in
`localStorage` under `patterns`, one record per pattern, holding tempo, swing,
decay, prestart, and per-instrument enabled/volume/eighth-notes. It also declares
`sequences: InstruSeqs` — which `buildPattern()` never populates. The slot for
user-edited sequences exists and is empty.

**The compás cannot be silenced, because it never sounds.** `accents` is the
abstract pulse and carries no audio; every sound comes from an instrument
sequence. Silencing "the compás" could only mean hiding its marker — a display
change, not an audio one. See the comment at `stores/patterns.ts:205`.

**Muting is safe against improvisation.** Playback does `if (!value) return`
before any improvisation runs, so a nulled slot cannot be resurrected by
`improvise()` or by humanization.

**The dots are display-only.** `DrawDots.vue` has no click handlers; tap-to-mute
is new interaction work, and needs a target big enough to hit (the 44px rule that
already governs the help buttons).

**The format already has a written spec, and it has drifted.**
[contributing.md](../contributing.md) documents `PatternState`, `InstruSeqs` and
the sequence conventions for people authoring patterns by hand. Anything the app
writes has to agree with it or there are two formats. Three constraints from it
bear directly on an editor:

- **`beatLabels` is not an instrument.** It sits in `sequences` beside the
  instrument lines, but its values are *printed on screen* rather than played,
  and it may hold strings as well as numbers. An editor has to treat it apart.
- **Subdivisions are fixed at quarter and eighth notes.** Nothing finer is
  representable; ternary feel is approximated with the swing control. That caps
  what a user can express, and it should be said rather than discovered.
- **Sounds cannot be added from the app.** A new sound needs a `.wav` master in
  `audio/`, an entry in `soundsData.ts` and a conversion run. So a user pattern
  can only use the instruments that ship — user *patterns*, never user *sounds*.

The doc is currently wrong in five places — the folder path, the audio formats,
the `InstruSeqs` type, a surviving "A Compas", and `doc`/`places`, which it
presents as the way to describe a pattern when nothing has read them since the
descriptions moved into the catalogues. Decision 9 makes that last one true
again rather than deleting it. The doc needs correcting before it can serve as
the reference for an export format.

**Beats are not slots.** `nbBeatsInPattern` counts *subdivisions*, two per beat —
a 12-beat compás is 24. "Mute beat 10" means slot 18. Easy, and easy to get wrong.

---

## Design decisions to settle (before code)

1. **What a mute silences — settled: the beat, not an instrument.** Every
   enabled instrument is silent in that slot — the palmas variants, any
   percussion enabled beside them, and the jaleos. There is no notion of one
   instrument continuing through a muted beat; that would be editing, which is
   feature 2 and a different mental model. This matches the request as it was
   made — "mute individual beats" — it is explainable in one sentence, and it is
   observable: you hear nothing. Holding this line is what stops feature 1 from
   growing into feature 2.

   **How many — settled: any number, independently, from none to all.** Beats are
   muted one at a time and there is no limit. Muting every beat of a pattern is
   legal and leaves it silent while the dots still show the compás; that is a
   usable exercise, not an error state, and nothing should prevent a user
   reaching it.

   **The jaleos are silenced too — settled**, though it takes an explicit check
   rather than falling out of the overlay, because they are not sequenced (see
   above). The reason to include them: they fire probabilistically and are
   *weighted toward the accents* — a 6% chance on a strong beat against 2%
   elsewhere — so they land precisely on the beats a teacher is most likely to
   mute, and a jaleo on a muted beat announces the one thing the exercise is
   hiding. The contrary case is real and musical, since a jaleo into the gap is
   what a palmero actually does; settled for silence on the grounds that muting
   asks the app to behave like an exercise rather than a performance, and
   expected to be revisited once the feature has been used in earnest.

   Implementation note: `accents` is not touched by muting, so `improviseJaleo`
   still sees a muted beat as an accent. The check must be against the muted
   slots, not against accent status.

2. **Whether a muted beat also disappears visually.** Two sub-cases, and they are
   different exercises: silencing the sound while the dot still shows the beat is
   a *reading* exercise; hiding the marker too is a harder *memory* exercise.
   Recommendation: ship sound-only, and keep the marker visible but obviously
   marked as muted — otherwise the user cannot see what they have done, and
   cannot undo it. A "hide the compás" mode is a separate idea worth its own
   discussion.

3. **How to unmute.** Recommendation: tap the same dot again. Plus a visible
   **"N beats muted — clear"** control, because after muting six beats hunting
   them individually is tedious and a user who has forgotten what they did needs
   one obvious way out.

4. **Whether mutes persist — settled: persisted.** Per pattern, in
   `PatternSetting`, alongside tempo, swing and volumes. The condition is that a
   silenced beat has an obvious graphical representation, which the feature needs
   regardless of how long the state lasts, so it costs nothing to require it.
   The reasoning, for the record:
   - **Per pattern, persisted** — consistent with tempo, swing and volumes, which
     are already stored per pattern in `PatternSetting`. Come back next week and
     your exercise is as you left it.
   - **Session only, cleared when the pattern changes** — nothing can surprise
     you later.

   The risk of persistence is a silent modification discovered weeks later.
   Visible state plus one-click clearing is what makes that risk acceptable —
   which is why decision 2 (the marker stays visible, marked as muted) and the
   standing "clear" control from decision 3 are part of the same call, not
   separate niceties.

5. **Overlay or copy.** Recommendation: store the mute as a **sparse overlay** —
   a list of muted slot indices on `PatternSetting` — not a full copy of the
   edited sequences. A copy pins the user's data to the authored pattern's shape,
   so a pattern corrected in a later release would silently keep the old one. An
   overlay survives that. (Feature 2 is the opposite case: a user pattern *is* a
   copy, deliberately.)

6. **Predefined patterns are read-only.** Agreed and worth stating as a rule: the
   authored patterns ship with the app and change between releases, so an edit to
   one would either be overwritten or would block the update. Editing a
   predefined pattern **copies it to a user pattern first** — a Save As, not an
   edit in place. This also keeps feature 1 honest: muting never modifies a
   pattern at all.

7. **Identity for user patterns** (feature 2). Patterns are keyed by `name`,
   `selectedPatternName` persists in `localStorage`, and lookups assume
   uniqueness. User patterns need a namespace — `user:solea-mine` — or a copy
   named `solea` collides with the authored one.

8. **Validation moves from build time to run time** (feature 3). `test/patterns.spec.ts`
   enforces that every sequence length equals `nbBeatsInPattern`, that accents
   ascend and fall inside the pattern, and that names are unique. Authored data
   gets those guarantees at build time. An imported file is **untrusted input**
   and needs the same checks live, with a real error rather than a crash. This is
   most of the work in feature 3.

9. **Descriptions come from two channels, and the catalogue wins.** Settled:
   `PatternState.doc` and `.places` are **not** dead fields to be deleted. They
   are the channel for descriptions that are *not* translated, and the message
   catalogues are the channel for those that are. Resolution order:

   > If a catalogue entry exists for this pattern, use it. Otherwise use the
   > pattern's own `doc` / `places`.

   That gives three cases one mechanism:
   - **Shipped patterns** — empty fields, catalogue entries, nine languages.
   - **Contributed patterns** — the contributor writes `doc` in their own
     language; a maintainer promotes it to the catalogues later if it is worth
     translating.
   - **User patterns** — the user writes whatever they like, in whatever
     language, and it is never translated because it is theirs.

   This also removes a barrier the translation move created without anyone
   noticing: a musician submitting a pattern today **cannot** give it a
   description at all without editing nine locale files and satisfying
   `test/i18n.spec.ts`. The fallback restores the easy path.

10. **User descriptions must be sanitised. This is a security decision, not a
    formatting one.** `HelpPattern.vue:101` renders the description with
    `v-html`, which is safe today only because the content ships with the app.
    Under decision 9 the field carries user input, and an **imported** pattern
    carries a stranger's input — `v-html` on that executes whatever script it
    contains.

    Recommendation: render descriptions through `MarkdownRenderer`, which already
    does `DOMPurify.sanitize(marked.parse(...))` and is what the Wikipedia
    extract and the help text use. Route **both** channels through it rather than
    only the user one: `marked` passes authored HTML through and DOMPurify keeps
    `<p>`, so the shipped descriptions render as they do now, and the unsanitised
    path stops existing rather than being kept for the trusted case. Users then
    get markdown, which is a kinder thing to ask for than HTML.

11. **Whether a user can add a context** (feature 2). There are five today —
    Flamenco, Afro-Cuban, Afro-Brazilian, Fundamental Global, Ternary African.
    A context is lighter than it looks: an entry in a hardcoded array in
    `stores/patterns.ts` carrying a label, a value and colours that are now all
    identical, plus a `context` string on each pattern. Membership is *derived* —
    patterns are filtered by `el.context === selectedContextName` — but the menu
    is not, so a user pattern claiming `context: 'balkan'` would filter correctly
    and never appear. Making the list include user contexts is the whole change.

    Three options, and the choice affects where a copied pattern lands:
    - **Keep the source pattern's context.** A copy of Soleá appears under
      Flamenco next to Soleá, marked as user-made. Nothing new to name.
    - **A reserved "My patterns" context.** Simple, but it separates a copy from
      the thing it was copied from, which is where you would look for it.
    - **User-created contexts.** Fits the project's stated aim of playing any
      kind of rhythm, and is the only option that serves someone working on
      material none of the five describes.

    Recommendation: **the first as the default, the third as a later addition.**
    A copy belongs beside its original; genuinely new material eventually wants
    its own grouping, and that can be added once patterns exist to put in it.
    Deferring it also avoids answering, too early, what happens to a context that
    is renamed or emptied while `selected-context-name` and the URL still name it.

---

## Difficulty estimate

- **1. Muting — easy.** One computed applying the overlay at the seam, a click
  handler and a muted style on the dots, a clear-all control, and the overlay
  field on `PatternSetting`. No new storage, no new identity, no migration, and
  nothing that can corrupt a pattern. The traps are the beats-vs-slots indexing
  and making the muted state visible enough to satisfy decision 4.

- **2. User patterns — moderate, and the real project.** Needs pattern identity
  and namespacing (#7), a copy-from-predefined flow, a merged list of authored
  plus user patterns everywhere patterns are listed, an editing UI beyond
  tap-to-mute (cycling `null→1→2→3` per instrument), and decisions about what is
  editable at all — sequences certainly, but tempo range, accents and
  `nbBeatsInPattern` are open. Editing accents means editing the compás itself,
  which is a bigger claim than editing a palmas figure. Plus fields for the
  pattern's own description and places, which decision 9 makes straightforward.

- **3. Import / export — moderate, mostly validation.** JSON is the obvious
  format. The work is the runtime validation (#8), a version field so a future
  format change is detectable, and deciding what a file contains — one pattern or
  a set, and whether it carries the user's tempo and volumes or only the pattern.
  An imported description is a stranger's text rendered in your app, so decision
  10 is load-bearing here rather than tidy-minded.

---

## Recommendation

Build **1 and ship it**, then decide on 2 and 3 — which are expected to follow,
not to be abandoned.

Shipping 1 on its own is worth doing for its own sake: it is what was actually
asked for, it is a layer rather than an edit — the authored pattern is never
touched, so nothing can be corrupted — and it puts the feature in a teacher's
hands in days rather than after the larger project lands.

It also answers the question that governs everything after it: whether tapping
the dots is the right gesture. If it is, feature 2's editing UI is the same
gesture cycling through sample strengths instead of on/off, designed against
something real rather than imagined. If it is not, better to have learned that
from a feature that took days.

Nothing now gates feature 1: decisions 1-6 are settled or recommended without
objection. Decision 11, whether a user can create a context, is the one still
genuinely open, and it belongs to feature 2 — it need not hold up muting.

**One piece is worth doing immediately, ahead of all three.** Decision 9 is not
only about user patterns: it repairs contribution, which is broken today. A
musician submitting a pattern cannot describe it without editing nine locale
files, because `HelpPattern` stopped reading `doc`/`places` when the descriptions
moved into the catalogues and nothing replaced that path. Restoring the fallback,
routing it through `MarkdownRenderer` (decision 10), and correcting
[contributing.md](../contributing.md) is a small change that stands on its own —
no muting, no user patterns, no file format — and it is a prerequisite for both
of them anyway.
