import { HomePage } from "@pages";

export async function productIdRoute(page: any) {
  let productId;

  await page.route(
    "https://api.practicesoftwaretesting.com/products?between=price,1,100&page=1",
    async (route) => {
      let body;
      const response = await route.fetch();
      body = await response.json();
      productId = body.data[1].id;
      route.continue();
    }
  );

  const homePage = new HomePage(page);
  await homePage.goto();

  return productId;
}
