"use client";

import { useState, useTransition } from "react";
import { createRazorpayOrderAction, verifyPaymentAction } from "../lib/actions/orders";
import { CreditCard, Download, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface ProductCheckoutProps {
  productId: string;
  productSlug: string;
  price: number; // in paise
  hasPurchased: boolean;
  userLoggedIn: boolean;
}

export default function ProductCheckout({
  productId,
  productSlug,
  price,
  hasPurchased,
  userLoggedIn,
}: ProductCheckoutProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (hasPurchased) {
    return (
      <a
        href={`/api/download/${productId}`}
        className="w-full inline-flex items-center justify-center space-x-2 px-6 py-3.5 bg-white hover:bg-neutral-200 active:scale-[0.98] text-black font-semibold rounded-lg transition-colors text-center"
      >
        <Download className="w-5 h-5" />
        <span>Download Files</span>
      </a>
    );
  }

  if (!userLoggedIn) {
    return (
      <button
        onClick={() => {
          router.push(`/handler/sign-in?redirectTo=/products/${productSlug}`);
        }}
        className="w-full inline-flex items-center justify-center space-x-2 px-6 py-3.5 bg-white hover:bg-neutral-200 active:scale-[0.98] text-black font-semibold rounded-lg transition-colors cursor-pointer"
      >
        <CreditCard className="w-5 h-5" />
        <span>Sign in to Buy</span>
      </button>
    );
  }

  const handleCheckout = async () => {
    setError(null);
    startTransition(async () => {
      try {
        const orderData = await createRazorpayOrderAction({ productId });

        if (!orderData.success) {
          setError("Failed to initialize order. Please try again.");
          return;
        }

        const options = {
          key: orderData.key,
          amount: orderData.amount,
          currency: "INR",
          name: "ScriptlyHQ",
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
            color: "#0a0a0a", // black
          },
        };

        // Check if window.Razorpay exists
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

  return (
    <div className="w-full space-y-3">
      <button
        onClick={handleCheckout}
        disabled={isPending}
        className="w-full inline-flex items-center justify-center space-x-2 px-6 py-3.5 bg-white hover:bg-neutral-200 active:scale-[0.98] disabled:scale-100 disabled:opacity-50 text-black font-semibold rounded-lg transition-colors cursor-pointer"
      >
        {isPending ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <CreditCard className="w-5 h-5" />
        )}
        <span>Buy Now (₹{(price / 100).toLocaleString("en-IN")})</span>
      </button>

      {error && (
        <p className="text-xs text-rose-400 bg-rose-500/5 border border-rose-500/10 px-3 py-2 rounded-lg text-center">
          {error}
        </p>
      )}
    </div>
  );
}
