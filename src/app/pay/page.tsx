import { Metadata } from "next";
import PaymentCard from "@/components/pay/PaymentCard";
import { CyberBackground } from "@/components/ui/CyberBackground";
import Link from "next/link";
import { ArrowLeft, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Complete Payment | ScriptlyStore Secure Checkout",
  description: "Secure, verified checkout powered by Razorpay and ScriptlyStore.",
};

interface SearchParamsProps {
  searchParams: Promise<{
    title?: string;
    name?: string;
    price?: string;
    prize?: string;
    redirect?: string;
    redirectUrl?: string;
    desc?: string;
    description?: string;
    currency?: string;
  }>;
}

export default async function DynamicPaymentPage({ searchParams }: SearchParamsProps) {
  const resolvedParams = await searchParams;
  const title = resolvedParams.title || resolvedParams.name;
  const rawPrice = resolvedParams.price || resolvedParams.prize;
  const redirectUrl = resolvedParams.redirectUrl || resolvedParams.redirect;
  const description = resolvedParams.description || resolvedParams.desc || null;
  const currency = resolvedParams.currency || "INR";

  const numPrice = rawPrice ? parseFloat(rawPrice) : 0;
  const priceInPaise = Math.round(numPrice * 100);

  const isValid = Boolean(title && numPrice > 0 && redirectUrl);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between relative overflow-hidden">
      <CyberBackground />

      {/* Minimal Header */}
      <header className="border-b border-border/40 bg-background/50 backdrop-blur-md relative z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-[#58CC02] flex items-center justify-center text-white font-black text-base shadow-[0_3px_0_#46A302]">
              S
            </div>
            <span className="font-black text-lg tracking-tight group-hover:text-[#58CC02] transition-colors">
              Scriptly<span className="text-[#58CC02]">Pay</span>
            </span>
          </Link>

          <Button asChild variant="ghost" size="sm" className="text-xs font-bold text-muted-foreground hover:text-foreground">
            <Link href="/">
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back to Store
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Checkout Area */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-8 relative z-10">
        {isValid ? (
          <PaymentCard
            title={title!}
            price={numPrice}
            priceInPaise={priceInPaise}
            currency={currency}
            description={description}
            redirectUrl={redirectUrl!}
          />
        ) : (
          <div className="w-full max-w-md mx-auto p-8 rounded-3xl bg-card/80 border border-border/60 backdrop-blur-xl shadow-xl text-center space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-black text-foreground">Incomplete Payment Parameters</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                To create an instant on-the-fly payment page, provide <code className="bg-muted px-1.5 py-0.5 rounded text-foreground">title</code>, <code className="bg-muted px-1.5 py-0.5 rounded text-foreground">price</code>, and <code className="bg-muted px-1.5 py-0.5 rounded text-foreground">redirect</code> in the URL.
              </p>
            </div>

            <div className="p-3 bg-muted/40 rounded-xl text-left font-mono text-[11px] text-muted-foreground break-all">
              /pay?title=Service&price=499&redirect=https://example.com
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <Button asChild className="w-full bg-[#1CB0F6] hover:bg-[#1CB0F6]/90 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-[0_3px_0_#1899D6]">
                <Link href="/docs/api/payment-links">
                  View Payment Link Documentation <Sparkles className="w-3.5 h-3.5 ml-1.5" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full rounded-xl text-xs font-bold">
                <Link href="/">Return to Marketplace</Link>
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-border/40 py-4 text-center text-xs text-muted-foreground relative z-10">
        <p>© {new Date().getFullYear()} ScriptlyStore. Encrypted 256-bit checkout infrastructure.</p>
      </footer>
    </div>
  );
}
