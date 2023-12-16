import { test, expect } from "@playwright/test";

test.skip("Validate cart is updated from product details page", async ({
  page,
}) => {
  await page.goto("https://practicesoftwaretesting.com/#/");
  await page.getByTestId("nav-categories").click();
  await page.getByTestId("nav-hand-tools").click();
  await page.getByTestId("product-01HGNV046D6QCTCXZ8KPN3FN9A").click();
  await expect(page.getByTestId("product-name")).toContainText(
    "Claw Hammer with Shock Reduction Grip"
  );
  await expect(page.locator("app-detail")).toContainText("Hammer");
  await expect(page.locator("app-detail")).toContainText("Brand name 1");
  await page.getByTestId("increase-quantity").click();
  await expect(page.getByTestId("quantity")).toHaveValue("2");
  await page.getByTestId("add-to-cart").click();
  await expect(page.getByTestId("cart-quantity")).toContainText("2");
  await page.getByTestId("nav-cart").click();
  await expect(page.getByRole("spinbutton")).toHaveValue("2");
  await expect(page.locator("tbody")).toContainText(
    "Claw Hammer with Shock Reduction Grip"
  );
});
