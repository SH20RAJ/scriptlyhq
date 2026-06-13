export const dynamic = "force-dynamic";

import { db } from "../../../db";
import { orders, products, users } from "../../../db/schema";
import { eq, desc } from "drizzle-orm";
import { ShoppingCart, AlertCircle, Calendar, Hash, User, CreditCard } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default async function AdminOrdersPage() {
  const allOrdersList = await db
    .select({
      orderId: orders.id,
      amount: orders.amount,
      status: orders.status,
      createdAt: orders.createdAt,
      paymentId: orders.razorpayPaymentId,
      couponCode: orders.couponCode,
      discountApplied: orders.discountApplied,
      productTitle: products.title,
      customerEmail: users.email,
      customerName: users.name,
    })
    .from(orders)
    .innerJoin(products, eq(orders.productId, products.id))
    .innerJoin(users, eq(orders.userId, users.id))
    .orderBy(desc(orders.createdAt));

  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-2 border-b border-border/60 pb-8">
        <h1 className="text-3xl font-extrabold tracking-tighter text-foreground">Transactions</h1>
        <p className="text-sm text-muted-foreground font-medium">Fulfillment logs and payment records.</p>
      </div>

      {allOrdersList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 border border-dashed border-border rounded-3xl bg-card/30 space-y-4">
          <AlertCircle className="w-10 h-10 text-muted-foreground opacity-50" />
          <p className="text-sm text-muted-foreground font-medium">No transaction records found.</p>
        </div>
      ) : (
        <Card className="border-border/50 bg-card/50 rounded-[2rem] overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="border-border/40 hover:bg-transparent">
                <TableHead className="px-8 h-12 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Reference</TableHead>
                <TableHead className="px-8 h-12 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Customer</TableHead>
                <TableHead className="px-8 h-12 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Product</TableHead>
                <TableHead className="px-8 h-12 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Discount</TableHead>
                <TableHead className="px-8 h-12 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Amount Paid</TableHead>
                <TableHead className="px-8 h-12 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</TableHead>
                <TableHead className="px-8 h-12 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allOrdersList.map((ord) => (
                <TableRow key={ord.orderId} className="border-border/40 hover:bg-muted/10 transition-colors">
                  <TableCell className="px-8 py-6">
                    <div className="flex items-center gap-2">
                       <Hash className="w-3 h-3 text-muted-foreground/50" />
                       <span className="text-[11px] font-mono font-bold uppercase tracking-tight text-foreground/80">
                         {ord.orderId.slice(0, 12)}
                       </span>
                    </div>
                    {ord.paymentId && (
                      <div className="text-[9px] text-muted-foreground font-bold mt-1 uppercase tracking-tighter opacity-60">
                        Gateway: {ord.paymentId}
                      </div>
                    )}
                  </TableCell>

                  <TableCell className="px-8 py-6">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          <User className="w-3.5 h-3.5 text-muted-foreground" />
                       </div>
                       <div className="space-y-0.5">
                          <p className="text-sm font-bold text-foreground leading-none">{ord.customerName || "Member"}</p>
                          <p className="text-[10px] text-muted-foreground font-bold tracking-tighter opacity-60 uppercase">{ord.customerEmail}</p>
                       </div>
                    </div>
                  </TableCell>

                  <TableCell className="px-8 py-6 font-black text-xs uppercase tracking-tight text-foreground/80">
                    {ord.productTitle}
                  </TableCell>

                  <TableCell className="px-8 py-6 text-sm font-bold text-muted-foreground">
                    {ord.discountApplied > 0 ? (
                      <div className="space-y-1">
                        <span className="font-black text-emerald-500 tabular-nums">
                          ${(ord.discountApplied / 100).toFixed(2)}
                        </span>
                        {ord.couponCode && (
                          <Badge variant="outline" className="text-[8px] font-black uppercase rounded-full tracking-wider px-1.5 h-4 border-emerald-500/20 text-emerald-500 bg-emerald-500/5 block w-max">
                            {ord.couponCode}
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <span>—</span>
                    )}
                  </TableCell>

                  <TableCell className="px-8 py-6 font-black text-sm tabular-nums">
                    ${(ord.amount / 100).toFixed(2)}
                  </TableCell>

                  <TableCell className="px-8 py-6">
                    <Badge variant="outline" className={`text-[9px] font-black uppercase rounded-full px-2 h-5 border-0 ${
                       ord.status === "completed" ? "bg-emerald-500/10 text-emerald-500" :
                       ord.status === "pending" ? "bg-amber-500/10 text-amber-500" :
                       "bg-destructive/10 text-destructive"
                    }`}>
                      {ord.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="px-8 py-6 text-right">
                    <div className="flex flex-col items-end gap-1">
                       <span className="text-[10px] font-bold text-foreground uppercase tracking-widest">
                         {new Date(ord.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                       </span>
                       <span className="text-[9px] text-muted-foreground font-mono">
                         {new Date(ord.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                       </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
