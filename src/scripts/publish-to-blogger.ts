import { db } from "@/db";
import { products } from "@/db/schema";
import { marked } from "marked";
import fs from "fs";
import path from "path";

const PROGRESS_FILE = path.join(process.cwd(), "published_to_blogger.json");

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Convert relative URLs to absolute scriptly.store URLs
function resolveUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith("/")) {
    return `https://scriptly.store${url}`;
  }
  return url;
}

// Recursively resolve relative URLs in HTML string (src="/..." and href="/...")
function resolveAllUrlsInHtml(html: string): string {
  if (!html) return html;
  return html.replace(/(src|href)=["']\/([^"']+)["']/g, '$1="https://scriptly.store/$2"');
}

// Format price into USD (e.g., $29 instead of $29.00 if it's a whole number)
function formatPriceUSD(pricePaise: number, isFree: boolean): string {
  if (isFree || pricePaise <= 0) return "FREE";
  const dollars = pricePaise / 100;
  if (Number.isInteger(dollars)) {
    return `$${dollars}`;
  }
  return `$${dollars.toFixed(2)}`;
}

// Load progress log
function loadProgress(): Set<string> {
  if (fs.existsSync(PROGRESS_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(PROGRESS_FILE, "utf-8"));
      return new Set(Array.isArray(data) ? data : []);
    } catch (e) {
      console.warn("Failed to parse progress file, starting fresh.");
    }
  }
  return new Set();
}

// Save progress log
function saveProgress(publishedIds: Set<string>) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(Array.from(publishedIds), null, 2));
}

