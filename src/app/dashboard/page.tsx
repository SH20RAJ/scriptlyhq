export const dynamic = "force-dynamic";

import { db } from "../../db";
import { orders, products } from "../../db/schema";
import { eq, and, desc } from "drizzle-orm";
import { getOrCreateDbUser } from "../../lib/auth-utils";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Download, ShoppingBag, CreditCard, ChevronRight, ExternalLink } from "lucide-react";

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          My Purchases
        </h1>
        <p className="text-sm text-neutral-400">
          Logged in as <span className="text-neutral-200 font-semibold">{user.email}</span>
        </p>
      </div>

      {purchasedItems.length === 0 ? (
        <div className="text-center py-20 border border-neutral-900 rounded-2xl bg-neutral-900/10 backdrop-blur-sm space-y-4">
          <ShoppingBag className="w-12 h-12 text-neutral-600 mx-auto" />
          <h2 className="text-lg font-bold text-white">No purchases yet</h2>
          <p className="text-sm text-neutral-500 max-w-sm mx-auto">
            Explore our premium collection of boilerplates, templates, ebooks, and scripts.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-4 py-2 mt-4 text-sm font-semibold text-black bg-gradient-to-r from-emerald-400 to-teal-400 rounded-lg hover:from-emerald-300 hover:to-teal-300 transition-all active:scale-[0.98]"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Main: Purchased Products */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-lg font-bold text-white border-b border-neutral-900 pb-2 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              Available Downloads
            </h2>
            
            <div className="space-y-4">
              {purchasedItems.map((item) => (
                <div
                  key={item.orderId}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-xl border border-neutral-900 bg-neutral-900/20 backdrop-blur-sm gap-4 hover:border-neutral-800 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    {/* Thumbnail */}
                    <div className="relative w-16 h-16 rounded-lg bg-neutral-950 border border-neutral-800 overflow-hidden flex-shrink-0">
                      {item.product.thumbnail ? (
                        <Image
                          src={item.product.thumbnail}
                          alt={item.product.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[8px] font-mono text-neutral-600 uppercase">
                          {item.product.category}
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/products/${item.product.slug}`}
                          className="font-bold text-white hover:text-emerald-400 transition-colors text-base flex items-center gap-1"
                        >
                          {item.product.title}
                          <ChevronRight className="w-4 h-4 text-neutral-600" />
                        </Link>
                        <span className="text-[10px] text-neutral-500 font-mono">
                          v{item.product.version}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 line-clamp-1 max-w-md">
                        {item.product.shortDescription}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2.5 w-full sm:w-auto">
                    {item.product.demoUrl && (
                      <a
                        href={item.product.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-3.5 py-2 text-xs font-semibold text-neutral-300 hover:text-white border border-neutral-800 hover:border-neutral-700 bg-neutral-900/40 rounded-lg transition-all"
                      >
                        <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                        Demo
                      </a>
                    )}
                    <a
                      href={`/api/download/${item.product.id}`}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-md shadow-emerald-400/10 active:scale-[0.97] transition-all"
                    >
                      <Download className="w-3.5 h-3.5 mr-1.5" />
                      Download
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar: Purchase History */}
          <div className="lg:col-span-1 space-y-6">
            <h2 className="text-lg font-bold text-white border-b border-neutral-900 pb-2 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              Order Receipts
            </h2>

            <div className="rounded-xl border border-neutral-900 bg-neutral-900/10 p-5 space-y-4">
              <div className="space-y-3 divide-y divide-neutral-900">
                {purchasedItems.map((item, idx) => (
                  <div
                    key={item.orderId}
                    className={`text-xs space-y-1.5 ${idx > 0 ? "pt-3.5" : ""}`}
                  >
                    <div className="flex justify-between font-semibold">
                      <span className="text-neutral-200 line-clamp-1 pr-2">
                        {item.product.title}
                      </span>
                      <span className="text-white font-bold flex-shrink-0">
                        ₹{(item.amount / 100).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                      <span>ID: {item.orderId.slice(0, 8)}...</span>
                      <span>
                        {new Date(item.purchaseDate).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </span>
                    </div>
                    {item.paymentId && (
                      <div className="text-[10px] text-neutral-500 font-mono flex justify-between">
                        <span>Payment:</span>
                        <span>{item.paymentId}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
