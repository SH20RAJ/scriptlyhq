export const dynamic = "force-dynamic";

import { Metadata } from "next";
import { db } from "@/db";
import { products, orders } from "@/db/schema";
import { eq, and, desc, inArray } from "drizzle-orm";
import { getOrCreateDbUser } from "@/lib/auth-utils";
import { redirect } from "next/navigation";
import { Activity, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Sales Ledger | Creator Console",
  description: "Monitor purchase transactions and direct payouts settlement streams.",
};

const formatINR = (val: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(val);

export default async function CreatorLedgerPage() {
  const user = await getOrCreateDbUser();
  if (!user) {
    redirect("/handler/sign-in?redirectTo=/creator/dashboard");
  }

  // Fetch creator's products
  const creatorProducts = await db
    .select({ id: products.id })
    .from(products)
    .where(eq(products.creatorId, user.id));

  const productIds = creatorProducts.map((p) => p.id);

  let salesHistory: {
    orderId: string;
    amount: number;
    date: Date;
    productTitle: string;
    creatorShare: number;
    referredById: string | null;
  }[] = [];

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
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/40 pb-5">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            Sales Ledger
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Historical payouts, order values, and automated sub-merchant splits.
          </p>
        </div>
        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider bg-muted/40 px-3 py-1 rounded-lg self-start sm:self-auto">
          {salesHistory.length} Completed Orders
        </span>
      </div>

      {/* Main Ledger Content */}
      <div className="border border-border/50 bg-card/30 backdrop-blur-md rounded-2xl overflow-hidden shadow-sm">
        {salesHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-2 p-6">
            <Activity className="w-8 h-8 text-muted-foreground/40" />
            <div className="space-y-1">
              <p className="text-xs font-bold text-foreground">No transaction history yet</p>
              <p className="text-[11px] text-muted-foreground max-w-xs">
                Transaction records will appear here as soon as customers start purchasing your scripts.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/40 bg-muted/20 text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                  <th className="py-3 px-5">Date</th>
                  <th className="py-3 px-4">Script</th>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Total Paid</th>
                  <th className="py-3 px-5 text-right">Your Share (95%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30 text-xs">
                {salesHistory.map((sale) => (
                  <tr key={sale.orderId} className="hover:bg-muted/15 transition-colors">
                    <td className="py-3.5 px-5 text-muted-foreground whitespace-nowrap">
                      {new Date(sale.date).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-foreground max-w-xs truncate">
                      {sale.productTitle}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-muted-foreground">
                      {sale.orderId.slice(0, 10)}...
                    </td>
                    <td className="py-3.5 px-4 font-bold text-foreground font-mono">
                      {formatINR(sale.amount / 100)}
                    </td>
                    <td className="py-3.5 px-5 text-right font-black text-emerald-500 font-mono">
                      +{formatINR(sale.creatorShare / 100)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
