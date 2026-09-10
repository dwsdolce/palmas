import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'

vi.mock('animejs', () => ({ default: Object.assign(() => ({}), { remove: () => {} }) }))
vi.mock('src/composables/metronome', async () => (await import('./helpers/app-mocks')).metronomeMock())
vi.mock('src/composables/keep-awake', async () => (await import('./helpers/app-mocks')).keepAwakeMock())
vi.mock('vue-router', async () => (await import('./helpers/app-mocks')).routerMock())
vi.mock('src/boot/i18n', async () => (await import('./helpers/app-mocks')).i18nMock())
vi.mock('quasar', async (importOriginal) => (await import('./helpers/app-mocks')).quasarMock(importOriginal as never))

const { usePatternStore } = await import('src/stores/patterns')
const DrawDots = (await import('src/components/DrawDots.vue')).default

// The dots carry a translated aria-label now, so the template needs $t. The key
// itself is not what these tests are about - they check geometry and colour -
// so it resolves to the key and stays out of the way.
const mountDots = () => mount(DrawDots, { global: { mocks: { $t: (key: string) => key } } })

/** Siguiriya is the pattern the tiering exists for: 12 pulses counted as 5 uneven beats. */
const PATTERN = 'siguiriya'

describe('DrawDots', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    window.localStorage?.clear()
  })

  const mountForPattern = async () => {
    const store = usePatternStore()
    await store.initAll('flamenco', PATTERN)
    const wrapper = mountDots()
    await wrapper.vm.$nextTick()
    return { store, wrapper }
  }

  it('draws one dot per slot in the pattern', async () => {
    const { store, wrapper } = await mountForPattern()
    const dots = wrapper.findAll('span[class*="dot-"]')
    expect(dots.length).toBe(store.beatLabels.length)
    expect(dots.length).toBeGreaterThan(0)
  })

  it('marks exactly the pattern accents with the context colour', async () => {
    const { store, wrapper } = await mountForPattern()
    const accents = store.selectedData.accents

    const accented: number[] = []
    wrapper.findAll('span[class*="dot-"]').forEach((dot, i) => {
      const style = dot.attributes('style') ?? ''
      if (style.includes('--q-primary')) accented.push(i)
    })

    expect(accented).toEqual([...accents])
  })

  it('draws every accent larger than every other slot', async () => {
    const { wrapper } = await mountForPattern()
    const store = usePatternStore()
    const dots = wrapper.findAll('span[class*="dot-"]')

    const widthOf = (i: number) =>
      parseFloat((dots[i]!.attributes('style') ?? '').match(/width:\s*([\d.]+)px/)?.[1] ?? '0')

    const accents = store.selectedData.accents
    // In siguiriya every labelled beat is also an accent, so the comparison is
    // against the unlabelled pulses and the off-beat subdivisions.
    const others = dots.map((_, i) => i).filter(i => !accents.includes(i))
    expect(others.length).toBeGreaterThan(0)

    const smallestAccent = Math.min(...accents.map(widthOf))
    const largestOther = Math.max(...others.map(widthOf))
    expect(smallestAccent).toBeGreaterThan(largestOther)
  })

  describe('the palmas layer', () => {
    // The DOM expands the `outline` shorthand, so the width is what to read.
    const outlineWidth = (dot: { attributes: (name: string) => string | undefined }) =>
      parseFloat((dot.attributes('style') ?? '').match(/outline-width:\s*([\d.]+)px/)?.[1] ?? '0')

    const outlinedSlots = (wrapper: ReturnType<typeof mount>) =>
      wrapper.findAll('span[class*="dot-"]')
        .map((dot, i) => (outlineWidth(dot) > 0 ? i : null))
        .filter((i): i is number => i !== null)

    it('outlines exactly the slots the drawn instrument strikes', async () => {
      const store = usePatternStore()
      await store.initAll('flamenco', 'abandolaos')
      const wrapper = mountDots()
      await wrapper.vm.$nextTick()

      const played = store.visualizedSequence
        .map((value, i) => (value ? i : null))
        .filter((i): i is number => i !== null)

      expect(played.length).toBeGreaterThan(0)
      expect(outlinedSlots(wrapper)).toEqual(played)
    })

    it('follows the instrument you choose to draw', async () => {
      const store = usePatternStore()
      await store.initAll('flamenco', 'abandolaos')
      store.selectInstruments('click', true)
      store.visualizeInstrument('click')

      const wrapper = mountDots()
      await wrapper.vm.$nextTick()

      const clickSlots = (store.selectedData.sequences.click as (number | null)[])
        .map((value, i) => (value ? i : null))
        .filter((i): i is number => i !== null)

      expect(outlinedSlots(wrapper)).toEqual(clickSlots)
      // The click is the audible compas, so its strikes are the accents plus
      // the plain beats between them - never the palmas figure.
      expect(clickSlots).not.toEqual(
        (store.selectedData.sequences.clara as (number | null)[])
          .map((value, i) => (value ? i : null))
          .filter((i): i is number => i !== null)
      )
    })

    it('draws the compas and the palmas as separate channels', async () => {
      const store = usePatternStore()
      await store.initAll('flamenco', 'abandolaos')
      const wrapper = mountDots()
      await wrapper.vm.$nextTick()
      const dots = wrapper.findAll('span[class*="dot-"]')

      // Abandolaos is the case that motivated all of this: the pulse falls on
      // slots 0, 4 and 8 while the palmas claras strike 2, 3, 6, 7 and 10. If
      // one channel could be mistaken for the other, this pattern shows it.
      for (const accent of store.selectedData.accents) {
        expect(dots[accent]!.attributes('style')).toContain('--q-primary')
      }
      const palmas = outlinedSlots(wrapper)
      expect(palmas).not.toEqual([...store.selectedData.accents])
      expect(palmas.some(slot => !store.selectedData.accents.includes(slot))).toBe(true)
    })

    it('draws a harder strike as a heavier ring', async () => {
      const store = usePatternStore()
      await store.initAll('flamenco', 'abandolaos')
      const wrapper = mountDots()
      await wrapper.vm.$nextTick()
      const dots = wrapper.findAll('span[class*="dot-"]')

      // Media 1 is the accented sound and 3 the softest - the count-in proves
      // the ordering, playing click[0] on accents and click[1] elsewhere.
      const widthForSample = new Map<number, number>()
      store.visualizedSequence.forEach((sample, i) => {
        if (sample) widthForSample.set(sample, outlineWidth(dots[i]!))
      })

      expect(widthForSample.get(1)).toBeGreaterThan(widthForSample.get(3)!)
      expect([...widthForSample.values()].every(w => w > 0)).toBe(true)
    })
  })

  // The last entry of every beatLabels array is the "and" of the final beat -
  // checked across all 30 patterns, not one ends on a repeated first beat. It
  // used to be hidden by a v-show, and excluded from muting, on the belief that
  // it closed the loop. It sounds: soleá's pito strikes it. Counting elements
  // never caught this, because v-show renders the column and hides it with
  // display:none, so these assert what is shown rather than what exists.
  describe('the final off-beat', () => {
    it('is drawn rather than hidden', async () => {
      const { store, wrapper } = await mountForPattern()
      const last = store.beatLabels.length - 1

      expect(store.beatLabels[last]).toBeNull()

      const columns = wrapper.findAll('.column.items-center')
      expect(columns.length).toBe(store.beatLabels.length)
      expect(columns[last]!.attributes('style') ?? '').not.toContain('display: none')
    })

    it('can be silenced once the drawn instrument plays eighth notes', async () => {
      const { store, wrapper } = await mountForPattern()
      const drawn = store.visualizedInstrument
      expect(drawn).toBeDefined()

      if (!store.visualizedHasEighthNotes) store.toggleEighthNotes(drawn!.value)
      await wrapper.vm.$nextTick()
      expect(store.visualizedHasEighthNotes).toBe(true)

      const last = store.beatLabels.length - 1
      const columns = wrapper.findAll('.column.items-center')
      expect(columns[last]!.classes()).toContain('mute-target')
    })
  })
})
