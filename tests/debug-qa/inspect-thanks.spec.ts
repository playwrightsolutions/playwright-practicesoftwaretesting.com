import { test } from "@playwright/test";

test("Inspect where the thank-you message appears", async ({ page }) => {
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

  await page.locator("input[type=\"submit\"]").click();
  await page.waitForLoadState("load");
  await page.waitForTimeout(2000);

  console.log(`urlAfterSubmit=${page.url()}`);
  const pageTitle = await page.title();
  console.log(`titleAfterSubmit=${pageTitle}`);

  const thanksCount = await page.locator('text=Thanks for your message').count();
  console.log(`thanksCount=${thanksCount}`);

  const thanksTexts = await page.locator('text=Thanks').allTextContents();
  console.log(`thanksTexts=${JSON.stringify(thanksTexts)}`);

  const thankElementHandle = await page.locator('text=Thanks for your message').first();
  const outerHTML = await thankElementHandle.evaluate((el: any) => el.outerHTML);
  console.log(`outerHTML=${outerHTML}`);

  const body = await page.locator("body").innerText();
  console.log(`body starts with: ${body.slice(0, 400).replace(/\n/g, ' ')}...`);
});