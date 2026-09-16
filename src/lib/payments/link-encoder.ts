import crypto from "crypto";

export interface EncodedPaymentPayload {
  title: string;
  price: number; // in INR
  redirectUrl: string;
  description?: string | null;
  currency?: string;
  createdAt?: number;
  sig?: string;
}

const SECRET_KEY = process.env.RAZORPAY_KEY_SECRET || process.env.NEXTAUTH_SECRET || "scriptly_secure_pay_secret_key_2026";

/**
 * Computes an HMAC SHA-256 signature for a payment payload.
 */
export function generatePayloadSignature(title: string, price: number, redirectUrl: string): string {
  const message = `${title.trim()}|${Number(price)}|${redirectUrl.trim()}`;
  return crypto
    .createHmac("sha256", SECRET_KEY)
    .update(message)
    .digest("hex")
    .slice(0, 16); // 16-char hex signature keeps URL compact
}

/**
 * Encodes payment parameters into a tamper-proof, URL-safe Base64 token.
 * Prevents users from manually altering price, redirect destination, or product title.
 */
export function encodePaymentLinkPayload(
  payload: {
    title: string;
    price: number;
    redirectUrl: string;
    description?: string | null;
    currency?: string;
  },
  sign: boolean = true
): string {
  let redirect = payload.redirectUrl.trim();
  if (!/^https?:\/\//i.test(redirect)) {
    redirect = "https://" + redirect;
  }

  const cleanPrice = Number(payload.price);
  const cleanTitle = payload.title.trim();

  const data: EncodedPaymentPayload = {
    title: cleanTitle,
    price: cleanPrice,
    redirectUrl: redirect,
    description: payload.description?.trim() || undefined,
    currency: payload.currency || "INR",
    createdAt: Date.now(),
  };

  if (sign) {
    data.sig = generatePayloadSignature(cleanTitle, cleanPrice, redirect);
  }

  const jsonString = JSON.stringify(data);
  // URL-safe Base64
  return Buffer.from(jsonString, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * Decodes and verifies a Base64 payment token.
 * Returns null or throws an error if tampered.
 */
export function decodePaymentLinkPayload(token: string): {
  success: boolean;
  data?: EncodedPaymentPayload;
  error?: string;
} {
  try {
    // Restore standard Base64 padding
    let base64 = token.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
      base64 += "=";
    }

    const decodedJson = Buffer.from(base64, "base64").toString("utf8");
    const parsed: EncodedPaymentPayload = JSON.parse(decodedJson);

    if (!parsed.title || !parsed.price || !parsed.redirectUrl) {
      return { success: false, error: "Missing essential payload parameters." };
    }

    // Verify signature if present
    if (parsed.sig) {
      const expectedSig = generatePayloadSignature(parsed.title, parsed.price, parsed.redirectUrl);
      if (parsed.sig !== expectedSig) {
        return {
          success: false,
          error: "Payment link has been tampered with or modified. Signature verification failed.",
        };
      }
    }

    return { success: true, data: parsed };
  } catch (err: any) {
    return { success: false, error: "Invalid or corrupted encoded payment data." };
  }
}
