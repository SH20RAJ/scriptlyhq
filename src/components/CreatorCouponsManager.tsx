"use client";

import { useState, useTransition } from "react";
import { createCreatorCouponAction, deleteCreatorCouponAction } from "@/lib/actions/creator";
import { toast } from "sonner";
import { Gift, Plus, Trash2, Loader2, AlertCircle } from "lucide-react";

interface CreatorCoupon {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  minPurchaseAmount: number;
  active: boolean;
}

interface CreatorCouponsManagerProps {
  initialCoupons: CreatorCoupon[];
}

export default function CreatorCouponsManager({ initialCoupons }: CreatorCouponsManagerProps) {
  const [couponsList, setCouponsList] = useState<CreatorCoupon[]>(initialCoupons);
  const [isPending, startTransition] = useTransition();

  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [minPurchaseAmount, setMinPurchaseAmount] = useState("");

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        const res = await createCreatorCouponAction(formData);
        if (res.success) {
          toast.success("Store coupon created successfully!");
          // Reset form fields
          setCode("");
          setDiscountValue("");
          setMinPurchaseAmount("");
          // Note: Next.js revalidatePath will refresh the Server Component data automatically.
          // To ensure instant client update:
          window.location.reload();
        } else {
          toast.error("Failed to create coupon.");
        }
      } catch (err: any) {
        toast.error(err.message || "Failed to create coupon.");
      }
    });
  };

  const handleDelete = (id: string, code: string) => {
    if (!confirm(`Are you sure you want to delete coupon "${code}"?`)) return;

    startTransition(async () => {
      try {
        const res = await deleteCreatorCouponAction(id);
        if (res.success) {
          toast.success(`Coupon "${code}" deleted.`);
          setCouponsList((prev) => prev.filter((c) => c.id !== id));
        } else {
          toast.error("Failed to delete coupon.");
        }
      } catch (err: any) {
        toast.error(err.message || "Failed to delete coupon.");
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Create Coupon Form */}
      <form onSubmit={handleCreate} className="lg:col-span-5 p-6 rounded-2xl border border-border/40 bg-card/35 backdrop-blur-md shadow-sm space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-foreground flex items-center gap-2 border-b border-border/40 pb-3">
          <Gift className="w-4 h-4 text-[#58CC02]" />
          Create Store Coupon
        </h3>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Coupon Code *</label>
          <input
            type="text"
            name="code"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="e.g. FLASH30"
            required
            className="w-full px-4 py-2.5 rounded-xl border-2 border-border bg-background text-foreground text-xs focus:outline-none focus:border-primary focus:shadow-[0_3px_0_var(--duo-feather-shadow)] shadow-[0_3px_0_var(--border)] transition-all font-mono font-bold"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Discount Type</label>
            <select
              name="discountType"
              value={discountType}
              onChange={(e) => {
                setDiscountType(e.target.value);
                setDiscountValue("");
              }}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-border bg-background text-foreground text-xs focus:outline-none focus:border-primary focus:shadow-[0_3px_0_var(--duo-feather-shadow)] shadow-[0_3px_0_var(--border)] transition-all font-bold cursor-pointer"
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed USD ($)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">
              {discountType === "percentage" ? "Value (%) *" : "Value ($) *"}
            </label>
            <input
              type="number"
              name="discountValue"
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              placeholder={discountType === "percentage" ? "e.g. 20" : "e.g. 10"}
              min="1"
              required
              className="w-full px-4 py-2.5 rounded-xl border-2 border-border bg-background text-foreground text-xs focus:outline-none focus:border-primary focus:shadow-[0_3px_0_var(--duo-feather-shadow)] shadow-[0_3px_0_var(--border)] transition-all font-bold"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Min Purchase Amount (USD)</label>
          <input
            type="number"
            name="minPurchaseAmount"
            step="0.01"
            value={minPurchaseAmount}
            onChange={(e) => setMinPurchaseAmount(e.target.value)}
            placeholder="e.g. 25.00 (Optional)"
            className="w-full px-4 py-2.5 rounded-xl border-2 border-border bg-background text-foreground text-xs focus:outline-none focus:border-primary focus:shadow-[0_3px_0_var(--duo-feather-shadow)] shadow-[0_3px_0_var(--border)] transition-all font-bold"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2.5 bg-primary text-primary-foreground hover:brightness-105 disabled:opacity-50 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_3px_0_var(--duo-feather-shadow)] active:translate-y-px active:shadow-none"
        >
          {isPending ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Plus className="w-3.5 h-3.5" />
          )}
          Create Coupon
        </button>
      </form>

      {/* Coupons List */}
      <div className="lg:col-span-7 space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-neutral-500 flex items-center gap-2">
          Active Store Coupons
        </h3>

        {couponsList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 border border-border/40 rounded-2xl bg-card/25 backdrop-blur-xl text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-neutral-600" />
            <div className="space-y-1">
              <p className="text-xs font-bold text-neutral-400">No active coupons</p>
              <p className="text-[10px] text-neutral-500">Create a coupon to offer store-wide code discounts to customers.</p>
            </div>
          </div>
        ) : (
          <div className="border border-border/40 rounded-2xl overflow-hidden bg-card/35 backdrop-blur-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/40 bg-muted/20 text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                    <th className="py-3 px-4">Coupon Code</th>
                    <th className="py-3 px-4">Discount</th>
                    <th className="py-3 px-4">Min Spend</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 text-xs font-medium text-muted-foreground">
                  {couponsList.map((coupon) => (
                    <tr key={coupon.id} className="hover:bg-muted/10 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-white tracking-wider">
                        {coupon.code}
                      </td>
                      <td className="py-3 px-4">
                        {coupon.discountType === "percentage"
                          ? `${coupon.discountValue}% Off`
                          : `$${(coupon.discountValue / 100).toFixed(2)} Off`}
                      </td>
                      <td className="py-3 px-4">
                        {coupon.minPurchaseAmount > 0
                          ? `$${(coupon.minPurchaseAmount / 100).toFixed(2)}`
                          : "None"}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => handleDelete(coupon.id, coupon.code)}
                          className="p-1.5 text-neutral-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
