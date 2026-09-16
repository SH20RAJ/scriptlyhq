"use server";

import Razorpay from "razorpay";
import { db } from "@/db";
import { paymentLinks, paymentLinkActivities, users } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import crypto from "crypto";
import { getOrCreateDbUser, isAdmin } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";

let razorpayInstance: any = null;

function getRazorpay() {
  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_mockkeyid123",
      key_secret: process.env.RAZORPAY_KEY_SECRET || "rzp_test_mocksecret123",
    });
  }
  return razorpayInstance;
}

function generateSlug(title: string, addRandom = false): string {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (!addRandom) {
    return base || `link-${crypto.randomBytes(3).toString("hex")}`;
  }
  const rand = crypto.randomBytes(3).toString("hex");
  return base ? `${base}-${rand}` : `link-${rand}`;
}

export interface CreatePaymentLinkInput {
  title: string;
  price: number; // in INR (will be stored as paise = price * 100)
  description?: string;
  redirectUrl: string;
  customSlug?: string;
  currency?: string;
}

/**
 * Creates a new stored payment link in the database.
 * Accessible to Admin or logged in Creator, or anonymously via the Open API.
 */
export async function createPaymentLinkAction(input: CreatePaymentLinkInput) {
  if (!input.title || !input.title.trim()) {
    throw new Error("Title is required.");
  }
  if (!input.redirectUrl || !input.redirectUrl.trim()) {
    throw new Error("Redirect URL is required.");
  }
  if (!input.price || input.price <= 0) {
    throw new Error("Price must be greater than 0.");
  }

  // Ensure valid URL
  let parsedRedirect = input.redirectUrl.trim();
  if (!/^https?:\/\//i.test(parsedRedirect)) {
    parsedRedirect = "https://" + parsedRedirect;
  }

  try {
    new URL(parsedRedirect);
  } catch {
    throw new Error("Invalid redirect URL format.");
  }

  // Price converted to paise
  const priceInPaise = Math.round(input.price * 100);
  let user = null;
  try {
    user = await getOrCreateDbUser();
  } catch {
    // Outside active request store or anonymous API call
  }

  const id = `pl_${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`;
  let slug = input.customSlug ? generateSlug(input.customSlug, false) : generateSlug(input.title, true);

  // Ensure slug uniqueness
  const existing = await db.query.paymentLinks.findFirst({
    where: eq(paymentLinks.slug, slug),
  });
  if (existing) {
    slug = `${slug}-${crypto.randomBytes(2).toString("hex")}`;
  }

  const [newLink] = await db
    .insert(paymentLinks)
    .values({
      id,
      slug,
      title: input.title.trim(),
      description: input.description?.trim() || null,
      price: priceInPaise,
      currency: input.currency?.toUpperCase() || "INR",
      redirectUrl: parsedRedirect,
      creatorId: user?.id || null,
      active: true,
      views: 0,
      conversions: 0,
      totalEarned: 0,
    })
    .returning();

  try {
    revalidatePath("/admin/payment-links");
  } catch {
    // Ignore outside request scope
  }

  return { success: true, link: newLink };
}

/**
 * Retrieves all payment links for the Admin console with metrics.
 */
export async function getAdminPaymentLinksAction() {
  const authorized = await isAdmin();
  if (!authorized) {
    throw new Error("Unauthorized: Admin access required.");
  }

  const links = await db.query.paymentLinks.findMany({
    orderBy: [desc(paymentLinks.createdAt)],
  });

  return links;
}

/**
 * Retrieves recent payment link activities for the Admin stream.
 */
export async function getPaymentLinkActivitiesAction(limit = 50) {
  const authorized = await isAdmin();
  if (!authorized) {
    throw new Error("Unauthorized: Admin access required.");
  }

  const activities = await db.query.paymentLinkActivities.findMany({
    orderBy: [desc(paymentLinkActivities.createdAt)],
    limit,
  });

  return activities;
}

/**
 * Toggles payment link active status.
 */
export async function togglePaymentLinkActiveAction(id: string, active: boolean) {
  const authorized = await isAdmin();
  if (!authorized) {
    throw new Error("Unauthorized: Admin access required.");
  }

  await db
    .update(paymentLinks)
    .set({ active, updatedAt: new Date() })
    .where(eq(paymentLinks.id, id));

  revalidatePath("/admin/payment-links");
  return { success: true };
}

/**
 * Deletes a payment link.
 */
export async function deletePaymentLinkAction(id: string) {
  const authorized = await isAdmin();
  if (!authorized) {
    throw new Error("Unauthorized: Admin access required.");
  }

  await db.delete(paymentLinks).where(eq(paymentLinks.id, id));
  revalidatePath("/admin/payment-links");
  return { success: true };
}

/**
 * Fetches a public payment link by its slug or ID, and logs a view activity.
 */
