"use client";

import { useState, useEffect } from "react";
import { loadRazorpayScript } from "@/lib/payments/razorpay-loader";
import { createLinkRazorpayOrderAction, verifyLinkPaymentAction } from "@/lib/actions/payment-links";
import { ShieldCheck, Lock, ExternalLink, CheckCircle2, ArrowRight, Loader2, CreditCard, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PaymentCardProps {
  title: string;
  price: number; // in INR or raw units
  priceInPaise: number;
  currency?: string;
  description?: string | null;
  redirectUrl: string;
  linkId?: string;
  slug?: string;
}

export default function PaymentCard({
  title,
  price,
  priceInPaise,
  currency = "INR",
  description,
  redirectUrl,
  linkId,
}: PaymentCardProps) {
  const [payerName, setPayerName] = useState("");
  const [payerEmail, setPayerEmail] = useState("");
  const [payerPhone, setPayerPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [redirectDestination, setRedirectDestination] = useState(redirectUrl);

  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency || "INR",
    maximumFractionDigits: 0,
  }).format(price);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSuccess && countdown > 0) {
      timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    } else if (isSuccess && countdown === 0) {
      window.location.href = redirectDestination;
    }
    return () => clearTimeout(timer);
  }, [isSuccess, countdown, redirectDestination]);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payerEmail || !payerEmail.includes("@")) {
      toast.error("Please enter a valid email address for your payment receipt.");
      return;
    }

    setIsLoading(true);
    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded || !window.Razorpay) {
        throw new Error("Unable to load secure Razorpay gateway. Please check your internet.");
      }

      // Create Razorpay Order on server
      const order = await createLinkRazorpayOrderAction({
        linkId,
        title,
        priceInPaise,
        currency,
        payerEmail,
        payerName,
        payerPhone,
      });

      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "ScriptlyStore",
        description: title.slice(0, 60),
        order_id: order.orderId,
        prefill: {
          name: payerName,
          email: payerEmail,
          contact: payerPhone,
        },
        theme: {
          color: "#58CC02", // Duolingo green
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
            toast.info("Payment was cancelled.");
          },
        },
        handler: async (response: any) => {
          try {
            toast.loading("Verifying payment...", { id: "verify" });
            const verifyRes = await verifyLinkPaymentAction({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              linkId,
              redirectUrl,
              amount: order.amount,
              payerEmail,
              payerName,
              payerPhone,
            });

            toast.dismiss("verify");

            if (verifyRes.success) {
              setRedirectDestination(verifyRes.redirectUrl);
              setIsSuccess(true);
              toast.success("Payment verified successfully!");
            } else {
              toast.error("Signature verification failed.");
              setIsLoading(false);
            }
          } catch (err: any) {
            toast.dismiss("verify");
            toast.error(err.message || "Payment verification failed.");
            setIsLoading(false);
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (errResponse: any) => {
        setIsLoading(false);
        toast.error(errResponse.error?.description || "Payment failed. Please try again.");
      });
      rzp.open();
    } catch (err: any) {
      toast.error(err.message || "Could not initiate payment.");
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-md mx-auto p-8 rounded-3xl bg-card/80 border border-emerald-500/30 backdrop-blur-xl shadow-2xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-500 animate-bounce">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Payment Successful
          </span>
          <h2 className="text-2xl font-black text-foreground">Thank You!</h2>
          <p className="text-sm text-muted-foreground">
            Your payment of <strong className="text-foreground">{formattedPrice}</strong> for <strong className="text-foreground">{title}</strong> was received.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-muted/40 border border-border/40 text-xs text-muted-foreground space-y-1">
          <p>Redirecting you to your destination in</p>
          <p className="text-2xl font-black text-emerald-500">{countdown}s</p>
        </div>

        <Button
          asChild
          className="w-full bg-[#58CC02] hover:bg-[#58CC02]/90 text-white font-black uppercase tracking-wider rounded-2xl py-6 shadow-[0_4px_0_#46A302] active:translate-y-1 active:shadow-none transition-all"
        >
          <a href={redirectDestination}>
            Continue to Destination Now <ArrowRight className="w-4 h-4 ml-2" />
          </a>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto rounded-3xl bg-card/90 border border-border/60 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden transition-all duration-300 hover:border-primary/30">
      {/* Header Banner */}
      <div className="p-6 border-b border-border/40 bg-muted/20 space-y-3">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider">
            <CreditCard className="w-3 h-3" /> Secure Payment
          </span>
          <span className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground">
            <Lock className="w-3 h-3 text-emerald-500" /> 256-bit SSL
          </span>
        </div>

        <div>
          <h1 className="text-xl md:text-2xl font-black text-foreground tracking-tight line-clamp-2">
            {title}
          </h1>
          {description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-3 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        <div className="pt-2 flex items-baseline justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Amount</span>
          <span className="text-3xl font-black text-foreground tracking-tight">
            {formattedPrice}
          </span>
        </div>
      </div>

      {/* Form Area */}
      <form onSubmit={handlePay} className="p-6 space-y-4">
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">
              Your Email Address <span className="text-rose-500">*</span>
            </label>
            <Input
              type="email"
              required
              value={payerEmail}
              onChange={(e) => setPayerEmail(e.target.value)}
              placeholder="alex@developer.com"
              className="rounded-xl bg-background/80 border-border/60 focus:border-primary text-sm h-11"
            />
            <p className="text-[10px] text-muted-foreground">Payment receipt & confirmation will be sent here.</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">
              Your Name <span className="text-muted-foreground/60 text-[9px]">(Optional)</span>
            </label>
            <Input
              type="text"
              value={payerName}
              onChange={(e) => setPayerName(e.target.value)}
              placeholder="Alex Doe"
              className="rounded-xl bg-background/80 border-border/60 focus:border-primary text-sm h-11"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">
              Phone Number <span className="text-muted-foreground/60 text-[9px]">(Optional)</span>
            </label>
            <Input
              type="tel"
              value={payerPhone}
              onChange={(e) => setPayerPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="rounded-xl bg-background/80 border-border/60 focus:border-primary text-sm h-11"
            />
          </div>
        </div>

        {/* Destination preview */}
        <div className="p-3 rounded-xl bg-muted/30 border border-border/40 text-[11px] text-muted-foreground flex items-center justify-between">
          <span className="truncate pr-2">
            Redirects after payment to: <strong className="text-foreground truncate">{new URL(redirectUrl).hostname}</strong>
          </span>
          <ExternalLink className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
        </div>

        {/* CTA Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#58CC02] hover:bg-[#58CC02]/90 text-white font-black text-sm uppercase tracking-wider rounded-2xl py-6 shadow-[0_4px_0_#46A302] active:translate-y-1 active:shadow-none transition-all duration-150 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Processing...
            </>
          ) : (
            <>
              Pay {formattedPrice} with Razorpay
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>

        {/* Trust Badges */}
        <div className="pt-2 flex items-center justify-center gap-4 text-[10px] text-muted-foreground font-semibold">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-500" /> Razorpay Verified
          </span>
          <span>•</span>
          <span>Instant Redirection</span>
          <span>•</span>
          <span>Scriptly Secured</span>
        </div>
      </form>
    </div>
  );
}
