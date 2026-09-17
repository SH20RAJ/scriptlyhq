export const dynamic = "force-dynamic";

import { db } from "@/db";
import { orders, products } from "@/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { getOrCreateDbUser } from "@/lib/auth-utils";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Download, ShoppingBag, CreditCard, ExternalLink, Calendar, FileText, ArrowRight, ShieldCheck, Sparkles, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductPagination } from "@/components/ProductPagination";
import { Metadata } from "next";
import { CyberBackground } from "@/components/ui/CyberBackground";

interface PageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Customer Inventory | ScriptlyStore",
    description: "Access your purchased scripts, license keys, and digital receipts on ScriptlyStore.",
  };
}

const formatINR = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export default async function DashboardPage({ searchParams }: PageProps) {
  const user = await getOrCreateDbUser();
  if (!user) {
    redirect("/handler/sign-in?redirectTo=/dashboard");
  }

  const resolvedParams = await searchParams;
  const currentPage = Math.max(1, parseInt(resolvedParams.page || "1", 10));
  const limit = 8;
  const offset = (currentPage - 1) * limit;

  // Query total count of completed orders and total invested amount in a single fast query
  const [statsResult] = await db
    .select({
      count: sql<number>`count(*)`,
      sum: sql<number>`coalesce(sum(${orders.amount}), 0)`,
    })
    .from(orders)
    .where(and(eq(orders.userId, user.id), eq(orders.status, "completed")));

  const totalCount = Number(statsResult?.count || 0);
  const totalInvested = Number(statsResult?.sum || 0);
  const totalPages = Math.ceil(totalCount / limit);

  // Scalable queries: Query recent billing records with strict limit
  const [billingHistory, purchasedItems] = await Promise.all([
    db
      .select({
        orderId: orders.id,
        amount: orders.amount,
        purchaseDate: orders.createdAt,
        productTitle: products.title,
      })
      .from(orders)
      .innerJoin(products, eq(orders.productId, products.id))
      .where(and(eq(orders.userId, user.id), eq(orders.status, "completed")))
      .orderBy(desc(orders.createdAt))
      .limit(10),

    db
      .select({
        orderId: orders.id,
        amount: orders.amount,
        paymentId: orders.razorpayPaymentId,
        purchaseDate: orders.createdAt,
        product: {
          id: products.id,
          title: products.title,
          slug: products.slug,
          thumbnail: products.thumbnail,
          category: products.category,
          version: products.version,
          shortDescription: products.shortDescription,
          demoUrl: products.demoUrl,
        },
      })
      .from(orders)
      .innerJoin(products, eq(orders.productId, products.id))
      .where(and(eq(orders.userId, user.id), eq(orders.status, "completed")))
      .orderBy(desc(orders.createdAt))
      .limit(limit)
      .offset(offset),
  ]);

  return (
    <div className="flex flex-col min-h-screen text-foreground bg-background relative overflow-hidden">
      <CyberBackground />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-14 space-y-8 relative z-10">
        {/* Customer Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/40 pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-primary font-black uppercase tracking-wider text-[11px]">
              <Layers className="w-3.5 h-3.5" />
              <span>Customer Portal</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-foreground">
              My Code Inventory
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Account: <span className="font-semibold text-foreground">{user.email}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-xl border-border/60 hover:bg-muted/40 text-xs font-bold"
            >
              <Link href="/handler/account-settings">Account Settings</Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="rounded-xl bg-[#58CC02] hover:bg-[#58CC02]/90 text-white font-black text-xs uppercase tracking-wider shadow-[0_3px_0_#46A302] active:translate-y-px active:shadow-none"
            >
              <Link href="/explore">Explore Library</Link>
            </Button>
          </div>
        </div>

        {/* KPI Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-md space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-primary" /> Unlocked Scripts
            </span>
            <p className="text-2xl font-black text-foreground font-mono">{totalCount}</p>
            <p className="text-[11px] text-muted-foreground">Ready for instant download</p>
          </div>

          <div className="p-4 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-md space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-emerald-500" /> Total Invested
            </span>
            <p className="text-2xl font-black text-foreground font-mono">{formatINR(totalInvested / 100)}</p>
            <p className="text-[11px] text-emerald-500 font-bold">Lifetime access granted</p>
          </div>

          <div className="p-4 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-md space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#1CB0F6]" /> License Status
            </span>
            <p className="text-2xl font-black text-foreground">Commercial</p>
            <p className="text-[11px] text-muted-foreground">Personal & client projects</p>
          </div>
        </div>

        {totalCount === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 border border-dashed border-border/60 rounded-3xl bg-card/20 space-y-4 text-center p-8">
            <div className="w-14 h-14 rounded-2xl bg-muted/40 flex items-center justify-center">
              <ShoppingBag className="w-7 h-7 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-black text-foreground">No scripts unlocked yet</h2>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Explore our catalog of production-ready SaaS boilerplates, scrapers, and tools to start building your library.
              </p>
            </div>
            <Button
              asChild
              className="bg-[#58CC02] hover:bg-[#58CC02]/90 text-white font-black text-xs uppercase tracking-wider rounded-xl px-6 shadow-[0_3px_0_#46A302]"
            >
              <Link href="/explore">Browse Marketplace</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Column: Purchased Products */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-border/30">
                <h2 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                  Purchased Products ({totalCount})
                </h2>
                <span className="text-[11px] text-muted-foreground font-mono">Page {currentPage} of {totalPages}</span>
              </div>

              <div className="space-y-3">
                {purchasedItems.map((item) => (
                  <div
                    key={item.orderId}
                    className="p-4 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-primary/30 transition-all shadow-sm"
                  >
                    <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                      {/* Thumbnail / Category badge */}
                      <div className="w-16 h-16 rounded-xl bg-muted/40 border border-border/40 overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {item.product.thumbnail ? (
                          <img
                            src={item.product.thumbnail}
                            alt={item.product.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-[9px] font-black uppercase tracking-wider font-mono text-muted-foreground">
                            {item.product.category.slice(0, 3)}
                          </span>
                        )}
                      </div>

                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[9px] font-black uppercase">
                            {item.product.category}
                          </span>
                          <span className="text-[10px] font-mono text-muted-foreground">
                            v{item.product.version}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            Purchased {new Date(item.purchaseDate).toLocaleDateString()}
                          </span>
                        </div>

                        <Link
                          href={`/products/${item.product.slug}`}
                          className="font-black text-sm text-foreground hover:text-primary transition-colors truncate block"
                        >
                          {item.product.title}
                        </Link>

                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {item.product.shortDescription}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/30">
                      <Button
                        asChild
                        size="sm"
                        className="bg-primary text-primary-foreground font-black text-xs uppercase tracking-wider rounded-xl h-9 px-4 shadow-sm"
                      >
                        <a href={`/api/download/${item.product.id}`}>
                          <Download className="w-3.5 h-3.5 mr-1.5" /> Download ZIP
                        </a>
                      </Button>

                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="rounded-xl border-border/60 hover:bg-muted/40 text-xs font-semibold h-9 px-3"
                      >
                        <Link href={`/dashboard/receipt/${item.orderId}`}>
                          <FileText className="w-3.5 h-3.5 mr-1" /> Receipt
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="pt-4 border-t border-border/40">
                  <ProductPagination totalPages={totalPages} currentPage={currentPage} />
                </div>
              )}
            </div>

            {/* Right Column: Billing Ledger */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-border/30">
                <h2 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                  Recent Invoices
                </h2>
                <span className="text-[11px] text-muted-foreground">Latest 10</span>
              </div>

              <div className="p-4 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-md space-y-3">
                <div className="divide-y divide-border/30 text-xs">
                  {billingHistory.map((item) => (
                    <div key={item.orderId} className="py-2.5 flex items-center justify-between gap-3 first:pt-0 last:pb-0">
                      <div className="space-y-0.5 min-w-0">
                        <Link
                          href={`/dashboard/receipt/${item.orderId}`}
                          className="font-bold text-foreground hover:text-primary transition-colors truncate block text-xs"
                        >
                          {item.productTitle}
                        </Link>
                        <p className="text-[10px] text-muted-foreground font-mono">
                          {new Date(item.purchaseDate).toLocaleDateString()} • TX: {item.orderId.slice(0, 8)}
                        </p>
                      </div>

                      <div className="text-right font-mono shrink-0">
                        <p className="font-black text-foreground">{formatINR(item.amount / 100)}</p>
                        <Link
                          href={`/dashboard/receipt/${item.orderId}`}
                          className="text-[10px] text-primary hover:underline"
                        >
                          Invoice →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Creator Upsell Card */}
              <div className="p-5 rounded-2xl border border-primary/20 bg-primary/5 space-y-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span>Build & Sell Code</span>
                </h3>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Turn your own templates and scripts into products. Keep 95% of direct sales with $0 monthly fees.
                </p>
                <Link
                  href="/creator"
                  className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1 pt-1"
                >
                  Learn About Selling <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
