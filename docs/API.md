# ScriptlyStore — REST API Documentation

This document provides complete technical specifications for ScriptlyStore's public and internal REST APIs.

---

## 1. Open Payment Links Creation API

### `POST /api/pay/create`
Create a hosted or dynamic payment link with guaranteed post-payment redirection. **Open to everyone**—no authentication or API keys required.

#### Request Headers
```http
Content-Type: application/json
```

#### Request Body Schema
| Field | Type | Required | Description |
|---|---|---|---|
| `title` | `string` | **Yes** | Product, service, or call title shown to the buyer. (Alias: `name`) |
| `price` | `number` | **Yes** | Amount in Indian Rupee (`₹` / INR). Must be `> 0`. (Alias: `prize`) |
| `redirectUrl` | `string` | **Yes** | Target URL where the buyer is redirected upon payment verification. (Alias: `redirect`) |
| `description` | `string` | No | Short explanation or deliverable notes displayed on the checkout card. (Alias: `desc`) |
| `currency` | `string` | No | Currency code. Defaults to `"INR"`. |
| `key` | `string` | No | Optional secret passphrase to encrypt the token with 256-bit AES-GCM. (Alias: `secretKey`, `encryptionKey`) |
| `customSlug` | `string` | No | Desired URL slug for the permanent hosted link. (Alias: `slug`) |

#### Example Request
```bash
curl -X POST "https://scriptly.store/api/pay/create" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Architecture Review & Code Audit",
    "price": 1499,
    "redirectUrl": "https://cal.com/sh20raj/review",
    "description": "1-hour deep technical session",
    "key": "client_secret_pin_2026"
  }'
```

#### Example Response (`201 Created`)
```json
{
  "success": true,
  "message": "Payment link created successfully",
  "data": {
    "id": "pl_df9f97befbcc43ed",
    "slug": "architecture-review-c24ce5",
    "url": "https://scriptly.store/pay/architecture-review-c24ce5",
    "encodedUrl": "https://scriptly.store/pay?data=k1.2b57...3dfa",
    "unlockedUrl": "https://scriptly.store/pay?data=k1.2b57...3dfa&key=client_secret_pin_2026",
    "dynamicUrl": "https://scriptly.store/pay?title=Architecture+Review&price=1499&redirect=https%3A%2F%2Fcal.com%2Fsh20raj%2Freview",
    "token": "k1.2b57...3dfa",
    "isEncryptedWithKey": true,
    "title": "Architecture Review & Code Audit",
    "price": 1499,
    "currency": "INR",
    "redirectUrl": "https://cal.com/sh20raj/review",
    "createdAt": "2026-09-17T06:55:32.356Z"
  }
}
```

---

### `GET /api/pay/create`
Quick-link generation via query parameters. Can immediately redirect to the checkout or return JSON.

#### Query Parameters
- `title` (Required): Title of item
- `price` (Required): Price in INR
- `redirect` (Required): Post-payment redirect URL
- `key` (Optional): Encryption key
- `format` (Optional): Set to `"json"` to receive JSON response instead of an immediate HTTP redirect.
- `save` (Optional): Set to `"true"` to generate a permanent record in the database.

#### Example
```text
https://scriptly.store/api/pay/create?title=Consultation&price=999&redirect=https%3A%2F%2Fexample.com%2Fthanks&format=json
```

---

## 2. Protected Asset Download API

### `GET /api/download/[productId]`
Streams private product ZIP packages from local storage to verified buyers.

#### Headers
Session cookie (`__Secure-hexclave.session` or Bearer token).

#### Behavior
1. Validates user authentication.
2. Queries the `orders` table to ensure the user has completed a purchase for `productId`.
3. If valid, streams `/uploads/{productId}.zip` with `Content-Type: application/zip` and `Content-Disposition: attachment`.
4. If invalid, returns `403 Forbidden`.
5. If file is missing, returns `404 Not Found`.

---

## 3. Coupon Validation API

### `POST /api/coupons/validate`
Validates promotional discount codes during cart checkout.

#### Request Body
```json
{
  "code": "LAUNCH20",
  "totalAmount": 199900
}
```

#### Response
```json
{
  "valid": true,
  "discountPaise": 39980,
  "finalTotal": 159920,
  "discountType": "percentage",
  "discountValue": 20
}
```

---

## 4. Razorpay Webhooks

### `POST /api/webhooks/razorpay`
Listens for asynchronous payment fulfillment events sent by Razorpay.

#### Verification
- Reads `x-razorpay-signature` request header.
- Compares against HMAC-SHA256 of the raw body and `RAZORPAY_WEBHOOK_SECRET` using `crypto.timingSafeEqual`.

#### Handled Events
- `payment.captured`: Updates order status to `completed`, records payment ID, and credits the creator's ledger.
- `order.paid`: Confirms order processing.
