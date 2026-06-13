import { Metadata } from "next";
import AdminCategoriesClient from "../../../components/AdminCategoriesClient";

export const metadata: Metadata = {
  title: "Admin Categories Manager | ScriptHQ",
  description: "Create, edit, and delete product categories and subcategories for the marketplace.",
};

export default function AdminCategoriesPage() {
  return (
    <div className="space-y-12" id="admin-categories-root">
      <div className="flex flex-col gap-2 border-b border-border/60 pb-8">
        <h1 className="text-3xl font-extrabold tracking-tighter text-foreground">Categories Manager</h1>
        <p className="text-sm text-muted-foreground font-medium">Create and manage catalog categories and subcategories.</p>
      </div>

      <AdminCategoriesClient />
    </div>
  );
}
export const dynamic = "force-dynamic";
