export const dynamic = "force-dynamic";

import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductsAction, getCategoriesAction, getSubcategoriesAction } from "@/lib/actions/products";
import ProductCard from "@/components/marketplace/ProductCard";
import { ProductPagination } from "@/components/ProductPagination";
import { ChevronRight, Compass, Search, Terminal, Zap, Palette, Bot, BookOpen, LayoutGrid, X } from "lucide-react";
import { CyberBackground } from "@/components/ui/CyberBackground";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
  searchParams: Promise<{
    sub?: string;
    search?: string;
    page?: string;
    sort?: "newest" | "rating" | "price_asc" | "price_desc" | "featured_premium";
    price?: "all" | "free" | "paid";
  }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const categories = await getCategoriesAction();
  const cat = categories.find((c) => c.slug === category);

  const title = cat ? `${cat.name} Library | ScriptlyStore` : "Explore Category | ScriptlyStore";
  const description = `Browse verified ${cat ? cat.name : category} templates, boilerplates, and developer scripts on ScriptlyStore.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://scriptly.store/explore/${category}`,
    },
    openGraph: {
      title,
      description,
      url: `https://scriptly.store/explore/${category}`,
    },
  };
}

const getCategoryIcon = (slug: string) => {
  switch (slug) {
    case "scripts":
      return <Terminal className="w-5 h-5 text-[#1CB0F6]" />;
    case "saas-templates":
      return <Zap className="w-5 h-5 text-[#58CC02]" />;
    case "design-assets":
      return <Palette className="w-5 h-5 text-[#CE82FF]" />;
    case "ai-prompts":
      return <Bot className="w-5 h-5 text-[#FFC800]" />;
    case "ebooks":
      return <BookOpen className="w-5 h-5 text-[#FF9600]" />;
    default:
      return <LayoutGrid className="w-5 h-5 text-primary" />;
  }
};

export default async function CategoryExplorePage({ params, searchParams }: CategoryPageProps) {
  const { category } = await params;
  const resolvedParams = await searchParams;
  const currentSubcategory = resolvedParams.sub;
  const currentSearch = (resolvedParams.search || "").trim();
  const currentPage = Math.max(1, parseInt(resolvedParams.page || "1", 10));
  const currentSort = resolvedParams.sort || "newest";
  const currentPrice = resolvedParams.price || "all";

  const [categories, allSubcategories] = await Promise.all([
    getCategoriesAction(),
    getSubcategoriesAction(),
  ]);

  const activeCategory = categories.find((c) => c.slug === category);
  if (!activeCategory) {
    notFound();
  }

  const subcategories = allSubcategories.filter((s) => s.categoryId === activeCategory.id);

  // Scalable SQL Query
  const { products: productsList, total, totalPages } = await getProductsAction({
    category: activeCategory.slug,
    subcategory: currentSubcategory,
    search: currentSearch || undefined,
    page: currentPage,
    limit: 24,
    sortBy: currentSort,
    priceType: currentPrice,
  });

  return (
    <div className="flex flex-col min-h-screen text-foreground relative bg-background">
      <CyberBackground />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-14 space-y-8 relative z-10">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/explore" className="hover:text-foreground transition-colors">
            Explore
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground font-semibold">{activeCategory.name}</span>
        </div>

        {/* Category Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/40 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-card/60 border border-border/50 flex items-center justify-center">
                {getCategoryIcon(activeCategory.slug)}
              </div>
              <h1 className="text-2xl md:text-4xl font-black tracking-tight text-foreground">
                {activeCategory.name}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
              Curated, production-tested {activeCategory.name.toLowerCase()} for software engineers and indie builders.
            </p>
          </div>

          <div className="text-xs text-muted-foreground font-mono self-start md:self-end">
            <strong className="text-foreground">{total}</strong> products available
          </div>
        </div>

        {/* Subcategory Pills */}
        {subcategories.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <Link
              href={`/explore/${category}`}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border whitespace-nowrap ${
                !currentSubcategory
                  ? "bg-foreground text-background border-foreground shadow-sm"
                  : "bg-card/40 border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/40"
              }`}
            >
              All {activeCategory.name}
            </Link>

            {subcategories.map((sub) => (
              <Link
                key={sub.id}
                href={`/explore/${category}/${sub.slug}`}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border whitespace-nowrap ${
                  currentSubcategory === sub.slug
                    ? "bg-foreground text-background border-foreground shadow-sm"
                    : "bg-card/40 border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/40"
                }`}
              >
                {sub.name}
              </Link>
            ))}
          </div>
        )}

        {/* Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-card/30 border border-border/40 backdrop-blur-md">
          {/* Search within Category */}
          <form method="GET" action={`/explore/${category}`} className="relative flex-1 w-full max-w-md">
            {currentSubcategory && (
              <input type="hidden" name="sub" value={currentSubcategory} />
            )}
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              name="search"
              defaultValue={currentSearch}
              placeholder={`Search in ${activeCategory.name}...`}
              className="w-full pl-10 pr-20 py-2 rounded-xl border border-border/60 bg-background/60 text-foreground placeholder:text-muted-foreground text-xs focus:outline-none focus:border-primary/50 font-medium"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-wider rounded-lg hover:brightness-105 transition-all"
            >
              Search
            </button>
          </form>

          {/* Price Filters */}
          <div className="flex items-center gap-1.5 text-xs self-end sm:self-center">
            <Link
              href={`/explore/${category}?${new URLSearchParams({
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
              href={`/explore/${category}?${new URLSearchParams({
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
              href={`/explore/${category}?${new URLSearchParams({
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

        {/* Active Filters Bar */}
        {(currentSubcategory || currentSearch || currentPrice !== "all") && (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-muted-foreground font-semibold text-[11px]">Filters:</span>
            {currentSubcategory && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-card/60 border border-border/50 text-foreground text-xs font-medium">
                Subcategory: {currentSubcategory}
                <Link href={`/explore/${category}`} className="hover:text-rose-500">
                  <X className="w-3 h-3" />
                </Link>
              </span>
            )}
            {currentSearch && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-card/60 border border-border/50 text-foreground text-xs font-medium">
                "{currentSearch}"
                <Link href={`/explore/${category}`} className="hover:text-rose-500">
                  <X className="w-3 h-3" />
                </Link>
              </span>
            )}
            {currentPrice !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-card/60 border border-border/50 text-foreground text-xs font-medium">
                Price: {currentPrice}
                <Link href={`/explore/${category}`} className="hover:text-rose-500">
                  <X className="w-3 h-3" />
                </Link>
              </span>
            )}
            <Link
              href={`/explore/${category}`}
              className="text-[11px] font-bold text-primary hover:underline ml-2"
            >
              Clear Filters
            </Link>
          </div>
        )}

        {/* Product Grid */}
        {productsList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-3 border border-dashed border-border/60 rounded-3xl bg-card/20 p-8">
            <Compass className="w-10 h-10 text-muted-foreground/40" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">No scripts found in {activeCategory.name}</h3>
              <p className="text-xs text-muted-foreground max-w-sm">
                Try clearing your search query or check back soon as creators add new items.
              </p>
            </div>
            <Link
              href={`/explore/${category}`}
              className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-xl text-xs font-bold text-foreground transition-colors"
            >
              Reset Filters
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {productsList.map((prod) => (
                <ProductCard
                  key={prod.id}
                  prod={prod}
                  categoryName={activeCategory.name}
                />
              ))}
            </div>

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
