import { test, expect } from "@playwright/test";

test.describe("Customer 01 my account specs", () => {
  test.use({ storageState: ".auth/customer01.json" });
  test.describe.configure({ mode: "default" });

  test.afterEach(async ({ page }) => {
    await page.goto("/account/profile");
    await page.waitForLoadState("networkidle");
    await page.getByTestId("first-name").fill("Jane");
    await page.getByTestId("last-name").fill("Doe");
    await page.getByTestId("address").fill("101 Testing Way");
    await page.getByTestId("update-profile-submit").click();
    await expect(
      page.getByRole("alert").filter({ hasText: "successfully" })
    ).toBeVisible();
  });

  test("validate customer 01 my account page", async ({ page }) => {
    await page.goto("/account");

    expect(await page.getByTestId("nav-menu").innerText()).toContain(
      "Jane Doe"
    );
    expect(await page.getByTestId("page-title").innerText()).toContain(
      "My account"
    );
    expect(await page.getByTestId("nav-favorites").innerText()).toContain(
      "Favorites"
    );
  });

  test("update customer 01 account", async ({ page }) => {
    await page.goto("account/profile");

    await page.waitForLoadState("networkidle");
    await page.getByTestId("first-name").fill("Testy");
    await page.getByTestId("last-name").fill("McTesterface");
    await page.getByTestId("address").fill("101 Testing Way");

    await page.getByTestId("update-profile-submit").click();
    await expect(
      page.getByRole("alert").filter({ hasText: "successfully" })
    ).toBeVisible();

    // Assert the updated name is displayed in the nav menu
    await page.reload();
    expect(await page.getByTestId("nav-menu").innerText()).toContain(
      "Testy McTesterface"
    );

    await expect(page.getByTestId("first-name")).toHaveValue("Testy");
    await expect(page.getByTestId("last-name")).toHaveValue("McTesterface");
    await expect(page.getByTestId("address")).toHaveValue("101 Testing Way");
  });

  test("validate customer 01 account other", async ({ page }) => {
    await page.goto("/account");

    expect(await page.getByTestId("nav-menu").innerText()).toContain(
      "Jane Doe"
    );
  });
});

test.describe("Customer 02 my account specs", () => {
  test.use({ storageState: ".auth/customer02.json" });

  test("validate customer 02 my account page", async ({ page }) => {
    await page.goto("/account");

    expect(await page.getByTestId("nav-menu").innerText()).toContain(
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
    await page.goto("/account");

    expect(page.url()).toContain("/auth/login");
    expect(await page.getByTestId("nav-menu").innerText()).toContain(
      "John Doe"
    );
  });
});
