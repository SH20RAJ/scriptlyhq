export const dynamic = "force-dynamic";

import { getCategoriesAction, getSubcategoriesAction } from "../../../../lib/actions/products";
import ProductForm from "../../../../components/ProductForm";

export default async function NewProductPage() {
  const categoriesList = await getCategoriesAction();
  const subcategoriesList = await getSubcategoriesAction();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Create Product
        </h1>
        <p className="text-sm text-neutral-400">
          Upload and configure a new digital product listing in the marketplace.
        </p>
      </div>
      
      <ProductForm categories={categoriesList} subcategories={subcategoriesList} />
    </div>
  );
}
