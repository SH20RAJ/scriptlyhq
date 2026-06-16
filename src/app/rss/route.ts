import { db } from "../../db";
import { products } from "../../db/schema";
import { desc } from "drizzle-orm";
import { BLOG_POSTS } from "../../lib/blog-data";

export async function GET() {
  const baseUrl = "https://scriptly.store";
  const allProducts = await db.query.products.findMany({
    where: (products, { eq }) => eq(products.published, true),
    orderBy: [desc(products.createdAt)],
    limit: 20,
  });

  const rssItems = allProducts
    .map((product) => `
    <item>
      <title><![CDATA[${product.title}]]></title>
      <link>${baseUrl}/products/${product.slug}</link>
      <guid isPermaLink="true">${baseUrl}/products/${product.slug}</guid>
      <pubDate>${new Date(product.createdAt).toUTCString()}</pubDate>
      <description><![CDATA[${product.shortDescription}]]></description>
    </item>`)
    .join("");

  const rssBlogItems = BLOG_POSTS
    .map((post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.createdAt).toUTCString()}</pubDate>
      <description><![CDATA[${post.excerpt}]]></description>
    </item>`)
    .join("");

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>ScriptlyStore - Premium Digital Assets & Developer Blog</title>
  <link>${baseUrl}</link>
  <description>The latest premium developer assets and actionable blogs from ScriptlyStore</description>
  <language>en-us</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  <atom:link href="${baseUrl}/rss" rel="self" type="application/rss+xml" />
  ${rssItems}
  ${rssBlogItems}
</channel>
</rss>`;

  return new Response(rssFeed, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
