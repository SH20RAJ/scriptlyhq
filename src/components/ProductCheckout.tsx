"use client";

import { useState, useTransition } from "react";
import { createRazorpayOrderAction, verifyPaymentAction } from "../lib/actions/orders";
import { CreditCard, Download, Loader2, ShoppingCart, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCart } from "./CartContext";

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
  const { addToCart, removeFromCart, isInCart } = useCart();

  const inCart = isInCart(product.id);

  if (hasPurchased) {
    return (
      <Button asChild className="w-full h-12 rounded-xl font-bold uppercase tracking-widest text-[11px]">
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
        const orderData = await createRazorpayOrderAction({ productId: product.id });

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
      addToCart(product);
    }
  };

  return (
    <div className="w-full space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleCheckout}
          disabled={isPending}
          className="flex-1 h-12 rounded-xl font-bold uppercase tracking-widest text-[11px] cursor-pointer"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <CreditCard className="w-4 h-4 mr-2" />
          )}
          <span>{userLoggedIn ? (isFree ? "Claim Free" : `Buy Now`) : "Sign in to Buy"}</span>
        </Button>

        <Button
          type="button"
          onClick={handleCartToggle}
          variant={inCart ? "destructive" : "secondary"}
          className="h-12 px-6 rounded-xl font-bold uppercase tracking-widest text-[11px] cursor-pointer"
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
