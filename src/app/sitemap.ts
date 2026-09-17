import { MetadataRoute } from "next";
import { db } from "@/db";
import { products } from "@/db/schema";
import { BLOG_POSTS } from "@/lib/blog-data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://scriptly.store";

  // Static routes
  const routes = [
    "",
    "/explore",
    "/search",
    "/featured",
    "/free",
    "/offers",
    "/creator",
    "/hire-me",
    "/about",
    "/trust",
    "/contact",
    "/licenses",
    "/terms",
    "/privacy",
    "/refund",
    "/shipping",
    "/dmca",
    "/docs/route-guide",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : (route === "/explore" || route === "/free" || route === "/creator") ? 0.9 : 0.7,
  }));

  // Dynamic products
  const allProducts = await db.query.products.findMany({
    where: (products, { eq }) => eq(products.published, true),
  });

  const productRoutes = allProducts.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Dynamic categories
  const allCategories = await db.query.categories.findMany();
  const categoryRoutes = allCategories.map((category) => ({
    url: `${baseUrl}/explore/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Blog dynamic pages
  const blogIndexRoute = {
    url: `${baseUrl}/blog`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  };

  const blogRoutes = BLOG_POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.createdAt),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...routes, ...productRoutes, ...categoryRoutes, blogIndexRoute, ...blogRoutes];
}
