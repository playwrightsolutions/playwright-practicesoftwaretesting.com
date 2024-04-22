// // Save your storage state to a file in the .auth directory via setup test

import { expect } from "@playwright/test";
import { LoginPage } from "@pages";

const tempAdminAuthFile = ".auth/tempAdminAuth.json";
const tempUserAuthFile = ".auth/tempUserAuth.json";

export async function createTempAdminAuth(page, email, password) {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(email, password);
  expect(await loginPage.navMenu.innerText()).not.toContain("Sign In");

  await page.context().storageState({ path: tempAdminAuthFile });
  return tempAdminAuthFile;
}

export async function createTempCustomerAuth(page, email, password) {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(email, password);
  expect(await loginPage.navMenu.innerText()).not.toContain("Sign In");

  await page.context().storageState({ path: tempUserAuthFile });
  return tempUserAuthFile;
}
