/**
 * Codrops Webzibition & Creative Hub Demos Scraper
 * 
 * Scrapes all templates/demos from Codrops Webzibition and Creative Hub All Demos,
 * extracts titles, external links, thumbnails, tags, and video previews,
 * and inserts them into ScriptlyStore as products priced $20-$50.
 */

import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

const WEBZIBITION_URL = "https://tympanus.net/codrops/webzibition/page/";
const HUB_DEMOS_URL = "https://tympanus.net/codrops/hub/all/page/";

function cleanText(text: string): string {
  return text
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
    .replace(/\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 100);
}

function generatePrice(): number {
  // Random price between $20 and $50 in USD cents (2000 to 4900 cents)
  const prices = [2000, 2500, 2900, 3200, 3500, 3900, 4200, 4500, 4900];
  return prices[Math.floor(Math.random() * prices.length)];
}

async function scrapeWebzibitions() {
  console.log("🔍 Scraping Codrops Webzibition posts...\n");
  let page = 1;
  let hasMore = true;
  let inserted = 0;
  let skipped = 0;

  while (hasMore) {
    const url = `${WEBZIBITION_URL}${page}/`;
    console.log(`Fetching Webzibition page ${page}...`);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.log(`Reached end of Webzibitions or rate limited (HTTP ${response.status})`);
        hasMore = false;
        break;
      }

      const html = await response.text();

      // Find all articles
      const articleRegex = /<article class="ct-webzibition"[^>]*>([\s\S]*?)<\/article>/g;
      let match;
      let count = 0;

      while ((match = articleRegex.exec(html)) !== null) {
        count++;
        const content = match[1];

        // Extract ID
        const idMatch = content.match(/id="post-(\d+)"/) || content.match(/id="(\d+)"/);
        const wpId = idMatch ? idMatch[1] : null;

        // Extract Target Link
        const targetLinkMatch = content.match(/class="ct-latest-thumb-webzibition\s*"[^>]*href="([^"]+)"/) || content.match(/href="([^"]+)"/);
        const demoUrl = targetLinkMatch ? targetLinkMatch[1] : null;

        // Extract Title
        const titleMatch = content.match(/class="title-archive"[\s\S]*?>[\s\S]*?>([^<]+)</) || content.match(/<h2[^>]*>[\s\S]*?>([^<]+)</);
        const title = titleMatch ? cleanText(titleMatch[1]) : "Codrops Webzibition Item";

        // Extract Thumbnail
        const thumbMatch = content.match(/<img[^>]*src="([^"]+)"/) || content.match(/src="([^"]+)"/);
        const thumbnail = thumbMatch ? thumbMatch[1].split("?")[0] : null;

        if (!demoUrl || !wpId) {
          console.log(`⚠️ Missing info for item. Title: ${title}, ID: ${wpId}, URL: ${demoUrl}`);
          continue;
        }

        const slug = `codrops-webzibition-${slugify(title)}-${wpId}`;

        // Check if already exists
        const existing = await db.query.products.findFirst({
          where: eq(products.slug, slug),
        });

        if (existing) {
          skipped++;
          continue;
        }

        const price = generatePrice();

        const productData = {
          id: randomUUID(),
          title,
          slug,
          shortDescription: `${title} — Inspiring curated website design featured on Codrops.`,
          description: `Explore this professional, premium-grade curated web design concept: ${title}. Perfect design reference, featuring state-of-the-art layout styling, smooth interactions, and top-tier web aesthetics.`,
          category: "ui-kits",
          tags: "web design, inspiration, creative coding, curated",
          thumbnail,
          previewGif: null,
          videoUrl: null,
          demoUrl: demoUrl,
          fileUrl: demoUrl,
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
          console.log(`✅ [Webzibition #${inserted}] ${title} — $${(price / 100).toFixed(2)}`);
        } catch (err: any) {
          console.error(`❌ Failed to insert Webzibition "${title}": ${err.message}`);
        }
      }

      if (count === 0) {
        console.log("No more articles found. Ending Webzibition scraping.");
        hasMore = false;
      } else {
        page++;
        await new Promise((r) => setTimeout(r, 600)); // Polite delay
      }
    } catch (err) {
      console.error(`Fetch error on page ${page}:`, err);
      hasMore = false;
    }
  }

  console.log(`\n🎉 Webzibitions Finished! Inserted: ${inserted}, Skipped: ${skipped}\n`);
}

