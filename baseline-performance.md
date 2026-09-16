# Baseline Performance Report — ScriptlyStore

Generated: September 16, 2026

## 1. Build & Compilation Metrics

- **Next.js Version**: 16.2.6 (Turbopack)
- **React Version**: 19.2.7
- **Compilation Time**: 15.5s
- **TypeScript Checking Time**: 12.6s
- **Total Build Time**: ~29.1s

## 2. Route Rendering Breakdown

Total App Routes: 64

- **Static Pre-rendered Routes (`○`)**: 2 / 64 (3.1%)
  - `/robots.txt`
  - `/sitemap.xml`
- **Dynamic Server-Rendered Routes (`ƒ`)**: 62 / 64 (96.9%)
  - **100% of HTML/page routes forced into dynamic server execution** due to `await headers()` in `src/app/layout.tsx` (reading `x-pathname` header).
  - Even purely static content pages (`/about`, `/licenses`, `/privacy`, `/terms`, `/refund`, `/shipping`, `/dmca`) could not be pre-rendered or cached at the edge.

## 3. Client Hydration & Runtime Overhead

- **Homepage (`/`)**:
  - Rendered entirely via client component (`ClientHome.tsx`).
  - Fetches 6 distinct endpoints concurrently on mount inside client `useEffect` (`getProductsAction` x 4, `getCategoriesAction`, `getSubcategoriesAction`).
  - Initial layout shift (CLS risk) due to loading skeletons flashing before hydration completes.
  - Zero search-engine crawlable product cards in raw initial HTML payload.
- **Global Bundle Overhead**:
  - `https://checkout.razorpay.com/v1/checkout.js` loaded globally across all routes via `<Script strategy="lazyOnload" />` in root layout, including marketing, blog, and documentation pages.
  - Microsoft Clarity analytics script embedded in root layout head.
  - Google Fonts (`Nunito` & `Varela Round`) loaded via external render-blocking `<link rel="stylesheet">` with multiple weights (300 to 900).
  - Global `CartProvider` and `ReferralTracker` mounted across every route.

## 4. Public Asset Weight Audit

- `/public/apple-icon.png`: **368 KB**
- `/public/favicon.png`: **368 KB**
- `/public/icon-192.png`: **368 KB**
- `/public/icon-512.png`: **368 KB**
- `/public/og-image.png`: **721 KB**
- `/public/thumbnails/`: 10 PNGs between **486 KB and 968 KB** each (Total: **6.45 MB** for 10 cards).
- **Product Card Image Strategy**: Uses standard `<img>` tags without responsive sizes or modern format conversion (WebP/AVIF), plus multiple overlaid blurred duplicates for glow effects.

## 5. Security & Correctness Baseline

- **P0 Payment Signature Bypass**: `src/lib/actions/orders.ts` allows payment completion without signature check if signature is not provided (`if (isMockKeys || !razorpaySignature)`).
- **P0 Webhook Spoofing**: `src/app/api/webhooks/razorpay/route.ts` skips signature check if `x-razorpay-signature` header is absent (`if (signature) { ... }`).
- **P1 Rating Fabrication in Schema**: `src/app/products/[slug]/page.tsx` emits `ratingValue: 5.0` and `reviewCount: 1` in `AggregateRating` JSON-LD even for products with no ratings.
- **P1 Download Route**: Lacks rate limiting and can expose direct file URLs.
