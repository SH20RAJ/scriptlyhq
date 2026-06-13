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
    title: search ? `Search results for "${search}"` : "Search Products",
    description: "Search for premium digital assets on ScriptlyHQ.",
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight text-white">
          {currentSearch ? `Results for "${currentSearch}"` : "Search Products"}
        </h1>
        <p className="text-neutral-400">
          {total} {total === 1 ? "item" : "items"} found
        </p>
      </div>

      <SearchFilter categories={categoriesList} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {productsList.map((prod) => (
          <ProductCard 
            key={prod.id} 
            prod={prod} 
            categoryName={categoriesList.find((c) => c.slug === prod.category)?.name || prod.category} 
          />
        ))}
      </div>

      {productsList.length === 0 && (
        <div className="text-center py-24 border border-dashed border-neutral-800 rounded-xl">
          <p className="text-neutral-500">No products found matching your search.</p>
        </div>
      )}

      <ProductPagination totalPages={totalPages} currentPage={currentPage} />
    </div>
  );
}
