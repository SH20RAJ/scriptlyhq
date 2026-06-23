import { db } from "../src/db";
import { products } from "../src/db/schema";
import { eq } from "drizzle-orm";

async function run() {
  const slug = "fizzi-a-3d-ecommerce-landing-page-built-with-next-js-14-gsap-three-js-and-prismic";
  
  // Find product
  const product = await db.query.products.findFirst({
    where: eq(products.slug, slug),
  });
  
  if (product) {
    console.log("FOUND_PRODUCT_START");
    console.log("TITLE:", product.title);
    console.log("DESCRIPTION:", product.description);
    console.log("FOUND_PRODUCT_END");
  } else {
    console.log("PRODUCT_NOT_FOUND");
  }

  // Find all free products that have unsplash.com thumbnails/posters
  const allProducts = await db.query.products.findMany();
  const freeUnsplashProducts = allProducts.filter(p => {
    const isFree = p.price === 0;
    const hasUnsplash = p.thumbnail?.includes("unsplash.com") || p.screenshots?.includes("unsplash.com");
    return isFree && hasUnsplash;
  });

  console.log("FREE_UNSPLASH_START");
  console.log(JSON.stringify(freeUnsplashProducts.map(p => ({
    id: p.id,
    title: p.title,
    price: p.price,
    thumbnail: p.thumbnail,
    screenshots: p.screenshots
  }))));
  console.log("FREE_UNSPLASH_END");
}

run().catch(console.error);
