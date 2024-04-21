// Save your storage state to a file in the .auth directory via setup test

import { LoginPage } from "@pages";
import { test as setup, expect } from "@playwright/test";

let adminEmail = process.env.ADMIN_USERNAME;
let adminPassword = process.env.ADMIN_PASSWORD;
const adminAuthFile = ".auth/admin.json";

let customer01Email = process.env.CUSTOMER_01_USERNAME;
let customer01Password = process.env.CUSTOMER_01_PASSWORD;
const customer01AuthFile = ".auth/customer01.json";

let customer02Email = process.env.CUSTOMER_02_USERNAME;
let customer02Password = process.env.CUSTOMER_02_PASSWORD;
const customer02AuthFile = ".auth/customer02.json";

setup("Create Admin Auth", async ({ page, context }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();

  await loginPage.login(adminEmail, adminPassword);
  expect(await loginPage.navMenu.innerText()).toContain("John Doe");

  await context.storageState({ path: adminAuthFile });
});

setup("Create Customer 01 Auth", async ({ page, context }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();

  await loginPage.login(customer01Email, customer01Password);
  expect(await loginPage.navMenu.innerText()).toContain("Jane Doe");

  await context.storageState({ path: customer01AuthFile });
});

setup("Create Customer 02 Auth", async ({ page, context }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();

  await loginPage.login(customer02Email, customer02Password);
  expect(await loginPage.navMenu.innerText()).toContain("Jack Howe");

  await context.storageState({ path: customer02AuthFile });
});
