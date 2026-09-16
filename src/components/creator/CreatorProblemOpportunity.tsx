import { Lock, Unlock, Zap, Repeat, TrendingUp, ShieldAlert, CheckCircle2 } from "lucide-react";

export default function CreatorProblemOpportunity() {
  return (
    <section className="py-16 md:py-24 border-b border-border/40 bg-muted/10">
      <div className="max-w-6xl mx-auto px-4 space-y-16">
        {/* The Problem */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 text-xs font-black uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5" /> The Lost Value
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground leading-tight">
              Your best code shouldn’t die in a private repository.
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Think about the code sitting in your GitHub right now: that battle-tested webhook handler, the automated scraper you spent 3 days debugging, that sleek admin dashboard, or that complete SaaS auth & billing boilerplate.
            </p>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              For you, it was just another weekend task. For another engineer under a tight deadline, <strong className="text-foreground">it's a 30-hour shortcut they will gladly pay for</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-card/60 border border-border/50 space-y-2">
              <span className="text-2xl">⏳</span>
              <h3 className="font-black text-sm text-foreground">Forgotten Repos</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Client deliverables and side projects get archived. The valuable architecture you built earns $0.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-card/60 border border-border/50 space-y-2">
              <span className="text-2xl">💸</span>
              <h3 className="font-black text-sm text-foreground">Predatory Marketplaces</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Legacy template sites take 50% to 70% commission, delay payouts for months, and control your customers.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-card/60 border border-border/50 space-y-2">
              <span className="text-2xl">🚧</span>
              <h3 className="font-black text-sm text-foreground">Fulfillment Headaches</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Setting up Stripe, file hosting, licenses, and invoice generation takes weeks away from actual coding.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-card/60 border border-border/50 space-y-2">
              <span className="text-2xl">🎯</span>
              <h3 className="font-black text-sm text-foreground">Zero Distribution</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Posting a Gumroad link on X to 40 followers leads to silence. You need a dedicated developer marketplace.
              </p>
            </div>
          </div>
        </div>

        {/* The Opportunity & Leverage */}
        <div className="p-8 sm:p-12 rounded-3xl bg-card/40 border border-border/60 backdrop-blur-xl space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-black uppercase tracking-wider">
              <Unlock className="w-3.5 h-3.5" /> Software Leverage
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Code once. Sell to hundreds of builders.
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Digital developer assets have the highest profit margins in commerce. No physical inventory, no shipping fees, and zero marginal cost per sale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-background/60 border border-border/50 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black">
                <Repeat className="w-5 h-5" />
              </div>
              <h4 className="font-black text-base text-foreground">Compounding Returns</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                A script you write once in May can continue generating sales in November. Software assets don't depreciate like consulting hours.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-background/60 border border-border/50 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-black">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h4 className="font-black text-base text-foreground">High Buyer Willingness</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Developers don't view your product as an expense—they view it as a 20-hour shortcut that pays for itself on day one.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-background/60 border border-border/50 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#1CB0F6]/10 text-[#1CB0F6] flex items-center justify-center font-black">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="font-black text-base text-foreground">Audience-Free Sales</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                You don't need 50,000 followers. Scriptly's marketplace, category discovery, and SEO bring active buyers directly to your product.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
