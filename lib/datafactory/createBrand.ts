import { expect, request } from "@playwright/test";
import { getLoginToken } from "./login";

export async function createBrand(brandName: string, slugName: string) {
  let apiURL = process.env.API_URL;
  let email = process.env.ADMIN_USERNAME;
  let password = process.env.ADMIN_PASSWORD;

  const token = await getLoginToken(email, password);

  const createRequestContext = await request.newContext();
  const response = await createRequestContext.post(apiURL + "/brands", {
    data: `{
    "id": "",
    "name": "${brandName}",
    "slug": "${slugName}"
  }`,
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });
  expect(response.status()).toBe(201);
}
