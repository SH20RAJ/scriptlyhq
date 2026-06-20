import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../db";
import { products } from "../../../../db/schema";
import { eq, and, like } from "drizzle-orm";
import crypto from "crypto";

function authorize(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false;
  }
  const token = authHeader.substring(7);
  return token === process.env.AGENT_API_KEY;
}

export async function GET(request: NextRequest) {
  if (!authorize(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const publishedParam = searchParams.get("published");
    const tag = searchParams.get("tag");
    const limit = Math.min(parseInt(searchParams.get("limit") || "100"), 500);
    const offset = parseInt(searchParams.get("offset") || "0");

    const conditions = [];
    if (category) conditions.push(eq(products.category, category));
    if (status) conditions.push(eq(products.status, status));
    if (publishedParam !== null) {
      conditions.push(eq(products.published, publishedParam === "true"));
    }
    if (tag) {
      conditions.push(like(products.tags, `%${tag}%`));
    }

    const query = db.select().from(products);
    if (conditions.length > 0) {
      query.where(and(...conditions));
    }

    const results = await query.limit(limit).offset(offset);

    return NextResponse.json({ success: true, count: results.length, products: results });
  } catch (error: any) {
    console.error("Agent API GET products failed:", error);
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!authorize(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json() as any;

    const required = ["title", "slug", "shortDescription", "description", "category", "price"];
    for (const field of required) {
      if (body[field] === undefined || body[field] === null) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    const cleanSlug = body.slug
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const existing = await db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.slug, cleanSlug))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json({ error: `Slug '${cleanSlug}' already exists.` }, { status: 409 });
    }

    const id = crypto.randomUUID();

    await db.insert(products).values({
      id,
      title: body.title,
      slug: cleanSlug,
      shortDescription: body.shortDescription,
      description: body.description,
      category: body.category,
      subcategory: body.subcategory || null,
      tags: body.tags || null,
      thumbnail: body.thumbnail || null,
      previewGif: body.previewGif || null,
      screenshots: body.screenshots || null,
      videoUrl: body.videoUrl || null,
      demoUrl: body.demoUrl || null,
      fileUrl: body.fileUrl || null,
      redirectDownload: body.redirectDownload !== undefined ? body.redirectDownload : true,
      price: Number(body.price),
      version: body.version || "1.0.0",
      featured: !!body.featured,
      published: body.published !== undefined ? !!body.published : true,
      creatorId: body.creatorId || null,
      status: body.status || "approved",
      rating: body.rating || "5.0",
      ratingCount: body.ratingCount !== undefined ? Number(body.ratingCount) : 1,
      isFree: !!body.isFree,
      discountPercent: body.discountPercent !== undefined ? Number(body.discountPercent) : 0,
      promoStart: body.promoStart ? new Date(body.promoStart) : null,
      promoEnd: body.promoEnd ? new Date(body.promoEnd) : null,
    });

    return NextResponse.json({ success: true, id, slug: cleanSlug }, { status: 201 });
  } catch (error: any) {
    console.error("Agent API POST product failed:", error);
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
