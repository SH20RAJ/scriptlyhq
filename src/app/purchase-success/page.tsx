import { db } from "../../db";
import { orders, products } from "../../db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Download, Home, ArrowRight } from "lucide-react";

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
      product: {
        id: products.id,
        title: products.title,
        slug: products.slug,
      },
    })
    .from(orders)
    .innerJoin(products, eq(orders.productId, products.id))
    .where(eq(orders.id, orderId))
    .limit(1);

  const receipt = results[0];

  if (!receipt || receipt.status !== "completed") {
    // If order not found or still pending, redirect to dashboard to poll/check status
    redirect("/dashboard");
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-8">
      
      {/* Success Animation Header */}
      <div className="space-y-4">
        <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Payment Successful!
        </h1>
        <p className="text-neutral-400 max-w-sm mx-auto text-sm">
          Thank you for choosing ScriptlyHQ. Your payment was verified, and your downloads are unlocked.
        </p>
      </div>

      {/* Invoice Card */}
      <div className="p-6 rounded-2xl border border-neutral-900 bg-neutral-900/10 backdrop-blur-sm text-left space-y-4">
        <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider border-b border-neutral-900 pb-2">
          Receipt Details
        </h2>
        
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-neutral-500">Product:</span>
            <span className="text-white font-semibold">{receipt.product.title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Order ID:</span>
            <span className="font-mono text-xs text-neutral-300">{receipt.orderId}</span>
          </div>
          {receipt.paymentId && (
            <div className="flex justify-between">
              <span className="text-neutral-500">Transaction ID:</span>
              <span className="font-mono text-xs text-neutral-300">{receipt.paymentId}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-neutral-900 pt-3">
            <span className="text-neutral-400 font-medium">Total Paid:</span>
            <span className="text-lg font-black text-emerald-400">
              ₹{(receipt.amount / 100).toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <a
          href={`/api/download/${receipt.product.id}`}
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-bold rounded-xl shadow-lg shadow-emerald-500/10 transition-all active:scale-[0.98]"
        >
          <Download className="w-4 h-4" />
          <span>Download Files</span>
        </a>
        
        <Link
          href="/dashboard"
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 border border-neutral-800 hover:border-neutral-700 bg-neutral-900/30 text-neutral-300 hover:text-white font-semibold rounded-xl transition-all"
        >
          <span>Go to Purchases</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="pt-4">
        <Link
          href="/"
          className="inline-flex items-center text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
        >
          <Home className="w-3.5 h-3.5 mr-1.5" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
