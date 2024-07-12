import { Page } from "@playwright/test";

export class LoginPage {
  readonly username = this.page.getByTestId("email");
  readonly password = this.page.getByTestId("password");
  readonly submit = this.page.getByTestId("login-submit");
  readonly navUserMenu = this.page.getByTestId("nav-user-menu");
  readonly navAdminMenu = this.page.getByTestId("nav-admin-menu");
  readonly navMenu = this.page.getByTestId("nav-menu");
  readonly navSignOut = this.page.getByTestId("nav-sign-out");
  readonly navSignIn = this.page.getByTestId("nav-sign-in");

  async goto() {
    await this.page.goto("/auth/login");
  }

  async login(email: string, password: string) {
    await this.goto();
    await this.username.fill(email);
    await this.password.fill(password);
    await this.submit.click();
  }

  constructor(private readonly page: Page) {}
}
