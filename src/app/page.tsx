"use client";

import { getProductsAction, getCategoriesAction, getSubcategoriesAction } from "../lib/actions/products";
import SearchFilter, { ProductCard } from "../components/SearchFilter";
import { ProductPagination } from "../components/ProductPagination";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, Cpu, HelpCircle, HeartHandshake, Layers, Tags, ChevronRight, ArrowRight } from "lucide-react";
import { getProductEffectivePrice } from "../lib/price-utils";
import { CyberBackground } from "../components/ui/CyberBackground";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

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

export default function Home({ searchParams }: PageProps) {
  const [data, setData] = useState<any>(null);
  const [resolvedParams, setResolvedParams] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const params = await searchParams;
      setResolvedParams(params);
      const currentCategory = params.category || "all";
      const currentSubcategory = params.subcategory || "";
      const currentSearch = params.search || "";
      const currentPriceType = params.priceType || "all";
      const currentSortBy = params.sortBy || "newest";
      const currentPage = parseInt(params.page || "1");

      const [productsData, featuredData, categories, subcategories] = await Promise.all([
        getProductsAction({
          category: currentCategory,
          subcategory: currentSubcategory,
          search: currentSearch,
          priceType: "paid",
          sortBy: currentSortBy,
          page: currentPage,
          limit: 12,
        }),
        getProductsAction({
          priceType: "paid",
          limit: 3,
          sortBy: "rating",
        }),
        getCategoriesAction(),
        getSubcategoriesAction()
      ]);

      setData({
        productsList: productsData.products,
        totalPages: productsData.totalPages,
        featuredPremiumList: featuredData.products,
        categoriesList: categories,
        subcategoriesList: subcategories,
        currentCategory,
        currentSubcategory,
        currentSearch,
        currentPriceType,
        currentSortBy,
        currentPage,
      });
    }
    load();
  }, [searchParams]);

  if (!data) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const { 
    productsList, totalPages, featuredPremiumList, categoriesList, 
    subcategoriesList, currentCategory, currentSubcategory, 
    currentSearch, currentPriceType, currentSortBy, currentPage 
  } = data;

  const featuredProducts = productsList.filter((p: any) => p.featured);
  const regularProducts = productsList.filter((p: any) => !p.featured);

  return (
    <div className="flex flex-col min-h-screen text-foreground relative">
      <CyberBackground />

      {/* Main Content Area */}
      <div className="container max-w-7xl mx-auto px-4 py-8 space-y-12">
        
        {/* Content-Only Hero Section */}
        <header className="py-12 space-y-10 max-w-5xl mx-auto overflow-hidden">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground font-sans leading-[1.1]">
                Ready-To-Use <span className="text-primary">Digital Products</span> & <span className="text-[#1CB0F6]">Developer Scripts</span>
              </h1>
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-sm md:text-lg text-muted-foreground font-bold leading-relaxed max-w-2xl mx-auto"
            >
              Ship 10x faster with verified full-stack boilerplates, browser extensions, automation bots, and system prompts.
            </motion.p>

            {/* Centered Premium/Free Switcher */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center justify-center gap-4 pt-6"
            >
              <Link 
                href="/" 
                className="px-8 py-4 bg-primary text-white border-2 border-primary rounded-2xl text-[12px] font-black uppercase tracking-wider transition-all shadow-[0_5px_0_#46A302] hover:-translate-y-0.5 active:translate-y-[4px] active:shadow-none cursor-pointer"
              >
                💎 Premium Marketplace
              </Link>
              <Link 
                href="/free" 
                className="px-8 py-4 bg-card/50 backdrop-blur-md text-muted-foreground border-2 border-border rounded-2xl text-[12px] font-black uppercase tracking-wider transition-all shadow-[0_5px_0_var(--border)] hover:-translate-y-0.5 active:translate-y-[4px] active:shadow-none cursor-pointer"
              >
                🎁 Free Scripts
              </Link>
            </motion.div>
          </div>

          {/* Featured Content Posts */}
          {featuredPremiumList && featuredPremiumList.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="space-y-6 pt-10"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#CE82FF] flex items-center gap-1.5 whitespace-nowrap">
                    <Sparkles className="w-3.5 h-3.5 text-[#CE82FF] animate-pulse" />
                    Featured Premium Releases
                  </h3>
                  <div className="h-px flex-1 bg-gradient-to-r from-border/40 to-transparent" />
                  <Link 
                    href="/featured" 
                    className="text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                  >
                    View All <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {featuredPremiumList.map((post: any, idx: number) => {
                  const promo = getProductEffectivePrice(post);
                  return (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <Link
                        href={`/products/${post.slug}`}
                        className="group flex flex-col bg-card/30 backdrop-blur-md border-2 border-white/5 hover:border-primary/40 rounded-3xl overflow-hidden transition-all duration-300 shadow-xl hover:shadow-primary/5 hover:-translate-y-1 active:translate-y-0"
                      >
                        <div className="aspect-[16/10] w-full overflow-hidden relative border-b border-white/5 bg-muted">
                          <img
                            src={post.thumbnail || "/placeholder.jpg"}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          {/* Rating Badge */}
                          <span className="absolute top-4 left-4 bg-background/90 backdrop-blur-md text-foreground text-[10px] font-black uppercase px-3 py-1.5 rounded-xl border border-white/10 shadow-lg flex items-center gap-1">
                            ⭐ {post.rating}
                          </span>
                          {/* Discount Badge */}
                          {promo.hasDiscount && (
                            <span className="absolute top-4 right-4 bg-[#FF4B4B] text-white text-[9px] font-black uppercase px-3 py-1 rounded-full tracking-wider shadow-lg">
                              SAVE {post.discountPercent}%
                            </span>
                          )}
                        </div>
                        <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                          <div className="space-y-3">
                            <h4 className="text-base font-black text-foreground group-hover:text-primary transition-colors line-clamp-1 leading-snug">
                              {post.title}
                            </h4>
                            <p className="text-xs text-muted-foreground font-medium line-clamp-2 leading-relaxed opacity-80">
                              {post.shortDescription}
                            </p>
                          </div>
                          <div className="flex items-center justify-between pt-4 border-t border-white/5">
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-black text-foreground">
                                ${(promo.effectivePrice / 100).toFixed(2)}
                              </span>
                              {promo.hasDiscount && (
                                <span className="text-[11px] text-muted-foreground line-through font-bold">
                                  ${(post.price / 100).toFixed(2)}
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-primary font-black uppercase tracking-widest group-hover:underline flex items-center gap-1 transition-all">
                              Details &rarr;
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </header>

        {/* Filter & Search Dashboard */}
        <div className="sticky top-[3.5rem] z-30 bg-background/80 backdrop-blur-sm py-5 border-b border-border">
          <SearchFilter categories={categoriesList} />
        </div>

        {/* Scalable Directory Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Sidebar Filters */}
          <aside className="hidden lg:block lg:col-span-3 space-y-8 lg:sticky lg:top-[9rem] max-h-[calc(100vh-11rem)] overflow-y-auto scrollbar-none bg-card/10 p-6 border border-border/40 rounded-3xl">
            
            {/* Free Scripts Promo Link */}
            <div className="pb-6 border-b border-border/40">
              <Link
                href="/free"
                className="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-2 border-purple-500/30 hover:border-purple-500/60 rounded-2xl text-xs uppercase tracking-wider font-extrabold text-purple-400 hover:text-purple-300 transition-all shadow-[0_3px_0_rgba(168,85,247,0.2)] active:translate-y-[3px] active:shadow-none"
              >
                <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                <span>🎁 Free Scripts (100% Free)</span>
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
                
                {categoriesList.map((cat: any) => {
                  const isCatActive = currentCategory === cat.slug;
                  const catSubs = subcategoriesList.filter((sub: any) => sub.categoryId === cat.id);
                  
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
                          {catSubs.map((sub: any) => {
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
                    Category: {categoriesList.find((c: any) => c.slug === currentCategory)?.name || currentCategory} ✕
                  </Link>
                )}
                {currentSubcategory && (
                  <Link href={{ pathname: "/", query: { category: currentCategory, ...(currentSearch && { search: currentSearch }), ...(currentPriceType !== "all" && { priceType: currentPriceType }), ...(currentSortBy !== "newest" && { sortBy: currentSortBy }) } }} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20">
                    Subcategory: {subcategoriesList.find((s: any) => s.slug === currentSubcategory)?.name || currentSubcategory} ✕
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
                  {featuredProducts.slice(0, 2).map((prod: any) => (
                    <ProductCard 
                      key={prod.id} 
                      prod={prod} 
                      categoryName={categoriesList.find((c: any) => c.slug === prod.category)?.name || prod.category} 
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
                  {(currentSearch || currentCategory !== "all" || currentSubcategory ? productsList : regularProducts).map((prod: any) => (
                    <ProductCard 
                      key={prod.id} 
                      prod={prod} 
                      categoryName={categoriesList.find((c: any) => c.slug === prod.category)?.name || prod.category} 
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
