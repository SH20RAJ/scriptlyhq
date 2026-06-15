"use server";

import { db } from "../../db";
import { users, coupons } from "../../db/schema";
import { eq, and } from "drizzle-orm";
import { getOrCreateDbUser } from "../auth-utils";
import { revalidatePath } from "next/cache";

export async function updateCreatorStoreNameAction(storeName: string) {
  const user = await getOrCreateDbUser();
  if (!user) {
    throw new Error("Unauthorized: Sign in required.");
  }

  const trimmed = storeName.trim();
  if (trimmed.length > 50) {
    throw new Error("Store name must be less than 50 characters.");
  }

  await db
    .update(users)
    .set({
      storeName: trimmed || null,
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id));

  revalidatePath("/dashboard/creator");
  return { success: true };
}

export async function createCreatorCouponAction(formData: FormData) {
  const user = await getOrCreateDbUser();
  if (!user) {
    throw new Error("Unauthorized: Sign in required.");
  }

  const code = (formData.get("code") as string)?.trim().toUpperCase();
  const discountType = (formData.get("discountType") as string) || "percentage";
  const discountValueStr = formData.get("discountValue") as string;
  const minPurchaseAmountStr = formData.get("minPurchaseAmount") as string;

  if (!code || !/^[A-Z0-9]{3,15}$/.test(code)) {
    throw new Error("Coupon code must be alphanumeric and between 3 to 15 characters.");
  }

  const discountValue = parseInt(discountValueStr, 10);
  if (isNaN(discountValue) || discountValue <= 0) {
    throw new Error("Discount value must be a positive number.");
  }

  if (discountType === "percentage" && discountValue > 100) {
    throw new Error("Percentage discount cannot exceed 100%.");
  }

  const minPurchaseValue = parseFloat(minPurchaseAmountStr || "0");
  const minPurchaseAmount = isNaN(minPurchaseValue) ? 0 : Math.round(minPurchaseValue * 100);

  // Check if coupon code already exists
  const existing = await db.query.coupons.findFirst({
    where: eq(coupons.code, code),
  });

  if (existing) {
    throw new Error("Coupon code already exists. Please choose a different code.");
  }

  const id = crypto.randomUUID();

  await db.insert(coupons).values({
    id,
    code,
    discountType,
    discountValue,
    minPurchaseAmount,
    active: true,
    creatorId: user.id, // Linked specifically to this creator's items!
  });

  revalidatePath("/dashboard/creator");
  return { success: true };
}

export async function deleteCreatorCouponAction(couponId: string) {
  const user = await getOrCreateDbUser();
  if (!user) {
    throw new Error("Unauthorized: Sign in required.");
  }

  const coupon = await db.query.coupons.findFirst({
    where: and(eq(coupons.id, couponId), eq(coupons.creatorId, user.id)),
  });

  if (!coupon) {
    throw new Error("Coupon not found or unauthorized.");
  }

  await db.delete(coupons).where(eq(coupons.id, couponId));

  revalidatePath("/dashboard/creator");
  return { success: true };
}

export async function updateCreatorPayoutSettingsAction(
  payoutMethod: string,
  paypalEmail: string,
  payoutDetails: string,
  bankName?: string,
  bankAccountName?: string,
  bankAccountNumber?: string,
  bankIfsc?: string
) {
  const user = await getOrCreateDbUser();
  if (!user) {
    throw new Error("Unauthorized: Sign in required.");
  }

  const emailTrimmed = paypalEmail?.trim() || "";
  const detailsTrimmed = payoutDetails?.trim() || "";
  const method = payoutMethod || null;

  await db
    .update(users)
    .set({
      payoutMethod: method,
      paypalEmail: emailTrimmed || null,
      payoutDetails: detailsTrimmed || null,
      bankName: bankName?.trim() || null,
      bankAccountName: bankAccountName?.trim() || null,
      bankAccountNumber: bankAccountNumber?.trim() || null,
      bankIfsc: bankIfsc?.trim() || null,
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id));

  revalidatePath("/dashboard/creator");
  return { success: true };
}
