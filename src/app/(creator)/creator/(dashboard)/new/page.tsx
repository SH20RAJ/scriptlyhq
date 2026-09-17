export const dynamic = "force-dynamic";

import { Metadata } from "next";
import { getCategoriesAction, getSubcategoriesAction } from "@/lib/actions/products";
import { getOrCreateDbUser } from "@/lib/auth-utils";
import ProductForm from "@/components/ProductForm";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "List New Script | Creator Console",
  description: "Share your custom code, automation, or boilerplate with the Scriptly library.",
};

export default async function CreatorNewScriptPage() {
  const user = await getOrCreateDbUser();
  if (!user) {
    redirect("/handler/sign-in?redirectTo=/creator/dashboard");
  }

  const categoriesList = await getCategoriesAction();
  const subcategoriesList = await getSubcategoriesAction();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-b border-border/40 pb-5">
        <h1 className="text-2xl font-black tracking-tight text-foreground">
          List New Script
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Share your custom code, boilerplate, or automation package on Scriptly. Keep 95% of direct sales.
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
