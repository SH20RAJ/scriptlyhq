"use client";

import { useState, useTransition, useEffect } from "react";
import Link from "next/link";
import { Edit2, Eye, Trash2, Search, Filter, Loader2, AlertCircle, CheckCircle2, Clock, XCircle } from "lucide-react";
import { deleteProductAction } from "@/lib/actions/products";
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

const formatINR = (val: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(val);

export default function CreatorProductsTable({ products }: CreatorProductsTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

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

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const displayPage = Math.min(currentPage, Math.max(1, totalPages));
  const startIndex = (displayPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (status: string | null) => {
    const val = status || "pending";
    switch (val) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-3 h-3" />
            Active
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Clock className="w-3 h-3" />
            Reviewing
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b border-border/40">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search scripts..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-border/60 bg-background/50 text-foreground placeholder:text-muted-foreground text-xs focus:outline-none focus:border-primary/50 transition-colors font-medium"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-border/60 bg-background/50 text-foreground text-xs focus:outline-none focus:border-primary/50 cursor-pointer font-medium"
          >
            <option value="all">All Statuses</option>
            <option value="approved">Approved / Active</option>
            <option value="pending">Pending Review</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Catalog Table */}
      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-2 p-4">
          <AlertCircle className="w-8 h-8 text-muted-foreground/40" />
          <div className="space-y-1">
            <p className="text-xs font-bold text-foreground">No scripts found</p>
            <p className="text-[11px] text-muted-foreground">Try adjusting your search filters or list a new script.</p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/40 bg-muted/20 text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                <th className="py-3 px-5">Script Details</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30 text-xs">
              {paginatedProducts.map((p) => (
                <tr key={p.id} className="hover:bg-muted/15 transition-colors">
                  <td className="py-3.5 px-5">
                    <div className="space-y-0.5">
                      <Link
                        href={`/products/${p.slug}`}
                        className="font-bold text-foreground hover:text-primary transition-colors text-xs line-clamp-1"
                      >
                        {p.title}
                      </Link>
                      <p className="text-[10px] text-muted-foreground font-mono">/{p.slug}</p>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-muted/40 text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                      {p.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                    {formatINR(p.price / 100)}
                  </td>
                  <td className="py-3.5 px-4">
                    {getStatusBadge(p.status)}
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/products/${p.slug}`}
                        className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/40 rounded-lg transition-colors"
                        title="View Public Page"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href={`/creator/${p.id}/edit`}
                        className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/40 rounded-lg transition-colors"
                        title="Edit Details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        type="button"
                        disabled={deletingId === p.id}
                        onClick={() => handleDelete(p.id, p.title)}
                        className="p-1.5 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                        title="Delete Script"
                      >
                        {deletingId === p.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-500" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3 border-t border-border/40 text-xs text-muted-foreground">
          <div className="text-[11px]">
            Showing <strong className="text-foreground">{startIndex + 1}</strong>–
            <strong className="text-foreground">
              {Math.min(startIndex + itemsPerPage, filteredProducts.length)}
            </strong>{" "}
            of <strong className="text-foreground">{filteredProducts.length}</strong> scripts
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={displayPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-2.5 py-1 rounded-lg border border-border/60 bg-card/40 text-foreground text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted/40 transition-colors cursor-pointer"
            >
              Prev
            </button>
            <span className="text-[11px] px-2 font-mono">
              {displayPage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={displayPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-2.5 py-1 rounded-lg border border-border/60 bg-card/40 text-foreground text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted/40 transition-colors cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
