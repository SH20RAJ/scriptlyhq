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

const formatINR = (val: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(val);

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
          setCode("");
          setDiscountValue("");
          setMinPurchaseAmount("");
          window.location.reload();
        } else {
          toast.error("Failed to create coupon.");
        }
      } catch (err: any) {
        toast.error(err.message || "Failed to create coupon.");
      }
    });
  };

  const handleDelete = (id: string, couponCode: string) => {
    if (!confirm(`Are you sure you want to delete coupon "${couponCode}"?`)) return;

    startTransition(async () => {
      try {
        const res = await deleteCreatorCouponAction(id);
        if (res.success) {
          toast.success(`Coupon "${couponCode}" deleted.`);
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Create Coupon Form */}
      <form
        onSubmit={handleCreate}
        className="lg:col-span-5 p-5 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-md shadow-sm space-y-4"
      >
        <div className="flex items-center gap-2 pb-3 border-b border-border/40">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <Gift className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-foreground">Create Discount Code</h3>
            <p className="text-[11px] text-muted-foreground">Applies store-wide to your scripts</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block">
            Coupon Code *
          </label>
          <input
            type="text"
            name="code"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="e.g. FLASH30, DEV20"
            required
            className="w-full px-3.5 py-2.5 rounded-xl border border-border/60 bg-background/50 text-foreground text-xs font-mono font-bold tracking-wider focus:outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground/60"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block">
              Type
            </label>
            <select
              name="discountType"
              value={discountType}
              onChange={(e) => {
                setDiscountType(e.target.value);
                setDiscountValue("");
              }}
              className="w-full px-3 py-2.5 rounded-xl border border-border/60 bg-background/50 text-foreground text-xs font-semibold focus:outline-none focus:border-primary/50 cursor-pointer"
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed (₹)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block">
              {discountType === "percentage" ? "Value (%) *" : "Value (₹) *"}
            </label>
            <input
              type="number"
              name="discountValue"
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              placeholder={discountType === "percentage" ? "20" : "200"}
              min="1"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-border/60 bg-background/50 text-foreground text-xs font-bold focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block">
            Min Order Value (Optional)
          </label>
          <input
            type="number"
            name="minPurchaseAmount"
            step="1"
            value={minPurchaseAmount}
            onChange={(e) => setMinPurchaseAmount(e.target.value)}
            placeholder="e.g. 500"
            className="w-full px-3.5 py-2.5 rounded-xl border border-border/60 bg-background/50 text-foreground text-xs font-medium focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2.5 bg-primary text-primary-foreground hover:brightness-105 disabled:opacity-50 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_3px_0_var(--duo-feather-shadow)] active:translate-y-px active:shadow-none mt-2"
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
      <div className="lg:col-span-7 space-y-3">
        <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
          Active Store Coupons
        </h3>

        {couponsList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 border border-border/50 rounded-2xl bg-card/20 text-center space-y-2 p-4">
            <AlertCircle className="w-7 h-7 text-muted-foreground/40" />
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-foreground">No active coupons</p>
              <p className="text-[11px] text-muted-foreground">Create a coupon to offer store-wide discounts.</p>
            </div>
          </div>
        ) : (
          <div className="border border-border/50 rounded-2xl overflow-hidden bg-card/30 backdrop-blur-md shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/40 bg-muted/20 text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                    <th className="py-3 px-4">Code</th>
                    <th className="py-3 px-4">Discount</th>
                    <th className="py-3 px-4">Min Spend</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30 text-xs">
                  {couponsList.map((coupon) => (
                    <tr key={coupon.id} className="hover:bg-muted/15 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-foreground tracking-wider">
                        {coupon.code}
                      </td>
                      <td className="py-3 px-4 font-bold text-emerald-500">
                        {coupon.discountType === "percentage"
                          ? `${coupon.discountValue}% OFF`
                          : `${formatINR(coupon.discountValue / 100)} OFF`}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {coupon.minPurchaseAmount > 0
                          ? formatINR(coupon.minPurchaseAmount / 100)
                          : "None"}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => handleDelete(coupon.id, coupon.code)}
                          className="p-1.5 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Delete Coupon"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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
