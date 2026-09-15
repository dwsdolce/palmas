import { boot } from 'quasar/wrappers'
import { Platform } from 'quasar'
import { Capacitor } from '@capacitor/core'
import { App } from '@capacitor/app'
import { usePatternStore } from 'src/stores/patterns'
import { useMetronome } from 'src/composables/metronome'
import { logger, describeError } from 'src/utils/logger'

/**
 * What the metronome does when the app leaves the screen, and when it returns.
 *
 * Leaving: on a phone or tablet it stops, properly. Android freezes an app that
 * is not on screen unless it runs a foreground service, which Palmas does not,
 * and iOS suspends it; either way the sound was going to stop. Stopping it here
 * means coming back to a Play button, rather than to a Stop button over
 * silence. Desktop is left alone: a browser tab or window in the background
 * keeps playing, and practising against it from another window is a real use.
 *
 * Returning: check the audio clock is moving, and rebuild the audio if it is
 * not, so the next press of play works. Without this a Lenovo tablet needed the
 * app restarting after a trip to Settings - see clockIsAdvancing in
 * composables/metronome.ts.
 *
 * Keeping the sound going in the background would be a different feature - a
 * native foreground service on Android, background audio on iOS - and the web
 * app cannot have it at all.
 */
const leave = () => {
  const store = usePatternStore()
  if (store.isPlaying) {
    logger.log('App left the screen while playing - stopping')
    void store.stop()
  }
}

const comeBack = () => {
  useMetronome().recoverAudio().catch((error) => {
    logger.error('Audio recovery on return failed:', describeError(error))
  })
}

export default boot(async () => {
  if (Capacitor.isNativePlatform()) {
    // Not visibilitychange: Capacitor keeps the WebView running when the
    // activity is paused, so the page is never told it was hidden.
    try {
      await App.addListener('appStateChange', ({ isActive }) => {
        if (isActive) comeBack()
        else leave()
      })
    } catch (error) {
      logger.error('Could not watch the app lifecycle:', describeError(error))
    }
    return
  }

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) comeBack()
    else if (Platform.is.mobile) leave()
  })
})
