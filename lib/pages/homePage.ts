import { productIdRoute } from "@fixtures/productPageRoute";
import { Page } from "@playwright/test";

export class HomePage {
  readonly productId = (id: string) =>
    this.page.locator(`[data-test="product-${id}"]`);
  readonly product2 = this.page.locator(
    '[data-test="product-01HD4AMP47V3XJD3KMHK7HW3ME"]'
  );

  readonly addToCart = this.page.locator('[data-test="add-to-cart"]');
  readonly navCart = this.page.locator('[data-test="nav-cart"]');

  async goto() {
    await this.page.goto("/#/");
  }

  async clickProductIdFor(name: string) {
    const productId = await productIdRoute(this.page, name);
    await this.productId(productId).click();
  }

  constructor(private readonly page: Page) {}
}
