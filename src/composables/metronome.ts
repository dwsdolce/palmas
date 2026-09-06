import * as Tone from 'tone'
import { ref } from 'vue'
import { Loading, Notify, Dialog, Platform } from 'quasar'
import soundsData from 'src/assets/data/soundsData'
import { usePatternStore } from 'src/stores/patterns'
import { useSessionStore } from 'src/stores/session'
import { forEachValue } from 'src/utils/utils'
import { logger, describeError } from 'src/utils/logger'
import { t } from 'src/boot/i18n'
import type {
  VolumeOpts,
  DecayOpts,
  numOpts,
  SoundsDataKey,
  SoundsData,
  Sounds,
  Sound,
  Seqs,
  Seq,
  SeqSubdiv,
  PatternState,
  instruOpts,
  Players,
  ExtendedPlayer
} from 'src/utils/types'

// Private variables that can only be used within this file
const sounds: Sounds = {} as Sounds
const sequences: Seqs = {} as Seqs
const quarterChannel = new Tone.Channel(-4, 0).toDestination()
const eighthChannel = new Tone.Channel(0, -0.5).toDestination()

// Underlying Tone.Player instances, tracked so they can be disposed before a
// reload: loadSounds runs again whenever MainPage remounts (return from another
// page) or on reset. Without disposal the audio graph accumulates orphaned
// player nodes (116 per load) that are never garbage-collected.
const loadedPlayers: Tone.Player[] = []

