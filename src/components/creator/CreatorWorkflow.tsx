import { Upload, Sliders, Eye, CreditCard, CheckCircle2, ShieldCheck } from "lucide-react";

const STEPS = [
  {
    step: "01",
    icon: Upload,
    title: "Package Code",
    description: "Take your working repo, clean out hardcoded secrets, add a sample .env.example, and write a concise README.",
  },
  {
    step: "02",
    icon: Sliders,
    title: "Create Listing",
    description: "Fill in title, tech stack tags, preview screenshots or live demo link, and upload your ZIP package.",
  },
  {
    step: "03",
    icon: CreditCard,
    title: "Set Price",
    description: "Choose your pricing. Direct sales route 95% of the transaction straight to your creator balance.",
  },
  {
    step: "04",
    icon: Eye,
    title: "Get Discovered",
    description: "Your product is listed in Scriptly's curated marketplace, indexed by search engines, and discovered by builders.",
  },
  {
    step: "05",
    icon: CheckCircle2,
    title: "Auto Delivery",
    description: "When an engineer buys, Scriptly verifies the payment, issues secure download tokens, and routes payouts to your bank.",
  },
];

export default function CreatorWorkflow() {
  return (
    <section className="py-16 md:py-24 border-b border-border/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-black uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" /> Frictionless Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            From local repo to first sale in 5 steps
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            No complex publisher approval gates or 3-week verification delays. If your code works, you can start selling today.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-card/30 border border-border/40 flex flex-col justify-between space-y-3 hover:border-primary/40 transition-colors group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black font-mono text-primary px-2 py-0.5 rounded-md bg-primary/10">
                      {step.step}
                    </span>
                    <Icon className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>

                  <h3 className="font-black text-xs sm:text-sm text-foreground">
                    {step.title}
                  </h3>

                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
