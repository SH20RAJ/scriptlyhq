export const dynamic = "force-dynamic";

import { Metadata } from "next";
import { isAdmin } from "@/lib/auth-utils";
import { db } from "@/db";
import { affiliateProfiles, affiliateCommissions, users, products } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import AffiliatesAdminClient from "./AffiliatesAdminClient";

export const metadata: Metadata = {
  title: "Admin Affiliate Console | ScriptlyStore",
  description: "Review pending applications and release manual payouts.",
};

export default async function AdminAffiliatesPage() {
  const authorized = await isAdmin();
  if (!authorized) {
    redirect("/");
  }

  // Fetch pending applications
  const pendingProfiles = await db
    .select({
      id: affiliateProfiles.id,
      status: affiliateProfiles.status,
      channels: affiliateProfiles.channels,
      createdAt: affiliateProfiles.createdAt,
      userName: users.name,
      userEmail: users.email,
      affiliateSlug: users.affiliateSlug,
    })
    .from(affiliateProfiles)
    .innerJoin(users, eq(affiliateProfiles.id, users.id))
    .where(eq(affiliateProfiles.status, "pending"))
    .orderBy(desc(affiliateProfiles.createdAt));

  // Fetch pending commissions for manual settlement
  const pendingCommissions = await db
    .select({
      id: affiliateCommissions.id,
      amount: affiliateCommissions.amount,
      percent: affiliateCommissions.percent,
      createdAt: affiliateCommissions.createdAt,
      affiliateName: users.name,
      affiliateEmail: users.email,
      orderId: affiliateCommissions.orderId,
      productTitle: products.title,
    })
    .from(affiliateCommissions)
    .innerJoin(users, eq(affiliateCommissions.affiliateId, users.id))
    .innerJoin(products, eq(affiliateCommissions.productId, products.id))
    .where(eq(affiliateCommissions.status, "pending"))
    .orderBy(desc(affiliateCommissions.createdAt));

  return (
    <div className="container max-w-7xl mx-auto px-4 py-12 md:py-16">
      <AffiliatesAdminClient
        pendingProfiles={pendingProfiles.map(p => ({
          ...p,
          createdAt: p.createdAt.toISOString()
        }))}
        pendingCommissions={pendingCommissions.map(c => ({
          ...c,
          createdAt: c.createdAt.toISOString()
        }))}
      />
    </div>
  );
}
