export const dynamic = "force-dynamic";

import { getProductsAction, getCategoriesAction } from "../lib/actions/products";
import SearchFilter from "../components/SearchFilter";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";

interface PageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
  }>;
}

export default async function Home({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const currentCategory = resolvedParams.category || "all";
  const currentSearch = resolvedParams.search || "";

  // Fetch products and categories using server actions
  const productsList = await getProductsAction({
    category: currentCategory,
    search: currentSearch,
  });

  const categoriesList = await getCategoriesAction();

  // Separate featured products
  const featuredProducts = productsList.filter((p) => p.featured);
  const regularProducts = productsList.filter((p) => !p.featured);

  return (
    <div className="pb-16 space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 text-center border-b border-neutral-900 bg-radial-gradient">
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-semibold uppercase tracking-wider animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Premium Assets Marketplace</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-transparent">
            Supercharge Your Build With <br />
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              ScriptlyHQ
            </span>
          </h1>

          <p className="text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Instantly download premium SaaS boilerplate code, responsive landing page templates, developer tools, AI prompts, and ebook guides.
          </p>
        </div>
      </section>

      {/* Main Browse Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <SearchFilter categories={categoriesList} />

        {/* Featured Products Grid */}
        {featuredProducts.length > 0 && !currentSearch && (
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Featured Selections
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="group relative flex flex-col md:flex-row overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/30 backdrop-blur-sm transition-all duration-300 hover:border-neutral-700 hover:shadow-2xl hover:shadow-emerald-500/5 hover:-translate-y-1"
                >
                  {/* Thumbnail */}
                  <div className="relative w-full md:w-48 h-48 bg-neutral-950 flex-shrink-0 border-b md:border-b-0 md:border-r border-neutral-800 overflow-hidden">
                    {prod.thumbnail ? (
                      <Image
                        src={prod.thumbnail}
                        alt={prod.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-neutral-600 bg-neutral-900 uppercase">
                        {prod.category}
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="p-6 flex flex-col justify-between flex-1">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                          {categoriesList.find((c) => c.slug === prod.category)?.name || prod.category}
                        </span>
                        <span className="text-lg font-bold text-white">
                          ₹{(prod.price / 100).toLocaleString("en-IN")}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                        {prod.title}
                      </h3>
                      <p className="text-sm text-neutral-400 line-clamp-2">
                        {prod.shortDescription}
                      </p>
                    </div>

                    <div className="pt-4 flex items-center justify-between">
                      <span className="text-[11px] text-neutral-500">v{prod.version}</span>
                      <Link
                        href={`/products/${prod.slug}`}
                        className="inline-flex items-center text-sm font-semibold text-emerald-400 group-hover:text-emerald-300 group-hover:translate-x-1 transition-all"
                      >
                        View Details
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Regular Products Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
            <h2 className="text-xl font-bold tracking-tight text-white">
              {currentSearch || currentCategory !== "all" ? "Search Results" : "All Products"}
            </h2>
            <span className="text-xs text-neutral-500">{productsList.length} items found</span>
          </div>

          {productsList.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-neutral-800 rounded-2xl bg-neutral-950/40">
              <p className="text-neutral-500">No products found matching your criteria.</p>
              <Link href="/" className="mt-4 inline-block text-sm text-emerald-400 hover:underline">
                Clear all filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* If search is active, show everything, otherwise show regularProducts (avoid duplicating featured) */}
              {(currentSearch || currentCategory !== "all" ? productsList : regularProducts).map((prod) => (
                <div
                  key={prod.id}
                  className="group flex flex-col justify-between overflow-hidden rounded-xl border border-neutral-900 bg-neutral-900/10 backdrop-blur-sm transition-all duration-300 hover:border-neutral-800 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-1"
                >
                  <div className="relative aspect-video w-full bg-neutral-950 border-b border-neutral-900 overflow-hidden">
                    {prod.thumbnail ? (
                      <Image
                        src={prod.thumbnail}
                        alt={prod.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-neutral-700 bg-neutral-950 uppercase font-mono">
                        {prod.category}
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold tracking-wider uppercase text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                          {categoriesList.find((c) => c.slug === prod.category)?.name || prod.category}
                        </span>
                        <span className="text-sm font-bold text-white">
                          ₹{(prod.price / 100).toLocaleString("en-IN")}
                        </span>
                      </div>
                      <h3 className="font-bold text-white group-hover:text-emerald-400 transition-colors text-base line-clamp-1">
                        {prod.title}
                      </h3>
                      <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                        {prod.shortDescription}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-neutral-900/60">
                      <span className="text-[10px] text-neutral-500 font-mono">v{prod.version}</span>
                      <Link
                        href={`/products/${prod.slug}`}
                        className="inline-flex items-center text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-all"
                      >
                        View Details
                        <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
