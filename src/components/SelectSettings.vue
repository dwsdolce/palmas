<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useSessionStore } from 'src/stores/session'
import CustomCard from 'src/components/CustomCard.vue'
import ThemeToggle from 'src/components/ThemeToggle.vue'
import SelectLang from 'src/components/SelectLang.vue'
import SelectVisualization from 'src/components/SelectVisualization.vue'
import SelectAudioOffset from 'src/components/SelectAudioOffset.vue'
import ResetButton from 'src/components/ResetButton.vue'

const { t } = useI18n()

const sessionStore = useSessionStore()

const {
  visualizationMode
} = storeToRefs(sessionStore)

const settingsDialog = ref(false)

watch(visualizationMode, () => {
  settingsDialog.value = false
})

const handleReset = () => {
  settingsDialog.value = false
}
</script>

<template lang="pug">
div
  q-btn(
    flat,
    dense,
    round,
    :aria-label="$t('buttons.settings')",
    @click="settingsDialog = true"
  ).q-mr-sm
    q-icon(name="mdi-cog")

  q-dialog(
    id="settingsDialog",
    v-model="settingsDialog"
  )
    CustomCard
      template(v-slot:title) {{ t('buttons.settings') }}
      template(v-slot:content)
        ThemeToggle
        SelectLang
        select-visualization.q-mb-md
        select-audio-offset.q-mb-md
        reset-button(
          @reset="handleReset"
        ).q-mb-md
</template>
