import UIKit
import Capacitor

/// The window, created per scene rather than by the app delegate.
///
/// iOS 27 refuses to launch an app built with its SDK that has not adopted the
/// scene life cycle: UIKit stops it in
/// `_UIApplicationEvaluateRuntimeIssueForNoSceneLifecycleAdoption`, so it opens
/// on a black screen and closes. Palmas 1.0.0 did exactly that on every iPhone
/// and iPad that updated. This is Capacitor 8's own template, unchanged - the
/// project predated it - with URLs and user activities handed on to Capacitor
/// so the App plugin still hears about them.
class SceneDelegate: UIResponder, UIWindowSceneDelegate {
    var window: UIWindow?

    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
        guard let windowScene = scene as? UIWindowScene else { return }

        window = UIWindow(windowScene: windowScene)
        window?.rootViewController = CAPBridgeViewController()
        window?.makeKeyAndVisible()

        SceneDelegateProxy.shared.scene(scene, willConnectTo: session, options: connectionOptions)
    }

    func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
        SceneDelegateProxy.shared.scene(scene, openURLContexts: URLContexts)
    }

    func scene(_ scene: UIScene, continue userActivity: NSUserActivity) {
        SceneDelegateProxy.shared.scene(scene, continue: userActivity)
    }
}
