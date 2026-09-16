import Link from "next/link";
import { Star, ArrowRight, ShieldCheck, Zap, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface HeroProductVisualProps {
  primaryProduct?: any;
  floatingProducts?: any[];
}

export default function HeroProductVisual({
  primaryProduct,
  floatingProducts = [],
}: HeroProductVisualProps) {
  if (!primaryProduct) return null;

  const promoPrice = (primaryProduct.price / 100).toFixed(2);
  const tagsList = typeof primaryProduct.tags === "string"
    ? primaryProduct.tags.split(",").map((t: string) => t.trim()).filter(Boolean).slice(0, 3)
    : ["Next.js", "Tailwind CSS", "TypeScript"];

  return (
    <div className="relative w-full max-w-lg lg:max-w-none mx-auto">
      {/* Subtle Glow Effect */}
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-primary/15 via-transparent to-primary/5 blur-2xl pointer-events-none" />

      {/* Main Living Featured Product Card */}
      <div className="relative rounded-3xl border border-border/60 bg-card/85 backdrop-blur-md overflow-hidden shadow-xl shadow-black/5 hover:border-border transition-all duration-300 group">
        {/* Top Header Strip */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border/50 bg-secondary/20 text-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold uppercase tracking-wider text-[10px] text-muted-foreground">
              Featured Asset
            </span>
          </div>
          <Badge variant="outline" className="rounded-full text-[10px] font-bold capitalize px-2.5">
            {primaryProduct.category?.replace(/-/g, " ") || "Template"}
          </Badge>
        </div>

        {/* Product Visual Preview */}
        <Link href={`/products/${primaryProduct.slug}`} className="block relative aspect-[16/10] w-full overflow-hidden bg-secondary/30">
          {primaryProduct.thumbnail ? (
            <img
              src={primaryProduct.thumbnail}
              alt={primaryProduct.title}
              loading="eager"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-mono text-xs text-muted-foreground">
              {primaryProduct.title}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-5">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Inspect Source & Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </Link>

        {/* Card Body */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="space-y-1.5">
            <h3 className="text-base sm:text-lg font-bold text-foreground tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
              <Link href={`/products/${primaryProduct.slug}`}>
                {primaryProduct.title}
              </Link>
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {primaryProduct.shortDescription}
            </p>
          </div>

          {/* Tech Stack Badges */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {tagsList.map((tag: string) => (
              <span
                key={tag}
                className="rounded-full px-2.5 py-0.5 text-[10px] font-mono font-medium bg-secondary/70 text-foreground border border-border/40"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Pricing & Rating Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-border/40">
            <div className="flex items-center gap-3">
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-extrabold text-foreground font-mono">
                  ${promoPrice}
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">USD</span>
              </div>
              {primaryProduct.rating && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground border-l border-border/50 pl-3">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-foreground">{primaryProduct.rating}</span>
                </div>
              )}
            </div>

            <Link
              href={`/products/${primaryProduct.slug}`}
              className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
            >
              <span>View Product</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Auxiliary Product Cards */}
      {floatingProducts.length > 0 && (
        <div className="hidden sm:block absolute -bottom-6 -right-6 rounded-2xl border border-border/70 bg-card/95 backdrop-blur-md p-3.5 shadow-xl max-w-xs space-y-2 hover:-translate-y-1 transition-transform">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Sparkles className="w-3 h-3" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-foreground truncate">
                {floatingProducts[0].title}
              </p>
              <p className="text-[10px] text-muted-foreground font-mono">
                ${(floatingProducts[0].price / 100).toFixed(2)} USD · Instant Delivery
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Micro Trust Callout Badge */}
      <div className="hidden lg:flex items-center gap-2 absolute -top-4 -left-4 rounded-full border border-border/70 bg-card/95 backdrop-blur-md px-3.5 py-1.5 shadow-lg text-[11px] font-bold text-foreground">
        <ShieldCheck className="w-3.5 h-3.5 text-primary" />
        <span>Verified Production Code</span>
      </div>
    </div>
  );
}
