import { BLOG_POSTS } from "../lib/blog-data";

async function main() {
  console.log("TESTING BLOG IMAGES:");
  for (const post of BLOG_POSTS) {
    try {
      const res = await fetch(post.thumbnail, { method: "HEAD" });
      console.log(`- Slug: ${post.slug}, Status: ${res.status}, URL: ${post.thumbnail}`);
    } catch (err: any) {
      console.log(`- Slug: ${post.slug}, ERROR: ${err.message}, URL: ${post.thumbnail}`);
    }
  }
}

main().catch(console.error);
