import * as fs from "fs";
import * as path from "path";
import { db } from "../src/db";
import { products } from "../src/db/schema";
import { eq } from "drizzle-orm";

const FREEIMAGE_API_KEY = "6d207e02198a847aa98d0a2a901485a5";
const FREEIMAGE_UPLOAD_URL = "https://freeimage.host/api/1/upload";

const COVERS = [
  {
    slug: "solo-developers-guide-to-micro-saas",
    filename: "solo_dev_micro_saas.png",
  },
  {
    slug: "seo-for-developers",
    filename: "seo_for_developers.png",
  },
  {
    slug: "design-for-developers-tailwind",
    filename: "design_for_developers.png",
  },
  {
    slug: "api-design-patterns-serverless",
    filename: "api_design_patterns.png",
  },
  {
    slug: "ai-automation-scraping-playbook",
    filename: "ai_automation_scraping.png",
  },
];

async function uploadLocalImage(filePath: string): Promise<string | null> {
  try {
    if (!fs.existsSync(filePath)) {
      console.error(`File does not exist: ${filePath}`);
      return null;
    }

    const fileBuffer = fs.readFileSync(filePath);
    const base64Image = fileBuffer.toString("base64");

    const formData = new FormData();
    formData.append("key", FREEIMAGE_API_KEY);
    formData.append("source", base64Image);
    formData.append("format", "json");
    formData.append("action", "upload");

    const res = await fetch(FREEIMAGE_UPLOAD_URL, {
      method: "POST",
      body: formData,
    });
    const data = (await res.json()) as any;

    if (data.status_code === 200 && data.image?.url) {
      console.log(`Uploaded ${path.basename(filePath)} successfully: ${data.image.url}`);
      return data.image.url;
    } else {
      console.error(`Upload failed for ${path.basename(filePath)}:`, data.error?.message || data.status_txt);
      return null;
    }
  } catch (err: any) {
    console.error(`Error uploading ${filePath}:`, err.message);
    return null;
  }
}

async function run() {
  console.log("Uploading eBook covers to Freeimage CDN...");
  const publicThumbnailsDir = path.join(process.cwd(), "public", "thumbnails");

  for (const cover of COVERS) {
    const filePath = path.join(publicThumbnailsDir, cover.filename);
    console.log(`Uploading ${cover.filename} for product slug: ${cover.slug}...`);
    
    const cdnUrl = await uploadLocalImage(filePath);
    if (cdnUrl) {
      // Update database row
      const existing = await db.query.products.findFirst({
        where: eq(products.slug, cover.slug),
      });

      if (existing) {
        await db
          .update(products)
          .set({ thumbnail: cdnUrl, updatedAt: new Date() })
          .where(eq(products.id, existing.id));
        console.log(`Updated database product "${existing.title}" with CDN thumbnail: ${cdnUrl}`);
      } else {
        console.warn(`Product with slug "${cover.slug}" not found in database.`);
      }
    }
    // Small rate limiting pause
    await new Promise((r) => setTimeout(r, 500));
  }
  console.log("Uploads complete!");
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
