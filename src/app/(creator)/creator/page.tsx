import { Metadata } from "next";
import { getOrCreateDbUser } from "@/lib/auth-utils";
import { CyberBackground } from "@/components/ui/CyberBackground";
import CreatorHero from "@/components/creator/CreatorHero";
import CreatorProblemOpportunity from "@/components/creator/CreatorProblemOpportunity";
import CreatorProductTypes from "@/components/creator/CreatorProductTypes";
import CreatorWorkflow from "@/components/creator/CreatorWorkflow";
import CreatorEarningsCalculator from "@/components/creator/CreatorEarningsCalculator";
import CreatorPackagingGuide from "@/components/creator/CreatorPackagingGuide";
import CreatorFAQ from "@/components/creator/CreatorFAQ";
import CreatorFinalCTA from "@/components/creator/CreatorFinalCTA";

export const metadata: Metadata = {
  title: "Sell on Scriptly | Developer Creator Platform & Marketplace",
  description: "Turn your boilerplates, scripts, tools, and UI kits into high-margin developer products. Keep 95% of direct sales with $0 monthly fees.",
  keywords: [
    "sell developer tools",
    "sell code online",
    "developer creator economy",
    "sell Next.js templates",
    "monetize software",
    "sell boilerplates",
    "developer marketplace",
  ],
  openGraph: {
    title: "Sell on Scriptly | Developer Creator Platform",
    description: "You built it. Now sell it. Keep 95% of direct sales with $0 listing or monthly fees.",
  },
};

export default async function CreatorLandingPage() {
  const user = await getOrCreateDbUser();
  const isLoggedIn = Boolean(user);

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <CyberBackground />
      <div className="relative z-10">
        <CreatorHero
          isLoggedIn={isLoggedIn}
          userName={user?.name || user?.email}
        />
        <CreatorProblemOpportunity />
        <CreatorProductTypes />
        <CreatorWorkflow />
        <CreatorEarningsCalculator />
        <CreatorPackagingGuide />
        <CreatorFAQ />
        <CreatorFinalCTA isLoggedIn={isLoggedIn} />
      </div>
    </div>
  );
}
