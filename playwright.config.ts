import { defineConfig } from "@playwright/test";
import type { APIRequestOptions } from "./lib/fixtures/apiRequest";
import { TestOptions } from "./lib/pages";

require("dotenv").config();

export default defineConfig<APIRequestOptions & TestOptions>({
  timeout: 30_000,
  projects: [
    { name: "setup", testMatch: /.*\.setup\.ts/, fullyParallel: true },
    {
      name: "ui-tests",
      dependencies: ["setup"],
    },
  ],
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 2,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html"], ["list"]],
  use: {
    testIdAttribute: "data-test",
    baseURL: process.env.UI_URL,
    apiURL: process.env.API_URL,
    apiBaseURL: process.env.API_URL,
    trace: "on",
  },
});
