"use server";

import { db } from "@/db";
import { products } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { isAdmin, getOrCreateDbUser } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";

export async function createProductAction(formData: FormData) {
  const user = await getOrCreateDbUser();
  if (!user) {
    throw new Error("Unauthorized: Sign in required.");
  }

  const isUserAdmin = user.role === "admin";

  const title = (formData.get("title") as string) || "Draft Product";
  let slug = formData.get("slug") as string;
  if (!slug) {
    slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  if (!slug) {
    slug = "draft-product-" + crypto.randomUUID().slice(0, 8);
  }
  
  const shortDescription = (formData.get("shortDescription") as string) || "No description provided.";
  const description = (formData.get("description") as string) || "No full description provided yet.";
  const category = (formData.get("category") as string) || "templates";
  const subcategory = formData.get("subcategory") as string;
  const tags = formData.get("tags") as string;
  const demoUrl = (formData.get("demoUrl") as string) || null;
  
  const priceInput = formData.get("price") as string;
  const priceParsed = parseFloat(priceInput);
  const price = isNaN(priceParsed) ? 0 : Math.round(priceParsed * 100);

  const version = (formData.get("version") as string) || "1.0.0";
  
  // Rules: Creators cannot set featured or publish directly.
  const featured = isUserAdmin ? (formData.get("featured") === "true") : false;
  const published = isUserAdmin ? (formData.get("published") === "true") : false;
  const status = isUserAdmin ? (published ? "approved" : "pending") : "pending";
  const creatorId = isUserAdmin ? (formData.get("creatorId") as string || null) : user.id;

  const isFree = formData.get("isFree") === "true";
  const discountPercentVal = parseInt(formData.get("discountPercent") as string || "0", 10);
  const discountPercent = isNaN(discountPercentVal) ? 0 : discountPercentVal;
  const promoStartStr = formData.get("promoStart") as string;
  const promoEndStr = formData.get("promoEnd") as string;
  const promoStart = promoStartStr ? new Date(promoStartStr) : null;
  const promoEnd = promoEndStr ? new Date(promoEndStr) : null;

  const thumbnailUrl = formData.get("thumbnail") as string;
  const previewGif = formData.get("previewGif") as string;
  const screenshots = formData.get("screenshots") as string; // JSON or comma-separated
  const videoUrl = formData.get("videoUrl") as string;
  const fileUrl = formData.get("fileUrl") as string;
  const redirectDownload = formData.get("redirectDownload") !== "false";
  const personal = formData.get("personal") === "true";
  const showStats = formData.get("showStats") === "true";

  const viewsVal = parseInt(formData.get("views") as string || "0", 10);
  const views = isNaN(viewsVal) ? 0 : viewsVal;

  const downloadsVal = parseInt(formData.get("downloadsCount") as string || "0", 10);
  const downloadsCount = isNaN(downloadsVal) ? 0 : downloadsVal;

  const savesVal = parseInt(formData.get("saves") as string || "0", 10);
  const saves = isNaN(savesVal) ? 0 : savesVal;

  const affiliateCommissionPercentVal = parseInt(formData.get("affiliateCommissionPercent") as string || "30", 10);
  const affiliateCommissionPercent = isNaN(affiliateCommissionPercentVal) ? 30 : Math.max(5, Math.min(affiliateCommissionPercentVal, 50));

  const id = crypto.randomUUID();

  await db.insert(products).values({
    id,
    title,
    slug,
    shortDescription,
    description,
    category,
    subcategory: subcategory || null,
    tags: tags || null,
    thumbnail: thumbnailUrl || null,
    previewGif: previewGif || null,
    screenshots: screenshots || null,
    videoUrl: videoUrl || null,
    demoUrl,
    fileUrl: fileUrl || null,
    redirectDownload,
    price,
    version,
    featured,
    published,
    creatorId,
    status,
    isFree,
    discountPercent,
    promoStart,
    promoEnd,
    personal,
    showStats,
    views,
    downloadsCount,
    saves,
    affiliateCommissionPercent,
  });

  revalidatePath("/");
  revalidatePath("/admin/products");
  return { success: true };
}

export async function updateProductAction(id: string, formData: FormData) {
  const user = await getOrCreateDbUser();
  if (!user) {
    throw new Error("Unauthorized: Sign in required.");
  }

  const existing = await db.query.products.findFirst({
    where: eq(products.id, id),
  });

  if (!existing) {
    throw new Error("Product not found");
  }

  const isUserAdmin = user.role === "admin";
  if (!isUserAdmin && existing.creatorId !== user.id) {
    throw new Error("Unauthorized: You do not own this product.");
  }

  const title = (formData.get("title") as string) || "Draft Product";
  let slug = formData.get("slug") as string;
  if (!slug) {
    slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  if (!slug) {
    slug = "draft-product-" + crypto.randomUUID().slice(0, 8);
  }
  
  const shortDescription = (formData.get("shortDescription") as string) || "No description provided.";
  const description = (formData.get("description") as string) || "No full description provided yet.";
  const category = (formData.get("category") as string) || "templates";
  const subcategory = formData.get("subcategory") as string;
  const tags = formData.get("tags") as string;
  const demoUrl = (formData.get("demoUrl") as string) || null;
  
  const priceInput = formData.get("price") as string;
  const priceParsed = parseFloat(priceInput);
  const price = isNaN(priceParsed) ? 0 : Math.round(priceParsed * 100);

  const version = (formData.get("version") as string) || "1.0.0";

  // Rules: Creators cannot set featured. Editing approved product resets it to pending/unpublished.
  const featured = isUserAdmin ? (formData.get("featured") === "true") : false;
  const published = isUserAdmin ? (formData.get("published") === "true") : false;
  
  // If user is admin, allow status from formData or sync with published status.
  // If user is creator, status resets to pending on edit.
  const status = isUserAdmin 
    ? (formData.get("status") as string || (published ? "approved" : "pending"))
    : "pending";

  const isFree = formData.get("isFree") === "true";
  const discountPercentVal = parseInt(formData.get("discountPercent") as string || "0", 10);
  const discountPercent = isNaN(discountPercentVal) ? 0 : discountPercentVal;
  const promoStartStr = formData.get("promoStart") as string;
  const promoEndStr = formData.get("promoEnd") as string;
  const promoStart = promoStartStr ? new Date(promoStartStr) : null;
  const promoEnd = promoEndStr ? new Date(promoEndStr) : null;

  const thumbnailUrl = formData.get("thumbnail") as string;
  const previewGif = formData.get("previewGif") as string;
  const screenshots = formData.get("screenshots") as string;
  const videoUrl = formData.get("videoUrl") as string;
  const fileUrl = formData.get("fileUrl") as string;
  const redirectDownload = formData.get("redirectDownload") !== "false";
  const personal = formData.get("personal") === "true";
  const showStats = formData.get("showStats") === "true";

  const viewsVal = parseInt(formData.get("views") as string || "0", 10);
  const views = isNaN(viewsVal) ? 0 : viewsVal;

  const downloadsVal = parseInt(formData.get("downloadsCount") as string || "0", 10);
  const downloadsCount = isNaN(downloadsVal) ? 0 : downloadsVal;

  const savesVal = parseInt(formData.get("saves") as string || "0", 10);
  const saves = isNaN(savesVal) ? 0 : savesVal;

  const affiliateCommissionPercentVal = parseInt(formData.get("affiliateCommissionPercent") as string || "30", 10);
  const affiliateCommissionPercent = isNaN(affiliateCommissionPercentVal) ? 30 : Math.max(5, Math.min(affiliateCommissionPercentVal, 50));

  await db
    .update(products)
    .set({
      title,
      slug,
      shortDescription,
      description,
      category,
      subcategory: subcategory || null,
      tags: tags || null,
      thumbnail: thumbnailUrl || null,
      previewGif: previewGif || null,
      screenshots: screenshots || null,
      videoUrl: videoUrl || null,
      demoUrl,
      fileUrl: fileUrl || null,
      redirectDownload,
      price,
      version,
      featured,
      published,
      status,
      isFree,
      discountPercent,
      promoStart,
      promoEnd,
      personal,
      showStats,
      views,
      downloadsCount,
      saves,
      affiliateCommissionPercent,
      updatedAt: new Date(),
    })
    .where(eq(products.id, id));

  revalidatePath("/");
  revalidatePath(`/products/${slug}`);
  revalidatePath("/admin/products");
  return { success: true };
}

export async function deleteProductAction(id: string) {
  const user = await getOrCreateDbUser();
  if (!user) {
    throw new Error("Unauthorized: Sign in required.");
  }

  const existing = await db.query.products.findFirst({
    where: eq(products.id, id),
  });

  if (!existing) {
    throw new Error("Product not found");
  }

  const isUserAdmin = user.role === "admin";
  if (!isUserAdmin && existing.creatorId !== user.id) {
    throw new Error("Unauthorized: You do not own this product.");
  }

  await db.delete(products).where(eq(products.id, id));

  revalidatePath("/");
  revalidatePath("/admin/products");
  return { success: true };
}

export async function toggleProductPublishAction(id: string) {
  const isUserAdmin = await isAdmin();
  if (!isUserAdmin) {
    throw new Error("Unauthorized: Admin access required.");
  }

  const existing = await db.query.products.findFirst({
    where: eq(products.id, id),
  });

  if (!existing) {
    throw new Error("Product not found");
  }

  const newPublished = !existing.published;
  const newStatus = newPublished ? "approved" : existing.status;

  await db
    .update(products)
    .set({
      published: newPublished,
      status: newStatus,
      updatedAt: new Date(),
    })
    .where(eq(products.id, id));

  revalidatePath("/");
  revalidatePath(`/products/${existing.slug}`);
  revalidatePath("/admin/products");
  return { success: true };
}

import { categories as categoriesTable, subcategories } from "@/db/schema";

export async function ensureCategoriesSeeded() {
  try {
    // Check if categories exist
    const existingCategories = await db.query.categories.findFirst();
    if (!existingCategories) {
      console.log("Seeding default categories...");
      const DEFAULT_CATEGORIES = [
        { id: "saas-templates", name: "SaaS Templates", slug: "saas-templates" },
        { id: "landing-pages", name: "Landing Pages", slug: "landing-pages" },
        { id: "scripts", name: "Scripts & Automations", slug: "scripts" },
        { id: "design-assets", name: "Design Assets", slug: "design-assets" },
        { id: "ai-prompts", name: "AI Prompts", slug: "ai-prompts" },
        { id: "ebooks", name: "Ebooks & Playbooks", slug: "ebooks" },
      ];
      await db.insert(categoriesTable).values(DEFAULT_CATEGORIES);
    }

    // Check if subcategories exist
    const existingSubcategories = await db.query.subcategories.findFirst();
    if (!existingSubcategories) {
      console.log("Seeding default subcategories...");
      const DEFAULT_SUBCATEGORIES = [
        // SaaS Templates
        { id: "nextjs-react-boilerplates", name: "Next.js & React Boilerplates", slug: "nextjs-react-boilerplates", categoryId: "saas-templates" },
        { id: "python-backends", name: "Python Backends", slug: "python-backends", categoryId: "saas-templates" },
        { id: "rest-apis-microservices", name: "REST APIs & Microservices", slug: "rest-apis-microservices", categoryId: "saas-templates" },
        { id: "mobile-app-starters", name: "Mobile App Starters", slug: "mobile-app-starters", categoryId: "saas-templates" },
        { id: "web3-crypto-templates", name: "Web3 & Crypto Templates", slug: "web3-crypto-templates", categoryId: "saas-templates" },

        // Landing Pages
        { id: "gsap-3d-animated-pages", name: "GSAP & 3D Animated Pages", slug: "gsap-3d-animated-pages", categoryId: "landing-pages" },
        { id: "waitlist-newsletter-pages", name: "Waitlist & Newsletter Pages", slug: "waitlist-newsletter-pages", categoryId: "landing-pages" },
        { id: "saas-pricing-checkout", name: "SaaS Pricing & Checkout", slug: "saas-pricing-checkout", categoryId: "landing-pages" },
        { id: "agency-portfolio-pages", name: "Agency & Portfolio Pages", slug: "agency-portfolio-pages", categoryId: "landing-pages" },
        { id: "no-code-themes", name: "No-Code Themes", slug: "no-code-themes", categoryId: "landing-pages" },

        // Scripts
        { id: "web-scrapers-crawlers", name: "Web Scrapers & Crawlers", slug: "web-scrapers-crawlers", categoryId: "scripts" },
        { id: "browser-extensions", name: "Browser Extensions", slug: "browser-extensions", categoryId: "scripts" },
        { id: "social-media-bots", name: "Social Media Bots", slug: "social-media-bots", categoryId: "scripts" },
        { id: "devops-cicd-pipelines", name: "DevOps & CI/CD Pipelines", slug: "devops-cicd-pipelines", categoryId: "scripts" },
        { id: "script-automation-macros", name: "Script Automation Macros", slug: "script-automation-macros", categoryId: "scripts" },

        // Design Assets
        { id: "tailwind-css-component-kits", name: "Tailwind & CSS Component Kits", slug: "tailwind-css-component-kits", categoryId: "design-assets" },
        { id: "figma-ui-kits-design-systems", name: "Figma UI Kits & Design Systems", slug: "figma-ui-kits-design-systems", categoryId: "design-assets" },
        { id: "custom-svg-icon-libraries", name: "Custom SVG Icon Libraries", slug: "custom-svg-icon-libraries", categoryId: "design-assets" },
        { id: "saas-display-typography", name: "SaaS Display Typography", slug: "saas-display-typography", categoryId: "design-assets" },
        { id: "3d-models-illustrations", name: "3D Models & Illustrations", slug: "3d-models-illustrations", categoryId: "design-assets" },

        // AI Prompts
        { id: "developer-prompt-engineering", name: "Developer Prompt Engineering", slug: "developer-prompt-engineering", categoryId: "ai-prompts" },
        { id: "marketing-copywriter-prompts", name: "Marketing Copywriter Prompts", slug: "marketing-copywriter-prompts", categoryId: "ai-prompts" },
        { id: "creative-ai-recipes", name: "Creative AI Recipes", slug: "creative-ai-recipes", categoryId: "ai-prompts" },
        { id: "autonomous-ai-agents", name: "Autonomous AI Agents", slug: "autonomous-ai-agents", categoryId: "ai-prompts" },

        // Ebooks
        { id: "launch-marketing-playbooks", name: "Launch & Marketing Playbooks", slug: "launch-marketing-playbooks", categoryId: "ebooks" },
        { id: "seo-checklists", name: "SEO Checklists", slug: "seo-checklists", categoryId: "ebooks" },
        { id: "coding-handbooks", name: "Coding Handbooks", slug: "coding-handbooks", categoryId: "ebooks" },
        { id: "creator-business-guides", name: "Creator Business Guides", slug: "creator-business-guides", categoryId: "ebooks" },
      ];
      await db.insert(subcategories).values(DEFAULT_SUBCATEGORIES);
    }

    // Check if products exist
    const existingProducts = await db.query.products.findFirst();
    if (!existingProducts) {
      console.log("Seeding default products...");
      const DEFAULT_PRODUCTS = [
        {
          id: "prod-saas-template",
          title: "SaaS Starter Template",
          slug: "saas-starter-template",
          shortDescription: "A Next.js SaaS starter kit with auth, database, and Stripe/Razorpay integrations pre-configured.",
          description: "This starter kit helps you launch your SaaS product in hours, not weeks.\n\n### Features:\n- Next.js 15 App Router\n- Tailwind CSS styling\n- Drizzle ORM and Postgres database client\n- Full user authentication flow\n- Pre-built landing pages and dashboard",
          category: "saas-templates",
          subcategory: "nextjs-react-boilerplates",
          tags: "nextjs,saas,boilerplate,drizzle",
          thumbnail: "/thumbnails/saas_starter.png",
          demoUrl: "https://demo.scriptlystore.com/saas-starter",
          fileUrl: "/mock/saas-starter.zip",
          price: 100, // ₹1.00
          version: "1.0.0",
          featured: true,
          published: true,
        },
        {
          id: "prod-growth-hacking-ebook",
          title: "Growth Hacking Guide Ebook",
          slug: "growth-hacking-guide-ebook",
          shortDescription: "The ultimate ebook guide containing 50+ growth tactics to scale your digital product or community.",
          description: "Learn how we scaled ScriptlyHQ from 0 to 10k users in 3 months.\n\n### What's inside:\n- SEO and Content Marketing frameworks\n- Viral referral loops setup\n- Cold email templates that convert\n- Interactive marketing tactics checklist",
          category: "ebooks",
          subcategory: "launch-marketing-playbooks",
          tags: "marketing,growth,ebook,guide",
          thumbnail: "/thumbnails/growth_guide.png",
          demoUrl: null,
          fileUrl: "/mock/growth-guide.pdf",
          price: 300, // ₹3.00
          version: "2.1.0",
          featured: true,
          published: true,
        },
        {
          id: "prod-copywriter-prompt",
          title: "Marketing Copywriter AI Prompt",
          slug: "marketing-copywriter-ai-prompt",
          shortDescription: "Advanced LLM system prompt to write high-converting landing pages, ads, and email sequences.",
          description: "Get copy that sells. Tested on GPT-4 and Claude 3.5 Sonnet to produce conversion rates 2x higher than standard drafts.\n\n### Includes:\n- Headline writing prompts\n- Full page copy outline generator\n- Call-to-action variants creator",
          category: "ai-prompts",
          subcategory: "marketing-copywriter-prompts",
          tags: "ai,prompt,gpt,claude,marketing",
          thumbnail: "/thumbnails/copywriter_prompt.png",
          demoUrl: null,
          fileUrl: "/mock/copywriter-prompt.txt",
          price: 400, // ₹4.00
          version: "1.0.0",
          featured: false,
          published: true,
        },
        {
          id: "prod-chrome-extension-boilerplate",
          title: "Chrome Extension Boilerplate",
          slug: "chrome-extension-boilerplate",
          shortDescription: "A Manifest V3 extension boilerplate with React, Tailwind CSS, and message passing structure.",
          description: "Launch browser extensions instantly. Clean structure with options page, popup UI, and background scripts.\n\n### Features:\n- Manifest V3 compliant\n- React + TypeScript popup\n- Tailwind CSS for premium styles\n- Message passing utilities",
          category: "scripts",
          subcategory: "browser-extensions",
          tags: "chrome,extension,javascript,react",
          thumbnail: "/thumbnails/chrome_boilerplate.png",
          demoUrl: "https://demo.scriptlystore.com/chrome-extension",
          fileUrl: "/mock/chrome-boilerplate.zip",
          price: 1000, // ₹10.00
          version: "1.2.0",
          featured: false,
          published: true,
        },
        {
          id: "prod-glassmorphism-ui-kit",
          title: "Tailwind Glassmorphism UI Kit",
          slug: "tailwind-glassmorphism-ui-kit",
          shortDescription: "A collection of 30+ premium glassmorphic UI components styled with Tailwind CSS.",
          description: "Wow your users with modern, elegant design layouts. Includes charts, navigations, form inputs, and modal designs.\n\n### Inclusions:\n- Fully responsive grid layouts\n- Smooth CSS backdrop blur overrides\n- Light and dark theme variables support",
          category: "design-assets",
          subcategory: "tailwind-css-component-kits",
          tags: "tailwind,ui,glassmorphism,css",
          thumbnail: "/thumbnails/glass_ui.png",
          demoUrl: "https://demo.scriptlystore.com/glassmorphism",
          fileUrl: "/mock/glass-ui-kit.zip",
          price: 4900, // ₹49.00
          version: "1.0.0",
          featured: false,
          published: true,
        },
        {
          id: "prod-solo-dev-micro-saas",
          title: "The Solo Developer's Guide to Micro-SaaS",
          slug: "solo-developers-guide-to-micro-saas",
          shortDescription: "A complete roadmap for software engineers to validate, build, launch, and scale profitable Micro-SaaS products to $5,000/month in recurring revenue.",
          description: "Most developers fail not because their code is bad, but because they build things nobody wants. This eBook teaches you the business side of coding.\n\n### What's Inside:\n- Ideation & Validation: How to find high-intent problems worth paying for.\n- MVP Blueprint: Deciding what features to build first and what to ignore.\n- Stripe & Customer Operations: Handling subscriptions, tax compliance, and refunds.\n- Cold Outreach Templates: Copy-paste scripts to acquire your first 50 paid users.",
          category: "ebooks",
          subcategory: "creator-business-guides",
          tags: "saas,indie-hacking,micro-saas,business",
          thumbnail: "https://iili.io/CAQrjUX.jpg",
          demoUrl: null,
          fileUrl: "/mock/solo-developers-guide-to-micro-saas.pdf",
          price: 1900, // $19.00
          version: "1.0.0",
          featured: true,
          published: true,
          status: "approved",
          rating: "4.9",
          ratingCount: 18,
          views: 2840,
          downloadsCount: 247,
          saves: 189,
          showStats: true,
        },
        {
          id: "prod-seo-for-developers",
          title: "SEO for Developers: Rank Without a Marketing Budget",
          slug: "seo-for-developers",
          shortDescription: "The technical search engine optimization handbook. Learn to optimize React components, fix hydration layout shifts, and dominate Google search results.",
          description: "Stop paying for ads. This book teaches you how to leverage your technical skills to drive thousands of free organic visits to your products every single day.\n\n### What's Inside:\n- Server-Side Rendering (SSR) Optimization: Structuring metadata, OpenGraph tags, and JSON-LD schemas.\n- Lighthouse Score Mastery: Optimizing Core Web Vitals (LCP, FID, CLS) to score a perfect 100/100.\n- Programmatic SEO: Building hundreds of dynamic landing pages that rank for long-tail keywords.\n- XML Sitemaps & Indexing: Configuring IndexNow and instant indexing APIs.",
          category: "ebooks",
          subcategory: "seo-checklists",
          tags: "seo,marketing,nextjs,nextjs-seo",
          thumbnail: "https://iili.io/CAQreOG.jpg",
          demoUrl: null,
          fileUrl: "/mock/seo-for-developers.pdf",
          price: 1200, // $12.00
          version: "1.0.0",
          featured: true,
          published: true,
          status: "approved",
          rating: "4.8",
          ratingCount: 14,
          views: 1980,
          downloadsCount: 168,
          saves: 112,
          showStats: true,
        },
        {
          id: "prod-design-for-developers",
          title: "Design for Developers: Build Premium Interfaces with Tailwind CSS",
          slug: "design-for-developers-tailwind",
          shortDescription: "Learn UI/UX design fundamentals, typography rules, dark mode scaling, and color theory specifically using Tailwind CSS variables.",
          description: "You don't need a designer to build stunning websites. Master the visual principles that make apps look professional, modern, and high-converting.\n\n### What's Inside:\n- Visual Hierarchy: How spacing, size, and layout guide your user's eyes to the \"Buy Now\" button.\n- Tailwind Color Architecture: Setting up premium HSL-tailored dark modes and gradients.\n- Typography Rules: Pairing pairing modern fonts (Inter, Geist, Outfit) and choosing perfect line-heights.\n- Micro-Animations: Adding interactive hover and transition effects using Tailwind transition classes.",
          category: "ebooks",
          subcategory: "creator-business-guides",
          tags: "design,tailwind,ui-ux,css",
          thumbnail: "https://iili.io/CAQrrfS.jpg",
          demoUrl: null,
          fileUrl: "/mock/design-for-developers-tailwind.pdf",
          price: 1500, // $15.00
          version: "1.0.0",
          featured: true,
          published: true,
          status: "approved",
          rating: "5.0",
          ratingCount: 22,
          views: 3120,
          downloadsCount: 289,
          saves: 215,
          showStats: true,
        },
        {
          id: "prod-api-design-patterns",
          title: "API Design Patterns & Serverless Architecture Playbook",
          slug: "api-design-patterns-serverless",
          shortDescription: "A masterclass in architecting resilient serverless APIs, database caching layers, and Webhook security with Drizzle ORM and Neon Postgres.",
          description: "Scale your app to millions of requests without high server bills. Learn patterns for rate-limiting, batching queries, and securing API endpoints.\n\n### What's Inside:\n- Database Caching: Integrating Redis or Cloudflare KV to bypass heavy SQL lookups.\n- Serverless API Performance: Avoiding database connection pooling leaks inside Next.js edge route handlers.\n- Webhook Reliability: Writing retry mechanisms and signature verification for payment processors.\n- Rate Limiting: Building token-bucket middleware using serverless edge runtimes.",
          category: "ebooks",
          subcategory: "coding-handbooks",
          tags: "api,backend,nextjs,serverless,edge",
          thumbnail: "https://iili.io/CAQrLOb.jpg",
          demoUrl: null,
          fileUrl: "/mock/api-design-patterns-serverless.pdf",
          price: 2400, // $24.00
          version: "1.0.0",
          featured: true,
          published: true,
          status: "approved",
          rating: "4.9",
          ratingCount: 19,
          views: 2450,
          downloadsCount: 198,
          saves: 154,
          showStats: true,
        },
        {
          id: "prod-ai-automation-scraping",
          title: "The AI Automation & Scraping Playbook",
          slug: "ai-automation-scraping-playbook",
          shortDescription: "Learn to build automated scraping scripts, headless browser engines, and AI pipelines to save hours of manual data entry.",
          description: "A practical guide to automating the web. Build systems that monitor competitors, scrape structured data, and feed information into LLM pipelines.\n\n### What's Inside:\n- Headless Browsers: Scripting Puppeteer and Playwright to bypass Cloudflare and CAPTCHAs.\n- Data Structuring: Using Cheerio and Node.js streams to process huge datasets.\n- LLM Context Pipelines: Automatically scraping blogs/documentation and converting them into vector embeddings.\n- Cron Automation: Running background jobs on GitHub Actions or Cloudflare Workers.",
          category: "ebooks",
          subcategory: "coding-handbooks",
          tags: "ai,automation,scraping,puppeteer,nodejs",
          thumbnail: "https://iili.io/CAQrDWQ.jpg",
          demoUrl: null,
          fileUrl: "/mock/ai-automation-scraping-playbook.pdf",
          price: 1900, // $19.00
          version: "1.0.0",
          featured: true,
          published: true,
          status: "approved",
          rating: "4.9",
          ratingCount: 26,
          views: 3560,
          downloadsCount: 312,
          saves: 242,
          showStats: true,
        },
      ];

      await db.insert(products).values(DEFAULT_PRODUCTS);
    }
  } catch (err) {
    // Check if the error is about missing tables
    const errorMessage = err instanceof Error ? err.message : String(err);
    if (errorMessage.includes('relation "categories" does not exist') || 
        errorMessage.includes('relation "products" does not exist') ||
        errorMessage.includes('Failed query')) {
      console.warn("Database tables not found. Please run migrations.");
    } else {
      console.error("Failed to seed categories and products:", err);
    }
  }
}

export async function getCategoriesAction() {
  try {
    // We don't seed on every request anymore to keep things clean
    return await db.query.categories.findMany();
  } catch (err) {
    console.error("getCategoriesAction failed:", err);
    return [];
  }
}

export async function getSubcategoriesAction() {
  try {
    return await db.query.subcategories.findMany();
  } catch (err) {
    console.error("getSubcategoriesAction failed:", err);
    return [];
  }
}

export async function getProductsAction(options?: { 
  category?: string; 
  subcategory?: string;
  search?: string;
  tag?: string;
  priceType?: "all" | "free" | "paid";
  featuredOnly?: boolean;
  sortBy?: "newest" | "rating" | "price_asc" | "price_desc" | "featured_premium";
  page?: number;
  limit?: number;
}) {
  try {
    const page = options?.page || 1;
    const limit = options?.limit || 12;
    const offset = (page - 1) * limit;

    const allProducts = await db.query.products.findMany({
      orderBy: [desc(products.createdAt)],
    });

    let filtered = allProducts.filter((p) => p.published && p.status === "approved");

    if (options?.featuredOnly) {
      filtered = filtered.filter((p) => p.featured);
    }

    if (options?.category && options.category !== "all") {
      filtered = filtered.filter((p) => p.category === options.category);
    }

    if (options?.subcategory) {
      filtered = filtered.filter((p) => p.subcategory === options.subcategory);
    }

    if (options?.priceType && options.priceType !== "all") {
      if (options.priceType === "free") {
        filtered = filtered.filter((p) => p.isFree || p.price === 0);
      } else if (options.priceType === "paid") {
        filtered = filtered.filter((p) => !p.isFree && p.price > 0);
      }
    }

    if (options?.tag) {
      const tagTerm = options.tag.toLowerCase();
      filtered = filtered.filter((p) => 
        p.tags?.toLowerCase().split(",").map(t => t.trim()).includes(tagTerm)
      );
    }

    if (options?.search) {
      const term = options.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(term) ||
          p.shortDescription.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term) ||
          (p.tags && p.tags.toLowerCase().includes(term))
      );
    }

    // Apply sorting
    const sortBy = options?.sortBy || "newest";
    if (sortBy === "rating") {
      filtered.sort((a, b) => parseFloat(b.rating || "0") - parseFloat(a.rating || "0"));
    } else if (sortBy === "price_asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_desc") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === "featured_premium") {
      filtered.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        
        const aPremium = !a.isFree && a.price > 0;
        const bPremium = !b.isFree && b.price > 0;
        if (aPremium && !bPremium) return -1;
        if (!aPremium && bPremium) return 1;
        
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    } else {
      // newest: default
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    const total = filtered.length;
    const paginated = filtered.slice(offset, offset + limit);

    return {
      products: paginated,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    };
  } catch (err) {
    console.error("getProductsAction failed:", err);
    return {
      products: [],
      total: 0,
      totalPages: 0,
      currentPage: 1
    };
  }
}

