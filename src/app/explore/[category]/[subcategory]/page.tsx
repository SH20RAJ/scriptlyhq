export const dynamic = "force-dynamic";

import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductsAction, getCategoriesAction, getSubcategoriesAction } from "@/lib/actions/products";
import ProductCard from "@/components/marketplace/ProductCard";
import { ProductPagination } from "@/components/ProductPagination";
import { ChevronRight, Compass, Search, Terminal, Zap, Palette, Bot, BookOpen, LayoutGrid, X } from "lucide-react";
import { CyberBackground } from "@/components/ui/CyberBackground";

interface SubcategoryPageProps {
  params: Promise<{
    category: string;
    subcategory: string;
  }>;
  searchParams: Promise<{
    search?: string;
    page?: string;
    sort?: "newest" | "rating" | "price_asc" | "price_desc" | "featured_premium";
    price?: "all" | "free" | "paid";
  }>;
}

export async function generateMetadata({ params }: SubcategoryPageProps): Promise<Metadata> {
  const { category, subcategory } = await params;
  const [categories, subcategories] = await Promise.all([
    getCategoriesAction(),
    getSubcategoriesAction(),
  ]);

  const cat = categories.find((c) => c.slug === category);
  const sub = subcategories.find((s) => s.slug === subcategory);

  const title = `${sub ? sub.name : subcategory} (${cat ? cat.name : category}) | ScriptlyStore`;
  const description = `Discover verified ${sub ? sub.name : subcategory} digital assets under ${cat ? cat.name : category} on ScriptlyStore.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://scriptly.store/explore/${category}/${subcategory}`,
    },
    openGraph: {
      title,
      description,
      url: `https://scriptly.store/explore/${category}/${subcategory}`,
    },
  };
}

export default async function SubcategoryExplorePage({ params, searchParams }: SubcategoryPageProps) {
  const { category, subcategory } = await params;
  const resolvedParams = await searchParams;
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

  const activeSubcategory = allSubcategories.find(
    (s) => s.slug === subcategory && s.categoryId === activeCategory.id
  );
  if (!activeSubcategory) {
    notFound();
  }

  // Scalable SQL Query for this specific subcategory
  const { products: productsList, total, totalPages } = await getProductsAction({
    category: activeCategory.slug,
    subcategory: activeSubcategory.slug,
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
        <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/explore" className="hover:text-foreground transition-colors">
            Explore
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href={`/explore/${category}`} className="hover:text-foreground transition-colors">
            {activeCategory.name}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground font-semibold">{activeSubcategory.name}</span>
        </div>

        {/* Subcategory Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/40 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary font-black uppercase tracking-wider text-[11px]">
              <span>{activeCategory.name} Subcategory</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black tracking-tight text-foreground">
              {activeSubcategory.name}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
              Curated {activeSubcategory.name.toLowerCase()} assets and boilerplates ready for production deployment.
            </p>
          </div>

          <div className="text-xs text-muted-foreground font-mono self-start md:self-end">
            <strong className="text-foreground">{total}</strong> products available
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-card/30 border border-border/40 backdrop-blur-md">
          {/* Search within Subcategory */}
          <form method="GET" action={`/explore/${category}/${subcategory}`} className="relative flex-1 w-full max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              name="search"
              defaultValue={currentSearch}
              placeholder={`Search ${activeSubcategory.name}...`}
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
              href={`/explore/${category}/${subcategory}?${new URLSearchParams({
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
              href={`/explore/${category}/${subcategory}?${new URLSearchParams({
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
              href={`/explore/${category}/${subcategory}?${new URLSearchParams({
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

        {/* Product Grid */}
        {productsList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-3 border border-dashed border-border/60 rounded-3xl bg-card/20 p-8">
            <Compass className="w-10 h-10 text-muted-foreground/40" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">No scripts found in {activeSubcategory.name}</h3>
              <p className="text-xs text-muted-foreground max-w-sm">
                Try clearing your search filters or browse other sections in {activeCategory.name}.
              </p>
            </div>
            <Link
              href={`/explore/${category}`}
              className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-xl text-xs font-bold text-foreground transition-colors"
            >
              Back to {activeCategory.name}
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
