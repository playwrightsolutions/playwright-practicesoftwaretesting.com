import { test, expect } from "@playwright/test";

test.describe("Admin brands specs", () => {
  test.use({ storageState: ".auth/admin.json" });

  test("login with valid admin credentials and check brands page", async ({
    page,
  }) => {
    await page.goto("/");
    expect(await page.getByTestId("nav-menu").innerText()).toContain(
      "John Doe"
    );
    await page.goto("/#/admin/brands");
    expect(await page.getByTestId("page-title").innerText()).toContain(
      "Brands"
    );
    await expect(page.url()).toContain("/#/admin/brands");
  });
});

test.describe("Customer brands specs", () => {
  test.use({ storageState: ".auth/customer01.json" });

  test("login with valid customer credentials and validate brands page is unreachable", async ({
    page,
  }) => {
    // Example on how to capture network requests timings within a test.
    const requestFinishedPromise = page.waitForEvent("requestfinished");

    await page.goto("/");

    expect(await page.getByTestId("nav-menu").innerText()).toContain(
      "Jane Doe"
    );
    await page.goto("/#/admin/brands");
    await expect(page.getByTestId("email")).toBeVisible();
    await expect(page.url()).toContain("/#/auth/login");

    let request = await requestFinishedPromise;
    console.log(request.timing());
  });
});
