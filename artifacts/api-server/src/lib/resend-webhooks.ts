import crypto from "node:crypto";

const WEBHOOK_TOLERANCE_SECONDS = 300;

export function verifyResendWebhook(
  payload: string,
  headers: Record<string, unknown>,
): boolean {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret) return false;

  const id = String(headers["svix-id"] ?? "");
  const timestamp = String(headers["svix-timestamp"] ?? "");
  const signatureHeader = String(headers["svix-signature"] ?? "");

  if (!id || !timestamp || !signatureHeader) return false;

  const timestampNumber = Number(timestamp);
  if (!Number.isFinite(timestampNumber)) return false;

  const age = Math.abs(Date.now() / 1000 - timestampNumber);
  if (age > WEBHOOK_TOLERANCE_SECONDS) return false;

  const secretBytes = Buffer.from(secret.replace(/^whsec_/, ""), "base64");
  const signedContent = `${id}.${timestamp}.${payload}`;
  const expectedSignature = crypto
    .createHmac("sha256", secretBytes)
    .update(signedContent)
    .digest("base64");

  return signatureHeader.split(" ").some((part) => {
    const [version, signature] = part.split(",");
    return version === "v1" && signature === expectedSignature;
  });
}
