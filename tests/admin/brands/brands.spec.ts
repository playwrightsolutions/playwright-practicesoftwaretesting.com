import { test, expect } from "@playwright/test";
import { createBrand } from "@datafactory/createBrand";
import { faker } from "@faker-js/faker";

test.describe("Admin brands specs", () => {
  test.use({ storageState: ".auth/admin.json" });

  test("login with valid admin credentials and check brands page", async ({
    page,
  }) => {
    await page.goto("/");
    expect(await page.getByTestId("nav-menu").innerText()).toContain(
      "John Doe"
    );
    await page.goto("/admin/brands");
    expect(await page.getByTestId("page-title").innerText()).toContain(
      "Brands"
    );
    await expect(page.url()).toContain("/admin/brands");
  });

  test("create a new brand", async ({ page }) => {
    await page.goto("/admin/brands/add");
    await page.getByTestId("name").fill("Random Brand");
    await page.getByTestId("slug").fill("random-slug");
    await page.getByTestId("brand-submit").click();
    await expect(page.getByText("Brand saved")).toBeVisible();
  });

  test("validate new brand is rendered in the list", async ({
    page,
    context,
  }) => {
    await page.goto("/admin/brands");

    const name = faker.person.firstName();
    const slug = faker.animal.type();

    await createBrand(name, slug);
    await page.goto("/admin/brands");
    await expect(page.getByText(name)).toBeVisible();
  });
});

test.describe("Customer brands specs", () => {
  test.use({ storageState: ".auth/customer01.json" });

  test("login with valid customer credentials and validate brands page is unreachable", async ({
    page,
  }) => {
    // Example on how to capture network requests timings within a test.
    const requestFinishedPromise = page.waitForEvent("requestfinished");

    await page.goto("/");

    expect(await page.getByTestId("nav-menu").innerText()).toContain(
      "Jane Doe"
    );
    await page.goto("/admin/brands");
    await expect(page.getByTestId("email")).toBeVisible();
    await expect(page.url()).toContain("/auth/login");

    let request = await requestFinishedPromise;
    console.log(request.timing());
  });
});
