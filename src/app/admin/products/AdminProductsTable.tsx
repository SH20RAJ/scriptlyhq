"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { AdminActions } from "@/app/admin/products/AdminActions";
import { bulkDeleteProductsAction, bulkSetProductsPublishAction, toggleProductPublishAction } from "@/lib/actions/products";
import { Trash2, Eye, EyeOff, CheckSquare, Square, MinusSquare, AlertCircle, Copy, Check } from "lucide-react";

export interface AdminProductItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  price: number;
  published: boolean;
  featured: boolean;
  version: string;
  thumbnail: string | null;
  createdAt: Date | string;
}

interface AdminProductsTableProps {
  products: AdminProductItem[];
  totalCount: number;
  allCount: number;
  publishedCount: number;
  draftCount: number;
  featuredCount: number;
  currentPage: number;
  totalPages: number;
  limit: number;
  currentStatus: string;
  currentSearch: string;
  currentSort: string;
}

export default function AdminProductsTable({
  products,
  totalCount,
  allCount,
  publishedCount,
  draftCount,
  featuredCount,
  currentPage,
  totalPages,
  limit,
  currentStatus,
  currentSearch,
  currentSort,
}: AdminProductsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const offset = (currentPage - 1) * limit;
  const isAllOnPageSelected = products.length > 0 && products.every((p) => selectedIds.includes(p.id));
  const isSomeSelected = products.some((p) => selectedIds.includes(p.id)) && !isAllOnPageSelected;

  const handleSelectAllOnPage = () => {
    if (isAllOnPageSelected) {
      setSelectedIds((prev) => prev.filter((id) => !products.some((p) => p.id === id)));
    } else {
      const pageIds = products.map((p) => p.id);
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleFilterTab = (status: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (status === "all") {
      params.delete("status");
    } else {
      params.set("status", status);
    }
    params.delete("page");
    setSelectedIds([]);
    router.push(`/admin/products?${params.toString()}`);
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    const confirmMsg = `Are you sure you want to permanently delete ${selectedIds.length} selected product${selectedIds.length > 1 ? "s" : ""}?`;
    if (confirm(confirmMsg)) {
      startTransition(async () => {
        try {
          await bulkDeleteProductsAction(selectedIds);
          setSelectedIds([]);
          router.refresh();
        } catch (err) {
          console.error("Bulk delete failed:", err);
          alert("Failed to delete selected products.");
        }
      });
    }
  };

  const handleBulkSetPublish = (publish: boolean) => {
    if (selectedIds.length === 0) return;
    startTransition(async () => {
      try {
        await bulkSetProductsPublishAction(selectedIds, publish);
        setSelectedIds([]);
        router.refresh();
      } catch (err) {
        console.error("Bulk update failed:", err);
        alert("Failed to update products status.");
      }
    });
  };

  const handleQuickTogglePublish = (productId: string) => {
    startTransition(async () => {
      try {
        await toggleProductPublishAction(productId);
        router.refresh();
      } catch (err) {
        console.error("Status toggle failed:", err);
      }
    });
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getPageLink = (pageNum: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (pageNum > 1) params.set("page", pageNum.toString());
    else params.delete("page");
    return `/admin/products?${params.toString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Filter Tabs Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border/60 pb-3">
        <button
          type="button"
          onClick={() => handleFilterTab("all")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            currentStatus === "all"
              ? "bg-foreground text-background shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
          }`}
        >
          <span>All Products</span>
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${currentStatus === "all" ? "bg-background/20 text-background" : "bg-secondary text-foreground"}`}>
            {allCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleFilterTab("published")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            currentStatus === "published"
              ? "bg-foreground text-background shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
          }`}
        >
          <span>Published</span>
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${currentStatus === "published" ? "bg-background/20 text-background" : "bg-secondary text-foreground"}`}>
            {publishedCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleFilterTab("draft")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            currentStatus === "draft"
              ? "bg-foreground text-background shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
          }`}
        >
          <span>Drafts</span>
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${currentStatus === "draft" ? "bg-background/20 text-background" : "bg-amber-500/15 text-amber-500"}`}>
            {draftCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleFilterTab("featured")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            currentStatus === "featured"
              ? "bg-foreground text-background shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
          }`}
        >
          <span>Featured</span>
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${currentStatus === "featured" ? "bg-background/20 text-background" : "bg-secondary text-foreground"}`}>
            {featuredCount}
          </span>
        </button>
      </div>

      {/* Floating Bulk Actions Bar */}
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 px-5 rounded-2xl bg-foreground text-background shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-3">
            <span className="font-bold text-xs">
              {selectedIds.length} product{selectedIds.length > 1 ? "s" : ""} selected
            </span>
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="text-[11px] underline opacity-80 hover:opacity-100 cursor-pointer"
            >
              Deselect All
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="xs"
              variant="secondary"
              disabled={isPending}
              onClick={() => handleBulkSetPublish(true)}
              className="rounded-lg font-bold text-[11px]"
            >
              <Eye className="w-3.5 h-3.5 mr-1" />
              <span>Publish</span>
            </Button>

            <Button
              type="button"
              size="xs"
              variant="secondary"
              disabled={isPending}
              onClick={() => handleBulkSetPublish(false)}
              className="rounded-lg font-bold text-[11px]"
            >
              <EyeOff className="w-3.5 h-3.5 mr-1" />
              <span>Set as Draft</span>
            </Button>

            <Button
              type="button"
              size="xs"
              variant="destructive"
              disabled={isPending}
              onClick={handleBulkDelete}
              className="rounded-lg font-bold text-[11px]"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              <span>Delete ({selectedIds.length})</span>
            </Button>
          </div>
        </div>
      )}

      {/* Products Table */}
      {totalCount === 0 ? (
        <div className="text-center py-20 border border-dashed border-border/60 rounded-3xl bg-card/20 space-y-3">
          <AlertCircle className="w-8 h-8 mx-auto text-muted-foreground" />
          <p className="text-sm font-semibold text-foreground">
            {currentSearch ? `No results found for "${currentSearch}"` : "No products found in this category."}
          </p>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Try adjusting your search terms or switch the status filter tab above.
          </p>
        </div>
      ) : (
        <Card className="rounded-3xl border border-border/50 bg-card/60 backdrop-blur-md overflow-hidden shadow-xs">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="border-border/50 hover:bg-transparent">
                {/* First Column: Checkbox */}
                <TableHead className="w-12 px-4 text-center">
                  <button
                    type="button"
                    onClick={handleSelectAllOnPage}
                    className="p-1 rounded text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                    aria-label="Select all on this page"
                  >
                    {isAllOnPageSelected ? (
                      <CheckSquare className="w-4 h-4 text-primary" />
                    ) : isSomeSelected ? (
                      <MinusSquare className="w-4 h-4 text-primary" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </TableHead>

                <TableHead className="w-[42%] px-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Product</TableHead>
                <TableHead className="px-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Category</TableHead>
                <TableHead className="px-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Price</TableHead>
                <TableHead className="px-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</TableHead>
                <TableHead className="px-4 text-right text-xs font-bold uppercase tracking-wider text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((prod) => {
                const isSelected = selectedIds.includes(prod.id);
                return (
                  <TableRow
                    key={prod.id}
                    className={`border-border/40 transition-colors group ${
                      isSelected ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-muted/25"
                    }`}
                  >
                    {/* Checkbox First */}
                    <TableCell className="w-12 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleSelect(prod.id)}
                        className="p-1 rounded text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                        aria-label={`Select ${prod.title}`}
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-primary" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </TableCell>

                    {/* Thumbnail & Product Details */}
                    <TableCell className="px-4 py-4">
                      <div className="flex items-center gap-3.5">
                        <div className="relative w-12 h-12 rounded-xl border border-border/50 bg-muted/50 overflow-hidden flex-shrink-0">
                          {prod.thumbnail ? (
                            <img
                              src={prod.thumbnail}
                              alt=""
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[9px] font-bold uppercase text-muted-foreground">
                              No Img
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/admin/products/${prod.id}/edit`}
                            className="font-semibold text-foreground text-sm hover:underline group-hover:text-primary transition-colors block truncate max-w-[280px] sm:max-w-md"
                          >
                            {prod.title}
                          </Link>
                          <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground mt-0.5">
                            <span className="opacity-70">ID: {prod.id.slice(0, 8)}...</span>
                            <button
                              type="button"
                              onClick={() => handleCopyId(prod.id)}
                              className="hover:text-foreground transition-colors cursor-pointer"
                              title="Copy ID"
                            >
                              {copiedId === prod.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                            </button>
                            <span className="opacity-50">•</span>
                            <span className="opacity-70">v{prod.version}</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    {/* Category */}
                    <TableCell className="px-4">
                      <Badge variant="secondary" className="rounded-full font-medium text-[10px] uppercase border-border/40 px-2.5">
                        {prod.category}
                      </Badge>
                    </TableCell>

                    {/* Price */}
                    <TableCell className="px-4 font-mono font-bold text-foreground text-sm">
                      ${(prod.price / 100).toFixed(2)}
                    </TableCell>

                    {/* 1-Click Interactive Status Badge */}
                    <TableCell className="px-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleQuickTogglePublish(prod.id)}
                          disabled={isPending}
                          title="Click to toggle status"
                          className="cursor-pointer transition-transform hover:scale-105"
                        >
                          {prod.published ? (
                            <Badge variant="default" className="rounded-full text-[9px] font-bold uppercase px-2.5 bg-foreground text-background">
                              Public
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="rounded-full text-[9px] font-bold uppercase px-2.5 text-amber-500 border-amber-500/30 bg-amber-500/10">
                              Draft
                            </Badge>
                          )}
                        </button>
                        {prod.featured && (
                          <Badge variant="outline" className="rounded-full text-[9px] font-bold uppercase px-2 text-amber-500 border-amber-500/30 bg-amber-500/5">
                            ★ Featured
                          </Badge>
                        )}
                      </div>
                    </TableCell>

                    {/* Action Buttons */}
                    <TableCell className="px-4 text-right">
                      <AdminActions 
                        productId={prod.id} 
                        productSlug={prod.slug} 
                        isPublished={prod.published} 
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-border/40 bg-muted/5">
              <div className="text-xs text-muted-foreground font-medium">
                Showing <span className="font-bold text-foreground">{offset + 1}</span> to{" "}
                <span className="font-bold text-foreground">
                  {Math.min(offset + limit, totalCount)}
                </span>{" "}
                of <span className="font-bold text-foreground">{totalCount}</span> products
              </div>
              <div className="flex items-center gap-2">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className={`rounded-xl font-bold cursor-pointer ${currentPage <= 1 ? "pointer-events-none opacity-50" : ""}`}
                >
                  <Link href={getPageLink(currentPage - 1)}>Previous</Link>
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const pageNum = idx + 1;
                    const isCurrent = pageNum === currentPage;
                    return (
                      <Button
                        key={pageNum}
                        asChild
                        variant={isCurrent ? "default" : "outline"}
                        size="sm"
                        className="h-8 w-8 p-0 rounded-xl font-bold cursor-pointer"
                      >
                        <Link href={getPageLink(pageNum)}>{pageNum}</Link>
                      </Button>
                    );
                  })}
                </div>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className={`rounded-xl font-bold cursor-pointer ${currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}`}
                >
                  <Link href={getPageLink(currentPage + 1)}>Next</Link>
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
