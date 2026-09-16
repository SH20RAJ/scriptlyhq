import Link from "next/link";
import { ArrowRight, Download, ShieldCheck, Code2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import HeroProductVisual from "@/components/home/HeroProductVisual";

interface HeroSectionProps {
  featuredProducts?: any[];
}

export default function HeroSection({ featuredProducts = [] }: HeroSectionProps) {
  const primaryProduct = featuredProducts[0];
  const floatingProducts = featuredProducts.slice(1, 3);

  return (
    <section className="relative overflow-hidden border-b border-border/50 bg-gradient-to-b from-secondary/25 via-background to-background py-16 sm:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Editorial Content Left Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-3 py-1 text-xs font-mono font-medium text-muted-foreground shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Developer Commerce Platform</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.08]">
                Build less. <br />
                <span className="text-muted-foreground">Ship more.</span>
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
                Production-ready code, SaaS boilerplates, automation scripts, and developer tools for founders who ship.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Button asChild size="lg" className="rounded-xl font-bold px-6">
                <Link href="/explore" className="flex items-center gap-2">
                  <span>Explore Products</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-xl font-bold px-6">
                <Link href="/creator">
                  <span>Sell on Scriptly</span>
                </Link>
              </Button>
            </div>

            {/* Micro-Trust Signals */}
            <div className="pt-6 border-t border-border/40 grid grid-cols-2 gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Download className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>Instant ZIP delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span>Commercial licensing</span>
              </div>
              <div className="flex items-center gap-2">
                <Code2 className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <span>Full source code</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>No recurring subscriptions</span>
              </div>
            </div>
          </div>

          {/* Living Marketplace Visual Right Column */}
          <div className="lg:col-span-6">
            <HeroProductVisual
              primaryProduct={primaryProduct}
              floatingProducts={floatingProducts}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
