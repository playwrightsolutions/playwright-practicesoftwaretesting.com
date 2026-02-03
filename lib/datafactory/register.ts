import { expect, request } from "@playwright/test";

let apiURL = process.env.API_URL;

export async function registerUser(email: string, password: string) {
  const createRequestContext = await request.newContext();
  const response = await createRequestContext.post(apiURL + "/users/register", {
    data: {
      first_name: "Testy",
      last_name: "McTester",
      dob: "1955-09-10",
      address: {
        street: "123 Test street way",
        city: "BugFree",
        state: "California",
        country: "US",
        postcode: "55555",
      },
      phone: "55555555555",
      email: email,
      password: password,
    },
  });

  expect(response.status()).toBe(201);
  return response.status();
}
