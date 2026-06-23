export const dynamic = "force-dynamic";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Overview",
};

import { db } from "../../db";
import { products, orders, users } from "../../db/schema";
import { eq, sql, desc } from "drizzle-orm";
import { Package, DollarSign, CreditCard, Clock, TrendingUp, Users, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { ProductPagination } from "../../components/ProductPagination";

interface PageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function AdminDashboardPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const currentPage = parseInt(resolvedParams.page || "1", 10);
  const limit = 8;
  const offset = (currentPage - 1) * limit;

  const [prodCount] = await db.select({ count: sql<number>`count(*)` }).from(products);
  const totalProducts = prodCount?.count || 0;

  const [orderCount] = await db.select({ count: sql<number>`count(*)` }).from(orders).where(eq(orders.status, "completed"));
  const totalOrders = orderCount?.count || 0;

  const [revSum] = await db.select({ sum: sql<number>`sum(${orders.amount})` }).from(orders).where(eq(orders.status, "completed"));
  const totalRevenue = revSum?.sum || 0;

  const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(users);
  const totalUsers = userCount?.count || 0;

  const [pendingCountQuery] = await db.select({ count: sql<number>`count(*)` }).from(products).where(eq(products.status, "pending"));
  const pendingApprovals = pendingCountQuery?.count || 0;

  const [creatorCountQuery] = await db.select({ count: sql<number>`count(*)` }).from(users).where(sql`store_name IS NOT NULL`);
  const totalCreators = creatorCountQuery?.count || 0;

  const aov = totalOrders > 0 ? (totalRevenue / totalOrders) : 0;

  // Fetch total count of orders for pagination
  const [totalOrdersCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(orders)
    .innerJoin(products, eq(orders.productId, products.id))
    .innerJoin(users, eq(orders.userId, users.id));
  const totalItems = totalOrdersCount?.count || 0;
  const totalPages = Math.ceil(totalItems / limit);

  const recentPurchases = await db
    .select({
      orderId: orders.id,
      amount: orders.amount,
      status: orders.status,
      createdAt: orders.createdAt,
      paymentId: orders.razorpayPaymentId,
      productTitle: products.title,
      customerEmail: users.email,
      customerName: users.name,
    })
    .from(orders)
    .innerJoin(products, eq(orders.productId, products.id))
    .innerJoin(users, eq(orders.userId, users.id))
    .orderBy(desc(orders.createdAt))
    .limit(limit)
    .offset(offset);

  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-2 border-b border-border/60 pb-8">
        <h1 className="text-3xl font-extrabold tracking-tighter text-foreground">Console</h1>
        <p className="text-sm text-muted-foreground font-medium">Business performance and marketplace analytics.</p>
      </div>

      {pendingApprovals > 0 && (
        <div className="flex items-center justify-between p-5 rounded-2xl border border-rose-500/20 bg-rose-500/5 text-rose-500 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 animate-pulse text-rose-400" />
            <div className="space-y-0.5">
              <p className="text-sm font-bold text-white uppercase tracking-wider">Pending Script Approvals</p>
              <p className="text-xs text-rose-400/80 font-semibold">There are {pendingApprovals} script submissions awaiting review.</p>
            </div>
          </div>
          <Button asChild size="sm" variant="outline" className="border-rose-500/20 text-rose-400 hover:bg-rose-500/10 hover:text-white rounded-xl">
            <Link href="/admin/approvals">Moderate Submissions</Link>
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-border/50 bg-card/45 rounded-2xl backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-6">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Revenue</CardTitle>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="text-2xl font-black tracking-tight">${(totalRevenue / 100).toFixed(2)}</div>
            <div className="mt-1 flex items-center justify-between text-[10px] text-emerald-500 font-bold">
              <span className="flex items-center gap-1">
                 <TrendingUp className="w-3 h-3" /> Net Earnings
              </span>
              <span className="text-muted-foreground">AOV: ${(aov / 100).toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/45 rounded-2xl backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-6">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Volume</CardTitle>
            <CreditCard className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="text-2xl font-black tracking-tight">{totalOrders}</div>
            <p className="text-[10px] text-muted-foreground font-bold mt-1 uppercase tracking-wider">Completed Orders</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/45 rounded-2xl backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-6">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Catalog</CardTitle>
            <Package className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="text-2xl font-black tracking-tight">{totalProducts}</div>
            <p className="text-[10px] text-muted-foreground font-bold mt-1 uppercase tracking-wider">Digital Assets</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/45 rounded-2xl backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-6">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Base</CardTitle>
            <Users className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="text-2xl font-black tracking-tight">{totalUsers}</div>
            <div className="mt-1 flex items-center justify-between text-[10px] text-blue-500 font-bold">
              <span className="uppercase tracking-wider">Registered Users</span>
              <span className="text-muted-foreground">Creators: {totalCreators}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
         <div className="flex items-center gap-4">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground">Recent Activity</h2>
            <div className="h-px flex-1 bg-border/40" />
         </div>

         <Card className="border-border/50 bg-card/50 rounded-[2rem] overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="border-border/40 hover:bg-transparent">
                  <TableHead className="px-8 h-12 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Customer</TableHead>
                  <TableHead className="px-8 h-12 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Product</TableHead>
                  <TableHead className="px-8 h-12 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Amount</TableHead>
                  <TableHead className="px-8 h-12 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</TableHead>
                  <TableHead className="px-8 h-12 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentPurchases.map((purchase) => (
                  <TableRow key={purchase.orderId} className="border-border/40 hover:bg-muted/10 transition-colors">
                    <TableCell className="px-8 py-5">
                       <div className="space-y-1">
                          <p className="text-sm font-bold text-foreground leading-none">{purchase.customerName || "No Name"}</p>
                          <p className="text-[10px] text-muted-foreground font-bold tracking-tighter opacity-60 uppercase">{purchase.customerEmail}</p>
                       </div>
                    </TableCell>
                    <TableCell className="px-8 py-5 font-black text-xs uppercase tracking-tight text-foreground/80">
                      {purchase.productTitle}
                    </TableCell>
                    <TableCell className="px-8 py-5 font-black text-sm tabular-nums">
                      ${(purchase.amount / 100).toFixed(2)}
                    </TableCell>
                    <TableCell className="px-8 py-5">
                       <Badge variant="outline" className={`text-[9px] font-black uppercase rounded-full px-2 h-5 border-0 ${
                         purchase.status === "completed" ? "bg-emerald-500/10 text-emerald-500" :
                         purchase.status === "pending" ? "bg-amber-500/10 text-amber-500" :
                         "bg-destructive/10 text-destructive"
                       }`}>
                          {purchase.status}
                       </Badge>
                    </TableCell>
                    <TableCell className="px-8 py-5 text-right text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                       {new Date(purchase.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {recentPurchases.length === 0 && (
               <div className="py-20 text-center space-y-2">
                  <Clock className="w-8 h-8 text-muted-foreground/30 mx-auto" />
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">No Recent Logs</p>
               </div>
            )}
            {recentPurchases.length > 0 && (
              <div className="py-5 border-t border-border/40 flex justify-center bg-card/10">
                <ProductPagination totalPages={totalPages} currentPage={currentPage} />
              </div>
            )}
         </Card>
      </div>
    </div>
  );
}
