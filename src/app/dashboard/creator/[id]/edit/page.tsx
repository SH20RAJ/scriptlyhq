export const dynamic = "force-dynamic";

import { db } from "../../../../../db";
import { products } from "../../../../../db/schema";
import { eq } from "drizzle-orm";
import { getCategoriesAction, getSubcategoriesAction } from "../../../../../lib/actions/products";
import { getOrCreateDbUser } from "../../../../../lib/auth-utils";
import ProductForm from "../../../../../components/ProductForm";
import { notFound, redirect } from "next/navigation";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CreatorEditScriptPage({ params }: PageProps) {
  const user = await getOrCreateDbUser();
  if (!user) {
    redirect("/handler/sign-in?redirectTo=/dashboard/creator");
  }

  const { id } = await params;

  // Retrieve the product by ID
  const product = await db.query.products.findFirst({
    where: eq(products.id, id),
  });

  if (!product) {
    notFound();
  }

  // Ownership Guard
  if (product.creatorId !== user.id) {
    notFound();
  }

  const categoriesList = await getCategoriesAction();
  const subcategoriesList = await getSubcategoriesAction();

  return (
    <div className="container max-w-7xl mx-auto px-4 py-12 md:py-16 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Edit Script Submission
        </h1>
        <p className="text-sm text-neutral-400 mt-1.5">
          Modify details, adjust price, or replace script file assets. Edits will reset moderation status to pending review.
        </p>
      </div>

      <ProductForm 
        categories={categoriesList} 
        subcategories={subcategoriesList} 
        initialData={product} 
        isCreatorConsole={true} 
      />
    </div>
  );
}
