export const dynamic = "force-dynamic";

import { Metadata } from "next";
import Link from "next/link";
import { getProductsAction, getCategoriesAction, getSubcategoriesAction } from "@/lib/actions/products";
import ProductCard from "@/components/marketplace/ProductCard";
import { ProductPagination } from "@/components/ProductPagination";
import { Compass, Terminal, Zap, Palette, Bot, BookOpen, LayoutGrid, Search, ArrowUpDown, Filter, X } from "lucide-react";
import { CyberBackground } from "@/components/ui/CyberBackground";

interface ExplorePageProps {
  searchParams: Promise<{
    category?: string;
    sub?: string;
    search?: string;
    q?: string;
    page?: string;
    sort?: "newest" | "rating" | "price_asc" | "price_desc" | "featured_premium";
    price?: "all" | "free" | "paid";
  }>;
}

export async function generateMetadata({ searchParams }: ExplorePageProps): Promise<Metadata> {
  const params = await searchParams;
  const cat = params.category && params.category !== "all" ? params.category : "All Categories";
  return {
    title: `Explore ${cat.replace(/-/g, " ")} | ScriptlyStore Marketplace`,
    description: "Discover developer-curated SaaS boilerplates, backend scripts, UI kits, and AI tools with automated digital delivery.",
    alternates: {
      canonical: "https://scriptly.store/explore",
    },
  };
}

