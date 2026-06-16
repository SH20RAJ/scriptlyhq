import { MetadataRoute } from "next";
import { db } from "../db";
import { products, categories } from "../db/schema";
import { BLOG_POSTS } from "../lib/blog-data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://scriptly.store";

  // Static routes
  const routes = ["", "/search", "/dashboard"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // Dynamic products
  const allProducts = await db.query.products.findMany({
    where: (products, { eq }) => eq(products.published, true),
  });

  const productRoutes = allProducts.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Dynamic categories
  const allCategories = await db.query.categories.findMany();
  const categoryRoutes = allCategories.map((category) => ({
    url: `${baseUrl}/?category=${category.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
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
