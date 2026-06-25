import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  console.log("Updating Panda Scroll Travel Animation Portfolio product...");
  try {
    const slug = "panda-scroll-travel-animation-portfolio";
    const product = await db.query.products.findFirst({
      where: eq(products.slug, slug),
    });

    if (!product) {
      console.error(`Product with slug "${slug}" not found.`);
      process.exit(1);
    }

    const shortDescription = "A scroll-driven travel portfolio template that turns scrolling into a cinematic journey.";
    
    const description = `Most portfolios look like this:

👋 Hero Section

📂 Projects

📞 Contact

And then they wonder why recruiters close the tab in 10 seconds.

The best portfolios don't just show your work. **They create an experience.**

This scroll-driven travel portfolio turns scrolling into a journey:

* 🌍 **Cinematic transitions**
* ✨ **Smooth animations**
* 🎭 **Storytelling-based design**
* 📱 **Responsive layout**
* ⚡ **Easy to customize**

The kind of portfolio that makes visitors keep scrolling just to see what's next.

If you're a developer, designer, freelancer, or student trying to stand out, this is worth checking out.

Would you hire someone with a portfolio like this over a generic template?`;

    await db.update(products)
      .set({
        shortDescription,
        description,
        updatedAt: new Date(),
      })
      .where(eq(products.slug, slug));

    console.log("Product updated successfully!");
  } catch (error) {
    console.error("Failed to update product:", error);
  }
  process.exit(0);
}

main();
