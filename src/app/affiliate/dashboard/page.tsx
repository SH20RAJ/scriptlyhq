export const dynamic = "force-dynamic";

import { Metadata } from "next";
import { getOrCreateDbUser } from "@/lib/auth-utils";
import { db } from "@/db";
import { affiliateProfiles, products } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getAffiliateDashboardStatsAction } from "@/lib/actions/affiliates";
import AffiliateDashboardClient from "./AffiliateDashboardClient";

export const metadata: Metadata = {
  title: "Affiliate Dashboard | ScriptlyStore",
  description: "Track your referral clicks, sales, commission payouts, and generate affiliate links.",
};

export default async function AffiliateDashboardPage() {
  const user = await getOrCreateDbUser();
  if (!user) {
    redirect("/handler/sign-in?redirectTo=/affiliate/dashboard");
  }

  // Fetch affiliate profile to check approval status
  const profile = await db.query.affiliateProfiles.findFirst({
    where: eq(affiliateProfiles.id, user.id),
  });

  if (!profile || profile.status !== "approved") {
    redirect("/affiliate");
  }

  // Fetch approved products that affiliates can promote
  const activeProducts = await db.query.products.findMany({
    where: eq(products.status, "approved"),
    orderBy: desc(products.createdAt),
  });

  // Fetch affiliate performance metrics
  const stats = await getAffiliateDashboardStatsAction();

  return (
    <AffiliateDashboardClient
      products={activeProducts.map(p => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        price: p.price,
        affiliateCommissionPercent: p.affiliateCommissionPercent ?? 10
      }))}
      affiliateSlug={user.affiliateSlug || ""}
      stats={stats}
    />
  );
}
