import { db } from "@/db";
import { sql } from "drizzle-orm";

async function main() {
  console.log("Starting reviews replies and likes migration...");
  try {
    // 1. Add parent_id column if not exists
    console.log("Adding parent_id column to reviews table...");
    await db.execute(sql`
      ALTER TABLE reviews 
      ADD COLUMN IF NOT EXISTS parent_id text;
    `);
    console.log("parent_id column checked/added.");

    // 2. Create review_likes table if not exists
    console.log("Creating review_likes table...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS review_likes (
        id text PRIMARY KEY,
        user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        review_id text NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
        created_at timestamp DEFAULT now() NOT NULL
      );
    `);
    console.log("review_likes table checked/created.");

    console.log("Migration complete!");
  } catch (error) {
    console.error("Migration failed:", error);
  }
  process.exit(0);
}

main();
