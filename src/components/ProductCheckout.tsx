"use client";

import { useState, useTransition } from "react";
import { createRazorpayOrderAction, verifyPaymentAction } from "../lib/actions/orders";
import { CreditCard, Download, Loader2, ShoppingCart, Trash, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCart } from "./CartContext";

import { getProductEffectivePrice } from "../lib/price-utils";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface ProductCheckoutProps {
  product: {
    id: string;
    title: string;
    slug: string;
    price: number; // in paise
    category: string;
    thumbnail: string | null;
    isFree?: boolean;
    discountPercent?: number;
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

  const inCart = isInCart(product.id);

  const editCopyPrice = Math.round(product.price / 3);
  const setupDeployPrice = Math.round(product.price / 3);

  const promo = getProductEffectivePrice(product);
  const baseEffectivePrice = isFree ? 0 : promo.effectivePrice;

  let totalDisplayPrice = baseEffectivePrice;
  if (addOnEditCopy) totalDisplayPrice += editCopyPrice;
  if (addOnSetupDeploy) totalDisplayPrice += setupDeployPrice;

  if (hasPurchased) {
    return (
      <Button asChild className="w-full min-h-[48px] py-3 rounded-xl font-bold uppercase tracking-widest text-[11px]">
        <a href={`/api/download/${product.id}`}>
          <Download className="w-4 h-4 mr-2" />
          <span>Download Files</span>
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
        });

        if (!orderData.success) {
          setError("Failed to initialize order. Please try again.");
          return;
        }

        if (orderData.isFreeCheckout && orderData.redirectUrl) {
          router.push(orderData.redirectUrl);
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
            color: "#000000",
          },
        };

        if (typeof window.Razorpay === "undefined") {
          setError("Razorpay SDK failed to load. Please refresh the page.");
          return;
        }

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (response: any) {
          setError(response.error.description || "Payment failed.");
        });
        rzp.open();
      } catch (err: any) {
        console.error("Checkout initialization error:", err);
        setError(err.message || "An unexpected error occurred.");
      }
    });
  };

  const handleCartToggle = () => {
    if (inCart) {
      removeFromCart(product.id);
    } else {
      addToCart({
        id: product.id,
        title: product.title,
        slug: product.slug,
        price: promo.effectivePrice,
        originalPrice: product.price,
        category: product.category,
        thumbnail: product.thumbnail,
      });
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Accordion: Customize & Support Add-ons */}
      <div className="bg-card/60 border-2 border-border/80 rounded-2xl shadow-[0_4px_0_var(--border)] dark:shadow-[0_4px_0_#2A3842] overflow-hidden">
        <button
          type="button"
          onClick={() => setIsAddonsExpanded(!isAddonsExpanded)}
          className="w-full flex items-center justify-between p-4 cursor-pointer hover:bg-muted/10 transition-colors text-left"
        >
          <div className="space-y-0.5">
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground">
              Customize & Support Add-ons
            </span>
            <p className="text-[9px] font-bold text-primary uppercase tracking-wider">
              {addOnEditCopy || addOnSetupDeploy ? "✓ Add-ons Selected" : "+ Click to view options"}
            </p>
          </div>
          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${isAddonsExpanded ? "rotate-180" : ""}`} />
        </button>

        {isAddonsExpanded && (
          <div className="p-4 pt-0 border-t border-border/40 space-y-3 animate-in slide-in-from-top-2 duration-300">
            {/* Add-on 1: Copy Edit */}
            <label className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all duration-300 ${addOnEditCopy ? 'border-primary bg-primary/5 shadow-[0_3px_0_rgba(88,204,2,0.2)]' : 'border-border/60 hover:border-border hover:bg-muted/10'}`}>
              <input 
                type="checkbox" 
                checked={addOnEditCopy} 
                onChange={(e) => setAddOnEditCopy(e.target.checked)} 
                className="mt-1 w-4 h-4 accent-primary rounded cursor-pointer shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline gap-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-foreground">Edit Copy & Content</span>
                  <span className="text-[11px] font-black text-primary font-mono shrink-0">+${(editCopyPrice / 100).toFixed(2)}</span>
                </div>
                <p className="text-[9px] font-bold text-muted-foreground mt-1 leading-normal">Customize placeholder texts, branding copy, colors, and design components.</p>
              </div>
            </label>

            {/* Add-on 2: Setup/Deployment */}
            <label className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all duration-300 ${addOnSetupDeploy ? 'border-primary bg-primary/5 shadow-[0_3px_0_rgba(88,204,2,0.2)]' : 'border-border/60 hover:border-border hover:bg-muted/10'}`}>
              <input 
                type="checkbox" 
                checked={addOnSetupDeploy} 
                onChange={(e) => setAddOnSetupDeploy(e.target.checked)} 
                className="mt-1 w-4 h-4 accent-primary rounded cursor-pointer shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline gap-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-foreground">Setup & Deployment</span>
                  <span className="text-[11px] font-black text-primary font-mono shrink-0">+${(setupDeployPrice / 100).toFixed(2)}</span>
                </div>
                <p className="text-[9px] font-bold text-muted-foreground mt-1 leading-normal">Complete setup. We will deploy the codebase live on Cloudflare/Vercel for you.</p>
              </div>
            </label>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleCheckout}
          disabled={isPending}
          className="flex-1 min-h-[48px] px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-[11px] cursor-pointer bg-primary hover:bg-primary/95 text-white"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <CreditCard className="w-4 h-4 mr-2" />
          )}
          <span>
            {userLoggedIn 
              ? (totalDisplayPrice === 0 ? "Claim Free" : `Pay $${(totalDisplayPrice / 100).toFixed(2)}`) 
              : "Sign in to Buy"
            }
          </span>
        </Button>

        <Button
          type="button"
          onClick={handleCartToggle}
          variant={inCart ? "destructive" : "secondary"}
          className="min-h-[48px] px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-[11px] cursor-pointer"
        >
          {inCart ? (
            <>
              <Trash className="w-4 h-4 mr-2" />
              <span>Remove</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4 mr-2" />
              <span>Add to Cart</span>
            </>
          )}
        </Button>
      </div>

      {error && (
        <p className="text-xs text-destructive bg-destructive/10 border border-destructive/20 px-3 py-2 rounded-lg text-center">
          {error}
        </p>
      )}
    </div>
  );
}
