import { test } from "@playwright/test";

test("Test ALL subject options to find working one", async ({ page }) => {
  const optionsToTest = [
    "Customer service",
    "Webmaster",
    "Return",
    "Payments",
    "Warranty",
    "Status of my order",
  ];

  for (const option of optionsToTest) {
    console.log(`\n🧪 Testing option: "${option}"`);

    await page.goto("https://practicesoftwaretesting.com/contact");
    await page.waitForLoadState("networkidle");

    await page.locator("#first_name").fill("Test");
    await page.locator("#last_name").fill("User");
    await page.locator("#email").fill("test@example.com");

    try {
      await page.locator("#subject").selectOption({ label: option });
      const value = await page.locator("#subject").inputValue();
      console.log(`  ✓ Selected: value="${value}"`);
    } catch (e) {
      console.log(`  ✗ Could not select`);
      continue;
    }

    await page.locator("#subject").dispatchEvent("change");
    await page.locator("#message").fill("test message");

    await page.locator('input[type="submit"]').click();
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    const alerts = await page.locator(".alert").all();
    if (alerts.length > 0) {
      const alertText = await alerts[0].textContent();
      if (alertText?.includes("Thanks")) {
        console.log(`  🎉 SUCCESS! Alert: "${alertText?.trim()}"`);
        return;
      } else {
        console.log(`  ❌ Alert: "${alertText?.trim()}"`);
      }
    }
  }

  console.log("\n🔴 None of the options worked!");
});
