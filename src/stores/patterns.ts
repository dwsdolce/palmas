import { ref, reactive, computed, onMounted, onUpdated, watch } from 'vue'
import { Loading, Notify, Platform, is } from 'quasar'
import { defineStore, storeToRefs } from 'pinia'
import { useStorage, useDebounceFn } from '@vueuse/core'
import { useRouter, useRoute } from 'vue-router'
import soundsData from 'src/assets/data/soundsData'
import { useMetronome } from 'src/composables/metronome'
import { useKeepAwake } from 'src/composables/keep-awake'
import { t } from 'src/boot/i18n'
import { getDefaultPatterns } from 'src/utils/utils'
import type {
  numOpts,
  instruOpts,
  InstruSeqs,
  VolumeOpts,
  PatternState,
  PatternSetting,
  ContextOption
} from 'src/utils/types'

const findInArray = <T>(array: T[], key: keyof T, value: string): T | undefined => {
  return array.find((el) => el[key] === value)
}


export const usePatternStore = defineStore('patterns', () => {
  const router = useRouter()

  const {
    metronomeEvent,
    metronomeSubEvent,
    getContext,
    reinitialize,
    initSequences,
    initMetronome,
    startSequences,
    stopAllSequences,
    changeTempo,
    changeSwing,
    humanize,
    changeVolume,
    changeDecay
  } = useMetronome()

  const {
    isSupported,
    keepAwake,
    allowSleep
  } = useKeepAwake()

  // *****************************************
  // State
  // *****************************************

  const isPlaying = ref<boolean>(false)
  const data = ref<PatternState[]>([] as PatternState[])
  const patterns = useStorage('patterns', ref<PatternSetting[]>([]))
  const selectedPatternName = useStorage('selected-pattern-name', ref('alegria'))
  const selectedContextName = useStorage('selected-context-name', ref('flamenco'))
  // One colour for every context. These used to differ - red, orange, purple,
  // light-blue, teal - and repainted the whole app on a context change. That
  // said nothing the header button and this menu's check mark do not already
  // say, and it cost the visualisation its only free hue: a second colour had
  // to avoid all five, so the palmas layer could only encode the strength of a
  // strike as one, two or three pixels of line weight. With the app one colour,
  // hue became free to mean accent.
  //
  // The per-context field is still live - MainPage sets the `primary` and
  // `secondary` CSS vars from the selected context, and SelectContext colours
  // its check mark from it - so these values do reach the screen. But giving
  // the contexts distinct colours again is no longer just a matter of editing
  // them: `accentInkColor` in composables/visualization.ts is a blue that marks
  // an accented strike, and a context whose primary moved near it would take
  // back the distinction that change bought. Any new colour here has to be
  // chosen against that blue, not merely against the other four.
  //
  // The names are translated, so this is computed - the same arrangement
  // session.ts uses for the view names, and for the same reason: a ref would be
  // built once in whatever language the app started in. Consumers still read
  // `.label`, and compare and key on `value`, so none of them had to change.
  const contextData = [
    { key: 'flamenco', value: 'flamenco', colors: { primary: 'red-6', secondary: 'red-10' }},
    { key: 'afroCuban', value: 'afro-cuban', colors: { primary: 'red-6', secondary: 'red-10' }},
    { key: 'afroBrazilian', value: 'afro-brazilian', colors: { primary: 'red-6', secondary: 'red-10' }},
    { key: 'fundamentalGlobal', value: 'fundamental-global', colors: { primary: 'red-6', secondary: 'red-10' }},
    { key: 'ternaryAfrican', value: 'ternary-african', colors: { primary: 'red-6', secondary: 'red-10' }}
  ]
  const contexts = computed<ContextOption[]>(() =>
    contextData.map(({ key, value, colors }) => ({ label: t(`contexts.${key}`), value, colors }))
  )

  // *****************************************
  // Computed
  // *****************************************

  const selectedContext = computed(() => {
    return findInArray(contexts.value, 'value', selectedContextName.value) as ContextOption
    // return contexts.value.find((el: ContextOption) => el.value === selectedContextName.value) as ContextOption
  })

  const selectedPattern = computed(() => {
    return findInArray(patterns.value, 'name', selectedPatternName.value) as PatternSetting
    // return patterns.value?.find((el: PatternSetting) => el.name === selectedPatternName.value) as PatternSetting
  })

  const selectedData = computed(() => {
    return findInArray(data.value, 'name', selectedPatternName.value) as PatternState
    // return data.value.find((el: PatternState) => el.name === selectedPatternName.value) as PatternState
  })

  const patternsInSelectedContext = computed(() => {
    return data.value
      .filter((el: PatternState) => el.context === selectedContextName.value)
      .map((el: PatternState) => ({ label: el.label, value: el.name }))
  })

  const tempo = computed({
    get: () => selectedPattern.value?.tempo || selectedData.value?.defaultTempo || 120,
    set: (value: number) => {
      if (!selectedData.value?.defaultTempo) value = selectedPattern.value?.tempo || 120
      if (selectedPattern.value) {
        selectedPattern.value.tempo = value
        changeTempo(value)

        // fastMessage/slowMessage hold an i18n key (or '' for no warning).
        if (selectedData.value && value > selectedData.value.fastTempo && selectedData.value.fastMessage) {
          Notify.create({
            message: t(`notify.tempo.${selectedData.value.fastMessage}`),
            color: 'secondary',
            icon: 'mdi-alert-circle-outline'
          })
        }

        if (selectedData.value && value < selectedData.value.slowTempo && selectedData.value.slowMessage) {
          Notify.create({
            message: t(`notify.tempo.${selectedData.value.slowMessage}`),
            color: 'secondary',
            icon: 'mdi-alert-circle-outline'
          })
        }
      }
    }
  })

  const improvisation = computed({
    get: () => selectedPattern.value?.improvisation ?? false,
    set: (value: boolean) => {
      if (selectedPattern.value) {
        selectedPattern.value.improvisation = value
      }
    }
  })

  const humanization = computed({
    get: () => selectedPattern.value?.humanization ?? false,
    set: (value: boolean) => {
      if (selectedPattern.value) {
        selectedPattern.value.humanization = value
        humanize(value)
      }
    }
  })

  const swing = computed({
    get: () => selectedPattern.value?.swing ?? 0,
    set: (value: number) => {
      if (selectedPattern.value) {
        selectedPattern.value.swing = value
        changeSwing(value)
      }
    }
  })

  const prestartBeat = computed({
    get: () => selectedPattern.value?.prestartBeat?.value,
    set: (value: number) => {
      if (selectedPattern.value) {
        selectedPattern.value.prestartBeat
          = selectedData.value?.prestartBeats.find(el => el?.value === value)
          || (selectedData.value?.prestartBeats[0] as numOpts)
        stop()
      }
    }
  })

  // Applying the decay regenerates the reverb's impulse response (an offline
  // render), so debounce it: dragging the slider updates the stored value
  // immediately but only triggers the costly regeneration once movement settles.
  const debouncedChangeDecay = useDebounceFn((value: number) => changeDecay(value), 150)

  const globalDecay = computed({
    get: () => selectedPattern.value?.globalDecay ?? 0.5,
    set: (value: number) => {
      if (selectedPattern.value) {
        selectedPattern.value.globalDecay = value
        debouncedChangeDecay(value)
      }
    }
  })

  const instruments = computed({
    get: () => selectedPattern.value?.instruments ?? [],
    set: (value: instruOpts[]) => {
      if (selectedPattern.value) {
        selectedPattern.value.instruments = value
      }
    }
  })

  const selectedInstruments = computed(() =>
    selectedPattern.value?.instruments?.filter((i: instruOpts) => i?.enabled ?? false)
  )

  const beatLabels = computed(() =>
    selectedData.value?.sequences?.beatLabels
  )

  /**
   * The instrument the visualizations draw.
   *
   * The compas and its realization are different things: `accents` is the
   * theoretical pulse, and each instrument plays its own figure against it.
   * Abandolaos is the case that makes it obvious - the pulse falls on 6, 2 and
   * 4, and the palmas claras strike on 1 and 3 - so a view that draws only the
   * compas contradicts whatever you are listening to.
   *
   * There is always exactly one, and it is never one you cannot hear: an
   * explicit choice holds while that instrument stays enabled, and otherwise
   * the first enabled instrument answers for it. Turning everything off is not
   * a state the mixer allows, so the fallback cannot come up empty.
   */
  const visualizedInstrumentName = useStorage('visualized-instrument', ref<string>(''))

  const visualizedInstrument = computed(() => {
    const enabled = selectedInstruments.value ?? []
    if (!enabled.length) return undefined
    return enabled.find((i: instruOpts) => i.value === visualizedInstrumentName.value) ?? enabled[0]
  })

  /** Draw this instrument. Ignored when it is not one you can hear. */
  const visualizeInstrument = (key: string) => {
    const target = (selectedInstruments.value ?? []).find((i: instruOpts) => i.value === key)
    if (target) visualizedInstrumentName.value = key
  }

  /**
   * The slots the user has silenced in the selected pattern.
   *
   * Held per pattern in `PatternSetting`, so it survives a restart and a change
   * of pattern, like the tempo and the volumes beside it. A Set because every
   * use is a membership test, once per slot per beat.
   */
  const mutedSlots = computed<Set<number>>(
    () => new Set(selectedPattern.value?.mutedSlots ?? [])
  )

  const isMuted = (slot: number): boolean => mutedSlots.value.has(slot)

  /** How many slots are silenced. Zero means the pattern is untouched. */
  const mutedCount = computed(() => mutedSlots.value.size)

  /**
   * The sequence the visualizations read: which sample the drawn instrument
   * plays on each slot, or null where it is silent.
   *
   * Muted slots read as silent here, which is the truth - nothing strikes on
   * them - and it is why muting needs no separate wiring in the three views.
   * The palmas ring simply stops being drawn, in the dots, the counter and the
   * clock alike. What it does *not* say is that the silence was deliberate;
   * that is the muted mark's job, and the mark reads `isMuted` directly.
   */
  const visualizedSequence = computed<(number | null)[]>(() => {
    const name = visualizedInstrument.value?.value
    if (!name) return []
    const sequence = selectedData.value?.sequences?.[name]
    if (!Array.isArray(sequence)) return []
    if (mutedSlots.value.size === 0) return sequence
    return sequence.map((value, slot) => (isMuted(slot) ? null : value))
  })

  /**
   * Whether the drawn instrument is playing the off-beats. The views follow
   * this, so the subdivisions a view shows belong to the instrument it is
   * drawing and not to some other one that happens to be on in the mixer.
   */
  const visualizedHasEighthNotes = computed(() =>
    visualizedInstrument.value?.eighthNotes ?? false
  )

  // *****************************************
  // Utility methods
  // *****************************************

  const instrument = (type: string): instruOpts | undefined => {
    return instruments.value.find((el: instruOpts) => el.value === type)
  }

  const buildPattern = async (): Promise<PatternSetting> => {
    const tmp = {
      name: selectedData.value.name,
      context: selectedData.value.context || '',
      tempo: selectedData.value.defaultTempo,
      swing: selectedData.value.name === 'tientos' ? 0.6 : 0,
      globalDecay: 0.5,
      improvisation: false,
      humanization: false,
      prestartBeat: selectedData.value.prestartBeats[0],
      instruments: Object.entries(selectedData.value.sequences).reduce((acc, [key, value]) => {
        const sound = soundsData.find((el) => el.name === key)
        if (key !== 'beatLabels' && sound) {
          acc.push({
            label: sound?.label || '',
            value: key,
            enabled: false,
            eighthNotes: sound?.noEighthNotes ? null : false,
            volume: 0
          })
        }
        return acc
      }, [] as instruOpts[])
    } as PatternSetting

    tmp.instruments[0].enabled = true

    if (selectedContext.value.value === 'flamenco') {
      tmp.instruments.push({
        label: 'Jaleos',
        value: 'jaleos',
        enabled: false,
        eighthNotes: null,
        volume: 0
      })
    }

    return tmp
  }

  // *****************************************
  // Actions
  // *****************************************

  const play = async () => {
    if (!selectedPattern.value) return

    // isPlaying flips first so the button reads as "playing" immediately, but
    // it has to be put back if the start fails. startSequences() rethrows, and
    // this used to call it without awaiting: the rejection went unhandled and
    // isPlaying stayed true with nothing playing, which turns the button into
    // a stop button. The next tap then stopped a silence instead of starting,
    // so it took two taps to play and looked like the button had been ignored.
    isPlaying.value = true

    try {
      await startSequences()
    } catch {
      // startSequences has already logged it and shown the user a message.
      isPlaying.value = false
      return
    }

    if (await isSupported()) keepAwake()
  }

  const stop = async () => {
    isPlaying.value = false
    stopAllSequences()
    if (await isSupported()) allowSleep()
    reinitialize()
  }

  const playStop = () => {
    isPlaying.value ? stop() : play()
  }

  const selectInstruments = (key: string, payload: boolean) => {
    const instru = instrument(key)
    if (instru) {
      instru.enabled = payload
    }
  }

  const toggleEighthNotes = (key: string) => {
    const instru = instrument(key)
    if (instru) instru.eighthNotes = !instru.eighthNotes
  }

  /**
   * Silence a slot, or let it sound again.
   *
   * Any number of slots can be muted, including all of them: a silent pattern
   * whose compás is still drawn is a usable exercise - keep time through it and
   * find out whether you can - not a state to guard against.
   *
   * Stored sorted so the persisted value does not depend on the order they were
   * tapped in, which keeps a diff of localStorage readable and makes two equal
   * sets compare equal.
   */
  const toggleMute = (slot: number) => {
    const pattern = selectedPattern.value
    if (!pattern) return

    const current = new Set(pattern.mutedSlots ?? [])
    current.has(slot) ? current.delete(slot) : current.add(slot)
    pattern.mutedSlots = [...current].sort((a, b) => a - b)
  }

  /**
   * Let every slot sound again.
   *
   * The way out. A slot can be muted and then become invisible - mute an
   * off-beat, then draw an instrument that does not play them - and it goes on
   * silencing whatever else is enabled with nothing on screen to tap. The muted
   * count and this are what keep that recoverable, which is why they are shown
   * whenever anything is muted rather than tucked into a menu.
   */
  const clearMutes = () => {
    const pattern = selectedPattern.value
    if (pattern) pattern.mutedSlots = []
  }

  const selectVolume = (payload: VolumeOpts) => {
    if (payload !== null) {
      const volume = payload?.volume
      const instru = instrument(payload?.instrument)
      if (instru !== undefined) instru.volume = volume
      changeVolume(payload)
    }
  }

  const restoreDefault = async (payload: string) => {
    if (isPlaying.value) stop()
    if (payload === 'all') {
      patterns.value = []
      if (!data.value.length) initStore()
    } else {
      const patternName = selectedPatternName.value
      const patternIndex = patterns.value.findIndex((el) => el.name === patternName)
      patterns.value.splice(patternIndex, 1)
    }
    return
  }

  // *****************************************
  // Initialization
  // *****************************************

  const resetContextPattern = () => {
    const tmpContext = selectedContextName.value || data.value[0].context
    const tmpPattern: string = selectedPatternName.value || data.value.find((el) => el.context === tmpContext)?.name || ''
    return router.push(`/${tmpContext}/${tmpPattern}`)
  }

  const initStore = async () => {
    // Load the data. This used to be a second, eager copy of getDefaultPatterns
    // living here - the same glob over the same directory, differing only in
    // passing { eager: true }. Eager wins when both exist, so the pattern data
    // was statically imported into the main chunk and the lazy version could
    // never split it out; the build said so six times over, once per pattern
    // file, as INEFFECTIVE_DYNAMIC_IMPORT.
    data.value = await getDefaultPatterns()

    if (!data.value.length) {
      Notify.create({
        message: t('notify.fetchDataError'),
        color: 'negative',
        icon: 'mdi-alert-circle-outline'
      })
    }

    // If no selected context, select the first one and redirect
    // if (!selectedContext.value || !selectedPattern.value) {
    //   resetContextPattern()
    // }
  }

  const initContext = async (contextName: string) => {
    const contextExists = data.value.some((el) => el.context === contextName)
    if (contextExists) {
      selectedContextName.value = contextName
      selectedPatternName.value = data.value.find((el) => el.context === contextName)?.name || ''
    } else {
      resetContextPattern()
    }
  }

  const initPattern = async (contextName: string, patternName: string) => {
    selectedPatternName.value = patternName

    const existingPattern = patterns.value.find(pattern => pattern.name === patternName)
    if (!existingPattern) {
      patterns.value.push(await buildPattern())
    }
  }

  const initAll = async (contextName: string, patternName: string) => {
    Loading.show({
      message: t('notify.loading'),
    })
    await initStore()
    await initContext(contextName)
    await initPattern(contextName, patternName)
    await initMetronome()
    await initSequences()
    Loading.hide()
  }

  // *****************************************
  // Lifecycle
  // *****************************************

  // onUpdated(async () => {
  //   if (!selectedPattern.value) await initPattern()
  //   stop()
  // })

  watch(selectedInstruments, (value) => {
    if (value?.length === 0) {
      Notify.create({
        message: t('notify.oneInstrumentRequired'),
        color: 'secondary',
        icon: 'mdi-alert-circle-outline'
      })
    }
  })

  watch(selectedContext, async (newContext) => {
    if (isPlaying.value) stop()
    if (newContext) await initContext(newContext.value)
  })

  watch(selectedPattern, async (newPattern) => {
    if (isPlaying.value) stop()
    if (newPattern) await initPattern(selectedContextName.value, newPattern.name)
  })


  // *****************************************
  // Return
  // *****************************************

  return {
    data,
    metronomeEvent,
    metronomeSubEvent,
    visualizedInstrument,
    visualizedInstrumentName,
    visualizedSequence,
    visualizedHasEighthNotes,
    visualizeInstrument,
    mutedSlots,
    mutedCount,
    isMuted,
    isPlaying,
    patterns,
    contexts,
    selectedContext,
    selectedPattern,
    selectedPatternName,
    selectedContextName,
    selectedData,
    patternsInSelectedContext,
    beatLabels,
    tempo,
    improvisation,
    humanization,
    swing,
    prestartBeat,
    selectedInstruments,
    instruments,
    globalDecay,
    // numLabels,
    initAll,
    initStore,
    instrument,
    initContext,
    initPattern,
    // buildPatterns,
    // rebuildPattern,
    play,
    stop,
    playStop,
    selectInstruments,
    selectVolume,
    toggleEighthNotes,
    toggleMute,
    clearMutes,
    restoreDefault,
    getContext
  }
})
