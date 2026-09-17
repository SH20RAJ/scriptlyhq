export const dynamic = "force-dynamic";

import { Metadata } from "next";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getOrCreateDbUser } from "@/lib/auth-utils";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreatorProductsTable from "@/components/CreatorProductsTable";

export const metadata: Metadata = {
  title: "My Creations | Creator Console",
  description: "View and manage all listed developer scripts and templates.",
};

export default async function CreatorProductsPage() {
  const user = await getOrCreateDbUser();
  if (!user) {
    redirect("/handler/sign-in?redirectTo=/creator/dashboard");
  }

  // Fetch creator's products
  const creatorProducts = await db
    .select()
    .from(products)
    .where(eq(products.creatorId, user.id))
    .orderBy(desc(products.createdAt));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            My Creations
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage your listed scripts, adjust pricing, or edit documentation.
          </p>
        </div>
        <Button
          asChild
          size="sm"
          className="bg-[#58CC02] hover:bg-[#58CC02]/90 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-[0_3px_0_#46A302] active:translate-y-px active:shadow-none"
        >
          <Link href="/creator/new">
            <Plus className="w-3.5 h-3.5 mr-1.5" /> List New Script
          </Link>
        </Button>
      </div>

      {/* Table Container */}
      <div className="border border-border/50 bg-card/30 backdrop-blur-md rounded-2xl overflow-hidden shadow-sm">
        <CreatorProductsTable products={creatorProducts} />
      </div>
    </div>
  );
}
