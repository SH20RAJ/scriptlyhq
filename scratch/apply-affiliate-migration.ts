import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables from .env
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set in .env");
  process.exit(1);
}

async function run() {
  console.log("Connecting to database...");
  const sql = neon(connectionString!);

  console.log("Applying Affiliate System schema migrations...");

  try {
    // 1. Add affiliate_slug to users
    console.log("Checking if affiliate_slug exists in users...");
    await sql`
      ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "affiliate_slug" text;
    `;
    console.log("Added column affiliate_slug (or it already existed).");

    // Add unique constraint for affiliate_slug
    try {
      await sql`
        ALTER TABLE "users" ADD CONSTRAINT "users_affiliate_slug_unique" UNIQUE ("affiliate_slug");
      `;
      console.log("Added unique constraint for affiliate_slug.");
    } catch (e: any) {
      console.log("Unique constraint for affiliate_slug already exists or failed to create: " + e.message);
    }

    // 2. Add affiliate_commission_percent to products
    console.log("Checking if affiliate_commission_percent exists in products...");
    await sql`
      ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "affiliate_commission_percent" integer DEFAULT 10 NOT NULL;
    `;
    console.log("Added column affiliate_commission_percent.");

    // 3. Add referred_by_id to orders
    console.log("Checking if referred_by_id exists in orders...");
    await sql`
      ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "referred_by_id" text;
    `;
    console.log("Added column referred_by_id.");

    try {
      await sql`
        ALTER TABLE "orders" ADD CONSTRAINT "orders_referred_by_id_users_id_fk" 
        FOREIGN KEY ("referred_by_id") REFERENCES "users"("id") ON DELETE SET NULL;
      `;
      console.log("Added referred_by_id foreign key constraint.");
    } catch (e: any) {
      console.log("Foreign key constraint for referred_by_id already exists or failed to create: " + e.message);
    }

    // 4. Create affiliate_profiles table
    console.log("Creating affiliate_profiles table...");
    await sql`
      CREATE TABLE IF NOT EXISTS "affiliate_profiles" (
        "id" text PRIMARY KEY NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "status" text DEFAULT 'pending' NOT NULL,
        "channels" text,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
      );
    `;
    console.log("Created table affiliate_profiles.");

    // 5. Create affiliate_referrals table
    console.log("Creating affiliate_referrals table...");
    await sql`
      CREATE TABLE IF NOT EXISTS "affiliate_referrals" (
        "id" text PRIMARY KEY NOT NULL,
        "affiliate_id" text NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "product_id" text REFERENCES "products"("id") ON DELETE CASCADE,
        "ip_hash" text NOT NULL,
        "user_agent" text,
        "referrer_url" text,
        "created_at" timestamp DEFAULT now() NOT NULL
      );
    `;
    console.log("Created table affiliate_referrals.");

    // 6. Create affiliate_commissions table
    console.log("Creating affiliate_commissions table...");
    await sql`
      CREATE TABLE IF NOT EXISTS "affiliate_commissions" (
        "id" text PRIMARY KEY NOT NULL,
        "affiliate_id" text NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "order_id" text NOT NULL REFERENCES "orders"("id") ON DELETE CASCADE,
        "product_id" text NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
        "amount" integer NOT NULL,
        "percent" integer NOT NULL,
        "status" text DEFAULT 'pending' NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
      );
    `;
    console.log("Created table affiliate_commissions.");

    console.log("Schema migrations applied successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

run();
