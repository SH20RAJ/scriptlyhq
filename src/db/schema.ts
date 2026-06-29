import { pgTable, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(), // Matches Hexclave User ID
  email: text("email").notNull(),
  name: text("name"),
  role: text("role").default("user").notNull(), // 'user' or 'admin'
  storeName: text("store_name"),
  payoutMethod: text("payout_method"),
  paypalEmail: text("paypal_email"),
  payoutDetails: text("payout_details"),
  razorpayAccountId: text("razorpay_account_id"),
  bankName: text("bank_name"),
  bankAccountName: text("bank_account_name"),
  bankAccountNumber: text("bank_account_number"),
  bankIfsc: text("bank_ifsc"),
  affiliateSlug: text("affiliate_slug").unique(),
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
  redirectDownload: boolean("redirect_download").default(true).notNull(),
  price: integer("price").notNull(), // Price in paise (INR)
  version: text("version").default("1.0.0").notNull(),
  featured: boolean("featured").default(false).notNull(),
  published: boolean("published").default(true).notNull(),
  creatorId: text("creator_id").references(() => users.id, { onDelete: "set null" }),
  status: text("status").default("pending"), // 'pending', 'approved', 'rejected'
  rating: text("rating").default("5.0").notNull(), // Average rating (e.g. '4.8')
  ratingCount: integer("rating_count").default(1).notNull(), // Internal count
  isFree: boolean("is_free").default(false).notNull(),
  discountPercent: integer("discount_percent").default(0).notNull(),
  promoStart: timestamp("promo_start"),
  promoEnd: timestamp("promo_end"),
  views: integer("views").default(0).notNull(),
  downloadsCount: integer("downloads_count").default(0).notNull(),
  saves: integer("saves").default(0).notNull(),
  personal: boolean("personal").default(false).notNull(),
  showStats: boolean("show_stats").default(false).notNull(),
  affiliateCommissionPercent: integer("affiliate_commission_percent").default(10).notNull(),
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
  creatorId: text("creator_id").references(() => users.id, { onDelete: "cascade" }),
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
  addOnEditCopy: boolean("add_on_edit_copy").default(false).notNull(),
  addOnSetupDeploy: boolean("add_on_setup_deploy").default(false).notNull(),
  referredById: text("referred_by_id").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const downloads = pgTable("downloads", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  productId: text("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
  orderId: text("order_id").references(() => orders.id, { onDelete: "cascade" }).notNull(),
  downloadedAt: timestamp("downloaded_at").defaultNow().notNull(),
});

export const payouts = pgTable("payouts", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  amount: integer("amount").notNull(), // Payout amount in USD cents
  status: text("status").default("processed").notNull(), // 'pending', 'processed'
  payoutMethod: text("payout_method"),
  paypalEmail: text("paypal_email"),
  payoutDetails: text("payout_details"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reviews = pgTable("reviews", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  productId: text("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  parentId: text("parent_id"), // Self-reference for replies
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reviewLikes = pgTable("review_likes", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  reviewId: text("review_id").references(() => reviews.id, { onDelete: "cascade" }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userInteractions = pgTable("user_interactions", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  productId: text("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
  type: text("type").notNull(), // 'save' or 'like'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const affiliateProfiles = pgTable("affiliate_profiles", {
  id: text("id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  status: text("status").default("pending").notNull(), // 'pending', 'approved', 'rejected'
  channels: text("channels"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const affiliateReferrals = pgTable("affiliate_referrals", {
  id: text("id").primaryKey(),
  affiliateId: text("affiliate_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  productId: text("product_id").references(() => products.id, { onDelete: "cascade" }),
  ipHash: text("ip_hash").notNull(),
  userAgent: text("user_agent"),
  referrerUrl: text("referrer_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const affiliateCommissions = pgTable("affiliate_commissions", {
  id: text("id").primaryKey(),
  affiliateId: text("affiliate_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  orderId: text("order_id").references(() => orders.id, { onDelete: "cascade" }).notNull(),
  productId: text("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
  amount: integer("amount").notNull(), // commission in USD cents
  percent: integer("percent").notNull(),
  status: text("status").default("pending").notNull(), // 'pending', 'paid', 'cancelled'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
