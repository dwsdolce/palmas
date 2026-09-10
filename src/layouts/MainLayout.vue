<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Screen, Platform } from 'quasar'
import { storeToRefs } from 'pinia'
import LeftDrawer from 'src/components/LeftDrawer.vue'
import SelectContext from 'src/components/SelectContext.vue'
import SelectSettings from 'src/components/SelectSettings.vue'
import { useSessionStore } from 'src/stores/session'
import { usePatternStore } from 'src/stores/patterns'
import type { Ref } from 'vue'
import type { Size } from 'src/utils/types'

const sessionStore = useSessionStore()
const patternStore = usePatternStore()

const { setVisualizationSize } = sessionStore
const { isDarkMode } = storeToRefs(sessionStore)
const { contexts } = storeToRefs(patternStore)

const leftDrawerOpen: Ref<boolean> = ref(Screen.gt.md)

Screen.setSizes({ sm: 500, md: 650, lg: 1000, xl: 2000 })

// "1.0.0 (867)" — the marketing version and the git commit count, the same
// pairing every other project here shows, after Swift's
// CFBundleShortVersionString (CFBundleVersion). The build number is what makes
// two builds of one version tellable apart in a bug report.
const appVersion = process.env.APP_VERSION?.valueOf() || '1.0.0'
const appBuild = process.env.APP_BUILD?.valueOf() || ''
const versionString = appBuild ? `${appVersion} (${appBuild})` : appVersion

const onResize = (size: Size) => {
  setVisualizationSize(size)
}

// Built at runtime rather than imported, so the bundler never sees these URLs
// and cannot rewrite them for the deployment path - the same reason the audio
// paths in src/composables/metronome.ts need BASE_URL. Without it the header
// images are fetched from the domain root and 404 anywhere but a root install.
const publicFolder = computed(() =>
  Platform.is.electron
    ? `${window.electronAPI.getPublicPath()}/`
    : import.meta.env.BASE_URL
)
</script>

<template lang="pug">
q-layout(
  view="hhh LpR lFf",
  :class="{ 'capacitor-android': Platform.is.capacitor && Platform.is.android }"
)
  q-header
    q-bar.q-electron-drag(v-if="Platform.is.electron")
    q-toolbar
      q-btn(
        id="menuBtn",
        flat,
        dense,
        round,
        @click="leftDrawerOpen = !leftDrawerOpen",
        :aria-label="$t('aria.menu')"
      )
        q-icon(name="mdi-menu")

      //- The wordmark alone, no avatar beside it. The mark and the name said
        the same thing twice, and together they overflowed the toolbar at 360px
        - a common phone width - wrapping onto two lines and clipping the
        version number. The mark earns its place on the launcher, the favicon
        and the store tile; here the name is the thing that identifies the app.
        The button stays, so clicking the wordmark still returns home.
      q-btn(
        flat,
        to="/",
        :aria-label="$t('aria.home')"
      ).row.items-center.no-wrap.q-px-sm
        img(:src="`${publicFolder}palmas-wordmark.svg`" alt="Palmas", height="30")

      q-space
      SelectContext(v-if="contexts.length > 1")
      q-space

      SelectSettings
      .text-weight-regular v{{ versionString }}

  q-drawer(
    bordered,
    v-model="leftDrawerOpen",
    content-class="bg-grey-2",
    :breakpoint="1439"
  )
    left-drawer

  q-page-container#appMain.text-info(:class="{ 'light-mode': !isDarkMode }")
    q-resize-observer(
      debounce="10",
      @resize="onResize"
    )
    router-view(v-slot="{ Component, route }")
      Transition(name="fade", mode="out-in")
        component(:is="Component", :key="route.fullPath")
</template>

<style lang="scss">
#appMain {
  background: linear-gradient(
    to bottom,
    rgb(25, 25, 25) 0%,
    rgb(35, 35, 35) 35%,
    rgb(35, 35, 35) 65%,
    rgb(25, 25, 25) 100%
  );
  &.light-mode {
    background: rgb(240, 240, 240);
  }
}
</style>
