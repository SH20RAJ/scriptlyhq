import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { categories, subcategories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { isAdmin } from "@/lib/auth-utils";

export async function GET() {
  const authorized = await isAdmin();
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized: Admin access required." }, { status: 401 });
  }

  try {
    const allCategories = await db.query.categories.findMany();
    const allSubcategories = await db.query.subcategories.findMany();

    // Map subcategories inside categories
    const categoriesWithSub = allCategories.map((cat) => ({
      ...cat,
      subcategories: allSubcategories.filter((sub) => sub.categoryId === cat.id),
    }));

    return NextResponse.json({ success: true, categories: categoriesWithSub });
  } catch (error) {
    console.error("GET admin categories failed:", error);
    return NextResponse.json({ error: "Server error fetching categories." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authorized = await isAdmin();
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized: Admin access required." }, { status: 401 });
  }

  try {
    const body = (await request.json()) as any;
    const { type, name, slug, categoryId } = body;

    if (!type || !name || !slug) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const cleanSlug = slug
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    if (type === "category") {
      // Check if category slug already exists
      const existing = await db.query.categories.findFirst({
        where: eq(categories.slug, cleanSlug),
      });

      if (existing) {
        return NextResponse.json({ error: "Category slug already exists." }, { status: 409 });
      }

      const id = cleanSlug; // Using slug as ID or generating one

      await db.insert(categories).values({
        id,
        name,
        slug: cleanSlug,
      });

      return NextResponse.json({ success: true });
    } else if (type === "subcategory") {
      if (!categoryId) {
        return NextResponse.json({ error: "Category ID is required for subcategory." }, { status: 400 });
      }

      // Check if subcategory slug already exists
      const existing = await db.query.subcategories.findFirst({
        where: eq(subcategories.slug, cleanSlug),
      });

      if (existing) {
        return NextResponse.json({ error: "Subcategory slug already exists." }, { status: 409 });
      }

      const id = cleanSlug;

      await db.insert(subcategories).values({
        id,
        name,
        slug: cleanSlug,
        categoryId,
      });

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Invalid type specified." }, { status: 400 });
    }
  } catch (error) {
    console.error("POST admin categories failed:", error);
    return NextResponse.json({ error: "Server error creating category or subcategory." }, { status: 500 });
  }
}
export const dynamic = "force-dynamic";
