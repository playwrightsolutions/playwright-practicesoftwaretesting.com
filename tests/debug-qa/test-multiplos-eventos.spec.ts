import { test, expect } from "@playwright/test";

test("Contact form com múltiplos eventos após select", async ({ page }) => {
  await page.goto("https://practicesoftwaretesting.com");
  await page.waitForLoadState("networkidle");

  await page.getByRole("link", { name: /contact/i }).click();
  await page.waitForLoadState("networkidle");

  console.log("\n📝 Fill form...");
  await page.locator("#first_name").fill("Test");
  await page.locator("#last_name").fill("Mctester");
  await page.locator("#email").fill("test@example.com");

  const subjectSelect = page.locator("#subject");

  // Check required attribute
  const isRequired = await subjectSelect.evaluate(
    (el: any) => el.hasAttribute("required")
  );
  console.log(`Subject has required: ${isRequired}`);

  // Select option
  await subjectSelect.selectOption({ label: "Payments" });
  const value1 = await subjectSelect.inputValue();
  console.log(`✓ After selectOption: value="${value1}"`);

  // Dispatch multiple events
  console.log("🔄 Dispatching events: change, blur, input...");
  await subjectSelect.dispatchEvent("change");
  await subjectSelect.dispatchEvent("blur");
  await subjectSelect.dispatchEvent("input");

  // Alternative: try to focus and trigger
  await subjectSelect.focus();
  await page.waitForTimeout(100);
  await subjectSelect.blur();

  const value2 = await subjectSelect.inputValue();
  console.log(`✓ After all events: value="${value2}"`);

  await page.locator("#message").fill("test".repeat(40));

  console.log("📮 Submitting...");
  await page.locator('input[type="submit"]').click();

  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1500);

  // Check result
  const alerts = await page.locator(".alert").all();
  console.log(`Found ${alerts.length} alerts`);

  for (const alert of alerts) {
    const text = await alert.textContent();
    console.log(`Alert: "${text?.trim()}"`);
    
    if (text?.includes("Thanks")) {
      console.log("🎉 SUCCESS!");
      expect(text).toContain("Thanks for your message");
      return;
    }
  }

  console.log("❌ Still failed");
});
