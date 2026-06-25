export const dynamic = "force-dynamic";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Product",
};

import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCategoriesAction, getSubcategoriesAction } from "@/lib/actions/products";
import ProductForm from "@/components/ProductForm";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;

  // Retrieve the product by ID
  const product = await db.query.products.findFirst({
    where: eq(products.id, id),
  });

  if (!product) {
    notFound();
  }

  const categoriesList = await getCategoriesAction();
  const subcategoriesList = await getSubcategoriesAction();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Edit Product
        </h1>
        <p className="text-sm text-neutral-400">
          Modify the catalog listing, pricing, or replace uploaded files.
        </p>
      </div>

      <ProductForm categories={categoriesList} subcategories={subcategoriesList} initialData={product} />
    </div>
  );
}
