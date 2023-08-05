import { test, expect } from "@playwright/test";

test.describe("Testing toPass ", () => {
  test.use({ storageState: ".auth/customer01.json" });

  test("login with valid customer credentials and validate brands page is unreachable", async ({
    page,
  }) => {
    await expect(async () => {
      await page.goto("/");

      expect(await page.getByTestId("nav-user-menu").innerText()).toContain(
        "Jane Doe"
      );
      await page.goto("/#/admin/brands");
      await expect(page.getByTestId("email")).toBeVisible();
      await expect(page.url()).toContain("/#/auth/login");
    }).toPass({
      timeout: 10_000,
    });
  });
});
