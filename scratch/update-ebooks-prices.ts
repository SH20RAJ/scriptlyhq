import { db } from "../src/db";
import { products } from "../src/db/schema";
import { eq } from "drizzle-orm";

const UPDATES = [
  {
    slug: "solo-developers-guide-to-micro-saas",
    price: 1900, // $19.00
    thumbnail: "https://iili.io/CAQrjUX.jpg",
  },
  {
    slug: "seo-for-developers",
    price: 1200, // $12.00
    thumbnail: "https://iili.io/CAQreOG.jpg",
  },
  {
    slug: "design-for-developers-tailwind",
    price: 1500, // $15.00
    thumbnail: "https://iili.io/CAQrrfS.jpg",
  },
  {
    slug: "api-design-patterns-serverless",
    price: 2400, // $24.00
    thumbnail: "https://iili.io/CAQrLOb.jpg",
  },
  {
    slug: "ai-automation-scraping-playbook",
    price: 1900, // $19.00
    thumbnail: "https://iili.io/CAQrDWQ.jpg",
  },
];

async function run() {
  console.log("Updating database with market-rate prices and CDN thumbnails...");
  for (const item of UPDATES) {
    const existing = await db.query.products.findFirst({
      where: eq(products.slug, item.slug),
    });

    if (existing) {
      await db
        .update(products)
        .set({
          price: item.price,
          thumbnail: item.thumbnail,
          updatedAt: new Date(),
        })
        .where(eq(products.id, existing.id));
      console.log(`Updated "${existing.title}": Price = $${item.price / 100}, Thumbnail = ${item.thumbnail}`);
    } else {
      console.warn(`Product not found for slug: ${item.slug}`);
    }
  }
  console.log("Database update complete!");
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
