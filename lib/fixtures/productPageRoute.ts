import { HomePage } from "@pages";

/**
 * Sets up a route to retrieve the product ID from the API response.
 * @param page - The Playwright page object.
 * @param name - Optional name of the string to get the ID for.
 * @returns The product ID.
 * @example
 * const page = await browser.newPage();
 * const productId = await productIdRoute(page); // Gets the second product ID
 *
 * const productId = await productIdRoute(page, "Pliers") // Gets the ID for the product named "Pliers"
 */
export async function productIdRoute(page: any, name?: string) {
  let productId;

  await page.route(
    "https://api.practicesoftwaretesting.com/products?between=price,1,100&page=1",
    async (route) => {
      let body;
      const response = await route.fetch();
      body = await response.json();
      if (name) {
        productId = findIdByName(body, name);
        console.log("pid: " + productId);
      } else {
        // Get the second product in the list
        productId = body.data[1].id;
      }
      route.continue();
    }
  );

  const homePage = new HomePage(page);
  await homePage.goto();

  return productId;
}

function findIdByName(json: any, name: string): string | undefined {
  const data = json.data;
  for (let i = 0; i < data.length; i++) {
    if (data[i].name === name) {
      return data[i].id;
    }
  }
  return undefined;
}
