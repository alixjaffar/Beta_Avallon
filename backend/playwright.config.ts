// CHANGELOG: 2025-10-12 - Add Playwright configuration for Studio e2e coverage
import type { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  testDir: "./tests/e2e",
  timeout: 60_000,
  expect: {
    timeout: 5_000,
  },
  use: {
    baseURL: process.env.E2E_BASE_URL || "http://localhost:3000",
    trace: "on-first-retry",
  },
  reporter: [["list"], ["html", { outputFolder: "test-results/playwright" }]],
};

export default config;
