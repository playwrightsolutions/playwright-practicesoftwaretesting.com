import { generateOTP } from "@helpers/otp";
import { LoginPage } from "@pages";
import { test, expect } from "@playwright/test";

test("Login with 2FA enabled", async ({ page }) => {
  const playwrightEmail = process.env.PLAYWRIGHT_USERNAME;
  const playwrightPassword = process.env.PLAYWRIGHT_PASSWORD;
  const otpKey = process.env.OTP_KEY;

  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(playwrightEmail, playwrightPassword);

  const otpCode = generateOTP(otpKey);

  await loginPage.totp.fill(otpCode);
  await loginPage.verifyTotp.click();
  expect(await loginPage.navMenu.innerText()).toContain("Testy McTester");
});
