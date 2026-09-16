import Link from "next/link";
import { ArrowRight, Rocket, Terminal, Star, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface FeaturedCollectionsProps {
  featuredProducts: any[];
  freeProducts: any[];
}

export default function FeaturedCollections({
  featuredProducts = [],
  freeProducts = [],
}: FeaturedCollectionsProps) {
  const launchProducts = featuredProducts.slice(0, 3);
  const weekendProducts = freeProducts.slice(0, 3);

  return (
    <section className="py-16 sm:py-24 border-b border-border/50">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 space-y-12">
        <div className="max-w-2xl space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-primary">
            Curated Bundles & Workflows
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            Featured Collections
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Hand-picked asset bundles organized by production timeline and architecture scope.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Collection 1: Launch Faster */}
          <div className="flex flex-col justify-between rounded-3xl border border-border/60 bg-card/60 backdrop-blur-md p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                  <Rocket className="w-5 h-5" />
                </div>
                <Badge variant="outline" className="rounded-full text-[10px] font-bold uppercase px-3">
                  Production SaaS
                </Badge>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold tracking-tight text-foreground">
                  Launch Faster
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Full-stack boilerplates equipped with user authentication, billing webhooks, database migrations, and responsive dashboards.
                </p>
              </div>

              {/* Product preview list */}
              <div className="space-y-3 pt-2">
                {launchProducts.map((prod) => (
                  <Link
                    key={prod.id}
                    href={`/products/${prod.slug}`}
                    className="flex items-center justify-between p-3.5 rounded-2xl border border-border/40 bg-secondary/25 hover:bg-secondary/60 hover:border-border/70 transition-all text-xs group"
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-3">
                      <div className="w-10 h-10 rounded-xl bg-secondary/80 overflow-hidden shrink-0 border border-border/40">
                        {prod.thumbnail ? (
                          <img src={prod.thumbnail} alt="" className="w-full h-full object-cover" loading="lazy" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-mono text-[9px] text-muted-foreground">
                            APP
                          </div>
                        )}
                      </div>
                      <div className="truncate">
                        <p className="font-bold text-foreground truncate group-hover:text-primary transition-colors">
                          {prod.title}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate">{prod.category?.replace(/-/g, " ")}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-mono font-bold text-foreground">
                        ${(prod.price / 100).toFixed(2)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <Button asChild variant="outline" size="sm" className="w-full rounded-xl font-bold text-xs">
              <Link href="/featured" className="flex items-center justify-center gap-1.5">
                <span>View Full Collection</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>

          {/* Collection 2: Weekend Builds */}
          <div className="flex flex-col justify-between rounded-3xl border border-border/60 bg-card/60 backdrop-blur-md p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                  <Terminal className="w-5 h-5" />
                </div>
                <Badge variant="outline" className="rounded-full text-[10px] font-bold uppercase px-3 text-emerald-500 border-emerald-500/30">
                  Free Tools
                </Badge>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold tracking-tight text-foreground">
                  For Your Next Weekend Build
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Open source boilerplates, scraper scripts, starter templates, and micro-utilities ready to download with zero friction.
                </p>
              </div>

              {/* Product preview list */}
              <div className="space-y-3 pt-2">
                {weekendProducts.map((prod) => (
                  <Link
                    key={prod.id}
                    href={`/products/${prod.slug}`}
                    className="flex items-center justify-between p-3.5 rounded-2xl border border-border/40 bg-secondary/25 hover:bg-secondary/60 hover:border-border/70 transition-all text-xs group"
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-3">
                      <div className="w-10 h-10 rounded-xl bg-secondary/80 overflow-hidden shrink-0 border border-border/40">
                        {prod.thumbnail ? (
                          <img src={prod.thumbnail} alt="" className="w-full h-full object-cover" loading="lazy" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-mono text-[9px] text-muted-foreground">
                            FREE
                          </div>
                        )}
                      </div>
                      <div className="truncate">
                        <p className="font-bold text-foreground truncate group-hover:text-primary transition-colors">
                          {prod.title}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate">{prod.category?.replace(/-/g, " ")}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        FREE
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <Button asChild variant="outline" size="sm" className="w-full rounded-xl font-bold text-xs">
              <Link href="/free" className="flex items-center justify-center gap-1.5">
                <span>View Free Resources</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
