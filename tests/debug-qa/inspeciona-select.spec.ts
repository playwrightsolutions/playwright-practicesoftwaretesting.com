import { test } from "@playwright/test";

test("Inspeciona HTML exato do subject select", async ({ page }) => {
  await page.goto("https://practicesoftwaretesting.com/contact");
  await page.waitForLoadState("networkidle");

  const subjectSelector = page.locator("#subject");

  // Get o HTML completo do elemento
  const html = await subjectSelector.evaluate((el) => el.outerHTML);
  console.log("\n📄 HTML completo do #subject:");
  console.log(html);

  // Check se é <select> real ou elemento customizado
  const tagName = await subjectSelector.evaluate((el) => el.tagName);
  console.log(`\nTag name: ${tagName}`);

  // Get HTML interno
  const innerHTML = await subjectSelector.evaluate((el) => el.innerHTML);
  console.log("\nInner HTML:");
  console.log(innerHTML.substring(0, 500));
});
