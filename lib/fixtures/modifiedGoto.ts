import { test as base } from "@playwright/test";

export const test = base.extend({
  page: async ({ page }, use) => {
    const goto = page.goto.bind(page);
    function modifiedGoto(url, options) {
      url += "?UTM_SOURCE=playwright";
      return goto(url, options);
    }
    page.goto = modifiedGoto;
    await use(page);
    page.goto = goto;
  },
});
