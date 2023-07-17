import { LoginPage } from "@pages";
import { test, expect } from "@playwright/test";

test.describe("Login Specs", () => {
  let adminEmail = process.env.ADMIN_USERNAME;
  let adminPassword = process.env.ADMIN_PASSWORD;

  let customerEmail = process.env.CUSTOMER_01_USERNAME;
  let customerPassword = process.env.CUSTOMER_01_PASSWORD;

  test("Login with valid admin credentials", async ({ page, context }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(adminEmail, adminPassword);

    expect(await loginPage.navAdminMenu.innerText()).toContain("John Doe");
    // Add additional assertions
  });

  test("Login with valid customer credentials", async ({ page, context }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(customerEmail, customerPassword);

    expect(await loginPage.navUserMenu.innerText()).toContain("Jane Doe");
    // Add additional assertions
  });
});
