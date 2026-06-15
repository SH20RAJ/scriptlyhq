"use server";

import { db } from "../../db";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";
import { isAdmin } from "../auth-utils";
import { revalidatePath } from "next/cache";

export async function updateCreatorRazorpayAccountIdAction(userId: string, accountId: string) {
  const authorized = await isAdmin();
  if (!authorized) {
    throw new Error("Unauthorized: Admin access required.");
  }

  const idTrimmed = accountId.trim();
  if (idTrimmed && !/^acc_[a-zA-Z0-9]+$/.test(idTrimmed)) {
    throw new Error("Invalid Razorpay Linked Account ID format. Should start with 'acc_'.");
  }

  await db
    .update(users)
    .set({
      razorpayAccountId: idTrimmed || null,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));

  revalidatePath("/admin/stores");
  revalidatePath("/admin/payouts");
  return { success: true };
}

export async function registerRazorpayRouteAccountAction(userId: string) {
  const authorized = await isAdmin();
  if (!authorized) {
    throw new Error("Unauthorized: Admin access required.");
  }

  const creator = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!creator) {
    throw new Error("Creator not found.");
  }

  const name = creator.storeName || creator.name || "Scriptly Creator";
  const email = creator.email;

  // Razorpay API keys
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret || keyId.startsWith("rzp_test_mock")) {
    throw new Error("Razorpay Live API credentials are required to register Route accounts.");
  }

  try {
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

    const payload = {
      email: email,
      phone: "9100000000", // Placeholder since we do not collect phone
      type: "route",
      reference_id: creator.id.slice(0, 40),
      legal_business_name: name.slice(0, 80),
    };

    const response = await fetch("https://api.razorpay.com/v2/accounts", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json() as any;

    if (response.ok && data.id) {
      // Successfully registered sub-merchant!
      await db
        .update(users)
        .set({
          razorpayAccountId: data.id,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));

      revalidatePath("/admin/stores");
      return { success: true, accountId: data.id };
    }

    const errorMsg = data.error?.description || "Failed to register account with Razorpay.";
    throw new Error(errorMsg);
  } catch (err: any) {
    console.error("Razorpay Route account registration error:", err);
    throw new Error(err.message || "An unexpected error occurred during API registration.");
  }
}
