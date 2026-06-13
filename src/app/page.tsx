export const dynamic = "force-dynamic";

import { getProductsAction, getCategoriesAction } from "../lib/actions/products";
import SearchFilter, { ProductCard } from "../components/SearchFilter";
import { ProductPagination } from "../components/ProductPagination";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

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
                <ProductCard 
                  key={prod.id} 
                  prod={prod} 
                  categoryName={categoriesList.find((c) => c.slug === prod.category)?.name || prod.category} 
                />
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
                <ProductCard 
                  key={prod.id} 
                  prod={prod} 
                  categoryName={categoriesList.find((c) => c.slug === prod.category)?.name || prod.category} 
                />
              ))}
            </div>
          )}

          <ProductPagination totalPages={totalPages} currentPage={currentPage} />
        </section>
      </div>
    </div>
  );
}
