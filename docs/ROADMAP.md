# ScriptlyStore — Product Roadmap & Milestone Tracker

This document outlines completed technical milestones, current development objectives, and future features for the ScriptlyStore ecosystem.

---

## 🟢 Milestone 1: Core Marketplace Foundation (Completed)

- [x] **Next.js 16 + React 19 Architecture**: High-speed App Router setup with Turbopack compilation.
- [x] **Edge Deployment via OpenNext**: Configured for Cloudflare Workers custom domain edge execution.
- [x] **Neon Serverless PostgreSQL + Drizzle ORM**: Automated schema pushing, connection pooling, and migrations.
- [x] **Hexclave User Authentication**: Passwordless auth, session sync, and role-based access control.
- [x] **Razorpay Global Checkout**: Integrated card, UPI, and net banking processing with mock development fallbacks.
- [x] **95/5 Creator Split Model**: Built-in 95% creator revenue share and immutable ledger recording.
- [x] **Protected File Delivery**: Local private vault (`/uploads`) with entitlement verification at `/api/download/[productId]`.

---

## 🟢 Milestone 2: Scalability, Checkouts & Minimal UI (Completed)

- [x] **SQL Query Pushdown**: Refactored in-memory JavaScript filtering into pure SQL queries using Drizzle ORM (`limit`, `offset`, `ilike`, `count(*)`).
- [x] **Nested Category Hubs**:
  - `/explore` (Universal catalog with query filters)
  - `/explore/[category]` (Dedicated category hub with subcategories)
  - `/explore/[category]/[subcategory]` (Deep subcategory directory with breadcrumbs)
- [x] **Dynamic & Key-Encrypted Payment Links (`/pay`)**:
  - URL-safe Base64 JSON schema support.
  - 256-bit AES-GCM symmetric key encryption with `k1.` tokens.
  - Interactive `KeyUnlockCard` passphrase unlock prompt.
  - Pre-unlocked URLs (`&key=...`).
  - Open REST API (`POST /api/pay/create`).
- [x] **Centralized Minimal Skeletons**:
  - Replaced all ad-hoc loading states with unified tokens (`bg-muted/40 dark:bg-muted/30`) via `@/components/ui/skeleton`.
  - Dedicated `loading.tsx` for every dynamic route.
- [x] **Admin Process Prompt Docs (`/admin/prompts`)**:
  - Interactive prompt center with copyable AI agent prompts, JSON schemas, and reference code for all platform workflows.
- [x] **Currency Standardization**: Standardized all product and checkout interfaces on Indian Rupee (`₹` / INR) with locale formatting.

---

## 🟡 Milestone 3: Creator Virality & Media Enhancements (In Progress)

- [ ] **Multi-Provider Video Previews**:
  - Expand video embed options on product edit forms to support YouTube, Vimeo, Dailymotion, and GitHub release MP4 assets.
- [ ] **Automated GitHub Release Asset Upload**:
  - When product archive exceeds local limits, automate GitHub Release creation and direct download proxying.
- [ ] **Verified Reviews & Trust Badges**:
  - Verified buyer badge display on product reviews.
  - Creator star rating breakdown summaries.
- [ ] **Directory Syndication (`/directories`)**:
  - Automated developer tools directory with submission queue and backlink verification.

---

## 🔵 Milestone 4: Automated Payouts & Global Scale (Future)

- [ ] **RazorpayX Automated Settlements**:
  - Direct integration with RazorpayX Fund Accounts for instant UPI and IMPS creator payout payouts.
- [ ] **Multi-Currency Display**:
  - Real-time currency selector (USD, EUR, GBP, INR) with live exchange rate conversion at checkout.
- [ ] **Affiliate Self-Serve Dashboard**:
  - Direct deep-link generator and conversion analytics for registered affiliates.
