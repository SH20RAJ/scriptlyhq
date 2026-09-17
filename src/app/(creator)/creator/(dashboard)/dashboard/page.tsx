export const dynamic = "force-dynamic";

import { Metadata } from "next";
import { db } from "@/db";
import { products, orders } from "@/db/schema";
import { eq, and, desc, inArray } from "drizzle-orm";
import { getOrCreateDbUser } from "@/lib/auth-utils";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Package, Sparkles, Plus, LayoutGrid, Coins, Activity, ArrowRight, ShieldCheck, Hourglass, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CreatorEarningsChart from "@/components/CreatorEarningsChart";

export const metadata: Metadata = {
  title: "Creator Overview | ScriptlyStore",
  description: "Monitor store-level analytics, sales performance, and payout splits.",
};

export default async function CreatorConsolePage() {
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

  const productIds = creatorProducts.map((p) => p.id);

  let totalSold = 0;
  let grossSales = 0;
  let creatorShare = 0;
  let salesHistory: { orderId: string; amount: number; date: Date; productTitle: string; creatorShare: number; referredById: string | null }[] = [];

  if (productIds.length > 0) {
    const rawSales = await db
      .select({
        orderId: orders.id,
        amount: orders.amount,
        date: orders.createdAt,
        productTitle: products.title,
        referredById: orders.referredById,
        affiliateCommissionPercent: products.affiliateCommissionPercent,
      })
      .from(orders)
      .innerJoin(products, eq(orders.productId, products.id))
      .where(and(eq(orders.status, "completed"), inArray(orders.productId, productIds)))
      .orderBy(desc(orders.createdAt));

    salesHistory = rawSales.map((sale) => {
      const commissionPercent = sale.referredById ? (sale.affiliateCommissionPercent ?? 30) : 0;
      const creatorPercent = sale.referredById ? Math.max(0.95 - (commissionPercent / 100), 0) : 0.95;
      const calculatedShare = Math.round(sale.amount * creatorPercent);
      return {
        orderId: sale.orderId,
        amount: sale.amount,
        date: sale.date,
        productTitle: sale.productTitle,
        creatorShare: calculatedShare,
        referredById: sale.referredById,
      };
    });

    totalSold = salesHistory.length;
    grossSales = salesHistory.reduce((sum, item) => sum + item.amount, 0);
    creatorShare = salesHistory.reduce((sum, item) => sum + item.creatorShare, 0);
  }

  // Razorpay Route status
  const hasBankDetails = Boolean(user.bankAccountNumber && user.bankIfsc);
  const isRouteActive = Boolean(user.razorpayAccountId && user.razorpayAccountId.startsWith("acc_"));

  const formatINR = (val: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Overview
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Storefront analytics, digital orders, and automated split payments.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button asChild variant="outline" size="sm" className="rounded-xl text-xs font-bold border-border/60">
            <Link href="/affiliate">Affiliate Console</Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="bg-[#58CC02] hover:bg-[#58CC02]/90 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-[0_3px_0_#46A302] active:translate-y-px active:shadow-none"
          >
            <Link href="/creator/new">
              <Plus className="w-3.5 h-3.5 mr-1" /> List New Product
            </Link>
          </Button>
        </div>
      </div>

      {/* Payout Status Banner */}
      {isRouteActive ? (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>
              <strong>Automated 95/5 Splits Active</strong> — Earnings transfer directly to bank sub-merchant <code className="font-mono bg-background/50 px-1 py-0.5 rounded">{user.razorpayAccountId}</code>.
            </span>
          </div>
          <Link href="/creator/payouts" className="text-[11px] font-bold underline shrink-0">
            View Settings
          </Link>
        </div>
      ) : hasBankDetails ? (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <Hourglass className="w-4 h-4 text-amber-500 shrink-0 animate-pulse" />
            <span>Bank details recorded. Razorpay sub-merchant route configuration is in progress.</span>
          </div>
          <Link href="/creator/payouts" className="text-[11px] font-bold underline shrink-0">
            Update Details
          </Link>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-muted/40 border border-border/50 text-muted-foreground flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-primary shrink-0" />
            <span>
              <strong>Link your bank account</strong> to enable automated 95% payouts directly to your account.
            </span>
          </div>
          <Button asChild size="sm" variant="outline" className="h-7 text-[11px] font-bold rounded-lg border-border/60 shrink-0">
            <Link href="/creator/payouts">Configure Payouts <ArrowRight className="w-3 h-3 ml-1" /></Link>
          </Button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-card/40 border border-border/50 backdrop-blur-md space-y-1 shadow-sm">
          <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <LayoutGrid className="w-3.5 h-3.5 text-purple-400" /> Products Listed
          </span>
          <p className="text-2xl font-black text-foreground">{creatorProducts.length}</p>
          <p className="text-[10px] text-muted-foreground">Active in marketplace</p>
        </div>

        <div className="p-5 rounded-2xl bg-card/40 border border-border/50 backdrop-blur-md space-y-1 shadow-sm">
          <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5 text-[#1CB0F6]" /> Total Downloads
          </span>
          <p className="text-2xl font-black text-foreground">{totalSold}</p>
          <p className="text-[10px] text-muted-foreground">Digital orders fulfilled</p>
        </div>

        <div className="p-5 rounded-2xl bg-card/40 border border-border/50 backdrop-blur-md space-y-1 shadow-sm">
          <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-emerald-400" /> Gross Volume
          </span>
          <p className="text-2xl font-black text-foreground">{formatINR(grossSales / 100)}</p>
          <p className="text-[10px] text-muted-foreground">Customer purchase volume</p>
        </div>

        <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20 backdrop-blur-md space-y-1 shadow-sm">
          <span className="text-[11px] font-black uppercase tracking-wider text-primary flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Your Earnings (95%)
          </span>
          <p className="text-2xl font-black text-foreground">{formatINR(creatorShare / 100)}</p>
          <p className="text-[10px] text-primary/80 font-semibold">Net direct creator share</p>
        </div>
      </div>

      {/* Analytics Chart */}
      <div className="rounded-2xl border border-border/50 bg-card/30 backdrop-blur-md p-4 sm:p-6 shadow-sm">
        <CreatorEarningsChart sales={salesHistory} />
      </div>

      {/* Two Column Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Creations Summary */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
              Recent Products
            </h2>
            <Link href="/creator/products" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="rounded-2xl border border-border/50 bg-card/30 backdrop-blur-md overflow-hidden shadow-sm">
            {creatorProducts.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground">
                <p className="font-bold">No products listed yet</p>
                <p className="text-[11px] mt-1">Click "List New Product" to monetize your first codebase.</p>
              </div>
            ) : (
              <div className="divide-y divide-border/30">
                {creatorProducts.slice(0, 4).map((prod) => (
                  <div key={prod.id} className="p-4 flex items-center justify-between gap-4 hover:bg-muted/10 transition-colors text-xs">
                    <div className="space-y-0.5">
                      <p className="font-bold text-foreground">{prod.title}</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-mono">{prod.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-foreground">{formatINR(prod.price / 100)}</p>
                      <span className="text-[9px] font-black uppercase text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                        {prod.status || "active"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Sales Ledger Preview */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
              Latest Sales
            </h2>
            <Link href="/creator/ledger" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
              Ledger <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="rounded-2xl border border-border/50 bg-card/30 backdrop-blur-md p-4 shadow-sm">
            {salesHistory.length === 0 ? (
              <div className="p-6 text-center text-xs text-muted-foreground">
                <Activity className="w-5 h-5 mx-auto mb-2 opacity-50" />
                <p className="font-bold">No sales activity yet</p>
                <p className="text-[11px] mt-0.5">Transactions will stream here once customers purchase.</p>
              </div>
            ) : (
              <div className="divide-y divide-border/30 text-xs">
                {salesHistory.slice(0, 4).map((sale) => (
                  <div key={sale.orderId} className="py-2.5 flex justify-between items-center gap-4">
                    <div className="space-y-0.5">
                      <p className="font-bold text-foreground line-clamp-1">{sale.productTitle}</p>
                      <p className="text-[10px] text-muted-foreground">{new Date(sale.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right font-mono">
                      <p className="font-bold text-foreground">{formatINR(sale.amount / 100)}</p>
                      <p className="text-[10px] font-black text-emerald-500">+{formatINR(sale.creatorShare / 100)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
