import { test } from "@fixtures/modifiedGoto";

test("Inspect contact submit with modifiedGoto fixture", async ({ page }) => {
  await page.goto("https://practicesoftwaretesting.com");
  await page.waitForLoadState("load");

  await page.getByRole("link", { name: /contact/i }).click();
  await page.waitForLoadState("load");

  await page.locator("#first_name").fill("Test");
  await page.locator("#last_name").fill("Mctester");
  await page.locator("#email").fill("test@example.com");

  const subjectSelect = page.locator("#subject");
  await subjectSelect.selectOption({ label: "Payments" });
  await subjectSelect.dispatchEvent("change");
  await subjectSelect.dispatchEvent("blur");
  await subjectSelect.dispatchEvent("input");

  await page.locator("#message").fill("test".repeat(40));
  await page.locator('input[type="submit"]').click();
  await page.waitForLoadState("load");
  await page.waitForTimeout(2000);

  console.log(`urlAfterSubmit=${page.url()}`);
  const thanksCount = await page.locator('text=Thanks for your message').count();
  console.log(`thanksCount=${thanksCount}`);
  const alertCount = await page.locator('.alert.alert-success').count();
  console.log(`alertCount=${alertCount}`);
  const hasAlertText = await page.locator('.alert.alert-success', { hasText: 'Thanks for your message' }).count();
  console.log(`hasAlertText=${hasAlertText}`);
});