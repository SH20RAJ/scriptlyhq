export const dynamic = "force-dynamic";

import { db } from "../../db";
import { orders, products } from "../../db/schema";
import { eq, and, desc } from "drizzle-orm";
import { getOrCreateDbUser } from "../../lib/auth-utils";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Download, ShoppingBag, CreditCard, ChevronRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default async function DashboardPage() {
  const user = await getOrCreateDbUser();
  if (!user) {
    redirect("/handler/sign-in?redirectTo=/dashboard");
  }

  // Query completed orders with their associated product details
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
    .orderBy(desc(orders.createdAt));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Welcome Header */}
      <div className="space-y-2 border-b border-border pb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          My Purchases
        </h1>
        <p className="text-sm text-muted-foreground">
          Authenticated as <span className="text-foreground font-medium">{user.email}</span>
        </p>
      </div>

      {purchasedItems.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-border rounded-xl bg-card/30 space-y-4">
          <ShoppingBag className="w-10 h-10 text-muted-foreground mx-auto" />
          <h2 className="text-lg font-medium text-foreground">No purchases found</h2>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            You haven't purchased any digital assets yet.
          </p>
          <Button asChild className="mt-4">
            <Link href="/">Browse Products</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main: Purchased Products */}
          <div className="lg:col-span-8 space-y-6">
            <div className="space-y-4">
              {purchasedItems.map((item) => (
                <Card key={item.orderId} className="border-border bg-card hover:border-muted-foreground/20 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                      <div className="flex items-center space-x-5">
                        {/* Thumbnail */}
                        <div className="relative w-20 h-20 rounded-lg bg-muted border border-border overflow-hidden flex-shrink-0">
                          {item.product.thumbnail ? (
                            <Image
                              src={item.product.thumbnail}
                              alt={item.product.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] font-mono text-muted-foreground uppercase">
                              {item.product.category}
                            </div>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex items-center flex-wrap gap-2">
                            <Link
                              href={`/products/${item.product.slug}`}
                              className="font-medium text-foreground hover:underline underline-offset-4 decoration-muted-foreground transition-all text-lg"
                            >
                              {item.product.title}
                            </Link>
                            <Badge variant="secondary" className="text-[10px] font-mono">
                              v{item.product.version}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-1 max-w-md">
                            {item.product.shortDescription}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        {item.product.demoUrl && (
                          <Button asChild variant="outline" size="sm">
                            <a href={item.product.demoUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                              Demo
                            </a>
                          </Button>
                        )}
                        <Button asChild size="sm">
                          <a href={`/api/download/${item.product.id}`}>
                            <Download className="w-3.5 h-3.5 mr-1.5" />
                            Download
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar: Order Summary */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="border-border bg-card/50">
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Order History
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {purchasedItems.map((item, idx) => (
                    <div key={item.orderId} className="space-y-2">
                      {idx > 0 && <Separator className="mb-4" />}
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-0.5">
                          <p className="text-sm font-medium text-foreground line-clamp-1">{item.product.title}</p>
                          <p className="text-[10px] text-muted-foreground font-mono">
                            {new Date(item.purchaseDate).toLocaleDateString("en-US", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric"
                            })}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-foreground">
                          ₹{(item.amount / 100).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
