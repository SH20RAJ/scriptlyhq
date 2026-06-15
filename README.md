# 🚀 ScriptlyHQ - The Ultimate Developer Script & SaaS Boilerplate Marketplace

ScriptlyHQ is a highly-optimized, premium, and ready-to-deploy digital marketplace built for developers, indie hackers, and creators to sell code scripts, Next.js boilerplates, Chrome extensions, scraping tools, and AI prompts. 

With **ScriptlyHQ**, developers can launch their own automated storefront, list digital assets, and keep **95% of all gross sales** (platform charges a flat 5% fee).

---

## 🔥 Key Marketing & Virality Pillars
- **Creator-First Split (95/5)**: Creators keep 95% of their gross earnings, bypassing high-commission alternative marketplaces (e.g. Envato/Gumroad).
- **SEO & Google Discover Optimized**: Native support for SEO titles, meta descriptions, image lazy loading, and schema layouts to rank your digital assets high on search engines.
- **Bypassed Free Checkout**: Products configured as "Free" skip Razorpay gateways entirely, allowing users to claim downloads with a single click—maximizing lead generation virality.
- **Store Naming & Storefronts**: Creators can register custom store names to brand their catalogs.
- **Creator Coupons**: Support for custom, store-wide discount codes applied dynamically.

---

## 🛠️ Premium Tech Stack

- **Framework**: Next.js 16+ (using App Router and Turbopack compiler)
- **Database ORM**: Drizzle ORM
- **Database Provider**: Neon serverless PostgreSQL
- **Security & User Management**: `@hexclave/next` (Hexclave auth infrastructure)
- **Payment Processor**: Razorpay global checkout integration (bypassed automatically for $0 free purchases)
- **Deployment Platform**: Cloudflare Workers (using `@opennextjs/cloudflare`)

---

## 📂 Architecture Overview

```text
scriptlyhq/
├── src/
│   ├── app/
│   │   ├── admin/             # Admin console (approvals, stores, coupons, payouts ledger, orders)
│   │   │   └── payouts/       # Payout settlement logging and balances tracking
│   │   ├── dashboard/         # Customer purchase inventory & download center
│   │   │   └── creator/       # Creator console (earnings metrics, coupons editor, settings)
│   │   ├── terms/             # Guidelines for creator store names & payouts
│   │   ├── dmca/              # Copyright takedown policy page
│   │   └── products/          # Product details page (checkout, active discount countdown banners)
│   ├── components/            # Reusable UI components (PayoutSettingsEditor, ProductForm, SearchFilter)
│   ├── db/
│   │   ├── index.ts           # Drizzle client database connection
│   │   └── schema.ts          # Postgres schema tables (users, products, coupons, orders, payouts)
│   └── lib/
│       └── actions/           # Next.js Server Actions (orders, products, creator settings, payouts)
```

---

## ⚙️ Setting Up Locally

### 1. Pre-requisites
Ensure you have [Bun](https://bun.sh) installed.

### 2. Environment Configurations
Create a `.env` file in the project root:

```env
# Hexclave Authentication Keys
NEXT_PUBLIC_HEXCLAVE_PROJECT_ID=25eb3b80-274f-4c41-b4d0-79d11070e070
NEXT_PUBLIC_HEXCLAVE_PUBLISHABLE_CLIENT_KEY=pck_qfzm0sgb5rz8eh4eypns6wvf0v13815zkksazh6518zgg
HEXCLAVE_SECRET_SERVER_KEY=ssk_50ze9a4w0waw3g3j8aze2mm0tnf6vnwq3xgj4a4266sa0

# Database URL (Neon PostgreSQL)
DATABASE_URL=postgresql://neondb_owner:npg_Jm8eVuf9QLZq@ep-snowy-waterfall-aolziam1-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# Razorpay Keys
RAZORPAY_KEY_ID=rzp_test_mockkeyid123
RAZORPAY_KEY_SECRET=rzp_test_mocksecret123
RAZORPAY_WEBHOOK_SECRET=rzp_test_mockwebhooksecret123

# Admin Emails (Comma-separated)
ADMIN_EMAILS=shaswatraj@gmail.com,admin@scriptly.store
```

### 3. Sync Database Schemas
Drizzle Kit is pre-configured. Sync local schemas to your Neon Database instance:
```bash
bun x drizzle-kit push
```

### 4. Seed and Launch
Run the development server:
```bash
bun run dev
```
*Note: Categories and 22 premium digital products alongside promotional discount coupons are automatically seeded on the first page load.*

---

## ⚡ Deployment to Cloudflare Workers

We utilize `@opennextjs/cloudflare` to run Next.js edge-rendered on Cloudflare:
```bash
bun run deploy
```
This command compiles static files, bundles edge worker route handlers, uploads assets, and deploys changes to your Cloudflare custom domains.
