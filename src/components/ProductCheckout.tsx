"use client";

import { useState, useTransition, useEffect } from "react";
import { createRazorpayOrderAction, verifyPaymentAction } from "@/lib/actions/orders";
import { loadRazorpayScript } from "@/lib/payments/razorpay-loader";
import { CreditCard, Download, Loader2, ShoppingCart, Trash, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/CartContext";
import { getProductEffectivePrice } from "@/lib/price-utils";

interface ProductCheckoutProps {
  product: {
    id: string;
    title: string;
    slug: string;
    price: number; // in paise
    category: string;
    thumbnail: string | null;
    isFree?: boolean;
    discountPercent?: number | null;
    promoStart?: Date | string | null;
    promoEnd?: Date | string | null;
  };
  hasPurchased: boolean;
  userLoggedIn: boolean;
  isFree?: boolean;
}

export default function ProductCheckout({
  product,
  hasPurchased,
  userLoggedIn,
  isFree = false,
}: ProductCheckoutProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [addOnEditCopy, setAddOnEditCopy] = useState(false);
  const [addOnSetupDeploy, setAddOnSetupDeploy] = useState(false);
  const [isAddonsExpanded, setIsAddonsExpanded] = useState(false);
  const { addToCart, removeFromCart, isInCart } = useCart();

  const [appliedReferral, setAppliedReferral] = useState<string | null>(null);

  useEffect(() => {
    const match = document.cookie.match(/(?:^|; )scriptly_referred_by=([^;]*)/);
    if (match && match[1]) {
      setAppliedReferral(decodeURIComponent(match[1]));
    }
  }, []);

  const inCart = isInCart(product.id);

  const editCopyPrice = Math.round(product.price / 3);
  const setupDeployPrice = Math.round(product.price / 3);

  const promo = getProductEffectivePrice(product);
  const baseEffectivePrice = isFree ? 0 : promo.effectivePrice;

  let referralDiscount = 0;
  if (appliedReferral && !isFree) {
    referralDiscount = Math.round(baseEffectivePrice * 0.05);
  }

  let totalDisplayPrice = baseEffectivePrice - referralDiscount;
  if (addOnEditCopy) totalDisplayPrice += editCopyPrice;
  if (addOnSetupDeploy) totalDisplayPrice += setupDeployPrice;

  if (hasPurchased) {
    return (
      <Button asChild className="w-full h-11 text-xs font-semibold">
        <a href={`/api/download/${product.id}`}>
          <Download className="w-4 h-4 mr-2" />
          <span>Download Purchased Files</span>
        </a>
      </Button>
    );
  }

  const handleCheckout = async () => {
    if (!userLoggedIn) {
      router.push(`/handler/sign-in?redirectTo=/products/${product.slug}`);
      return;
    }

    setError(null);
    startTransition(async () => {
      try {
        const orderData = await createRazorpayOrderAction({ 
          productId: product.id,
          addOnEditCopy,
          addOnSetupDeploy,
          referredByCode: appliedReferral || undefined,
        });

        if (!orderData.success) {
          setError("Failed to initialize checkout. Please try again.");
          return;
        }

        if (orderData.isFreeCheckout && orderData.redirectUrl) {
          router.push(orderData.redirectUrl);
          return;
        }

        // Lazy load Razorpay SDK dynamically
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded || typeof window.Razorpay === "undefined") {
          setError("Payment SDK failed to load. Please check your network connection.");
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
                router.push(`/purchase-success?orderId=${verifyResult.orderId}`);
              } else {
                setError("Payment signature verification failed. Please contact support.");
              }
            } catch (err: any) {
              console.error("Payment verification err:", err);
              setError("Payment verification failed. Please try again.");
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
          setError(response.error.description || "Payment was cancelled or failed.");
        });
        rzp.open();
      } catch (err: any) {
        console.error("Checkout initialization error:", err);
        setError(err.message || "An unexpected error occurred during checkout.");
      }
    });
  };

  const formatPrice = (amountPaise: number) => {
    const dollars = amountPaise / 100;
    return Number.isInteger(dollars) ? `$${dollars}` : `$${dollars.toFixed(2)}`;
  };

  const handleCartToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inCart) {
      removeFromCart(product.id);
    } else {
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        originalPrice: product.price,
        slug: product.slug,
        thumbnail: product.thumbnail,
        category: product.category,
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Optional Addons Dropdown */}
      <div className="rounded-2xl border border-border/50 bg-secondary/15 overflow-hidden transition-all duration-200">
        <button
          type="button"
          onClick={() => setIsAddonsExpanded(!isAddonsExpanded)}
          className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-secondary/25 transition-colors cursor-pointer"
        >
          <div>
            <p className="text-xs font-bold text-foreground">Optional Add-on Services</p>
            <p className="text-[10px] text-muted-foreground">
              {addOnEditCopy || addOnSetupDeploy ? "Services selected" : "Setup & customization available"}
            </p>
          </div>
          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isAddonsExpanded ? "rotate-180" : ""}`} />
        </button>

        {isAddonsExpanded && (
          <div className="p-3 pt-0 border-t border-border/40 space-y-2">
            <label className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-colors ${addOnEditCopy ? 'border-primary bg-primary/5' : 'border-border/60 hover:bg-secondary/30'}`}>
              <input 
                type="checkbox" 
                checked={addOnEditCopy} 
                onChange={(e) => setAddOnEditCopy(e.target.checked)} 
                className="mt-0.5 h-3.5 w-3.5 accent-primary rounded"
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline gap-2">
                  <span className="font-semibold text-foreground text-xs">Custom Copy &amp; Branding</span>
                  <span className="font-mono text-primary font-bold text-xs">+{formatPrice(editCopyPrice)}</span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">Customize default text, colors, and components for your brand.</p>
              </div>
            </label>

            <label className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-colors ${addOnSetupDeploy ? 'border-primary bg-primary/5' : 'border-border/60 hover:bg-secondary/30'}`}>
              <input 
                type="checkbox" 
                checked={addOnSetupDeploy} 
                onChange={(e) => setAddOnSetupDeploy(e.target.checked)} 
                className="mt-0.5 h-3.5 w-3.5 accent-primary rounded"
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline gap-2">
                  <span className="font-semibold text-foreground text-xs">Cloud Deployment &amp; Setup</span>
                  <span className="font-mono text-primary font-bold text-xs">+{formatPrice(setupDeployPrice)}</span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">Full production setup on Cloudflare, Vercel, or AWS.</p>
              </div>
            </label>
          </div>
        )}
      </div>

      {appliedReferral && !isFree && (
        <div className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Referral active: 5% discount applied at checkout.</span>
        </div>
      )}

      {/* Primary Action Buttons */}
      <div className="flex items-center gap-2.5">
        <Button
          onClick={handleCheckout}
          disabled={isPending}
          className="flex-1 h-12 text-xs font-black uppercase tracking-wider bg-[#58CC02] hover:bg-[#58CC02]/90 text-white rounded-2xl shadow-[0_3px_0_#46A302] active:translate-y-px active:shadow-none transition-all cursor-pointer"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <CreditCard className="w-4 h-4 mr-2" />
          )}
          <span>
            {userLoggedIn 
              ? (totalDisplayPrice === 0 ? "Download Free" : `Get Access — ${formatPrice(totalDisplayPrice)}`) 
              : "Sign In to Buy"
            }
          </span>
        </Button>

        <Button
          type="button"
          onClick={handleCartToggle}
          variant={inCart ? "secondary" : "outline"}
          className="h-12 px-4 text-xs font-bold rounded-2xl border-border/60 hover:bg-muted/40 cursor-pointer transition-colors shrink-0"
          aria-label={inCart ? "Remove from cart" : "Add to cart"}
        >
          {inCart ? (
            <>
              <Trash className="w-4 h-4 mr-1.5 text-destructive" />
              <span>In Cart</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4 mr-1.5" />
              <span>Cart</span>
            </>
          )}
        </Button>
      </div>

      {error && (
        <p className="text-xs text-destructive bg-destructive/10 border border-destructive/20 px-3 py-2 rounded-xl">
          {error}
        </p>
      )}
    </div>
  );
}
