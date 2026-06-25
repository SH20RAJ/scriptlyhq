export const dynamic = "force-dynamic";

import { db } from "@/db";
import { orders, products } from "@/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { getOrCreateDbUser } from "@/lib/auth-utils";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Download, ShoppingBag, CreditCard, ExternalLink, Calendar, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ProductPagination } from "@/components/ProductPagination";
import { Metadata } from "next";

interface PageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Dashboard | ScriptlyStore",
    description: "Dashboard | ScriptlyStore",
  };
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const user = await getOrCreateDbUser();
  if (!user) {
    redirect("/handler/sign-in?redirectTo=/dashboard");
  }

  const resolvedParams = await searchParams;
  const currentPage = parseInt(resolvedParams.page || "1", 10);
  const limit = 5;
  const offset = (currentPage - 1) * limit;

  // Query total count of completed orders for pagination, and total invested amount
  const [statsResult] = await db
    .select({
      count: sql<number>`count(*)`,
      sum: sql<number>`coalesce(sum(${orders.amount}), 0)`
    })
    .from(orders)
    .where(and(eq(orders.userId, user.id), eq(orders.status, "completed")));

  const totalCount = Number(statsResult?.count || 0);
  const totalInvested = Number(statsResult?.sum || 0);
  const totalPages = Math.ceil(totalCount / limit);

  // Query all completed orders for the lightweight billing history ledger
  const billingHistory = await db
    .select({
      orderId: orders.id,
      amount: orders.amount,
      purchaseDate: orders.createdAt,
      productTitle: products.title,
    })
    .from(orders)
    .innerJoin(products, eq(orders.productId, products.id))
    .where(and(eq(orders.userId, user.id), eq(orders.status, "completed")))
    .orderBy(desc(orders.createdAt));

  // Query paginated completed orders for this page
  const purchasedItems = await db
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
    .offset(offset);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container max-w-7xl mx-auto px-4 py-12 md:py-16 space-y-12">
        
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/60 pb-10">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tighter text-foreground">
              Inventory
            </h1>
            <p className="text-muted-foreground font-medium flex items-center gap-2">
              Account: <span className="text-foreground">{user.email}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
             <Button asChild variant="outline" size="sm" className="rounded-full h-10 px-6 font-bold uppercase tracking-widest text-[10px]">
                <Link href="/">Marketplace</Link>
             </Button>
             <Button asChild size="sm" className="rounded-full h-10 px-6 font-bold uppercase tracking-widest text-[10px]">
                <Link href="/search">New Scripts</Link>
             </Button>
          </div>
        </div>

        {totalCount === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 border border-dashed border-border rounded-[2.5rem] bg-card/30 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
               <ShoppingBag className="w-6 h-6 text-muted-foreground" />
            </div>
            <div className="space-y-2">
               <h2 className="text-xl font-bold text-foreground">No Assets Unlocked</h2>
               <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                 Browse our curated library to start building your digital collection.
               </p>
            </div>
            <Button asChild className="rounded-full h-11 px-8">
              <Link href="/">Start Browsing</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Main: Purchased Products */}
            <div className="lg:col-span-8 space-y-8">
              <div className="flex items-center gap-4 mb-4">
                 <h2 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground">Recent Unlocks</h2>
                 <div className="h-px flex-1 bg-border/40" />
              </div>
              
              <div className="grid gap-6">
                {purchasedItems.map((item) => (
                  <Card key={item.orderId} className="border-border/50 bg-card hover:border-foreground/10 transition-all duration-300 rounded-[2rem] overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col sm:flex-row items-stretch">
                        {/* Thumbnail */}
                        <div className="relative w-full sm:w-48 h-48 bg-muted border-r border-border/40 overflow-hidden flex-shrink-0">
                          {item.product.thumbnail ? (
                            <img src={item.product.thumbnail} alt={item.product.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] font-black font-mono text-muted-foreground uppercase tracking-widest bg-muted/50">
                              {item.product.category}
                            </div>
                          )}
                        </div>

                        <div className="flex-1 p-8 flex flex-col justify-between gap-6">
                          <div className="space-y-4">
                            <div className="flex items-center flex-wrap gap-2">
                              <Badge variant="outline" className="text-[9px] font-black uppercase border-primary/20 text-primary rounded-full px-2">
                                {item.product.category}
                              </Badge>
                              <Badge variant="secondary" className="text-[9px] font-mono rounded-full px-2">
                                v{item.product.version}
                              </Badge>
                            </div>
                            <div className="space-y-2">
                              <Link href={`/products/${item.product.slug}`}>
                                <h3 className="text-xl font-extrabold text-foreground tracking-tight hover:underline underline-offset-4 decoration-border">
                                  {item.product.title}
                                </h3>
                              </Link>
                              <p className="text-sm text-muted-foreground font-medium line-clamp-1">
                                {item.product.shortDescription}
                              </p>
                            </div>
                          </div>

                           <div className="flex items-center flex-wrap gap-3">
                            <Button asChild size="sm" className="rounded-full h-10 px-6 font-bold uppercase tracking-widest text-[10px] shadow-xl shadow-primary/10">
                              <a href={`/api/download/${item.product.id}`}>
                                <Download className="w-3.5 h-3.5 mr-2" />
                                Get Files
                              </a>
                            </Button>
                            <Button asChild variant="outline" size="sm" className="rounded-full h-10 px-6 font-bold uppercase tracking-widest text-[10px]">
                              <Link href={`/dashboard/receipt/${item.orderId}`}>
                                <FileText className="w-3.5 h-3.5 mr-2" />
                                Receipt
                              </Link>
                            </Button>
                            {item.product.demoUrl && (
                              <Button asChild variant="outline" size="sm" className="rounded-full h-10 px-6 font-bold uppercase tracking-widest text-[10px]">
                                <a href={item.product.demoUrl} target="_blank" rel="noopener noreferrer">
                                  Live Demo
                                </a>
                              </Button>
                            )}
                            <Button asChild variant="ghost" size="sm" className="rounded-full h-10 px-6 font-bold uppercase tracking-widest text-[10px]">
                               <Link href={`/products/${item.product.slug}`}>Product Page</Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {totalPages > 1 && (
                <ProductPagination totalPages={totalPages} currentPage={currentPage} />
              )}
            </div>

            {/* Sidebar: Activity/Receipts */}
            <div className="lg:col-span-4 space-y-8">
              <div className="flex items-center gap-4 mb-4">
                 <h2 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground">Activity</h2>
                 <div className="h-px flex-1 bg-border/40" />
              </div>

              <Card className="border-border/50 bg-card/50 rounded-[2rem]">
                <CardHeader className="p-8 pb-4">
                  <CardTitle className="text-lg font-bold flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                       <CreditCard className="w-4 h-4 text-primary" />
                    </div>
                    Billing History
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-4 space-y-8">
                  <div className="space-y-6 max-h-[300px] overflow-y-auto pr-2">
                    {billingHistory.map((item) => (
                      <div key={item.orderId} className="group flex justify-between items-start gap-4">
                        <div className="space-y-1.5 flex-1">
                          <Link href={`/dashboard/receipt/${item.orderId}`}>
                            <p className="text-xs font-bold text-foreground line-clamp-1 uppercase tracking-tight group-hover:underline underline-offset-2 flex items-center gap-1">
                              {item.productTitle}
                              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </p>
                          </Link>
                          <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-bold">
                             <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(item.purchaseDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                             <span className="flex items-center gap-1 uppercase tracking-tighter opacity-60">TX: {item.orderId.slice(0, 8)}</span>
                          </div>
                        </div>
                        <p className="text-sm font-black text-foreground tabular-nums">
                          ${(item.amount / 100).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  <Separator className="bg-border/60" />
                  
                  <div className="flex items-center justify-between font-black uppercase tracking-widest text-[10px]">
                     <span className="text-muted-foreground">Total Invested</span>
                     <span className="text-foreground text-sm">
                        ${(totalInvested / 100).toFixed(2)}
                     </span>
                  </div>
                </CardContent>
              </Card>
              
              {/* Support Card */}
              <Card className="border-primary/10 bg-primary/5 rounded-[2rem] p-8 space-y-4">
                 <CardTitle className="text-sm font-black uppercase tracking-widest">Need help?</CardTitle>
                 <CardDescription className="text-xs font-medium leading-relaxed">
                   Having trouble with a download or license? Reach out to our technical support team.
                 </CardDescription>
                 <Button className="w-full rounded-full h-9 text-[10px] font-black uppercase tracking-widest bg-foreground text-background hover:opacity-90 transition-opacity">
                    Contact Support
                 </Button>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
