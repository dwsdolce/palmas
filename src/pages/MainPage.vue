<script setup lang="ts">
import { ref, computed, onUpdated, onMounted, onUnmounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useQuasar, Platform, setCssVar, colors, is } from 'quasar'
import { useRouter, useRoute } from 'vue-router'
import SelectPattern from 'src/components/SelectPattern.vue'
import RhythmOptions from 'src/components/RhythmOptions.vue'
import SelectInstruments from 'src/components/SelectInstruments.vue'
import PlayButton from 'src/components/PlayButton.vue'
import SelectTempo from 'src/components/SelectTempo.vue'
import DrawDots from 'src/components/DrawDots.vue'
import DrawCounter from 'src/components/DrawCounter.vue'
import DrawClock from 'src/components/DrawClock.vue'
import GlobalEvents from 'src/components/GlobalEvents.vue'
import { usePatternStore } from 'src/stores/patterns'
import { useSessionStore } from 'src/stores/session'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const patternStore = usePatternStore()
const sessionStore = useSessionStore()

const { getPaletteColor } = colors
const { context, pattern } = route.params


const {
  data,
  isPlaying,
  selectedPattern,
  selectedContext,
  selectedContextName,
  selectedPatternName,
  mutedCount
} = storeToRefs(patternStore)

const {
  initAll,
  initContext,
  initPattern,
  stop,
  clearMutes
} = patternStore

const { isDarkMode, visualizationMode, muteHintSeen } = storeToRefs(sessionStore)

const { setVisualizationSize } = sessionStore

/**
 * The one-time pointer at muting.
 *
 * Nothing on a dot says it can be tapped and the help is a menu away, so the
 * feature is invisible until someone is told about it once. Shown only in the
 * dots view, which is the only one with tap targets, and only until it has done
 * its job: dismissed by hand, or by the first beat the user silences.
 */
const showMuteHint = computed(() =>
  !muteHintSeen.value &&
  visualizationMode.value === 'dots' &&
  mutedCount.value === 0
)

watch(mutedCount, (count) => {
  if (count > 0) muteHintSeen.value = true
})

const headerHeight = computed(() => window.innerHeight - ($q.platform.is.electron ? 82 : 50))

const activeComponent = computed(() => {
  if (visualizationMode.value === 'dots') {
    return DrawDots
  } else if (visualizationMode.value === 'counter') {
    return DrawCounter
  } else if (visualizationMode.value === 'clock') {
    return DrawClock
  }
  return DrawDots // Default fallback
})

onMounted(() => {
  if (context && pattern) {
    initAll(context as string, pattern as string)
    setCssVar('primary', getPaletteColor(selectedContext.value.colors?.primary))
    setCssVar('secondary', getPaletteColor(selectedContext.value.colors?.secondary))
  }
})

onUnmounted(() => {
  if (isPlaying.value) stop()
})

watch(() => route.params, async (params) => {
  if (params.context && params.pattern) {
    await initContext(params.context as string)
    await initPattern(params.context as string, params.pattern as string)
  }
})

watch(() => selectedContext.value, async (context) => {
  if (context) {
    setCssVar('primary', getPaletteColor(selectedContext.value.colors?.primary))
    setCssVar('secondary', getPaletteColor(selectedContext.value.colors?.secondary))
  }
})
</script>

<template lang="pug">
q-page.flex(
  :class="isDarkMode ? 'text-white' : 'text-black'"
)
  global-events
  .main-panel.q-pa-xs.col-grow
    .top-panel(ref="visualization")
      transition(name="fade" mode="out-in")
        component(:is="activeComponent", :key="visualizationMode")
    //- Grey, and set apart from the count chip below, which is primary: one
      says what you can do, the other what you have done.

      The colour has to be named, and named per theme. QChip sets
      `color: rgba(0, 0, 0, .87)` on itself, and a colour applied to an element
      beats one inherited from an ancestor - so the text-white this page puts on
      q-page never reached the chip, and an uncoloured one stayed near-black on
      the dark ground, at a contrast of 1.3:1. Quasar's own dark chip styling
      would have covered it, but that follows $q.dark, which this app never
      sets: the theme here is our own classes. Both greys clear WCAG AA against
      the ground they sit on - 5.9:1 dark, 5.4:1 light.
    .row.justify-center.q-mt-sm(v-if="showMuteHint")
      q-chip.mute-hint(
        outline,
        dense,
        :color="isDarkMode ? 'grey-5' : 'grey-7'",
        icon="mdi-gesture-tap",
        removable,
        @remove="muteHintSeen = true",
        :label="$t('doc.mute.hint')"
      )
    //- The way back from muting, and the only sign of it in the counter and the
      clock, where there is nothing to strike through. It also covers the case a
      muted slot can reach: mute an off-beat, then draw an instrument that does
      not play them, and the slot goes on silencing with nothing left on screen
      to tap. Shown only when something is muted, so it costs nothing otherwise.
    .row.justify-center.q-mt-sm(v-if="mutedCount > 0")
      q-chip.mute-count(
        outline,
        dense,
        color="primary",
        icon="mdi-volume-off",
        removable,
        @remove="clearMutes",
        :label="$t('doc.mute.count', { count: mutedCount })",
        :aria-label="$t('doc.mute.clear')"
      )
    .bottom-panel.row.no-wrap
      .left-panel.col-6.col-sm-5
        select-pattern.q-mb-sm
        rhythm-options.q-mb-sm
        select-instruments
      .middle-panel(v-if="$q.screen.md || $q.screen.gt.md").col-2
        play-button
      .right-panel.col-6.col-sm-5
        select-tempo
    .sub-panel(v-if="$q.screen.lt.md")
      play-button
</template>
