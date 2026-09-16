# ScriptlyStore — Route Ownership & Inventory

| Route | Domain Owner | Purpose | Auth Level | Indexable | Data Source | Primary CTA | Layout |
|---|---|---|---|---|---|---|---|
| `/` | Marketplace | Marketplace discovery & featured products | Public | Yes | Server queries (products, categories) | Browse Products | Storefront |
| `/explore` | Marketplace | Full product catalog & browsing | Public | Yes | Products query + filter params | Filter & Explore | Storefront |
| `/search` | Search | Search results across catalog | Public | Canonical / Noindex dynamic query params | Product search index | View Product | Storefront |
| `/free` | Marketplace | Catalog of free developer tools & scripts | Public | Yes | Free products query | Download Free | Storefront |
| `/featured` | Marketplace | Curated high-performing products | Public | Yes | Featured products query | View Details | Storefront |
| `/products/[slug]` | Product | Product details, tech stack, reviews, buy | Public | Yes | Product query by slug | Buy Now / Download | Storefront |
| `/cart` | Checkout | Cart review, discounts & checkout trigger | Public (Auth at checkout) | No | Client cart state + server coupon validation | Checkout Now | Storefront |
| `/purchase-success` | Checkout | Post-purchase confirmation & downloads | User | No | Order confirmation query | Download Asset | Storefront |
| `/trust` | Legal/Trust | Security, delivery, licensing & verification | Public | Yes | Static trust content | Explore Catalog | Storefront |
| `/licenses` | Legal | Commercial and personal license terms | Public | Yes | Static licensing definitions | Buy License | Storefront |
| `/dashboard` | Account | Buyer purchases, saved products & downloads | User | No | User orders & downloads query | Download / View | Dashboard |
| `/dashboard/receipt/[orderId]` | Account | Tax-compliant purchase receipt | User | No | Order record query | Print Receipt | Minimal |
| `/creator` | Creator | Creator onboarding and platform overview | Public | Yes | Static creator value prop | Start Selling | Storefront |
| `/creator/products` | Creator | Creator's published product catalog | Creator / Admin | No | Creator products query | New Product | Creator |
| `/creator/new` | Creator | Publish new script, template or asset | Creator / Admin | No | Categories & user record | Publish Product | Creator |
| `/creator/payouts` | Creator | Creator earnings, payout history & bank setup | Creator / Admin | No | Payouts & orders ledger | Request Payout | Creator |
| `/affiliate` | Affiliate | Affiliate program overview & registration | Public | Yes | Affiliate program terms | Join Program | Storefront |
| `/affiliate/dashboard` | Affiliate | Referral clicks, commissions & links | Approved Affiliate | No | Affiliate stats & referrals query | Copy Link | Affiliate |
| `/admin` | Admin | Operational metrics & admin console | Admin Only | No | Platform overview metrics | Moderate Platform | Admin |
| `/admin/approvals` | Admin | Review pending creator product submissions | Admin Only | No | Pending products query | Approve / Reject | Admin |
| `/admin/orders` | Admin | Order lifecycle & refund reconciliation | Admin Only | No | Orders query with pagination | Manage Order | Admin |
| `/admin/payouts` | Admin | Process creator and affiliate payouts | Admin Only | No | Payouts query | Process Payout | Admin |
| `/blog` | Content | Editorial developer articles and guides | Public | Yes | Blog posts index | Read Article | Blog |
| `/blog/[slug]` | Content | In-depth technical articles & resources | Public | Yes | Blog post markdown content | Explore Related | Blog |
| `/directories` | Resources | Curated directory of developer tools | Public | Yes | Directory entries query | Submit Tool | Storefront |
| `/api/download/[productId]` | Download | Protected product file delivery endpoint | User (Entitled) | No | Entitlement check + storage redirect | N/A (Stream/Redirect) | API |
| `/api/webhooks/razorpay` | Payments | Razorpay order & payment capture webhook | Razorpay (HMAC verified) | No | Webhook payload | N/A (JSON) | API |
