import { getProductsAction, getCategoriesAction } from "../../../lib/actions/products";
import { ProductCard } from "../../../components/SearchFilter";
import { ProductPagination } from "../../../components/ProductPagination";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    tag: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  return {
    title: "Products tagged with " + decodedTag,
    description: "Browse all premium digital assets tagged with " + decodedTag + " on ScriptlyHQ.",
  };
}

export default async function TagPage({ params, searchParams }: PageProps) {
  const { tag } = await params;
  const { page } = await searchParams;
  const decodedTag = decodeURIComponent(tag);
  const currentPage = parseInt(page || "1");

  const { products: productsList, totalPages, total } = await getProductsAction({
    tag: decodedTag,
    page: currentPage,
    limit: 12,
  });

  const categoriesList = await getCategoriesAction();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight text-white uppercase">
          Tag: {decodedTag}
        </h1>
        <p className="text-neutral-400">
          {total} {total === 1 ? "item" : "items"} tagged as "{decodedTag}"
        </p>
      </div>

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
          <p className="text-neutral-500">No products found with this tag.</p>
        </div>
      )}

      <ProductPagination totalPages={totalPages} currentPage={currentPage} />
    </div>
  );
}
