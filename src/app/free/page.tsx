export const dynamic = "force-dynamic";

import { getProductsAction, getCategoriesAction, getSubcategoriesAction } from "../../lib/actions/products";
import SearchFilter, { ProductCard } from "../../components/SearchFilter";
import { ProductPagination } from "../../components/ProductPagination";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, Cpu, HelpCircle, HeartHandshake, Layers, ChevronRight } from "lucide-react";

interface PageProps {
  searchParams: Promise<{
    category?: string;
    subcategory?: string;
    search?: string;
    sortBy?: "newest" | "rating" | "price_asc" | "price_desc";
    page?: string;
  }>;
}

export default async function FreeProductsPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const currentCategory = resolvedParams.category || "all";
  const currentSubcategory = resolvedParams.subcategory || "";
  const currentSearch = resolvedParams.search || "";
  const currentSortBy = resolvedParams.sortBy || "newest";
  const currentPage = parseInt(resolvedParams.page || "1");

  // Fetch only free products, categories, and subcategories
  const { products: productsList, totalPages } = await getProductsAction({
    category: currentCategory,
    subcategory: currentSubcategory,
    search: currentSearch,
    priceType: "free", // Force only free products
    sortBy: currentSortBy,
    page: currentPage,
    limit: 12,
  });

  const categoriesList = await getCategoriesAction();
  const subcategoriesList = await getSubcategoriesAction();

  const featuredProducts = productsList.filter((p) => p.featured);
  const regularProducts = productsList.filter((p) => !p.featured);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground relative overflow-hidden">
      
      {/* Mesh Background Lights */}
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-purple-500/5 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-[800px] left-[-300px] w-[600px] h-[600px] bg-emerald-500/5 blur-[160px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-[1800px] right-[-300px] w-[600px] h-[600px] bg-blue-500/5 blur-[160px] rounded-full pointer-events-none -z-10" />

      {/* Cyberpunk Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none -z-20" />

      {/* Main Content Area */}
      <div className="container max-w-7xl mx-auto px-4 py-8 space-y-12">
        
        {/* Typographic Hero Section */}
        <header className="py-12 text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground font-sans">
            🎁 Free <span className="text-purple-400 font-extrabold">Scripts & Boilerplates</span>
          </h1>
          <p className="text-sm md:text-base text-muted-foreground font-bold leading-relaxed">
            Accelerate your development cycle with 100% free open-source boilerplates, scraper scripts, waitlist extensions, and AI recipes. No checkout or credit card required.
          </p>
        </header>

        {/* Filter & Search Dashboard */}
        <div className="sticky top-[3.5rem] z-30 bg-background/80 backdrop-blur-sm py-5 border-b border-border">
          <SearchFilter categories={categoriesList} />
        </div>

        {/* Scalable Directory Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Sidebar Filters */}
          <aside className="lg:col-span-3 space-y-8 lg:sticky lg:top-[9rem] max-h-[calc(100vh-11rem)] overflow-y-auto scrollbar-none bg-card/10 p-6 border border-border/40 rounded-3xl">
            
            {/* Link back to Premium Marketplace */}
            <div className="pb-6 border-b border-border/40">
              <Link
                href="/"
                className="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-[#58CC02]/10 to-[#1CB0F6]/10 border-2 border-[#58CC02]/30 hover:border-[#58CC02]/60 rounded-2xl text-xs uppercase tracking-wider font-extrabold text-[#58CC02] hover:text-[#58CC02]/80 transition-all shadow-[0_3px_0_rgba(88,204,2,0.2)] active:translate-y-[3px] active:shadow-none"
              >
                <Sparkles className="w-4 h-4 text-[#58CC02] animate-pulse" />
                <span>💎 Premium Marketplace</span>
              </Link>
            </div>

            {/* Category Directory Tree */}
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-primary" />
                Categories
              </h3>
              <div className="flex flex-col gap-1 text-sm font-bold">
                <Link
                  href={{
                    pathname: "/free",
                    query: {
                      ...(currentSearch && { search: currentSearch }),
                    }
                  }}
                  className={`px-3 py-2 rounded-xl transition-all text-xs uppercase tracking-wide ${currentCategory === "all" ? "bg-primary/10 text-primary font-black" : "hover:bg-muted text-muted-foreground hover:text-foreground"}`}
                >
                  All Categories
                </Link>
                
                {categoriesList.map((cat) => {
                  const isCatActive = currentCategory === cat.slug;
                  const catSubs = subcategoriesList.filter(sub => sub.categoryId === cat.id);
                  
                  return (
                    <div key={cat.id} className="space-y-1">
                      <Link
                        href={{
                          pathname: "/free",
                          query: {
                            category: cat.slug,
                            ...(currentSearch && { search: currentSearch }),
                          }
                        }}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all text-xs uppercase tracking-wide ${isCatActive && !currentSubcategory ? "bg-primary/10 text-primary font-black" : "hover:bg-muted text-muted-foreground hover:text-foreground"}`}
                      >
                        <span>{cat.name}</span>
                        {catSubs.length > 0 && (
                          <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-200 ${isCatActive ? "rotate-90 text-primary" : "text-muted-foreground/60"}`} />
                        )}
                      </Link>
                      
                      {/* Subcategories list */}
                      {isCatActive && catSubs.length > 0 && (
                        <div className="pl-4 flex flex-col gap-1.5 border-l-2 border-border/80 ml-3 py-1">
                          {catSubs.map((sub) => {
                            const isSubActive = currentSubcategory === sub.slug;
                            return (
                              <Link
                                key={sub.id}
                                href={{
                                  pathname: "/free",
                                  query: {
                                    category: cat.slug,
                                    subcategory: sub.slug,
                                    ...(currentSearch && { search: currentSearch }),
                                  }
                                }}
                                className={`px-3 py-2 rounded-lg transition-all text-[11px] uppercase tracking-wide ${isSubActive ? "text-primary font-bold bg-primary/5" : "text-muted-foreground hover:text-foreground"}`}
                              >
                                {sub.name}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
          
          {/* Right Column: Catalog List */}
          <main className="lg:col-span-9 space-y-12">
            
            {/* Active filters badges row */}
            {(currentCategory !== "all" || currentSubcategory || currentSearch) && (
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                <span className="text-muted-foreground">Active filters:</span>
                
                {currentCategory !== "all" && (
                  <Link
                    href={{
                      pathname: "/free",
                      query: {
                        ...(currentSearch && { search: currentSearch }),
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary border-2 border-primary/20 rounded-xl"
                  >
                    Category: {categoriesList.find(c => c.slug === currentCategory)?.name || currentCategory}
                    <span className="text-[10px] opacity-60 hover:opacity-100">&times;</span>
                  </Link>
                )}

                {currentSubcategory && (
                  <Link
                    href={{
                      pathname: "/free",
                      query: {
                        category: currentCategory,
                        ...(currentSearch && { search: currentSearch }),
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary border-2 border-primary/20 rounded-xl"
                  >
                    Subcategory: {subcategoriesList.find(s => s.slug === currentSubcategory)?.name || currentSubcategory}
                    <span className="text-[10px] opacity-60 hover:opacity-100">&times;</span>
                  </Link>
                )}

                {currentSearch && (
                  <Link
                    href={{
                      pathname: "/free",
                      query: {
                        category: currentCategory,
                        subcategory: currentSubcategory,
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary border-2 border-primary/20 rounded-xl"
                  >
                    Search: "{currentSearch}"
                    <span className="text-[10px] opacity-60 hover:opacity-100">&times;</span>
                  </Link>
                )}

                <Link
                  href={{ pathname: "/free" }}
                  className="text-[10px] uppercase tracking-wider font-extrabold text-muted-foreground hover:text-foreground underline underline-offset-4 pl-1"
                >
                  Clear All
                </Link>
              </div>
            )}

            {/* Featured Section */}
            {featuredProducts.length > 0 && !currentSearch && (
              <section className="space-y-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#CE82FF] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#CE82FF] animate-pulse" />
                    Featured Free Drops
                  </h2>
                  <div className="h-px flex-1 bg-border/40" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {featuredProducts.map((prod) => (
                    <ProductCard 
                      key={prod.id} 
                      prod={prod} 
                      categoryName={categoriesList.find((c) => c.slug === prod.category)?.name || prod.category} 
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Regular Catalog Grid */}
            <section className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <h2 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                    {currentSearch || currentCategory !== "all" ? "Search Results" : "Free Releases"}
                  </h2>
                  <div className="h-px flex-1 bg-border/40" />
                </div>
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-muted/20 px-3 py-1 rounded-full border border-border/30">
                  {productsList.length} items
                </span>
              </div>

              {productsList.length === 0 ? (
                <div className="py-20 text-center border-2 border-dashed border-border/40 rounded-3xl bg-card/5">
                  <p className="text-sm text-muted-foreground font-bold uppercase tracking-wider">No Free Products Found</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">Try clearing filters or adjusting search queries.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regularProducts.map((prod) => (
                    <ProductCard 
                      key={prod.id} 
                      prod={prod} 
                      categoryName={categoriesList.find((c) => c.slug === prod.category)?.name || prod.category} 
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Pagination */}
            <ProductPagination totalPages={totalPages} currentPage={currentPage} />
          </main>
        </div>

        {/* FAQs */}
        <section className="border-t border-border/40 pt-16 space-y-8">
          <div className="flex items-center gap-4">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#58CC02]" />
              Frequently Asked Questions
            </h2>
            <div className="h-px flex-1 bg-border/40" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Are these free scripts safe to run?</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Absolutely. All free scripts are audited and sourced directly from open-source repositories. You can review the full code upon downloading.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">How do I deploy these boilerplates?</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Each download package includes the original developer readme file outlining step-by-step setup, dependency installation instructions, and deployment triggers.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