const createMetronome = () => {
  const store = usePatternStore()

  const audioFormat = ref<string>('')
  const reverbDecay = ref<number>(0.3)
  const soundsIsLoaded = ref<boolean>(false)
  const metronomeEvent = ref<number | null>(null)
  // Subdivision (off-beat) hits are published separately from the counted
  // beats above: the counter and clock visualizations track only counted
  // beats, so folding subdivisions into `metronomeEvent` would drive them
  // to positions that have no label.
  const metronomeSubEvent = ref<number | null>(null)
  const reverb = new Tone.Reverb({
    decay: reverbDecay.value,
    preDelay: 0,
    wet: 0.3
  }).toDestination()

  // Wet path, wired once for the app lifetime (createMetronome is a singleton):
  // each channel feeds the shared reverb on top of its dry path to the
  // destination. Previously this lived in loadSounds and was re-run on every
  // reload, stacking duplicate connections onto the channels.
  quarterChannel.connect(reverb)
  eighthChannel.connect(reverb)

  /**
   * Loads all sounds with audio pooling optimization.
   * @returns {void}
   */
  const loadSounds = async (): Promise<void> => {
    try {
      logger.log('Starting sound loading process...')
      // These URLs are built at runtime - the sample is chosen by pattern and
      // by whichever format the device can decode - so the bundler never sees
      // them and cannot rewrite them the way it rewrites an imported asset.
      // That makes this the one place in the app that has to know where it is
      // deployed. BASE_URL carries the build's base, so a web build living in
      // a subfolder asks for its audio there rather than at the domain root.
      // Electron keeps its own bridge: it loads index.html over file:// and
      // the main process hands back a usable prefix.
      const publicFolder = Platform.is.electron
        ? `${window.electronAPI.getPublicPath()}/`
        : import.meta.env.BASE_URL
      const path = `${publicFolder}audio/`
      const audio = new Audio()

      // Detect supported audio format
      if (audio.canPlayType('audio/flac')) {
        audioFormat.value = 'flac'
      } else if (audio.canPlayType('audio/mpeg')) {
        audioFormat.value = 'mp3'
      } else if (audio.canPlayType('audio/mp4')) {
        audioFormat.value = 'mp4'
      } else if (audio.canPlayType('audio/wav')) {
        audioFormat.value = 'wav'
      } else if (audio.canPlayType('audio/ogg')) {
        audioFormat.value = 'ogg'
      } else {
        throw new Error('None of the available audio formats can be played')
      }

      logger.log('Detected audio format:', audioFormat.value)

      // Dispose players from a previous load before recreating them, so the
      // audio graph doesn't accumulate orphaned nodes across remounts/resets.
      loadedPlayers.forEach(player => player.dispose())
      loadedPlayers.length = 0

      // Decode every distinct sample up front, then build players from the
      // resulting AudioBuffers instead of letting each Tone.Player fetch its
      // own URL.
      //
      // Two reasons. First, Capacitor's iOS scheme handler answers a request
      // for a media extension (flac, mp3, mp4, wav, ...) with a bare
      // URLResponse rather than an HTTPURLResponse, so fetch() reports status
      // 0, `response.ok` is false, and Tone's loader fails with "could not
      // load url". Requesting an explicit byte range takes the handler's range
      // branch, which does answer with a proper 206 HTTPURLResponse. Ordinary
      // HTTP servers answer `bytes=0-` with a 206 too, so the same path works
      // on the web and in Electron.
      //
      // Second, each media is used by both a quarter- and an eighth-note
      // player; decoding once and sharing the buffer halves the work.
      const decoded = new Map<string, AudioBuffer>()
      const urls = [...new Set(
        soundsData.flatMap(({ medias }) =>
          medias.map(media => `${path}${media.src}.${audioFormat.value}`))
      )]

      await Promise.all(urls.map(async (url) => {
        const response = await fetch(url, { headers: { Range: 'bytes=0-' } })
        if (!response.ok) {
          throw new Error(`could not load ${url}: HTTP ${response.status}`)
        }
        decoded.set(url, await Tone.getContext().decodeAudioData(await response.arrayBuffer()))
      }))

      soundsData.forEach(({ name, medias }) => {
        sounds[name] = {} as Sound

        medias.forEach((media, index) => {
          const url = `${path}${media.src}.${audioFormat.value}`
          const buffer = decoded.get(url) as AudioBuffer

          const quarterPlayer = new Tone.Player(buffer).connect(quarterChannel)
          loadedPlayers.push(quarterPlayer)
          quarterPlayer.volume.value = media.volume

          const eighthPlayer = new Tone.Player(buffer).connect(eighthChannel)
          loadedPlayers.push(eighthPlayer)
          eighthPlayer.volume.value = media.volume

          // Create interface compatible with legacy system
          sounds[name][index] = {
            quarter: {
              start: (time?: number) => quarterPlayer.start(time),
              connect: (destination: Tone.Channel) => quarterPlayer.connect(destination),
              volume: quarterPlayer.volume,
              defaultVolume: media.volume
            } as ExtendedPlayer,
            eighth: {
              start: (time?: number) => eighthPlayer.start(time),
              connect: (destination: Tone.Channel) => eighthPlayer.connect(destination),
              volume: eighthPlayer.volume,
              defaultVolume: media.volume
            } as ExtendedPlayer
          } as Players
        })
      })

      // Wait for all sounds to load
      await Tone.loaded()

      logger.log('Original sound system loaded successfully')
      logger.log('Loaded sounds:', sounds)
    } catch (error) {
      logger.error('Error in loadSounds:', describeError(error))
      throw error
    }
  }

  const triggerEvent = (payload: number | null) => {
    metronomeEvent.value = payload
  }

  const triggerSubEvent = (payload: number | null) => {
    metronomeSubEvent.value = payload
  }

  /**
   * Improvises a sound on a given note.
   */
  const improvise = (
    type: string,
    time: number,
    sound: Tone.Player,
    note: number,
    key: number,
    eighthNotes: boolean
  ) => {
    // For the "click" sounds, follow the sequence and never improvise
    if (type == 'click') {
      sound?.start(time)
      return
    }

    // Don't mess with accents
    if (store.selectedData?.accents.includes(key)) {
      sound?.start(time)
      return
    }

    // Pick a probability that the sound occurence is following the pattern
    const improvisationProbability = Math.random()
    const improvisationThreshold = 0.7 // 70% chances that we don't follow the pattern

    if (improvisationProbability > improvisationThreshold) {
      // Follow the pattern ?
      if (note == key && eighthNotes && key % 2 !== 0) {
        sound?.start(time)
      }
      if (note == key && !eighthNotes && key % 2 === 0) {
        sound?.start(time)
      }
    } else {
      // Pick a probability that the sound is played
      const playProbability = Math.random()
      const playThreshold = 0.7 // 70% chances that the sound is not played
      if (playProbability > playThreshold) {
        sound?.start(time)
      }
    }
  }

  /**
   * Improvises a jaleo sound on a given note.
   */
  const improviseJaleo = (
    note: number,
    time: number,
    eighthNotes: boolean
  ) => {
    if (!eighthNotes && note % 2 !== 0) {
      return
    }
    let playThreshold = 0.98 // 98% chances that the the sound is not played
    // Check if time is a strong beat
    if (store.selectedData?.accents.includes(note)) {
      // if the event is a strong beat, sound occurence will be more probable
      playThreshold = 0.94 // 94% chances that the sound is not played
    }
    const playProbability = Math.random()
    if (playProbability > playThreshold) {
      // Pick a random index in the available jaleo sounds
      const jaleoSoundsCount = Object.keys(sounds.jaleos).length
      const randomIndex = Math.round(Math.random() * (jaleoSoundsCount - 1))
      sounds.jaleos[randomIndex][eighthNotes ? 'eighth' : 'quarter'].start(time)
    }
  }

  /**
   * Triggers a click sound on prestart beats.
   */
  const triggerPrestartBeatClick = (
    time: number,
    note: number
  ) => {
    if (
      store.selectedData?.accents &&
      store.prestartBeat &&
      store.prestartBeat > 0 &&
      note % 2 == 0
    ) {
      if (store.selectedData?.accents.includes(note)) {
        sounds.click[0].quarter.start(time)
      } else {
        sounds.click[1].quarter.start(time)
      }
    }
  }

  /**
   * Triggers audio based on the specified parameters.
   */
  const triggerAudioOnEvent = (
    eighthNotes: boolean,
    type: string,
    isLoop: boolean,
    time: number,
    note: number
  ) => {
    // Prepend prestart beats if required
    if (store.selectedPattern?.prestartBeat && type == 'prestartBeat') {
      triggerPrestartBeatClick(time, note)
    } else {
      // Don't play non-prestart sequences if note is during prestart
      if (
        store.selectedPattern?.prestartBeat?.value &&
        note < store.selectedPattern?.prestartBeat?.value * 2 &&
        !isLoop
      ) {
        return
      }

      // A muted slot silences everything on it. One check, here, rather than
      // one per instrument further down: muting is a property of the beat, not
      // of an instrument, so there is no case where one carries on through it.
      //
      // It has to be here to catch the jaleos, which return below without ever
      // reaching a sequence - they are improvised, so there is no slot to hold
      // a null. They also need catching more than anything else does: they fire
      // on 6% of accented slots against 2% elsewhere, so they are drawn to
      // exactly the beats worth muting, and one landing on a muted beat
      // announces the thing the exercise is hiding.
      //
      // The prestart click is outside this branch and keeps sounding. Muting is
      // for the pattern; the count-in is what gets you into it.
      if (store.isMuted(note)) return

      const instru = store.instrument(type)

      if (type == 'jaleos') {
        if (instru?.enabled) improviseJaleo(note, time, eighthNotes)
        return
      }

      // index is a pulsation number, value is the sound number
      if (instru?.enabled && store.selectedPattern && type) {
        const sequences = store.selectedData.sequences[type]

        sequences.forEach(
          (value: number | null, index: number) => {
            if (!value) return

            const sound: Players = sounds[type][value - 1]

            if (
              eighthNotes &&
              instru?.eighthNotes &&
              index % 2 != 0 &&
              note == index
            ) {
              const player = sound[eighthNotes ? 'eighth' : 'quarter']
              try {
                if (store.selectedPattern?.improvisation) {
                  improvise(type, time, player, note, index, eighthNotes)
                } else {
                  player.start(time)
                }
              } catch (error) {
                logger.error('Error calling player.start():', describeError(error))
              }
            } else if (!eighthNotes && index % 2 == 0 && note == index) {
              const player = sound[eighthNotes ? 'eighth' : 'quarter']
              try {
                if (store.selectedPattern?.improvisation) {
                  improvise(type, time, player, note, index, eighthNotes)
                } else {
                  player.start(time)
                }
              } catch (error) {
                logger.error('Error calling player.start():', describeError(error))
              }
            }
          }
        )
      }
    }
  }

  /**
   * Delay (in seconds) between the audio-context clock and the sound actually
   * leaving the output device. Dominated by Bluetooth latency (often
   * 150-300ms). We add it to the *visual* scheduling time so the dots light up
   * in sync with the audible click rather than with the moment the sample is
   * queued. Returns 0 on browsers that don't report it (no change).
   */
  const getOutputLatency = (): number => {
    const ctx = Tone.getContext().rawContext as unknown as AudioContext
    const autoLatency = (ctx.baseLatency || 0) + (ctx.outputLatency || 0)
    // Manual calibration (ms → s). The store is read lazily here (runtime),
    // never during setup, so it's already initialized by playback time.
    const manualOffset = (useSessionStore().audioVisualOffset || 0) / 1000
    return autoLatency + manualOffset
  }

  /**
   * Builds a compas sequence from a pattern.
   */
  const buildSequence = (
    name: string | undefined,
    eighthNotes: boolean,
    type: string,
    sequence: number[],
    isLoop: boolean
  ) => {
    // 'note' is an occurence of an element inside the sequence variable (integer)
    const seq = new Tone.Sequence((time, note) => {
      // Type is not an event, it is a prestartBeat or a selected instrument

      // Call animation on event time.
      // The 'event' sequence is used to trigger events which will trigger UI modifications
      // The quarter-note 'event' sequence marks the counted beats (even slots);
      // the eighth-note one marks the subdivisions between them (odd slots).
      const isBeat = type === 'event' && !eighthNotes && note % 2 === 0
      const isSubdivision = type === 'event' && eighthNotes && note % 2 !== 0

      if (isBeat || isSubdivision) {
        Tone.Draw.schedule(async() => {
          // Animation triggered from store mutation, invoked close to AudioContext time
          if (name === 'simple-click') {
            // simple-click alternates a single dot and has no subdivisions
            if (isBeat) triggerEvent(metronomeEvent.value === 0 ? 2 : 0)
          } else if (note !== null) {
            if (isSubdivision) triggerSubEvent(note)
            else triggerEvent(note)
          }
          // Offset the visual by the output latency so it matches the *audible*
          // click (compensates Bluetooth/device output delay).
        }, time + getOutputLatency())
      } else {
        triggerAudioOnEvent(eighthNotes, type, isLoop, time, note)
      }
    }, sequence)

    // Set/unset sequence looping
    seq.loop = isLoop
    return seq
  }

  // ========================
  // Metronome init functions
  // ========================

  /**
   * Stops and disposes every existing Tone.Sequence, without touching the
   * transport or UI state. Shared by stopAllSequences (teardown) and
   * initSequences (rebuild), so old sequences aren't leaked on re-init.
   */
  const disposeSequences = () => {
    forEachValue(sequences, (seq: SeqSubdiv) => {
      forEachValue(seq, (instrus: Seq) => {
        forEachValue(instrus, (s: Tone.Sequence) => {
          // Guard on `disposed` so the helper is idempotent: stop() then
          // reinitialize() both dispose, so this can run twice on the same set.
          if (s === null || s.disposed) return
          if (s.state === 'started') s.stop()
          s.dispose()
        })
      })
    })
  }

  /**
   * Initializes all sequences for a given pattern.
   */
  const initSequences = async (): Promise<void> => {
    // Dispose any sequences from a previous init before rebuilding them.
    disposeSequences()

    const introSeq = []
    const loopSeq: number[] = []

    if (store.selectedData?.nbBeatsInPattern) {
      if (
        store.prestartBeat
      ) {
        // Add prestart beats to intro sequence
        const prestartBeat = store.selectedData?.nbBeatsInPattern - store.selectedPattern?.prestartBeat.value * 2
        for (let i = prestartBeat; i < store.selectedData?.nbBeatsInPattern; i++) {
          introSeq.push(i)
        }
      }
      // Add pattern beats to loopable sequence
      for (let i = 0; i < store.selectedData?.nbBeatsInPattern; i++) {
        loopSeq.push(i)
      }
    }

    const instruKeys = soundsData.map((instru: SoundsData) => instru.name)
    instruKeys.push('event')

    // Build all sequences
    sequences.quarterNotes = {
      introduction: {
        prestartBeat: buildSequence(store.selectedData?.name, false, 'prestartBeat', introSeq, false),
        event: buildSequence(store.selectedPattern?.name, false, 'event', introSeq, false),
      },
      loop: instruKeys.reduce((acc: Seq, instru: string) => {
        acc[instru] = buildSequence(store.selectedPattern?.name, false, instru, loopSeq, true)
        return acc
      }, {})
    }

    sequences.eighthNotes = {
      loop: instruKeys.reduce((acc: Seq, instru: string) => {
        acc[instru] = buildSequence(store.selectedPattern?.name, true, instru, loopSeq, true)
        return acc
      }, {})
    }
  }

  const getContext = () => Tone.getContext()
  const getTransport = () => Tone.getTransport()
  const isSupported = Tone.supported

  const reinitialize = async (): Promise<void> => {
    if (!store.selectedPattern) return

    await initSequences()
    await changeTempo(store.tempo)
    await changeSwing(store.swing)
    // Decay is global, not per-sound: set it once instead of on every iteration.
    await changeDecay(store.globalDecay)

    // Build the instrument→volume lookup once (O(n+m)) rather than running a
    // find() per sound inside the loop (O(n*m)).
    const volumeByInstrument = new Map<string, number>(
      (store.instruments ?? []).map((i: instruOpts) => [i.value, i.volume])
    )
    forEachValue(sounds, (_sound, key: string) => {
      void changeVolume({ instrument: key, volume: volumeByInstrument.get(key) ?? 0 })
    })
  }

  /**
   * Tunes the audio context for the current platform: a shorter look-ahead on
   * mobile reduces the perceived delay between a tap and the click.
   * Note: `latencyHint` is read-only after the context is created (it can only
   * be passed to the Context constructor), so lookAhead is the only knob here.
   */
  const configureAudioContext = (): void => {
    if (!Tone.context) return
    Tone.context.lookAhead = Platform.is.mobile ? 0.05 : 0.1
  }

  /**
   * Initializes the metronome.
   */
  const initMetronome = async () => {
    await checkBrowserSupport()
    configureAudioContext()
    return await Tone.loaded()
      .then(async () => {
        await loadSounds()
        await reinitialize()
        soundsIsLoaded.value = true
        logger.log('Metronome initialized successfully')
        return true
      })
      .catch((error) => {
        logger.error('Failed to load samples:', describeError(error))
        soundsIsLoaded.value = false
        Notify.create({
          message: t('notify.loadSamplesFailed'),
          color: 'secondary',
          icon: 'mdi-alert-circle-outline',
        })
        return false
      })
  }

  /**
   * Starts all sequences.
   */
  const startSequences = async (): Promise<void> => {
    Loading.show({
      delay: 0,
      message: t('notify.audioInit'),
    })

    try {
      await Tone.start()

      // Tone.start() resolves whether or not the context actually reached
      // "running". iOS has a state the other platforms do not - "interrupted",
      // entered when the audio session is taken away and not always left on its
      // own - and a context sitting in it advances no transport: no sound, no
      // dots moving, and no error anywhere. The button simply looks dead.
      //
      // Ask for it back, then insist on knowing. A start that cannot produce
      // audio is a failure, and saying so puts a message on screen, a reason in
      // the log, and the play button back the way it was.
      const rawContext = Tone.getContext().rawContext as unknown as AudioContext
      if (rawContext.state !== 'running') {
        logger.warn('Audio context is', rawContext.state, '- asking it to resume')
        await rawContext.resume().catch(() => undefined)
      }
      if (rawContext.state !== 'running') {
        throw new Error(`audio context is ${rawContext.state}, not running`)
      }

      logger.log('Audio context state:', Tone.context.state)

      await reinitialize()

      const offset = sequences.quarterNotes.introduction?.event?.length || 0
      const loopStart = `0:${offset / 2}`

      getTransport().start()
      Loading.hide()

      if (sequences.quarterNotes && sequences.eighthNotes) {
        if (sequences.quarterNotes.introduction?.event?.length !== 0) {
          sequences.quarterNotes.introduction?.event?.start(0).stop(offset)
          sequences.quarterNotes.introduction?.prestartBeat?.start(0).stop(offset)

          forEachValue(sequences.quarterNotes.loop, (seq: Tone.Sequence) => {
            seq.start(loopStart)
          })
          forEachValue(sequences.eighthNotes.loop, (seq: Tone.Sequence) => {
            seq.start(loopStart)
          })
        } else {
          forEachValue(sequences.quarterNotes.loop, (seq: Tone.Sequence) => {
            seq.start(0)
          })
          forEachValue(sequences.eighthNotes.loop, (seq: Tone.Sequence) => {
            seq.start(0)
          })
        }
      }

      logger.log('Sequences started successfully')
    } catch (error) {
      Loading.hide()
      logger.error('Failed to start sequences:', describeError(error))

      Notify.create({
        message: t('notify.startSequencesFailed'),
        color: 'negative',
        icon: 'mdi-alert-circle-outline',
        timeout: 3000
      })

      throw error
    }
  }

  /**
   * Stops all sequences.
   */
  const stopAllSequences = () => {
    disposeSequences()
    getTransport().stop()
    triggerEvent(null)
    triggerSubEvent(null)
  }

  /**
   * Changes the tempo of the metronome.
   */
  const changeTempo = async (tempo: number): Promise<void> => {
    getTransport().bpm.value = tempo
  }

  /**
   * Changes the swing of the metronome.
   */
  const changeSwing = async (swing: number): Promise<void> => {
    getTransport().swing = swing
  }

  /**
   * Changes the humanization of the metronome.
   */
  const humanize = async (humanization: boolean): Promise<void> => {
    // Do nothing if sequences have not been initialized
    if (typeof sequences.quarterNotes === 'undefined') return

    forEachValue(sequences.quarterNotes.loop, (seq: Tone.Sequence, type: string) => {
      if (type === 'event' || type === 'prestartBeat' || type === 'click') {
        seq.humanize = false
      } else {
        seq.humanize = humanization
      }
    })
    forEachValue(sequences.eighthNotes, (seq: SeqSubdiv) => {
      forEachValue(seq, (s: Tone.Sequence) => {
        s.humanize = humanization
      })
    })
  }

  /**
   * Changes the volume of the metronome.
   */
  const changeVolume = async (payload: VolumeOpts): Promise<void> => {
    try {
      // Update legacy system for compatibility
      const sound = sounds[payload.instrument]
      if (sound) {
        forEachValue(sound, (player: Players) => {
          if (player.quarter.volume) {
            // Appliquer le volume en combinant defaultVolume + offset demandé
            const baseVolume = player.quarter.defaultVolume || 0
            player.quarter.volume.value = baseVolume + payload.volume
          }
          if (player.eighth.volume) {
            // Appliquer le volume en combinant defaultVolume + offset demandé
            const baseVolume = player.eighth.defaultVolume || 0
            player.eighth.volume.value = baseVolume + payload.volume
          }
        })
      }
    } catch (error) {
      logger.warn('Error changing volume:', error)
    }
  }

  /**
   * Changes the decay of the metronome's reverb.
   *
   * Setting `reverb.decay` triggers an *asynchronous* regeneration of the
   * impulse response; `reverb.ready` is reassigned synchronously to the new
   * generation's promise. We await it so callers know the new decay is actually
   * applied (and audible) before continuing.
   */
  const changeDecay = async (decay: number): Promise<void> => {
    reverb.decay = decay
    await reverb.ready
  }

  /**
   * Warns the user if the browser lacks the Web Audio support required by
   * the app. `Tone.supported` resolves to `false` (it does not reject) when
   * unsupported, so we inspect the resolved value rather than catching.
   * Called from initMetronome() so it runs in a real runtime context, not
   * during Pinia store setup (where component lifecycle hooks are unavailable).
   */
  const checkBrowserSupport = async (): Promise<void> => {
    const supported = await isSupported().catch(() => false)
    if (!supported) {
      Dialog.create({
        title: t('notify.browserUnsupported.title'),
        message: t('notify.browserUnsupported.message'),
        persistent: true
      })
    }
  }

  return {
    // Reactive states
    audioFormat,
    reverbDecay,
    reverb,
    soundsIsLoaded,
    metronomeEvent,

    // Basic audio functions
    loadSounds,
    triggerEvent,
    triggerSubEvent,
    metronomeSubEvent,
    improvise,
    improviseJaleo,
    triggerPrestartBeatClick,
    triggerAudioOnEvent,
    buildSequence,

    // Context functions
    getContext,
    isSupported,
    checkBrowserSupport,

    // Initialization functions
    initSequences,
    initMetronome,
    reinitialize,

    // Metronome controls
    startSequences,
    stopAllSequences,
    changeTempo,
    changeSwing,
    humanize,
    changeVolume,
    changeDecay
  }
}

// Single shared metronome instance. The audio graph (channels, reverb) and the
// reactive state must be unique across the whole app: the Pinia store and any
// component have to drive the *same* metronome, not separate detached copies.
let metronomeInstance: ReturnType<typeof createMetronome> | null = null

/**
 * Returns the shared metronome singleton, creating it on first use.
 *
 * The first call happens during the patterns store setup; the re-entrant
 * `usePatternStore()` inside `createMetronome` resolves to the store proxy
 * Pinia has already registered, so no recursion occurs. Only call this once
 * the patterns store can be initialized (i.e. from within Pinia/components).
 */
export const useMetronome = () => {
  if (!metronomeInstance) {
    metronomeInstance = createMetronome()
  }
  return metronomeInstance
}