async function main() {
  const limitArgIndex = process.argv.indexOf("--limit");
  const publishAll = process.argv.includes("--all");
  
  let limitValue = 2; // Default to 2 for safety/testing
  if (limitArgIndex !== -1 && process.argv[limitArgIndex + 1]) {
    limitValue = parseInt(process.argv[limitArgIndex + 1], 10);
  }

  const workerUrl = process.env.CF_EMAIL_WORKER_URL;
  const apiToken = process.env.CF_EMAIL_API_TOKEN;
  const fromEmail = "outreach@mail.linespedia.com";
  const toEmail = process.env.BLOGGER_EMAIL || process.env.TO_EMAIL;

  if (!workerUrl || !apiToken) {
    console.error("Error: CF_EMAIL_WORKER_URL or CF_EMAIL_API_TOKEN is not defined in the environment.");
    process.exit(1);
  }

  if (!toEmail) {
    console.error("Error: BLOGGER_EMAIL (or TO_EMAIL) is not defined in the environment.");
    process.exit(1);
  }

  // Load progress
  const publishedIds = loadProgress();
  console.log(`Loaded progress: ${publishedIds.size} products already published.`);

  try {
    console.log("Fetching products from database...");
    const allProducts = await db.select().from(products);
    console.log(`Total products in database: ${allProducts.length}`);

    // Filter out already published products
    const pendingProducts = allProducts.filter(p => !publishedIds.has(p.id));
    console.log(`Pending products to publish: ${pendingProducts.length}`);

    const productsToPublish = publishAll ? pendingProducts : pendingProducts.slice(0, limitValue);
    
    if (productsToPublish.length === 0) {
      console.log("No new products to publish.");
      process.exit(0);
    }

    console.log(`Preparing to publish ${productsToPublish.length} products to Blogger...`);

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < productsToPublish.length; i++) {
      const product = productsToPublish[i];
      console.log(`\n[${i + 1}/${productsToPublish.length}] Processing product: "${product.title}" (slug: ${product.slug})...`);

      // 1. Resolve URLs
      const absoluteThumbnail = resolveUrl(product.thumbnail);
      const absolutePreviewGif = resolveUrl(product.previewGif);

      // Parse and resolve screenshots
      let screenshotUrls: string[] = [];
      if (product.screenshots) {
        try {
          if (product.screenshots.startsWith("[")) {
            screenshotUrls = JSON.parse(product.screenshots);
          } else {
            screenshotUrls = product.screenshots.split(",").map(s => s.trim()).filter(Boolean);
          }
        } catch (e) {
          screenshotUrls = product.screenshots.split(",").map(s => s.trim()).filter(Boolean);
        }
      }
      // Resolve screenshots to absolute
      const absoluteScreenshots = screenshotUrls.map(url => resolveUrl(url)).filter(Boolean) as string[];

      // Render markdown description to HTML & resolve relative links inside
      let htmlDescription = "";
      try {
        htmlDescription = await marked.parse(product.description || "");
      } catch (err) {
        htmlDescription = product.description || "";
      }
      htmlDescription = resolveAllUrlsInHtml(htmlDescription);

      // Subject format (corresponds to Blogger post title)
      const subject = `${product.title} - High-Converting Web Elements & Templates`;

      // Format current and original prices
      const currentPriceText = formatPriceUSD(product.price, product.isFree);
      
      let discountBadgeHtml = "";
      let originalPriceHtml = "";
      if (!product.isFree && product.discountPercent > 0) {
        const originalPricePaise = Math.round(product.price / (1 - product.discountPercent / 100));
        const originalPriceText = formatPriceUSD(originalPricePaise, false);
        originalPriceHtml = `<span style="font-size: 1rem; color: #ef4444; font-weight: 600; margin-left: 10px; text-decoration: line-through;">${originalPriceText}</span>`;
        discountBadgeHtml = `<span style="background: #fee2e2; color: #ef4444; font-size: 0.75rem; font-weight: 700; padding: 4px 8px; border-radius: 9999px; margin-left: 5px;">${product.discountPercent}% OFF</span>`;
      }

      // Build specifications key-value table
      const specsTableRows = [
        `Style: category`,
        `Value: ${product.category || 'N/A'}`
      ];

      // 2. Generate SEO HTML Content with USD Pricing and Specifications
      const htmlBody = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; color: #1f2937; line-height: 1.6;">
  <header style="margin-bottom: 30px; text-align: center;">
    <span style="font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em; color: #10b981; font-weight: 600;">Category: ${product.category.toUpperCase()}</span>
    <h1 style="font-size: 2.25rem; font-weight: 800; color: #111827; margin: 10px 0 15px 0; line-height: 1.2;">${product.title}</h1>
    <p style="font-size: 1.125rem; color: #4b5563; max-width: 600px; margin: 0 auto; line-height: 1.5;">${product.shortDescription}</p>
  </header>

  ${absoluteThumbnail ? `
  <div style="margin-bottom: 30px; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); text-align: center;">
    <img src="${absoluteThumbnail}" alt="${product.title} Thumbnail" style="max-width: 100%; height: auto; border-radius: 12px; display: inline-block;" />
  </div>
  ` : ''}

  <!-- Specifications Table -->
  <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; margin-bottom: 30px;">
    <h3 style="margin-top: 0; color: #111827; font-size: 1.15rem; font-weight: 700; border-bottom: 1.5px solid #f3f4f6; padding-bottom: 8px; margin-bottom: 15px;">Product Details & Specs</h3>
    <table style="width: 100%; border-collapse: collapse; font-size: 0.95rem;">
      <tr style="border-bottom: 1px solid #f3f4f6;">
        <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Version</td>
        <td style="padding: 8px 0; color: #111827; text-align: right; font-weight: 600;">${product.version || '1.0.0'}</td>
      </tr>
      <tr style="border-bottom: 1px solid #f3f4f6;">
        <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Category</td>
        <td style="padding: 8px 0; color: #111827; text-align: right; font-weight: 600;">${product.category || 'N/A'}</td>
      </tr>
      ${product.subcategory ? `
      <tr style="border-bottom: 1px solid #f3f4f6;">
        <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Subcategory</td>
        <td style="padding: 8px 0; color: #111827; text-align: right; font-weight: 600;">${product.subcategory}</td>
      </tr>
      ` : ''}
      <tr style="border-bottom: 1px solid #f3f4f6;">
        <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Rating</td>
        <td style="padding: 8px 0; color: #111827; text-align: right; font-weight: 600;">⭐ ${product.rating || '5.0'} (${product.ratingCount || 1} review${(product.ratingCount || 1) > 1 ? 's' : ''})</td>
      </tr>
      <tr style="border-bottom: 1px solid #f3f4f6;">
        <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Last Updated</td>
        <td style="padding: 8px 0; color: #111827; text-align: right; font-weight: 600;">${product.updatedAt ? new Date(product.updatedAt).toLocaleDateString() : new Date().toLocaleDateString()}</td>
      </tr>
    </table>
  </div>

  <div style="font-size: 1.05rem; color: #374151; margin-bottom: 40px; border-top: 1px solid #f3f4f6; padding-top: 25px;">
    ${htmlDescription}
  </div>

  ${absolutePreviewGif ? `
  <div style="margin-bottom: 30px; text-align: center;">
    <h4 style="font-size: 1.1rem; font-weight: 700; color: #111827; margin-bottom: 12px; text-align: left;">Live Interaction Preview</h4>
    <div style="border-radius: 8px; overflow: hidden; border: 1px solid #e5e7eb; display: inline-block;">
      <img src="${absolutePreviewGif}" alt="Product Walkthrough Preview" style="max-width: 100%; height: auto; display: block;" />
    </div>
  </div>
  ` : ''}

  ${product.videoUrl ? `
  <div style="margin-bottom: 40px; text-align: center; background: #fee2e2; padding: 15px; border-radius: 8px; border: 1px solid #fecaca;">
    <p style="margin: 0 0 10px 0; font-weight: 600; color: #991b1b;">Want to see it in action?</p>
    <a href="${product.videoUrl}" target="_blank" style="display: inline-flex; align-items: center; background: #dc2626; color: white; text-decoration: none; padding: 10px 20px; font-weight: 700; border-radius: 6px; font-size: 0.95rem; box-shadow: 0 2px 8px rgba(220, 38, 38, 0.3);">
      📺 Watch Product Video Walkthrough
    </a>
  </div>
  ` : ''}

  ${absoluteScreenshots.length > 0 ? `
  <div style="margin-bottom: 40px;">
    <h3 style="font-size: 1.25rem; font-weight: 700; color: #111827; margin-bottom: 15px; border-bottom: 2px solid #f3f4f6; padding-bottom: 8px;">Screenshots & Interface Previews</h3>
    <div style="text-align: center;">
      ${absoluteScreenshots.map(url => `<img src="${url}" alt="Screenshot preview" style="max-width: 100%; height: auto; border-radius: 8px; border: 1px solid #e5e7eb; margin-bottom: 20px; display: inline-block;" />`).join('')}
    </div>
  </div>
  ` : ''}

  <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 25px; text-align: center; margin-bottom: 40px; box-shadow: 0 2px 10px rgba(0,0,0,0.02);">
    <h3 style="margin-top: 0; color: #0f172a; font-size: 1.5rem; font-weight: 700;">Get Your Copy</h3>
    <p style="color: #475569; font-size: 1rem; margin-bottom: 20px;">Download this template and speed up your web development flow today.</p>
    
    <div style="margin-bottom: 25px;">
      <span style="font-size: 2rem; font-weight: 800; color: #0f172a;">${currentPriceText}</span>
      ${originalPriceHtml} ${discountBadgeHtml}
    </div>

    <div style="text-align: center;">
      <a href="https://scriptly.store/products/${product.slug}" target="_blank" style="background: #10b981; color: white; text-decoration: none; padding: 12px 30px; font-weight: 700; border-radius: 8px; display: inline-block; font-size: 1.1rem; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4); margin: 5px;">
        ${product.isFree ? 'Free Download' : 'Buy Now on ScriptlyStore'}
      </a>
      ${product.demoUrl ? `
      <a href="${product.demoUrl}" target="_blank" style="background: white; color: #0f172a; border: 1.5px solid #cbd5e1; text-decoration: none; padding: 12px 30px; font-weight: 600; border-radius: 8px; display: inline-block; font-size: 1.1rem; margin: 5px;">
        Live Demo Preview
      </a>
      ` : ''}
    </div>
  </div>

  <footer style="border-top: 1px solid #e5e7eb; padding-top: 20px; font-size: 0.875rem; color: #6b7280; text-align: center;">
    ${product.tags ? `
    <div style="margin-bottom: 15px;">
      ${product.tags.split(',').map(tag => `<span style="display: inline-block; background: #e5e7eb; color: #4b5563; padding: 4px 10px; border-radius: 9999px; font-size: 0.75rem; margin: 3px 5px; font-weight: 500;">#${tag.trim()}</span>`).join('')}
    </div>
    ` : ''}
    <p>Discover more high-quality developer resources, templates, and boilerplates at <a href="https://scriptly.store/" target="_blank" style="color: #10b981; text-decoration: none; font-weight: 600;">ScriptlyStore</a>.</p>
  </footer>
</div>
`;

      const payload = {
        jsonrpc: "2.0",
        id: `blogger-publish-${product.id}`,
        method: "tools/call",
        params: {
          name: "send_email",
          arguments: {
            to: toEmail,
            from: fromEmail,
            subject: subject,
            text: `${product.title}\n\n${product.shortDescription}\n\nBuy Now: https://scriptly.store/products/${product.slug}`,
            html: htmlBody
          }
        }
      };

      // 3. Call Cloudflare Email MCP API
      try {
        const response = await fetch(workerUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiToken}`,
            "X-API-Key": apiToken
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json() as any;
        if (result.error) {
          throw new Error(`MCP Error: ${result.error.message || JSON.stringify(result.error)}`);
        }

        console.log(`Success! Sent email for "${product.title}"`);
        successCount++;
        
        // Save progress immediately on success
        publishedIds.add(product.id);
        saveProgress(publishedIds);
      } catch (err: any) {
        console.error(`Failed to send email for "${product.title}":`, err.message || err);
        failCount++;
        
        // If quota exceeded, terminate early
        if (err.message && err.message.includes("quota exceeded")) {
          console.warn("\nDaily quota exceeded. Stopping further execution.");
          break;
        }
      }

      // Respect rate limits / spacing
      await sleep(2000);
    }

    console.log(`\nPublishing run finished.`);
    console.log(`Successful: ${successCount}`);
    console.log(`Failed: ${failCount}`);

  } catch (error) {
    console.error("Execution failed:", error);
  }
  process.exit(0);
}

main();
