import { db } from "../../db";
import { products, orders, users } from "../../db/schema";
import { eq, sql, desc } from "drizzle-orm";
import { Package, DollarSign, CreditCard, Clock } from "lucide-react";

export default async function AdminDashboardPage() {
  // Query 1: Total products count
  const [prodCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(products);
  const totalProducts = prodCount?.count || 0;

  // Query 2: Total completed orders count
  const [orderCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(orders)
    .where(eq(orders.status, "completed"));
  const totalOrders = orderCount?.count || 0;

  // Query 3: Total gross revenue
  const [revSum] = await db
    .select({ sum: sql<number>`sum(${orders.amount})` })
    .from(orders)
    .where(eq(orders.status, "completed"));
  const totalRevenue = revSum?.sum || 0;

  // Query 4: Recent purchases with product and customer details
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
    .limit(10);

  return (
    <div className="space-y-10">
      
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Overview Dashboard
        </h1>
        <p className="text-sm text-neutral-400">
          Real-time updates on marketplace activity and performance metrics.
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Total Revenue */}
        <div className="p-6 rounded-2xl border border-neutral-900 bg-neutral-900/10 backdrop-blur-sm flex items-center space-x-5 shadow-lg">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
            <DollarSign className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <span className="text-xs text-neutral-500 font-semibold uppercase tracking-wider">
              Gross Revenue
            </span>
            <h3 className="text-2xl font-black text-white">
              ₹{(totalRevenue / 100).toLocaleString("en-IN")}
            </h3>
          </div>
        </div>

        {/* Total Orders */}
        <div className="p-6 rounded-2xl border border-neutral-900 bg-neutral-900/10 backdrop-blur-sm flex items-center space-x-5 shadow-lg">
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
            <CreditCard className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <span className="text-xs text-neutral-500 font-semibold uppercase tracking-wider">
              Completed Sales
            </span>
            <h3 className="text-2xl font-black text-white">{totalOrders}</h3>
          </div>
        </div>

        {/* Total Products */}
        <div className="p-6 rounded-2xl border border-neutral-900 bg-neutral-900/10 backdrop-blur-sm flex items-center space-x-5 shadow-lg">
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
            <Package className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <span className="text-xs text-neutral-500 font-semibold uppercase tracking-wider">
              Total Products
            </span>
            <h3 className="text-2xl font-black text-white">{totalProducts}</h3>
          </div>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="p-8 rounded-2xl border border-neutral-900 bg-neutral-900/10 backdrop-blur-sm space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-400" />
          Recent Transactions
        </h2>

        {recentPurchases.length === 0 ? (
          <p className="text-neutral-500 text-sm py-10 text-center">
            No transaction records found.
          </p>
        ) : (
          <div className="overflow-x-auto border border-neutral-900 rounded-xl">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-neutral-900 bg-neutral-900/40 text-neutral-400 font-medium text-xs uppercase tracking-wider">
                  <th className="p-4">Customer</th>
                  <th className="p-4">Product</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900 text-neutral-300">
                {recentPurchases.map((purchase) => (
                  <tr key={purchase.orderId} className="hover:bg-neutral-900/10 transition-colors">
                    <td className="p-4 space-y-0.5">
                      <div className="font-bold text-neutral-200">
                        {purchase.customerName || "No Name"}
                      </div>
                      <div className="text-[11px] text-neutral-500 font-mono">
                        {purchase.customerEmail}
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-neutral-200">
                      {purchase.productTitle}
                    </td>
                    <td className="p-4 font-mono font-bold text-white">
                      ₹{(purchase.amount / 100).toLocaleString("en-IN")}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        purchase.status === "completed"
                          ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                          : purchase.status === "pending"
                          ? "bg-amber-500/10 border border-amber-500/20 text-amber-400"
                          : "bg-rose-500/10 border border-rose-500/20 text-rose-400"
                      }`}>
                        {purchase.status}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-neutral-500 font-mono">
                      {new Date(purchase.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
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
