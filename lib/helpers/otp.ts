import * as OTPAuth from "otpauth";

export function generateOTP(secret: string) {
  const totp = new OTPAuth.TOTP({
    secret: secret,
    digits: 6,
    algorithm: "sha1",
    period: 30,
  });

  return totp.generate();
}
