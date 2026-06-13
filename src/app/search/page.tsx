import { getProductsAction, getCategoriesAction } from "../../lib/actions/products";
import SearchFilter, { ProductCard } from "../../components/SearchFilter";
import { ProductPagination } from "../../components/ProductPagination";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { search } = await searchParams;
  return {
    title: search ? `Results for "${search}" | ScriptHQ` : "Search Library | ScriptHQ",
    description: "Discover premium SaaS boilerplates, UI kits, and digital tools on ScriptHQ.",
  };
}

export default async function SearchPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const currentSearch = resolvedParams.search || "";
  const currentPage = parseInt(resolvedParams.page || "1");

  const { products: productsList, totalPages, total } = await getProductsAction({
    search: currentSearch,
    page: currentPage,
    limit: 12,
  });

  const categoriesList = await getCategoriesAction();

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container max-w-7xl mx-auto px-4 py-12 md:py-20 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/60 pb-10">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tighter text-foreground">
              {currentSearch ? "Results" : "Search"}
            </h1>
            <p className="text-muted-foreground font-medium flex items-center gap-2">
              {currentSearch ? (
                <>Found {total} matches for <span className="text-foreground">"{currentSearch}"</span></>
              ) : (
                <>Browse our entire collection of digital assets</>
              )}
            </p>
          </div>
        </div>

        <div className="sticky top-[3.5rem] z-30 bg-background/80 backdrop-blur-sm py-4 border-b border-border/40">
           <SearchFilter categories={categoriesList} />
        </div>

        <div className="space-y-16">
          {productsList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 border border-dashed border-border rounded-[2.5rem] bg-card/30 space-y-4">
              <p className="text-muted-foreground text-sm font-medium">No assets found matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {productsList.map((prod) => (
                <ProductCard 
                  key={prod.id} 
                  prod={prod} 
                  categoryName={categoriesList.find((c) => c.slug === prod.category)?.name || prod.category} 
                />
              ))}
            </div>
          )}

          <div className="pt-8 border-t border-border/40">
            <ProductPagination totalPages={totalPages} currentPage={currentPage} />
          </div>
        </div>
      </div>
    </div>
  );
}
