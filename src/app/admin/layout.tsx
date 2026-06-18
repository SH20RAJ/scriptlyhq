import { isAdmin } from "../../lib/auth-utils";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, ShoppingCart, Package, Home, ShieldAlert, FolderKanban, Gift, CheckSquare, Store, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { db } from "../../db";
import { products } from "../../db/schema";
import { eq, sql } from "drizzle-orm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Console",
  description: "ScriptlyStore admin dashboard for managing products, orders, creators, and payouts.",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authorized = await isAdmin();

  if (!authorized) {
    redirect("/");
  }

  // Fetch pending script count for badge
  const [pendingCountResult] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(products)
    .where(eq(products.status, "pending"));
  const pendingCount = pendingCountResult?.count || 0;

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      
      {/* Admin Sidebar */}
      <aside className="w-64 border-r border-border bg-card/30 flex flex-col justify-between flex-shrink-0">
        <div className="p-6 space-y-8">
          <div className="flex items-center space-x-2 text-foreground font-semibold tracking-tight uppercase text-xs">
            <ShieldAlert className="w-4 h-4" />
            <span>Admin Console</span>
          </div>

          <nav className="space-y-1">
            <Button asChild variant="ghost" className="w-full justify-start font-normal text-muted-foreground hover:text-foreground">
              <Link href="/admin">
                <LayoutDashboard className="w-4 h-4 mr-3" />
                Overview
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full justify-start font-normal text-muted-foreground hover:text-foreground">
              <Link href="/admin/approvals" className="flex items-center justify-between w-full">
                <span className="flex items-center">
                  <CheckSquare className="w-4 h-4 mr-3" />
                  Approvals
                </span>
                {pendingCount > 0 && (
                  <span className="px-2 py-0.5 text-[9px] font-black bg-rose-500 text-white rounded-full">
                    {pendingCount}
                  </span>
                )}
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full justify-start font-normal text-muted-foreground hover:text-foreground">
              <Link href="/admin/products">
                <Package className="w-4 h-4 mr-3" />
                Products
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full justify-start font-normal text-muted-foreground hover:text-foreground">
              <Link href="/admin/categories">
                <FolderKanban className="w-4 h-4 mr-3" />
                Categories
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full justify-start font-normal text-muted-foreground hover:text-foreground">
              <Link href="/admin/coupons">
                <Gift className="w-4 h-4 mr-3" />
                Coupons
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full justify-start font-normal text-muted-foreground hover:text-foreground">
              <Link href="/admin/stores">
                <Store className="w-4 h-4 mr-3" />
                Stores & Creators
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full justify-start font-normal text-muted-foreground hover:text-foreground">
              <Link href="/admin/payouts">
                <Coins className="w-4 h-4 mr-3" />
                Payouts
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full justify-start font-normal text-muted-foreground hover:text-foreground">
              <Link href="/admin/orders">
                <ShoppingCart className="w-4 h-4 mr-3" />
                Orders
              </Link>
            </Button>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-6">
          <Separator className="mb-6" />
          <Button asChild variant="ghost" className="w-full justify-start font-normal text-muted-foreground hover:text-foreground">
            <Link href="/">
              <Home className="w-4 h-4 mr-3" />
              Marketplace
            </Link>
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-12">
        {children}
      </main>
    </div>
  );
}
