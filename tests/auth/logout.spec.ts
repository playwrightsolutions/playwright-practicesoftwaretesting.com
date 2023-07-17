import {
  createTempAdminAuth,
  createTempCustomerAuth,
} from "@datafactory/createAuth";
import { LoginPage } from "@pages";
import { test, expect } from "@playwright/test";

test.describe("Logout Specs", () => {
  let adminEmail = process.env.ADMIN_USERNAME;
  let adminPassword = process.env.ADMIN_PASSWORD;
  let tempAdminAuth: string;

  let customerEmail = process.env.CUSTOMER_01_USERNAME;
  let customerPassword = process.env.CUSTOMER_01_PASSWORD;
  let tempCustomerAuth: string;

  test.beforeEach(async ({ page }) => {
    tempAdminAuth = await createTempAdminAuth(page, adminEmail, adminPassword);
    tempCustomerAuth = await createTempCustomerAuth(
      page,
      customerEmail,
      customerPassword
    );
  });

  test("Logout from active admin session", async ({ browser }) => {
    const adminContext = await browser.newContext({
      storageState: tempAdminAuth,
    });
    const adminPage = await adminContext.newPage();
    const loginPage = new LoginPage(adminPage);
    await loginPage.goto();
    await loginPage.navAdminMenu.click();
    await loginPage.navSignOut.click();

    await expect(loginPage.navSignIn).toBeVisible();
  });

  test("Logout from active customer session", async ({ browser }) => {
    const customerContext = await browser.newContext({
      storageState: tempCustomerAuth,
    });
    const customerPage = await customerContext.newPage();
    const loginPage = new LoginPage(customerPage);

    await loginPage.goto();
    await loginPage.navUserMenu.click();
    await loginPage.navSignOut.click();

    await expect(loginPage.navSignIn).toBeVisible();
  });
});
