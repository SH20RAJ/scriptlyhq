import { Upload, Sliders, Eye, CreditCard, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";

const STEPS = [
  {
    step: "01",
    icon: Upload,
    title: "Package Your Code",
    description: "Take your existing repository, clean out hardcoded secrets, add a sample .env.example, and write a 3-minute setup README.",
  },
  {
    step: "02",
    icon: Sliders,
    title: "Create Product Listing",
    description: "Fill in your product title, tech stack tags, preview screenshots or live demo URL, and upload your ZIP package.",
  },
  {
    step: "03",
    icon: CreditCard,
    title: "Set Price & Licensing",
    description: "Choose your pricing in INR or USD. Direct sales deliver 95% of the transaction straight to your creator balance.",
  },
  {
    step: "04",
    icon: Eye,
    title: "Get Discovered",
    description: "Your product is listed in Scriptly's curated marketplace, indexed by search engines, and featured in developer collections.",
  },
  {
    step: "05",
    icon: CheckCircle2,
    title: "Automated Fulfillment",
    description: "When an engineer buys, Scriptly verifies the payment, issues a secure download token, and routes your earnings directly to your bank.",
  },
];

export default function CreatorWorkflow() {
  return (
    <section className="py-16 md:py-24 border-b border-border/40 bg-muted/10">
      <div className="max-w-6xl mx-auto px-4 space-y-12">
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

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-card/60 border border-border/50 flex flex-col justify-between space-y-4 relative group hover:border-primary/40 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black font-mono text-primary px-2 py-0.5 rounded-md bg-primary/10">
                      {step.step}
                    </span>
                    <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>

                  <h3 className="font-black text-sm text-foreground">
                    {step.title}
                  </h3>

                  <p className="text-xs text-muted-foreground leading-relaxed">
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