export async function approveProductAction(id: string) {
  const isUserAdmin = await isAdmin();
  if (!isUserAdmin) {
    throw new Error("Unauthorized: Admin access required.");
  }

  await db
    .update(products)
    .set({
      status: "approved",
      published: true,
      updatedAt: new Date(),
    })
    .where(eq(products.id, id));

  revalidatePath("/");
  revalidatePath("/admin/products");
  revalidatePath("/admin/approvals");
  return { success: true };
}

export async function rejectProductAction(id: string) {
  const isUserAdmin = await isAdmin();
  if (!isUserAdmin) {
    throw new Error("Unauthorized: Admin access required.");
  }

  await db
    .update(products)
    .set({
      status: "rejected",
      published: false,
      updatedAt: new Date(),
    })
    .where(eq(products.id, id));

  revalidatePath("/");
  revalidatePath("/admin/products");
  revalidatePath("/admin/approvals");
  return { success: true };
}

export async function rateProductAction(productId: string, ratingValue: number) {
  if (ratingValue < 1 || ratingValue > 5) {
    throw new Error("Invalid rating value. Must be between 1 and 5.");
  }

  const existing = await db.query.products.findFirst({
    where: eq(products.id, productId),
  });

  if (!existing) {
    throw new Error("Product not found");
  }

  const currentCount = existing.ratingCount || 0;
  const currentRating = parseFloat(existing.rating || "5.0");
  const currentSum = currentRating * currentCount;

  const newCount = currentCount + 1;
  const newRating = ((currentSum + ratingValue) / newCount).toFixed(1);

  await db
    .update(products)
    .set({
      rating: newRating,
      ratingCount: newCount,
    })
    .where(eq(products.id, productId));

  revalidatePath(`/products/${existing.slug}`);
  revalidatePath("/");
  return { success: true, rating: newRating };
}

