export const dynamic = "force-dynamic";

import { getProductsAction, getCategoriesAction } from "../lib/actions/products";
import SearchFilter, { ProductCard } from "../components/SearchFilter";
import { ProductPagination } from "../components/ProductPagination";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, Terminal, Code2, Users2, Star, Zap, Cpu, HelpCircle, HeartHandshake } from "lucide-react";

interface PageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    page?: string;
  }>;
}

export default async function Home({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const currentCategory = resolvedParams.category || "all";
  const currentSearch = resolvedParams.search || "";
  const currentPage = parseInt(resolvedParams.page || "1");

  // Fetch products and categories using server actions
  const { products: productsList, totalPages } = await getProductsAction({
    category: currentCategory,
    search: currentSearch,
    page: currentPage,
    limit: 12,
  });

  const categoriesList = await getCategoriesAction();

  // Separate featured products
  const featuredProducts = productsList.filter((p) => p.featured);
  const regularProducts = productsList.filter((p) => !p.featured);

  return (
    <div className="flex flex-col min-h-screen bg-black text-white relative overflow-hidden">
      
      {/* Mesh Background Lights */}
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-purple-500/10 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-[800px] left-[-300px] w-[600px] h-[600px] bg-emerald-500/5 blur-[160px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-[1800px] right-[-300px] w-[600px] h-[600px] bg-blue-500/5 blur-[160px] rounded-full pointer-events-none -z-10" />

      {/* Cyberpunk Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none -z-20" />

      {/* Hero Section */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="container max-w-7xl mx-auto px-4 relative z-10 text-center space-y-10">
          
          {/* Release Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-neutral-900/60 border border-neutral-800 text-neutral-400">
            <Terminal className="w-3.5 h-3.5 text-purple-400" />
            <span>Scriptly Beta 2.0</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl sm:text-6xl md:text-7.5xl font-black tracking-tight text-white leading-[1.05]">
              The premium marketplace <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500">
                for digital craft.
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-sm sm:text-lg text-neutral-400 font-medium leading-relaxed">
              Curated collection of SaaS boilerplates, browser scripts, browser extensions, automation packages, and developer assets designed to help builders ship in hours.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="h-12 px-8 rounded-xl font-bold uppercase tracking-wider text-xs bg-white text-black hover:bg-neutral-200 shadow-xl shadow-white/5 cursor-pointer">
              <Link href="/search">Explore Library</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 px-8 rounded-xl font-bold uppercase tracking-wider text-xs border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-950 cursor-pointer">
              <Link href="/handler/sign-up">Sell Your Scripts</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Platform Stats Counters (V2 suggested feature) */}
      <section className="border-y border-neutral-900 bg-neutral-950/20 backdrop-blur-sm py-10">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
            <div className="space-y-1 border-r border-neutral-900/80 last:border-0">
              <div className="text-3xl font-black text-white font-mono flex items-center justify-center md:justify-start gap-2">
                <Code2 className="w-5 h-5 text-purple-400" />
                120+
              </div>
              <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Premium Scripts</p>
            </div>
            <div className="space-y-1 border-r border-neutral-900/80 last:border-0">
              <div className="text-3xl font-black text-white font-mono flex items-center justify-center md:justify-start gap-2">
                <Users2 className="w-5 h-5 text-blue-400" />
                1,500+
              </div>
              <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Active Builders</p>
            </div>
            <div className="space-y-1 border-r border-neutral-900/80 last:border-0">
              <div className="text-3xl font-black text-white font-mono flex items-center justify-center md:justify-start gap-2">
                <Star className="w-5 h-5 text-amber-400" />
                4.9/5
              </div>
              <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Average rating</p>
            </div>
            <div className="space-y-1 last:border-0">
              <div className="text-3xl font-black text-white font-mono flex items-center justify-center md:justify-start gap-2">
                <Zap className="w-5 h-5 text-emerald-400" />
                100%
              </div>
              <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Instant Access Delivery</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container max-w-7xl mx-auto px-4 py-16 space-y-24">
        
        {/* Filter & Search Dashboard */}
        <div className="sticky top-[3.5rem] z-30 bg-black/80 backdrop-blur-sm py-5 border-b border-neutral-900/80">
          <SearchFilter categories={categoriesList} />
        </div>

        <div className="space-y-24">
          
          {/* Featured Drops Spotlight */}
          {featuredProducts.length > 0 && !currentSearch && (
            <section className="space-y-10">
              <div className="flex items-center gap-4">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                  Featured Drops
                </h2>
                <div className="h-px flex-1 bg-neutral-900" />
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

          {/* Regular Catalog Section */}
          <section className="space-y-10">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">
                  {currentSearch || currentCategory !== "all" ? "Search Results" : "Latest Releases"}
                </h2>
                <div className="h-px flex-1 bg-neutral-900" />
              </div>
              <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest whitespace-nowrap bg-neutral-950 border border-neutral-900 px-3 py-1 rounded-lg">
                {productsList.length} Items
              </span>
            </div>

            {productsList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-28 border border-dashed border-neutral-800 rounded-3xl bg-neutral-950/40 text-center space-y-4">
                <Cpu className="w-10 h-10 text-neutral-700" />
                <div className="space-y-1">
                  <p className="text-sm font-bold text-neutral-300">No matching releases found</p>
                  <p className="text-xs text-neutral-500">Try adjusting your filters or search keywords.</p>
                </div>
                <Button asChild variant="link" className="text-xs text-neutral-400 hover:text-white">
                  <Link href="/">Reset filters</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {(currentSearch || currentCategory !== "all" ? productsList : regularProducts).map((prod) => (
                  <ProductCard 
                    key={prod.id} 
                    prod={prod} 
                    categoryName={categoriesList.find((c) => c.slug === prod.category)?.name || prod.category} 
                  />
                ))}
              </div>
            )}

            <div className="pt-10 border-t border-neutral-900">
              <ProductPagination totalPages={totalPages} currentPage={currentPage} />
            </div>
          </section>

          {/* User Testimonials V2 Revamp feature */}
          <section className="space-y-10">
            <div className="flex items-center gap-4">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500 flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-blue-400" />
                Developer Feedback
              </h2>
              <div className="h-px flex-1 bg-neutral-900" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl border border-neutral-900 bg-neutral-950/20 backdrop-blur-sm space-y-4">
                <p className="text-xs leading-relaxed text-neutral-300">
                  "The SaaS boilerplate on Scriptly saved me at least 40 hours of initial database setup, auth configuration, and layout structuring. Ship rate is insane!"
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center font-bold text-xs text-white">
                    MK
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Mikael K.</h4>
                    <p className="text-[9px] text-neutral-500 font-semibold uppercase">Independent SaaS Builder</p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl border border-neutral-900 bg-neutral-950/20 backdrop-blur-sm space-y-4">
                <p className="text-xs leading-relaxed text-neutral-300">
                  "Having instant download bundles alongside video preview demos makes finding reliable scripts easy. The interface is gorgeous."
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center font-bold text-xs text-white">
                    AS
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Arjun S.</h4>
                    <p className="text-[9px] text-neutral-500 font-semibold uppercase">Chrome Extension Developer</p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl border border-neutral-900 bg-neutral-950/20 backdrop-blur-sm space-y-4">
                <p className="text-xs leading-relaxed text-neutral-300">
                  "Listed two automation extensions as a creator and payouts were handled manually. Everything runs cleanly. Highly recommended portal!"
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center font-bold text-xs text-white">
                    JD
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Janice D.</h4>
                    <p className="text-[9px] text-neutral-500 font-semibold uppercase">Automation Engineer</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Accordion Section V2 */}
          <section className="space-y-10">
            <div className="flex items-center gap-4">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-purple-400" />
                Frequently Asked Questions
              </h2>
              <div className="h-px flex-1 bg-neutral-900" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">How do product downloads work?</h3>
                <p className="text-xs leading-relaxed text-neutral-400">
                  Immediately upon completing the Razorpay checkout flow, files are unlocked inside your personal account inventory. Secure access keys are served automatically.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Can I request publishing moderation?</h3>
                <p className="text-xs leading-relaxed text-neutral-400">
                  Yes! Creators can list code tools from the Creator Console. Submissions undergo manual verification before staging on the marketplace.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Are payments split in Beta?</h3>
                <p className="text-xs leading-relaxed text-neutral-400">
                  Scriptly Store holds transactions during Beta. Creators accrue balances under a 50/50 profit split structure settled via manual checks.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">What formats are supported for previews?</h3>
                <p className="text-xs leading-relaxed text-neutral-400">
                  We support static poster files, browser GIFs, YouTube embeds, and direct MP4 streams to demonstrate script code in action.
                </p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
