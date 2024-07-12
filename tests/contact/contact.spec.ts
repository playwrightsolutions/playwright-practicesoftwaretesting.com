import { test } from "@fixtures/modifiedGoto";
import { expect } from "@playwright/test";

test("Home Page Tests", async ({ page }) => {
  await page.goto("/");
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
