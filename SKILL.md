# ScriptlyHQ — Coding Agent Skills & Operational Workflows

This document outlines on-demand automated skills and operational scripts for developers and AI coding agents operating on the `SH20RAJ/scriptlyhq` codebase.

---

## Skill 1: Product Metadata Audit & SEO Enrichment

Audit, optimize, and enhance digital product titles, categories, tags, and rich markdown descriptions in Neon PostgreSQL for search engine ranking (SEO) and marketplace conversion.

### Database Hooks
- **Schema**: [schema.ts](file:///Users/shaswatraj/Desktop/earn/scriptlyhq/src/db/schema.ts) (`products`, `categories`, `subcategories` tables).
- **Client**: Drizzle ORM client initialized in [index.ts](file:///Users/shaswatraj/Desktop/earn/scriptlyhq/src/db/index.ts).

### Execution Sequence
1. **Category Mapping**: Ensure the product maps cleanly to one of the 6 core categories:
   - `saas-templates`: Next.js boilerplates, full-stack microservices.
   - `landing-pages`: Portfolio templates, conversion funnels.
   - `scripts`: Web scrapers, automation tools, browser extensions.
   - `design-assets`: Tailwind component packages, Figma kits, icon sets.
   - `ai-prompts`: System prompts, AI workflows, agent configurations.
   - `ebooks`: Developer playbooks, cheat sheets, guides.
2. **Subcategory Classification**: Assign a subcategory slug (e.g. `nextjs`, `scrapers`, `tailwind`).
3. **Structured Markdown Description**: Every product description must include:
   - Value proposition introduction
   - Key feature bullet points
   - Tech stack specifications
   - Getting started / file inclusions list
4. **INR Pricing**: Ensure product price is an integer in paise (e.g. ₹999 = `99900`).

---

## Skill 2: Payment Link Generation & Encoding

Generate instant, zero-setup payment checkout links with Razorpay processing and post-payment redirection.

### Code Hook
- **Encoder Function**: `encodePaymentLinkPayload` in [link-encoder.ts](file:///Users/shaswatraj/Desktop/earn/scriptlyhq/src/lib/payments/link-encoder.ts).

### Usage Examples
```ts
import { encodePaymentLinkPayload } from "@/lib/payments/link-encoder";

// 1. HMAC Signed Base64 Link (Tamper-proof, public)
const signedToken = encodePaymentLinkPayload({
  title: "Code Review Session",
  price: 999,
  redirectUrl: "https://cal.com/booking",
  description: "1-hour deep architecture review",
}, { sign: true });
// URL: https://scriptly.store/pay?data={signedToken}

// 2. Key-Protected AES-256-GCM Link (Private, password protected)
const encryptedToken = encodePaymentLinkPayload({
  title: "Private Consultation",
  price: 1999,
  redirectUrl: "https://scriptly.store/dashboard",
}, { encryptionKey: "client_secret_pin_2026" });
// URL: https://scriptly.store/pay?data={encryptedToken}
// Direct unlock URL: https://scriptly.store/pay?data={encryptedToken}&key=client_secret_pin_2026
```

---

## Skill 3: Database Migrations & Drizzle Push

Sync schema changes to Neon PostgreSQL:

```bash
# Push schema changes directly
bun x drizzle-kit push

# Generate migration files
bun x drizzle-kit generate
```

---

## Skill 4: Blogger Auto-Publishing

Generate SEO-friendly HTML articles from database products and publish them to Blogger:

```bash
# Test publish 2 products
bun run src/scripts/publish-to-blogger.ts --limit 2

# Publish all pending products
bun run src/scripts/publish-to-blogger.ts --all
```
Reference documentation: [blogger-publish.md](file:///Users/shaswatraj/Desktop/earn/scriptlyhq/docs/skills/blogger-publish.md).
