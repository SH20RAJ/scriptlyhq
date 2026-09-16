"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import ProductCard from "@/components/marketplace/ProductCard";
import { Button } from "@/components/ui/button";

interface ProductDiscoverySectionProps {
  products: any[];
  categories: any[];
}

const FILTER_TABS = [
  { slug: "all", label: "All Assets" },
  { slug: "saas-templates", label: "SaaS Boilerplates" },
  { slug: "landing-pages", label: "Landing Pages" },
  { slug: "templates", label: "UI Kits & Templates" },
  { slug: "scripts", label: "Developer Tools" },
  { slug: "ai-prompts", label: "AI & Prompts" },
  { slug: "free", label: "Free Tools" },
];

export default function ProductDiscoverySection({
  products,
  categories,
}: ProductDiscoverySectionProps) {
  const [activeTab, setActiveTab] = useState("all");

  const filteredProducts = products.filter((p) => {
    if (activeTab === "all") return true;
    if (activeTab === "free") return p.isFree || p.price === 0;
    return p.category === activeTab;
  });

  const displayedProducts = filteredProducts.slice(0, 8);

  return (
    <section className="py-16 sm:py-24 border-b border-border/50">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Curated Discovery</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
              Explore what you can ship
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-lg">
              Handpicked production codebases, automation scripts, and UI systems ready for commercial deployment.
            </p>
          </div>

          <Button asChild variant="outline" size="sm" className="rounded-xl font-bold self-start md:self-auto">
            <Link href="/explore" className="flex items-center gap-1.5">
              <span>View Full Catalog</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        {/* Compact Category Navigation Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {FILTER_TABS.map((tab) => {
            const isActive = activeTab === tab.slug;
            return (
              <button
                key={tab.slug}
                type="button"
                onClick={() => setActiveTab(tab.slug)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-foreground text-background shadow-xs"
                    : "bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary border border-border/40"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Products Grid */}
        {displayedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {displayedProducts.map((product) => {
              const catObj = categories.find((c) => c.slug === product.category);
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  categoryName={catObj?.name}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 border border-dashed border-border/60 rounded-3xl bg-card/30 space-y-3">
            <p className="text-sm font-semibold text-foreground">No assets found in this filter.</p>
            <p className="text-xs text-muted-foreground">
              Browse our complete catalog to find assets across all categories.
            </p>
            <Button asChild variant="outline" size="sm" className="rounded-xl">
              <Link href="/explore">Browse All Products</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
