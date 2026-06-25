export const dynamic = "force-dynamic";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Purchase Receipt",
};

import { db } from "@/db";
import { orders, products, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getOrCreateDbUser } from "@/lib/auth-utils";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PrintButton } from "@/components/PrintButton";

interface PageProps {
  params: Promise<{
    orderId: string;
  }>;
}

export default async function ReceiptPage({ params }: PageProps) {
  const user = await getOrCreateDbUser();
  if (!user) {
    redirect("/handler/sign-in?redirectTo=/dashboard");
  }

  const { orderId } = await params;

  // Query order
  const orderRecord = await db.query.orders.findFirst({
    where: eq(orders.id, orderId),
  });

  if (!orderRecord || orderRecord.status !== "completed") {
    redirect("/dashboard");
  }

  // Authorize: must be owner of order or admin
  const isAdmin = user.role === "admin";
  if (orderRecord.userId !== user.id && !isAdmin) {
    redirect("/dashboard");
  }

  // Fetch product
  const productRecord = await db.query.products.findFirst({
    where: eq(products.id, orderRecord.productId),
  });

  if (!productRecord) {
    redirect("/dashboard");
  }

  // Fetch buyer details if admin viewing someone else's order
  let buyerEmail = user.email;
  if (isAdmin && orderRecord.userId !== user.id) {
    const buyer = await db.query.users.findFirst({
      where: eq(users.id, orderRecord.userId),
    });
    if (buyer) {
      buyerEmail = buyer.email;
    }
  }

  const invoiceNumber = `INV-${orderRecord.id.replace(/-/g, "").substring(0, 12).toUpperCase()}`;
  const formattedDate = new Date(orderRecord.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const basePrice = productRecord.price / 100;
  const discount = orderRecord.discountApplied / 100;
  const totalAmount = orderRecord.amount / 100;

  const editCopyPrice = orderRecord.addOnEditCopy ? Math.round(productRecord.price / 3) : 0;
  const setupDeployPrice = orderRecord.addOnSetupDeploy ? Math.round(productRecord.price / 3) : 0;
  const editCopyPriceUsd = editCopyPrice / 100;
  const setupDeployPriceUsd = setupDeployPrice / 100;
  
  const subtotalAmount = basePrice + editCopyPriceUsd + setupDeployPriceUsd;

  return (
    <div className="min-h-screen bg-background text-foreground py-10 px-4 md:py-16">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Navigation / Action bar (hidden on print) */}
        <div className="no-print flex items-center justify-between bg-card/45 border border-border/60 p-4 rounded-[1.5rem] shadow-sm">
          <Button asChild variant="ghost" size="sm" className="rounded-full h-10 px-4 font-bold uppercase tracking-widest text-[10px]">
            <Link href="/dashboard">
              <ArrowLeft className="w-3.5 h-3.5 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <PrintButton />
        </div>

        {/* Invoice Paper */}
        <div className="bg-card border-2 border-border/50 rounded-[2.5rem] shadow-xl p-8 md:p-12 space-y-10 relative overflow-hidden">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-8 border-b border-border/60">
            <div className="space-y-2">
              <span className="font-sans font-black text-2xl tracking-tight text-foreground">
                scriptly<span className="text-[#58CC02]">store</span>
              </span>
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                Official Digital Receipt
              </p>
            </div>
            <div className="text-left sm:text-right space-y-1">
              <h1 className="text-xl font-extrabold text-foreground tracking-tight uppercase">
                Invoice
              </h1>
              <p className="text-xs font-mono font-bold text-muted-foreground">
                {invoiceNumber}
              </p>
            </div>
          </div>

          {/* Meta Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
            <div className="space-y-4">
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                  Billed To
                </h3>
                <p className="font-bold text-foreground">{buyerEmail}</p>
                <p className="text-xs text-muted-foreground">Verified Customer Account</p>
              </div>
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                  Payment Status
                </h3>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#58CC02]/10 text-[#58CC02] border border-[#58CC02]/20">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Successful & Completed
                </div>
              </div>
            </div>

            <div className="space-y-4 md:text-right">
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                  Date of Purchase
                </h3>
                <p className="font-bold text-foreground">{formattedDate}</p>
              </div>
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                  Payment Reference
                </h3>
                <p className="font-mono text-xs text-foreground bg-muted/50 inline-block px-2.5 py-1 rounded-md border border-border/40">
                  {orderRecord.razorpayPaymentId || "Razorpay API Payment"}
                </p>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-border/60 rounded-[1.5rem] overflow-hidden bg-muted/20">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-muted/40 border-b border-border/60 font-black uppercase tracking-widest text-[9px] text-muted-foreground">
                  <th className="p-4 pl-6">Item Description</th>
                  <th className="p-4 text-right pr-6">Amount (USD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-medium">
                <tr>
                  <td className="p-4 pl-6">
                    <p className="font-bold text-foreground">{productRecord.title}</p>
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mt-0.5">
                      Category: {productRecord.category}
                    </p>
                  </td>
                  <td className="p-4 text-right pr-6 font-semibold text-foreground">
                    ${basePrice.toFixed(2)}
                  </td>
                </tr>
                {orderRecord.addOnEditCopy && (
                  <tr>
                    <td className="p-4 pl-6">
                      <p className="font-bold text-foreground">Edit Copy & Content Support</p>
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mt-0.5">
                        Add-on service (1/3 product price)
                      </p>
                    </td>
                    <td className="p-4 text-right pr-6 font-semibold text-foreground">
                      ${editCopyPriceUsd.toFixed(2)}
                    </td>
                  </tr>
                )}
                {orderRecord.addOnSetupDeploy && (
                  <tr>
                    <td className="p-4 pl-6">
                      <p className="font-bold text-foreground">Setup & Deployment Support</p>
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mt-0.5">
                        Add-on service (1/3 product price)
                      </p>
                    </td>
                    <td className="p-4 text-right pr-6 font-semibold text-foreground">
                      ${setupDeployPriceUsd.toFixed(2)}
                    </td>
                  </tr>
                )}
                {orderRecord.couponCode && (
                  <tr className="text-[#FF4B4B] bg-[#FF4B4B]/5">
                    <td className="p-4 pl-6 text-xs font-bold uppercase tracking-wider">
                      Discount (Coupon: {orderRecord.couponCode})
                    </td>
                    <td className="p-4 text-right pr-6 font-semibold">
                      -${discount.toFixed(2)}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Summary / Total section */}
          <div className="flex justify-end">
            <div className="w-full sm:w-72 space-y-3 text-sm">
              <div className="flex justify-between font-bold text-muted-foreground">
                <span>Subtotal</span>
                <span>${subtotalAmount.toFixed(2)}</span>
              </div>
              {orderRecord.couponCode && (
                <div className="flex justify-between font-bold text-[#FF4B4B]">
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-border/60 pt-3 flex justify-between items-baseline">
                <span className="font-extrabold text-foreground uppercase tracking-wider text-[10px]">
                  Total Paid
                </span>
                <span className="text-2xl font-black text-foreground">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Thank You Note */}
          <div className="pt-8 border-t border-border/60 text-center space-y-3">
            <p className="text-xs text-muted-foreground font-semibold leading-relaxed">
              Thank you for supporting creators on ScriptlyStore! If you have any questions, feel free to contact our technical support.
            </p>
            <div className="flex justify-center gap-6 text-[10px] font-mono text-muted-foreground/60 uppercase">
              <span>https://scriptly.store</span>
              <span>•</span>
              <span>support@scriptly.store</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
