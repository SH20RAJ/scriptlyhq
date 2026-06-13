import { db } from "../db";
import { products } from "../db/schema";

async function main() {
  console.log("Setting all products to drafts...");
  try {
    const res = await db.update(products).set({ published: true });
    console.log("Success! All products have been set to drafts.");
  } catch (error) {
    console.error("Error setting all products to drafts:", error);
  }
  process.exit(0);
}

main();
