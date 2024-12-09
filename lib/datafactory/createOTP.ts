import { expect, request } from "@playwright/test";
import { getLoginToken } from "./login";
import * as fs from "fs";

let apiURL = process.env.API_URL;

export async function createOTP(email: string, password: string) {
  const token = await getLoginToken(email, password);
  const createRequestContext = await request.newContext();
  const response = await createRequestContext.post(apiURL + "/totp/setup ", {
    headers: { Authorization: `Bearer ${token}` },
    data: {},
  });

  expect(response.status()).toBe(200);
  const body = await response.json();
  // If this code every runs I want to overwrite the OTP_SECRET in the .env file
  updateOTPSecret(body.secret);
  return body.secret;
}

function updateOTPSecret(secret: string): void {
  // Read .env file
  const envPath = ".env";
  const envContent = fs.readFileSync(envPath, "utf8");

  // Replace OTP_SECRET line
  const updatedContent = envContent.replace(
    /OTP_SECRET=.*/,
    `OTP_SECRET=${secret}`
  );

  // Write back to file
  fs.writeFileSync(envPath, updatedContent, "utf8");
  console.log("OTP secret updated successfully");
}
