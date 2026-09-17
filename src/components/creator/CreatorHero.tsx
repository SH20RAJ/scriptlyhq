import Link from "next/link";
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Terminal, Download, Star, DollarSign, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CreatorHero({
  isLoggedIn = false,
  userName,
}: {
  isLoggedIn?: boolean;
  userName?: string | null;
}) {
  return (
    <section className="relative pt-10 md:pt-16 pb-16 md:pb-24 border-b border-border/30 overflow-hidden">
      {/* Subtle ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-gradient-to-tr from-primary/15 via-[#1CB0F6]/10 to-transparent blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Logged in notification banner */}
        {isLoggedIn && (
          <div className="p-3.5 rounded-2xl bg-primary/10 border border-primary/20 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-foreground font-bold">
              <Sparkles className="w-4 h-4 text-primary shrink-0" />
              <span>
                Welcome back, <strong>{userName || "Creator"}</strong>! Your creator console is live.
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button asChild size="sm" className="h-7 px-3 rounded-xl bg-primary text-primary-foreground font-black text-xs uppercase tracking-wider">
                <Link href="/creator/dashboard">Dashboard</Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="h-7 px-3 rounded-xl text-xs font-bold border-border/60">
                <Link href="/creator/new">+ Submit Script</Link>
              </Button>
            </div>
          </div>
        )}

        {/* Hero Header */}
        <div className="max-w-3xl mx-auto text-center space-y-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> For Engineers & Independent Builders
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-foreground leading-[1.05]">
            You built it. <br />
            <span className="bg-gradient-to-r from-primary via-[#1CB0F6] to-emerald-500 bg-clip-text text-transparent">
              Now sell it.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto font-normal">
            Turn your boilerplates, automations, UI kits, and dev scripts into high-margin products other engineers pay for. Keep <strong className="text-foreground">95% of direct sales</strong> with $0 listing or monthly fees.
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto h-12 px-8 rounded-2xl bg-[#58CC02] hover:bg-[#58CC02]/90 text-white font-black text-xs uppercase tracking-wider shadow-[0_4px_0_#46A302] active:translate-y-1 active:shadow-none transition-all"
            >
              <Link href={isLoggedIn ? "/creator/new" : "/handler/sign-in?redirectTo=/creator/new"}>
                Start Selling — Free <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto h-12 px-6 rounded-2xl border-border/60 font-bold text-xs uppercase tracking-wider hover:bg-muted/30 text-foreground"
            >
              <a href="#calculator">
                Calculate Earnings <Zap className="w-3.5 h-3.5 ml-1.5 text-amber-500" />
              </a>
            </Button>
          </div>

          {/* Micro trust stats */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> 95% Creator Split
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> $0 Listing or Monthly Fees
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Automated Delivery
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> You Own 100% of IP
            </span>
          </div>
        </div>

        {/* Minimal Floating Storefront Preview Mockup */}
        <div className="max-w-4xl mx-auto rounded-3xl border border-border/50 bg-card/30 backdrop-blur-xl p-5 sm:p-7 shadow-lg space-y-5">
          {/* Mock Window Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-border/30">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
              <span className="ml-2 font-mono text-[11px] text-muted-foreground">
                scriptly.store/stores/alex-dev
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Verified Creator
            </span>
          </div>

          {/* Store Profile & KPI Row */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-5 flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-primary to-sky-500 flex items-center justify-center text-white font-black text-sm shrink-0 shadow-sm">
                AD
              </div>
              <div className="min-w-0">
                <h3 className="font-black text-sm text-foreground truncate">Alex Developer</h3>
                <p className="text-[11px] text-muted-foreground truncate">Full-Stack SaaS Builder</p>
              </div>
            </div>

            <div className="md:col-span-7 grid grid-cols-3 gap-2 sm:gap-3 text-left">
              <div className="p-3 rounded-2xl bg-muted/20 space-y-0.5">
                <span className="text-[9px] font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <DollarSign className="w-3 h-3 text-emerald-500" /> Total Sales
                </span>
                <p className="text-base sm:text-lg font-black text-foreground">₹1,48,500</p>
                <p className="text-[9px] text-emerald-500 font-bold">95% Split</p>
              </div>

              <div className="p-3 rounded-2xl bg-muted/20 space-y-0.5">
                <span className="text-[9px] font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Download className="w-3 h-3 text-[#1CB0F6]" /> Orders
                </span>
                <p className="text-base sm:text-lg font-black text-foreground">342</p>
                <p className="text-[9px] text-muted-foreground">18 countries</p>
              </div>

              <div className="p-3 rounded-2xl bg-muted/20 space-y-0.5">
                <span className="text-[9px] font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> Reviews
                </span>
                <p className="text-base sm:text-lg font-black text-foreground">4.9/5</p>
                <p className="text-[9px] text-muted-foreground">87 verified</p>
              </div>
            </div>
          </div>

          {/* Product Listing Card Mockup */}
          <div className="p-4 rounded-2xl bg-background/60 border border-border/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                <Terminal className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="font-black text-xs sm:text-sm text-foreground">
                    ShipFast SaaS Starter Kit
                  </h4>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-emerald-500/10 text-emerald-500">
                    Active
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground line-clamp-1">
                  Next.js 15, Neon Postgres, Razorpay Route Split, Auth, Tailwind v4
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/30">
              <div className="text-left sm:text-right">
                <p className="text-sm font-black text-foreground">₹2,499</p>
              </div>
              <Button
                disabled
                size="sm"
                className="h-8 px-3 bg-[#1CB0F6] text-white font-black text-[10px] uppercase tracking-wider rounded-xl shadow-[0_2px_0_#1899D6]"
              >
                Instant Download
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
