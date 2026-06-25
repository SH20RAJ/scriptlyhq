import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products, users, categories, subcategories } from "@/db/schema";
import { eq, and, SQL } from "drizzle-orm";
import { getProductEffectivePrice } from "@/lib/price-utils";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get("limit");
  const category = searchParams.get("category");
  const subcategory = searchParams.get("subcategory");
  const slug = searchParams.get("slug");
  const featured = searchParams.get("featured");

  try {
    const conditions: SQL[] = [
      eq(products.published, true),
      eq(products.status, "approved"),
    ];

    if (slug) {
      conditions.push(eq(products.slug, slug));
    }
    if (category) {
      conditions.push(eq(products.category, category));
    }
    if (subcategory) {
      conditions.push(eq(products.subcategory, subcategory));
    }
    if (featured === "true") {
      conditions.push(eq(products.featured, true));
    }

    let query = db
      .select({
        product: products,
        creator: {
          storeName: users.storeName,
        },
        categoryName: categories.name,
        subcategoryName: subcategories.name,
      })
      .from(products)
      .leftJoin(users, eq(products.creatorId, users.id))
      .leftJoin(categories, eq(products.category, categories.slug))
      .leftJoin(subcategories, eq(products.subcategory, subcategories.slug))
      .where(and(...conditions));

    if (limit) {
      const limitNum = parseInt(limit);
      if (!isNaN(limitNum)) {
        query = query.limit(limitNum) as any;
      }
    }

    const allProducts = await query;

    const publicProducts = allProducts.map(({ product, creator, categoryName, subcategoryName }) => {
      const parsedScreenshots = product.screenshots 
        ? product.screenshots.split(",").map(s => s.trim()).filter(Boolean)
        : [];

      const priceInfo = getProductEffectivePrice(product);

      return {
        id: product.id,
        title: product.title,
        slug: product.slug,
        shortDescription: product.shortDescription,
        description: product.description,
        category: product.category,
        categoryName: categoryName || product.category,
        subcategory: product.subcategory,
        subcategoryName: subcategoryName || product.subcategory,
        tags: product.tags ? product.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
        thumbnail: product.thumbnail,
        previewGif: product.previewGif,
        screenshots: parsedScreenshots,
        videoUrl: product.videoUrl,
        demoUrl: product.demoUrl,
        price: product.price,
        priceFormatted: (product.price / 100).toFixed(2),
        effectivePrice: priceInfo.effectivePrice,
        effectivePriceFormatted: (priceInfo.effectivePrice / 100).toFixed(2),
        isFree: priceInfo.isFree,
        hasDiscount: priceInfo.hasDiscount,
        discountPercent: priceInfo.discountPercent,
        promoEnd: product.promoEnd,
        version: product.version,
        featured: product.featured,
        rating: product.rating,
        ratingCount: product.ratingCount,
        storeName: creator?.storeName || "Scriptly Store",
        url: `https://scriptly.store/products/${product.slug}`,
        createdAt: product.createdAt,
      };
    });

    return NextResponse.json({
      success: true,
      count: publicProducts.length,
      products: publicProducts
    });
  } catch (error) {
    console.error("GET public products failed:", error);
    return NextResponse.json({ error: "Server error fetching products." }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
