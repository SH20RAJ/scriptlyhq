# Product Metadata Enhancement Skill

This skill allows AI coding agents working on ScriptlyHQ to automatically audit, optimize, and enhance product titles, categories, tags, and detailed markdown descriptions in the database for search engine optimization (SEO) and virality.

## Architecture & Database Hooks
- **Schema Reference**: [schema.ts](file:///Users/shaswatraj/Desktop/earn/scriptlystore/src/db/schema.ts) (`products` and `categories` tables).
- **ORM Client**: Drizzle ORM client initialized in [index.ts](file:///Users/shaswatraj/Desktop/earn/scriptlystore/src/db/index.ts).

## How to Execute Product Enhancement

To audit and enhance database products, create a temporary script in the root (e.g., `enhance-database.ts`) that implements the following sequence:

1. **Seed Custom Categories**: Insert any new categories into the `categories` table first before updating products.
2. **Fetch all products**: Query the database using `db.select().from(schema.products)`.
3. **Iterate & Enhance**: For each product:
   - **Viral & Clickable Titles**: Ensure titles include engaging highlights or descriptive terms.
   - **Categorization**: Map products to the most appropriate category, moving fonts/icons/Figma files to `design-assets` and templates to `saas-templates` or `landing-pages`.
   - **Tags Enrichment**: Build comprehensive comma-separated tags reflecting the product's tech stack (e.g., `nextjs, tailwind, auth, drizzle`).
   - **SEO Detailed Descriptions**: Generate structured Markdown headers featuring:
     - Clear product introduction
     - Key feature bullets
     - Core Tech Stack
     - Quick start or file inclusions list
     - Tag index (e.g. `#nextjs #saas`)
4. **Persist updates**: Perform `db.update(schema.products).set({...}).where(eq(schema.products.id, id))`.
