import { test, expect } from "@playwright/test";

test.describe("Customer 01 my account specs", () => {
  test.use({ storageState: ".auth/customer01.json" });

  test("validate customer 01 my account page", async ({ page }) => {
    await page.goto("/#/account");

    expect(await page.getByTestId("nav-user-menu").innerText()).toContain(
      "Jane Doe"
    );
    expect(await page.getByTestId("page-title").innerText()).toContain(
      "My account"
    );
    expect(await page.getByTestId("nav-favorites").innerText()).toContain(
      "Favorites"
    );
  });
});

test.describe("Customer 02 my account specs", () => {
  test.use({ storageState: ".auth/customer02.json" });

  test("validate customer 02 my account page", async ({ page }) => {
    await page.goto("/#/account");

    expect(await page.getByTestId("nav-user-menu").innerText()).toContain(
      "Jack Howe"
    );
    expect(await page.getByTestId("page-title").innerText()).toContain(
      "My account"
    );
    expect(await page.getByTestId("nav-favorites").innerText()).toContain(
      "Favorites"
    );
  });
});

test.describe("Admin my account specs", () => {
  test.use({ storageState: ".auth/admin.json" });

  test("Validate admin my account page fails to load", async ({ page }) => {
    await page.goto("/#/account");

    expect(page.url()).toContain("/#/auth/login");
    expect(await page.getByTestId("nav-admin-menu").innerText()).toContain(
      "John Doe"
    );
  });
});
