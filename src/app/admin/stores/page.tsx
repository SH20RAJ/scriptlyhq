import { db } from "../../../db";
import { users, products, coupons } from "../../../db/schema";
import { desc, eq } from "drizzle-orm";
import { isAdmin } from "../../../lib/auth-utils";
import { redirect } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Store, Gift, Package, ExternalLink, Calendar, Mail, UserCheck } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminStoresPage() {
  const authorized = await isAdmin();
  if (!authorized) {
    redirect("/");
  }

  // Fetch all users, products and coupons
  const allUsers = await db.query.users.findMany({
    orderBy: [desc(users.createdAt)],
  });
  const allProducts = await db.query.products.findMany();
  const allCoupons = await db.query.coupons.findMany();

  // Filter to find creators: users with storeName OR at least one product
  const creators = allUsers
    .map((user) => {
      const userProducts = allProducts.filter((p) => p.creatorId === user.id);
      const userCoupons = allCoupons.filter((c) => c.creatorId === user.id);
      return {
        ...user,
        products: userProducts,
        coupons: userCoupons,
      };
    })
    .filter((user) => !!user.storeName || user.products.length > 0);

  // Compute stats
  const totalStores = creators.filter((c) => !!c.storeName).length;
  const totalCreatorCoupons = allCoupons.filter((c) => !!c.creatorId).length;
  const totalCreatorProducts = allProducts.filter((p) => !!p.creatorId).length;
  const pendingCreatorProducts = allProducts.filter(
    (p) => !!p.creatorId && p.status === "pending"
  ).length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Stores & Creators</h1>
        <p className="text-muted-foreground text-sm font-medium mt-1">
          Manage third-party creator storefronts, active coupons, and their catalog listings.
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
              Active Store Coupons
            </CardTitle>
            <Gift className="w-4 h-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">{totalCreatorCoupons}</div>
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

      <Separator className="border-border/40" />

      {/* Main List */}
      <Card className="bg-card/30 border-border/50 backdrop-blur-md rounded-2xl overflow-hidden">
        <CardHeader className="p-6">
          <CardTitle className="text-lg font-bold">Registered Creators</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {creators.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm font-medium">
              No registered stores or creator profiles found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="border-border/40 hover:bg-transparent">
                    <TableHead className="font-bold text-xs uppercase tracking-wider text-foreground px-6 py-4">
                      Store & Owner
                    </TableHead>
                    <TableHead className="font-bold text-xs uppercase tracking-wider text-foreground px-6 py-4">
                      Active Coupons
                    </TableHead>
                    <TableHead className="font-bold text-xs uppercase tracking-wider text-foreground px-6 py-4">
                      Listings Catalog
                    </TableHead>
                    <TableHead className="font-bold text-xs uppercase tracking-wider text-foreground px-6 py-4">
                      Joined Date
                    </TableHead>
                    <TableHead className="font-bold text-xs uppercase tracking-wider text-foreground px-6 py-4 text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {creators.map((c) => {
                    const approvedCount = c.products.filter(
                      (p) => p.status === "approved"
                    ).length;
                    const pendingCount = c.products.filter(
                      (p) => p.status === "pending"
                    ).length;
                    const rejectedCount = c.products.filter(
                      (p) => p.status === "rejected"
                    ).length;

                    return (
                      <TableRow
                        key={c.id}
                        className="border-border/40 hover:bg-muted/10 transition-colors"
                      >
                        {/* Store & Owner Column */}
                        <TableCell className="px-6 py-5 align-top">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              {c.storeName ? (
                                <span className="font-black text-foreground">
                                  {c.storeName}
                                </span>
                              ) : (
                                <span className="font-bold text-muted-foreground italic">
                                  Unnamed Store
                                </span>
                              )}
                              <Badge
                                variant="outline"
                                className="text-[9px] font-bold uppercase tracking-wider h-5"
                              >
                                {c.role}
                              </Badge>
                            </div>
                            <div className="flex flex-col gap-0.5 text-xs text-muted-foreground font-medium">
                              <span className="flex items-center gap-1">
                                <Mail className="w-3 h-3 text-muted-foreground/60" />
                                {c.email}
                              </span>
                              {c.name && <span>Owner: {c.name}</span>}
                            </div>
                          </div>
                        </TableCell>

                        {/* Coupons Column */}
                        <TableCell className="px-6 py-5 align-top">
                          {c.coupons.length === 0 ? (
                            <span className="text-xs text-muted-foreground/60 font-medium">
                              No active coupons
                            </span>
                          ) : (
                            <div className="flex flex-wrap gap-1.5 max-w-xs">
                              {c.coupons.map((coupon) => (
                                <Badge
                                  key={coupon.id}
                                  variant="secondary"
                                  className="text-[10px] font-bold font-mono py-0.5 px-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                >
                                  {coupon.code} (
                                  {coupon.discountType === "percentage"
                                    ? `-${coupon.discountValue}%`
                                    : `$${(coupon.discountValue / 100).toFixed(
                                        2
                                      )}`}
                                  )
                                </Badge>
                              ))}
                            </div>
                          )}
                        </TableCell>

                        {/* Listings Catalog Column */}
                        <TableCell className="px-6 py-5 align-top">
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              {approvedCount > 0 && (
                                <Badge className="text-[9px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                  {approvedCount} Approved
                                </Badge>
                              )}
                              {pendingCount > 0 && (
                                <Badge className="text-[9px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                                  {pendingCount} Pending
                                </Badge>
                              )}
                              {rejectedCount > 0 && (
                                <Badge className="text-[9px] font-bold bg-destructive/15 text-destructive border border-destructive/30">
                                  {rejectedCount} Rejected
                                </Badge>
                              )}
                              {c.products.length === 0 && (
                                <span className="text-xs text-muted-foreground/60 font-medium">
                                  No uploaded items
                                </span>
                              )}
                            </div>

                            {c.products.length > 0 && (
                              <div className="text-xs text-muted-foreground font-medium max-w-sm line-clamp-2">
                                {c.products.map((p) => p.title).join(", ")}
                              </div>
                            )}
                          </div>
                        </TableCell>

                        {/* Joined Date Column */}
                        <TableCell className="px-6 py-5 align-top text-xs text-muted-foreground font-medium">
                          <div className="flex items-center gap-1.5 pt-0.5">
                            <Calendar className="w-3.5 h-3.5 text-muted-foreground/60" />
                            {new Date(c.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                        </TableCell>

                        {/* Actions Column */}
                        <TableCell className="px-6 py-5 align-top text-right">
                          <div className="flex justify-end gap-2">
                            {pendingCount > 0 && (
                              <Button
                                asChild
                                size="xs"
                                className="h-8 px-2.5 font-bold uppercase tracking-widest text-[9px] bg-amber-500 hover:bg-amber-400 text-black border-0 rounded-lg cursor-pointer"
                              >
                                <Link href="/admin/approvals">
                                  Review Approvals
                                </Link>
                              </Button>
                            )}
                            <Button
                              asChild
                              variant="outline"
                              size="xs"
                              className="h-8 px-2.5 font-bold uppercase tracking-widest text-[9px] border-border/60 rounded-lg cursor-pointer"
                            >
                              <Link
                                href={`/admin/products?search=${encodeURIComponent(
                                  c.storeName || c.email
                                )}`}
                              >
                                <ExternalLink className="w-3 h-3 mr-1" />
                                View Products
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
