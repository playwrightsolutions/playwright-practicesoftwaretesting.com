import { test, expect } from "@playwright/test";
import * as fs from "fs";
const path = require("path");

test.describe("Home page specs", () => {
  test("check page title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(
      "Practice Software Testing - Toolshop - v5.0"
    );
  });

  test("grid loads with 9 items", async ({ page }) => {
    await page.goto("/");
    const productGrid = page.locator(".col-md-9");
    await expect(productGrid.getByRole("link")).toHaveCount(9);
    expect(await productGrid.getByRole("link").count()).toBe(9);
  });

  test("search for Thor Hammer", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("search-query").fill("Thor Hammer");
    await page.getByTestId("search-submit").click();
    const productGrid = page.locator(".col-md-9");
    await expect(productGrid.getByRole("link")).toHaveCount(1);
    await expect(page.getByAltText("Thor Hammer")).toBeVisible();
  });

  test("validate product data is visible in UI from API", async ({ page }) => {
    let products: any;
    await test.step("intercept /products", async () => {
      await page.route(
        "https://api.practicesoftwaretesting.com/products**",
        async (route) => {
          const response = await route.fetch();
          products = await response.json();
          route.continue();
        }
      );
    });
    await page.goto("/");

    // Wait for the data to load in before making assertions
    await expect(page.locator(".skeleton").first()).not.toBeVisible();

    const productGrid = page.locator(".col-md-9");
    products.data.forEach(async (product: { name: string; price: string }) => {
      await expect(productGrid).toContainText(product.name);
      await expect(productGrid).toContainText(product.price.toString());
    });
  });

  test("abort long running api call", async ({ page }) => {
    await test.step("abort /category/tree", async () => {
      await page.route(
        "https://api.practicesoftwaretesting.com/categories/tree**",
        (route) => route.abort()
      );
    });

    await page.goto("/");

    // This is data that should not be on the screen
    await expect(
      page.getByText("SortName (A - Z)Name (Z - A)")
    ).not.toContainText("Power Tools");
  });

  test("validate product data is visible from modified API", async ({
    page,
  }) => {
    await test.step("Intercept /products", async () => {
      await page.route(
        "https://api.practicesoftwaretesting.com/products**",
        async (route) => {
          const response = await route.fetch();
          const json = await response.json();
          json.data[0]["name"] = "Mocked Product";
          json.data[0]["price"] = 100000.01;
          json.data[0]["in_stock"] = false;

          await route.fulfill({ response, json });
        }
      );
    });
    await page.goto("/");
    const productGrid = page.locator(".col-md-9");
    await expect(productGrid.getByRole("link").first()).toContainText(
      "Mocked Product"
    );
    await expect(productGrid.getByRole("link").first()).toContainText(
      "Out of stock"
    );
    await expect(productGrid.getByRole("link").first()).toContainText(
      "100000.01"
    );
  });

  test("validate product data is loaded from har file", async ({ page }) => {
    test.setTimeout(15_000);
    await test.step("Intercept /products", async () => {
      await page.routeFromHAR(".hars/product.har", {
        url: /https:\/\/api\.practicesoftwaretesting\.com\/products.*/,
        update: false,
      });
    });
    await page.goto("/");
    const productGrid = page.locator(".col-md-9");
    await expect(productGrid).toContainText("Happy Path Pliers");
    await expect(productGrid).toContainText("1.99");

    // If you want to interact with the page after you will run into issues, because we aren't dealing with real data
    //await page.getByText("Happy Path Pliers").click();
    //console.log("done");
  });

  test("validate product data is loaded from json file", async ({ page }) => {
    await test.step("Intercept /products", async () => {
      await page.route(
        "https://api.practicesoftwaretesting.com/categories/tree**",
        async (route) => {
          // This code will generate a json file from the original response
          // const response = await route.fetch();
          // let json = await response.json();
          // fs.writeFileSync(".json/categories.json", JSON.stringify(json));

          const testTools = JSON.parse(
            fs.readFileSync(path.resolve(".json/categories.json"), "utf-8")
          );

          await route.fulfill({ json: testTools });
        }
      );
    });
    await page.goto("/");
    await expect(page.getByText("SortName (A - Z)Name (Z - A)")).toContainText(
      "Playwright"
    );
  });

  // Simulating a slow network request
  test("validate loading animation while product is loading", async ({
    page,
  }) => {
    await page.route(
      "https://api.practicesoftwaretesting.com/products**",
      async (route) => {
        await page.waitForTimeout(4000);
        await route.continue();
      }
    );
    await page.goto("/");
    const skeletonLocator = page.locator(".skeleton").first();
    const imageBox = skeletonLocator.locator(".card-img-wrapper");

    const animationProps = await imageBox.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        animationIterationCount: styles.animationIterationCount,
        animationName: styles.animationName,
        animationPlayState: styles.animationPlayState,
      };
    });

    expect(animationProps.animationIterationCount).toBe("infinite");
    expect(animationProps.animationName).toContain("_shimmer");
    expect(animationProps.animationPlayState).toBe("running");

    await expect(imageBox).not.toBeVisible();
  });

  test("validate ui when api us rate limited", async ({ page }) => {
    let requestCount = 0;
    await page.route(
      "https://api.practicesoftwaretesting.com/products**",
      async (route) => {
        await route.fulfill({
          status: 429,
          body: "Too Many Requests",
        });
      }
    );
    await page.goto("/");
    const skeletonLocator = page.locator(".skeleton").first();
    const imageBox = skeletonLocator.locator(".card-img-wrapper");
    const animationProps = await imageBox.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        animationIterationCount: styles.animationIterationCount,
        animationName: styles.animationName,
        animationPlayState: styles.animationPlayState,
      };
    });

    expect(animationProps.animationIterationCount).toBe("infinite");
    expect(animationProps.animationName).toContain("_shimmer");
    expect(animationProps.animationPlayState).toBe("running");
  });
});
