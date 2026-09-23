import { boot } from 'quasar/wrappers'
import { migrateSettings } from 'src/utils/settings'

/**
 * Bring stored settings up to date before anything reads them.
 *
 * First in the boot order, because the stores read localStorage as they are
 * created and a migration that ran after them would be repairing a copy the app
 * had already taken. Boot files run before the app is mounted, so this happens
 * once, with no window on screen and nothing to dismiss - which is the point:
 * the app it replaces asked the user to press "Reload app" instead.
 */
export default boot(() => {
  migrateSettings()
})
