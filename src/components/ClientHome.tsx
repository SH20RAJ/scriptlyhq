"use client";

import { getProductsAction, getCategoriesAction, getSubcategoriesAction } from "@/lib/actions/products";
import { ProductCard } from "@/components/SearchFilter";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, Terminal, Palette, Bot, BookOpen, Zap, ShieldCheck, Coins, LayoutGrid, ArrowRight } from "lucide-react";
import { CyberBackground } from "@/components/ui/CyberBackground";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ClientHomeProps {
  searchParams: Promise<{
    category?: string;
    subcategory?: string;
    search?: string;
    priceType?: "all" | "free" | "paid";
    sortBy?: "newest" | "rating" | "price_asc" | "price_desc";
    page?: string;
  }>;
}

export default function ClientHome({ searchParams }: ClientHomeProps) {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [resolvedParams, setResolvedParams] = useState<any>(null);
  const [heroSearch, setHeroSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"featured" | "newest" | "free">("featured");

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

      const [productsData, featuredData, freeData, categories, subcategories, landingPagesData] = await Promise.all([
        getProductsAction({
          category: currentCategory,
          subcategory: currentSubcategory,
          search: currentSearch,
          priceType: "paid",
          sortBy: currentSortBy,
          page: currentPage,
          limit: 36,
        }),
        getProductsAction({
          featuredOnly: true,
          limit: 6,
          sortBy: "rating",
        }),
        getProductsAction({
          priceType: "free",
          limit: 6,
          sortBy: "newest",
        }),
        getCategoriesAction(),
        getSubcategoriesAction(),
        getProductsAction({
          category: "landing-pages",
          limit: 6,
          sortBy: "newest",
        })
      ]);

      setData({
        productsList: productsData.products,
        totalPages: productsData.totalPages,
        featuredPremiumList: featuredData.products,
        freeProductsList: freeData.products,
        categoriesList: categories,
        subcategoriesList: subcategories,
        landingPagesList: landingPagesData.products,
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
    <div className="flex flex-col min-h-screen text-foreground bg-background">
      <CyberBackground />
      
      {/* Hero Section Placeholder */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="container max-w-7xl mx-auto px-4 text-center space-y-8">
          <div className="inline-flex h-8 w-64 bg-muted/65 rounded-2xl animate-pulse mx-auto" />
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="h-16 w-3/4 bg-muted/75 rounded-2xl animate-pulse mx-auto" />
            <div className="h-6 w-1/2 bg-muted/65 rounded-xl animate-pulse mx-auto" />
          </div>
          <div className="max-w-2xl mx-auto h-14 bg-muted/65 rounded-2xl animate-pulse" />
        </div>
      </section>

      {/* Stats Section Placeholder */}
      <section className="border-y border-border bg-card/20 backdrop-blur-sm py-10">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="h-12 bg-muted/65 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Placeholder */}
      <section className="py-20 bg-muted/10">
        <div className="container max-w-7xl mx-auto px-4 space-y-12">
          <div className="h-8 w-48 bg-muted/75 rounded-xl animate-pulse mx-auto" />
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5].map((c) => (
              <div key={c} className="h-32 bg-card border-2 border-border/40 rounded-3xl p-6 flex flex-col items-center justify-between space-y-4">
                <div className="w-12 h-12 bg-muted/75 rounded-2xl animate-pulse" />
                <div className="h-4 w-16 bg-muted/65 rounded-lg animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid Placeholder */}
      <section className="py-20">
        <div className="container max-w-7xl mx-auto px-4 space-y-12">
          <div className="flex justify-between items-center border-b border-border pb-6">
            <div className="space-y-2">
              <div className="h-8 w-48 bg-muted/75 rounded-xl animate-pulse" />
              <div className="h-4 w-64 bg-muted/65 rounded-lg animate-pulse" />
            </div>
            <div className="h-10 w-80 bg-muted/65 rounded-xl animate-pulse hidden md:block" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-[2rem] border-2 border-border bg-card overflow-hidden shadow-[0_4px_0_var(--border)] dark:shadow-[0_4px_0_#2A3842] flex flex-col h-full">
                <div className="aspect-[16/9] w-full bg-muted/75 animate-pulse" />
                <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <div className="h-4 w-12 bg-muted/65 rounded-full animate-pulse" />
                      <div className="h-4 w-16 bg-muted/65 rounded-full animate-pulse" />
                    </div>
                    <div className="h-6 w-3/4 bg-muted/75 rounded-lg animate-pulse" />
                    <div className="h-4 w-full bg-muted/65 rounded-md animate-pulse" />
                  </div>
                  <div className="pt-4 border-t border-border/40 flex items-center justify-between">
                    <div className="h-4 w-16 bg-muted/75 rounded-md animate-pulse" />
                    <div className="h-6 w-14 bg-muted/75 rounded-lg animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );

  const { 
    productsList, featuredPremiumList, freeProductsList, categoriesList, 
    currentCategory, currentSubcategory, currentSearch, landingPagesList
  } = data;

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      router.push(`/search?search=${encodeURIComponent(heroSearch.trim())}`);
    }
  };

  const getCategoryIcon = (slug: string) => {
    switch(slug) {
      case "scripts": return <Terminal className="w-6 h-6 text-[#1CB0F6]" />;
      case "saas-templates": return <Zap className="w-6 h-6 text-[#58CC02]" />;
      case "design-assets": return <Palette className="w-6 h-6 text-[#CE82FF]" />;
      case "ai-prompts": return <Bot className="w-6 h-6 text-[#FFC800]" />;
      case "ebooks": return <BookOpen className="w-6 h-6 text-[#FF9600]" />;
      default: return <LayoutGrid className="w-6 h-6 text-primary" />;
    }
  };

  const getCategoryTheme = (slug: string) => {
    switch(slug) {
      case "scripts": return "hover:border-[#1CB0F6]/40 hover:shadow-[#1CB0F6]/5 text-[#1CB0F6]";
      case "saas-templates": return "hover:border-[#58CC02]/40 hover:shadow-[#58CC02]/5 text-[#58CC02]";
      case "design-assets": return "hover:border-[#CE82FF]/40 hover:shadow-[#CE82FF]/5 text-[#CE82FF]";
      case "ai-prompts": return "hover:border-[#FFC800]/40 hover:shadow-[#FFC800]/5 text-[#FFC800]";
      case "ebooks": return "hover:border-[#FF9600]/40 hover:shadow-[#FF9600]/5 text-[#FF9600]";
      default: return "hover:border-primary/40 hover:shadow-primary/5 text-primary";
    }
  };

  return (
    <div className="flex flex-col min-h-screen text-foreground relative bg-background">
      <CyberBackground />

      {/* 1. High-Impact Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="container max-w-7xl mx-auto px-4 text-center relative z-10 space-y-8">
          
          {/* Clickable Floating Badge to Affiliate Page */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Link 
              href="/affiliate" 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/20 shadow-[0_3px_0_rgba(16,185,129,0.15)] hover:border-emerald-500/40 hover:-translate-y-px transition-all duration-200"
            >
              <Sparkles className="w-4 h-4 text-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                Promote & Earn: Get 30% split commission on any script refer <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
          </motion.div>

          {/* Main Title & Subtitle */}
          <div className="max-w-4xl mx-auto space-y-4">
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter leading-[1.05]"
            >
              Deploy <span className="bg-gradient-to-r from-primary via-[#1CB0F6] to-[#CE82FF] bg-clip-text text-transparent">Production-Ready</span> Code Boilerplates Instantly
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-xl text-muted-foreground font-bold max-w-2xl mx-auto leading-relaxed"
            >
              Launch SaaS products, automation scripts, and browser extensions in minutes with curated developer templates. Sell your code keeping 95% of sales, or earn 30% split commission as an affiliate!
            </motion.p>
          </div>


          {/* Glowing Hero Search Bar */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            onSubmit={handleHeroSearchSubmit}
            className="max-w-2xl mx-auto w-full relative group"
          >
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search for SaaS templates, scripts, components..."
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                className="w-full pl-16 pr-36 py-4 text-base font-semibold rounded-2xl border-2 border-border bg-card/60 backdrop-blur-md text-foreground placeholder:text-muted-foreground focus:outline-none transition-all shadow-[0_5px_0_var(--border)] dark:shadow-[0_5px_0_#2A3842] focus:translate-y-[2px] focus:shadow-[0_3px_0_var(--border)]"
              />
              {/* <Search className="absolute left-5 w-6 h-6 text-muted-foreground group-focus-within:text-accent transition-colors" /> */}
              <button
                type="submit"
                className="absolute right-3 px-6 py-2.5 text-sm font-black uppercase bg-primary text-white rounded-xl shadow-[0_4px_0_#46A302] hover:brightness-105 active:translate-y-[2px] active:shadow-none transition-all"
              >
                Search
              </button>
            </div>
            
            {/* Quick Suggestions */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-4 text-xs font-bold text-muted-foreground">
              <span>Popular:</span>
              {["Next.js", "SaaS Boilerplate", "Chrome Extension", "Figma Kit", "Python Bot"].map((term) => (
                <Link
                  key={term}
                  href={`/search?search=${encodeURIComponent(term)}`}
                  className="px-2.5 py-1 bg-card hover:bg-muted border border-border rounded-lg transition-colors"
                >
                  {term}
                </Link>
              ))}
            </div>
          </motion.form>
        </div>
      </section>

      {/* 2. Platform Statistics Row */}
      <section className="border-y border-border bg-card/20 backdrop-blur-sm py-10">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2.5">
                <Coins className="w-6 h-6 text-primary" />
                <span className="text-3xl font-black tracking-tight">95% split</span>
              </div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Keep almost everything you sell
              </p>
            </div>
            
            <div className="space-y-2 border-y md:border-y-0 md:border-x border-border/80 py-6 md:py-0">
              <div className="flex items-center justify-center gap-2.5">
                <Zap className="w-6 h-6 text-[#1CB0F6]" />
                <span className="text-3xl font-black tracking-tight">900+ Scripts</span>
              </div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Curated boilerplates & codebase kits
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2.5">
                <ShieldCheck className="w-6 h-6 text-[#CE82FF]" />
                <span className="text-3xl font-black tracking-tight">100% Verified</span>
              </div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Safe download packages & demo previews
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 2.3. Dedicated Landing Pages Section */}
      {landingPagesList && landingPagesList.length > 0 && (
        <section className="py-16 border-t border-border bg-card/[0.01]">
          <div className="container max-w-7xl mx-auto px-4 space-y-12">
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-border/40 pb-6">
              <div className="space-y-1.5 text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground flex items-center justify-center md:justify-start gap-2">
                  <Zap className="w-5 h-5 text-primary animate-pulse" />
                  Landing Page Templates
                </h2>
                <p className="text-xs font-bold text-muted-foreground">
                  High-converting Next.js, React, and HTML templates designed to showcase your SaaS, portfolio, or agency.
                </p>
              </div>
              <Link href="/explore?category=landing-pages" className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-1">
                View All Landing Pages <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {landingPagesList.slice(0, 3).map((prod: any) => (
                <ProductCard 
                  key={prod.id} 
                  prod={prod} 
                  categoryName={categoriesList.find((c: any) => c.slug === prod.category)?.name || prod.category} 
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 2.5. Dedicated Featured Products Section */}
      {featuredPremiumList && featuredPremiumList.length > 0 && (
        <section className="py-16 border-t border-border bg-card/[0.02]">
          <div className="container max-w-7xl mx-auto px-4 space-y-12">
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-border/40 pb-6">
              <div className="space-y-1.5 text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground flex items-center justify-center md:justify-start gap-2">
                  <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                  Featured Releases
                </h2>
                <p className="text-xs font-bold text-muted-foreground">
                  Our handpicked choice of top-performing SaaS boilerplates, ebooks, and developer scripts.
                </p>
              </div>
              <Link href="/explore?sortBy=rating" className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-1">
                Explore Best Sellers <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPremiumList.slice(0, 3).map((prod: any) => (
                <ProductCard 
                  key={prod.id} 
                  prod={prod} 
                  categoryName={categoriesList.find((c: any) => c.slug === prod.category)?.name || prod.category} 
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. Re-designed Category Cards */}
      <section className="py-20 bg-muted/10">
        <div className="container max-w-7xl mx-auto px-4 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Browse by Coding Category
            </h2>
            <p className="text-sm font-bold text-muted-foreground">
              Filter through curated solutions tailored to accelerate your project building speed.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {categoriesList.map((cat: any) => (
              <Link
                key={cat.id}
                href={{
                  pathname: "/explore",
                  query: { category: cat.slug }
                }}
                className={`group p-6 bg-card border-2 border-border shadow-[0_4px_0_var(--border)] dark:shadow-[0_4px_0_#2A3842] hover:translate-y-[-4px] hover:shadow-[0_8px_0_var(--border)] active:translate-y-1 active:shadow-none rounded-3xl transition-all duration-200 flex flex-col items-center text-center space-y-4 ${getCategoryTheme(cat.slug)}`}
              >
                <div className="p-4 bg-muted/40 rounded-2xl group-hover:scale-110 transition-transform">
                  {getCategoryIcon(cat.slug)}
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase tracking-wider text-foreground">
                    {cat.name}
                  </h4>
                  <p className="text-[10px] font-bold text-muted-foreground mt-1">
                    Explore Assets &rarr;
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Tab Switcher Catalog Grid */}
      <section className="py-20">
        <div className="container max-w-7xl mx-auto px-4 space-y-12">
          
          {/* Tab Switcher Headers */}
          <div className="flex flex-col md:flex-row items-center justify-between border-b border-border pb-6 gap-6">
            <div className="space-y-1 text-center md:text-left">
              <h2 className="text-3xl font-extrabold tracking-tight">
                Developer Marketplace
              </h2>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Discover top-rated templates and free tools
              </p>
            </div>
            
            {/* Custom Duolingo-styled tab badges */}
            <div className="flex items-center bg-card p-1.5 border-2 border-border rounded-2xl shadow-[0_3px_0_var(--border)] dark:shadow-[0_3px_0_#2A3842] gap-1 select-none">
              <button
                onClick={() => setActiveTab("featured")}
                className={`px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-black transition-all ${activeTab === "featured" ? "bg-primary text-white shadow-[0_3px_0_#46A302]" : "text-muted-foreground hover:bg-muted"}`}
              >
                ⭐ Popular Releases
              </button>
              <button
                onClick={() => setActiveTab("newest")}
                className={`px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-black transition-all ${activeTab === "newest" ? "bg-[#1CB0F6] text-white shadow-[0_3px_0_#1899D6]" : "text-muted-foreground hover:bg-muted"}`}
              >
                ✨ New Arrivals
              </button>
              <button
                onClick={() => setActiveTab("free")}
                className={`px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-black transition-all ${activeTab === "free" ? "bg-[#CE82FF] text-white shadow-[0_3px_0_#B86CE6]" : "text-muted-foreground hover:bg-muted"}`}
              >
                🎁 Free Downloads
              </button>
            </div>
          </div>

          {/* Grid list Content with animated switcher transitions */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {activeTab === "featured" && featuredPremiumList && (
                featuredPremiumList.map((prod: any) => (
                  <ProductCard 
                    key={prod.id} 
                    prod={prod} 
                    categoryName={categoriesList.find((c: any) => c.slug === prod.category)?.name || prod.category} 
                  />
                ))
              )}
              {activeTab === "newest" && productsList && (
                productsList.slice(0, 6).map((prod: any) => (
                  <ProductCard 
                    key={prod.id} 
                    prod={prod} 
                    categoryName={categoriesList.find((c: any) => c.slug === prod.category)?.name || prod.category} 
                  />
                ))
              )}
              {activeTab === "free" && freeProductsList && (
                freeProductsList.map((prod: any) => (
                  <ProductCard 
                    key={prod.id} 
                    prod={prod} 
                    categoryName={categoriesList.find((c: any) => c.slug === prod.category)?.name || prod.category} 
                  />
                ))
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center pt-8">
            <Button asChild size="xl" variant="secondary" className="font-black">
              <Link href="/explore" className="flex items-center gap-2">
                Browse Entire Catalog <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 5. Creator Split call-to-action Section */}
      <section className="py-20 container max-w-7xl mx-auto px-4">
        <div className="relative rounded-[2.5rem] border-2 border-border shadow-[0_8px_0_var(--border)] dark:shadow-[0_8px_0_#2A3842] bg-card overflow-hidden p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10">
          {/* Pulse gradient glow backdrops */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-[#1CB0F6]/5 to-[#CE82FF]/5 pointer-events-none" />
          
          <div className="space-y-4 max-w-xl relative z-10 text-center md:text-left">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#CE82FF] px-3.5 py-1.5 bg-[#CE82FF]/10 rounded-full border border-[#CE82FF]/20">
              JOIN THE BETA CREATOR NETWORK
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
              Sell Your Code. <br/>Keep <span className="text-primary">95% Revenue.</span>
            </h2>
            <p className="text-sm font-semibold text-muted-foreground leading-relaxed">
              Don't let third-party marketplaces eat your commissions. Upload your templates, bots, or prompts to ScriptlyStore, connect your payout methods, and enjoy immediate payouts.
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row gap-4 w-full md:w-auto items-center shrink-0">
            <Button asChild size="xl" className="w-full sm:w-auto font-black shadow-[0_5px_0_#46A302]">
              <Link href="/creator/products">
                🚀 List Your Code
              </Link>
            </Button>
            <Button asChild size="xl" variant="outline" className="w-full sm:w-auto font-black">
              <Link href="/docs/api">
                📖 Read Docs
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 6. Developer Feedback / Testimonials */}
      <section className="py-20 border-t border-border bg-muted/5">
        <div className="container max-w-7xl mx-auto px-4 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-extrabold tracking-tight">
              Loved by Builders
            </h2>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
              What indie developers say about using ScriptlyStore
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                text: `"The NextJS SaaS boilerplate saved me at least 40 hours of initial database setup, auth configuration, and layout structuring. Ship rate is insane!"`,
                name: "Mikael K.",
                role: "Independent SaaS Builder",
                initials: "MK"
              },
              {
                text: `"Having instant secure downloads alongside video previews and live demo links makes finding reliable web assets easy. Interface feels extremely responsive."`,
                name: "Arjun S.",
                role: "Chrome Extension Developer",
                initials: "AS"
              },
              {
                text: `"I listed two custom automation extensions as a creator and profits were directly routed to my settings bank account with next to zero platform cuts. The 95% split is real."`,
                name: "Janice D.",
                role: "Automation Engineer",
                initials: "JD"
              }
            ].map((item, idx) => (
              <div key={idx} className="p-8 rounded-3xl border-2 border-border bg-card shadow-[0_4px_0_var(--border)] dark:shadow-[0_4px_0_#2A3842] flex flex-col justify-between space-y-6">
                <p className="text-sm leading-relaxed text-muted-foreground italic">
                  {item.text}
                </p>
                <div className="flex items-center gap-3">
                  <div>
                    <h4 className="text-xs font-black text-foreground">{item.name}</h4>
                    <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FAQ Accordion Section */}
      <section className="py-20 border-t border-border">
        <div className="container max-w-5xl mx-auto px-4 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-extrabold tracking-tight">
              Got Questions?
            </h2>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
              Answers to popular questions about ScriptlyStore
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 border border-border/60 bg-card/45 rounded-2xl space-y-2">
              <h3 className="text-sm font-extrabold text-foreground uppercase tracking-wider">How do product downloads work?</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Immediately upon completing the Razorpay checkout flow, files are unlocked inside your personal account inventory. Secure access keys are served automatically.
              </p>
            </div>
            <div className="p-6 border border-border/60 bg-card/45 rounded-2xl space-y-2">
              <h3 className="text-sm font-extrabold text-foreground uppercase tracking-wider">Can I request publishing moderation?</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Yes! Creators can list code tools from the Creator Console. Submissions undergo manual verification before staging on the marketplace.
              </p>
            </div>
            <div className="p-6 border border-border/60 bg-card/45 rounded-2xl space-y-2">
              <h3 className="text-sm font-extrabold text-foreground uppercase tracking-wider">How do payouts and profit splits work?</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Scriptly Store is developer-first: you keep 95% of all gross sales. Split payouts are automatically and instantly transferred directly to your bank account via Razorpay Route once your Direct Bank settings are configured.
              </p>
            </div>
            <div className="p-6 border border-border/60 bg-card/45 rounded-2xl space-y-2">
              <h3 className="text-sm font-extrabold text-foreground uppercase tracking-wider">What formats are supported for previews?</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                We support static poster files, browser GIFs, YouTube embeds, and direct MP4 streams to demonstrate script code in action.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
