"use client";

import useSWR from "swr";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Gift, Trash, Plus, Power, ToggleLeft, ToggleRight, CheckCircle2, XCircle, AlertCircle, Loader2 } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Coupon {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  minPurchaseAmount: number;
  active: boolean;
  createdAt: string;
}

export default function AdminCouponsPage() {
  const { data, error, mutate, isLoading } = useSWR("/api/admin/coupons", fetcher);
  const [codeInput, setCodeInput] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [valueInput, setValueInput] = useState("");
  const [minPurchaseInput, setMinPurchaseInput] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [actionPending, setActionPending] = useState(false);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!codeInput.trim() || !valueInput.trim()) {
      setFormError("Coupon code and discount value are required.");
      return;
    }

    const valNum = parseFloat(valueInput);
    if (isNaN(valNum) || valNum <= 0) {
      setFormError("Discount value must be a positive number.");
      return;
    }

    setActionPending(true);

    try {
      // Convert value to correct units:
      // Percentage: value stays as integer (e.g. 20)
      // Fixed: value converted from Rupees to paise (* 100)
      const finalVal = discountType === "percentage" ? Math.round(valNum) : Math.round(valNum * 100);
      const minAmount = minPurchaseInput ? Math.round(parseFloat(minPurchaseInput) * 100) : 0;

      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: codeInput.trim().toUpperCase(),
          discountType,
          discountValue: finalVal,
          minPurchaseAmount: minAmount,
        }),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        setFormError(result.error || "Failed to create coupon code.");
      } else {
        setFormSuccess(`Coupon code "${codeInput.trim().toUpperCase()}" created successfully!`);
        setCodeInput("");
        setValueInput("");
        setMinPurchaseInput("");
        mutate(); // Revalidate the coupon list
      }
    } catch (err) {
      console.error("Failed to create coupon:", err);
      setFormError("An unexpected error occurred.");
    } finally {
      setActionPending(false);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !currentStatus }),
      });
      if (res.ok) {
        mutate(); // Revalidate
      }
    } catch (error) {
      console.error("Failed to toggle coupon status:", error);
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon code?")) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        mutate(); // Revalidate
      }
    } catch (error) {
      console.error("Failed to delete coupon:", error);
    }
  };

  return (
    <div className="space-y-12" id="admin-coupons-root">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-border/60 pb-8">
        <h1 className="text-3xl font-extrabold tracking-tighter text-foreground">Coupons Manager</h1>
        <p className="text-sm text-muted-foreground font-medium">Create and manage promo codes and customer discounts.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Create Coupon Form */}
        <div className="lg:col-span-4">
          <Card className="border-border/50 bg-card/50 rounded-2xl sticky top-8">
            <CardHeader className="p-6 pb-2">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">New Coupon</CardTitle>
              <CardDescription className="text-xs">Issue a new promotion discount code.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-4">
              <form onSubmit={handleCreateCoupon} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Coupon Code</label>
                  <input
                    type="text"
                    placeholder="e.g. GROW20"
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-800 bg-black text-white text-sm focus:border-neutral-600 outline-none uppercase tracking-wider font-bold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Discount Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant={discountType === "percentage" ? "default" : "outline"}
                      onClick={() => setDiscountType("percentage")}
                      className="rounded-xl h-9 text-xs font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Percentage
                    </Button>
                    <Button
                      type="button"
                      variant={discountType === "fixed" ? "default" : "outline"}
                      onClick={() => setDiscountType("fixed")}
                      className="rounded-xl h-9 text-xs font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Fixed Amount
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    {discountType === "percentage" ? "Discount Value (%)" : "Discount Value (₹)"}
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder={discountType === "percentage" ? "e.g. 20" : "e.g. 500"}
                    value={valueInput}
                    onChange={(e) => setValueInput(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-800 bg-black text-white text-sm focus:border-neutral-600 outline-none font-bold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Minimum Order Subtotal (₹)</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="e.g. 1000 (optional)"
                    value={minPurchaseInput}
                    onChange={(e) => setMinPurchaseInput(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-800 bg-black text-white text-sm focus:border-neutral-600 outline-none font-bold"
                  />
                </div>

                {formError && (
                  <div className="flex items-center gap-2 text-xs text-destructive bg-destructive/10 border border-destructive/20 px-3 py-2 rounded-xl">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                {formSuccess && (
                  <div className="flex items-center gap-2 text-xs text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-xl">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>{formSuccess}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={actionPending}
                  className="w-full h-11 rounded-xl font-bold uppercase tracking-widest text-[10px] cursor-pointer"
                >
                  {actionPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  Create Coupon
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Coupons List */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground">Active Catalog</h2>
            <span className="text-[10px] font-mono text-muted-foreground">
              {isLoading ? "Syncing..." : `${data?.coupons?.length || 0} Coupons`}
            </span>
          </div>

          <Card className="border-border/50 bg-card/50 rounded-[2rem] overflow-hidden">
            {isLoading ? (
              <div className="py-20 text-center space-y-2">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground/30 mx-auto" />
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Loading Promo Codes</p>
              </div>
            ) : error ? (
              <div className="py-20 text-center space-y-2">
                <XCircle className="w-8 h-8 text-destructive/40 mx-auto" />
                <p className="text-xs font-bold text-destructive uppercase tracking-widest">Failed to load coupons</p>
              </div>
            ) : !data || data.coupons.length === 0 ? (
              <div className="py-20 text-center space-y-2">
                <Gift className="w-8 h-8 text-muted-foreground/30 mx-auto" />
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">No Coupon Codes Created</p>
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="border-border/40 hover:bg-transparent">
                    <TableHead className="px-8 h-12 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Code</TableHead>
                    <TableHead className="px-8 h-12 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Discount</TableHead>
                    <TableHead className="px-8 h-12 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Min. Cart</TableHead>
                    <TableHead className="px-8 h-12 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</TableHead>
                    <TableHead className="px-8 h-12 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.coupons.map((coupon: Coupon) => (
                    <TableRow key={coupon.id} className="border-border/40 hover:bg-muted/10 transition-colors">
                      <TableCell className="px-8 py-5">
                        <span className="text-sm font-black tracking-wider uppercase text-foreground">{coupon.code}</span>
                      </TableCell>
                      <TableCell className="px-8 py-5 font-bold text-sm">
                        {coupon.discountType === "percentage" ? (
                          <Badge variant="secondary" className="font-mono text-xs font-black">
                            {coupon.discountValue}% Off
                          </Badge>
                        ) : (
                          <span className="font-bold">₹{(coupon.discountValue / 100).toLocaleString("en-IN")} Off</span>
                        )}
                      </TableCell>
                      <TableCell className="px-8 py-5 font-bold text-sm text-muted-foreground tabular-nums">
                        {coupon.minPurchaseAmount > 0 
                          ? `₹${(coupon.minPurchaseAmount / 100).toLocaleString("en-IN")}` 
                          : "None"}
                      </TableCell>
                      <TableCell className="px-8 py-5">
                        <button
                          onClick={() => handleToggleActive(coupon.id, coupon.active)}
                          className="flex items-center gap-1 cursor-pointer select-none"
                        >
                          {coupon.active ? (
                            <Badge className="bg-emerald-500/10 text-emerald-500 border-0 text-[9px] uppercase font-black tracking-wider flex items-center gap-1 rounded-full px-2.5 h-5">
                              <CheckCircle2 className="w-3 h-3" />
                              Active
                            </Badge>
                          ) : (
                            <Badge className="bg-muted text-muted-foreground border-0 text-[9px] uppercase font-black tracking-wider flex items-center gap-1 rounded-full px-2.5 h-5">
                              <XCircle className="w-3 h-3" />
                              Inactive
                            </Badge>
                          )}
                        </button>
                      </TableCell>
                      <TableCell className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            onClick={() => handleToggleActive(coupon.id, coupon.active)}
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-full cursor-pointer"
                            title="Toggle Active Status"
                          >
                            <Power className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteCoupon(coupon.id)}
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full cursor-pointer"
                            title="Delete Coupon"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
