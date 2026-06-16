export const dynamic = "force-dynamic";

import { getProductsAction, getCategoriesAction, getSubcategoriesAction } from "../lib/actions/products";
import SearchFilter, { ProductCard } from "../components/SearchFilter";
import { ProductPagination } from "../components/ProductPagination";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, Cpu, HelpCircle, HeartHandshake, Layers, Tags, ChevronRight } from "lucide-react";

interface PageProps {
  searchParams: Promise<{
    category?: string;
    subcategory?: string;
    search?: string;
    priceType?: "all" | "free" | "paid";
    sortBy?: "newest" | "rating" | "price_asc" | "price_desc";
    page?: string;
  }>;
}

export default async function Home({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const currentCategory = resolvedParams.category || "all";
  const currentSubcategory = resolvedParams.subcategory || "";
  const currentSearch = resolvedParams.search || "";
  const currentPriceType = resolvedParams.priceType || "all";
  const currentSortBy = resolvedParams.sortBy || "newest";
  const currentPage = parseInt(resolvedParams.page || "1");

  // Fetch products, categories, and subcategories using server actions
  const { products: productsList, totalPages } = await getProductsAction({
    category: currentCategory,
    subcategory: currentSubcategory,
    search: currentSearch,
    priceType: currentPriceType,
    sortBy: currentSortBy,
    page: currentPage,
    limit: 12,
  });

  const categoriesList = await getCategoriesAction();
  const subcategoriesList = await getSubcategoriesAction();

  // Separate featured products
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
        
        {/* Content-Only Hero Section */}
        <header className="py-10 text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground font-sans">
            Ready-To-Deploy <span className="text-[#58CC02]">Next.js Templates</span> & <span className="text-[#1CB0F6]">Developer Scripts</span>
          </h1>
          <p className="text-sm md:text-base text-muted-foreground font-bold leading-relaxed">
            Ship 10x faster with verified full-stack boilerplates, browser extensions, automation bots, and system prompts. Grab open-source code for free or sell your creations and keep 95% of sales!
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
            
            {/* Category Directory Tree */}
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-primary" />
                Categories
              </h3>
              <div className="flex flex-col gap-1 text-sm font-bold">
                <Link
                  href={{
                    pathname: "/",
                    query: {
                      ...(currentSearch && { search: currentSearch }),
                      ...(currentPriceType !== "all" && { priceType: currentPriceType }),
                      ...(currentSortBy !== "newest" && { sortBy: currentSortBy }),
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
                          pathname: "/",
                          query: {
                            category: cat.slug,
                            ...(currentSearch && { search: currentSearch }),
                            ...(currentPriceType !== "all" && { priceType: currentPriceType }),
                            ...(currentSortBy !== "newest" && { sortBy: currentSortBy }),
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
                                  pathname: "/",
                                  query: {
                                    category: cat.slug,
                                    subcategory: sub.slug,
                                    ...(currentSearch && { search: currentSearch }),
                                    ...(currentPriceType !== "all" && { priceType: currentPriceType }),
                                    ...(currentSortBy !== "newest" && { sortBy: currentSortBy }),
                                  }
                                }}
                                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${isSubActive ? "text-primary bg-primary/5 font-black" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"}`}
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

            {/* Price Filter Facet */}
            <div className="space-y-4 border-t border-border/40 pt-6">
              <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Tags className="w-3.5 h-3.5 text-primary" />
                Price Filters
              </h3>
              <div className="flex flex-col gap-1 text-sm font-bold">
                {[
                  { label: "All Products", value: "all" },
                  { label: "Free Scripts", value: "free" },
                  { label: "Premium Boilerplates", value: "paid" },
                ].map((item) => (
                  <Link
                    key={item.value}
                    href={{
                      pathname: "/",
                      query: {
                        ...(currentCategory !== "all" && { category: currentCategory }),
                        ...(currentSubcategory && { subcategory: currentSubcategory }),
                        ...(currentSearch && { search: currentSearch }),
                        priceType: item.value,
                        ...(currentSortBy !== "newest" && { sortBy: currentSortBy }),
                      }
                    }}
                    className={`px-3 py-2 rounded-xl transition-all text-xs uppercase tracking-wide ${currentPriceType === item.value ? "bg-primary/10 text-primary font-black" : "hover:bg-muted text-muted-foreground hover:text-foreground"}`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Sorting Facet */}
            <div className="space-y-4 border-t border-border/40 pt-6">
              <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-primary" />
                Sort Options
              </h3>
              <div className="flex flex-col gap-1 text-sm font-bold">
                {[
                  { label: "Newest Releases", value: "newest" },
                  { label: "Highest Rated", value: "rating" },
                  { label: "Price: Low to High", value: "price_asc" },
                  { label: "Price: High to Low", value: "price_desc" },
                ].map((item) => (
                  <Link
                    key={item.value}
                    href={{
                      pathname: "/",
                      query: {
                        ...(currentCategory !== "all" && { category: currentCategory }),
                        ...(currentSubcategory && { subcategory: currentSubcategory }),
                        ...(currentSearch && { search: currentSearch }),
                        ...(currentPriceType !== "all" && { priceType: currentPriceType }),
                        sortBy: item.value,
                      }
                    }}
                    className={`px-3 py-2 rounded-xl transition-all text-xs uppercase tracking-wide ${currentSortBy === item.value ? "bg-primary/10 text-primary font-black" : "hover:bg-muted text-muted-foreground hover:text-foreground"}`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

          </aside>

          {/* Right Column: Catalog Grid & Spotlights */}
          <div className="lg:col-span-9 space-y-12">
            
            {/* Active Filters Summary Header */}
            {(currentCategory !== "all" || currentSubcategory || currentPriceType !== "all" || currentSearch) && (
              <div className="flex flex-wrap items-center gap-2 p-4 bg-muted/30 border border-border/40 rounded-2xl">
                <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mr-1">Active Filters:</span>
                {currentCategory !== "all" && (
                  <Link href={{ pathname: "/", query: { ...(currentSearch && { search: currentSearch }), ...(currentPriceType !== "all" && { priceType: currentPriceType }), ...(currentSortBy !== "newest" && { sortBy: currentSortBy }) } }} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20">
                    Category: {categoriesList.find(c => c.slug === currentCategory)?.name || currentCategory} ✕
                  </Link>
                )}
                {currentSubcategory && (
                  <Link href={{ pathname: "/", query: { category: currentCategory, ...(currentSearch && { search: currentSearch }), ...(currentPriceType !== "all" && { priceType: currentPriceType }), ...(currentSortBy !== "newest" && { sortBy: currentSortBy }) } }} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20">
                    Subcategory: {subcategoriesList.find(s => s.slug === currentSubcategory)?.name || currentSubcategory} ✕
                  </Link>
                )}
                {currentPriceType !== "all" && (
                  <Link href={{ pathname: "/", query: { ...(currentCategory !== "all" && { category: currentCategory }), ...(currentSubcategory && { subcategory: currentSubcategory }), ...(currentSearch && { search: currentSearch }), ...(currentSortBy !== "newest" && { sortBy: currentSortBy }) } }} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20">
                    Price: {currentPriceType === "free" ? "Free" : "Premium"} ✕
                  </Link>
                )}
                {currentSearch && (
                  <Link href={{ pathname: "/", query: { ...(currentCategory !== "all" && { category: currentCategory }), ...(currentSubcategory && { subcategory: currentSubcategory }), ...(currentPriceType !== "all" && { priceType: currentPriceType }), ...(currentSortBy !== "newest" && { sortBy: currentSortBy }) } }} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20">
                    Search: "{currentSearch}" ✕
                  </Link>
                )}
                <Link href="/" className="text-[10px] font-black uppercase text-muted-foreground hover:text-foreground ml-auto underline">
                  Clear All
                </Link>
              </div>
            )}

            {/* Featured Drops Spotlight */}
            {featuredProducts.length > 0 && !currentSearch && !currentSubcategory && currentCategory === "all" && (
              <section className="space-y-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#CE82FF] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#CE82FF] animate-pulse" />
                    Featured Spotlight
                  </h2>
                  <div className="h-px flex-1 bg-border" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {featuredProducts.slice(0, 2).map((prod) => (
                    <ProductCard 
                      key={prod.id} 
                      prod={prod} 
                      categoryName={categoriesList.find((c) => c.slug === prod.category)?.name || prod.category} 
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Regular Catalog Section */}
            <section className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <h2 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                    {currentSearch || currentCategory !== "all" || currentSubcategory ? "Filtered Catalog" : "All Releases"}
                  </h2>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest whitespace-nowrap bg-muted border border-border px-3 py-1 rounded-lg">
                  {productsList.length} Items
                </span>
              </div>

              {productsList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-28 border border-dashed border-border rounded-3xl bg-muted/25 text-center space-y-4">
                  <Cpu className="w-10 h-10 text-muted-foreground/50" />
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-foreground">No matching releases found</p>
                    <p className="text-xs text-muted-foreground">Try adjusting your filters or search keywords.</p>
                  </div>
                  <Button asChild variant="link" className="text-xs text-muted-foreground hover:text-foreground">
                    <Link href="/">Reset all filters</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                  {(currentSearch || currentCategory !== "all" || currentSubcategory ? productsList : regularProducts).map((prod) => (
                    <ProductCard 
                      key={prod.id} 
                      prod={prod} 
                      categoryName={categoriesList.find((c) => c.slug === prod.category)?.name || prod.category} 
                    />
                  ))}
                </div>
              )}

              {totalPages > 1 && (
                <div className="pt-10 border-t border-border">
                  <ProductPagination totalPages={totalPages} currentPage={currentPage} />
                </div>
              )}
            </section>
          </div>
        </div>

        {/* User Testimonials V2 Revamp feature */}
        <section className="space-y-8 pt-8 border-t border-border/40">
          <div className="flex items-center gap-4">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-[#1CB0F6]" />
              Developer Feedback
            </h2>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
              <p className="text-xs leading-relaxed text-muted-foreground">
                "The SaaS boilerplate on Scriptly saved me at least 40 hours of initial database setup, auth configuration, and layout structuring. Ship rate is insane!"
              </p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-xs text-foreground border border-border">
                  MK
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">Mikael K.</h4>
                  <p className="text-[9px] text-muted-foreground font-semibold uppercase">Independent SaaS Builder</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
              <p className="text-xs leading-relaxed text-muted-foreground">
                "Having instant download bundles alongside video preview demos makes finding reliable scripts easy. The interface is gorgeous."
              </p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-xs text-foreground border border-border">
                  AS
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">Arjun S.</h4>
                  <p className="text-[9px] text-muted-foreground font-semibold uppercase">Chrome Extension Developer</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
              <p className="text-xs leading-relaxed text-muted-foreground">
                "Listed two automation extensions as a creator and payouts were handled manually. Everything runs cleanly. Highly recommended portal!"
              </p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-xs text-foreground border border-border">
                  JD
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">Janice D.</h4>
                  <p className="text-[9px] text-muted-foreground font-semibold uppercase">Automation Engineer</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Accordion Section V2 */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#58CC02]" />
              Frequently Asked Questions
            </h2>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">How do product downloads work?</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Immediately upon completing the Razorpay checkout flow, files are unlocked inside your personal account inventory. Secure access keys are served automatically.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Can I request publishing moderation?</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Yes! Creators can list code tools from the Creator Console. Submissions undergo manual verification before staging on the marketplace.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">How do payouts and profit splits work?</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Scriptly Store is developer-first: you keep 95% of all gross sales (the platform only charges a flat 5% fee). Split payouts are automatically and instantly transferred directly to your bank account via Razorpay Route once your Direct Bank settings are configured. Other methods are manually settled during our Beta phase.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">What formats are supported for previews?</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                We support static poster files, browser GIFs, YouTube embeds, and direct MP4 streams to demonstrate script code in action.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
