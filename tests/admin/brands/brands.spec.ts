import { test, expect } from "@playwright/test";

test.describe("Admin brands specs", () => {
  test.use({ storageState: ".auth/admin.json" });

  test("login with valid admin credentials and check brands page", async ({
    page,
  }) => {
    await page.goto("/");
    expect(await page.getByTestId("nav-admin-menu").innerText()).toContain(
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
    await page.goto("/");
    expect(await page.getByTestId("nav-user-menu").innerText()).toContain(
      "Jane Doe"
    );
    await page.goto("/#/admin/brands");
    await expect(page.getByTestId("email")).toBeVisible();
    await expect(page.url()).toContain("/#/auth/login");
  });
});
