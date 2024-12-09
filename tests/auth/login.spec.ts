import { generateOTP } from "@helpers/otp";
import { LoginPage } from "@pages";
import { test, expect } from "@playwright/test";

test.describe("Login Specs", () => {
  let adminEmail = process.env.ADMIN_USERNAME;
  let adminPassword = process.env.ADMIN_PASSWORD;
  let customerEmail = process.env.CUSTOMER_01_USERNAME;
  let customerPassword = process.env.CUSTOMER_01_PASSWORD;
  let playwrightEmail = process.env.PLAYWRIGHT_USERNAME;
  let playwrightPassword = process.env.PLAYWRIGHT_PASSWORD;

  test("Login with valid admin credentials", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(adminEmail, adminPassword);

    expect(await loginPage.navMenu.innerText()).toContain("John Doe");
    // Add additional assertions
  });

  test("Login with valid customer credentials", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(customerEmail, customerPassword);

    expect(await loginPage.navMenu.innerText()).toContain("Jane Doe");
    // Add additional assertions
  });

  test("Login with 2FA enabled", async ({ page, context }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(playwrightEmail, playwrightPassword);

    const otpKey = process.env.OTP_KEY;
    const otpCode = generateOTP(otpKey);

    await loginPage.totp.fill(otpCode);
    await loginPage.verifyTotp.click();
    expect(await loginPage.navMenu.innerText()).toContain("Testy McTester");
  });
});
