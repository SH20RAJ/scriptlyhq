import { db } from "../../../db";
import { users, products } from "../../../db/schema";
import { desc } from "drizzle-orm";
import { isAdmin } from "../../../lib/auth-utils";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, Gift, Package, UserCheck } from "lucide-react";
import StoresClient from "./StoresClient";

export const dynamic = "force-dynamic";

export default async function AdminStoresPage() {
  const authorized = await isAdmin();
  if (!authorized) {
    redirect("/");
  }

  // Fetch all users and products
  const allUsers = await db.query.users.findMany({
    orderBy: [desc(users.createdAt)],
  });
  const allProducts = await db.query.products.findMany();

  // Map user data into Creator format for the client
  const creators = allUsers
    .map((user) => {
      const userProducts = allProducts.filter((p) => p.creatorId === user.id);
      
      const approvedCount = userProducts.filter((p) => p.status === "approved").length;
      const pendingCount = userProducts.filter((p) => p.status === "pending").length;
      const rejectedCount = userProducts.filter((p) => p.status === "rejected").length;
      const productsList = userProducts.map((p) => p.title).join(", ");

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        storeName: user.storeName,
        role: user.role,
        razorpayAccountId: user.razorpayAccountId,
        bankName: user.bankName,
        bankAccountName: user.bankAccountName,
        bankAccountNumber: user.bankAccountNumber,
        bankIfsc: user.bankIfsc,
        approvedCount,
        pendingCount,
        rejectedCount,
        productsList,
        createdAt: user.createdAt.toISOString(),
      };
    })
    .filter((c) => !!c.storeName || c.approvedCount > 0 || c.pendingCount > 0 || c.rejectedCount > 0);

  // Compute stats
  const totalStores = creators.filter((c) => !!c.storeName).length;
  const totalRazorpayLinked = creators.filter((c) => !!c.razorpayAccountId).length;
  const totalCreatorProducts = allProducts.filter((p) => !!p.creatorId).length;
  const pendingCreatorProducts = allProducts.filter(
    (p) => !!p.creatorId && p.status === "pending"
  ).length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Stores & Route Settings</h1>
        <p className="text-muted-foreground text-sm font-medium mt-1">
          Review developer storefronts, manage automated split payment accounts, and monitor bank transfer details.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-card/40 border-border/50 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">
              Total Creator Stores
            </CardTitle>
            <Store className="w-4 h-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">{totalStores}</div>
          </CardContent>
        </Card>

        <Card className="bg-card/40 border-border/50 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">
              Linked Route Accounts
            </CardTitle>
            <Gift className="w-4 h-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">{totalRazorpayLinked}</div>
          </CardContent>
        </Card>

        <Card className="bg-card/40 border-border/50 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">
              Creator Listings
            </CardTitle>
            <Package className="w-4 h-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">{totalCreatorProducts}</div>
          </CardContent>
        </Card>

        <Card className="bg-card/40 border-border/50 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">
              Pending Approvals
            </CardTitle>
            <UserCheck className="w-4 h-4 text-rose-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-rose-500">
              {pendingCreatorProducts}
            </div>
          </CardContent>
        </Card>
      </div>

      <StoresClient initialCreators={creators} />
    </div>
  );
}
