import { test } from "@playwright/test";

test("Inspect Contact Page Structure", async ({ page }) => {
  await page.goto("https://practicesoftwaretesting.com");
  await page.waitForLoadState("networkidle");

  console.log("\n=== HOME PAGE ===");
  console.log("Procurando links/botões Contact...");

  const contactElements = await page
    .locator("a, button")
    .filter({ hasText: /contact/i })
    .all();
  console.log(`✓ Encontrados ${contactElements.length} elementos com "contact"`);

  for (let i = 0; i < contactElements.length; i++) {
    const elem = contactElements[i];
    const text = await elem.textContent();
    const tag = await elem.evaluate((el) => el.tagName);
    const href = await elem.getAttribute("href");
    console.log(`  [${i}] <${tag}> "${text?.trim()}" href="${href}"`);
  }

  if (contactElements.length > 0) {
    await contactElements[0].click();
    await page.waitForLoadState("networkidle");

    console.log("\n=== CONTACT PAGE ===");

    const labels = await page.locator("label").all();
    console.log(`✓ Encontrados ${labels.length} labels`);

    const inputs = await page.locator("input, textarea, select").all();
    console.log(`✓ Encontrados ${inputs.length} campos`);

    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      const tag = await input.evaluate((el) => el.tagName);
      const id = await input.getAttribute("id");
      const type = await input.getAttribute("type");
      console.log(`  [${i}] <${tag}> id="${id}" type="${type}"`);
    }
  }
});
