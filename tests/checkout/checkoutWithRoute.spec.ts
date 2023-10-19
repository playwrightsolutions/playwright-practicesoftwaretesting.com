import { expect } from "@playwright/test";
import { test, HomePage } from "@pages";

test.describe("UI with API Routing", () => {
  test("Checking for disposed api context", async ({ page }) => {
    await page.route(
      "https://api.practicesoftwaretesting.com/products?**",
      async (route) => {
        const response = await page.request.fetch(route.request());
        const responseBody = await response.json();
        route.continue();
      }
    );

    const homePage = new HomePage(page);
    await homePage.goto();

    // This line in the code will make sure the response from the API is made before proceeding
    await page.waitForResponse(
      "https://api.practicesoftwaretesting.com/products?**"
    );
  });
});
