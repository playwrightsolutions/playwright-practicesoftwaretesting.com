import { test } from "@fixtures/modifiedGoto";
import { expect } from "@playwright/test";

// Append query parameters to page.goto() urls - Tomaj
// https://discord.com/channels/807756831384403968/1160874346483564644

test("Home Page Tests", async ({ page }) => {
  await page.goto("https://practicesoftwaretesting.com/#/");
  expect(page.url()).toContain("?UTM_SOURCE=playwright");

  await page.getByTestId("nav-contact").click();
  await page.getByTestId("first-name").fill("Test");
  await page.getByTestId("last-name").fill("Mctester");
  await page.getByTestId("email").fill("asf@asdf.com");
  await page.getByTestId("subject").selectOption("payments");
  await page.getByTestId("message").fill("test".repeat(40));
  await page.getByTestId("contact-submit").click();
  await expect(page.locator(".alert-success")).toHaveText(
    "Thanks for your message! We will contact you shortly."
  );
});
