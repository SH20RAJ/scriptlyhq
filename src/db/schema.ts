import { pgTable, text, integer, boolean, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(), // Matches Hexclave User ID
  email: text("email").notNull(),
  name: text("name"),
  role: text("role").default("user").notNull(), // 'user' or 'admin'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const categories = pgTable("categories", {
  id: text("id").primaryKey(), // UUID or custom slug-like ID
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
});

export const subcategories = pgTable("subcategories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  categoryId: text("category_id").references(() => categories.id, { onDelete: "cascade" }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: text("id").primaryKey(), // UUID or unique ID
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  shortDescription: text("short_description").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // References categories.slug or stored as string
  subcategory: text("subcategory"), // References subcategories.slug or stored as string
  tags: text("tags"), // Comma-separated tags
  thumbnail: text("thumbnail"), // URL/Path to thumbnail image
  previewGif: text("preview_gif"), // URL to preview GIF on hover
  screenshots: text("screenshots"), // JSON string or comma-separated URLs
  videoUrl: text("video_url"), // YouTube embed or direct video URL
  demoUrl: text("demo_url"),
  fileUrl: text("file_url"), // URL to product file
  price: integer("price").notNull(), // Price in paise (INR)
  version: text("version").default("1.0.0").notNull(),
  featured: boolean("featured").default(false).notNull(),
  published: boolean("published").default(true).notNull(),
  creatorId: text("creator_id").references(() => users.id, { onDelete: "set null" }),
  status: text("status").default("pending"), // 'pending', 'approved', 'rejected'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const coupons = pgTable("coupons", {
  id: text("id").primaryKey(),
  code: text("code").notNull().unique(),
  discountType: text("discount_type").notNull(),
  discountValue: integer("discount_value").notNull(),
  minPurchaseAmount: integer("min_purchase_amount").default(0).notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  productId: text("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
  razorpayOrderId: text("razorpay_order_id").notNull(),
  razorpayPaymentId: text("razorpay_payment_id"),
  amount: integer("amount").notNull(), // Amount in paise
  status: text("status").default("pending").notNull(), // 'pending', 'completed', 'failed'
  couponCode: text("coupon_code"),
  discountApplied: integer("discount_applied").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const downloads = pgTable("downloads", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  productId: text("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
  orderId: text("order_id").references(() => orders.id, { onDelete: "cascade" }).notNull(),
  downloadedAt: timestamp("downloaded_at").defaultNow().notNull(),
});
