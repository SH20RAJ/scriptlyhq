import { db } from "../db";
import { products } from "../db/schema";
import { isNull } from "drizzle-orm";

async function main() {
  console.log("Migrating existing products...");
  try {
    // For existing products (which don't have creatorId set, or status is null/defaulting to pending but they were admin created),
    // we want to ensure their status is set to 'approved'.
    const res = await db.update(products)
      .set({ status: "approved" })
      .where(isNull(products.creatorId));
    console.log("Migration complete. Existing admin-created products set to 'approved'.", res);
  } catch (error) {
    console.error("Error running migration script:", error);
  }
  process.exit(0);
}

main();
