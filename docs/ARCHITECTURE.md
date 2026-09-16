# ScriptlyStore — Technical Architecture Document

## 1. Current Architecture Overview

ScriptlyStore is a full-stack digital product marketplace built on Next.js 16 (App Router), React 19, Drizzle ORM, Neon PostgreSQL, Hexclave authentication, Razorpay payments, and deployed to Cloudflare Workers via OpenNext.

### 1.1 App Router Structure & Rendering Model
- **Monolithic Root Layout**: `src/app/layout.tsx` previously coupled navigation, cart, referral tracking, payment SDK, analytics, and fonts into every single page.
- **Dynamic De-optimization**: Reading `x-pathname` from `await headers()` in the root layout caused Next.js to de-optimize static rendering across the entire application.
- **Client/Server Boundary**: The homepage (`/`) and several marketplace surfaces relied heavily on `"use client"` wrappers (`ClientHome.tsx`), fetching data via client `useEffect` hooks instead of streaming server components.

### 1.2 Data Access & Domain Model
- **ORM**: Drizzle ORM interacting with a Neon serverless PostgreSQL database.
- **Schema**: Single `src/db/schema.ts` defining `users`, `categories`, `subcategories`, `products`, `orders`, `downloads`, `coupons`, `payouts`, `reviews`, `affiliateProfiles`, `affiliateReferrals`, and `affiliateCommissions`.
- **Mutations**: Server actions in `src/lib/actions/` handling order creation, payment verification, product CRUD, and creator settings.

### 1.3 Key Flows
1. **Authentication**: Powered by `@hexclave/next`. User session verified server-side with `hexclave.getUser()`. Users synchronized to local `users` table via `getOrCreateDbUser()`.
2. **Order & Checkout**:
   - Order initiated via `createRazorpayOrderAction` in `src/lib/actions/orders.ts`.
   - Prices calculated and coupons/promotions validated.
   - Razorpay order created via API or mock keys for local development.
   - Splits computed for creator (95% direct, 65% affiliate) and platform (5%).
3. **Downloads**:
   - Protected endpoint at `/api/download/[productId]`.
   - Validates user entitlement against completed order history or admin role.

---

## 2. Identified Issues & Severity Classification

| Issue ID | Severity | Location | Problem | Impact | Solution |
|---|---|---|---|---|---|
| SEC-01 | **P0 Critical** | `src/lib/actions/orders.ts` (line 411) | `if (isMockKeys \|\| !razorpaySignature)` skips signature verification when signature is omitted. | Any client could call `verifyPaymentAction` without a signature and complete an order for free. | Require signature in non-mock environments and verify with HMAC SHA256 timing-safe compare. |
| SEC-02 | **P0 Critical** | `src/app/api/webhooks/razorpay/route.ts` (line 15) | `if (signature) { ... }` skips verification if header is missing. | Allows webhook spoofing of `payment.captured` / `order.paid`. | Reject requests missing `x-razorpay-signature` with 400. Use `crypto.timingSafeEqual`. |
| PERF-01 | **P1 High** | `src/app/layout.tsx` (line 90) | `await headers()` called in root layout to read `x-pathname`. | Prevents static pre-rendering of 100% of app routes. | Decouple blog layout into `src/app/blog/layout.tsx`. Remove `headers()` from root. |
| PERF-02 | **P1 High** | `src/app/layout.tsx` (line 134) | `checkout.razorpay.com/v1/checkout.js` loaded globally. | Bloats initial JS payload on marketing and documentation pages. | Lazy-load Razorpay checkout script on demand only when checkout initiates. |
| PERF-03 | **P1 High** | `src/components/ClientHome.tsx` | Entire homepage rendered client-side with 6 concurrent API calls on mount. | High LCP, skeleton layout shifts, poor SEO indexability. | Transform homepage into a Server Component passing data directly to presentational components. |
| SEO-01 | **P1 High** | `src/app/products/[slug]/page.tsx` | Hardcoded `ratingValue: 5.0` and `reviewCount: 1` in Schema JSON-LD when no ratings exist. | Search engine penalty for deceptive structured data. | Only emit `AggregateRating` when genuine reviews exist (`ratingCount > 0`). |
| DES-01 | **P2 Medium** | `src/app/globals.css`, `DESIGN.md` | Duolingo gamified styling (3D card drops, pastel colors, thick roundings). | Mismatch with premium developer marketplace positioning. | Implement clean, minimal, technical design system (neutral slate, 1px borders, Inter typography). |
| ARCH-01 | **P2 Medium** | Multiple files | Commission percentages and business constants duplicated in UI and actions. | Risk of inconsistent financial calculations. | Centralize canonical constants in `src/config/pricing.ts` and `src/config/site.ts`. |

---

## 3. Target Architecture

The refactored architecture establishes clear domain boundaries, server-first data fetching, and minimal client boundaries:

```text
src/
├── app/
│   ├── (marketing)/          # Clean landing, pricing, trust, about pages
│   ├── (marketplace)/        # Product exploration, search, categories
│   ├── (checkout)/           # Cart, checkout flow, success confirmation
│   ├── (dashboard)/          # User account, creator studio, affiliate console
│   ├── (admin)/              # Operations, moderation, approvals, payouts
│   ├── blog/                 # Editorial blog with isolated layout
│   ├── api/                  # Secure REST endpoints & webhooks
│   ├── layout.tsx            # Global lean layout (no header blocking)
│   └── globals.css           # Minimal technical design tokens
├── components/
│   ├── ui/                   # Restrained primitives (Button, Card, Input, Badge)
│   ├── layout/               # Navigation, Footer, MobileDrawer
│   ├── marketplace/          # ProductCard, FilterBar, PriceDisplay
│   └── product/              # ProductHero, TechStack, Overview, Inclusions
├── config/
│   ├── site.ts               # Canonical site metadata & URLs
│   ├── pricing.ts            # Canonical commission splits & fee logic
│   └── navigation.ts         # Centralized navigation structure
├── features/
│   ├── licenses/             # License tier definitions, rules, and labels
│   ├── products/             # Queries, mutations, and domain models
│   └── checkout/             # Payment verification and order lifecycle
├── lib/
│   ├── auth-utils.ts         # User auth & role verification
│   ├── price-utils.ts        # Discount and promo calculations
│   └── payments/
│       └── razorpay-loader.ts# On-demand payment script loader
└── db/
    ├── schema.ts             # Drizzle PostgreSQL schema
    └── index.ts              # Neon client instance
```

---

## 4. Key Architectural Guarantees

1. **Server-First by Default**: Every route renders on the server. Interactive elements (cart drawer, search input, media tab switcher) are isolated leaf components.
2. **Deterministic Pricing**: Price calculations, discounts, coupons, and add-on pricing are validated server-side in `orders.ts` prior to order creation.
3. **Cryptographic Security**: Razorpay signatures and webhook HMACs are rigorously validated with timing-safe comparisons.
4. **Honest Trust Signals**: Structured data, ratings, review counts, and licensing terms accurately reflect verified platform data.
