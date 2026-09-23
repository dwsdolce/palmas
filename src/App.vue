<script setup lang="ts">
import { onMounted } from 'vue'
import { SplashScreen } from '@capacitor/splash-screen'

onMounted(async () => {
  // Hide the splash as soon as there is an app behind it.
  //
  // This used to sleep five seconds first. Removing the sleep is not on its
  // own what stops the plugin warning that hide() came too late: startup
  // genuinely outruns Capacitor's three second default, because MainPage
  // mounts before this component and starts fetching and decoding 58 audio
  // samples. The backstop is raised to six seconds in
  // src-capacitor/capacitor.config.ts to cover that.

  await SplashScreen.hide()
})
</script>

<template lang="pug">
RouterView
</template>
