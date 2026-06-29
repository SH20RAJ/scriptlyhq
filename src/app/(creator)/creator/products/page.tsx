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
    redirect("/handler/sign-in?redirectTo=/creator/products");
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight text-foreground">
            My Creations
          </h1>
          <p className="text-xs text-muted-foreground font-medium mt-1">
            Manage your listed scripts, adjust pricing, or edit information.
          </p>
        </div>
        <Button asChild size="sm" className="rounded-xl h-10 px-5 font-black uppercase tracking-wider text-[10px] bg-[#58CC02] text-white hover:bg-[#58CC02]/90 cursor-pointer shadow-sm">
          <Link href="/creator/new">
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            List New Script
          </Link>
        </Button>
      </div>

      {/* Table */}
      <div className="border border-border/40 bg-card/45 backdrop-blur-md rounded-2xl p-4 shadow-sm overflow-hidden">
        <CreatorProductsTable products={creatorProducts} />
      </div>

    </div>
  );
}
