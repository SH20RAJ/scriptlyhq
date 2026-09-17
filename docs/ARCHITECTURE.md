# ScriptlyStore — Comprehensive System Architecture

## 1. Architectural Philosophy

ScriptlyStore is engineered as an edge-rendered, high-performance developer commerce platform. It is built to serve millions of products, handle programmatic checkouts with sub-millisecond response times, and run globally on Cloudflare's edge infrastructure.

```mermaid
graph TD
    Client["Browser / Developer Client"]
    CF["Cloudflare Worker (OpenNext)"]
    Neon[("Neon PostgreSQL Serverless")]
    Hexclave["Hexclave Auth Service"]
    Razorpay["Razorpay Payments"]
    Uploads[("Private File Storage (/uploads)")]

    Client -->|HTTP Request| CF
    CF -->|Session Validation| Hexclave
    CF -->|Drizzle SQL Pushdown| Neon
    CF -->|Order Creation & Verify| Razorpay
    CF -->|Stream Download (Entitled)| Uploads
```

---

## 2. Technology Stack & Subsystems

### 2.1 Framework & Edge Runtime
- **Next.js 16.2+ (Turbopack, App Router)**: Provides React 19 Server Components, streaming SSR, and Server Actions.
- **OpenNext for Cloudflare (`@opennextjs/cloudflare`)**: Converts Next.js App Router outputs into high-performance Cloudflare Worker edge functions, deploying static assets to Cloudflare Assets.

### 2.2 Database Layer & Query Pushdown
- **Neon PostgreSQL**: Serverless Postgres instance with connection pooling.
- **Drizzle ORM (`drizzle-orm`)**: Lightweight TypeScript ORM.
- **Scalability Rule**: In-memory JavaScript filtering is strictly prohibited. All queries must push filtering (`ilike`, `eq`, `and`), sorting (`desc`, `asc`), pagination (`limit`, `offset`), and record counting (`sql<number>count(*)`) directly to PostgreSQL.

### 2.3 User Infrastructure & Access Control
- **Hexclave (`@hexclave/next`)**: Manages passwordless authentication, multi-factor authentication, active sessions, and developer profile data.
- **Role Control**: Admin privileges are enforced server-side by matching active session emails against the `ADMIN_EMAILS` environment variable.

### 2.4 Payments & Commerce Engine
- **Razorpay SDK**: Handles unified UPI, cards, net banking, and international payments.
- **Dynamic Checkouts (`/pay`)**: Standalone checkout pages supporting URL-safe Base64 encoding, tamper-proof HMAC signatures, and optional 256-bit AES key-based encryption.
- **95/5 Creator Split**: Direct marketplace sales allocate 95% of gross volume to the creator's ledger and 5% to the platform.

### 2.5 Private Digital Asset Storage
- **Local Private Vault**: Product ZIP archives are stored in `/uploads/{productId}.zip`.
- **Protected Delivery Route**: `/api/download/[productId]` validates completed purchase records in the database before streaming file bytes with secure download headers.

---

## 3. Directory Layout & Module Responsibilities

```text
src/
├── app/
│   ├── (creator)/                 # Creator onboarding, studio, ledger, payouts
│   ├── admin/                     # Moderation, products, payment links, prompt docs
│   ├── api/                       # Secured REST APIs and webhooks
│   ├── dashboard/                 # Customer purchased products and receipts
│   ├── docs/                      # Public API documentation
│   ├── explore/                   # Scalable multi-level category directories
│   ├── handler/                   # Hexclave user auth and account settings
│   ├── pay/                       # Dynamic & encrypted checkout pages
│   └── products/                  # High-converting product detail pages
├── components/
│   ├── admin/                     # Admin management interfaces
│   ├── pay/                       # PaymentCard and KeyUnlockCard
│   └── ui/                        # Unified UI tokens & centralized skeletons
├── db/
│   ├── index.ts                   # Neon PostgreSQL Drizzle connection
│   └── schema.ts                  # Database schemas (products, orders, links, etc.)
└── lib/
    ├── actions/                   # Server Actions for mutations
    ├── auth-utils.ts              # Session and role verification
    └── payments/
        └── link-encoder.ts        # Base64 and AES-256-GCM token encoder
```

---

## 4. Key Request Flows

### 4.1 Scalable Product Exploration Flow
1. User requests `/explore/saas-templates/nextjs?page=2&sort=price_asc`.
2. Next.js extracts route parameters (`category: "saas-templates"`, `subcategory: "nextjs"`) and query parameters.
3. Server invokes `getProductsAction` in `src/lib/actions/products.ts`.
4. Drizzle executes a single paginated SQL query with `LIMIT 12 OFFSET 12` and a parallel `COUNT(*)` query.
5. Server Component renders products and pagination controls with zero client-side layout shifts.

### 4.2 Dynamic Payment Link Checkout Flow
1. User arrives at `/pay?data=k1.iv.tag.ciphertext&key=secretKey`.
2. Server calls `decodePaymentLinkPayload` in `src/lib/payments/link-encoder.ts`.
3. If token is encrypted and key matches, payload decrypts into `{ title, price, redirectUrl, currency }`.
4. If token is encrypted and key is omitted, server renders `KeyUnlockCard` prompting buyer for the passphrase.
5. Buyer completes payment via Razorpay.
6. Server verifies HMAC payment signature and immediately redirects buyer to `redirectUrl`.