export async function getPublicPaymentLinkAction(slugOrId: string) {
  const link = await db.query.paymentLinks.findFirst({
    where: sql`${paymentLinks.slug} = ${slugOrId} OR ${paymentLinks.id} = ${slugOrId}`,
  });

  if (link && link.active) {
    // Increment view count asynchronously
    await db
      .update(paymentLinks)
      .set({ views: sql`${paymentLinks.views} + 1` })
      .where(eq(paymentLinks.id, link.id));

    // Record activity
    await db.insert(paymentLinkActivities).values({
      id: `act_${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`,
      linkId: link.id,
      type: "view",
      amount: link.price,
    });
  }

  return link || null;
}

/**
 * Log an activity (view or checkout initiation) for dynamic or stored links.
 */
export async function logLinkActivityAction({
  linkId,
  type,
  amount,
  payerEmail,
  payerName,
  payerPhone,
  metadata,
}: {
  linkId?: string | null;
  type: "view" | "checkout_initiated" | "payment_success" | "payment_failed";
  amount?: number;
  payerEmail?: string;
  payerName?: string;
  payerPhone?: string;
  metadata?: string;
}) {
  try {
    await db.insert(paymentLinkActivities).values({
      id: `act_${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`,
      linkId: linkId || null,
      type,
      amount: amount || null,
      payerEmail: payerEmail || null,
      payerName: payerName || null,
      payerPhone: payerPhone || null,
      metadata: metadata || null,
    });
  } catch (err) {
    console.error("Failed to log activity:", err);
  }
}

/**
 * Initiates Razorpay Order for a Payment Link (stored or dynamic).
 */
export async function createLinkRazorpayOrderAction({
  linkId,
  title,
  priceInPaise,
  currency = "INR",
  payerEmail,
  payerName,
  payerPhone,
}: {
  linkId?: string;
  title: string;
  priceInPaise: number;
  currency?: string;
  payerEmail?: string;
  payerName?: string;
  payerPhone?: string;
}) {
  if (priceInPaise < 100) {
    throw new Error("Payment amount must be at least ₹1 (100 paise).");
  }

  const razorpay = getRazorpay();

  const options = {
    amount: priceInPaise,
    currency: currency.toUpperCase(),
    receipt: `rcpt_link_${Date.now().toString().slice(-8)}`,
    notes: {
      type: "payment_link",
      title: title.slice(0, 40),
      linkId: linkId || "dynamic",
      payerEmail: payerEmail || "",
      payerName: payerName || "",
    },
  };

  const order = await razorpay.orders.create(options);

  // Log checkout initiation
  await logLinkActivityAction({
    linkId: linkId || null,
    type: "checkout_initiated",
    amount: priceInPaise,
    payerEmail,
    payerName,
    payerPhone,
    metadata: JSON.stringify({ orderId: order.id, title }),
  });

  return {
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_mockkeyid123",
  };
}

/**
 * Verifies Razorpay payment signature and completes payment link fulfillment.
 */
export async function verifyLinkPaymentAction({
  orderId,
  paymentId,
  signature,
  linkId,
  redirectUrl,
  amount,
  payerEmail,
  payerName,
  payerPhone,
}: {
  orderId: string;
  paymentId: string;
  signature: string;
  linkId?: string;
  redirectUrl: string;
  amount: number;
  payerEmail?: string;
  payerName?: string;
  payerPhone?: string;
}) {
  const secret = process.env.RAZORPAY_KEY_SECRET || "rzp_test_mocksecret123";
  const body = orderId + "|" + paymentId;
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === signature;

  if (!isAuthentic) {
    await logLinkActivityAction({
      linkId: linkId || null,
      type: "payment_failed",
      amount,
      payerEmail,
      payerName,
      payerPhone,
      metadata: JSON.stringify({ orderId, paymentId, reason: "Signature mismatch" }),
    });
    throw new Error("Invalid payment signature verification.");
  }

  // Update link metrics if stored link
  if (linkId) {
    await db
      .update(paymentLinks)
      .set({
        conversions: sql`${paymentLinks.conversions} + 1`,
        totalEarned: sql`${paymentLinks.totalEarned} + ${amount}`,
        updatedAt: new Date(),
      })
      .where(eq(paymentLinks.id, linkId));
  }

  // Log successful activity
  await db.insert(paymentLinkActivities).values({
    id: `act_${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`,
    linkId: linkId || null,
    type: "payment_success",
    orderId,
    paymentId,
    amount,
    payerEmail: payerEmail || null,
    payerName: payerName || null,
    payerPhone: payerPhone || null,
    metadata: JSON.stringify({ redirectUrl }),
  });

  return {
    success: true,
    redirectUrl,
    orderId,
    paymentId,
  };
}
