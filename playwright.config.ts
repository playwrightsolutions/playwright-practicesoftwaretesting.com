import { defineConfig } from "@playwright/test";
import type { APIRequestOptions } from "./lib/fixtures/apiRequest";
import { TestOptions } from "./lib/pages";

require("dotenv").config();

export default defineConfig<APIRequestOptions & TestOptions>({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html"], ["list"]],
  use: {
    baseURL: process.env.UI_URL,
    apiURL: process.env.API_URL,
    apiBaseURL: process.env.API_URL,
    trace: "retain-on-failure",
  },
});
