import type { Player, Reverb, Volume, Sequence, Gain } from 'tone'

export interface SoundsDataKey {
  src:                      string
  volume:                   number
}

export interface SoundsData {
  name:                     string
  label:                    string
  longLabel?:               string
  medias:                   SoundsDataKey[]
  noEighthNotes?:           boolean
}

export interface ExtendedPlayer extends Player {
  defaultVolume:            number
}

export interface Players {
  quarter:                  ExtendedPlayer
  eighth:                   ExtendedPlayer
}

export interface Sound {
  [x: number]:              Players
  reverb:                   Reverb
  volume:                   number
}

export interface Sounds {
  [x: string]:              Sound
}

export interface Seq {
  [x: string]:              Sequence | undefined
}

export interface SeqSubdiv {
  introduction?:            Seq
  loop:                     Seq
}

export interface Seqs {
  quarterNotes:             SeqSubdiv
  eighthNotes:              SeqSubdiv
}

export interface TuningFork {
  isPlaying:                boolean
  notes:                    string[]
  activeNote:               string | null
}

export interface stringOpts {
  label:                    string
  value:                    string
}

export interface numOpts {
  label:                    string
  value:                    number
}

export interface instruOpts extends stringOpts {
  enabled:                  boolean
  eighthNotes:              boolean | null
  volume:                   number
}

export interface visuOpts extends stringOpts {
  isActive:                 boolean
}

export interface Size {
  width:                    number | null
  height:                   number | null
}

export interface VolumeOpts {
  instrument:               string
  volume:                   number
}

export interface DecayOpts {
  instrument:               string
  decay:                    number
}

export interface InstruSeqs {
  [x: string]:            (number | null)[]
}
export interface PatternState {
  id:                       number
  name:                     string
  label:                    string
  context?:                 string
  linkedPatterns?:          stringOpts[]
  minTempo:                 number
  maxTempo:                 number
  defaultTempo:             number
  slowTempo:                number
  fastTempo:                number
  nbBeatsInPattern:         number
  accents:                  number[]
  sequences:                InstruSeqs
  prestartBeats:            numOpts[]
  slowMessage?:             string
  fastMessage?:             string
  longLabel?:               string
  doc?:                     string
  wikipediaUrl?:            string
  places?:                  string
  videoExample?:            string
}

export interface PatternSetting {
  name:                     string
  label:                    string
  context:                  string
  globalDecay:              number
  instruments:              instruOpts[]
  sequences:                InstruSeqs
  /**
   * Slots the user has silenced, as indices into the pattern's sequences.
   *
   * A sparse overlay rather than a copy of `sequences`: the authored pattern is
   * never modified, so a pattern corrected in a later release still corrects
   * here, where a stored copy would quietly keep the old one. Optional because
   * every record written before muting existed has no such field.
   */
  mutedSlots?:              number[]
  tempo:                    number
  swing:                    number
  improvisation:            boolean
  humanization:             boolean
  prestartBeat:             numOpts
}

export interface SessionState {
  leftDrawerOpen:           boolean
  visualizationSize:        Size
}


export interface ColorOption {
  primary:                  string
  secondary:                string
}
export interface ContextOption {
  label:                    string
  value:                    string
  colors:                   ColorOption
}
