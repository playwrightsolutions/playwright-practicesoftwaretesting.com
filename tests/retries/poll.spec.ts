import { test, expect } from "@playwright/test";

test.describe("Testing poll ", () => {
  test.use({ storageState: ".auth/customer01.json" });

  test("login with valid customer credentials and validate brands page is unreachable", async ({
    page,
  }) => {
    await page.goto("/");

    expect(await page.getByTestId("nav-menu").innerText()).toContain(
      "Jane Doe"
    );

    await expect
      .poll(
        async () => {
          await page.goto("/admin/brands");
          await expect(page.getByTestId("email")).toBeVisible();
          await expect(page.url()).toContain("/auth/login");
          return page.url();
        },
        {
          timeout: 20_000,
        }
      )
      .toContain("/auth/login");
  });
});
