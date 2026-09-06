import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  // The Electron app has to boot, load its assets and decode a sample.
  timeout: 60_000,
  expect: { timeout: 15_000 },
  reporter: [['list']],
  // One app instance at a time: they would contend for the same user data dir.
  workers: 1,
  fullyParallel: false,

  // The PWA is served exactly as CI's smoke test serves it. The server does the
  // history-mode fallback the web build needs, so a spec may navigate to a real
  // route and not just to "/".
  webServer: {
    command: 'node scripts/serve-static.mjs 4173 --directory dist/pwa',
    url: 'http://127.0.0.1:4173/',
    reuseExistingServer: true,
    timeout: 60_000
  },

  projects: [
    {
      name: 'electron',
      testMatch: /electron\.spec\.ts/
    },
    // The same specs under both input models, because the point of the help
    // control is that it behaves identically with a finger and with a mouse.
    {
      name: 'web-touch',
      testMatch: /web\/.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://127.0.0.1:4173',
        viewport: { width: 390, height: 844 },
        hasTouch: true,
        isMobile: true
      }
    },
    {
      name: 'web-pointer',
      testMatch: /web\/.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://127.0.0.1:4173',
        viewport: { width: 1280, height: 900 },
        hasTouch: false
      }
    }
  ]
})
