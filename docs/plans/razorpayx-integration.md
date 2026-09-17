# ⚡ RazorpayX Payouts Integration Plan

This document outlines the detailed plan to integrate automated payouts using the **RazorpayX Payouts API** instead of PayPal. It details how the platform collects creator settlement data, validates account numbers, and triggers transfers dynamically.

---

## 🔑 Environment Variables Audit

To perform payouts using RazorpayX, your current `.env` configuration is **insufficient**. Standard Razorpay Payment Gateway keys (`rzp_live_SZNnNhNGGFQlep`) cannot perform payouts on their own without additional parameters.

### Current `.env` Status:
- `RAZORPAY_KEY_ID=rzp_live_...` (Configured for customer checkout)
- `RAZORPAY_KEY_SECRET=...` (Configured for customer checkout)
- 🚫 **Missing**: `RAZORPAYX_ACCOUNT_NUMBER` (Required to specify the source funding account)
- 🚫 **Missing**: Dedicated RazorpayX API Keys (Highly recommended for payout transaction isolation)

### Actions Required:
You must add the following variables to your environment variables (`.env` locally, and secrets on Cloudflare):

```env
# The source bank account from which payout funds are debited
RAZORPAYX_ACCOUNT_NUMBER=7878780080316316

# RazorpayX API credentials (generate inside https://x.razorpay.com Developer Controls)
RAZORPAYX_KEY_ID=rzpx_live_...
RAZORPAYX_KEY_SECRET=...
```

---

## 🛠️ Step-by-Step Implementation Plan

### Step 1: Database Schema Updates
We need to adjust the creator payout preferences structure inside the database schema to record RazorpayX fund destinations (bank account details or UPI ID).

Modify `src/db/schema.ts` to include:
- `users` table:
  - `payoutMethod`: `text` (options: `"upi"`, `"bank"`)
  - `payoutDetails`: `text` (UPI ID or Bank Account + IFSC string)
  - `razorpayXContactId`: `text` (stores the created RazorpayX Contact ID)
  - `razorpayXFundAccountId`: `text` (stores the created Fund Account ID)

---

### Step 2: Onboarding Creators (Creating Contacts & Fund Accounts)
When a creator saves their payout details inside their Creator Console:
1.  **Create Contact**: Call the RazorpayX Contacts API.
2.  **Create Fund Account**: Call the RazorpayX Fund Accounts API linking the contact.
3.  **Store IDs**: Save the `razorpayXContactId` and `razorpayXFundAccountId` into their `users` record.

#### API: Create a Contact (`POST /v1/contacts`)
```bash
curl -X POST https://api.razorpay.com/v1/contacts \
  -u <RAZORPAYX_KEY_ID>:<RAZORPAYX_KEY_SECRET> \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Creator Store Name",
    "email": "creator@email.com",
    "type": "vendor",
    "reference_id": "creator_user_id_123"
  }'
```

#### API: Create a Fund Account (`POST /v1/fund_accounts`)
- **For Bank Transfers**:
```bash
curl -X POST https://api.razorpay.com/v1/fund_accounts \
  -u <RAZORPAYX_KEY_ID>:<RAZORPAYX_KEY_SECRET> \
  -H "Content-Type: application/json" \
  -d '{
    "contact_id": "cont_Fsh82sJhd",
    "account_type": "bank_account",
    "bank_account": {
      "name": "Creator Full Name",
      "ifsc": "SBIN0001234",
      "account_number": "1234567890"
    }
  }'
```
- **For UPI**:
```bash
curl -X POST https://api.razorpay.com/v1/fund_accounts \
  -u <RAZORPAYX_KEY_ID>:<RAZORPAYX_KEY_SECRET> \
  -H "Content-Type: application/json" \
  -d '{
    "contact_id": "cont_Fsh82sJhd",
    "account_type": "vpa",
    "vpa": {
      "address": "creator@upi"
    }
  }'
```

---

### Step 3: Triggering Automated Payouts
Trigger payouts asynchronously. This can be run weekly using a Cloudflare Cron Trigger or initiated inside the Admin Console when clicking "Record Payout".

#### API Request: Create Payout (`POST /v1/payouts`)
To process a transfer, call the Payouts endpoint. An idempotency key must be provided in the header to guarantee duplicate protection:

```typescript
import fetch from "node-fetch";

export async function processRazorpayXPayout({
  userId,
  amountInPaise,
  referenceId,
}: {
  userId: string;
  amountInPaise: number;
  referenceId: string;
}) {
  const creator = await db.query.users.findFirst({ where: eq(users.id, userId) });
  if (!creator?.razorpayXFundAccountId) {
    throw new Error("Creator has not completed payout registration.");
  }

  const payload = {
    account_number: process.env.RAZORPAYX_ACCOUNT_NUMBER!, // Platform source account
    fund_account_id: creator.razorpayXFundAccountId,       // Creator destination account
    amount: amountInPaise,                                 // Payout amount in INR paise
    currency: "INR",
    mode: creator.payoutMethod === "upi" ? "UPI" : "IMPS",
    purpose: "payout",
    reference_id: referenceId,
    narration: "ScriptlyStore Payout",
  };

  const auth = Buffer.from(
    `${process.env.RAZORPAYX_KEY_ID}:${process.env.RAZORPAYX_KEY_SECRET}`
  ).toString("base64");

  const response = await fetch("https://api.razorpay.com/v1/payouts", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
      "X-Payout-Idempotency": `idem_${referenceId}`, // Prevent duplicate payments
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json() as any;

  if (data.id) {
    // Log the payouts transaction in database
    await db.insert(payouts).values({
      id: crypto.randomUUID(),
      userId,
      amount: Math.round(amountInPaise / 95), // Convert to USD cents base
      payoutMethod: creator.payoutMethod,
      payoutDetails: creator.payoutDetails,
      status: data.status === "processing" || data.status === "processed" ? "processed" : "pending",
    });
    return { success: true, payoutId: data.id };
  }

  throw new Error(data.error?.description || "RazorpayX Payout failed.");
}
```

---

## 🔔 Phase 2 Execution Plan Checklist
1.  [ ] Add `RAZORPAYX_ACCOUNT_NUMBER`, `RAZORPAYX_KEY_ID`, and `RAZORPAYX_KEY_SECRET` variables to Cloudflare worker settings and local `.env`.
2.  [ ] Update `users` schema with `razorpayXContactId` and `razorpayXFundAccountId`.
3.  [ ] Upgrade `updateCreatorPayoutSettingsAction` server action to register contacts & fund accounts at RazorpayX when the creator updates settings.
4.  [ ] Modify the "Record Payout" action on `/admin/payouts` to invoke `processRazorpayXPayout` instead of logging manual edits.
