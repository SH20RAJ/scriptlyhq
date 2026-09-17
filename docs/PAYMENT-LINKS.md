# ScriptlyStore — Payment Links & Dynamic Checkout Guide

ScriptlyStore offers an open, zero-setup dynamic payment checkout engine located at `/pay`.

It allows anyone—creators, agencies, indie hackers, and AI coding agents—to collect online payments with instant Razorpay checkout and guaranteed post-payment redirection without deploying a custom checkout backend.

---

## 1. Supported URL Patterns

### Pattern 1: URL-Safe Base64 Token (Recommended)
```text
https://scriptly.store/pay?data=BASE64_TOKEN
```
- Conceals price, product title, and destination from casual inspection.
- Conforms to the JSON schema specified in Section 2.
- Supports optional HMAC-SHA256 signature verification so buyers cannot alter the price.

### Pattern 2: Key-Protected AES-256-GCM Encrypted Token
```text
https://scriptly.store/pay?data=k1.IV.TAG.CIPHERTEXT
```
- Encrypted symmetrically with a custom passphrase or secret key.
- Unreadable without the key.
- **Interactive Unlock**: Accessing this URL prompts the buyer with a clean unlock card asking for the passphrase.
- **Pre-Unlocked**: Appending `&key=YOUR_KEY` bypasses the prompt and unlocks checkout automatically:
  ```text
  https://scriptly.store/pay?data=k1.IV.TAG.CIPHERTEXT&key=YOUR_SECRET_KEY
  ```

### Pattern 3: Plain Query Parameters
```text
https://scriptly.store/pay?title=Item+Name&price=999&redirect=https%3A%2F%2Fexample.com%2Fthanks
```
- Quickest for manual sharing or testing.
- Visible parameters in the address bar.

---

## 2. Base64 JSON Payload Schema

When encoding a payment payload into `?data=`, the underlying JSON object must follow this specification:

```json
{
  "title": "Full-Stack SaaS Boilerplate",
  "price": 1499,
  "redirectUrl": "https://example.com/download",
  "description": "Next.js 16 production starter kit",
  "currency": "INR",
  "sig": "e7b301f92a10cb5d"
}
```

| Property | Type | Required | Description |
|---|---|---|---|
| `title` | `string` | **Yes** | Product or service title. |
| `price` | `number` | **Yes** | Price in Indian Rupee (₹). Must be > 0. |
| `redirectUrl` | `string` | **Yes** | Post-payment destination. Protocol (`https://`) required. |
| `description` | `string` | No | Subtitle or delivery instructions. |
| `currency` | `string` | No | Default: `"INR"`. |
| `sig` | `string` | No | 16-character HMAC-SHA256 hex signature. |

---

## 3. Cryptographic Signature & Tamper Verification

To prevent clients from altering `price` or `redirectUrl` in their browser, tokens can be signed using HMAC-SHA256:

```ts
// Signature Formula
const message = `${title.trim()}|${Number(price)}|${redirectUrl.trim()}`;
const signature = crypto
  .createHmac("sha256", secretKey)
  .update(message)
  .digest("hex")
  .slice(0, 16);
```

If the signature in the payload does not match the recalculated signature upon checkout loading, checkout is blocked with:
> **Tampered or Invalid Link**: *The payment link signature is invalid or has been modified.*

---

## 4. Code Implementation Examples

### TypeScript / Node.js
```ts
import crypto from "crypto";

export function createEncryptedPaymentLink(params: {
  title: string;
  price: number;
  redirectUrl: string;
  key?: string;
}) {
  const { title, price, redirectUrl, key } = params;

  if (key) {
    // 256-bit AES-GCM Encryption
    const derivedKey = crypto.createHash("sha256").update(key).digest();
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv("aes-256-gcm", derivedKey, iv);
    const json = JSON.stringify({ title, price, redirectUrl, currency: "INR" });
    let ciphertext = cipher.update(json, "utf8", "hex");
    ciphertext += cipher.final("hex");
    const tag = cipher.getAuthTag().toString("hex");

    const token = `k1.${iv.toString("hex")}.${tag}.${ciphertext}`;
    return `https://scriptly.store/pay?data=${token}&key=${encodeURIComponent(key)}`;
  }

  // Base64 URL-Safe
  const payload = { title, price, redirectUrl, currency: "INR" };
  const token = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `https://scriptly.store/pay?data=${token}`;
}
```

### Python
```python
import json, base64

def create_payment_link(title: str, price: float, redirect_url: str) -> str:
    payload = {
        "title": title,
        "price": price,
        "redirectUrl": redirect_url,
        "currency": "INR"
    }
    json_bytes = json.dumps(payload).encode("utf-8")
    token = base64.urlsafe_b64encode(json_bytes).decode("utf-8").rstrip("=")
    return f"https://scriptly.store/pay?data={token}"

print(create_payment_link("AI Prompt Pack", 499, "https://example.com/thanks"))
```

### cURL (Open REST API)
```bash
curl -X POST "https://scriptly.store/api/pay/create" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Private Consultation",
    "price": 999,
    "redirectUrl": "https://cal.com/booking",
    "key": "mySecretKey123"
  }'
```
