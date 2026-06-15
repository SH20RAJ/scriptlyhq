"use server";

import { db } from "../../db";
import { payouts, users } from "../../db/schema";
import { eq } from "drizzle-orm";
import { isAdmin } from "../auth-utils";
import { revalidatePath } from "next/cache";

export async function recordPayoutAction({
  userId,
  amountCents,
  payoutMethod,
  paypalEmail,
  payoutDetails,
}: {
  userId: string;
  amountCents: number;
  payoutMethod?: string;
  paypalEmail?: string;
  payoutDetails?: string;
}) {
  const authorized = await isAdmin();
  if (!authorized) {
    throw new Error("Unauthorized: Admin access required.");
  }

  if (amountCents <= 0) {
    throw new Error("Payout amount must be greater than zero.");
  }

  // Verify creator exists
  const creator = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!creator) {
    throw new Error("Creator not found.");
  }

  const id = crypto.randomUUID();

  await db.insert(payouts).values({
    id,
    userId,
    amount: amountCents,
    status: "processed",
    payoutMethod: payoutMethod || creator.payoutMethod || null,
    paypalEmail: paypalEmail || creator.paypalEmail || null,
    payoutDetails: payoutDetails || creator.payoutDetails || null,
    createdAt: new Date(),
  });

  revalidatePath("/admin/payouts");
  return { success: true };
}
