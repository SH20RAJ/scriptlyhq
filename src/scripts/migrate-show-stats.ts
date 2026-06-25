import { db } from "@/db";
import { products } from "@/db/schema";
import { sql } from "drizzle-orm";

async function main() {
  console.log("Starting show_stats migration...");
  try {
    // 1. Run raw SQL to add show_stats column if not exists
    console.log("Adding show_stats column to database...");
    await db.execute(sql`
      ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS show_stats boolean DEFAULT false NOT NULL;
    `);
    console.log("Column added successfully!");

    // 2. Fetch all products to seed them
    console.log("Seeding products with simulated views, downloads, and saves...");
    const allProducts = await db.query.products.findMany();
    
    for (const prod of allProducts) {
      // Seed 2k to 10k views
      const views = Math.floor(Math.random() * (10000 - 2000 + 1)) + 2000;
      
      // Seed downloads count (5% to 15% of views)
      const downloadsCount = Math.floor(views * (Math.random() * (0.15 - 0.05) + 0.05));
      
      // Seed saves (2% to 8% of views)
      const saves = Math.floor(views * (Math.random() * (0.08 - 0.02) + 0.02));

      await db.update(products)
        .set({
          views,
          downloadsCount,
          saves,
          showStats: false, // Defaulting to hidden per request
        })
        .where(sql`id = ${prod.id}`);
      
      console.log(`Product: "${prod.title}" -> Views: ${views}, Downloads: ${downloadsCount}, Saves: ${saves}`);
    }

    console.log("Seeding migration complete!");
  } catch (error) {
    console.error("Migration failed:", error);
  }
  process.exit(0);
}

main();
