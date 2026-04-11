import { test } from "@playwright/test";

test("Debug Contact Submit Response", async ({ page }) => {
  await page.goto("https://practicesoftwaretesting.com");
  await page.waitForLoadState("networkidle");

  await page.getByRole("link", { name: /contact/i }).click();
  await page.waitForLoadState("networkidle");

  console.log("\n📝 Filling contact form...");
  await page.locator("#first_name").fill("Test");
  await page.locator("#last_name").fill("Mctester");
  await page.locator("#email").fill("test@example.com");
  await page.locator("#subject").selectOption({ label: 'Payments' });
  await page.locator("#subject").dispatchEvent("change");
  await page.locator("#message").fill("test".repeat(40));

  console.log("📮 Submitting form...");
  await page.locator('input[type="submit"]').click();

  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(2000);

  console.log("\n🔍 Inspecting page after submit...");

  const alerts = await page.locator("[class*='alert']").all();
  console.log(`✓ Found ${alerts.length} alert elements:`);

  for (const alert of alerts) {
    const className = await alert.getAttribute("class");
    const text = await alert.textContent();
    console.log(`  - class="${className}" text="${text?.trim()}"`);
  }

  const html = await page.content();
  if (html.includes("thanks") || html.includes("Thanks")) {
    console.log("\n✓ Page HTML contains 'thanks'");
  } else {
    console.log("\n✗ Page HTML does NOT contain 'thanks'");
  }

  console.log("\nCurrent URL:", await page.url());
});
