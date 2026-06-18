import type { Metadata } from "next";
import { db } from "../../../db";

export const metadata: Metadata = {
  title: "Payouts",
};

import { users, products, orders, payouts } from "../../../db/schema";
import { desc, eq } from "drizzle-orm";
import { isAdmin } from "../../../lib/auth-utils";
import { redirect } from "next/navigation";
import PayoutsClient from "./PayoutsClient";

export const dynamic = "force-dynamic";

export default async function AdminPayoutsPage() {
  const authorized = await isAdmin();
  if (!authorized) {
    redirect("/");
  }

  // Fetch all users, products, completed orders, and payouts
  const allUsers = await db.query.users.findMany({
    orderBy: [desc(users.createdAt)],
  });
  const allProducts = await db.query.products.findMany();
  const allCompletedOrders = await db.query.orders.findMany({
    where: eq(orders.status, "completed"),
  });
  const allPayouts = await db.query.payouts.findMany({
    orderBy: [desc(payouts.createdAt)],
  });

  // Compile creator metrics
  const creators = allUsers
    .map((user) => {
      const userProductIds = allProducts
        .filter((p) => p.creatorId === user.id)
        .map((p) => p.id);
      
      const userOrders = allCompletedOrders.filter((o) =>
        userProductIds.includes(o.productId)
      );

      const grossSales = userOrders.reduce((sum, o) => sum + o.amount, 0);
      const netEarning = Math.round(grossSales * 0.95);
      const userPayouts = allPayouts.filter((p) => p.userId === user.id);
      const totalPaid = userPayouts.reduce((sum, p) => sum + p.amount, 0);
      const unpaidBalance = netEarning - totalPaid;

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        storeName: user.storeName,
        payoutMethod: user.payoutMethod,
        paypalEmail: user.paypalEmail,
        payoutDetails: user.payoutDetails,
        grossSales,
        netEarning,
        totalPaid,
        unpaidBalance,
        productsCount: userProductIds.length,
      };
    })
    .filter((c) => !!c.storeName || c.productsCount > 0);

  // Compile history logs
  const payoutsHistory = allPayouts.map((p) => {
    const creator = allUsers.find((u) => u.id === p.userId);
    return {
      id: p.id,
      userId: p.userId,
      userEmail: creator?.email || "unknown@domain.com",
      userStoreName: creator?.storeName || null,
      amount: p.amount,
      payoutMethod: p.payoutMethod,
      paypalEmail: p.paypalEmail,
      payoutDetails: p.payoutDetails,
      createdAt: p.createdAt.toISOString(),
    };
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Payout Management</h1>
        <p className="text-muted-foreground text-sm font-medium mt-1">
          Review developer revenues, unpaid balances, payout preferences, and log processed settlements.
        </p>
      </div>

      <PayoutsClient creators={creators} payoutsHistory={payoutsHistory} />
    </div>
  );
}
