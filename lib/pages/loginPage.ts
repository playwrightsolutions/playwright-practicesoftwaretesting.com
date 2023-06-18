import { Page } from "@playwright/test";

export class LoginPage {
  readonly username = this.page.locator('[data-test="email"]');
  readonly password = this.page.locator('[data-test="password"]');
  readonly submit = this.page.locator('[data-test="login-submit"]');

  async goto() {
    await this.page.goto("/#/auth/login");
  }

  constructor(private readonly page: Page) {}
}
