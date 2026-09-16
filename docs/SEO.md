# ScriptlyStore — SEO Architecture & Policy

## 1. Core SEO Principles

- **No Deceptive Signals**: Structured data must be truthful. Never output fabricated `AggregateRating` reviews or inflated counts.
- **Canonical & Crawlable**: Every indexable page specifies an explicit canonical URL.
- **Controlled Search & Filtering Indexation**: Programmatic search queries and user sorting parameters are excluded from search indexing via canonical targets and robots directives to prevent crawl traps.
- **Rich Semantic HTML**: Every page adheres to standard heading hierarchies (single `<h1>`, logical `<h2>`/`<h3>`), structured lists, and accessible landmarks.

---

## 2. Structured Data Schema Standards

### Site & Organization
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "ScriptlyStore",
  "url": "https://scriptly.store"
}
```

### Product Schema
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Product Title",
  "description": "Short product description",
  "image": ["https://scriptly.store/thumbnail.png"],
  "offers": {
    "@type": "Offer",
    "priceCurrency": "USD",
    "price": "29.00",
    "availability": "https://schema.org/InStock",
    "url": "https://scriptly.store/products/slug"
  }
}
```
*Note: `aggregateRating` is ONLY emitted if verified `ratingCount > 0` in the database.*

### Breadcrumbs
All catalog and product pages include standard `BreadcrumbList` schemas reflecting the true navigation hierarchy (`Home` > `Category` > `Product`).

---

## 3. Metadata Generation

Deterministic metadata generators:
- `generateMetadata()` in `src/app/products/[slug]/page.tsx`
- `generateMetadata()` in `src/app/blog/[slug]/page.tsx`
- Site-wide defaults configured in `src/config/site.ts`.
