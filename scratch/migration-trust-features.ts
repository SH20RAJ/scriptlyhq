import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";
dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const client = neon(connectionString);

async function main() {
  console.log("Running SQL Migrations...");

  // 1. Add columns to products table if they do not exist
  console.log("Adding columns to products table...");
  await client`
    ALTER TABLE products 
    ADD COLUMN IF NOT EXISTS views integer DEFAULT 0 NOT NULL;
  `;
  
  await client`
    ALTER TABLE products 
    ADD COLUMN IF NOT EXISTS downloads_count integer DEFAULT 0 NOT NULL;
  `;

  await client`
    ALTER TABLE products 
    ADD COLUMN IF NOT EXISTS saves integer DEFAULT 0 NOT NULL;
  `;

  await client`
    ALTER TABLE products 
    ADD COLUMN IF NOT EXISTS personal boolean DEFAULT false NOT NULL;
  `;

  // 2. Create reviews table
  console.log("Creating reviews table...");
  await client`
    CREATE TABLE IF NOT EXISTS reviews (
      id text PRIMARY KEY,
      user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      product_id text NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      rating integer NOT NULL,
      comment text NOT NULL,
      created_at timestamp DEFAULT NOW() NOT NULL
    );
  `;

  // 3. Create user_interactions table
  console.log("Creating user_interactions table...");
  await client`
    CREATE TABLE IF NOT EXISTS user_interactions (
      id text PRIMARY KEY,
      user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      product_id text NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      type text NOT NULL,
      created_at timestamp DEFAULT NOW() NOT NULL
    );
  `;

  console.log("Migrations successfully completed!");
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
