"use client";

import { useCart } from "@/components/CartContext";
import { useState, useTransition, useEffect } from "react";
import useSWR from "swr";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createRazorpayOrderAction, verifyPaymentAction } from "@/lib/actions/orders";
import { loadRazorpayScript } from "@/lib/payments/razorpay-loader";
import { validateReferralCodeAction } from "@/lib/actions/affiliates";
import { Trash, CreditCard, ShoppingBag, Loader2, CheckCircle2, AlertCircle, Percent } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function CartClient() {
  const router = useRouter();
  const { cart, removeFromCart, clearCart, cartSubtotal, cartCount } = useCart();
  const [couponInput, setCouponInput] = useState("");
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [referralInput, setReferralInput] = useState("");
  const [appliedReferral, setAppliedReferral] = useState<string | null>(null);
  const [referralPending, setReferralPending] = useState(false);
  const [referralMessage, setReferralMessage] = useState<{ success: boolean; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const match = document.cookie.match(/(?:^|; )scriptly_referred_by=([^;]*)/);
    if (match && match[1]) {
      const decodedVal = decodeURIComponent(match[1]);
      setAppliedReferral(decodedVal);
      setReferralInput(decodedVal);
      setReferralMessage({ success: true, text: `Referral code "${decodedVal}" active! Extra 5% discount applied.` });
    }
  }, []);

  // Compute Automatic Offer: 20% off > $60.00 (6000 cents)
  const autoOfferDiscount = cartSubtotal >= 6000 ? Math.round(cartSubtotal * 0.20) : 0;
  const amountAfterAuto = cartSubtotal - autoOfferDiscount;

  // Validate coupon using SWR
  const swrKey = appliedCode 
    ? `/api/coupons/validate?code=${encodeURIComponent(appliedCode)}&amount=${amountAfterAuto}` 
    : null;

  const { data: couponData, error: swrError, isLoading: couponLoading } = useSWR<any>(
    swrKey,
    fetcher,
    { revalidateOnFocus: false, shouldRetryOnError: false }
  );

  let couponDiscount = 0;
  let couponError: string | null = null;
  let couponSuccess: string | null = null;

  if (appliedCode) {
    if (couponLoading) {
      // Still loading
    } else if (swrError || (couponData && !couponData.success)) {
      couponError = couponData?.message || "Invalid coupon code.";
    } else if (couponData && couponData.success) {
      couponSuccess = `Coupon "${couponData.coupon.code}" applied successfully!`;
      const val = couponData.coupon.discountValue;
      if (couponData.coupon.discountType === "percentage") {
        couponDiscount = Math.round(amountAfterAuto * (val / 100));
      } else {
        couponDiscount = Math.min(val, amountAfterAuto);
      }
    }
  }

  // Calculate Referral Discount (5% on remaining)
  const referralDiscount = appliedReferral 
    ? Math.round((amountAfterAuto - couponDiscount) * 0.05) 
    : 0;

  const finalTotal = Math.max(amountAfterAuto - couponDiscount - referralDiscount, 100); // min $1.00 for Razorpay
  const totalSavings = autoOfferDiscount + couponDiscount + referralDiscount;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError(null);
    if (couponInput.trim()) {
      setAppliedCode(couponInput.trim().toUpperCase());
    } else {
      setAppliedCode(null);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCode(null);
    setCouponInput("");
  };

  const handleApplyReferral = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!referralInput.trim()) return;

    setReferralPending(true);
    setReferralMessage(null);
    setCheckoutError(null);

    try {
      const res = await validateReferralCodeAction(referralInput.trim());
      if (res.success && res.referrerSlug) {
        const code = res.referrerSlug;
        setAppliedReferral(code);
        setReferralMessage({ success: true, text: `Referral code "${code}" applied! 5% discount added.` });
        document.cookie = `scriptly_referred_by=${encodeURIComponent(code)}; max-age=${30 * 24 * 60 * 60}; path=/; SameSite=Lax`;
      } else {
        setReferralMessage({ success: false, text: res.message || "Invalid referral code." });
      }
    } catch {
      setReferralMessage({ success: false, text: "Failed to validate referral code." });
    } finally {
      setReferralPending(false);
    }
  };

  const handleRemoveReferral = () => {
    setAppliedReferral(null);
    setReferralInput("");
    setReferralMessage(null);
    document.cookie = "scriptly_referred_by=; max-age=0; path=/;";
  };

  const handleCheckout = async () => {
    setCheckoutError(null);
    startTransition(async () => {
      try {
        const productIds = cart.map((i) => i.id);
        const orderData = await createRazorpayOrderAction({
          productIds,
          couponCode: couponSuccess ? appliedCode || undefined : undefined,
          referredByCode: appliedReferral || undefined,
        });

        if (!orderData.success) {
          setCheckoutError("Failed to initialize order. Please try again.");
          return;
        }

        // Dynamically load Razorpay SDK
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded || typeof window.Razorpay === "undefined") {
          setCheckoutError("Payment SDK failed to load. Please check your network connection.");
          return;
        }

        const options = {
          key: orderData.key,
          amount: orderData.amount,
          currency: "INR",
          name: "ScriptlyStore",
          description: orderData.productName,
          order_id: orderData.razorpayOrderId,
          handler: async function (response: any) {
            try {
              const verifyResult = await verifyPaymentAction({
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              });

              if (verifyResult.success) {
                clearCart();
                router.push(`/purchase-success?orderId=${verifyResult.orderId}`);
              } else {
                setCheckoutError("Payment signature verification failed. Please contact support.");
              }
            } catch (err: any) {
              console.error("Payment verification err:", err);
              setCheckoutError("Payment verification failed. Please try again.");
            }
          },
          prefill: {
            name: orderData.userName,
            email: orderData.userEmail,
          },
          theme: {
            color: "#0F172A",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (response: any) {
          setCheckoutError(response.error.description || "Payment was cancelled or failed.");
        });
        rzp.open();
      } catch (err: any) {
        console.error("Cart checkout error:", err);
        setCheckoutError(err.message || "An unexpected error occurred during checkout.");
      }
    });
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (cartCount === 0) {
    return (
      <div className="text-center py-20 space-y-5 max-w-md mx-auto">
        <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto text-muted-foreground">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground">Your cart is empty</h2>
        <p className="text-muted-foreground text-xs leading-relaxed">
          Explore our marketplace collection of developer templates, automation scripts, and digital tools.
        </p>
        <Button asChild size="default">
          <Link href="/explore">Browse Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      {/* Cart Items List */}
      <div className="lg:col-span-7 space-y-4">
        {cart.map((item) => (
          <div key={item.id} className="rounded-lg border border-border/80 bg-card p-4 sm:p-5 flex gap-4 items-center justify-between">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-16 h-16 bg-secondary rounded-md overflow-hidden flex-shrink-0 relative border border-border/60">
                {item.thumbnail ? (
                  <img src={item.thumbnail} alt={item.title} loading="lazy" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[9px] font-mono text-muted-foreground">
                    {item.category}
                  </div>
                )}
              </div>

              <div className="min-w-0 space-y-1">
                <span className="text-[10px] font-mono uppercase text-muted-foreground">
                  {item.category}
                </span>
                <h3 className="font-medium text-sm text-foreground truncate">
                  <Link href={`/products/${item.slug}`} className="hover:underline">
                    {item.title}
                  </Link>
                </h3>
                <div className="text-xs font-semibold text-foreground font-mono flex items-baseline gap-2">
                  <span>${(item.price / 100).toFixed(2)}</span>
                  {item.originalPrice && item.originalPrice > item.price && (
                    <span className="text-[11px] text-muted-foreground line-through">
                      ${(item.originalPrice / 100).toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <Button
              onClick={() => removeFromCart(item.id)}
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
              aria-label="Remove item"
            >
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        ))}

        <div className="flex items-center justify-between pt-2">
          <Button asChild variant="link" className="text-muted-foreground hover:text-foreground text-xs p-0">
            <Link href="/explore">
              ← Continue browsing
            </Link>
          </Button>
          <Button
            onClick={clearCart}
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground hover:text-destructive"
          >
            Clear Cart
          </Button>
        </div>
      </div>

      {/* Pricing Summary Sidebar */}
      <div className="lg:col-span-5">
        <div className="bg-card border border-border/80 rounded-lg p-6 space-y-5 sticky top-20">
          <h3 className="text-sm font-semibold text-foreground border-b border-border/60 pb-3">
            Order Summary
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center text-muted-foreground">
              <span>Subtotal</span>
              <span className="text-foreground font-mono font-medium">${(cartSubtotal / 100).toFixed(2)}</span>
            </div>

            {autoOfferDiscount > 0 && (
              <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400">
                <span>Bulk Savings (20% Off)</span>
                <span className="font-mono">- ${(autoOfferDiscount / 100).toFixed(2)}</span>
              </div>
            )}

            {couponDiscount > 0 && (
              <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400">
                <span>Coupon Applied</span>
                <span className="font-mono">- ${(couponDiscount / 100).toFixed(2)}</span>
              </div>
            )}

            {referralDiscount > 0 && (
              <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400">
                <span>Referral Discount (5%)</span>
                <span className="font-mono">- ${(referralDiscount / 100).toFixed(2)}</span>
              </div>
            )}

            <div className="border-t border-border/60 pt-3 flex justify-between items-baseline">
              <span className="text-sm font-semibold text-foreground">Total</span>
              <div className="text-right">
                <span className="text-2xl font-semibold text-foreground font-mono">
                  ${(finalTotal / 100).toFixed(2)}
                </span>
                <span className="text-[10px] text-muted-foreground block font-mono">USD</span>
              </div>
            </div>

            {totalSavings > 0 && (
              <div className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-md text-center">
                Total savings: ${(totalSavings / 100).toFixed(2)}
              </div>
            )}
          </div>

          {/* Coupon Code Form */}
          <form onSubmit={handleApplyCoupon} className="space-y-2 pt-2 border-t border-border/50 text-xs">
            <label className="font-medium text-foreground block">Coupon Code</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="PROMO CODE"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                disabled={!!appliedCode}
                className="flex-1 px-3 py-1.5 rounded-md border border-border bg-background text-xs uppercase font-mono disabled:opacity-50"
              />
              {appliedCode ? (
                <Button type="button" onClick={handleRemoveCoupon} variant="outline" size="sm">
                  Remove
                </Button>
              ) : (
                <Button type="submit" variant="secondary" size="sm">
                  Apply
                </Button>
              )}
            </div>

            {couponError && (
              <p className="text-[11px] text-destructive">{couponError}</p>
            )}
            {couponSuccess && (
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400">{couponSuccess}</p>
            )}
          </form>

          {/* Referral Code Form */}
          <form onSubmit={handleApplyReferral} className="space-y-2 pt-2 border-t border-border/50 text-xs">
            <label className="font-medium text-foreground flex items-center gap-1">
              <Percent className="h-3 w-3 text-primary" />
              <span>Referral Code (5% Off)</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="AFFILIATE CODE"
                value={referralInput}
                onChange={(e) => setReferralInput(e.target.value)}
                disabled={!!appliedReferral || referralPending}
                className="flex-1 px-3 py-1.5 rounded-md border border-border bg-background text-xs uppercase font-mono disabled:opacity-50"
              />
              {appliedReferral ? (
                <Button type="button" onClick={handleRemoveReferral} variant="outline" size="sm">
                  Remove
                </Button>
              ) : (
                <Button type="submit" variant="secondary" size="sm" disabled={referralPending}>
                  {referralPending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Apply"}
                </Button>
              )}
            </div>

            {referralMessage && (
              <p className={`text-[11px] ${referralMessage.success ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive'}`}>
                {referralMessage.text}
              </p>
            )}
          </form>

          {/* Checkout CTA */}
          <div className="pt-2">
            <Button
              onClick={handleCheckout}
              disabled={isPending}
              className="w-full h-11 text-xs font-semibold"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <CreditCard className="w-4 h-4 mr-2" />
              )}
              <span>Pay ${(finalTotal / 100).toFixed(2)} USD</span>
            </Button>

            {checkoutError && (
              <p className="text-xs text-destructive bg-destructive/10 border border-destructive/20 px-3 py-2 rounded-md text-center mt-3">
                {checkoutError}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
