# ScriptlyStore — Performance Engineering Guide

## 1. Core Web Vitals Targets

- **Largest Contentful Paint (LCP)**: `< 1.8s` (desktop), `< 2.2s` (mobile)
- **Interaction to Next Paint (INP)**: `< 150ms`
- **Cumulative Layout Shift (CLS)**: `< 0.05`
- **Time to First Byte (TTFB)**: `< 200ms` globally via Cloudflare Edge caching for static pages.

---

## 2. Key Optimization Strategies

### 2.1 Root Layout De-bloating
- **Elimination of `await headers()`**: Remove request-header reading from the root layout, enabling Next.js to pre-render marketing, legal, directory, and content routes as static (`○`).
- **Dynamic Payment SDK Loading**: Razorpay checkout script (`checkout.razorpay.com/v1/checkout.js`) is removed from root `<head>` and loaded dynamically via `loadRazorpayScript()` only when a user clicks "Buy Now" or "Checkout".
- **Google Font Optimization**: Replace external `<link rel="stylesheet">` tags with Next.js built-in font loader (`next/font/google`), subsetting to `latin` and self-hosting font files at build time.

### 2.2 Server-First Rendering
- Homepage (`/`) rendered as an async Server Component with direct database query access.
- Products, categories, and landing sections pre-rendered to HTML on the server.
- Eliminates the flash of empty skeletons and reduces hydration JS by > 40%.

### 2.3 Image Optimization
- Modern `next/image` usage for product thumbnails and preview media.
- Correct responsive `sizes` attribute on all card grids to prevent downloading oversized assets on mobile devices.
- Elimination of multi-layer blurred glow backgrounds that previously doubled DOM node counts and image requests per card.

### 2.4 Bundle & Dependency Budgets
- Isolate Recharts and heavy chart components into dynamic client imports with SSR disabled where appropriate.
- Eliminate unnecessary Framer Motion wrappers on static content; prefer lightweight CSS transitions.
