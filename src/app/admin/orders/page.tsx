export const dynamic = "force-dynamic";

import { db } from "../../../db";
import { orders, products, users } from "../../../db/schema";
import { eq, desc } from "drizzle-orm";
import { ShoppingCart, ShoppingBag, AlertCircle } from "lucide-react";

export default async function AdminOrdersPage() {
  // Query all orders joined with customer and product information
  const allOrdersList = await db
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
    .orderBy(desc(orders.createdAt));

  return (
    <div className="space-y-10">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Order Management
        </h1>
        <p className="text-sm text-neutral-400">
          Monitor payments, order history, and download fulfillment records.
        </p>
      </div>

      {/* Orders Table Container */}
      <div className="p-8 rounded-2xl border border-neutral-900 bg-neutral-900/10 backdrop-blur-sm">
        {allOrdersList.length === 0 ? (
          <div className="text-center py-16 text-neutral-500 space-y-4">
            <AlertCircle className="w-10 h-10 mx-auto text-neutral-600" />
            <p className="text-sm">No orders recorded in the system.</p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-neutral-900 rounded-xl">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-neutral-900 bg-neutral-900/40 text-neutral-400 font-medium text-xs uppercase tracking-wider">
                  <th className="p-4">Order Details</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Product Purchased</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900 text-neutral-300">
                {allOrdersList.map((ord) => (
                  <tr key={ord.orderId} className="hover:bg-neutral-900/5 transition-colors">
                    
                    {/* Order ID & Payment Ref */}
                    <td className="p-4">
                      <div className="font-mono text-xs text-white">
                        #{ord.orderId.slice(0, 8)}...
                      </div>
                      {ord.paymentId && (
                        <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
                          Pay Ref: {ord.paymentId}
                        </div>
                      )}
                    </td>

                    {/* Customer */}
                    <td className="p-4 space-y-0.5">
                      <div className="font-bold text-neutral-200">
                        {ord.customerName || "No Name"}
                      </div>
                      <div className="text-[11px] text-neutral-500 font-mono">
                        {ord.customerEmail}
                      </div>
                    </td>

                    {/* Product */}
                    <td className="p-4 font-semibold text-neutral-200">
                      {ord.productTitle}
                    </td>

                    {/* Amount */}
                    <td className="p-4 font-mono font-bold text-white text-sm">
                      ₹{(ord.amount / 100).toLocaleString("en-IN")}
                    </td>

                    {/* Status badge */}
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        ord.status === "completed"
                          ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                          : ord.status === "pending"
                          ? "bg-amber-500/10 border border-amber-500/20 text-amber-400"
                          : "bg-rose-500/10 border border-rose-500/20 text-rose-400"
                      }`}>
                        {ord.status}
                      </span>
                    </td>

                    {/* Purchase Date */}
                    <td className="p-4 text-xs text-neutral-500 font-mono">
                      {new Date(ord.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
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
