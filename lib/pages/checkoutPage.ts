import { Page } from "@playwright/test";

export class CheckoutPage {
  readonly proceed1 = this.page.locator('[data-test="proceed-1"]');
  readonly proceed2 = this.page.locator('[data-test="proceed-2"]');
  readonly proceed3 = this.page.locator('[data-test="proceed-3"]');

  readonly address = this.page.locator('[data-test="address"]');
  readonly city = this.page.locator('[data-test="city"]');
  readonly state = this.page.locator('[data-test="state"]');
  readonly country = this.page.locator('[data-test="country"]');
  readonly postcode = this.page.locator('[data-test="postcode"]');

  readonly paymentMethod = this.page.locator('[data-test="payment-method"]');
  readonly accountName = this.page.locator('[data-test="account-name"]');
  readonly accountNumber = this.page.locator('[data-test="account-number"]');

  readonly finish = this.page.locator('[data-test="finish"]');
  readonly success = this.page.locator("div").filter({
    hasText: /^Payment was successful$/,
  });

  async goto() {
    await this.page.goto("/checkout");
  }

  constructor(private readonly page: Page) {}
}
