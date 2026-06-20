import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../../db";
import { products } from "../../../../../db/schema";
import { eq, or } from "drizzle-orm";

function authorize(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false;
  }
  const token = authHeader.substring(7);
  return token === process.env.AGENT_API_KEY;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!authorize(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    
    const result = await db
      .select()
      .from(products)
      .where(or(eq(products.id, id), eq(products.slug, id)))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: result[0] });
  } catch (error: any) {
    console.error("Agent API GET single product failed:", error);
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!authorize(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json() as any;

    const result = await db
      .select()
      .from(products)
      .where(or(eq(products.id, id), eq(products.slug, id)))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const product = result[0];
    const updateData: any = {};

    const fields = [
      "title", "slug", "shortDescription", "description", "category", "subcategory",
      "tags", "thumbnail", "previewGif", "screenshots", "videoUrl", "demoUrl",
      "fileUrl", "redirectDownload", "price", "version", "featured", "published",
      "creatorId", "status", "rating", "ratingCount", "isFree", "discountPercent"
    ];

    for (const field of fields) {
      if (body[field] !== undefined) {
        if (field === "slug") {
          updateData.slug = body.slug
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");

          if (updateData.slug !== product.slug) {
            const conflict = await db
              .select({ id: products.id })
              .from(products)
              .where(eq(products.slug, updateData.slug))
              .limit(1);
            if (conflict.length > 0) {
              return NextResponse.json({ error: `Slug '${updateData.slug}' is already taken.` }, { status: 409 });
            }
          }
        } else if (field === "price" || field === "ratingCount" || field === "discountPercent") {
          updateData[field] = Number(body[field]);
        } else if (field === "featured" || field === "published" || field === "isFree" || field === "redirectDownload") {
          updateData[field] = !!body[field];
        } else {
          updateData[field] = body[field];
        }
      }
    }

    if (body.promoStart !== undefined) updateData.promoStart = body.promoStart ? new Date(body.promoStart) : null;
    if (body.promoEnd !== undefined) updateData.promoEnd = body.promoEnd ? new Date(body.promoEnd) : null;
    
    updateData.updatedAt = new Date();

    await db.update(products).set(updateData).where(eq(products.id, product.id));

    return NextResponse.json({ success: true, message: "Product updated successfully" });
  } catch (error: any) {
    console.error("Agent API PATCH product failed:", error);
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!authorize(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    const result = await db
      .select({ id: products.id })
      .from(products)
      .where(or(eq(products.id, id), eq(products.slug, id)))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await db.delete(products).where(eq(products.id, result[0].id));

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error: any) {
    console.error("Agent API DELETE product failed:", error);
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
