export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { db } from "@/db";
import { products, orders } from "@/db/schema";
import { eq, and, desc, inArray } from "drizzle-orm";
import { getOrCreateDbUser } from "@/lib/auth-utils";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Package,
  Sparkles,
  AlertTriangle,
  Plus,
  LayoutGrid,
  Coins,
  Activity,
  ArrowRight,
  ShieldCheck,
  Hourglass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Creator Console | ScriptlyStore",
  description: "Manage your developer storefront, configure automated splits via Razorpay Route, and track script earnings.",
};

export default async function CreatorConsolePage() {
  const user = await getOrCreateDbUser();
  if (!user) {
    redirect("/handler/sign-in?redirectTo=/dashboard/creator");
  }

  // Fetch creator's products
  const creatorProducts = await db
    .select()
    .from(products)
    .where(eq(products.creatorId, user.id))
    .orderBy(desc(products.createdAt));

  const productIds = creatorProducts.map((p) => p.id);

  let totalSold = 0;
  let grossSales = 0;
  let salesHistory: { orderId: string; amount: number; date: Date; productTitle: string }[] = [];

  if (productIds.length > 0) {
    salesHistory = await db
      .select({
        orderId: orders.id,
        amount: orders.amount,
        date: orders.createdAt,
        productTitle: products.title,
      })
      .from(orders)
      .innerJoin(products, eq(orders.productId, products.id))
      .where(and(eq(orders.status, "completed"), inArray(orders.productId, productIds)))
      .orderBy(desc(orders.createdAt));

    totalSold = salesHistory.length;
    grossSales = salesHistory.reduce((sum, item) => sum + item.amount, 0);
  }

  const creatorShare = Math.round(grossSales * 0.95);

  // Determine Razorpay Route Connection Status
  const hasBankDetails = !!user.bankAccountNumber && !!user.bankIfsc;
  const isRouteActive = !!user.razorpayAccountId && user.razorpayAccountId.startsWith("acc_");

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Welcome / Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
            Overview
            <Badge className="bg-[#CE82FF]/10 text-[#CE82FF] border-[#CE82FF]/20 text-[9px] uppercase tracking-wider h-5 font-black">
              Beta
            </Badge>
          </h1>
          <p className="text-xs text-muted-foreground font-medium mt-1">
            Monitor store-level analytics, split payments status, and quick shortcuts.
          </p>
        </div>
        <Button asChild size="sm" className="rounded-xl h-10 px-5 font-black uppercase tracking-wider text-[10px] bg-[#58CC02] text-white hover:bg-[#58CC02]/90 cursor-pointer shadow-sm">
          <Link href="/dashboard/creator/new">
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            List New Script
          </Link>
        </Button>
      </div>

      {/* Razorpay Route Split Integration Status Banner */}
      {isRouteActive ? (
        <div className="p-5 rounded-2xl border-2 border-emerald-500/10 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 flex gap-4 items-start shadow-sm">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="font-black text-emerald-700 dark:text-emerald-300 uppercase tracking-wider text-[10px]">Razorpay Route splits Active</h4>
              <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border-0 text-[8px] uppercase tracking-wider font-bold h-4">Verified</Badge>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
              Your store split configuration is completely active. 95% of customer payments are split instantly at checkout and transferred directly to your bank account under sub-merchant account <span className="font-mono text-emerald-600 dark:text-emerald-300 bg-muted px-1.5 py-0.5 rounded">{user.razorpayAccountId}</span>.
              <Link href="/docs/route-guide" className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline font-bold transition-all ml-1.5">
                Route Guide <ArrowRight className="w-3 h-3" />
              </Link>
            </p>
          </div>
        </div>
      ) : hasBankDetails ? (
        <div className="p-5 rounded-2xl border-2 border-amber-500/10 bg-amber-500/5 text-amber-600 dark:text-amber-400 flex gap-4 items-start shadow-sm">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 shrink-0">
            <Hourglass className="w-5 h-5 animate-pulse" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="font-black text-amber-700 dark:text-amber-300 uppercase tracking-wider text-[10px]">Onboarding in Progress</h4>
              <Badge className="bg-amber-500/20 text-amber-600 dark:text-amber-300 border-0 text-[8px] uppercase tracking-wider font-bold h-4">API Approval Pending</Badge>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
              Your bank details are recorded. Our system administrators are setting up your merchant credentials on the Razorpay node.
              <Link href="/docs/route-guide" className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 hover:underline font-bold transition-all ml-1.5">
                Route Guide <ArrowRight className="w-3 h-3" />
              </Link>
            </p>
          </div>
        </div>
      ) : (
        <div className="p-5 rounded-2xl border-2 border-rose-500/10 bg-rose-500/5 text-rose-600 dark:text-rose-400 flex gap-4 items-start shadow-sm">
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="font-black text-rose-700 dark:text-rose-300 uppercase tracking-wider text-[10px]">Setup Required: Automated Payout Splits (95/5)</h4>
              <Badge className="bg-rose-500/20 text-rose-600 dark:text-rose-300 border-0 text-[8px] uppercase tracking-wider font-bold h-4">Inactive</Badge>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
              You have not linked your bank account. Change your preferred payout method to **Direct Bank (via Razorpay Route)** and fill out your banking details.
              <Link href="/dashboard/creator/payouts" className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 hover:underline font-bold transition-all ml-1.5">
                Setup Bank details <ArrowRight className="w-3 h-3" />
              </Link>
            </p>
          </div>
        </div>
      )}

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="rounded-2xl border border-border/40 bg-card/45 backdrop-blur-md shadow-sm hover:translate-y-[-4px] hover:shadow-[0_8px_0_var(--border)] transition-all duration-300">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0 p-6">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Total Uploads
            </span>
            <LayoutGrid className="w-4 h-4 text-purple-400" />
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="text-2xl font-black text-foreground">{creatorProducts.length}</div>
            <p className="text-[9px] text-muted-foreground font-semibold mt-1">Scripts added to catalog</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-border/40 bg-card/45 backdrop-blur-md shadow-sm hover:translate-y-[-4px] hover:shadow-[0_8px_0_var(--border)] transition-all duration-300">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0 p-6">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Total Unlocks
            </span>
            <Package className="w-4 h-4 text-blue-400" />
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="text-2xl font-black text-foreground">{totalSold}</div>
            <p className="text-[9px] text-muted-foreground font-semibold mt-1">Times your scripts were bought</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-border/40 bg-card/45 backdrop-blur-md shadow-sm hover:translate-y-[-4px] hover:shadow-[0_8px_0_var(--border)] transition-all duration-300">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0 p-6">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Gross Revenue
            </span>
            <Coins className="w-4 h-4 text-emerald-400" />
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="text-2xl font-black text-foreground">${(grossSales / 100).toFixed(2)}</div>
            <p className="text-[9px] text-muted-foreground font-semibold mt-1">Total revenue processed</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-primary/20 bg-primary/5 backdrop-blur-md shadow-sm hover:translate-y-[-4px] hover:shadow-[0_8px_0_rgba(88,204,2,0.15)] transition-all duration-300">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0 p-6">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">
              Your Share (95%)
            </span>
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="text-2xl font-black text-foreground">${(creatorShare / 100).toFixed(2)}</div>
            <p className="text-[9px] text-primary/80 font-semibold mt-1">Net pending settlement</p>
          </CardContent>
        </Card>
      </div>

      {/* Split Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Creations Summary */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Creations Summary</h2>
            <Link href="/dashboard/creator/products" className="text-[10px] font-black text-[#1CB0F6] uppercase tracking-widest hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          
          <div className="border border-border/40 rounded-2xl overflow-hidden bg-card/35 backdrop-blur-md shadow-sm">
            {creatorProducts.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground font-medium">
                You haven't listed any scripts yet.
              </div>
            ) : (
              <div className="divide-y-2 divide-border">
                {creatorProducts.slice(0, 3).map((prod) => (
                  <div key={prod.id} className="p-4 flex items-center justify-between gap-4 hover:bg-muted/30 transition-colors">
                    <div className="space-y-1">
                      <p className="text-xs font-black text-foreground">{prod.title}</p>
                      <p className="text-[10px] text-muted-foreground font-semibold uppercase">{prod.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-foreground">${(prod.price / 100).toFixed(2)}</p>
                      <Badge className="bg-primary/10 text-primary border-primary/20 text-[8px] uppercase tracking-wider font-bold h-4 mt-0.5">
                        {prod.status || "approved"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Sales Activity Ledger */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Recent Activity</h2>
            <Link href="/dashboard/creator/ledger" className="text-[10px] font-black text-[#1CB0F6] uppercase tracking-widest hover:underline flex items-center gap-1">
              Ledger <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-5 border border-border/40 bg-card/35 backdrop-blur-md rounded-2xl shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-foreground flex items-center gap-2 border-b border-border pb-3">
              <Activity className="w-4 h-4 text-[#CE82FF]" />
              Earning Ledger
            </h3>
            <div className="space-y-4">
              {salesHistory.length === 0 ? (
                <p className="text-xs text-muted-foreground font-medium text-center py-6">
                  Sales activity will appear here once purchases occur.
                </p>
              ) : (
                <div className="space-y-3">
                  {salesHistory.slice(0, 4).map((sale) => (
                    <div key={sale.orderId} className="flex justify-between items-start gap-4 text-xs border-b border-border pb-2.5 last:border-0 last:pb-0">
                      <div className="space-y-0.5 flex-1">
                        <p className="font-bold text-foreground line-clamp-1">{sale.productTitle}</p>
                        <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground font-semibold">
                          <span>{new Date(sale.date).toLocaleDateString()}</span>
                          <span>•</span>
                          <span className="font-mono">TX: {sale.orderId.slice(0, 8)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-foreground">${(sale.amount / 100).toFixed(2)}</p>
                        <p className="text-[9px] text-primary font-bold">+${((sale.amount * 0.95) / 100).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
