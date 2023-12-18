import { expect } from "@playwright/test";
import { test } from "@fixtures/apiRequest";
import { CheckoutPage, HomePage } from "@pages";
import { productIdRoute } from "@fixtures/productPageRoute";

test.describe("Basic UI Checks With API Fixture", () => {
  const username = process.env.CUSTOMER_01_USERNAME || "";
  const password = process.env.CUSTOMER_01_PASSWORD || "";

  test.beforeEach(async ({ page, apiRequest }) => {
    // Gets Login Token via API call using apiBaseURL from fixture but all within the fixture so you don't event need to add apiURL to the test
    const response = await apiRequest.post("/users/login", {
      data: {
        email: username,
        password: password,
      },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    const token = body.access_token;

    // Sets Local Storage with Login token so user is logged in
    await page.addInitScript((value) => {
      window.localStorage.setItem("auth-token", value);
    }, token);
  });

  test("Add to Cart and Checkout", async ({ page }) => {
    const homePage = new HomePage(page);
    const checkoutPage = new CheckoutPage(page);

    await homePage.goto();

    await homePage.clickProductIdFor("Pliers");
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

    await checkoutPage.finish.click();

    await expect(checkoutPage.success.first()).toBeVisible();
  });
});
