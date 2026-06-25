import { db } from "@/db";
import { products } from "@/db/schema";
import { like } from "drizzle-orm";

async function main() {
  try {
    const codrops = await db.select({
      id: products.id,
      title: products.title,
      slug: products.slug,
      videoUrl: products.videoUrl,
      previewGif: products.previewGif,
    })
    .from(products)
    .where(like(products.slug, "codrops-%"))
    .limit(10);
    console.log("Codrops products in DB:", codrops);
  } catch (err) {
    console.error("Failed to query products:", err);
  }
}
main();
