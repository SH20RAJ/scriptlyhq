import { db } from "../db";
import { sql } from "drizzle-orm";

async function main() {
  console.log("Starting order addons migration...");
  try {
    console.log("Adding add_on_edit_copy and add_on_setup_deploy columns to database...");
    await db.execute(sql`
      ALTER TABLE orders 
      ADD COLUMN IF NOT EXISTS add_on_edit_copy boolean DEFAULT false NOT NULL;
    `);
    await db.execute(sql`
      ALTER TABLE orders 
      ADD COLUMN IF NOT EXISTS add_on_setup_deploy boolean DEFAULT false NOT NULL;
    `);
    console.log("Columns added successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  }
  process.exit(0);
}

main();
