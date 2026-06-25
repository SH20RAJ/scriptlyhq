import { Metadata } from "next";
import AdminCouponsClient from "@/components/AdminCouponsClient";

export const metadata: Metadata = {
  title: "Admin Coupons Manager | ScriptlyStore",
  description: "Create, edit, toggle, and delete coupon codes for the marketplace.",
};

export default function AdminCouponsPage() {
  return (
    <div className="space-y-12" id="admin-coupons-root">
      <div className="flex flex-col gap-2 border-b border-border/60 pb-8">
        <h1 className="text-3xl font-extrabold tracking-tighter text-foreground">Coupons Manager</h1>
        <p className="text-sm text-muted-foreground font-medium">Create and manage promo codes and customer discounts.</p>
      </div>

      <AdminCouponsClient />
    </div>
  );
}
export const dynamic = "force-dynamic";
