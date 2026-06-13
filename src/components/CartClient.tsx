"use client";

import { useCart } from "./CartContext";
import { useState, useTransition, useEffect } from "react";
import useSWR from "swr";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createRazorpayOrderAction, verifyPaymentAction } from "../lib/actions/orders";
import { Trash, CreditCard, ShoppingBag, Loader2, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function CartClient() {
  const router = useRouter();
  const { cart, removeFromCart, clearCart, cartSubtotal, cartCount } = useCart();
  const [couponInput, setCouponInput] = useState("");
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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

  const finalTotal = Math.max(amountAfterAuto - couponDiscount, 100); // min $1.00 for Razorpay
  const totalSavings = autoOfferDiscount + couponDiscount;

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

  const handleCheckout = async () => {
    setCheckoutError(null);
    startTransition(async () => {
      try {
        const productIds = cart.map((i) => i.id);
        const orderData = await createRazorpayOrderAction({
          productIds,
          couponCode: couponSuccess ? appliedCode || undefined : undefined,
        });

        if (!orderData.success) {
          setCheckoutError("Failed to initialize order. Please try again.");
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
            color: "#000000",
          },
        };

        if (typeof window.Razorpay === "undefined") {
          setCheckoutError("Razorpay SDK failed to load. Please refresh the page.");
          return;
        }

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (response: any) {
          setCheckoutError(response.error.description || "Payment failed.");
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
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (cartCount === 0) {
    return (
      <div className="text-center py-20 space-y-6 max-w-md mx-auto">
        <div className="w-16 h-16 bg-muted/40 rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-black tracking-tight text-foreground">Your Cart is Empty</h2>
        <p className="text-muted-foreground text-sm font-medium leading-relaxed">
          Explore our premium marketplace collection of SaaS boilerplates, ebooks, prompts, scripts, and UI kits to add them to your cart.
        </p>
        <Button asChild className="h-11 px-8 rounded-full font-bold uppercase tracking-widest text-[10px]">
          <Link href="/">Browse Catalog</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
      {/* Cart Items List */}
      <div className="lg:col-span-7 space-y-6">
        {cart.map((item) => (
          <Card key={item.id} className="border-border/50 bg-card/40 rounded-2xl overflow-hidden group">
            <CardContent className="p-4 sm:p-6 flex gap-6 items-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-muted rounded-xl overflow-hidden flex-shrink-0 relative border border-border/40">
                {item.thumbnail ? (
                  <Image src={item.thumbnail} alt={item.title} fill loading="lazy" className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[8px] font-black uppercase text-muted-foreground tracking-widest bg-muted/50">
                    {item.category}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <Badge variant="outline" className="text-[9px] uppercase font-black tracking-widest px-2 py-0 h-4 border-muted">
                  {item.category}
                </Badge>
                <h3 className="font-bold text-base sm:text-lg text-foreground line-clamp-1 leading-snug">
                  <Link href={`/products/${item.slug}`} className="hover:underline">
                    {item.title}
                  </Link>
                </h3>
                <div className="text-sm font-black text-foreground sm:hidden leading-none pt-1">
                  ${(item.price / 100).toFixed(2)}
                </div>
              </div>

              <div className="hidden sm:block text-right">
                <div className="text-base font-black text-foreground tabular-nums">
                  ${(item.price / 100).toFixed(2)}
                </div>
              </div>

              <div className="flex-shrink-0">
                <Button
                  onClick={() => removeFromCart(item.id)}
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full cursor-pointer"
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        <div className="flex items-center justify-between pt-4">
          <Button asChild variant="link" className="text-muted-foreground hover:text-foreground text-xs uppercase tracking-widest font-black p-0">
            <Link href="/">
              Browse more products
            </Link>
          </Button>
          <Button
            onClick={clearCart}
            variant="outline"
            className="rounded-xl h-9 px-4 text-xs font-bold uppercase tracking-wider border-border/60 hover:bg-destructive/10 hover:text-destructive hover:border-transparent transition-colors cursor-pointer"
          >
            Clear Cart
          </Button>
        </div>
      </div>

      {/* Pricing Summary Sidebar */}
      <div className="lg:col-span-5">
        <div className="bg-card/40 border border-border/50 rounded-3xl p-6 sm:p-8 space-y-6 sticky top-28 backdrop-blur-md">
          <h3 className="text-base font-black uppercase tracking-[0.2em] text-muted-foreground border-b border-border/40 pb-4">
            Order Summary
          </h3>

          {/* Calculations List */}
          <div className="space-y-4 text-sm font-medium">
            <div className="flex justify-between items-center text-muted-foreground">
              <span>Cart Subtotal</span>
              <span className="text-foreground font-black tabular-nums">${(cartSubtotal / 100).toFixed(2)}</span>
            </div>

            {/* Automatic Discount Display */}
            {autoOfferDiscount > 0 && (
              <div className="flex justify-between items-center text-emerald-500 font-bold">
                <span>Auto Offer (20% Off)</span>
                <span className="tabular-nums">- ${(autoOfferDiscount / 100).toFixed(2)}</span>
              </div>
            )}

            {/* Coupon Discount Display */}
            {couponDiscount > 0 && (
              <div className="flex justify-between items-center text-emerald-500 font-bold">
                <span>Coupon Discount</span>
                <span className="tabular-nums">- ${(couponDiscount / 100).toFixed(2)}</span>
              </div>
            )}

            <div className="border-t border-border/40 pt-4 flex justify-between items-baseline">
              <span className="text-base font-black text-foreground">Total</span>
              <div className="text-right">
                <span className="text-3xl font-black text-foreground tracking-tighter tabular-nums">
                  ${(finalTotal / 100).toFixed(2)}
                </span>
                <span className="text-[10px] font-bold text-muted-foreground block uppercase tracking-widest mt-0.5">USD</span>
              </div>
            </div>

            {totalSavings > 0 && (
              <div className="text-xs font-black text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-xl text-center">
                You are saving ${(totalSavings / 100).toFixed(2)} on this order!
              </div>
            )}
          </div>

          {/* Coupon Code Input Form */}
          <form onSubmit={handleApplyCoupon} className="space-y-3">
            <div className="text-xs font-black uppercase tracking-widest text-muted-foreground">Promo / Coupon Code</div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. GROW20"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                disabled={!!appliedCode}
                className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-800 bg-black text-white text-sm focus:border-neutral-600 outline-none uppercase tracking-wider font-bold disabled:opacity-50"
              />
              {appliedCode ? (
                <Button
                  type="button"
                  onClick={handleRemoveCoupon}
                  variant="outline"
                  className="h-10 px-4 rounded-xl border-border/60 font-bold uppercase tracking-wider text-[10px] cursor-pointer"
                >
                  Remove
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="secondary"
                  className="h-10 px-5 rounded-xl font-bold uppercase tracking-wider text-[10px] cursor-pointer"
                >
                  Apply
                </Button>
              )}
            </div>

            {/* SWR Loading Indicator */}
            {couponLoading && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Validating coupon code...</span>
              </div>
            )}

            {/* Live Coupon Message */}
            {couponError && (
              <div className="flex items-center gap-2 text-xs text-destructive bg-destructive/10 border border-destructive/20 px-3 py-2 rounded-xl">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{couponError}</span>
              </div>
            )}

            {couponSuccess && (
              <div className="flex items-center gap-2 text-xs text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-xl">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{couponSuccess}</span>
              </div>
            )}
          </form>

          {/* Checkout Button */}
          <div className="space-y-3 pt-2">
            <Button
              onClick={handleCheckout}
              disabled={isPending}
              className="w-full h-12 rounded-xl font-bold uppercase tracking-widest text-[11px] cursor-pointer shadow-lg shadow-primary/10"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <CreditCard className="w-4 h-4 mr-2" />
              )}
              <span>Pay ${(finalTotal / 100).toFixed(2)}</span>
            </Button>

            {checkoutError && (
              <p className="text-xs text-destructive bg-destructive/10 border border-destructive/20 px-3 py-2 rounded-xl text-center">
                {checkoutError}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
