import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'

// A real vue-i18n instance with real messages, not the shared mock. The mock's
// `t` returns the key it is given, so a test built on it would pass whatever the
// code did. What has to be proven is that labels built inside a computed follow
// a change of language, rather than being fixed at whatever the app started in.
vi.mock('src/boot/i18n', async () => {
  const { createI18n } = await import('vue-i18n')
  const enUS = (await import('src/i18n/en-US')).default
  const frFR = (await import('src/i18n/fr-FR')).default
  const i18n = createI18n({
    legacy: false,
    locale: 'en-US',
    messages: { 'en-US': enUS, 'fr-FR': frFR }
  })
  return { i18n, t: (key: string) => i18n.global.t(key) }
})
vi.mock('src/composables/metronome', async () => (await import('./helpers/app-mocks')).metronomeMock())
vi.mock('src/composables/keep-awake', async () => (await import('./helpers/app-mocks')).keepAwakeMock())
vi.mock('vue-router', async () => (await import('./helpers/app-mocks')).routerMock())
vi.mock('quasar', async (importOriginal) => (await import('./helpers/app-mocks')).quasarMock(importOriginal as never))

const { i18n } = await import('src/boot/i18n')
const { usePatternStore } = await import('src/stores/patterns')
const ResetButton = (await import('src/components/ResetButton.vue')).default

const locale = i18n.global.locale as unknown as { value: string }

describe('labels that follow the language', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    locale.value = 'en-US'
  })

  it('names the contexts in the chosen language', () => {
    const store = usePatternStore()
    const label = (value: string) => store.contexts.find(c => c.value === value)!.label

    expect(label('afro-cuban')).toBe('Afro-Cuban')
    expect(label('flamenco')).toBe('Flamenco')

    locale.value = 'fr-FR'
    expect(label('afro-cuban')).toBe('Afro-cubain')
    expect(label('ternary-african')).toBe('Africain ternaire')
  })

  // "All patterns and settings" promised more than reset does: it clears
  // per-pattern state and leaves the theme, the view and the audio/visual delay
  // alone. The label now says only what happens.
  it('offers the reset choices in the chosen language, promising only patterns', () => {
    // Only the template's $q.screen needs Quasar here; useQuasar() in the script
    // is called when a reset runs, which this test does not do.
    const wrapper = mount(ResetButton, {
      global: { plugins: [i18n], mocks: { $q: { screen: { lt: { md: false } } } } }
    })
    const labels = () =>
      (wrapper.vm as unknown as { resetOptions: { label: string }[] }).resetOptions.map(o => o.label)

    expect(labels()).toEqual(['Only for current pattern', 'All patterns'])

    locale.value = 'fr-FR'
    expect(labels()).toEqual(['Uniquement le motif actuel', 'Tous les motifs'])
  })
})
