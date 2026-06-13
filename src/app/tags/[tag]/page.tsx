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
    title: "Tagged as #" + decodedTag + " | ScriptHQ",
    description: "Browse premium digital assets tagged with " + decodedTag + " on ScriptHQ.",
  };
}

export default async function TagPage({ params, searchParams }: PageProps) {
  const { tag } = await params;
  const resolvedSearchParams = await searchParams;
  const decodedTag = decodeURIComponent(tag);
  const currentPage = parseInt(resolvedSearchParams.page || "1");

  const { products: productsList, totalPages, total } = await getProductsAction({
    tag: decodedTag,
    page: currentPage,
    limit: 12,
  });

  const categoriesList = await getCategoriesAction();

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container max-w-7xl mx-auto px-4 py-12 md:py-20 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/60 pb-10">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tighter text-foreground uppercase">
              #{decodedTag}
            </h1>
            <p className="text-muted-foreground font-medium">
              Browsing {total} {total === 1 ? "asset" : "assets"} with this tag
            </p>
          </div>
        </div>

        <div className="space-y-16">
          {productsList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 border border-dashed border-border rounded-[2.5rem] bg-card/30 space-y-4">
              <p className="text-muted-foreground text-sm font-medium">No assets found with this tag.</p>
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
