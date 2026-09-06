/* eslint-env node */

/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

// Configuration for your app
// https://v2.quasar.dev/quasar-cli-vite/quasar-config-js

// const VueDevTools = require('vite-plugin-vue-devtools');


import { defineConfig } from '@quasar/app-vite'
import { execSync, spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { readFileSync } from 'node:fs'

// quasar.config is loaded as ESM by @quasar/app-vite v2, so __dirname and
// require() are not available.
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const pkg = JSON.parse(readFileSync(path.resolve(__dirname, 'package.json'), 'utf8'))

/**
 * The build number: the git commit count, as every other project here derives
 * it — guitar_tap, GuitarTap, GuitarTapWeb, pdfarranger and marklens-ports all
 * use `git rev-list --count HEAD`. It is monotonic without needing tags, and it
 * names a commit, so a bug report carrying one identifies the exact source.
 * Shown as "1.0.0 (867)", which is Swift's CFBundleShortVersionString
 * (CFBundleVersion) convention.
 *
 * Falls back to '0' outside a checkout, matching GuitarTapWeb. That is
 * cosmetic here — the number is only displayed. Android is stricter, because a
 * wrong versionCode is a store problem rather than a display one, so
 * build.gradle fails instead of falling back.
 *
 * Beware shallow clones: `actions/checkout` defaults to fetch-depth 1, where
 * this returns 1. The workflow asks for the full history for that reason.
 */
const buildNumber = (() => {
  try {
    return execSync('git rev-list --count HEAD', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() || '0'
  } catch {
    return '0'
  }
})()


/**
 * Generate the icons this build needs, before it needs them.
 *
 * The icon set is derived from resources/artwork/logo.svg and not committed, so
 * it used to be install-time state: `postinstall` generated it once and nothing
 * looked again. Pulling a commit that changed the artwork therefore left every
 * later build shipping the old mark, with nothing to say so - which is exactly
 * what happened between the Palmas icon landing and it reaching a .dmg.
 *
 * scripts/icons.mjs decides whether there is anything to do by hashing the
 * sources, so on an unchanged tree this costs a few stats and prints nothing.
 * It is given the target rather than left to guess: a macOS build has no use
 * for icon.ico or the Linux set.
 */
function generateIcons (ctx) {
  const target = ctx.mode.capacitor && ctx.targetName === 'ios' ? 'ios'
    : ctx.mode.capacitor && ctx.targetName === 'android' ? 'android'
    : ctx.mode.electron ? 'electron'
    : 'web'

  // A native build serves the web assets too, so public/ has to be current
  // either way.
  const targets = target === 'ios' || target === 'android' ? ['web', target] : [target]

  const script = path.join(__dirname, 'scripts', 'icons.mjs')
  const result = spawnSync(process.execPath, [script, ...targets], { stdio: 'inherit' })

  if (result.error !== undefined) throw result.error
  if (result.status !== 0) {
    throw new Error('scripts/icons.mjs failed, so the icons are older than the artwork')
  }
}


export default defineConfig(function (ctx) {
  return {
    // eslint: {
    //   // fix: true,
    //   // include = [],
    //   // exclude = [],
    //   // rawOptions = {},
    //   warnings: true,
    //   errors: true
    // },

    // https://v2.quasar.dev/quasar-cli-vite/prefetch-feature
    // preFetch: true,

    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    // https://v2.quasar.dev/quasar-cli-vite/boot-files
    boot: [
      'i18n',
      'statusbar'
    ],

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#css
    css: [
      'app.sass'
    ],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: [
      // 'ionicons-v4',
      'mdi-v7',
      // 'fontawesome-v6',
      // 'eva-icons',
      // 'themify',
      // 'line-awesome',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

      'roboto-font', // optional, you are not bound to it
      // 'material-icons' // optional, you are not bound to it
    ],

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#build
    build: {
      // @quasar/app-vite v3 ships only two default aliases, '@' and '#q-app'.
      // The framework aliases v1/v2 provided (src, components, stores, ...)
      // were dropped; this project imports via 'src/...' in 140 places, so
      // that one is restored here rather than rewriting every import.
      alias: {
        src: path.resolve(__dirname, './src'),
        layouts: path.resolve(__dirname, './src/layouts'),
        pages: path.resolve(__dirname, './src/pages')
      },

      // In v3 build.env configures env-FILE loading (clientPrefix, folder,
      // file, filter) — it is no longer a map of variables to inject, as it
      // was in v1/v2. Build-time constants go through define instead.
      // Without this, process.env.APP_VERSION is undefined at runtime and the
      // header falls back to showing "v4".
      define: {
        'process.env.APP_VERSION': JSON.stringify(pkg.version),
        'process.env.APP_BUILD': JSON.stringify(buildNumber),

        // vue-i18n ships two message compilers. The default one turns every
        // translation string into a function with `Function("return ...")`,
        // which the Content-Security-Policy in index.html forbids: without
        // this flag the policy blocks the first message compiled and the app
        // renders nothing at all.
        //
        // The JIT compiler produces the same AST and walks it instead of
        // generating code, so it needs no eval. Results are cached per message
        // either way. vue-i18n defaults the flag to false when the bundler
        // leaves it undefined, so it has to be set explicitly here.
        __INTLIFY_JIT_COMPILATION__: true
      },
      target: {
        browser: [ 'es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1' ],
        node: 'node20'
      },

      // Hash mode everywhere, so one build runs from anywhere.
      //
      // Capacitor and Electron always needed it: they serve from a local root
      // (capacitor://localhost, file://) where a non-root history route breaks
      // relative asset resolution and gives a white screen.
      //
      // The web build now shares it because the site is deployed into a
      // subfolder rather than at a domain root. History mode would mean baking
      // that folder into the build and adding a server rewrite so that
      // /flamenco/solea returns index.html; hash mode asks nothing of the
      // server and lets the same files be copied to any path. The cost is the
      // "#" in the URL and search engines treating every route as one page,
      // which is a trade worth making for a metronome.
      vueRouterMode: 'hash', // available values: 'hash', 'history'
      // vueRouterBase,
      vueDevtools: true,
      // vueOptionsAPI: false,

      // rebuildCache: true, // rebuilds Vite/linter/etc cache on startup

      publicPath: '/',
      // analyze: true,
      // env: {},
      // rawDefine: {}
      // ignorePublicFolder: true,
      // minify: false,
      // polyfillModulePreload: true,
      // distDir

      // Emit relative asset URLs for the production web build, so the same
      // dist/pwa runs from any directory: the live site, a test folder beside
      // it, or a domain root. Copy the files and it works — no rebuild, no
      // server configuration.
      //
      // This has to go through Vite rather than publicPath above, because
      // Quasar formats publicPath to an absolute path for spa/pwa/ssr and
      // would turn './' into '/./'. It is not a hack around the framework
      // though: Quasar already forces publicPath to '' for capacitor, cordova,
      // electron and bex, which produces exactly these relative URLs. This
      // gives the web build the same treatment.
      //
      // Dev keeps '/' because the dev server serves from the root, and
      // relative URLs there break Vite's module graph.
      //
      // Note that relative URLs resolve against the *document* URL, so the app
      // must be served with a trailing slash - .../palmas_web/ rather than
      // .../palmas_web. Servers normally redirect to add it.
      // PWA is the web build now, and it wants the relative URLs for the same
      // reason SPA did: the site lives at /palmas/palmas_web/, not at a root.
      // The service worker copes because it is emitted beside index.html, so
      // its scope is the directory it is served from either way.
      extendViteConf (viteConf) {
        if ((ctx.mode.spa || ctx.mode.pwa) && ctx.prod) {
          viteConf.base = './'
        }

        if (!(ctx.mode.pwa && ctx.prod)) return

        // Two more paths Quasar writes from publicPath, neither reachable from
        // injectPWAMetaTags: the manifest link, emitted before that hook is
        // consulted, and the service worker's own URL, compiled into the
        // bundle as a define.
        //
        // A relative service worker URL is not only a workaround for the
        // subfolder. A worker's scope is the directory it is served from, and
        // a relative URL resolves against the document - so this is what "runs
        // from any directory" means once there is a service worker at all.
        viteConf.define = {
          ...viteConf.define,
          'import.meta.env.QUASAR_SERVICE_WORKER_FILE': '"sw.js"'
        }

        const absolute = '<link rel="manifest" href="/manifest.json"'
        const relative = '<link rel="manifest" href="manifest.json"'

        viteConf.plugins = [ ...(viteConf.plugins ?? []), {
          name: 'palmas:relative-manifest-link',
          transformIndexHtml: {
            order: 'post',
            handler (html) {
              // Fail the build rather than ship a PWA that cannot be
              // installed. An absolute manifest link 404s at the deploy path,
              // and nothing about the resulting site looks broken: it just
              // never offers to install.
              if (!html.includes(absolute)) {
                throw new Error(
                  'quasar.config: expected Quasar to emit ' + absolute +
                  ' so it could be made relative, and it did not. The manifest ' +
                  'link needs checking against this version of @quasar/app-vite.'
                )
              }
              return html.replace(absolute, relative)
            }
          }
        } ]
      },

      // Everything icon-related happens in one place now. That includes
      // flattening the iOS app icon, which used to be invoked separately here:
      // App Store Connect refuses an alpha channel and refuses it at upload - a
      // device build installs happily either way - so the failure lands hours
      // or days after whoever generated the icon stopped thinking about it.
      // The generated master genuinely has an alpha channel, so it is a live
      // hazard rather than a precaution, and it belongs where the iOS assets
      // are produced rather than in a step that has to be remembered.
      beforeBuild () {
        generateIcons(ctx)
      },

      // The dev server serves public/, so a stale favicon shows up here too -
      // and this is where the artwork is usually being looked at.
      beforeDev () {
        generateIcons(ctx)
      },
      // viteVuePluginOptions: {},

      // No i18n Vite plugin. The messages in src/i18n are .ts modules, not the
      // JSON/YAML resource files these plugins exist to precompile, and
      // @intlify/unplugin-vue-i18n defaults to runtimeOnly — which aliases
      // vue-i18n to its runtime-only build and leaves raw object messages with
      // no compiler, silently emptying every translated control in the UI.
      vitePlugins: [],

      // Ajouter l'analyse du bundle
      analyze: process.env.ANALYZE === 'true',
      // Optimiser les chunks
      // No manual chunking. A rollupOptions.output.manualChunks block used to
      // sit here splitting vue/quasar into a "vendor" chunk and tone into an
      // "audio" one, but Vite 8 builds with rolldown and never produced either
      // chunk — verified by inspecting the build output. Rolldown's equivalent
      // is build.rolldownOptions.output.advancedChunks; splitting is worth
      // revisiting deliberately rather than leaving config that does nothing.
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#devServer
    devServer: {
      // https: true
      open: true // opens browser window automatically
    },

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#framework
    framework: {
      config: {
        capacitor: {
          iosStatusBarPadding: true, // add the dynamic top padding on iOS mobile devices
          backButtonExit: true, // Quasar handles app exit on mobile phone back button
          androidTouchExplorationEnabled: true, // enable TalkBack on Android
          splashIconScale: 0.9, // scale the splash icon (1 = 100%) for more control over how it looks on different screen sizes
          statusBarPadding: true // add the dynamic top padding for iOS and Android mobile devices
        }
      },

      iconSet: 'mdi-v7', // Quasar icon set
      // lang: 'en-US', // Quasar language pack

      // For special cases outside of where the auto-import strategy can have an impact
      // (like functional components as one of the examples),
      // you can manually specify Quasar components/directives to be available everywhere:
      //
      // components: [],
      // directives: [],

      // Quasar plugins
      plugins: [
        'Notify', 'Loading', 'Dialog'
      ]
    },

    // animations: 'all', // --- includes all animations
    // https://v2.quasar.dev/options/animations
    animations: [],

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#sourcefiles
    sourceFiles: {
      // rootComponent: 'src/App.vue',
      // router: 'src/router/index',
      // store: 'src/store/index',
    //   registerServiceWorker: 'src-pwa/register-service-worker',
    //   serviceWorker: 'src-pwa/custom-service-worker',
    //   pwaManifestFile: 'src-pwa/manifest.json',
      electronMain: 'src-electron/electron-main',
      electronPreload: 'src-electron/electron-preload'
    },

    bin: {
      // Tell Quasar where the Android studio executable is located.
      // Hint : you can create a /usr/local/android-studio symlink which
      // points to your local install by running this :
      // sudo ln -s /path/to/my/local/android-studio /usr/local/android-studio
      linuxAndroidStudio: '/usr/local/android-studio/bin/studio.sh'
    },

    // https://v2.quasar.dev/quasar-cli-vite/developing-ssr/configuring-ssr
    ssr: {
      // ssrPwaHtmlFilename: 'offline.html', // do NOT use index.html as name!
                                          // will mess up SSR

      // extendSSRWebserverConf (esbuildConf) {},
      // extendPackageJson (json) {},

      pwa: false,

      // manualStoreHydration: true,
      // manualPostHydrationTrigger: true,

      prodPort: 3000, // The default port that the production server should use
                      // (gets superseded if process.env.PORT is specified at runtime)

      middlewares: [
        'render' // keep this as last one
      ]
    },

    // https://v2.quasar.dev/quasar-cli-vite/developing-pwa/configuring-pwa
    pwa: {
      workboxMode: 'GenerateSW', // or 'InjectManifest'
      swFilename: 'sw.js',
      manifestFilename: 'manifest.json',
      useCredentialsForManifestTag: false,

      /**
       * The icon and theme tags, written relative rather than from publicPath.
       *
       * Quasar builds these from `build.publicPath`, which is '/' here and
       * cannot be anything else - it formats the value to an absolute path for
       * spa/pwa/ssr, so './' becomes '/./'. The site is served from
       * /palmas/palmas_web/, so every one of those tags would point at the
       * domain root and 404.
       *
       * These are the framework's own tags with `publicPath` dropped: relative
       * URLs resolve against the document, which is where the icons actually
       * are. The name is `injectPWAMetaTags`, not `injectPwaMetaTags` - the
       * scaffolded config spells it the second way, which Quasar never reads,
       * so the setting had no effect at all until this was noticed.
       */
      injectPWAMetaTags ({ pwaManifest }) {
        return (
          `<meta name="theme-color" content="${pwaManifest.theme_color}">` +
          `<link rel="mask-icon" href="icons/safari-pinned-tab.svg" color="${pwaManifest.theme_color}">` +
          '<meta name="mobile-web-app-capable" content="yes">' +
          '<meta name="apple-mobile-web-app-status-bar-style" content="default">' +
          `<meta name="apple-mobile-web-app-title" content="${pwaManifest.name}">` +
          '<meta name="msapplication-TileImage" content="icons/ms-icon-144x144.png">' +
          '<meta name="msapplication-TileColor" content="#000000">' +
          '<link rel="apple-touch-icon" href="icons/apple-icon-120x120.png">' +
          '<link rel="apple-touch-icon" sizes="152x152" href="icons/apple-icon-152x152.png">' +
          '<link rel="apple-touch-icon" sizes="167x167" href="icons/apple-icon-167x167.png">' +
          '<link rel="apple-touch-icon" sizes="180x180" href="icons/apple-icon-180x180.png">'
        )
      },

      /**
       * Nothing is overridden here, deliberately.
       *
       * @quasar/app-vite already sets, for GenerateSW in production:
       * `globPatterns: ['**' + '/*']` so everything in the build is precached,
       * the audio included; `skipWaiting` and `clientsClaim` so a deploy takes
       * over on the next load rather than waiting for every tab to close;
       * `cleanupOutdatedCaches`; and `navigateFallback: 'index.html'`. That is
       * exactly what this app wants, and about 2 MB of samples is a fair price
       * for a metronome that works in a rehearsal room with no signal.
       *
       * A previous version of this file set those explicitly through a hook
       * named `extendGenerateSWOptions`, which Quasar never reads - the name is
       * `extendPWAGenerateSWOptions`. It was inert, and had the name been
       * right its narrower `globPatterns` would have taken the audio *out* of
       * the precache. If you do need to reach these options, that is the name,
       * and the defaults above are what you would be starting from.
       */
      // extendInjectManifestOptions (cfg) {},
      // extendManifestJson (json) {}
      // extendPWACustomSWConf (esbuildConf) {}
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-cordova-apps/configuring-cordova
    cordova: {
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-capacitor-apps/configuring-capacitor
    capacitor: {
      hideSplashscreen: true
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/configuring-electron
    electron: {
      // extendElectronMainConf (esbuildConf)
      // extendElectronPreloadConf (esbuildConf)

      bundler: 'builder', // 'packager' or 'builder'

      // electron-packager options
      // https://electron.github.io/electron-packager/main/
      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options

        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Windows only
        // win32metadata: { ... }
      },

      // electron-builder options
      // https://www.electron.build/configuration/configuration
      builder: {
        appId: 'com.dolcesfogato.palmas',
        productName: 'Palmas',
        // Both lines are required by the AGPL: the original authors keep their
        // copyright, and a modified version has to say that it is one.
        copyright: 'Copyright © 2014-2023 Olivier Ricordeau, Jérémie Sieffert; © 2026 David Smith. Based on A Compás.',

        // The four-component version - major.minor.patch.build - that every
        // other project here ships: guitar_tap, GuitarTapWeb, pdfarranger-qt
        // and marklens-ports all name their artefacts
        // <name>-<major.minor.patch.build>-<arch>.<ext> and put the same string
        // in the package metadata. The build component is the commit count
        // computed at the top of this file.
        //
        // extraMetadata rewrites the version electron-builder reads, which is
        // the only lever that reaches the package metadata as well as the
        // filename. It does not reach the running app: the version shown there
        // comes from the APP_VERSION and APP_BUILD defines below, which read
        // package.json directly and still render as "1.0.0 (867)".
        //
        // Deliberately not electron-builder's `buildNumber`, which looks like
        // the obvious fit but is not. It leaves the version at three
        // components and passes the fourth to fpm as --iteration, which is the
        // Debian revision and the RPM release - so the packages would read
        // 1.0.0-867 and Release: 867, where every other project here reads
        // 1.0.0.867 and Release: 1.
        extraMetadata: {
          version: `${pkg.version}.${buildNumber}`
        },

        // Windows keeps the build number in the exe's own resource, where
        // pdfarranger-qt and marklens-ports both put it: packaging's
        // VSVersionInfo carries filevers and prodvers as the full four-number
        // tuple, and FileVersion and ProductVersion as the same string.
        //
        // Two options rather than one, and neither alone will do.
        // electron-builder composes VIProductVersion from major, minor, patch
        // and `buildNumber`, so without that the fourth slot is 0 and the exe
        // reports 1.0.0.0. But `buildNumber` also makes `buildVersion` default
        // to version + '.' + buildNumber, which on the already-four-component
        // version above compounds to 1.0.0.880.880 and lands in FileVersion -
        // hence pinning buildVersion too.
        //
        // Windows-only because on Linux `buildNumber` is exactly what must not
        // be set: fpm takes it as --iteration, the Debian revision and the RPM
        // release, and the packages become 1.0.0.880-880. Gating on the host is
        // sound here for the reason this whole script exists - electron-builder
        // does not cross-compile, so the host platform is the target platform.
        ...(process.platform === 'win32'
          ? { buildNumber, buildVersion: `${pkg.version}.${buildNumber}` }
          : {}),

        mac: {
          category: 'public.app-category.music',

          // Apple splits what Linux packs into one string across two keys, and
          // the four-component version set above belongs in neither on its
          // own: CFBundleShortVersionString is the marketing version and takes
          // at most three integers, CFBundleVersion is the build. Spelled out
          // here so a .dmg matches src-capacitor/ios/App/set-version.sh, which
          // stamps exactly these two values for the iOS build - "1.0.0 (880)"
          // means the same thing on both, and neither shape is one App Store
          // Connect would refuse.
          bundleShortVersion: pkg.version,
          bundleVersion: buildNumber,

          // Named for the same reason as Linux below, and here it is not
          // optional: the DMG target's default pattern substitutes
          // bundleShortVersion for ${version} whenever that is set, so the
          // four-component version above reaches the .zip beside it but never
          // the .dmg - which came out as Palmas-1.0.0-arm64.dmg next to
          // Palmas-1.0.0.883-arm64-mac.zip. A user-supplied pattern is not
          // subject to that substitution.
          artifactName: '${name}-${version}-${arch}.${ext}',
          // Signing is opt-in and off by default. Left to itself
          // electron-builder finds the Developer ID in the keychain and signs
          // with the hardened runtime; macOS then kills the app on launch
          // because it is not notarized, with no dialog and no output. An
          // explicit null keeps local builds unsigned and launchable.
          //
          // packaging/build-desktop.mjs exports CSC_NAME from the settings
          // file outside the repository, which turns both of these on. Notarizing
          // needs credentials as well, and electron-builder throws if it is
          // asked to notarize without them, so that is checked here too - it
          // reads whichever of the three sets is present.
          identity: process.env.CSC_NAME ?? null,
          notarize: Boolean(
            process.env.CSC_NAME && (
              process.env.APPLE_KEYCHAIN_PROFILE ||
              process.env.APPLE_API_KEY ||
              process.env.APPLE_ID
            )
          ),
        },
        win: {
          // No icon setting needed: Quasar points electron-builder at
          // src-electron/electron-assets/icons/icon, which resolves to
          // icon.ico here and is generated by `yarn icons`.
          //
          // Two artefacts:
          //   nsis     -> the installer
          //   portable -> self-extracting, no install
          //
          // Both are the same electron-builder target class, and its default
          // names differ only by the word "Setup". Naming them therefore has
          // to be done per target, in the nsis and portable blocks below: an
          // artifactName here would apply to both and give them one filename.
          target: ['nsis', 'portable']
        },
        nsis: {
          // electron-builder defaults oneClick to true, which installs the
          // moment the exe is opened - no wizard, no say in where it goes, and
          // then it launches the app. Perfectly functional and quite startling.
          // A conventional wizard is worth the extra two clicks.
          oneClick: false,
          allowToChangeInstallationDirectory: true,

          // <name>-<version>-<arch>-setup.exe, matching Linux and macOS. The
          // suffix is what keeps this distinct from the portable exe below,
          // the job the word "Setup" does in the default name.
          artifactName: '${name}-${version}-${arch}-setup.${ext}'
          // Upgrades need nothing here: installSection.nsh calls
          // uninstallOldVersion unconditionally, outside the ONE_CLICK branch,
          // so an existing install is removed first either way. perMachine
          // stays false, so this installs per-user with no elevation prompt
          // unless the directory chosen above needs one.
        },
        portable: {
          // The counterpart to nsis above: same version and arch, told apart
          // by the suffix rather than by the absence of one.
          artifactName: '${name}-${version}-${arch}-portable.${ext}'
        },
        linux: {
          // Three artefacts, because "install it" means three different things
          // depending on the distribution:
          //   AppImage -> chmod +x and run. No root, no package manager, works
          //               anywhere, and is the only one of the three that a
          //               Debian *and* a Fedora user can both be handed.
          //   deb      -> Debian, Ubuntu, Mint
          //   rpm      -> Fedora, RHEL, openSUSE
          //
          // deb and rpm go through electron-builder's fpm target, which refuses
          // to start without a project homepage and a maintainer carrying an
          // email address. Both come from package.json - `homepage`, and
          // `author` in its object form rather than a bare string - and both
          // are mandatory fields in the packages themselves rather than
          // electron-builder being fussy. AppImage needs neither, which is why
          // the default Linux build produced one without any of this.
          //
          // The rpm additionally shells out to `rpmbuild`, which is not
          // installed by default on Debian-family machines;
          // packaging/build-desktop.mjs checks for it before starting.
          target: ['AppImage', 'deb', 'rpm'],

          // Make StartupWMClass follow package.json's `desktopName` rather
          // than productName, because those are not the same string and the
          // window is matched to this entry on the first one.
          //
          //   xprop WM_CLASS  ->  "palmas", "palmas"
          //   StartupWMClass  ->  Palmas          (productName, the default)
          //
          // A mismatch is quiet: the window still opens and still shows the
          // right icon, because that comes from BrowserWindow in
          // electron-main.ts and not from this file at all. What it costs is
          // the association - pinning a running window, and grouping it under
          // the menu entry it was launched from.
          //
          // Electron reads `desktopName` too, defaulting it to
          // `${name}.desktop`, so naming it makes electron-builder and Electron
          // agree explicitly instead of both guessing and happening to differ.
          syncDesktopName: true,

          // Written into the .desktop file verbatim as `Categories=`. This is
          // also exactly what electron-builder would derive from the
          // `public.app-category.music` set for macOS above, spelled out here
          // so that the two cannot quietly drift apart.
          category: 'Audio;AudioVideo',

          // The one-line summary a package manager shows in a search result.
          // Without it, deb falls back to the full description.
          synopsis: 'A flamenco metronome',

          // <name>-<version>-<arch>.<ext>, matching the other projects here.
          // electron-builder's own defaults differ per format - underscores
          // and a dropped arch for deb, a dot before the arch for rpm - so all
          // three are named here rather than left to it. Naming the pattern
          // also forces the arch to be included: electron-builder omits it for
          // x64 unless the pattern is user-supplied.
          artifactName: '${name}-${version}-${arch}.${ext}',

          // A directory of sized PNGs rather than the single icon.png the
          // other platforms use, because electron-builder does not resize for
          // Linux: given one file it passes it through untouched, and the
          // package ends up with hicolor/512x512/apps/palmas.png as the only
          // icon there is. The window icon is set in electron-main.ts and so
          // is unaffected - which is why the taskbar and a desktop shortcut
          // look right while the applications menu, the one place that goes
          // through the icon theme, falls back to a generic icon.
          //
          // Given a directory, electron-builder collects every <size>x<size>.png
          // in it and installs each into its matching hicolor directory.
          // scripts/icons.mjs generates them, and only when the target is
          // Linux - electron-builder does not cross-compile, so there is no
          // reason for this directory to exist on a Mac.
          //
          // Absolute, because electron-builder runs against
          // dist/electron/UnPackaged rather than the repository root, so a
          // project-relative path resolves to nothing - and resolving to
          // nothing is silent: the source list falls through to the icon.png
          // Quasar sets, and the build succeeds with one icon again. Quasar
          // passes absolute paths for its own icon defaults for this reason.
          icon: path.resolve(__dirname, 'src-electron/electron-assets/icons/linux')

          // No `depends` either. electron-builder's defaults for deb and rpm
          // are the usual Electron runtime libraries - GTK 3, NSS, libsecret
          // and friends - which is what this needs and nothing more.
        }
      },

      // Specify additional parameters when yarn/npm installing
      // the UnPackaged folder, right before bundling with either
      // electron packager or electron builder;
      // Example: [ '--ignore-optional', '--some-other-param' ]
      unPackagedInstallParams: [],

      // optional; add/remove/change properties
      // of production generated package.json
      extendPackageJson (pkg) {
        // directly change props of pkg;
        // no need to return anything
      },

      inspectPort: 5858,

      extendElectronMainConf (cfg) {
        // do something with Esbuild config
        // for the Electron Main thread
      },

      extendElectronPreloadConf (cfg) {
        // do something with Esbuild config
        // for the Electron Preload thread
      }
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-browser-extensions/configuring-bex
    bex: {
      contentScripts: [
        'my-content-script'
      ],

      // extendBexScriptsConf (esbuildConf) {}
      // extendBexManifestJson (json) {}
    }
  }
})
