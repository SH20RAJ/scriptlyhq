export const dynamic = "force-dynamic";

import { Metadata } from "next";
import { db } from "@/db";
import { coupons } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getOrCreateDbUser } from "@/lib/auth-utils";
import { redirect } from "next/navigation";
import CreatorCouponsManager from "@/components/CreatorCouponsManager";

export const metadata: Metadata = {
  title: "Store Coupons | Creator Console",
  description: "Create and manage custom promotional coupon codes.",
};

export default async function CreatorCouponsPage() {
  const user = await getOrCreateDbUser();
  if (!user) {
    redirect("/handler/sign-in?redirectTo=/creator/coupons");
  }

  // Fetch creator's specific store coupons
  const storeCoupons = await db
    .select({
      id: coupons.id,
      code: coupons.code,
      discountType: coupons.discountType,
      discountValue: coupons.discountValue,
      minPurchaseAmount: coupons.minPurchaseAmount,
      active: coupons.active,
    })
    .from(coupons)
    .where(eq(coupons.creatorId, user.id))
    .orderBy(desc(coupons.createdAt));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="border-b border-border pb-6">
        <h1 className="text-xl md:text-2xl font-black tracking-tight text-foreground">
          Store Coupons
        </h1>
        <p className="text-xs text-muted-foreground font-medium mt-1">
          Create discount codes valid across all your storefront products.
        </p>
      </div>

      {/* Coupons Manager */}
      <div>
        <CreatorCouponsManager initialCoupons={storeCoupons} />
      </div>

    </div>
  );
}
