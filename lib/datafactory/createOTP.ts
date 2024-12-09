import { expect, request } from "@playwright/test";
import { getLoginToken } from "./login";
import * as path from "path";
import * as fs from "fs";
import { generateOTP } from "@helpers/otp";

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
  updateOTPSecret(body.secret);
  const code = generateOTP(body.secret);
  await verifyOTP(code, token);
  return body.secret;
}

function updateOTPSecret(secret: string): void {
  const projectRoot = process.cwd();
  const envPath = path.resolve(projectRoot, ".env");

  if (!fs.existsSync(envPath)) {
    throw new Error(`.env file not found at ${envPath}`);
  }

  const envContent = fs.readFileSync(envPath, "utf8");

  if (!envContent.includes("OTP_KEY")) {
    throw new Error("OTP_KEY not found in .env file");
  }

  const updatedContent = envContent.replace(/OTP_KEY=.*/, `OTP_KEY=${secret}`);
  console.log(`the new OTP_KEY is ${secret}`);
  // Write with explicit file permissions
  fs.writeFileSync(envPath, updatedContent, {
    encoding: "utf8",
    mode: 0o666, // Read/write for owner
  });
}

export async function verifyOTP(code: string, token: string) {
  const createRequestContext = await request.newContext();
  const response = await createRequestContext.post(apiURL + "/totp/verify", {
    headers: { Authorization: `Bearer ${token}` },
    data: { totp: code },
  });

  expect(response.status()).toBe(200);
}
