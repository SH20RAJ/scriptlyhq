import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicPaymentLinkAction } from "@/lib/actions/payment-links";
import PaymentCard from "@/components/pay/PaymentCard";
import { CyberBackground } from "@/components/ui/CyberBackground";
import Link from "next/link";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const link = await getPublicPaymentLinkAction(slug);

  if (!link) {
    return {
      title: "Payment Link Not Found | ScriptlyStore",
    };
  }

  return {
    title: `Pay for ${link.title} | ScriptlyStore Secure Checkout`,
    description: link.description || `Complete secure payment for ${link.title} powered by ScriptlyStore.`,
  };
}

export default async function StoredPaymentLinkPage({ params }: PageProps) {
  const { slug } = await params;
  const link = await getPublicPaymentLinkAction(slug);

  if (!link) {
    notFound();
  }

  if (!link.active) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col justify-center items-center p-4 relative overflow-hidden">
        <CyberBackground />
        <div className="w-full max-w-md p-8 rounded-3xl bg-card/80 border border-border/60 backdrop-blur-xl shadow-xl text-center space-y-4 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-black">Payment Link Inactive</h1>
          <p className="text-xs text-muted-foreground">
            This payment link is currently paused or inactive. Please contact the seller for an updated link.
          </p>
          <Button asChild className="rounded-xl font-bold text-xs">
            <Link href="/">Return to Marketplace</Link>
          </Button>
        </div>
      </div>
    );
  }

  const priceInINR = link.price / 100;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between relative overflow-hidden">
      <CyberBackground />

      {/* Header */}
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

      {/* Main Checkout Card */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-8 relative z-10">
        <PaymentCard
          title={link.title}
          price={priceInINR}
          priceInPaise={link.price}
          currency={link.currency}
          description={link.description}
          redirectUrl={link.redirectUrl}
          linkId={link.id}
          slug={link.slug}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-4 text-center text-xs text-muted-foreground relative z-10">
        <p>© {new Date().getFullYear()} ScriptlyStore. Verified 256-bit checkout infrastructure.</p>
      </footer>
    </div>
  );
}
