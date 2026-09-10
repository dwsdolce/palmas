<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useSessionStore } from 'src/stores/session'
import HelpTooltip from 'src/components/HelpTooltip.vue'

const sessionStore = useSessionStore()
const { isDarkMode } = storeToRefs(sessionStore)
</script>

<template lang="pug">
.text-center.q-mx-md
  .caption {{ $t('doc.options.content.theme.title') }}
    span.q-ml-sm
      help-tooltip(:text="$t('doc.options.content.theme.content')")
  q-toggle(
    v-model="isDarkMode",
    size="lg",
    :true-value="true",
    :false-value="false",
    checked-icon="mdi-weather-night",
    unchecked-icon="mdi-weather-sunny",
    :aria-label="isDarkMode ? $t('aria.lightMode') : $t('aria.darkMode')"
  ).theme-toggle.q-mb-lg
</template>

<style scoped>
.theme-toggle {
  transition: transform 0.2s ease;
}

.theme-toggle:hover {
  transform: scale(1.1);
}
</style>
