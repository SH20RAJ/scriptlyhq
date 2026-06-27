import { db } from "../src/db";
import { products } from "../src/db/schema";
import { eq } from "drizzle-orm";

const NEW_EBOOKS = [
  {
    id: "prod-solo-dev-micro-saas",
    title: "The Solo Developer's Guide to Micro-SaaS",
    slug: "solo-developers-guide-to-micro-saas",
    shortDescription: "A complete roadmap for software engineers to validate, build, launch, and scale profitable Micro-SaaS products to $5,000/month in recurring revenue.",
    description: `Most developers fail not because their code is bad, but because they build things nobody wants. This eBook teaches you the business side of coding.

## What's Inside:
- **Ideation & Validation:** How to find high-intent problems worth paying for.
- **MVP Blueprint:** Deciding what features to build first and what to ignore.
- **Stripe & Customer Operations:** Handling subscriptions, tax compliance, and refunds.
- **Cold Outreach Templates:** Copy-paste scripts to acquire your first 50 paid users.

## Why Read This Book?
If you are tired of trading time for money or building side projects that end up on GitHub with 0 users, this playbook will change how you think about coding. It's written for engineers who want to build sustainable, independent cash-flowing software businesses.`,
    category: "ebooks",
    subcategory: "creator-business-guides",
    tags: "saas,indie-hacking,micro-saas,business",
    thumbnail: "/thumbnails/solo_dev_micro_saas.png",
    demoUrl: null,
    fileUrl: "/mock/solo-developers-guide-to-micro-saas.pdf",
    price: 49900, // ₹499.00
    version: "1.0.0",
    featured: true,
    published: true,
    status: "approved",
    rating: "4.9",
    ratingCount: 18,
    isFree: false,
    views: 2840,
    downloadsCount: 247,
    saves: 189,
    showStats: true,
    personal: false,
  },
  {
    id: "prod-seo-for-developers",
    title: "SEO for Developers: Rank Without a Marketing Budget",
    slug: "seo-for-developers",
    shortDescription: "The technical search engine optimization handbook. Learn to optimize React components, fix hydration layout shifts, and dominate Google search results.",
    description: `Stop paying for ads. This book teaches you how to leverage your technical skills to drive thousands of free organic visits to your products every single day.

## What's Inside:
- **Server-Side Rendering (SSR) Optimization:** Structuring metadata, OpenGraph tags, and JSON-LD schemas.
- **Lighthouse Score Mastery:** Optimizing Core Web Vitals (LCP, FID, CLS) to score a perfect 100/100.
- **Programmatic SEO:** Building hundreds of dynamic landing pages that rank for long-tail keywords.
- **XML Sitemaps & Indexing:** Configuring IndexNow and instant indexing APIs.

## Master Organic Traffic
Technical SEO is a superpower that most marketers don't understand, and most developers ignore. By structuring your pages correctly, optimizing your asset loading, and automating metadata schema distribution, you can outrank massive marketing agencies with zero dollar spend.`,
    category: "ebooks",
    subcategory: "seo-checklists",
    tags: "seo,marketing,nextjs,nextjs-seo",
    thumbnail: "/thumbnails/seo_for_developers.png",
    demoUrl: null,
    fileUrl: "/mock/seo-for-developers.pdf",
    price: 39900, // ₹399.00
    version: "1.0.0",
    featured: true,
    published: true,
    status: "approved",
    rating: "4.8",
    ratingCount: 14,
    isFree: false,
    views: 1980,
    downloadsCount: 168,
    saves: 112,
    showStats: true,
    personal: false,
  },
  {
    id: "prod-design-for-developers",
    title: "Design for Developers: Build Premium Interfaces with Tailwind CSS",
    slug: "design-for-developers-tailwind",
    shortDescription: "Learn UI/UX design fundamentals, typography rules, dark mode scaling, and color theory specifically using Tailwind CSS variables.",
    description: `You don't need a designer to build stunning websites. Master the visual principles that make apps look professional, modern, and high-converting.

## What's Inside:
- **Visual Hierarchy:** How spacing, size, and layout guide your user's eyes to the "Buy Now" button.
- **Tailwind Color Architecture:** Setting up premium HSL-tailored dark modes and gradients.
- **Typography Rules:** Pairing pairing modern fonts (Inter, Geist, Outfit) and choosing perfect line-heights.
- **Micro-Animations:** Adding interactive hover and transition effects using Tailwind transition classes.

## Bridge the Gap Between Dev and Design
Most developer-built websites look generic or messy. This book doesn't teach abstract design theory; it gives you concrete Tailwind-based visual engineering rules that you can copy and paste into your next project immediately.`,
    category: "ebooks",
    subcategory: "creator-business-guides",
    tags: "design,tailwind,ui-ux,css",
    thumbnail: "/thumbnails/design_for_developers.png",
    demoUrl: null,
    fileUrl: "/mock/design-for-developers-tailwind.pdf",
    price: 45000, // ₹450.00
    version: "1.0.0",
    featured: true,
    published: true,
    status: "approved",
    rating: "5.0",
    ratingCount: 22,
    isFree: false,
    views: 3120,
    downloadsCount: 289,
    saves: 215,
    showStats: true,
    personal: false,
  },
  {
    id: "prod-api-design-patterns",
    title: "API Design Patterns & Serverless Architecture Playbook",
    slug: "api-design-patterns-serverless",
    shortDescription: "A masterclass in architecting resilient serverless APIs, database caching layers, and Webhook security with Drizzle ORM and Neon Postgres.",
    description: `Scale your app to millions of requests without high server bills. Learn patterns for rate-limiting, batching queries, and securing API endpoints.

## What's Inside:
- **Database Caching:** Integrating Redis or Cloudflare KV to bypass heavy SQL lookups.
- **Serverless API Performance:** Avoiding database connection pooling leaks inside Next.js edge route handlers.
- **Webhook Reliability:** Writing retry mechanisms and signature verification for payment processors.
- **Rate Limiting:** Building token-bucket middleware using serverless edge runtimes.

## Optimize Serverless Backends
Transitioning from long-running node servers to serverless edge execution environments changes everything. Avoid common pitfalls like cold start delays, pool exhaustion, and memory leaks with proven architectural blueprints.`,
    category: "ebooks",
    subcategory: "coding-handbooks",
    tags: "api,backend,nextjs,serverless,edge",
    thumbnail: "/thumbnails/api_design_patterns.png",
    demoUrl: null,
    fileUrl: "/mock/api-design-patterns-serverless.pdf",
    price: 59900, // ₹599.00
    version: "1.0.0",
    featured: true,
    published: true,
    status: "approved",
    rating: "4.9",
    ratingCount: 19,
    isFree: false,
    views: 2450,
    downloadsCount: 198,
    saves: 154,
    showStats: true,
    personal: false,
  },
  {
    id: "prod-ai-automation-scraping",
    title: "The AI Automation & Scraping Playbook",
    slug: "ai-automation-scraping-playbook",
    shortDescription: "Learn to build automated scraping scripts, headless browser engines, and AI pipelines to save hours of manual data entry.",
    description: `A practical guide to automating the web. Build systems that monitor competitors, scrape structured data, and feed information into LLM pipelines.

## What's Inside:
- **Headless Browsers:** Scripting Puppeteer and Playwright to bypass Cloudflare and CAPTCHAs.
- **Data Structuring:** Using Cheerio and Node.js streams to process huge datasets.
- **LLM Context Pipelines:** Automatically scraping blogs/documentation and converting them into vector embeddings.
- **Cron Automation:** Running background jobs on GitHub Actions or Cloudflare Workers.

## Build Self-Operating Pipelines
Automate your business, enrich cold lead data, or build competitive research databases. This playbook gives you production-tested scripts and architecture models to build intelligent agents that navigate the web, bypass blocks, and generate formatted outputs automatically.`,
    category: "ebooks",
    subcategory: "coding-handbooks",
    tags: "ai,automation,scraping,puppeteer,nodejs",
    thumbnail: "/thumbnails/ai_automation_scraping.png",
    demoUrl: null,
    fileUrl: "/mock/ai-automation-scraping-playbook.pdf",
    price: 49900, // ₹499.00
    version: "1.0.0",
    featured: true,
    published: true,
    status: "approved",
    rating: "4.9",
    ratingCount: 26,
    isFree: false,
    views: 3560,
    downloadsCount: 312,
    saves: 242,
    showStats: true,
    personal: false,
  },
];

