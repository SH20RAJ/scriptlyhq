import Link from "next/link";
import { ArrowRight, DollarSign, Zap, HardDrive, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CreatorSection() {
  const steps = [
    {
      num: "01",
      title: "Create Product",
      desc: "Define your asset title, categories, tags, and semantic version.",
    },
    {
      num: "02",
      title: "Upload Files",
      desc: "Upload source ZIP package, demo link, and high-res screenshots.",
    },
    {
      num: "03",
      title: "Set Pricing",
      desc: "Choose free or paid ($10 - $299) with built-in Razorpay processing.",
    },
    {
      num: "04",
      title: "Get Discovered",
      desc: "Your product is showcased to thousands of shipping founders & devs.",
    },
    {
      num: "05",
      title: "Get Paid",
      desc: "Keep 95% of direct sales with automated weekly creator payouts.",
    },
  ];

  return (
    <section className="py-16 sm:py-24 border-b border-border/50 bg-secondary/15">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 space-y-16">
        {/* Creator Hero Banner */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
          <div className="max-w-xl space-y-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <DollarSign className="w-3.5 h-3.5" />
              <span>Creator Economy</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[1.12]">
              You built it. <br />
              <span className="text-muted-foreground">Now sell it.</span>
            </h2>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Turn your internal codebases, boilerplates, automation scripts, and UI tools into recurring digital revenue. Keep 95% of all direct sales.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-3">
              <Button asChild size="lg" className="rounded-xl font-bold px-6">
                <Link href="/creator" className="flex items-center gap-2">
                  <span>Start Selling on Scriptly</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-xl font-bold px-6">
                <Link href="/trust">
                  <span>See How It Works</span>
                </Link>
              </Button>
            </div>
          </div>

          {/* Key Creator Economics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4 lg:w-80 shrink-0">
            <div className="p-5 rounded-3xl border border-border/60 bg-card/80 backdrop-blur-md space-y-1">
              <div className="text-3xl font-extrabold text-foreground font-mono">95%</div>
              <p className="text-xs font-bold text-foreground">Direct Sales Split</p>
              <p className="text-[11px] text-muted-foreground">Industry-low 5% platform fee on all direct storefront transactions.</p>
            </div>

            <div className="p-5 rounded-3xl border border-border/60 bg-card/80 backdrop-blur-md space-y-1">
              <div className="text-3xl font-extrabold text-foreground font-mono">$0</div>
              <p className="text-xs font-bold text-foreground">Monthly Hosting Fees</p>
              <p className="text-[11px] text-muted-foreground">Zero upfront listing fees or subscription overhead to distribute assets.</p>
            </div>

            <div className="p-5 rounded-3xl border border-border/60 bg-card/80 backdrop-blur-md space-y-1">
              <div className="text-3xl font-extrabold text-foreground font-mono">Instant</div>
              <p className="text-xs font-bold text-foreground">Digital Delivery</p>
              <p className="text-[11px] text-muted-foreground">Automated order fulfillment, receipts, and secure file downloads.</p>
            </div>
          </div>
        </div>

        {/* 5-Step Creator Workflow */}
        <div className="space-y-6 pt-6 border-t border-border/40">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Simple Creator Workflow
            </p>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              From local repository to customer checkout in 5 steps
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {steps.map((step) => (
              <div
                key={step.num}
                className="p-5 rounded-3xl border border-border/50 bg-card/50 backdrop-blur-md space-y-3"
              >
                <span className="font-mono text-xs font-extrabold text-primary px-2 py-0.5 rounded-lg bg-primary/10 inline-block">
                  {step.num}
                </span>
                <h4 className="font-bold text-sm text-foreground">
                  {step.title}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
