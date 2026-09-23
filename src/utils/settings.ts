/**
 * What the user chose, and nothing else.
 *
 * Settings used to hold a copy of the app's own data: each visited pattern was
 * written out whole - every instrument with its label, its name and whether it
 * can play eighth notes - so a release that added an instrument, renamed one or
 * changed a pattern's length left that copy disagreeing with the app. There was
 * no migration, only the "App initialization" dialog: clear everything and
 * reload. It greeted every new install, and App Review read it as an error.
 *
 * So nothing derivable is stored. A choice is the user's or it is not written,
 * and what is missing means the default. A new instrument then appears on its
 * own, a removed one stops being read, and labels are never stale because they
 * are never stored. What remains genuinely the user's - a tempo, a silenced
 * slot - is checked against the pattern when it is read, in `stores/patterns`.
 *
 * `settings-version` is for the changes this cannot absorb: a stored shape that
 * has to be rewritten rather than defaulted. Each step below runs once, in
 * order, and the version is then written back.
 */

export interface InstrumentChoice {
  enabled?: boolean
  eighthNotes?: boolean
  volume?: number
}

export interface PatternChoice {
  tempo?: number
  swing?: number
  globalDecay?: number
  improvisation?: boolean
  humanization?: boolean
  /** The `value` of one of the pattern's prestartBeats, not the option object. */
  prestartBeat?: number
  mutedSlots?: number[]
  /** Keyed by instrument name, which is what the pattern's sequences are keyed by. */
  instruments?: Record<string, InstrumentChoice>
}

export type PatternChoices = Record<string, PatternChoice>

export const CHOICES_KEY = 'pattern-choices'
export const VERSION_KEY = 'settings-version'

/** Raised when a step is added below. */
export const SETTINGS_VERSION = 1

const LEGACY_PATTERNS_KEY = 'patterns'
const LEGACY_UP_TO_DATE_KEY = 'is-up-to-date-v4'

/** A record as the pre-1 app wrote it. Everything is optional: it is user data. */
interface LegacyRecord {
  name?: unknown
  tempo?: unknown
  swing?: unknown
  globalDecay?: unknown
  improvisation?: unknown
  humanization?: unknown
  prestartBeat?: { value?: unknown } | null
  mutedSlots?: unknown
  instruments?: unknown
}

const asNumber = (value: unknown): number | undefined =>
  (typeof value === 'number' && Number.isFinite(value) ? value : undefined)

const asBoolean = (value: unknown): boolean | undefined =>
  (typeof value === 'boolean' ? value : undefined)

/** Drops the keys whose value is undefined, so an absent choice stays absent. */
const withoutBlanks = <T extends object>(value: T): T =>
  Object.fromEntries(Object.entries(value).filter(([, v]) => v !== undefined)) as T

const instrumentChoices = (value: unknown): Record<string, InstrumentChoice> | undefined => {
  if (!Array.isArray(value)) return undefined

  const choices: Record<string, InstrumentChoice> = {}
  for (const entry of value) {
    const name = (entry as { value?: unknown })?.value
    if (typeof name !== 'string') continue

    const choice = withoutBlanks({
      enabled: asBoolean((entry as { enabled?: unknown }).enabled),
      // null means the instrument has no eighth notes, which is the app's to
      // say rather than the user's, so it is not a choice worth keeping.
      eighthNotes: asBoolean((entry as { eighthNotes?: unknown }).eighthNotes),
      volume: asNumber((entry as { volume?: unknown }).volume)
    })
    if (Object.keys(choice).length > 0) choices[name] = choice
  }

  return Object.keys(choices).length > 0 ? choices : undefined
}

/**
 * The pre-1 `patterns` array, read as choices.
 *
 * Exported for the tests, which is where the old shapes are written down.
 */
export const choicesFromLegacy = (stored: unknown): PatternChoices => {
  if (!Array.isArray(stored)) return {}

  const choices: PatternChoices = {}
  for (const record of stored as LegacyRecord[]) {
    const name = record?.name
    if (typeof name !== 'string' || name === '') continue

    const muted = Array.isArray(record.mutedSlots)
      ? record.mutedSlots.filter((slot): slot is number => asNumber(slot) !== undefined)
      : undefined

    choices[name] = withoutBlanks({
      tempo: asNumber(record.tempo),
      swing: asNumber(record.swing),
      globalDecay: asNumber(record.globalDecay),
      improvisation: asBoolean(record.improvisation),
      humanization: asBoolean(record.humanization),
      prestartBeat: asNumber(record.prestartBeat?.value),
      mutedSlots: muted !== undefined && muted.length > 0 ? muted : undefined,
      instruments: instrumentChoices(record.instruments)
    })
  }

  return choices
}

const read = (storage: Storage, key: string): unknown => {
  const raw = storage.getItem(key)
  if (raw === null) return undefined
  try {
    return JSON.parse(raw)
  } catch {
    // Unreadable settings are not worth a dialog: the defaults are all any of
    // this falls back to, and the app starts either way.
    return undefined
  }
}

/**
 * Bring stored settings up to `SETTINGS_VERSION`, silently.
 *
 * Runs before the stores read storage - see `boot/settings.ts`. A first install
 * has nothing to convert and is simply stamped with the current version.
 */
export const migrateSettings = (storage: Storage = localStorage): void => {
  const version = asNumber(read(storage, VERSION_KEY)) ?? 0
  if (version >= SETTINGS_VERSION) return

  if (version < 1) {
    const legacy = read(storage, LEGACY_PATTERNS_KEY)
    if (legacy !== undefined) {
      const choices = choicesFromLegacy(legacy)
      // Only write if there is something to keep, so an empty array does not
      // leave "{}" behind as though a choice had been made.
      if (Object.keys(choices).length > 0) {
        storage.setItem(CHOICES_KEY, JSON.stringify(choices))
      }
      storage.removeItem(LEGACY_PATTERNS_KEY)
    }
    // The flag behind the "App initialization" dialog. The dialog is gone; this
    // is the last thing that ever read it.
    storage.removeItem(LEGACY_UP_TO_DATE_KEY)
  }

  storage.setItem(VERSION_KEY, JSON.stringify(SETTINGS_VERSION))
}
