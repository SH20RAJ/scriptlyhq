# ScriptlyStore — Complete Route Inventory & Ownership

This document provides a comprehensive inventory of all client-facing and API routes across ScriptlyStore, specifying authorization requirements, data sources, and rendering behavior.

---

## 1. Public Marketplace & Exploration

| Route | Rendering | Auth Level | Purpose | Data Source |
|---|---|---|---|---|
| `/` | Dynamic (`ƒ`) | Public | Marketplace homepage, hero search, featured assets | `products`, `categories` |
| `/explore` | Dynamic (`ƒ`) | Public | Scalable product catalog with sort and price filters | Drizzle paginated query |
| `/explore/[category]` | Dynamic (`ƒ`) | Public | Dedicated category directory with subcategory chips | Category products query |
| `/explore/[category]/[subcategory]` | Dynamic (`ƒ`) | Public | Targeted subcategory directory with breadcrumbs | Subcategory products query |
| `/products/[slug]` | Dynamic (`ƒ`) | Public | Product details, live previews, tech stack, checkout | Product record by slug |
| `/search` | Dynamic (`ƒ`) | Public | Real-time catalog search results | SQL `ilike` query |
| `/free` | Dynamic (`ƒ`) | Public | Catalog of free developer scripts & boilerplates | Free products query |
| `/featured` | Dynamic (`ƒ`) | Public | Curated showcase of top-rated templates | Featured products query |
| `/stores/[id]` | Dynamic (`ƒ`) | Public | Custom creator storefront catalog | Creator store query |
| `/tags/[tag]` | Dynamic (`ƒ`) | Public | Product tag taxonomy archive | Tag query |

---

## 2. Checkouts, Payments & Customer Dashboard

| Route | Rendering | Auth Level | Purpose | Data Source |
|---|---|---|---|---|
| `/cart` | Dynamic (`ƒ`) | Public | Shopping cart, coupon discounts, checkout trigger | Client cart + server actions |
| `/pay` | Dynamic (`ƒ`) | Public | Dynamic & key-encrypted checkout page | Encoded Base64 / AES payload |
| `/pay/[slug]` | Dynamic (`ƒ`) | Public | Hosted permanent payment link checkout | Stored payment link record |
| `/purchase-success` | Dynamic (`ƒ`) | User | Order confirmation, receipt & download trigger | Completed order record |
| `/dashboard` | Dynamic (`ƒ`) | User | Customer purchased products, files & billing history | User orders & downloads |
| `/dashboard/receipt/[orderId]` | Dynamic (`ƒ`) | User | Printable tax-compliant purchase receipt | Order record query |
| `/handler/[...stack]` | Dynamic (`ƒ`) | Public / User | Hexclave authentication & account settings | Hexclave User Infrastructure |

---

## 3. Creator Studio (`/creator`)

| Route | Rendering | Auth Level | Purpose | Data Source |
|---|---|---|---|---|
| `/creator` | Dynamic (`ƒ`) | Public | Creator onboarding & 95/5 value proposition | Static marketing content |
| `/creator/dashboard` | Dynamic (`ƒ`) | Creator / Admin | Creator studio KPI overview & sales performance | Creator orders & ledger |
| `/creator/products` | Dynamic (`ƒ`) | Creator / Admin | Creator catalog management & status | Creator products query |
| `/creator/new` | Dynamic (`ƒ`) | Creator / Admin | Publish new template, script or digital asset | Category schema |
| `/creator/[id]/edit` | Dynamic (`ƒ`) | Creator / Admin | Edit existing product details & media | Product query by ID |
| `/creator/ledger` | Dynamic (`ƒ`) | Creator / Admin | 95% revenue split ledger & transaction history | `creator_ledger` table |
| `/creator/coupons` | Dynamic (`ƒ`) | Creator / Admin | Create & manage custom store coupon codes | `coupons` table |
| `/creator/payouts` | Dynamic (`ƒ`) | Creator / Admin | View payout history & configure bank details | `payouts` table |
| `/creator/store` | Dynamic (`ƒ`) | Creator / Admin | Configure store name, slug, bio & social links | `stores` table |

---

## 4. Admin Console (`/admin`)

| Route | Rendering | Auth Level | Purpose | Data Source |
|---|---|---|---|---|
| `/admin` | Dynamic (`ƒ`) | Admin | Platform KPI overview, revenue & user stats | Platform aggregation query |
| `/admin/products` | Dynamic (`ƒ`) | Admin | Manage all marketplace products & approval status | Global products query |
| `/admin/products/new` | Dynamic (`ƒ`) | Admin | Direct product creator with instant publishing | Global schema |
| `/admin/approvals` | Dynamic (`ƒ`) | Admin | Review pending creator product submissions | Pending products query |
| `/admin/payment-links` | Dynamic (`ƒ`) | Admin | Permanent & dynamic link manager & encoder tool | `payment_links` & activities |
| `/admin/prompts` | Dynamic (`ƒ`) | Admin | Process Prompt Docs center & AI agent specs | Static prompt registry |
| `/admin/orders` | Dynamic (`ƒ`) | Admin | Order lifecycle management & refunds | Orders query |
| `/admin/categories` | Dynamic (`ƒ`) | Admin | Category & subcategory taxonomy manager | Categories tables |
| `/admin/coupons` | Dynamic (`ƒ`) | Admin | Global promotional coupon code manager | Coupons table |
| `/admin/stores` | Dynamic (`ƒ`) | Admin | Creator store directory & moderation | Stores table |
| `/admin/payouts` | Dynamic (`ƒ`) | Admin | Review & settle creator withdrawal requests | Payouts table |
| `/admin/affiliates` | Dynamic (`ƒ`) | Admin | Affiliate partner management & commissions | Affiliates table |

---

## 5. REST API Endpoints (`/api`)

| Endpoint | Method | Auth Level | Purpose | Output |
|---|---|---|---|---|
| `/api/pay/create` | `POST`, `GET`, `OPTIONS` | Public (Open) | Create hosted, encoded, or key-encrypted payment links | JSON / Redirect |
| `/api/download/[productId]` | `GET` | User (Entitled) | Authenticated private ZIP asset download stream | Binary Stream (ZIP) |
| `/api/coupons/validate` | `POST` | Public | Validate coupon code against cart total | JSON |
| `/api/webhooks/razorpay` | `POST` | Razorpay (HMAC) | Payment capture & order fulfillment webhook | JSON |
| `/api/products.json` | `GET` | Public | Public JSON catalog feed | JSON |
| `/api/blog.json` | `GET` | Public | Public blog article feed | JSON |
| `/api/agents/mcp` | `GET`, `POST` | Public | MCP tool interface for AI agents | JSON |

---

## 6. Documentation & Informational Routes

| Route | Rendering | Auth Level | Purpose |
|---|---|---|---|
| `/docs/api/payment-links` | Static (`○`) | Public | Public Payment Links API & URL Encoding guide |
| `/docs/route-guide` | Static (`○`) | Public | Route reference & integration guide |
| `/blog` | Dynamic (`ƒ`) | Public | Editorial developer articles and tutorials |
| `/blog/[slug]` | Dynamic (`ƒ`) | Public | Technical markdown article page |
| `/trust` | Static (`○`) | Public | Security, licensing, and transaction trust policies |
| `/licenses` | Static (`○`) | Public | Commercial & personal license terms |
| `/privacy`, `/terms`, `/refund`, `/dmca`, `/shipping` | Static (`○`) | Public | Compliance & legal terms of service |
| `/sitemap.xml`, `/robots.txt` | Static (`○`) | Public | Search engine indexing directives |
