export const dynamic = "force-dynamic";

import { db } from "../../../db";
import { products, orders, coupons } from "../../../db/schema";
import { eq, and, desc, inArray } from "drizzle-orm";
import { getOrCreateDbUser } from "../../../lib/auth-utils";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Package, Sparkles, AlertTriangle, Plus, LayoutGrid, Coins, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CreatorProductsTable from "../../../components/CreatorProductsTable";
import StoreNameEditor from "../../../components/StoreNameEditor";
import CreatorCouponsManager from "../../../components/CreatorCouponsManager";
import PayoutSettingsEditor from "../../../components/PayoutSettingsEditor";

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
    <div className="flex flex-col min-h-screen">
      <div className="container max-w-7xl mx-auto px-4 py-12 md:py-16 space-y-12">
        
        {/* Welcome / Heading Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-900 pb-10">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tighter text-white flex items-center gap-3">
              Creator Console
              <span className="text-xs px-2.5 py-0.5 rounded-full font-black uppercase bg-purple-500/10 border border-purple-500/20 text-purple-400 tracking-wider">
                Beta
              </span>
            </h1>
            <p className="text-neutral-400 font-medium">
              Manage your uploaded scripts, configure discounts, monitor store-level coupons, and request publishing approvals.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild variant="outline" size="sm" className="rounded-full h-10 px-6 font-bold uppercase tracking-widest text-[10px] border-neutral-800 text-neutral-300 hover:text-white">
              <Link href="/dashboard">Customer Inventory</Link>
            </Button>
            <Button asChild size="sm" className="rounded-full h-10 px-6 font-bold uppercase tracking-widest text-[10px] bg-white text-black hover:bg-neutral-200">
              <Link href="/dashboard/creator/new">
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                List New Script
              </Link>
            </Button>
          </div>
        </div>

        {/* Global Beta payout notice */}
        <div className="p-5 rounded-2xl border border-amber-500/10 bg-amber-500/5 text-amber-400 text-xs flex gap-3.5 items-start">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-500" />
          <div className="space-y-1">
            <h4 className="font-bold text-amber-300 uppercase tracking-wide">Beta Payout Policy & Profit Split (95/5)</h4>
            <p className="leading-relaxed text-neutral-400 font-medium">
              During the initial Beta phase, automated payouts are disabled. Transactions are processed centrally by Scriptly Store. We operate a creator-first model: <strong>you keep 95% of your sales</strong> (platform charges a flat 5% service fee).
              Payout settlement is currently at 99% manual configuration; we are working to make it 100% automated soon. Specify your payout method and optional PayPal email below to receive manual settlements.
            </p>
          </div>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-neutral-900 bg-neutral-950/40 rounded-2xl">
            <CardHeader className="pb-2">
              <span className="text-xs font-black uppercase tracking-wider text-neutral-500 flex items-center justify-between">
                Total Uploads
                <LayoutGrid className="w-4 h-4 text-neutral-600" />
              </span>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-white">{creatorProducts.length}</div>
              <p className="text-[10px] text-neutral-500 mt-1">Scripts added to catalog</p>
            </CardContent>
          </Card>

          <Card className="border-neutral-900 bg-neutral-950/40 rounded-2xl">
            <CardHeader className="pb-2">
              <span className="text-xs font-black uppercase tracking-wider text-neutral-500 flex items-center justify-between">
                Total Unlocks
                <Package className="w-4 h-4 text-neutral-600" />
              </span>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-white">{totalSold}</div>
              <p className="text-[10px] text-neutral-500 mt-1">Times your scripts were bought</p>
            </CardContent>
          </Card>

          <Card className="border-neutral-900 bg-neutral-950/40 rounded-2xl">
            <CardHeader className="pb-2">
              <span className="text-xs font-black uppercase tracking-wider text-neutral-500 flex items-center justify-between">
                Gross Revenue
                <Coins className="w-4 h-4 text-neutral-600" />
              </span>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-white">${(grossSales / 100).toFixed(2)}</div>
              <p className="text-[10px] text-neutral-500 mt-1">Total revenue processed</p>
            </CardContent>
          </Card>

          <Card className="border-purple-900/40 bg-purple-500/5 rounded-2xl shadow-lg shadow-purple-500/5">
            <CardHeader className="pb-2">
              <span className="text-xs font-black uppercase tracking-wider text-purple-400 flex items-center justify-between">
                Your Share (95%)
                <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
              </span>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-white">${(creatorShare / 100).toFixed(2)}</div>
              <p className="text-[10px] text-neutral-400 mt-1">Net pending settlement</p>
            </CardContent>
          </Card>
        </div>

        {/* Store Naming Settings */}
        <section className="space-y-4">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-neutral-500">Storefront & Promotions</h2>
            <div className="h-px flex-1 bg-neutral-900" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4">
              <StoreNameEditor initialStoreName={user.storeName} />
            </div>
            <div className="lg:col-span-4">
              <PayoutSettingsEditor
                initialPayoutMethod={user.payoutMethod}
                initialPaypalEmail={user.paypalEmail}
                initialPayoutDetails={user.payoutDetails}
              />
            </div>
            <div className="lg:col-span-4">
              <CreatorCouponsManager initialCoupons={storeCoupons} />
            </div>
          </div>
        </section>

        {/* Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Script listings */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-4">
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-neutral-500">My Creations</h2>
              <div className="h-px flex-1 bg-neutral-900" />
            </div>
            <CreatorProductsTable products={creatorProducts} />
          </div>

          {/* Right: Sales/Activity Ledger */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-4">
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-neutral-500">Recent Sales</h2>
              <div className="h-px flex-1 bg-neutral-900" />
            </div>

            <Card className="border-neutral-900 bg-neutral-950/40 rounded-2xl">
              <CardHeader className="pb-4">
                <span className="text-sm font-bold flex items-center gap-2">
                  <Activity className="w-4 h-4 text-purple-400" />
                  Earning Ledger
                </span>
              </CardHeader>
              <CardContent className="space-y-6">
                {salesHistory.length === 0 ? (
                  <p className="text-xs text-neutral-500 font-medium text-center py-6">
                    Sales activity details will appear here as customers unlock your scripts.
                  </p>
                ) : (
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                    {salesHistory.map((sale) => (
                      <div key={sale.orderId} className="flex justify-between items-start gap-4 text-xs">
                        <div className="space-y-1 flex-1">
                          <p className="font-bold text-white line-clamp-1">{sale.productTitle}</p>
                          <div className="flex items-center gap-2 text-[10px] text-neutral-500">
                            <span>{new Date(sale.date).toLocaleDateString()}</span>
                            <span>•</span>
                            <span className="font-mono">TX: {sale.orderId.slice(0, 8)}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-white">${(sale.amount / 100).toFixed(2)}</p>
                          <p className="text-[10px] text-purple-400 font-semibold">+${((sale.amount * 0.95) / 100).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
    </div>
  );
}
