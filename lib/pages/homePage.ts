import { productIdRoute } from "@fixtures/productPageRoute";
import { Page } from "@playwright/test";
import { boxedStep } from "@helpers/boxedStep";

export class HomePage {
  readonly productId = (id: string) =>
    this.page.locator(`[data-test="product-${id}"]`);
  readonly product2 = this.page.locator(
    '[data-test="product-01H88E5BMA2F3PX6VYX2NS3KX4"]'
  );

  readonly addToCart = this.page.locator('[data-test="add-to-cart"]');
  readonly navCart = this.page.locator('[data-test="nav-cart"]');

  async goto() {
    await this.page.goto("/");
  }

  @boxedStep
  async clickProductIdFor(name: string) {
    const productId = await productIdRoute(this.page, name);
    await this.productId(productId).click();
  }

  async clickProductIdFor(name: string) {
    const productId = await productIdRoute(this.page, name);
    await this.productId(productId).click();
  }

  constructor(private readonly page: Page) {}
}