const getCategoryIcon = (slug: string) => {
  switch (slug) {
    case "scripts":
      return <Terminal className="w-4 h-4 text-[#1CB0F6]" />;
    case "saas-templates":
      return <Zap className="w-4 h-4 text-[#58CC02]" />;
    case "design-assets":
      return <Palette className="w-4 h-4 text-[#CE82FF]" />;
    case "ai-prompts":
      return <Bot className="w-4 h-4 text-[#FFC800]" />;
    case "ebooks":
      return <BookOpen className="w-4 h-4 text-[#FF9600]" />;
    default:
      return <LayoutGrid className="w-4 h-4 text-primary" />;
  }
};

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const resolvedParams = await searchParams;
  const currentCategory = resolvedParams.category || "all";
  const currentSubcategory = resolvedParams.sub;
  const currentSearch = (resolvedParams.search || resolvedParams.q || "").trim();
  const currentPage = Math.max(1, parseInt(resolvedParams.page || "1", 10));
  const currentSort = resolvedParams.sort || "newest";
  const currentPrice = resolvedParams.price || "all";

  const [categories, subcategories] = await Promise.all([
    getCategoriesAction(),
    getSubcategoriesAction(),
  ]);

  // Execute scalable SQL query
  const { products: productsList, total, totalPages } = await getProductsAction({
    category: currentCategory === "all" ? undefined : currentCategory,
    subcategory: currentSubcategory,
    search: currentSearch || undefined,
    page: currentPage,
    limit: 24,
    sortBy: currentSort,
    priceType: currentPrice,
  });

  const activeCategoryObj = categories.find((c) => c.slug === currentCategory);
  const relevantSubcategories = activeCategoryObj
    ? subcategories.filter((s) => s.categoryId === activeCategoryObj.id)
    : [];

  return (
    <div className="flex flex-col min-h-screen text-foreground relative bg-background">
      <CyberBackground />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-16 space-y-10 relative z-10">
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/40 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary font-black uppercase tracking-wider text-[11px]">
              <Compass className="w-4 h-4 text-primary" />
              <span>Explore Marketplace</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground">
              {activeCategoryObj ? activeCategoryObj.name : "All Digital Products"}
            </h1>
            <p className="text-sm text-muted-foreground font-medium max-w-2xl">
              Discover battle-tested boilerplates, automation scripts, and UI libraries. Filtered and verified for fast engineering pipelines.
            </p>
          </div>

          <div className="text-xs text-muted-foreground font-mono self-start md:self-end">
            Showing <strong className="text-foreground">{productsList.length}</strong> of <strong className="text-foreground">{total}</strong> items
          </div>
        </div>

        {/* Category Navigation Bar (Direct Links to Nested Hubs) */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <Link
              href="/explore"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border whitespace-nowrap ${
                currentCategory === "all"
                  ? "bg-foreground text-background border-foreground shadow-sm"
                  : "bg-card/40 border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/40"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>All Categories</span>
            </Link>

            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/explore/${cat.slug}`}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border whitespace-nowrap ${
                  currentCategory === cat.slug
                    ? "bg-foreground text-background border-foreground shadow-sm"
                    : "bg-card/40 border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/40"
                }`}
              >
                {getCategoryIcon(cat.slug)}
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>

          {/* Subcategory Pills if active category has subcategories */}
          {relevantSubcategories.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
              <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground mr-1">
                Subcategories:
              </span>
              <Link
                href={`/explore/${currentCategory}`}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                  !currentSubcategory
                    ? "bg-primary/15 text-primary border border-primary/30"
                    : "text-muted-foreground hover:bg-muted/30"
                }`}
              >
                All
              </Link>
              {relevantSubcategories.map((sub) => (
                <Link
                  key={sub.id}
                  href={`/explore/${currentCategory}/${sub.slug}`}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors whitespace-nowrap ${
                    currentSubcategory === sub.slug
                      ? "bg-primary/15 text-primary border border-primary/30"
                      : "text-muted-foreground hover:bg-muted/30"
                  }`}
                >
                  {sub.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Filter & Search Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-card/30 border border-border/40 backdrop-blur-md">
          {/* Search form */}
          <form method="GET" action="/explore" className="relative flex-1 w-full max-w-md">
            {currentCategory !== "all" && (
              <input type="hidden" name="category" value={currentCategory} />
            )}
            {currentSubcategory && (
              <input type="hidden" name="sub" value={currentSubcategory} />
            )}
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              name="search"
              defaultValue={currentSearch}
              placeholder="Search scripts, boilerplates, keywords..."
              className="w-full pl-10 pr-20 py-2 rounded-xl border border-border/60 bg-background/60 text-foreground placeholder:text-muted-foreground text-xs focus:outline-none focus:border-primary/50 font-medium"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-wider rounded-lg hover:brightness-105 transition-all"
            >
              Search
            </button>
          </form>

          {/* Quick Filters: Price & Sort */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <div className="flex items-center gap-1.5 text-xs">
              <Link
                href={`/explore?${new URLSearchParams({
                  ...(currentCategory !== "all" ? { category: currentCategory } : {}),
                  ...(currentSubcategory ? { sub: currentSubcategory } : {}),
                  ...(currentSearch ? { search: currentSearch } : {}),
                  sort: currentSort,
                  price: "all",
                }).toString()}`}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  currentPrice === "all" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                All
              </Link>
              <Link
                href={`/explore?${new URLSearchParams({
                  ...(currentCategory !== "all" ? { category: currentCategory } : {}),
                  ...(currentSubcategory ? { sub: currentSubcategory } : {}),
                  ...(currentSearch ? { search: currentSearch } : {}),
                  sort: currentSort,
                  price: "free",
                }).toString()}`}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  currentPrice === "free" ? "bg-emerald-500/10 text-emerald-500" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Free
              </Link>
              <Link
                href={`/explore?${new URLSearchParams({
                  ...(currentCategory !== "all" ? { category: currentCategory } : {}),
                  ...(currentSubcategory ? { sub: currentSubcategory } : {}),
                  ...(currentSearch ? { search: currentSearch } : {}),
                  sort: currentSort,
                  price: "paid",
                }).toString()}`}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  currentPrice === "paid" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Paid
              </Link>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {(currentCategory !== "all" || currentSubcategory || currentSearch || currentPrice !== "all") && (
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-muted-foreground font-semibold text-[11px]">Filters:</span>
            {currentCategory !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-card/60 border border-border/50 text-foreground text-xs font-medium">
                Category: {activeCategoryObj?.name || currentCategory}
                <Link href="/explore" className="hover:text-rose-500">
                  <X className="w-3 h-3" />
                </Link>
              </span>
            )}
            {currentSubcategory && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-card/60 border border-border/50 text-foreground text-xs font-medium">
                Subcategory: {currentSubcategory}
                <Link href={`/explore/${currentCategory}`} className="hover:text-rose-500">
                  <X className="w-3 h-3" />
                </Link>
              </span>
            )}
            {currentSearch && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-card/60 border border-border/50 text-foreground text-xs font-medium">
                Keyword: "{currentSearch}"
                <Link href={`/explore?category=${currentCategory}`} className="hover:text-rose-500">
                  <X className="w-3 h-3" />
                </Link>
              </span>
            )}
            {currentPrice !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-card/60 border border-border/50 text-foreground text-xs font-medium">
                Price: {currentPrice}
                <Link href={`/explore?category=${currentCategory}`} className="hover:text-rose-500">
                  <X className="w-3 h-3" />
                </Link>
              </span>
            )}
            <Link
              href="/explore"
              className="text-[11px] font-bold text-primary hover:underline ml-2"
            >
              Reset All
            </Link>
          </div>
        )}

        {/* Products Grid */}
        {productsList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-3 border border-dashed border-border/60 rounded-3xl bg-card/20 p-8">
            <Compass className="w-10 h-10 text-muted-foreground/40" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">No products found</h3>
              <p className="text-xs text-muted-foreground max-w-sm">
                Try adjusting your search filters or browse other categories in the library.
              </p>
            </div>
            <Link
              href="/explore"
              className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-xl text-xs font-bold text-foreground transition-colors"
            >
              Clear All Filters
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {productsList.map((prod) => (
                <ProductCard
                  key={prod.id}
                  prod={prod}
                  categoryName={categories.find((c) => c.slug === prod.category)?.name || prod.category}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pt-6 border-t border-border/40">
                <ProductPagination totalPages={totalPages} currentPage={currentPage} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
