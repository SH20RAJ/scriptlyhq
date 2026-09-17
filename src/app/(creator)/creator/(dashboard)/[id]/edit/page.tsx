export const dynamic = "force-dynamic";

import { Metadata } from "next";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCategoriesAction, getSubcategoriesAction } from "@/lib/actions/products";
import { getOrCreateDbUser } from "@/lib/auth-utils";
import ProductForm from "@/components/ProductForm";
import { notFound, redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Edit Script | Creator Console",
  description: "Modify details, adjust price, or replace script file assets.",
};

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CreatorEditScriptPage({ params }: PageProps) {
  const user = await getOrCreateDbUser();
  if (!user) {
    redirect("/handler/sign-in?redirectTo=/creator/dashboard");
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
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-b border-border/40 pb-5">
        <h1 className="text-2xl font-black tracking-tight text-foreground">
          Edit Script Submission
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Modify details, adjust price, or replace script file assets. Edits will update your live listing.
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
