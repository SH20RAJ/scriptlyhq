export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { db } from "@/db";
import { products, orders } from "@/db/schema";
import { eq, and, desc, inArray } from "drizzle-orm";
import { getOrCreateDbUser } from "@/lib/auth-utils";
import { redirect } from "next/navigation";
import { Landmark, ArrowRight, ShieldCheck, Activity, AlertCircle } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Sales Ledger | Creator Console",
  description: "Monitor purchase transactions and direct payouts settlement streams.",
};

export default async function CreatorLedgerPage() {
  const user = await getOrCreateDbUser();
  if (!user) {
    redirect("/handler/sign-in?redirectTo=/dashboard/creator/ledger");
  }

  // Fetch creator's products
  const creatorProducts = await db
    .select({ id: products.id })
    .from(products)
    .where(eq(products.creatorId, user.id));

  const productIds = creatorProducts.map((p) => p.id);

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
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="border-b border-border pb-6">
        <h1 className="text-xl md:text-2xl font-black tracking-tight text-foreground">
          Sales Ledger
        </h1>
        <p className="text-xs text-muted-foreground font-medium mt-1">
          Review historical payouts, order values, and sub-merchant direct splits.
        </p>
      </div>

      {/* Main Ledger Content */}
      <Card className="rounded-2xl border border-border/40 bg-card/45 backdrop-blur-md shadow-sm">
        <CardHeader className="border-b border-border/40 py-4 flex flex-row items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            Payout Settlement Records
          </span>
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-muted/40 border border-border/40 px-3 py-1 rounded-lg">
            {salesHistory.length} Completed Sales
          </span>
        </CardHeader>
        <CardContent className="p-0">
          {salesHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-muted-foreground/40" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground">No transaction history</p>
                <p className="text-[10px] text-muted-foreground/60 max-w-xs">
                  Sales logs will render here once customers start purchasing your scripts.
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/40 bg-muted/20 text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                    <th className="py-3 px-6">Transaction Date</th>
                    <th className="py-3 px-6">Product Title</th>
                    <th className="py-3 px-6">Transaction ID</th>
                    <th className="py-3 px-6">Total Paid</th>
                    <th className="py-3 px-6 text-right">Your Share (95%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-xs font-medium text-muted-foreground">
                  {salesHistory.map((sale) => (
                    <tr key={sale.orderId} className="hover:bg-muted/20 transition-colors">
                      <td className="py-4 px-6 font-semibold whitespace-nowrap">
                        {new Date(sale.date).toLocaleString()}
                      </td>
                      <td className="py-4 px-6 font-black text-foreground max-w-xs truncate">
                        {sale.productTitle}
                      </td>
                      <td className="py-4 px-6 font-mono text-[10px]">
                        {sale.orderId}
                      </td>
                      <td className="py-4 px-6 font-bold text-foreground">
                        ${(sale.amount / 100).toFixed(2)}
                      </td>
                      <td className="py-4 px-6 text-right font-black text-primary">
                        +${((sale.amount * 0.95) / 100).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}