async function run() {
  console.log("Seeding 5 new high-selling ebooks to the database...");

  for (const ebook of NEW_EBOOKS) {
    // Check if the product already exists by slug
    const existing = await db.query.products.findFirst({
      where: eq(products.slug, ebook.slug),
    });

    if (existing) {
      console.log(`Product with slug "${ebook.slug}" already exists. Updating it...`);
      await db
        .update(products)
        .set({
          title: ebook.title,
          shortDescription: ebook.shortDescription,
          description: ebook.description,
          category: ebook.category,
          subcategory: ebook.subcategory,
          tags: ebook.tags,
          thumbnail: ebook.thumbnail,
          price: ebook.price,
          version: ebook.version,
          featured: ebook.featured,
          published: ebook.published,
          status: ebook.status,
          rating: ebook.rating,
          ratingCount: ebook.ratingCount,
          views: ebook.views,
          downloadsCount: ebook.downloadsCount,
          saves: ebook.saves,
          showStats: ebook.showStats,
          updatedAt: new Date(),
        })
        .where(eq(products.id, existing.id));
      console.log(`Updated product: ${ebook.title}`);
    } else {
      console.log(`Inserting new product: ${ebook.title}`);
      await db.insert(products).values(ebook);
      console.log(`Successfully added product: ${ebook.title}`);
    }
  }

  console.log("All 5 ebooks have been successfully seeded/updated!");
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Error seeding ebooks:", err);
    process.exit(1);
  });
