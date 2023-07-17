import { expect } from "@playwright/test";
import { test, CheckoutPage, HomePage } from "@pages";
import { getLoginToken } from "@datafactory/login";

test.describe("Basic UI Checks", () => {
  const username = process.env.CUSTOMER_01_USERNAME || "";
  const password = process.env.CUSTOMER_01_PASSWORD || "";

  test.beforeEach(async ({ page }) => {
    // Gets Login Token via API call
    const token = await getLoginToken(username, password);

    // Sets Local Storage with Login token so user is logged in
    await page.addInitScript((value) => {
      window.localStorage.setItem("auth-token", value);
    }, token);
  });

  test("Add to Cart and Checkout", async ({ page }) => {
    const homePage = new HomePage(page);
    const checkoutPage = new CheckoutPage(page);

    await homePage.goto();

    await homePage.product2.click();
    await homePage.addToCart.click();
    await homePage.navCart.click();

    await checkoutPage.proceed1.click();
    await checkoutPage.proceed2.click();
    await checkoutPage.address.fill("123 test street");
    await checkoutPage.city.fill("testville");
    await checkoutPage.state.fill("test");
    await checkoutPage.country.fill("united states");
    await checkoutPage.postcode.fill("12345");

    await checkoutPage.proceed3.click();
    await checkoutPage.paymentMethod.selectOption("2: Cash on Delivery");

    await checkoutPage.accountName.fill("testy");
    await checkoutPage.accountNumber.fill("1234124");
    await checkoutPage.finish.click();

    await expect(checkoutPage.success.first()).toBeVisible();
  });
});
