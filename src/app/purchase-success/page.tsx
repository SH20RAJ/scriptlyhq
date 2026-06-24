import type { Metadata } from "next";
import { db } from "../../db";

export const metadata: Metadata = {
  title: "Purchase Successful",
  description: "Your purchase was successful! Download your files from your ScriptlyStore dashboard.",
};

import { orders, products } from "../../db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Download, Home, ArrowRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface PageProps {
  searchParams: Promise<{
    orderId?: string;
  }>;
}

export default async function PurchaseSuccessPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const orderId = resolvedParams.orderId;

  if (!orderId) {
    redirect("/");
  }

  // Fetch the order and product
  const results = await db
    .select({
      orderId: orders.id,
      amount: orders.amount,
      paymentId: orders.razorpayPaymentId,
      status: orders.status,
      addOnEditCopy: orders.addOnEditCopy,
      addOnSetupDeploy: orders.addOnSetupDeploy,
      product: {
        id: products.id,
        title: products.title,
        slug: products.slug,
        price: products.price,
      },
    })
    .from(orders)
    .innerJoin(products, eq(orders.productId, products.id))
    .where(eq(orders.id, orderId))
    .limit(1);

  const receipt = results[0];

  if (!receipt || receipt.status !== "completed") {
    redirect("/dashboard");
  }

  const editCopyPrice = receipt.addOnEditCopy ? Math.round(receipt.product.price / 3) : 0;
  const setupDeployPrice = receipt.addOnSetupDeploy ? Math.round(receipt.product.price / 3) : 0;
  const baseProductPaid = receipt.amount - editCopyPrice - setupDeployPrice;

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-12">
      
      {/* Success Animation Header */}
      <div className="space-y-4">
        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-3xl font-semibold text-foreground tracking-tight">
          Purchase Confirmed
        </h1>
        <p className="text-muted-foreground max-w-sm mx-auto text-sm leading-relaxed">
          Your payment has been processed and your digital assets are ready for download.
        </p>
      </div>

      {/* Invoice Card */}
      <Card className="border-border bg-card/50 text-left overflow-hidden">
        <CardHeader className="bg-muted/30">
          <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Transaction Receipt
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Product</span>
              <span className="text-foreground font-medium">{receipt.product.title}</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground pl-3">
              <span>Base Product</span>
              <span className="font-semibold">${(baseProductPaid / 100).toFixed(2)}</span>
            </div>
            {receipt.addOnEditCopy && (
              <div className="flex justify-between text-xs text-muted-foreground pl-3">
                <span>+ Edit Copy & Content Support Add-on</span>
                <span className="font-mono font-semibold">${(editCopyPrice / 100).toFixed(2)}</span>
              </div>
            )}
            {receipt.addOnSetupDeploy && (
              <div className="flex justify-between text-xs text-muted-foreground pl-3">
                <span>+ Setup & Deployment Support Add-on</span>
                <span className="font-mono font-semibold">${(setupDeployPrice / 100).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order ID</span>
              <span className="font-mono text-xs text-foreground uppercase">{receipt.orderId.slice(0, 12)}...</span>
            </div>
            {receipt.paymentId && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment ID</span>
                <span className="font-mono text-xs text-foreground">{receipt.paymentId}</span>
              </div>
            )}
            <Separator className="my-2" />
            <div className="flex justify-between items-baseline pt-2">
              <span className="text-muted-foreground font-medium">Amount Paid</span>
              <span className="text-2xl font-bold text-foreground">
                ${(receipt.amount / 100).toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button asChild size="lg" className="w-full sm:w-auto h-12 px-8">
          <a href={`/api/download/${receipt.product.id}`}>
            <Download className="w-4 h-4 mr-2" />
            Download Files
          </a>
        </Button>

        <Button asChild variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8">
          <Link href={`/dashboard/receipt/${receipt.orderId}`}>
            <FileText className="w-4 h-4 mr-2" />
            View Receipt
          </Link>
        </Button>
        
        <Button asChild variant="ghost" size="lg" className="w-full sm:w-auto h-12 px-8">
          <Link href="/dashboard">
            View Purchases
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>

      <div className="pt-8">
        <Button asChild variant="link" size="sm" className="text-muted-foreground hover:text-foreground">
          <Link href="/">
            <Home className="w-4 h-4 mr-2" />
            Return to Marketplace
          </Link>
        </Button>
      </div>
    </div>
  );
}
