# 🚀 ScriptlyStore — The Premium Developer Commerce Marketplace

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-16.2.6%20(Turbopack)-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Cloudflare](https://img.shields.io/badge/Cloudflare%20Workers-OpenNext-F38020?style=for-the-badge&logo=cloudflare)](https://workers.cloudflare.com/)
[![Neon](https://img.shields.io/badge/Neon-PostgreSQL%20Serverless-00E599?style=for-the-badge&logo=postgresql)](https://neon.tech/)
[![Drizzle](https://img.shields.io/badge/Drizzle%20ORM-0.45-C5F74F?style=for-the-badge&logo=drizzle)](https://orm.drizzle.team/)
[![Hexclave](https://img.shields.io/badge/Hexclave-Auth%20Infra-4F46E5?style=for-the-badge)](https://hexclave.com/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Verified%20Payments-0C2340?style=for-the-badge&logo=razorpay)](https://razorpay.com/)
[![Tip & Sponsor](https://img.shields.io/badge/Tip%20%26%20Sponsor-Razorpay-0C2340?style=for-the-badge&logo=razorpay)](https://razorpay.me/@iamsh)
[![Bun](https://img.shields.io/badge/Bun-1.1+-fbf0df?style=for-the-badge&logo=bun)](https://bun.sh/)

**High-performance developer marketplace for production-ready SaaS templates, automation scripts, boilerplates, and developer tools.**

[Live Marketplace: scriptly.store](https://scriptly.store) • [Public API Docs](https://scriptly.store/docs/api/payment-links) • [Explore Products](https://scriptly.store/explore) • [Creator Studio](https://scriptly.store/creator) • [Tip & Sponsor](https://razorpay.me/@iamsh)

</div>

---

## 🌟 Overview

**ScriptlyStore** is an open, edge-rendered developer marketplace where engineers, indie hackers, and creators buy and sell production code, boilerplates, automation scripts, and digital assets.

Unlike traditional legacy marketplaces that claim 30% to 50% commission cuts, Scriptly operates on a **95/5 creator-first economic model**: creators keep **95% of their gross sales**, while Scriptly retains a minimal 5% platform fee.

### 🔑 Key Capabilities

1. **⚡ Scalable Directory Engine (`/explore`)**:
   - Pure SQL database pushdown via Drizzle ORM. Millions of catalog items can be searched, filtered, and paginated in sub-millisecond response times.
   - Nested directory routes for deep indexing and SEO:
     - `/explore` (Universal catalog with query filters)
     - `/explore/[category]` (Dedicated category hub, e.g. `/explore/saas-templates`)
     - `/explore/[category]/[subcategory]` (Deep subcategory directory, e.g. `/explore/saas-templates/nextjs`)

2. **🔒 Dynamic & Key-Encrypted Payment Links (`/pay`)**:
   - Zero-setup payment checkout links with guaranteed post-payment redirection.
   - **Base64 JSON Schema**: Conceals parameters in URL-safe Base64 tokens.
   - **Key-Protected AES-256-GCM**: Encrypt checkouts with a private key. Buyers can enter the key interactively or unlock directly via `&key=YOUR_KEY`.
   - **Open Creator REST API**: Programmatically create hosted or dynamic links via `POST /api/pay/create`—open to logged-in and logged-out developers alike.

3. **🎨 Duolingo-Minimal Design System & Centralized Skeletons**:
   - Replaced heavy nested outlines with a clean, friendly, tactile interface.
   - Centralized loading tokens (`bg-muted/40 dark:bg-muted/30`) across every route via `@/components/ui/skeleton`.
   - Unified pricing standardized in Indian Rupee (`₹` / INR) with locale formatting.

4. **🛡️ Enterprise Digital Asset Protection**:
   - Product ZIP archives are stored securely in `/uploads` and never exposed publicly.
   - Authenticated delivery via `/api/download/[productId]` validates order completion before streaming bytes.

5. **🤖 Admin Process Prompt Docs (`/admin/prompts`)**:
   - Interactive prompt center for engineering agents and administrators.
   - Complete system prompts, JSON schemas, reference code, and edge case rules for all 6 core platform processes.

6. **💼 Creator Studio & Split Ledger (`/creator`)**:
   - Creator dashboard with real-time revenue analytics, coupon management, and payout ledger tracking.
   - Dedicated creator storefronts (`/stores/[id]`).

---

## 🏗️ Architecture & Project Structure

```text
scriptlyhq/
├── src/
│   ├── app/                               # Next.js App Router
│   │   ├── (creator)/                     # Creator landing & management studio
│   │   │   └── creator/(dashboard)/       # Products, ledger, coupons, payouts
│   │   ├── admin/                         # Admin console & operations
│   │   │   ├── payment-links/             # Permanent & dynamic link manager
│   │   │   ├── products/                  # Product catalog management & approval
│   │   │   └── prompts/                   # Process Prompt Docs center
│   │   ├── api/                           # Public & internal REST endpoints
│   │   │   ├── download/[productId]/      # Authenticated digital asset delivery
│   │   │   ├── pay/create/                # Open Payment Link creation API
│   │   │   └── webhooks/razorpay/         # Payment capture webhook handler
│   │   ├── dashboard/                     # Customer purchase inventory & receipts
│   │   ├── docs/                          # Public developer documentation
│   │   │   └── api/payment-links/         # Payment Links API guide
│   │   ├── explore/                       # Scalable explore portal
│   │   │   ├── [category]/                # Dedicated category hub
│   │   │   └── [category]/[subcategory]/  # Targeted subcategory directory
│   │   ├── handler/[...stack]/            # Hexclave authentication & account settings
│   │   ├── pay/                           # Dynamic & encrypted payment checkout
│   │   └── products/[slug]/               # High-converting product detail pages
│   ├── components/                        # React UI component library
│   │   ├── admin/                         # Admin dashboards & link managers
│   │   ├── pay/                           # Checkout cards & KeyUnlockCard
│   │   └── ui/                            # Design tokens & Skeleton components
│   ├── db/
│   │   ├── index.ts                       # Neon PostgreSQL Drizzle client
│   │   └── schema.ts                      # Database schema definitions
│   └── lib/
│       ├── actions/                       # Next.js Server Actions (products, orders)
│       ├── auth-utils.ts                  # Hexclave auth & role helpers
│       └── payments/
│           └── link-encoder.ts            # Base64 & AES-256-GCM payment link encoder
├── docs/                                  # In-depth technical documentation
│   ├── ARCHITECTURE.md                    # Detailed architectural specification
│   ├── ROUTES.md                          # Full route inventory & auth levels
│   ├── API.md                             # REST API reference
│   ├── PAYMENT-LINKS.md                   # Complete payment link guide
│   ├── DESIGN-SYSTEM.md                   # Minimal UI design tokens
│   ├── SECURITY.md                        # Security, encryption & HMAC rules
│   ├── PERFORMANCE.md                     # Scalability & query pushdown benchmarks
│   ├── SEO.md                             # Metadata, schema & indexing guide
│   └── ROADMAP.md                         # Product roadmap & feature milestones
├── open-next.config.ts                    # Cloudflare OpenNext edge configuration
├── wrangler.jsonc                         # Cloudflare Workers configuration
└── drizzle.config.ts                      # Drizzle Kit migration configuration
```

---

## 🚀 Quick Start

### 1. Prerequisites

- [Bun](https://bun.sh) (v1.1 or higher)
- [Neon PostgreSQL Database](https://neon.tech)
- [Razorpay Account](https://razorpay.com) (Test or Live API Keys)
- [Hexclave Account](https://hexclave.com) (Project ID and Keys)

### 2. Clone & Install Dependencies

```bash
git clone https://github.com/SH20RAJ/scriptlyhq.git
cd scriptlyhq
bun install
```

### 3. Configure Environment Variables

Create `.env` and `.dev.vars` files in the project root:

```env
# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://user:pass@ep-host.neon.tech/neondb?sslmode=require

# Hexclave Authentication
NEXT_PUBLIC_HEXCLAVE_PROJECT_ID=your_project_id
NEXT_PUBLIC_HEXCLAVE_PUBLISHABLE_CLIENT_KEY=your_publishable_key
HEXCLAVE_SECRET_SERVER_KEY=your_secret_server_key

# Razorpay Payments
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx

# Admin Control
ADMIN_EMAILS=shaswatraj@gmail.com,admin@scriptly.store
```

### 4. Push Database Schema

Push schemas directly to your Neon PostgreSQL instance using Drizzle Kit:

```bash
bun x drizzle-kit push
```

### 5. Start Development Server

Run the development server with Turbopack:

```bash
bun run dev
```

Visit `http://localhost:3000` in your browser.

---

## ⚡ Deployment to Cloudflare Workers

ScriptlyStore is compiled for edge execution on Cloudflare Workers using `@opennextjs/cloudflare`:

```bash
# Build and deploy to Cloudflare
bun run deploy
```

This automates:
1. Turbopack production compilation.
2. Cloudflare Worker edge function bundling.
3. Edge asset uploading and cache configuration.
4. Deployment to your custom domain (`scriptly.store`).

---

## 📚 Technical Documentation

Explore the detailed architecture guides in the [`docs/`](file:///Users/shaswatraj/Desktop/earn/scriptlyhq/docs) folder:

- [System Architecture](file:///Users/shaswatraj/Desktop/earn/scriptlyhq/docs/ARCHITECTURE.md)
- [Route Inventory & Ownership](file:///Users/shaswatraj/Desktop/earn/scriptlyhq/docs/ROUTES.md)
- [API Reference](file:///Users/shaswatraj/Desktop/earn/scriptlyhq/docs/API.md)
- [Payment Links Engine](file:///Users/shaswatraj/Desktop/earn/scriptlyhq/docs/PAYMENT-LINKS.md)
- [Security & Cryptography](file:///Users/shaswatraj/Desktop/earn/scriptlyhq/docs/SECURITY.md)
- [Design System](file:///Users/shaswatraj/Desktop/earn/scriptlyhq/docs/DESIGN-SYSTEM.md)
- [Performance & Scalability](file:///Users/shaswatraj/Desktop/earn/scriptlyhq/docs/PERFORMANCE.md)
- [SEO & Discoverability](file:///Users/shaswatraj/Desktop/earn/scriptlyhq/docs/SEO.md)
- [Product Roadmap](file:///Users/shaswatraj/Desktop/earn/scriptlyhq/docs/ROADMAP.md)

---

## 💖 Sponsor & Support

If you find ScriptlyStore or any of the open-source boilerplates helpful, consider tipping or sponsoring continued development:

[![Tip & Sponsor](https://img.shields.io/badge/Tip%20%26%20Sponsor-Razorpay-0C2340?style=for-the-badge&logo=razorpay)](https://razorpay.me/@iamsh)

- **Razorpay Direct Tip & Sponsor**: [https://razorpay.me/@iamsh](https://razorpay.me/@iamsh)

---

## 📄 License

ScriptlyStore is built by [Shaswat Raj](https://github.com/SH20RAJ) ([Tip & Sponsor](https://razorpay.me/@iamsh)). All rights reserved. Commercial licenses for individual templates and scripts are governed by their respective product license agreements.
