<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUpdate } from 'vue'
import { getCssVar, is } from 'quasar'
import { storeToRefs } from 'pinia'
import anime from 'animejs'
import { usePatternStore } from 'src/stores/patterns'
import { useCompasVisual } from 'src/composables/visualization'
import { useSessionStore } from 'src/stores/session'
import type { CSSProperties } from 'vue'
import type { Size } from 'src/utils/types'

const patternStore = usePatternStore()
// Compas and palmas are drawn the same way here, in the counter and in the
// clock; the encoding lives in one place so the three cannot drift apart.
const {
  roleOf,
  palmasWeight,
  compasColor,
  compasScale,
  compasOpacity,
  palmasColor,
  inkColor,
  isHidden,
  showsEighthNotes
} = useCompasVisual()
const sessionStore = useSessionStore()

// how to get the browser viewport size in a vue environment?
// https://stackoverflow.com/questions/36862334/get-viewport-window-height-in-vuejs

const { innerWidth: width, innerHeight: height } = window
const {
  selectedPattern,
  selectedContext,
  selectedData,
  metronomeEvent,
  metronomeSubEvent,
  beatLabels
} = storeToRefs(patternStore)

const {
  visualizationSize,
  isDarkMode
} = storeToRefs(sessionStore)

const { isMuted, toggleMute } = patternStore

/**
 * Whether this slot can be silenced by tapping it.
 *
 * Only what you can see. Quasar's `invisible` keeps a hidden slot in the layout
 * so the beat spacing never shifts, which means every hidden slot is still sat
 * under the pointer - and how many are hidden varies with the pattern and with
 * the drawn instrument's eighth notes. Bulería shows 6 of 12 slots, soleá 12 of
 * 24, bossa nova 16 of 32. Muting something invisible would silence a beat with
 * nothing on screen to tap again.
 */
const canMute = (i: number) => !isHidden(i)

/**
 * The muted mark: a line struck through the dot.
 *
 * Every other channel is spoken for - fill and size carry the compás, the
 * outline and its hue carry the palmas - so the mark needed one of its own. A
 * slash reads as cancelled without borrowing any of them, survives both themes,
 * and does not depend on colour to be seen.
 *
 * The palmas ring is already gone by the time this is drawn: a muted slot reads
 * as silent in `visualizedSequence`, so nothing strikes there and no ring is
 * drawn, in the counter and the clock as much as here. The slash is what says
 * the silence was asked for rather than merely written that way.
 */
const muteSlashStyle = computed(() => ({
  position: 'absolute' as const,
  left: '-30%',
  top: 'calc(50% - 1px)',
  width: '160%',
  height: '2px',
  backgroundColor: inkColor.value,
  transform: 'rotate(-45deg)',
  pointerEvents: 'none' as const
}))

// const dotSize = ref<number>(20)
const minDotSize = ref<number>(20)
const maxDotSize = ref<number>(60)
// const fontSize = ref<number>(16)
const minFontSize = ref<number>(16)
const maxFontSize = ref<number>(30)
const gutter = ref<number>(10)
const borderRadius = ref<number>(50)

const dots = ref<HTMLDivElement[] | null[]>([])
const nbs = ref<HTMLDivElement[] | null[]>([])

/**
 * How many slots go on a row, and so how many rows the compás takes.
 *
 * The tap target has a floor and no ceiling. WCAG 2.5.5 asks for 44px but is
 * AAA; 2.5.8 is the AA rule and asks 24. Holding out for 44 is what broke the
 * phone: twelve slots reserved 528px against 385px of screen, and a pattern
 * with eighth notes wanted 1056. Above the floor a column simply takes its
 * share of the width, which is what makes the compás span the window.
 *
 * So: fill a row until a slot would fall under 24px, then take another row.
 * Landscape never wraps, which matters because it only has the height for one
 * row; portrait wraps only with eighth notes on, and only ever to two rows.
 * Rows are even - 24 splits 12 and 12 - which for a twelve is also where you
 * would break it. Breaking on the palo's accents would be better still, but
 * the accents are wrong for 16 of the 30 patterns, so that waits on the data.
 */
const MIN_TARGET = 24

// q-px-md either side, which the measured width does not account for.
const PADDING = 32

const slotsPerRow = computed(() => {
  const slots = beatLabels.value?.length ?? 0
  const width = (visualizationSize.value.width ?? 0) - PADDING
  if (!slots || width <= 0) return Math.max(slots, 1)

  // An even number of slots to a row, so a beat is never parted from its own
  // off-beat by the line break. Rounding 11 up to 12 costs nothing here and
  // keeps every row starting on a beat.
  const even = (n: number) => n + (n % 2)

  for (let rows = 1; rows <= slots; rows++) {
    const per = Math.min(slots, even(Math.ceil(slots / rows)))
    if (width / per >= MIN_TARGET) return per
  }
  return slots
})

/**
 * Equal columns, so a wrapped compás keeps its beats aligned down the rows
 * rather than drifting with `justify-around`. Capped at 44px so a handful of
 * slots on a wide screen do not spread into a row of distant islands.
 */
