import { test as base } from "@playwright/test";

export * from "./pages/loginPage";
export * from "./pages/homePage";
export * from "./pages/checkoutPage";

export type TestOptions = {
  apiURL: string;
};

// This will allow you to set apiURL in playwright.config.ts
export const test = base.extend<TestOptions>({
  apiURL: ["", { option: true }],
});

export default test;
