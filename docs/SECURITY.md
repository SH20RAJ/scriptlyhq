# ScriptlyStore — Security Architecture & Guidelines

## 1. Authentication & Role Enforcement

- **Provider**: Hexclave authentication infrastructure (`@hexclave/next`).
- **Server Verification**: Session verification using `hexclave.getUser()`. Never rely on client-reported user identity.
- **Admin Authorization**: Verified server-side via `isAdmin()` in `src/lib/auth-utils.ts`, validating against the `ADMIN_EMAILS` environment configuration and database `role` column.

---

## 2. Payment & Order Security

### 2.1 Server Action Signature Verification
- In production (`!isMockKeys`), `verifyPaymentAction` strictly requires `razorpayPaymentId`, `razorpayOrderId`, and `razorpaySignature`.
- Signatures are verified using HMAC SHA-256:
  ```ts
  const text = `${razorpayOrderId}|${razorpayPaymentId}`;
  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(text)
    .digest("hex");

  const isValid = crypto.timingSafeEqual(
    Buffer.from(generatedSignature),
    Buffer.from(razorpaySignature)
  );
  ```
- Any order without a verified signature or matching record is rejected with an error.

### 2.2 Webhook Security
- Endpoint: `/api/webhooks/razorpay`
- All incoming requests MUST include `x-razorpay-signature`.
- Signature is verified against the raw request body string using `RAZORPAY_WEBHOOK_SECRET` and timing-safe comparison.
- Processing is idempotent: order status is verified before triggering split disbursements or notifications.

---

## 3. Product Download Protection

- Protected Endpoint: `/api/download/[productId]`
- **Entitlement Verification**:
  1. Authenticate user session.
  2. Query database for completed order (`status = "completed"`) matching `(userId, productId)`.
  3. Allow access if user is verified purchaser or platform administrator.
- **Path Traversal Prevention**: Local relative paths are strictly sanitized to prevent directory traversal (`..` attacks).
- **Safe Delivery**: Response includes `Content-Disposition: attachment; filename="..."` and validated MIME types.
- **Download Event Logging**: Every download writes an audit log entry in the `downloads` table.
