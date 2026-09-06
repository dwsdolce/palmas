import { ref, computed } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { Screen, Dialog, is } from 'quasar'
import { useStorage } from '@vueuse/core'
import { t } from 'src/boot/i18n'
import type { Size, SessionState } from 'src/utils/types'

export const useSessionStore = defineStore('session', () => {
  const isUpToDatev4 = useStorage('is-up-to-date-v4', ref<boolean>(false))
  const isDarkMode = useStorage('is-dark-mode', ref<boolean>(true))
  // Muting is invisible until someone is told about it once: nothing on a dot
  // says it can be tapped. The hint shows until it has done its job - dismissed
  // by hand, or by the first beat the user silences - and then never again.
  const muteHintSeen = useStorage('mute-hint-seen', ref<boolean>(false))
  // Manual audio/visual calibration (ms) added on top of the auto-detected
  // output latency. Lets users compensate Bluetooth delay that the browser
  // under-reports via AudioContext.outputLatency.
  const audioVisualOffset = useStorage('audio-visual-offset', ref<number>(0))
  const leftDrawerOpen = ref<boolean>(Screen.gt.md)
  const visualizationSize = ref<Size>({ width: null, height: null })
  // Computed rather than a plain ref so the labels follow the locale: a ref
  // would be built once, at whatever language the app started in, and then
  // stay in English for the rest of the session.
  const visualizationModes = computed(() => [
    { label: t('doc.visualizationModes.dots'), value: 'dots' },
    { label: t('doc.visualizationModes.counter'), value: 'counter' },
    { label: t('doc.visualizationModes.clock'), value: 'clock' }
  ])
  const selectedVisualizationMode = useStorage('visualization-mode', ref('dots'))

  const visualizationMode = computed({
    get: () => selectedVisualizationMode.value,
    set: (value: string) => {
      selectedVisualizationMode.value = value
    }
  })

  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value
  }

  const toggleLeftDrawer = () => {
    leftDrawerOpen.value = !leftDrawerOpen.value
  }

  const setVisualizationSize = (payload: Size) => {
    visualizationSize.value = payload
  }

  return {
    isUpToDatev4,
    isDarkMode,
    muteHintSeen,
    audioVisualOffset,
    leftDrawerOpen,
    visualizationSize,
    visualizationModes,
    selectedVisualizationMode,
    visualizationMode,
    toggleDarkMode,
    toggleLeftDrawer,
    setVisualizationSize
  }
})
