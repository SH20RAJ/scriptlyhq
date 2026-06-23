export const dynamic = "force-dynamic";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit New Product",
};

import { getCategoriesAction, getSubcategoriesAction } from "../../../lib/actions/products";
import { getOrCreateDbUser } from "../../../lib/auth-utils";
import ProductForm from "../../../components/ProductForm";
import { redirect } from "next/navigation";

export default async function CreatorNewScriptPage() {
  const user = await getOrCreateDbUser();
  if (!user) {
    redirect("/handler/sign-in?redirectTo=/creator/new");
  }

  const categoriesList = await getCategoriesAction();
  const subcategoriesList = await getSubcategoriesAction();

  return (
    <div className="container max-w-7xl mx-auto px-4 py-12 md:py-16 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          List New Script
        </h1>
        <p className="text-sm text-neutral-400 mt-1.5">
          Share your custom code, automation, or boilerplate with the Scriptly library.
        </p>
      </div>
      
      <ProductForm 
        categories={categoriesList} 
        subcategories={subcategoriesList} 
        isCreatorConsole={true} 
      />
    </div>
  );
}
