import { test, expect } from "@playwright/test";

test("Contact form without fixture", async ({ page }) => {
  const baseURL = "https://practicesoftwaretesting.com";
  await page.goto(baseURL);
  await page.waitForLoadState('load');

  // Navigate to contact using accessible selector
  await page.getByRole('link', { name: /contact/i }).click();
  await page.waitForLoadState('networkidle');

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
  await page.waitForSelector('.alert.alert-success', { timeout: 10000 });

  // Verify success message
  await expect(page.locator(".alert.alert-success")).toContainText(
    "Thanks for your message! We will contact you shortly."
  );
});
