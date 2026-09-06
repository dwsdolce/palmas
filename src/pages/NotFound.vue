<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useQuasar, Platform } from 'quasar'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { usePatternStore } from 'src/stores/patterns'
import { useSessionStore } from 'src/stores/session'

const { t } = useI18n()

const sessionStore = useSessionStore()
const { isDarkMode } = storeToRefs(sessionStore)
</script>

<template lang="pug">
//- Named per theme rather than fixed. This page draws straight onto the app
  background, with no card between - so a single grey cannot serve both: grey-1
  is 15.1:1 on the dark ground and 1.1:1 on the light one, where the message was
  invisible and the page looked empty apart from the button. The numerals are
  large text, which AA judges at 3:1, but the pair keeps them comfortable in
  both.
q-page.q-pa-sm.flex.justify-center.items-center(
  :class="isDarkMode ? 'text-grey-1' : 'text-grey-9'"
)
  .main-panel#page404.column.flex-center.text-center.relative-position
    .title.col: h1(:class="isDarkMode ? 'text-grey-5' : 'text-grey-6'") 404
    .subtitle.col {{ $t('notFound.header') }}
    q-btn(
      color="primary",
      :label="$t('notFound.btn')",
      to="/"
    ).col
</template>