async function scrapeHubDemos() {
  console.log("🔍 Scraping Codrops Creative Hub Demos...\n");
  let page = 1;
  let hasMore = true;
  let inserted = 0;
  let skipped = 0;

  while (hasMore) {
    const url = `${HUB_DEMOS_URL}${page}/`;
    console.log(`Fetching Hub Demos page ${page}...`);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.log(`Reached end of Hub Demos or rate limited (HTTP ${response.status})`);
        hasMore = false;
        break;
      }

      const html = await response.text();

      // Find all demo-cards
      const cardRegex = /<article[^>]*class="demo-card"[^>]*>([\s\S]*?)<\/article>/g;
      let match;
      let count = 0;

      while ((match = cardRegex.exec(html)) !== null) {
        count++;
        const content = match[1];

        // Extract ID
        const idMatch = content.match(/id="post-(\d+)"/) || content.match(/id="(\d+)"/);
        const wpId = idMatch ? idMatch[1] : null;

        // Extract Demo URL
        const demoUrlMatch = content.match(/class="demo-card__thumb-img[^"]*"[^>]*href="([^"]+)"/);
        const demoUrl = demoUrlMatch ? demoUrlMatch[1] : null;

        // Extract Video URL
        const videoMatch = content.match(/data-video-url="([^"]+)"/) || content.match(/src="([^"]+\.mp4[^"]*)"/);
        const videoUrl = videoMatch ? videoMatch[1].split("?")[0] : null;

        // Extract Title
        const titleMatch = content.match(/<h2>([^<]+)<\/h2>/);
        const title = titleMatch ? cleanText(titleMatch[1]) : "Codrops Interactive Demo";

        // Extract Thumbnail/Poster
        const posterMatch = content.match(/poster="([^"]+)"/) || content.match(/<img[^>]*src="([^"]+)"/);
        const thumbnail = posterMatch ? posterMatch[1].split("?")[0] : null;

        // Extract Github link
        const codeLinkMatch = content.match(/class="icon icon--code"[^>]*href="([^"]+)"/);
        const githubUrl = codeLinkMatch ? codeLinkMatch[1] : null;

        // Extract details post link
        const detailsLinkMatch = content.match(/class="icon icon--(?:info|article)"[^>]*href="([^"]+)"/);
        const detailsUrl = detailsLinkMatch ? detailsLinkMatch[1] : `https://tympanus.net/codrops/?p=${wpId}`;

        // Extract tags
        const tags: string[] = [];
        const tagRegex = /<a[^>]*href="https:\/\/tympanus\.net\/codrops\/hub\/tag\/[^"]+"[^>]*>([^<]+)<\/a>/g;
        let tagMatch;
        while ((tagMatch = tagRegex.exec(content)) !== null) {
          tags.push(tagMatch[1].trim());
        }
        const tagsString = tags.length > 0 ? tags.join(", ") : "ui kit, animation, interactive, creative coding";

        if (!demoUrl || !wpId) {
          console.log(`⚠️ Missing info for hub demo. Title: ${title}, ID: ${wpId}, URL: ${demoUrl}`);
          continue;
        }

        const slug = `codrops-${slugify(title)}`;

        // Check if already exists
        const existing = await db.query.products.findFirst({
          where: eq(products.slug, slug),
        });

        if (existing) {
          skipped++;
          continue;
        }

        const price = generatePrice();
        const fileUrl = githubUrl || detailsUrl;

        const productData = {
          id: randomUUID(),
          title,
          slug,
          shortDescription: `${title} — Premium interactive UI component and animation kit.`,
          description: `A creative, state-of-the-art interactive front-end interaction template: ${title}. Built using modern web technologies like GSAP, CSS, SVG, or WebGL. Includes complete downloadable source code repository, responsive design controls, clean code comments, and fluid animations.`,
          category: "ui-kits",
          tags: tagsString,
          thumbnail,
          previewGif: null,
          videoUrl: videoUrl,
          demoUrl: demoUrl,
          fileUrl: fileUrl,
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
          console.log(`✅ [Hub Demo #${inserted}] ${title} — $${(price / 100).toFixed(2)} | video=${videoUrl ? "✓" : "✗"} | github=${githubUrl ? "✓" : "✗"}`);
        } catch (err: any) {
          console.error(`❌ Failed to insert Hub Demo "${title}": ${err.message}`);
        }
      }

      if (count === 0) {
        console.log("No more articles found. Ending Hub Demos scraping.");
        hasMore = false;
      } else {
        page++;
        await new Promise((r) => setTimeout(r, 600)); // Polite delay
      }
    } catch (err) {
      console.error(`Fetch error on page ${page}:`, err);
      hasMore = false;
    }
  }

  console.log(`\n🎉 Hub Demos Finished! Inserted: ${inserted}, Skipped: ${skipped}\n`);
}

async function main() {
  console.log("🚀 Starting Codrops Mega Scraper...\n");
  
  // Scrape Webzibitions
  await scrapeWebzibitions();
  
  // Scrape Hub Demos
  await scrapeHubDemos();
  
  console.log("✨ All scraping complete!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Scraper crashed:", err);
  process.exit(1);
});
