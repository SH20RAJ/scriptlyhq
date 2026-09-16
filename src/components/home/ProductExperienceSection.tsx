import { ShieldCheck, CheckCircle2, Download, ExternalLink, FileText, Layers, GitBranch } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ProductExperienceSection() {
  return (
    <section className="py-16 sm:py-24 border-b border-border/50">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 space-y-12">
        <div className="max-w-2xl space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-primary">
            Transparent Product Architecture
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            Know exactly what you're buying.
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Inspect the stack, versioning, screenshots, live demos, licenses, and architecture breakdown before spending a dollar.
          </p>
        </div>

        {/* Visual Inspection Mockup */}
        <div className="rounded-3xl border border-border/60 bg-card/75 backdrop-blur-md overflow-hidden shadow-xl shadow-black/5">
          {/* Top Mockup Toolbar */}
          <div className="flex items-center justify-between px-6 py-3.5 border-b border-border/50 bg-secondary/30 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <span className="ml-2 font-mono text-[11px] text-muted-foreground hidden sm:inline">
                scriptly.store/products/shipfast-pro-saas
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-mono">
              <span className="text-emerald-500">● LIVE DEMO VERIFIED</span>
              <span>•</span>
              <span>v1.2.0</span>
            </div>
          </div>

          <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Preview Pane */}
            <div className="lg:col-span-7 space-y-5">
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-border/50 bg-neutral-950">
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop"
                  alt="Product Architectural Inspection"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white border border-white/10">
                  Interactive Preview
                </div>
              </div>

              {/* Documentation & Specifications Teaser */}
              <div className="p-4 rounded-2xl border border-border/40 bg-secondary/20 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-foreground">
                  <FileText className="w-4 h-4 text-primary" />
                  <span>Comprehensive Setup Documentation Included</span>
                </div>
                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  Every asset arrives with step-by-step installation instructions, environment variable definitions (.env.example), database migrations, and deploy guides.
                </p>
              </div>
            </div>

            {/* Right Architectural Specifications Pane */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="rounded-full text-[10px] font-bold uppercase">
                    Full-Stack Boilerplate
                  </Badge>
                  <span className="text-xs font-mono text-muted-foreground">MIT / Commercial</span>
                </div>
                <h3 className="text-xl font-bold text-foreground tracking-tight">
                  ShipFast Pro — Ultimate Next.js SaaS Kit
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Production SaaS foundation featuring Stripe subscriptions, Supabase/Neon PostgreSQL migrations, transactional emails, and pre-built administrative dashboards.
                </p>
              </div>

              {/* Tech Stack Breakdown */}
              <div className="space-y-2.5 pt-3 border-t border-border/40">
                <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-primary" />
                  <span>Verified Technology Stack</span>
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {["Next.js 15", "React 19", "Tailwind CSS", "TypeScript", "Drizzle ORM", "Neon Postgres", "Stripe"].map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono bg-secondary/80 text-foreground border border-border/40"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Inclusions Checklist */}
              <div className="space-y-2 pt-3 border-t border-border/40 text-xs">
                <p className="font-bold text-foreground flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Purchase Inclusions</span>
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Instant uncompiled source repository ZIP</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Commercial single & multi-client project usage</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Lifetime access to updates in buyer dashboard</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
