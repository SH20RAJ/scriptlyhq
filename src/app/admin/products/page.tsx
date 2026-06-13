export const dynamic = "force-dynamic";

import { db } from "../../../db";
import { products } from "../../../db/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";
import { deleteProductAction } from "../../../lib/actions/products";
import { Plus, Edit2, Trash2, Globe, Sparkles, AlertCircle } from "lucide-react";

export default async function AdminProductsPage() {
  const productsList = await db.query.products.findMany({
    orderBy: [desc(products.createdAt)],
  });

  return (
    <div className="space-y-10">
      
      {/* Header with CTA */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Manage Products
          </h1>
          <p className="text-sm text-neutral-400">
            Publish, edit, or remove catalog items and media assets.
          </p>
        </div>
        
        <Link
          href="/admin/products/new"
          className="inline-flex items-center space-x-2 px-4 py-2.5 text-sm font-bold text-neutral-950 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-xl hover:from-emerald-300 hover:to-teal-300 active:scale-[0.98] transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Product</span>
        </Link>
      </div>

      {/* Products Table Card */}
      <div className="p-8 rounded-2xl border border-neutral-900 bg-neutral-900/10 backdrop-blur-sm">
        {productsList.length === 0 ? (
          <div className="text-center py-16 text-neutral-500 space-y-4">
            <AlertCircle className="w-10 h-10 mx-auto text-neutral-600" />
            <p className="text-sm">No products found in the catalog.</p>
            <Link
              href="/admin/products/new"
              className="text-xs text-emerald-400 hover:underline inline-block"
            >
              Add your first product
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto border border-neutral-900 rounded-xl">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-neutral-900 bg-neutral-900/40 text-neutral-400 font-medium text-xs uppercase tracking-wider">
                  <th className="p-4">Product Details</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stats</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900 text-neutral-300">
                {productsList.map((prod) => (
                  <tr key={prod.id} className="hover:bg-neutral-900/5 transition-colors">
                    
                    {/* Title & Slug */}
                    <td className="p-4">
                      <div className="font-bold text-white text-base leading-tight">
                        {prod.title}
                      </div>
                      <div className="text-[10px] font-mono text-neutral-500 mt-1 max-w-xs truncate">
                        Slug: {prod.slug} | v{prod.version}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-4">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 uppercase tracking-wide">
                        {prod.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="p-4 font-mono font-bold text-white text-base">
                      ₹{(prod.price / 100).toLocaleString("en-IN")}
                    </td>

                    {/* Status Icons */}
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        {prod.published ? (
                          <span className="inline-flex items-center text-[10px] font-bold text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10 uppercase tracking-wider">
                            <Globe className="w-3 h-3 mr-1" /> Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-[10px] font-bold text-neutral-500 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800 uppercase tracking-wider">
                            Draft
                          </span>
                        )}
                        {prod.featured && (
                          <span className="inline-flex items-center text-[10px] font-bold text-amber-400 bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10 uppercase tracking-wider">
                            <Sparkles className="w-3 h-3 mr-1" /> Featured
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Action Buttons */}
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center space-x-2">
                        <Link
                          href={`/admin/products/${prod.id}/edit`}
                          className="p-2 border border-neutral-800 hover:border-neutral-700 bg-neutral-900/40 text-neutral-300 hover:text-white rounded-lg transition-all"
                          title="Edit Product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        
                        {/* Delete using Server Action form */}
                        <form
                          action={async () => {
                            "use server";
                            await deleteProductAction(prod.id);
                          }}
                          className="inline-block"
                        >
                          <button
                            type="submit"
                            onClick={(e) => {
                              if (!confirm("Are you sure you want to delete this product?")) {
                                e.preventDefault();
                              }
                            }}
                            className="p-2 border border-neutral-800 hover:border-rose-950 bg-neutral-900/40 text-rose-400 hover:text-rose-300 rounded-lg transition-all cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
