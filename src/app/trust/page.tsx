import { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { ShieldCheck, Lock, CheckCircle2, Download, CreditCard, Users, FileText, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Trust & Security Center | ScriptlyStore",
  description: "Verified infrastructure, security policies, digital delivery model, and honest commercial standards at ScriptlyStore.",
  alternates: {
    canonical: `${siteConfig.url}/trust`,
  },
};

export default function TrustPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-16 space-y-12">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded border border-border bg-secondary/50 px-2.5 py-1 text-xs font-mono text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          <span>Platform Verification</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
          Trust, Security & Operational Standards
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
          ScriptlyStore is designed for software developers and creators who demand technical rigor, financial transparency, and reliable digital delivery.
        </p>
      </div>

      {/* Trust Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Payment Security */}
        <div className="rounded-lg border border-border bg-card p-6 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-primary">
              <CreditCard className="h-4 w-4" />
            </div>
            <h2 className="text-sm font-semibold text-foreground">Payment Infrastructure</h2>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            All credit card, debit card, and UPI transactions are handled directly through Razorpay's PCI-DSS Level 1 compliant infrastructure with 256-bit SSL encryption. ScriptlyStore never touches or stores raw payment credentials.
          </p>
          <ul className="text-xs text-muted-foreground space-y-1.5 pt-2">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              <span>Idempotent webhook transaction verification</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              <span>Automated Route split disbursements</span>
            </li>
          </ul>
        </div>

        {/* Identity & Authentication */}
        <div className="rounded-lg border border-border bg-card p-6 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-primary">
              <Lock className="h-4 w-4" />
            </div>
            <h2 className="text-sm font-semibold text-foreground">Authentication & Access</h2>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            User authentication is managed via Hexclave identity services, offering passwordless login, encrypted session tokens, and strict server-side authorization boundaries on all protected assets.
          </p>
          <ul className="text-xs text-muted-foreground space-y-1.5 pt-2">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              <span>HTTP-only secure authentication cookies</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              <span>Zero client-side entitlement assumptions</span>
            </li>
          </ul>
        </div>

        {/* Digital Delivery */}
        <div className="rounded-lg border border-border bg-card p-6 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-primary">
              <Download className="h-4 w-4" />
            </div>
            <h2 className="text-sm font-semibold text-foreground">Digital Delivery Model</h2>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Product ZIP packages are delivered immediately upon order confirmation. Every download request is authenticated server-side against completed purchase records before granting asset access.
          </p>
          <ul className="text-xs text-muted-foreground space-y-1.5 pt-2">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              <span>Server-side entitlement validation</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              <span>Permanent redownload access in buyer dashboard</span>
            </li>
          </ul>
        </div>

        {/* Creator Economics */}
        <div className="rounded-lg border border-border bg-card p-6 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-primary">
              <Users className="h-4 w-4" />
            </div>
            <h2 className="text-sm font-semibold text-foreground">Transparent Economics</h2>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Direct sales grant creators 95% of proceeds (5% platform fee). When a verified affiliate refers a sale, the creator receives 65%, the affiliate earns 30%, and the platform retains 5%.
          </p>
          <ul className="text-xs text-muted-foreground space-y-1.5 pt-2">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              <span>No monthly subscription or listing fees</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              <span>Real-time earnings ledger & automated payouts</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Code Quality & Review Process */}
      <div className="rounded-lg border border-border bg-card p-6 sm:p-8 space-y-4">
        <h2 className="text-base font-semibold text-foreground">Product Review & Quality Policy</h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Before any script or template is published to the public catalog, products undergo an administrative moderation review checking for:
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <span>Valid package manifests and installable dependencies</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <span>Accurate documentation and setup instructions</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <span>Absence of obfuscated malicious binaries</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <span>Legitimate author ownership and licensing rights</span>
          </li>
        </ul>
      </div>

      {/* Reporting & Legal Policies */}
      <div className="rounded-lg border border-border/70 bg-secondary/20 p-6 space-y-4 text-xs">
        <div className="flex items-center gap-2 font-semibold text-foreground">
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
          <span>Abuse Reporting & Intellectual Property</span>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          ScriptlyStore respects intellectual property rights. If you suspect any product infringes your copyright or breaches licensing terms, submit an immediate takedown notification.
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/dmca">DMCA Takedown Process</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/refund">Refund Policy</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/licenses">Licensing Guidelines</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
