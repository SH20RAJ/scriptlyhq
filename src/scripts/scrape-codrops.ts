/**
 * Codrops Playground & Tutorials Scraper
 * 
 * Uses the WordPress REST API to fetch all demo posts from Codrops,
 * extracts demo URLs, GitHub links, thumbnails, video previews,
 * and inserts them into ScriptlyStore as products priced $20-$50.
 */

import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

const WP_API = "https://tympanus.net/codrops/wp-json/wp/v2";

// Categories: Playground=141, Tutorials=104, Blueprints=489
const CATEGORIES = [141, 104, 489];
const PER_PAGE = 100;

interface CodropsPost {
  id: number;
  title: { rendered: string };
  slug: string;
  link: string;
  content: { rendered: string };
  excerpt: { rendered: string };
  date: string;
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url?: string;
      media_details?: {
        sizes?: {
          full?: { source_url: string };
          medium_large?: { source_url: string };
          large?: { source_url: string };
        };
      };
    }>;
  };
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&nbsp;/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function extractDemoUrl(content: string): string | null {
  // Look for demo links like tympanus.net/Development/ or tympanus.net/Tutorials/
  const demoMatch = content.match(
    /href="(https?:\/\/tympanus\.net\/(?:Development|Tutorials|codrops\/adv)[^"]*?)"/i
  );
  if (demoMatch) return demoMatch[1];

  // Look for "Demo" or "View demo" links
  const demoBtnMatch = content.match(
    /href="([^"]+)"[^>]*>[^<]*(?:demo|view demo|live demo|launch demo)[^<]*/i
  );
  if (demoBtnMatch) return demoBtnMatch[1];

  return null;
}

function extractGithubUrl(content: string): string | null {
  const ghMatch = content.match(
    /href="(https?:\/\/github\.com\/[^"]+?)"/i
  );
  return ghMatch ? ghMatch[1] : null;
}

function extractVideoUrl(content: string): string | null {
  // Look for video src in the content
  const videoMatch = content.match(
    /src="(https?:\/\/[^"]+\.mp4[^"]*)"/i
  );
  return videoMatch ? videoMatch[1] : null;
}

function extractGifUrl(content: string): string | null {
  // Look for GIF images
  const gifMatch = content.match(
    /src="(https?:\/\/[^"]+\.gif[^"]*)"/i
  );
  return gifMatch ? gifMatch[1] : null;
}

function extractTags(content: string, title: string): string {
  const tagSet = new Set<string>();

  // Extract technology mentions
  const techPatterns = [
    "GSAP", "Three.js", "WebGL", "WebGPU", "CSS", "SVG", "Canvas",
    "React", "Astro", "ScrollTrigger", "Lenis", "GLSL", "shader",
    "animation", "transition", "scroll", "3D", "carousel", "menu",
    "slider", "gallery", "grid", "layout", "text", "image",
    "particle", "wave", "morph", "clip-path", "mask", "blend",
    "parallax", "hover", "cursor", "mouse", "drag", "flip",
    "page transition", "loading", "preloader", "navigation",
  ];

  const combined = (title + " " + content).toLowerCase();
  for (const tech of techPatterns) {
    if (combined.includes(tech.toLowerCase())) {
      tagSet.add(tech);
    }
  }

  return Array.from(tagSet).slice(0, 10).join(", ");
}

function generatePrice(): number {
  // Random price between $20 and $50 in USD cents
  const prices = [2000, 2500, 2900, 3500, 3900, 4500, 4900];
  return prices[Math.floor(Math.random() * prices.length)];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 100);
}

function contentToMarkdown(html: string): string {
  // Convert common HTML to markdown-like text
  let md = html
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, "\n## $1\n")
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, "\n### $1\n")
    .replace(/<p>(.*?)<\/p>/gi, "$1\n\n")
    .replace(/<strong>(.*?)<\/strong>/gi, "**$1**")
    .replace(/<em>(.*?)<\/em>/gi, "*$1*")
    .replace(/<a\s+href="([^"]*)"[^>]*>(.*?)<\/a>/gi, "[$2]($1)")
    .replace(/<li>(.*?)<\/li>/gi, "- $1\n")
    .replace(/<ul[^>]*>/gi, "\n")
    .replace(/<\/ul>/gi, "\n")
    .replace(/<ol[^>]*>/gi, "\n")
    .replace(/<\/ol>/gi, "\n")
    .replace(/<code>(.*?)<\/code>/gi, "`$1`")
    .replace(/<pre[^>]*>(.*?)<\/pre>/gis, "\n```\n$1\n```\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<figure[^>]*>.*?<\/figure>/gis, "") // Remove figures (videos/images)
    .replace(/<[^>]*>/g, "") // Strip remaining HTML
    .replace(/&amp;/g, "&")
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&nbsp;/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return md;
}

