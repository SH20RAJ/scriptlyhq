export const dynamic = "force-dynamic";

import { Metadata } from "next";
import { getOrCreateDbUser } from "@/lib/auth-utils";
import { db } from "@/db";
import { affiliateProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import AffiliateOnboardingClient from "./AffiliateOnboardingClient";

export const metadata: Metadata = {
  title: "Affiliate Partner Program | ScriptlyStore",
  description: "Join our affiliate program and earn high recurring commission splits by promoting ready-to-use developer scripts, templates, and tech ebooks.",
};

export default async function AffiliatePortalPage() {
  const user = await getOrCreateDbUser();

  if (!user) {
    return (
      <AffiliateOnboardingClient
        initialSlug=""
        isLoggedIn={false}
        status={null}
      />
    );
  }

  // Fetch their affiliate profile
  const profile = await db.query.affiliateProfiles.findFirst({
    where: eq(affiliateProfiles.id, user.id),
  });

  if (profile?.status === "approved") {
    redirect("/affiliate/dashboard");
  }

  return (
    <AffiliateOnboardingClient
      initialSlug={user.affiliateSlug || ""}
      isLoggedIn={true}
      status={profile ? profile.status : null}
    />
  );
}
