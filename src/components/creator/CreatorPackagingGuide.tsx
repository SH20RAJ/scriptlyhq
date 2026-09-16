import { XCircle, CheckCircle2, FileCode, Sparkles, FolderArchive, ArrowRight } from "lucide-react";

export default function CreatorPackagingGuide() {
  return (
    <section className="py-16 md:py-24 border-b border-border/40 bg-muted/10">
      <div className="max-w-6xl mx-auto px-4 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> High-Value Packaging
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            The difference between raw code and a product
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Engineers don't just buy code—they buy hours saved. Packaging your repository correctly turns a side-project into an asset that commands ₹2,500+.
          </p>
        </div>

        {/* Side-by-side comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Left: Raw Code Dump */}
          <div className="p-6 rounded-3xl bg-card/40 border border-rose-500/30 backdrop-blur-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border/40">
              <span className="font-black text-sm text-rose-500 flex items-center gap-1.5">
                <XCircle className="w-4 h-4" /> Raw Code Dump
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-500 font-bold">
                Low Conversions
              </span>
            </div>

            <ul className="space-y-3 text-xs text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>Default README with placeholder create-next-app text.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>Hardcoded API keys, secrets, or missing environment documentation.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>No live preview, video walkthrough, or architecture explanation.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>Tangled dependencies without a tested installation sequence.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>Ambiguous licensing that leaves enterprise buyers hesitant.</span>
              </li>
            </ul>
          </div>

          {/* Right: Commercial Developer Product */}
          <div className="p-6 rounded-3xl bg-card/60 border border-emerald-500/40 backdrop-blur-xl space-y-5 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between pb-3 border-b border-border/40">
              <span className="font-black text-sm text-emerald-500 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Commercial Developer Product
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-bold">
                High Ratings & Sales
              </span>
            </div>

            <ul className="space-y-3 text-xs text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Clean README with 3-step setup guide and architecture breakdown.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Documented <code className="bg-muted px-1 rounded text-foreground font-mono text-[11px]">.env.example</code> with clear descriptions for every variable.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Working live demo link so buyers can experience the product first.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Tested lockfile (<code className="bg-muted px-1 rounded text-foreground font-mono text-[11px]">bun.lockb</code> or <code className="bg-muted px-1 rounded text-foreground font-mono text-[11px]">pnpm-lock.yaml</code>) that installs cleanly.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Clear commercial single-seat or team license explicitly granting rights.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* The 15-Minute Checklist */}
        <div className="max-w-4xl mx-auto p-6 rounded-2xl bg-background/80 border border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <FolderArchive className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-black text-sm text-foreground">Packaging Takes Less Than 20 Minutes</h4>
              <p className="text-xs text-muted-foreground">
                Zip your repository directory, exclude <code className="text-foreground">node_modules</code> and <code className="text-foreground">.next</code>, and you're ready to list.
              </p>
            </div>
          </div>

          <div className="text-xs font-mono text-muted-foreground shrink-0 bg-muted/40 px-3 py-1.5 rounded-lg">
            zip -r product.zip . -x "node_modules/*" ".git/*" ".next/*"
          </div>
        </div>
      </div>
    </section>
  );
}