async function fetchAllPosts(): Promise<CodropsPost[]> {
  const allPosts: CodropsPost[] = [];

  for (const catId of CATEGORIES) {
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const url = `${WP_API}/posts?categories=${catId}&per_page=${PER_PAGE}&page=${page}&_embed=wp:featuredmedia`;
      console.log(`Fetching: category=${catId}, page=${page}...`);

      try {
        const response = await fetch(url);
        if (!response.ok) {
          if (response.status === 400) {
            // No more pages
            hasMore = false;
            break;
          }
          console.error(`HTTP ${response.status} for ${url}`);
          hasMore = false;
          break;
        }

        const posts: CodropsPost[] = await response.json();
        if (posts.length === 0) {
          hasMore = false;
        } else {
          allPosts.push(...posts);
          page++;
          // Rate limit: wait 500ms between requests
          await new Promise((r) => setTimeout(r, 500));
        }
      } catch (err) {
        console.error(`Fetch error:`, err);
        hasMore = false;
      }
    }
  }

  // Deduplicate by post ID
  const seen = new Set<number>();
  return allPosts.filter((p) => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });
}

async function main() {
  console.log("🔍 Fetching all Codrops Playground, Tutorials & Blueprint posts...\n");

  const posts = await fetchAllPosts();
  console.log(`\n📦 Found ${posts.length} total unique posts.\n`);

  let inserted = 0;
  let skipped = 0;

  for (const post of posts) {
    const title = stripHtml(post.title.rendered);
    const baseSlug = slugify(title);
    const slug = `codrops-${baseSlug}`;

    // Check if already exists
    const existing = await db.query.products.findFirst({
      where: eq(products.slug, slug),
    });

    if (existing) {
      skipped++;
      continue;
    }

    const content = post.content.rendered;
    const excerpt = stripHtml(post.excerpt.rendered);
    const description = contentToMarkdown(content);

    // Extract media
    const demoUrl = extractDemoUrl(content);
    const githubUrl = extractGithubUrl(content);
    const videoUrl = extractVideoUrl(content);
    const gifUrl = extractGifUrl(content);

    // Get thumbnail from featured media
    let thumbnail: string | null = null;
    if (post._embedded?.["wp:featuredmedia"]?.[0]) {
      const media = post._embedded["wp:featuredmedia"][0];
      thumbnail =
        media.media_details?.sizes?.large?.source_url ||
        media.media_details?.sizes?.medium_large?.source_url ||
        media.source_url ||
        null;
    }

    const tags = extractTags(content, title);
    const price = generatePrice();

    // Build the product file URL — point to GitHub if available, else the Codrops post
    const fileUrl = githubUrl || post.link;

    const productData = {
      id: randomUUID(),
      title,
      slug,
      shortDescription: excerpt || `${title} — A creative web development demo from Codrops.`,
      description: description || excerpt || `Explore this creative web demo: ${title}.`,
      category: "ui-kits",
      tags: tags || "animation, web design, creative coding",
      thumbnail,
      previewGif: gifUrl,
      videoUrl: videoUrl || null,
      demoUrl: demoUrl || post.link,
      fileUrl,
      redirectDownload: true,
      price,
      version: "1.0.0",
      featured: false,
      published: true,
      creatorId: null,
      status: "approved" as const,
      rating: "5.0",
      ratingCount: 1,
      isFree: false,
      discountPercent: 0,
    };

    try {
      await db.insert(products).values(productData);
      inserted++;
      console.log(`✅ [${inserted}] ${title} — $${(price / 100).toFixed(2)} | demo=${demoUrl ? "✓" : "✗"} | github=${githubUrl ? "✓" : "✗"} | video=${videoUrl ? "✓" : "✗"}`);
    } catch (err: any) {
      console.error(`❌ Failed to insert "${title}": ${err.message}`);
    }
  }

  console.log(`\n🎉 Done! Inserted: ${inserted}, Skipped (already exists): ${skipped}`);
}

main().catch(console.error);
