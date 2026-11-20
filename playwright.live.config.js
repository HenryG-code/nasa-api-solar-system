// Runs the same suite against the deployed site: npm run test:live
import baseConfig from "./playwright.config.js";

export const LIVE_URL = "https://nasa-api-solar-system.gagianohenry.workers.dev";

export default {
  ...baseConfig,
  use: { ...baseConfig.use, baseURL: process.env.BASE_URL || LIVE_URL },
  webServer: undefined,
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report-live" }]],
};