const gridStyle = computed(() => {
  const columns = slotsPerRow.value
  return {
    // Fractions rather than pixels, so the columns divide exactly the width
    // that is there and nothing spills past the padding.
    //
    // No maximum. Capping this at 44px a column and centring it looked tidy in
    // the abstract and wrong on a screen: the compás bunched into the middle
    // with empty margins either side, where it used to span the window. The
    // dots are the same size either way - it is only the spacing - and spread
    // is what it looked like before, and better.
    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`
  }
})

const dotSize = computed(() => {
  if (visualizationSize.value.width && selectedData.value?.nbBeatsInPattern) {
    const computedDotSize = visualizationSize.value.width / slotsPerRow.value / 1.5
    if (computedDotSize < minDotSize.value) {
      return minDotSize.value
    } else if (computedDotSize > maxDotSize.value) {
      return maxDotSize.value
    } else {
      return computedDotSize
    }
  } else {
    return 20
  }
})

const fontSize = computed(() => {
  if (visualizationSize.value.width && selectedData.value?.nbBeatsInPattern) {
    const computedDotSize = visualizationSize.value.width / slotsPerRow.value / 1.5
    if (computedDotSize < minFontSize.value) {
      return minFontSize.value
    } else if (computedDotSize > maxFontSize.value) {
      return maxFontSize.value
    } else {
      return computedDotSize
    }
  } else {
    return minFontSize.value
  }
})

const dotStyle = computed(() => (i: number) => {
  const base = dotSize.value / 2
  const max = base * compasScale.accent
  const role = roleOf(i)
  const size = base * compasScale[role]
  const weight = palmasWeight(i)

  return {
    width: size + 'px',
    height: size + 'px',
    borderRadius: borderRadius.value + '%',
    // Keep every dot on one centre line despite the differing diameters.
    marginTop: dotSize.value / 2 + (max - size) / 2 + 'px',
    backgroundColor: compasColor(i),
    opacity: compasOpacity[role],
    // The palmas layer: an outline set off the dot so it reads as a ring
    // rather than a fatter dot, its thickness the weight of the strike.
    // outline-offset leaves a real gap showing whatever is behind, so no
    // background colour has to be guessed here.
    //
    // Only the accented ring is widened, from 3px to 6px. The softer two keep
    // the weight they had: the point is to make the accent obvious, not to
    // thicken the whole layer, and each view scales this same 3/2/1 weight to
    // suit its own geometry (the clock uses weight*4+2, the counter weight*2).
    outline: weight ? `${weight === 3 ? 6 : weight}px solid ${palmasColor(i)}` : 'none',
    outlineOffset: weight ? '2px' : '0',
    // So the muted slash can be positioned against the dot it strikes through.
    position: 'relative' as const
  }
})

const nbStyle = computed(() => {
  return {
    fontSize: fontSize.value + 'px',
    // fontWeight: 'bold',
    color: isDarkMode.value ? 'white' : 'black',
    opacity: 0.6
  }
})

const animateDot = (index: number, scale: number, withLabel: boolean) => {
  anime({
    targets: dots.value[index],
    scale: [
      { value: 1, duration: 0 },
      { value: scale, duration: 1000 }
    ],
    direction: 'reverse',
    easing: 'easeInSine'
  })
  if (!withLabel) return
  anime({
    targets: nbs.value[index],
    opacity: [
      { value: 0.6, duration: 0 },
      { value: 1, duration: 1000 }
    ],
    direction: 'reverse',
    easing: 'easeInSine'
  })
}

watch(metronomeEvent, (v) => {
  if (v !== null) animateDot(v, 3, true)
})

// Subdivisions pulse smaller than counted beats, and carry no label to fade.
watch(metronomeSubEvent, (v) => {
  if (v !== null && showsEighthNotes.value) animateDot(v, 2, false)
})

// make sure to reset the refs before each update
onBeforeUpdate(() => {
  dots.value = []
  nbs.value = []
})
</script>

<template lang="pug">
.full-width.q-px-md.compas-grid(:style="gridStyle")
  //- The whole column is the tap target, not the dot: a dot is 20-60px across
    depending on how many the pattern has, and the smallest of those is well
    under the 44px a finger needs. The column carries the numeral too, which is
    the part people aim at.
  .column.items-center(
    v-for="(beat, i) in beatLabels",
    :key="i",
    :class="canMute(i) ? 'mute-target' : ''",
    :role="canMute(i) ? 'button' : undefined",
    :tabindex="canMute(i) ? 0 : undefined",
    :aria-pressed="canMute(i) ? isMuted(i) : undefined",
    :aria-label="canMute(i) ? `${$t('doc.mute.beat')} ${beat ?? i + 1}` : undefined",
    @click="canMute(i) && toggleMute(i)",
    @keydown.enter.prevent="canMute(i) && toggleMute(i)",
    @keydown.space.prevent="canMute(i) && toggleMute(i)"
  )
    span(
      :style="dotStyle(i)",
      :ref="el => { dots[i] = el }",
      :class="['shadow-1', `dot-${i}`, isHidden(i) ? 'invisible' : '']"
    ).item-center.q-mb-md
      span(v-if="isMuted(i)", :style="muteSlashStyle")
    span(
      v-if="selectedPattern && selectedPattern.name !== 'simple-click'",
      :style="nbStyle",
      :ref="el => { nbs[i] = el }"
    ).text-center {{ beat }}
</template>

<style scoped>
.compas-grid {
  display: grid;
  justify-content: center;
  align-content: center;
  row-gap: 2px;
}
.mute-target {
  cursor: pointer;
  /* The grid column sets the width - see slotsPerRow, which never lets it fall
     under 24px - and this is the matching floor for the height. 44 here while
     the width may be 24 is not a target anyone asked for. In practice the dot
     and its numeral are taller than this anyway. */
  min-height: 24px;
  /* No justify-content here. The columns are stretched to the row's height and
     do not all hold the same content - a slot that is accented but carries no
     numeral has only the dot in it - so centring drops those dots below the
     line the rest sit on. `dotStyle`'s marginTop is what puts every dot on one
     centre line, and it only works from a flex-start baseline. */
}
.mute-target:focus-visible {
  outline: 2px solid var(--q-primary);
  outline-offset: 2px;
  border-radius: 4px;
}
</style>
