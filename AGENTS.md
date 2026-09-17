# ScriptlyHQ — Coding Agent Guidelines & Architecture Rules

This document outlines mandatory architectural patterns, security requirements, database standards, and coding conventions for AI agents and human contributors working inside the `SH20RAJ/scriptlyhq` codebase.

---

## 1. Stack & System Architecture

| Component | Technology | Canonical Entrypoint |
|---|---|---|
| **Runtime & Bundler** | Next.js 16+ (Turbopack, App Router) | [package.json](file:///Users/shaswatraj/Desktop/earn/scriptlyhq/package.json) |
| **Edge Deployment** | OpenNext Cloudflare Worker | [open-next.config.ts](file:///Users/shaswatraj/Desktop/earn/scriptlyhq/open-next.config.ts), [wrangler.jsonc](file:///Users/shaswatraj/Desktop/earn/scriptlyhq/wrangler.jsonc) |
| **Database ORM** | Drizzle ORM | [schema.ts](file:///Users/shaswatraj/Desktop/earn/scriptlyhq/src/db/schema.ts), [index.ts](file:///Users/shaswatraj/Desktop/earn/scriptlyhq/src/db/index.ts) |
| **Database Instance** | Neon Serverless PostgreSQL | `DATABASE_URL` (.env / .dev.vars) |
| **Authentication** | Hexclave User Infrastructure (`@hexclave/next`) | [hexclave.ts](file:///Users/shaswatraj/Desktop/earn/scriptlyhq/src/lib/hexclave.ts), [auth-utils.ts](file:///Users/shaswatraj/Desktop/earn/scriptlyhq/src/lib/auth-utils.ts) |
| **Payments** | Razorpay Global Checkout & Webhooks | [orders.ts](file:///Users/shaswatraj/Desktop/earn/scriptlyhq/src/lib/actions/orders.ts), [link-encoder.ts](file:///Users/shaswatraj/Desktop/earn/scriptlyhq/src/lib/payments/link-encoder.ts) |
| **UI Styling** | Tailwind CSS + Duolingo Minimal Design System | [globals.css](file:///Users/shaswatraj/Desktop/earn/scriptlyhq/src/app/globals.css), [skeleton.tsx](file:///Users/shaswatraj/Desktop/earn/scriptlyhq/src/components/ui/skeleton.tsx) |

---

## 2. Core Development Rules

### Rule 1: Database Pushdown for High Scalability
- **Never fetch entire tables into memory** using JavaScript `.filter()`, `.sort()`, or `.slice()`.
- **Always execute filtering, sorting, pagination, and counts directly in SQL** using Drizzle ORM:
  ```ts
  // Correct pattern in src/lib/actions/products.ts
  const [items, totalResult] = await Promise.all([
    db.select().from(products)
      .where(and(...conditions))
      .orderBy(sortExpr)
      .limit(limit)
      .offset(offset),
    db.select({ count: sql<number>`count(*)` })
      .from(products)
      .where(and(...conditions)),
  ]);
  ```
- Use nested category routes for scalable directory hubs:
  - `/explore` (Universal catalog with query filters)
  - `/explore/[category]` (Dedicated category hub with subcategories)
  - `/explore/[category]/[subcategory]` (Targeted subcategory directory)

### Rule 2: Currency & Pricing Standardization
- All user-facing prices are standardized in **Indian Rupee (₹ / INR)**.
- Monetary values are stored in the database as **integers in paise** (e.g. ₹499 is stored as `49900`).
- Display prices using `Intl.NumberFormat`:
  ```ts
  export const formatINR = (amountInRupees: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amountInRupees);
  ```

### Rule 3: Authentication & Protected User Sessions
- Use [auth-utils.ts](file:///Users/shaswatraj/Desktop/earn/scriptlyhq/src/lib/auth-utils.ts) for retrieving database users:
  - `getOrCreateDbUser()`: Verifies Hexclave session and syncs or retrieves the Neon database user record.
  - `isAdmin()`: Validates whether the active session user email matches `ADMIN_EMAILS`.
- Client-side auth UI is powered by `@hexclave/next`: `<UserButton />`, `useUser()`.

### Rule 4: Digital Asset Security & Private Storage
- Digital product ZIP archives are stored securely on the local filesystem under `/uploads` in the project root.
- Files under `/uploads` must **never** be served as static public assets.
- Downloads are served exclusively through the authenticated entitlement route:
  - Route: `/api/download/[productId]`
  - Validates completed purchase ownership in the `orders` table before streaming file bytes.

### Rule 5: Dynamic & Key-Encrypted Payment Links
- Public dynamic checkout: `/pay`
- Token encoder: [link-encoder.ts](file:///Users/shaswatraj/Desktop/earn/scriptlyhq/src/lib/payments/link-encoder.ts)
  - Supports URL-safe Base64 JSON schema (`title`, `price`, `redirectUrl`, `description`, `currency`, `sig`).
  - Supports optional 256-bit AES-GCM symmetric key encryption (`k1.<iv>.<tag>.<ciphertext>`).
  - When accessing encrypted links without a key in query params, `/pay` presents [KeyUnlockCard.tsx](file:///Users/shaswatraj/Desktop/earn/scriptlyhq/src/components/pay/KeyUnlockCard.tsx).
  - Pre-unlocked links can pass `&key=YOUR_KEY` to bypass the prompt.

### Rule 6: Minimal, Cohesive UI & Centralized Skeletons
- UI should follow a **clean, minimal, premium Duolingo aesthetic**: friendly typography, 1px subtle borders (`border-border/40`), tactile action buttons with 3px/4px press shadows, and zero boxy nested borders.
- Every route with server-side data loading must have a dedicated `loading.tsx` powered by [skeleton.tsx](file:///Users/shaswatraj/Desktop/earn/scriptlyhq/src/components/ui/skeleton.tsx) with token classes: `bg-muted/40 dark:bg-muted/30`.

### Rule 7: Cloudflare Deployment & OpenNext
- Production builds run via `@opennextjs/cloudflare`.
- Build & Deploy command: `bun run deploy`.
- Cloudflare environment bindings and variables are configured in `.dev.vars` and `wrangler.jsonc`.
- Avoid Node.js-only native packages that cannot run on Cloudflare Workers / workerd edge runtime unless polyfilled or shimmed by OpenNext.
