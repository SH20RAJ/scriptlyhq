import { XCircle, CheckCircle2, Sparkles, FolderArchive } from "lucide-react";

export default function CreatorPackagingGuide() {
  return (
    <section className="py-16 md:py-24 border-b border-border/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> High-Value Packaging
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            The difference between code and a product
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Engineers don't just buy syntax—they buy time saved. Packaging your code cleanly turns a side-project into an asset that commands ₹2,500+.
          </p>
        </div>

        {/* Side-by-side comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {/* Left: Raw Code Dump */}
          <div className="p-5 sm:p-6 rounded-3xl bg-card/30 border border-border/40 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/30">
              <span className="font-bold text-xs sm:text-sm text-rose-500 flex items-center gap-1.5">
                <XCircle className="w-4 h-4" /> Raw Code Dump
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-500 font-bold">
                Low Conversions
              </span>
            </div>

            <ul className="space-y-2.5 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                <span>Default boilerplate README with generic create-next-app text.</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                <span>Hardcoded keys, secrets, or missing environment documentation.</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                <span>No live preview or video walkthrough showing it running.</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                <span>Tangled dependencies without a tested installation lockfile.</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                <span>Ambiguous license leaving buyers unsure of commercial use.</span>
              </li>
            </ul>
          </div>

          {/* Right: Commercial Product */}
          <div className="p-5 sm:p-6 rounded-3xl bg-card/40 border border-emerald-500/30 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-border/30">
              <span className="font-bold text-xs sm:text-sm text-emerald-500 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Commercial Developer Product
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-bold">
                High Ratings & Sales
              </span>
            </div>

            <ul className="space-y-2.5 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>Clear README with 3-minute quickstart and architecture overview.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>Clean <code className="bg-muted px-1 rounded text-foreground font-mono text-[10px]">.env.example</code> with descriptive placeholders.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>Working live demo link so buyers can experience the product first.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>Tested lockfile (<code className="bg-muted px-1 rounded text-foreground font-mono text-[10px]">bun.lockb</code>) that installs cleanly.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>Explicit commercial single-seat or team licensing.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* The 15-Minute Checklist */}
        <div className="max-w-4xl mx-auto p-4 sm:p-5 rounded-2xl bg-card/30 border border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <FolderArchive className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-foreground">Packaging Takes Less Than 20 Minutes</h4>
              <p className="text-[11px] text-muted-foreground">
                Zip your repo, exclude <code className="text-foreground">node_modules</code> and <code className="text-foreground">.next</code>, and you're ready to publish.
              </p>
            </div>
          </div>

          <div className="text-[11px] font-mono text-muted-foreground shrink-0 bg-muted/30 px-3 py-1.5 rounded-lg border border-border/30">
            zip -r product.zip . -x "node_modules/*" ".git/*" ".next/*"
          </div>
        </div>
      </div>
    </section>
  );
}
