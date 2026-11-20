// Playwright test configuration for Universe Atlas.
//
//   npm test            -> starts the local server and tests it
//   npm run test:live   -> tests the deployed site (playwright.live.config.js)
//
// Every external service (NASA APIs, ISS telemetry, YouTube, ESA) is replaced
// with fixture data in tests/fixtures.js, so results are repeatable.

import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;

export default defineConfig({
  testDir: "./tests",
  timeout: 45_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: process.env.BASE_URL || `http://127.0.0.1:${PORT}`,
    locale: "en-US",
    timezoneId: "UTC",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
    {
      name: "mobile",
      use: { ...devices["Pixel 7"] },
    },
  ],
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: "node server.mjs",
        url: `http://127.0.0.1:${PORT}`,
        env: { PORT: String(PORT) },
        reuseExistingServer: !process.env.CI,
      },
});
