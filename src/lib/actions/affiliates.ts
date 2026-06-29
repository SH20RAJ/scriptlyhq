"use server";

import { db } from "@/db";
import { users, affiliateProfiles, affiliateCommissions, orders, products, affiliateReferrals, payouts } from "@/db/schema";
import { eq, and, ne, desc, gt, or } from "drizzle-orm";
import { getOrCreateDbUser, isAdmin } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";
import crypto from "crypto";
import { headers } from "next/headers";

export async function registerAffiliateAction({
  slug,
  channels,
}: {
  slug: string;
  channels: string;
}) {
  const user = await getOrCreateDbUser();
  if (!user) {
    throw new Error("Unauthorized: Please sign in to register.");
  }

  // Validate slug
  const cleanSlug = slug.trim().toLowerCase();
  if (!/^[a-z0-9_-]{3,20}$/.test(cleanSlug)) {
    throw new Error("Handle must be 3-20 characters, containing only letters, numbers, hyphens, or underscores.");
  }

  // Check if slug is taken
  const taken = await db.query.users.findFirst({
    where: and(eq(users.affiliateSlug, cleanSlug), ne(users.id, user.id)),
  });

  if (taken) {
    throw new Error("This referral handle is already in use by another user.");
  }

  // Update user's affiliate slug
  await db
    .update(users)
    .set({
      affiliateSlug: cleanSlug,
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id));

  // Create or update affiliate profile
  const existingProfile = await db.query.affiliateProfiles.findFirst({
    where: eq(affiliateProfiles.id, user.id),
  });

  if (existingProfile) {
    await db
      .update(affiliateProfiles)
      .set({
        channels,
        status: "approved", // Auto-approved
        updatedAt: new Date(),
      })
      .where(eq(affiliateProfiles.id, user.id));
  } else {
    await db.insert(affiliateProfiles).values({
      id: user.id,
      channels,
      status: "approved", // Auto-approved
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  revalidatePath("/affiliate");
  revalidatePath("/affiliate/dashboard");
  return { success: true };
}

export async function updateAffiliateStatusAction({
  userId,
  status,
}: {
  userId: string;
  status: "approved" | "rejected";
}) {
  const authorized = await isAdmin();
  if (!authorized) {
    throw new Error("Unauthorized: Admin access required.");
  }

  await db
    .update(affiliateProfiles)
    .set({
      status,
      updatedAt: new Date(),
    })
    .where(eq(affiliateProfiles.id, userId));

  revalidatePath("/admin/affiliates");
  return { success: true };
}

export async function getAffiliateDashboardStatsAction() {
  const user = await getOrCreateDbUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  // Fetch referrals (clicks)
  const clicks = await db.query.affiliateReferrals.findMany({
    where: eq(affiliateReferrals.affiliateId, user.id),
  });

  // Fetch commissions
  const commissions = await db.query.affiliateCommissions.findMany({
    where: eq(affiliateCommissions.affiliateId, user.id),
    orderBy: desc(affiliateCommissions.createdAt),
  });

  // Fetch orders referred
  const referredOrders = await db
    .select({
      id: orders.id,
      amount: orders.amount,
      status: orders.status,
      createdAt: orders.createdAt,
      productTitle: products.title,
    })
    .from(orders)
    .innerJoin(products, eq(orders.productId, products.id))
    .where(eq(orders.referredById, user.id))
    .orderBy(desc(orders.createdAt));

  const totalClicks = clicks.length;
  const totalConversions = referredOrders.filter(o => o.status === "completed").length;
  const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;

  const totalEarned = commissions
    .filter(c => c.status === "paid" || c.status === "approved" || c.status === "pending")
    .reduce((sum, c) => sum + c.amount, 0);

  const unpaidBalance = commissions
    .filter(c => c.status === "pending")
    .reduce((sum, c) => sum + c.amount, 0);

  const paidBalance = commissions
    .filter(c => c.status === "paid")
    .reduce((sum, c) => sum + c.amount, 0);

  return {
    totalClicks,
    totalConversions,
    conversionRate,
    totalEarned,
    unpaidBalance,
    paidBalance,
    commissions,
    referredOrders,
  };
}

export async function recordReferralClickAction({
  ref,
  productId,
  referrerUrl,
}: {
  ref: string;
  productId?: string;
  referrerUrl?: string;
}) {
  try {
    const referrer = await db.query.users.findFirst({
      where: or(eq(users.id, ref), eq(users.affiliateSlug, ref)),
    });

    if (!referrer) return { success: false };

    // Get IP address and User Agent for simple deduplication
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "unknown";
    const userAgent = headersList.get("user-agent") || "unknown";

    // Hash the IP to respect privacy
    const ipHash = crypto.createHash("sha256").update(ip).digest("hex");

    // Check if this IP clicked this affiliate link in the last 24 hours to prevent spam
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const existingClick = await db.query.affiliateReferrals.findFirst({
      where: and(
        eq(affiliateReferrals.affiliateId, referrer.id),
        eq(affiliateReferrals.ipHash, ipHash),
        gt(affiliateReferrals.createdAt, oneDayAgo)
      ),
    });

    if (existingClick) {
      return { success: true, message: "Duplicate click ignored" };
    }

    await db.insert(affiliateReferrals).values({
      id: crypto.randomUUID(),
      affiliateId: referrer.id,
      productId: productId || null,
      ipHash,
      userAgent,
      referrerUrl: referrerUrl || null,
      createdAt: new Date(),
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to log referral click:", error);
    return { success: false };
  }
}

export async function payoutAffiliateCommissionAction(commissionId: string) {
  const authorized = await isAdmin();
  if (!authorized) {
    throw new Error("Unauthorized: Admin access required.");
  }

  const commission = await db.query.affiliateCommissions.findFirst({
    where: eq(affiliateCommissions.id, commissionId),
  });

  if (!commission) {
    throw new Error("Commission record not found.");
  }

  if (commission.status === "paid") {
    throw new Error("Commission is already paid.");
  }

  // Update commission status to paid
  await db
    .update(affiliateCommissions)
    .set({
      status: "paid",
      updatedAt: new Date(),
    })
    .where(eq(affiliateCommissions.id, commissionId));

  // Log payout
  await db.insert(payouts).values({
    id: crypto.randomUUID(),
    userId: commission.affiliateId,
    amount: commission.amount,
    status: "processed",
    payoutMethod: "manual",
    payoutDetails: `Manual admin settlement for affiliate commission. Order: ${commission.orderId}`,
    createdAt: new Date(),
  });

  revalidatePath("/admin/affiliates");
  return { success: true };
}

export async function validateReferralCodeAction(code: string) {
  if (!code) {
    return { success: false, message: "Please enter a code." };
  }
  const cleanCode = code.trim().toLowerCase();
  const referrer = await db.query.users.findFirst({
    where: or(eq(users.id, cleanCode), eq(users.affiliateSlug, cleanCode)),
  });
  if (!referrer) {
    return { success: false, message: "Referral code not found." };
  }
  const affiliateProfile = await db.query.affiliateProfiles.findFirst({
    where: eq(affiliateProfiles.id, referrer.id),
  });
  if (!affiliateProfile || affiliateProfile.status !== "approved") {
    return { success: false, message: "Affiliate profile is inactive." };
  }
  return { 
    success: true, 
    referrerId: referrer.id,
    referrerSlug: referrer.affiliateSlug || referrer.id,
    storeName: referrer.storeName || "Partner" 
  };
}
