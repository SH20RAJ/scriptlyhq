export const dynamic = "force-dynamic";

import { getProductsAction, getCategoriesAction } from "../lib/actions/products";
import SearchFilter from "../components/SearchFilter";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

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
    <div className="pb-24 space-y-20">
      {/* Hero Section */}
      <section className="pt-24 pb-12 text-center border-b border-neutral-900 bg-black">
        <div className="max-w-3xl mx-auto px-4 space-y-6">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-white">
            Premium Digital Assets
          </h1>
          <p className="text-lg text-neutral-400 leading-relaxed">
            Instantly download clean SaaS boilerplate code, modern templates, developer tools, and high-quality UI kits.
          </p>
        </div>
      </section>

      {/* Main Browse Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <SearchFilter categories={categoriesList} />

        {/* Featured Products Grid */}
        {featuredProducts.length > 0 && !currentSearch && (
          <section className="space-y-8">
            <h2 className="text-lg font-medium text-white">Featured</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredProducts.map((prod) => (
                <Link
                  key={prod.id}
                  href={`/products/${prod.slug}`}
                  className="group flex flex-col md:flex-row overflow-hidden rounded-xl border border-neutral-800 bg-black transition-colors hover:border-neutral-600"
                >
                  {/* Thumbnail */}
                  <div className="relative w-full md:w-56 h-56 md:h-auto bg-neutral-900 flex-shrink-0 border-b md:border-b-0 md:border-r border-neutral-800 overflow-hidden">
                    {prod.thumbnail ? (
                      <Image
                        src={prod.thumbnail}
                        alt={prod.title}
                        fill
                        className="object-cover transition-opacity duration-300 group-hover:opacity-90"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-neutral-600 uppercase">
                        {prod.category}
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="p-6 flex flex-col justify-between flex-1">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-neutral-500">
                          {categoriesList.find((c) => c.slug === prod.category)?.name || prod.category}
                        </span>
                        <span className="text-sm font-medium text-white">
                          ₹{(prod.price / 100).toLocaleString("en-IN")}
                        </span>
                      </div>
                      <h3 className="text-lg font-medium text-white group-hover:underline decoration-neutral-500 underline-offset-4">
                        {prod.title}
                      </h3>
                      <p className="text-sm text-neutral-400 line-clamp-2 leading-relaxed">
                        {prod.shortDescription}
                      </p>
                    </div>

                    <div className="pt-6 flex items-center justify-between">
                      <span className="text-xs text-neutral-600">v{prod.version}</span>
                      <div className="inline-flex items-center text-xs font-medium text-white">
                        View Details
                        <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Regular Products Grid */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-white">
              {currentSearch || currentCategory !== "all" ? "Search Results" : "All Products"}
            </h2>
            <span className="text-sm text-neutral-500">{productsList.length} items</span>
          </div>

          {productsList.length === 0 ? (
            <div className="text-center py-24 border border-dashed border-neutral-800 rounded-xl">
              <p className="text-neutral-500">No products found matching your criteria.</p>
              <Link href="/" className="mt-2 inline-block text-sm text-white hover:underline">
                Clear filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* If search is active, show everything, otherwise show regularProducts */}
              {(currentSearch || currentCategory !== "all" ? productsList : regularProducts).map((prod) => (
                <Link
                  key={prod.id}
                  href={`/products/${prod.slug}`}
                  className="group flex flex-col justify-between overflow-hidden rounded-xl border border-neutral-800 bg-black transition-colors hover:border-neutral-600"
                >
                  <div className="relative aspect-[4/3] w-full bg-neutral-900 border-b border-neutral-800 overflow-hidden">
                    {prod.thumbnail ? (
                      <Image
                        src={prod.thumbnail}
                        alt={prod.title}
                        fill
                        className="object-cover transition-opacity duration-300 group-hover:opacity-90"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-neutral-600 uppercase font-mono">
                        {prod.category}
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-neutral-500">
                          {categoriesList.find((c) => c.slug === prod.category)?.name || prod.category}
                        </span>
                        <span className="text-sm font-medium text-white">
                          ₹{(prod.price / 100).toLocaleString("en-IN")}
                        </span>
                      </div>
                      <h3 className="font-medium text-white group-hover:underline decoration-neutral-500 underline-offset-4 text-base line-clamp-1">
                        {prod.title}
                      </h3>
                      <p className="text-sm text-neutral-400 line-clamp-2 leading-relaxed">
                        {prod.shortDescription}
                      </p>
                    </div>

                    <div className="pt-4 flex items-center justify-between border-t border-neutral-900">
                      <span className="text-xs text-neutral-600">v{prod.version}</span>
                      <div className="inline-flex items-center text-xs font-medium text-white">
                        View Details
                        <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
