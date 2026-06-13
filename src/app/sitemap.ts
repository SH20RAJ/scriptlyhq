import { MetadataRoute } from "next";
import { db } from "../db";
import { products } from "../db/schema";
import { eq } from "drizzle-orm";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://scriptlyhq.com";

  // Fetch all published products to map
  let productEntries: any[] = [];
  try {
    const publishedProducts = await db.query.products.findMany({
      where: eq(products.published, true),
    });

    productEntries = publishedProducts.map((prod) => ({
      url: `${baseUrl}/products/${prod.slug}`,
      lastModified: new Date(prod.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error("Error generating sitemap product urls:", error);
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    ...productEntries,
  ];
}
