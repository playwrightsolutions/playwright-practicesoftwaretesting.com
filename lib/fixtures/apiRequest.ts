import { test as base, APIRequestContext, request } from "@playwright/test";

export type APIRequestOptions = {
  apiBaseURL: string;
};

type APIRequestFixture = {
  apiRequest: APIRequestContext;
};

// This fixture will override baseURL with apiBaseURL from playwright.config.ts whenever it is used
export const test = base.extend<APIRequestOptions & APIRequestFixture>({
  apiBaseURL: ["", { option: true }],

  apiRequest: async ({ apiBaseURL }, use) => {
    const apiRequestContext = await request.newContext({
      baseURL: apiBaseURL,
    });

    await use(apiRequestContext);
    await apiRequestContext.dispose();
  },
});
