import { test } from "@fixtures/modifiedGoto";
import { expect } from "@playwright/test";

test("Contact form with fixture", async ({ page }) => {
  await page.goto("https://practicesoftwaretesting.com");
  await page.waitForLoadState('load');
  expect(page.url()).toContain("?UTM_SOURCE=playwright");

  // Navigate to contact using accessible selector
  await page.getByRole('link', { name: /contact/i }).click();
  await page.waitForLoadState('load');

  // Fill form using ID selectors (discovered via inspection)
  await page.locator('#first_name').fill('Test');
  await page.locator('#last_name').fill('Mctester');
  await page.locator('#email').fill('asf@asdf.com');
  
  // Select and dispatch multiple events to trigger validation
  const subjectSelect = page.locator('#subject');
  await subjectSelect.selectOption({ label: 'Payments' });
  await subjectSelect.dispatchEvent('change');
  await subjectSelect.dispatchEvent('blur');
  await subjectSelect.dispatchEvent('input');
  
  await page.locator('#message').fill('test'.repeat(40));

  // Submit using submit input
  await page.locator('input[type="submit"]').click();
  
  // Verify success message
  await expect(page.locator(".alert")).toContainText(
    "Thanks for your message! We will contact you shortly."
  );
});
