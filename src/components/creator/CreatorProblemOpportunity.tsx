import { Lock, Unlock, Zap, Repeat, TrendingUp, Sparkles } from "lucide-react";

export default function CreatorProblemOpportunity() {
  return (
    <section className="py-16 md:py-24 border-b border-border/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-16">
        {/* The Problem */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 text-xs font-black uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5" /> The Lost Value
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground leading-tight">
              Your best code shouldn’t die in a private repository.
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Think about the code sitting in your GitHub right now: that battle-tested webhook handler, the automated scraper you spent days debugging, or that complete SaaS starter kit.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              For you, it was just another project milestone. For another engineer on a deadline, <strong className="text-foreground">it's a 30-hour shortcut they will gladly pay for</strong>.
            </p>
          </div>

          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-card/30 border border-border/40 space-y-1.5">
              <span className="text-xl">⏳</span>
              <h3 className="font-bold text-xs text-foreground">Forgotten Repos</h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Client deliverables and side projects get archived. The architecture you built earns $0.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-card/30 border border-border/40 space-y-1.5">
              <span className="text-xl">💸</span>
              <h3 className="font-bold text-xs text-foreground">Predatory Marketplaces</h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Legacy template sites take 50% to 70% commission and delay your payouts for months.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-card/30 border border-border/40 space-y-1.5">
              <span className="text-xl">🚧</span>
              <h3 className="font-bold text-xs text-foreground">Fulfillment Friction</h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Setting up merchant accounts, file delivery, and licenses takes weeks away from building.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-card/30 border border-border/40 space-y-1.5">
              <span className="text-xl">🎯</span>
              <h3 className="font-bold text-xs text-foreground">Audience Barrier</h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Posting a checkout link to 50 followers leads to silence. You need developer marketplace distribution.
              </p>
            </div>
          </div>
        </div>

        {/* The Opportunity & Software Leverage */}
        <div className="p-6 sm:p-10 rounded-3xl bg-card/30 border border-border/40 backdrop-blur-xl space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-black uppercase tracking-wider">
              <Unlock className="w-3.5 h-3.5" /> Software Leverage
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Code once. Sell to hundreds of builders.
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Developer tools have the highest margins in commerce. Zero physical inventory, instant digital fulfillment, and zero marginal cost per sale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-background/50 border border-border/40 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black">
                <Repeat className="w-4 h-4" />
              </div>
              <h4 className="font-black text-sm text-foreground">Compounding Asset</h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                A script you write once in January generates passive software income indefinitely. Code assets do not expire like consulting hours.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-background/50 border border-border/40 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-black">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h4 className="font-black text-sm text-foreground">High Buyer Intent</h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Developers don't view your product as an expense—they view it as a 20-hour shortcut that pays for itself on day one.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-background/50 border border-border/40 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-[#1CB0F6]/10 text-[#1CB0F6] flex items-center justify-center font-black">
                <Zap className="w-4 h-4" />
              </div>
              <h4 className="font-black text-sm text-foreground">Audience-Free Reach</h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                You don't need a huge social following. Scriptly's marketplace search, categories, and SEO bring active buyers directly to your product.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
