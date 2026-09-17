# ScriptlyStore — Security, Cryptography & Entitlement Architecture

This document defines ScriptlyStore's security architecture, cryptographic implementations, and digital asset protection policies.

---

## 1. Cryptographic Security & Signature Verification

### 1.1 Razorpay Payment Signature Verification
Every order payment callback and webhook must be verified using HMAC-SHA256 to prevent unauthorized order completion.

```ts
import crypto from "crypto";

export function verifyPaymentSignature(params: {
  orderId: string;
  paymentId: string;
  signature: string;
  secret: string;
}): boolean {
  const generatedSignature = crypto
    .createHmac("sha256", params.secret)
    .update(`${params.orderId}|${params.paymentId}`)
    .digest("hex");

  const generatedBuffer = Buffer.from(generatedSignature);
  const receivedBuffer = Buffer.from(params.signature);

  if (generatedBuffer.length !== receivedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(generatedBuffer, receivedBuffer);
}
```
- **Timing-Safe Comparison**: `crypto.timingSafeEqual` prevents timing side-channel attacks by taking identical execution time regardless of where a character mismatch occurs.

---

## 2. Dynamic Payment Link Security & Key Encryption

### 2.1 Tamper-Proof HMAC Signatures
When creating Base64 payment tokens, the parameters are signed using HMAC-SHA256:
- Message: `${title.trim()}|${Number(price)}|${redirectUrl.trim()}`
- If a malicious buyer alters `price` from `1499` to `1` in the Base64 token, signature validation fails and checkout is blocked.

### 2.2 256-bit AES-GCM Key-Based Encryption
For private transactions, checkout payloads can be encrypted using a secret key/passphrase:
- **Algorithm**: `aes-256-gcm` (Authenticated Encryption with Associated Data).
- **Key Derivation**: SHA-256 hash of the user-provided key produces a 32-byte symmetric key.
- **Initialization Vector**: 12 random bytes generated per encryption via `crypto.randomBytes(12)`.
- **Token Structure**: `k1.<iv_hex>.<authTag_hex>.<ciphertext_hex>`
- **Decryption Enforcement**: If the provided key fails GCM auth tag verification, deciphering immediately aborts, preventing ciphertext manipulation.

---

## 3. Digital Asset Protection & Private File Storage

### 3.1 Local Vault Isolation (`/uploads`)
- All product ZIP packages are stored in `/uploads/{productId}.zip` on the root filesystem.
- The `/uploads` directory is excluded from public static asset serving.

### 3.2 Entitlement Verification (`/api/download/[productId]`)
Downloads are strictly gated by the following verification pipeline:
1. Extract authenticated user session via `getOrCreateDbUser()`.
2. Sanitize `productId` by taking only the alphanumeric basename, preventing directory traversal attacks (`../`).
3. Query the `orders` table in Neon PostgreSQL:
   ```ts
   const [entitledOrder] = await db
     .select()
     .from(orders)
     .where(
       and(
         eq(orders.userId, user.id),
         eq(orders.productId, cleanProductId),
         eq(orders.status, "completed")
       )
     );
   ```
4. If no completed order exists (and user is not an authorized administrator), return `403 Forbidden`.
5. Stream file with secure headers:
   ```http
   Content-Type: application/zip
   Content-Disposition: attachment; filename="product.zip"
   Cache-Control: private, no-cache, no-store
   ```

---

## 4. Authentication & Role-Based Access Control

- **Hexclave Infrastructure**: Authentication sessions are managed using encrypted HTTP-only cookies with `SameSite=Lax` and `Secure` attributes.
- **Admin Verification**: Administrative routes (`/admin/*`) verify that the authenticated user's email is present in the `ADMIN_EMAILS` server-side environment variable. Unauthorized users are immediately redirected away.
