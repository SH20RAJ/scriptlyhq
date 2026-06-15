"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Edit2, Eye, Trash2, Search, Filter, Loader2, AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react";
import { deleteProductAction } from "../lib/actions/products";
import { toast } from "sonner";

interface CreatorProduct {
  id: string;
  title: string;
  slug: string;
  category: string;
  subcategory: string | null;
  price: number;
  status: string | null;
  published: boolean;
  createdAt: Date;
}

interface CreatorProductsTableProps {
  products: CreatorProduct[];
}

export default function CreatorProductsTable({ products }: CreatorProductsTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    setDeletingId(id);
    startTransition(async () => {
      try {
        const res = await deleteProductAction(id);
        if (res.success) {
          toast.success("Script deleted successfully.");
        } else {
          toast.error("Failed to delete script.");
        }
      } catch (err: any) {
        toast.error(err.message || "Failed to delete script.");
      } finally {
        setDeletingId(null);
      }
    });
  };

  const filteredProducts = products.filter((p) => {
    const term = search.toLowerCase();
    const titleMatch = p.title.toLowerCase().includes(term) || p.slug.toLowerCase().includes(term);
    const statusVal = p.status || "pending";
    const statusMatch = statusFilter === "all" || statusVal === statusFilter;
    return titleMatch && statusMatch;
  });

  const getStatusBadge = (status: string | null) => {
    const val = status || "pending";
    switch (val) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <CheckCircle className="w-3.5 h-3.5" />
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <XCircle className="w-3.5 h-3.5" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Clock className="w-3.5 h-3.5" />
            Pending Review
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your scripts..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-800 bg-neutral-900/40 text-white placeholder-neutral-500 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-700 focus:border-neutral-700 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-neutral-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-neutral-800 bg-neutral-900/40 text-neutral-300 text-sm focus:outline-none focus:border-neutral-700 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending Review</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Catalog Table */}
      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-neutral-800/60 rounded-3xl bg-neutral-900/10 text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-neutral-600" />
          <div className="space-y-1">
            <p className="text-sm font-bold text-neutral-300">No scripts found</p>
            <p className="text-xs text-neutral-500">Try adjusting your search filters or list a new script.</p>
          </div>
        </div>
      ) : (
        <div className="border border-neutral-800/80 rounded-2xl overflow-hidden bg-neutral-900/10 backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-800/80 bg-neutral-950/40 text-[10px] font-black uppercase tracking-wider text-neutral-400">
                  <th className="py-4 px-6">Script Details</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Price (USD)</th>
                  <th className="py-4 px-6">Moderation</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/40 text-sm font-medium text-neutral-300">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-neutral-800/10 transition-colors">
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <Link href={`/products/${p.slug}`} className="font-bold text-white hover:underline text-base">
                          {p.title}
                        </Link>
                        <p className="text-xs text-neutral-500 font-mono">slug: {p.slug}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-0.5">
                        <span className="px-2 py-0.5 rounded bg-neutral-800/60 text-xs font-bold text-neutral-400 uppercase tracking-wide">
                          {p.category}
                        </span>
                        {p.subcategory && (
                          <p className="text-[10px] text-neutral-500 font-semibold">{p.subcategory}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-white font-mono font-bold text-base">
                      ${(p.price / 100).toFixed(2)}
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(p.status)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        <Link
                          href={`/products/${p.slug}`}
                          className="p-2 text-neutral-400 hover:text-white bg-neutral-800/40 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 rounded-xl transition-all"
                          title="Preview Product Page"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/dashboard/creator/${p.id}/edit`}
                          className="p-2 text-neutral-400 hover:text-white bg-neutral-800/40 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 rounded-xl transition-all"
                          title="Edit Script"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          disabled={deletingId === p.id}
                          onClick={() => handleDelete(p.id, p.title)}
                          className="p-2 text-neutral-500 hover:text-rose-400 bg-neutral-800/40 hover:bg-rose-500/10 border border-neutral-800 hover:border-rose-500/20 rounded-xl transition-all cursor-pointer"
                          title="Delete Script"
                        >
                          {deletingId === p.id ? (
                            <Loader2 className="w-4 h-4 animate-spin text-rose-400" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
