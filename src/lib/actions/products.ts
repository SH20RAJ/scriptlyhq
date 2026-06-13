"use server";

import { db } from "../../db";
import { products } from "../../db/schema";
import { eq, desc } from "drizzle-orm";
import { isAdmin } from "../auth-utils";
import { saveProductFile, saveThumbnailFile, deleteProductFile, deleteThumbnailFile } from "../storage";
import { revalidatePath } from "next/cache";

export async function createProductAction(formData: FormData) {
  const authorized = await isAdmin();
  if (!authorized) {
    throw new Error("Unauthorized: Admin access required.");
  }

  const title = formData.get("title") as string;
  let slug = formData.get("slug") as string;
  if (!slug) {
    slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  
  const shortDescription = formData.get("shortDescription") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const tags = formData.get("tags") as string;
  const demoUrl = (formData.get("demoUrl") as string) || null;
  const price = Math.round(parseFloat(formData.get("price") as string) * 100); // convert to paise
  const version = (formData.get("version") as string) || "1.0.0";
  const featured = formData.get("featured") === "true";
  const published = formData.get("published") === "true";

  const thumbnailFile = formData.get("thumbnail") as File;
  const productFile = formData.get("file") as File;

  let thumbnailUrl: string | null = null;
  if (thumbnailFile && thumbnailFile.size > 0) {
    thumbnailUrl = await saveThumbnailFile(thumbnailFile);
  }

  let fileUrl: string | null = null;
  if (productFile && productFile.size > 0) {
    fileUrl = await saveProductFile(productFile);
  }

  const id = crypto.randomUUID();

  await db.insert(products).values({
    id,
    title,
    slug,
    shortDescription,
    description,
    category,
    tags: tags || null,
    thumbnail: thumbnailUrl,
    demoUrl,
    fileUrl,
    price,
    version,
    featured,
    published,
  });

  revalidatePath("/");
  revalidatePath("/admin/products");
  return { success: true };
}

export async function updateProductAction(id: string, formData: FormData) {
  const authorized = await isAdmin();
  if (!authorized) {
    throw new Error("Unauthorized: Admin access required.");
  }

  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const shortDescription = formData.get("shortDescription") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const tags = formData.get("tags") as string;
  const demoUrl = (formData.get("demoUrl") as string) || null;
  const price = Math.round(parseFloat(formData.get("price") as string) * 100);
  const version = formData.get("version") as string;
  const featured = formData.get("featured") === "true";
  const published = formData.get("published") === "true";

  const thumbnailFile = formData.get("thumbnail") as File;
  const productFile = formData.get("file") as File;

  const existing = await db.query.products.findFirst({
    where: eq(products.id, id),
  });

  if (!existing) {
    throw new Error("Product not found");
  }

  let thumbnailUrl = existing.thumbnail;
  if (thumbnailFile && thumbnailFile.size > 0) {
    if (existing.thumbnail) {
      await deleteThumbnailFile(existing.thumbnail);
    }
    thumbnailUrl = await saveThumbnailFile(thumbnailFile);
  }

  let fileUrl = existing.fileUrl;
  if (productFile && productFile.size > 0) {
    if (existing.fileUrl) {
      await deleteProductFile(existing.fileUrl);
    }
    fileUrl = await saveProductFile(productFile);
  }

  await db
    .update(products)
    .set({
      title,
      slug,
      shortDescription,
      description,
      category,
      tags: tags || null,
      thumbnail: thumbnailUrl,
      demoUrl,
      fileUrl,
      price,
      version,
      featured,
      published,
      updatedAt: new Date(),
    })
    .where(eq(products.id, id));

  revalidatePath("/");
  revalidatePath(`/products/${slug}`);
  revalidatePath("/admin/products");
  return { success: true };
}

export async function deleteProductAction(id: string) {
  const authorized = await isAdmin();
  if (!authorized) {
    throw new Error("Unauthorized: Admin access required.");
  }

  const existing = await db.query.products.findFirst({
    where: eq(products.id, id),
  });

  if (!existing) {
    throw new Error("Product not found");
  }

  if (existing.thumbnail) {
    await deleteThumbnailFile(existing.thumbnail);
  }
  if (existing.fileUrl) {
    await deleteProductFile(existing.fileUrl);
  }

  await db.delete(products).where(eq(products.id, id));

  revalidatePath("/");
  revalidatePath("/admin/products");
  return { success: true };
}

import { categories as categoriesTable } from "../../db/schema";

export async function ensureCategoriesSeeded() {
  try {
    const existing = await db.query.categories.findFirst();
    if (!existing) {
      const DEFAULT_CATEGORIES = [
        { id: "landing-pages", name: "Landing Pages", slug: "landing-pages" },
        { id: "saas-templates", name: "SaaS Templates", slug: "saas-templates" },
        { id: "ebooks", name: "Ebooks", slug: "ebooks" },
        { id: "ai-prompts", name: "AI Prompts", slug: "ai-prompts" },
        { id: "scripts", name: "Scripts", slug: "scripts" },
        { id: "ui-kits", name: "UI Kits", slug: "ui-kits" },
        { id: "other", name: "Other", slug: "other" },
      ];
      await db.insert(categoriesTable).values(DEFAULT_CATEGORIES);
    }

    const existingProducts = await db.query.products.findFirst();
    if (!existingProducts) {
      const DEFAULT_PRODUCTS = [
        {
          id: "prod-saas-template",
          title: "SaaS Starter Template",
          slug: "saas-starter-template",
          shortDescription: "A Next.js SaaS starter kit with auth, database, and Stripe/Razorpay integrations pre-configured.",
          description: "This starter kit helps you launch your SaaS product in hours, not weeks.\n\n### Features:\n- Next.js 15 App Router\n- Tailwind CSS styling\n- Drizzle ORM and Postgres database client\n- Full user authentication flow\n- Pre-built landing pages and dashboard",
          category: "saas-templates",
          tags: "nextjs,saas,boilerplate,drizzle",
          thumbnail: null,
          demoUrl: "https://demo.scriptlyhq.com/saas-starter",
          fileUrl: null as string | null,
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
          tags: "marketing,growth,ebook,guide",
          thumbnail: null,
          demoUrl: null,
          fileUrl: null as string | null,
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
          tags: "ai,prompt,gpt,claude,marketing",
          thumbnail: null,
          demoUrl: null,
          fileUrl: null as string | null,
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
          tags: "chrome,extension,javascript,react",
          thumbnail: null,
          demoUrl: "https://demo.scriptlyhq.com/chrome-extension",
          fileUrl: null as string | null,
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
          category: "ui-kits",
          tags: "tailwind,ui,glassmorphism,css",
          thumbnail: null,
          demoUrl: "https://demo.scriptlyhq.com/glassmorphism",
          fileUrl: null as string | null,
          price: 4900, // ₹49.00
          version: "1.0.0",
          featured: false,
          published: true,
        },
      ];

      const path = await import("path");
      const fs = await import("fs/promises");
      const uploadDir = path.join(process.cwd(), "uploads");
      await fs.mkdir(uploadDir, { recursive: true });

      for (const prod of DEFAULT_PRODUCTS) {
        const mockFilePath = path.join(uploadDir, `${prod.id}-mock-release.zip`);
        await fs.writeFile(mockFilePath, `Mock product archive content for ${prod.title}`);
        prod.fileUrl = mockFilePath;
      }

      await db.insert(products).values(DEFAULT_PRODUCTS);
    }
  } catch (err) {
    console.error("Failed to seed categories and products:", err);
  }
}

export async function getCategoriesAction() {
  await ensureCategoriesSeeded();
  return await db.query.categories.findMany();
}

export async function getProductsAction(options?: { category?: string; search?: string }) {
  await ensureCategoriesSeeded();
  
  const allProducts = await db.query.products.findMany({
    orderBy: [desc(products.createdAt)],
  });

  let filtered = allProducts.filter((p) => p.published);

  if (options?.category && options.category !== "all") {
    filtered = filtered.filter((p) => p.category === options.category);
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

  return filtered;
}

