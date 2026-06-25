export const dynamic = "force-dynamic";

import { getProductsAction, getCategoriesAction } from "@/lib/actions/products";
import { ProductCard } from "@/components/SearchFilter";
import { ProductPagination } from "@/components/ProductPagination";
import { Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

interface PageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Featured Premium Releases | ScriptlyStore",
    description: "Browse our hand-picked selection of premium SaaS boilerplates, UI kits, and developer tools.",
  };
}

export default async function FeaturedPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const currentPage = parseInt(resolvedParams.page || "1");

  const { products: productsList, totalPages, total } = await getProductsAction({
    featuredOnly: true,
    page: currentPage,
    limit: 50,
    sortBy: "featured_premium"
  });

  const categoriesList = await getCategoriesAction();

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container max-w-7xl mx-auto px-4 py-12 md:py-20 space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/60 pb-10">
          <div className="space-y-4">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-3 h-3" /> Back to Home
            </Link>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#CE82FF] font-black uppercase tracking-[0.2em] text-[10px]">
                 <Sparkles className="w-3 h-3 animate-pulse" /> Top Picks
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tighter text-foreground">
                Featured Premium Releases
              </h1>
              <p className="text-muted-foreground font-medium max-w-xl">
                Our hand-picked selection of high-quality assets and scripts. Found {total} premium releases.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-16">
          {productsList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 border border-dashed border-border rounded-[2.5rem] bg-card/30 space-y-4">
              <p className="text-muted-foreground text-sm font-medium">No featured assets found at the moment.</p>
              <Link href="/" className="text-xs font-bold text-primary uppercase underline">Browse Catalog</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {productsList.map((prod) => (
                <ProductCard 
                  key={prod.id} 
                  prod={prod} 
                  categoryName={categoriesList.find((c) => c.slug === prod.category)?.name || prod.category} 
                />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="pt-8 border-t border-border/40">
              <ProductPagination totalPages={totalPages} currentPage={currentPage} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
