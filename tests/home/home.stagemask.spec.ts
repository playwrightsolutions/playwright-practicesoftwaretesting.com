import { test, expect } from "stagemask";

test.describe("Home page specs", () => {
  test("check page title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(
      "Practice Software Testing - Toolshop - v5.0",
    );
  });

  test("grid loads with 9 items", async ({ page, visualSnapshot }) => {
    await page.goto("/");
    await page.waitForResponse("**/products?**");

    const productGrid = page.locator(".col-md-9");
    await expect(productGrid.getByRole("link")).toHaveCount(9);
    await visualSnapshot("homepage.png", {
      updateBaseline: false,
    });
  });

  test("search for Thor Hammer", async ({ page, visualSnapshot }) => {
    await page.goto("/");
    await page.getByTestId("search-query").fill("Thor Hammer");
    await page.getByTestId("search-submit").click();
    const productGrid = page.locator(".col-md-9");
    await expect(productGrid.getByRole("link")).toHaveCount(1);
    await expect(page.getByAltText("Thor Hammer")).toBeVisible();
    await visualSnapshot("thorHammer.png");
  });
});
