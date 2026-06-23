import { db } from "../src/db";
import { products } from "../src/db/schema";
import { eq, inArray } from "drizzle-orm";

const fizziSlug = "fizzi-a-3d-ecommerce-landing-page-built-with-next-js-14-gsap-three-js-and-prismic";

const newDescription = `# Fizzi 3D - Premium Next.js 15, GSAP & Three.js E-Commerce Template

Fizzi is a state-of-the-art, high-converting 3D animated landing page designed for modern e-commerce brands, digital products, and physical goods. Crafted with the latest web technologies, this template helps you showcase sodas, health beverages, cosmetics, or SaaS subscription boxes with immersive WebGL scroll effects.

Looking for more templates? Check out our [Explore Library](https://scriptly.store/explore) or read about our [Razorpay Route integrations](https://scriptly.store/docs/route-guide)!

## Technical Stack & Features
- **Next.js 15 & React 19**: Built using the modern [Next.js App Router](https://nextjs.org) framework for fast server-side rendering (SSR), optimized layouts, and performance.
- **Three.js & WebGL 3D Models**: Immersive, interactive 3D can models that rotate, scale, and fly across the viewport on scroll.
- **GSAP & ScrollTrigger Animations**: Powered by [GreenSock (GSAP)](https://greensock.com) to drive fluid, scroll-linked parallax animations and micro-interactions.
- **Prismic Headless CMS**: Manage your text, model paths, and marketing sections dynamically without modifying code.
- **Tailwind CSS v4**: Beautifully styled UI utilizing vanilla Tailwind utilities for seamless dark mode compatibility.

## What is Included in the ZIP?
1. Complete Next.js source code with configured 3D canvas and model loaders.
2. Fully optimized \`.glb\`/\`.gltf\` 3D soda can models and text assets.
3. Scroll-linked GSAP animation hooks and component declarations.
4. Comprehensive developer documentation and deployment guidelines.`;

async function run() {
  // 1. Update the Fizzi description
  console.log("Updating Fizzi product description...");
  const updateResult = await db
    .update(products)
    .set({ description: newDescription })
    .where(eq(products.slug, fizziSlug))
    .returning({ id: products.id, title: products.title });

  if (updateResult.length > 0) {
    console.log(`SUCCESS: Updated description for Fizzi product (ID: ${updateResult[0].id})`);
  } else {
    console.log("WARNING: Fizzi product not found or not updated.");
  }

  // 2. Identify the free Unsplash products to delete
  const allProducts = await db.query.products.findMany();
  const freeUnsplashProducts = allProducts.filter(p => {
    const isFree = p.price === 0;
    const hasUnsplash = p.thumbnail?.includes("unsplash.com") || p.screenshots?.includes("unsplash.com");
    return isFree && hasUnsplash;
  });

  const idsToDelete = freeUnsplashProducts.map(p => p.id);

  if (idsToDelete.length > 0) {
    console.log(`Deleting ${idsToDelete.length} free products with Unsplash posters...`);
    for (const p of freeUnsplashProducts) {
      console.log(`- Deleting: [${p.id}] "${p.title}"`);
    }

    const deleteResult = await db
      .delete(products)
      .where(inArray(products.id, idsToDelete))
      .returning({ id: products.id, title: products.title });

    console.log(`SUCCESS: Deleted ${deleteResult.length} records from products table.`);
  } else {
    console.log("No free products with Unsplash posters found to delete.");
  }
}

run().catch(console.error);
