import { test, expect } from "@playwright/test";

test("Validate cart is updated from product details page", async ({ page }) => {
  const productName = "Claw Hammer with Shock Reduction Grip";
  await page.goto("https://practicesoftwaretesting.com/");
  await page.getByTestId("nav-categories").click();
  await page.getByTestId("nav-hand-tools").click();
  // create a playwright locator that will find a link with a child div that has text of "Claw Hammer with Shock Reduction Grip" and click the link
  await page
    .locator('a >> div:has-text("Claw Hammer with Shock Reduction Grip")')
    .click();
  // await page.getByTestId("product-01HW4EAZ6N8RP9NNC55NT5AXPW").click();
  await expect(page.getByTestId("product-name")).toContainText(productName);
  await expect(page.locator("app-detail")).toContainText("Hammer");
  await expect(page.getByLabel("brand")).toContainText("ForgeFlex Tools");
  await page.getByTestId("increase-quantity").click();
  await expect(page.getByTestId("quantity")).toHaveValue("2");
  await page.getByTestId("add-to-cart").click();
  await expect(page.getByTestId("cart-quantity")).toContainText("2");
  await page.getByTestId("nav-cart").click();
  await expect(page.getByRole("spinbutton")).toHaveValue("2");
  await expect(page.locator("tbody")).toContainText(productName);
});
