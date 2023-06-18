import { expect, request } from "@playwright/test";

let apiURL = process.env.API_URL;

export async function registerUser(email: string, password: string) {
  const createRequestContext = await request.newContext();
  const response = await createRequestContext.post(apiURL + "/users/register", {
    data: {
      first_name: "Happy",
      last_name: "McPathy",
      dob: "1984-09-10",
      address: "123 Test street way",
      city: "birmingham",
      state: "alabama",
      country: "US",
      postcode: "35124",
      phone: "55555555555",
      email: email,
      password: password,
    },
  });

  expect(response.status()).toBe(201);
  const body = await response.json();
  return body;
}
