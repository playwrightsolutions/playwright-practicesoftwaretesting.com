import { Page } from "@playwright/test";

export class HomePage {
  readonly product1 = this.page.locator('[data-test="product-1"]');
  readonly product2 = this.page.locator('[data-test="product-2"]');
  readonly product3 = this.page.locator('[data-test="product-3"]');
  readonly product4 = this.page.locator('[data-test="product-4"]');

  readonly addToCart = this.page.locator('[data-test="add-to-cart"]');
  readonly navCart = this.page.locator('[data-test="nav-cart"]');

  async goto() {
    await this.page.goto("/#/");
  }

  constructor(private readonly page: Page) {}
}
