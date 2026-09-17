# Blogger Auto-Publishing Skill

This skill allows AI coding agents or scripts to automatically fetch products from the Neon PostgreSQL database, generate detailed SEO-friendly HTML articles, and send them directly to a Blogger auto-publish email endpoint via the Cloudflare Email MCP API.

## 📋 Prerequisites & Configuration

Before running the script, ensure that the following environment variables are properly configured in your `.env` file (never commit these variables to Git):

- `DATABASE_URL`: Connection string for the Neon PostgreSQL database.
- `CF_EMAIL_WORKER_URL`: The URL of the Cloudflare Email Worker MCP API.
- `CF_EMAIL_API_TOKEN`: The API bearer token for authorized email sending.
- `BLOGGER_EMAIL`: The private Blogger auto-publish email address (e.g., `username.secretcode@blogger.com`).

---

## 🛠️ Execution Options

You can execute the publishing script from the command line using `bun`:

### 1. Test Publish (Limit to N Products)
To run a test and send only a few products:
```bash
bun run src/scripts/publish-to-blogger.ts --limit 2
```

### 2. Publish All Pending Products
To publish all remaining products:
```bash
bun run src/scripts/publish-to-blogger.ts --all
```

---

## ✨ Key Features of the Script

- **USD Pricing & Formatting**: Converts database prices stored in paise/cents to USD. Outputs whole dollar amounts cleanly (e.g., `$29` instead of `$29.00`) and displays discounts and original prices if applicable. Displays `FREE` for free items.
- **Absolute URL Resolution**: Scans the entire HTML article (including thumbnails, screenshots, gifs, and description contents) and maps relative paths (e.g., `/thumbnails/...`) to absolute URLs (`https://scriptly.store/thumbnails/...`) to avoid broken media on Blogger.
- **Rich Specifications Table**: Embeds a detailed table of product metadata (Version, Category, Subcategory, Ratings, Reviews, Last Updated date) to optimize SEO.
- **Embedded Interactive Elements**: Embeds screenshots, animated walkthrough GIFs (`previewGif`), and red demo video buttons if present in the database.
- **State Preservation**: Tracks successfully published product IDs in `published_to_blogger.json` locally to ensure already published articles are skipped on subsequent runs.
