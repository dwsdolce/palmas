import UIKit
import Capacitor
import AVFoundation

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        configureAudioSession()
        return true
    }

    /// A WKWebView with no audio session configured inherits the *ambient*
    /// category, which iOS silences whenever the device is in silent mode.
    /// That is reasonable for incidental sounds and wrong for a metronome:
    /// the app goes quiet with nothing on screen to explain why, while music
    /// keeps playing because media apps declare `.playback` and are exempt.
    ///
    /// `.mixWithOthers` keeps whatever the user is already listening to
    /// audible, so the metronome can be played over a track rather than
    /// stopping it.
    private func configureAudioSession() {
        let session = AVAudioSession.sharedInstance()
        do {
            try session.setCategory(.playback, mode: .default, options: [.mixWithOthers])
            try session.setActive(true)
        } catch {
            // Not fatal: audio still works with the default session on a
            // device that is not muted.
            CAPLog.print("Could not configure the audio session: \(error)")
        }
    }

    // The window and its life cycle belong to SceneDelegate: iOS 27 will not
    // launch the app otherwise. applicationWillResignActive and the other
    // app-level life-cycle callbacks are not called once scenes are adopted,
    // so their empty template stubs are gone rather than left to mislead.
    func application(_ application: UIApplication,
                     configurationForConnecting connectingSceneSession: UISceneSession,
                     options: UIScene.ConnectionOptions) -> UISceneConfiguration {
        let config = UISceneConfiguration(name: "Default Configuration", sessionRole: connectingSceneSession.role)
        config.delegateClass = SceneDelegate.self
        return config
    }

    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
        // Called when the app was launched with a url. Feel free to add additional processing here,
        // but if you want the App API to support tracking app url opens, make sure to keep this call
        return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
    }

    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        // Called when the app was launched with an activity, including Universal Links.
        // Feel free to add additional processing here, but if you want the App API to support
        // tracking app url opens, make sure to keep this call
        return ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
    }

}
