"use client";

import useSWR from "swr";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

import { Trash, Plus, FolderKanban, Loader2, AlertCircle, CheckCircle2, ChevronRight } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Subcategory {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  subcategories: Subcategory[];
}

export default function AdminCategoriesClient() {
  const { data, error, mutate, isLoading } = useSWR<any>("/api/admin/categories", fetcher);
  const [catNameInput, setCatNameInput] = useState("");
  const [catSlugInput, setCatSlugInput] = useState("");

  const [subNameInput, setSubNameInput] = useState("");
  const [subSlugInput, setSubSlugInput] = useState("");
  const [selectedCatId, setSelectedCatId] = useState("");

  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [actionPending, setActionPending] = useState(false);

  const handleCreate = async (e: React.FormEvent, type: "category" | "subcategory") => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    const name = type === "category" ? catNameInput : subNameInput;
    const slug = type === "category" ? catSlugInput : subSlugInput;

    if (!name.trim() || !slug.trim()) {
      setFormError("Both name and slug are required.");
      return;
    }

    if (type === "subcategory" && !selectedCatId) {
      setFormError("Please select a parent category for the subcategory.");
      return;
    }

    setActionPending(true);

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          name: name.trim(),
          slug: slug.trim(),
          categoryId: type === "subcategory" ? selectedCatId : undefined,
        }),
      });

      const result = (await res.json()) as any;
      if (!res.ok || !result.success) {
        setFormError(result.error || "Failed to create category or subcategory.");
      } else {
        setFormSuccess(`Successfully created ${type}!`);
        if (type === "category") {
          setCatNameInput("");
          setCatSlugInput("");
        } else {
          setSubNameInput("");
          setSubSlugInput("");
        }
        mutate();
      }
    } catch (err) {
      console.error(err);
      setFormError("An unexpected error occurred.");
    } finally {
      setActionPending(false);
    }
  };

  const handleDelete = async (id: string, type: "category" | "subcategory") => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/categories/${id}?type=${type}`, {
        method: "DELETE",
      });
      if (res.ok) {
        mutate();
      }
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      {/* Create Panel Form */}
      <div className="lg:col-span-5 space-y-8">
        {/* Create Category Form */}
        <Card className="border-border/50 bg-card/50 rounded-2xl">
          <CardHeader className="p-6 pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">New Category</CardTitle>
            <CardDescription className="text-xs">Create a new core product category.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-4">
            <form onSubmit={(e) => handleCreate(e, "category")} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Category Name</label>
                <input
                  type="text"
                  placeholder="e.g. Graphic Kits"
                  value={catNameInput}
                  onChange={(e) => setCatNameInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-800 bg-black text-white text-sm focus:border-neutral-600 outline-none font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Slug</label>
                <input
                  type="text"
                  placeholder="e.g. graphic-kits"
                  value={catSlugInput}
                  onChange={(e) => setCatSlugInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-800 bg-black text-white text-sm focus:border-neutral-600 outline-none font-bold font-mono"
                />
              </div>

              <Button
                type="submit"
                disabled={actionPending}
                className="w-full h-10 rounded-xl font-bold uppercase tracking-wider text-[10px] cursor-pointer"
              >
                {actionPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                Add Category
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Create Subcategory Form */}
        <Card className="border-border/50 bg-card/50 rounded-2xl">
          <CardHeader className="p-6 pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">New Subcategory</CardTitle>
            <CardDescription className="text-xs">Create a nested subcategory under a parent category.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-4">
            <form onSubmit={(e) => handleCreate(e, "subcategory")} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Parent Category</label>
                <select
                  value={selectedCatId}
                  onChange={(e) => setSelectedCatId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-800 bg-black text-white text-sm focus:border-neutral-600 outline-none font-bold cursor-pointer"
                >
                  <option value="">Select Parent Category...</option>
                  {data?.categories?.map((cat: Category) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Subcategory Name</label>
                <input
                  type="text"
                  placeholder="e.g. SaaS Landing Pages"
                  value={subNameInput}
                  onChange={(e) => setSubNameInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-800 bg-black text-white text-sm focus:border-neutral-600 outline-none font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Slug</label>
                <input
                  type="text"
                  placeholder="e.g. saas-landing-pages"
                  value={subSlugInput}
                  onChange={(e) => setSubSlugInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-800 bg-black text-white text-sm focus:border-neutral-600 outline-none font-bold font-mono"
                />
              </div>

              <Button
                type="submit"
                disabled={actionPending}
                className="w-full h-10 rounded-xl font-bold uppercase tracking-wider text-[10px] cursor-pointer"
              >
                {actionPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                Add Subcategory
              </Button>
            </form>
          </CardContent>
        </Card>

        {formError && (
          <div className="flex items-center gap-2 text-xs text-destructive bg-destructive/10 border border-destructive/20 px-3 py-2 rounded-xl">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {formSuccess && (
          <div className="flex items-center gap-2 text-xs text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-xl">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{formSuccess}</span>
          </div>
        )}
      </div>

      {/* Categories Grid List */}
      <div className="lg:col-span-7 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground">Categories & Subcategories</h2>
          <span className="text-[10px] font-mono text-muted-foreground">
            {isLoading ? "Syncing..." : `${data?.categories?.length || 0} Categories`}
          </span>
        </div>

        {isLoading ? (
          <div className="py-20 text-center space-y-2 border border-border/40 rounded-3xl bg-card/25">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground/30 mx-auto" />
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Loading Catalog Schema</p>
          </div>
        ) : error ? (
          <div className="py-20 text-center space-y-2 border border-destructive/20 rounded-3xl bg-destructive/5">
            <AlertCircle className="w-8 h-8 text-destructive/40 mx-auto" />
            <p className="text-xs font-bold text-destructive uppercase tracking-widest">Failed to load categories</p>
          </div>
        ) : (
          <div className="space-y-6">
            {data.categories.map((cat: Category) => (
              <Card key={cat.id} className="border-border/50 bg-card/30 rounded-3xl overflow-hidden shadow-sm">
                <CardHeader className="p-6 pb-4 border-b border-border/40 flex flex-row justify-between items-center bg-muted/10">
                  <div className="flex items-center gap-2">
                    <FolderKanban className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <CardTitle className="text-base font-black uppercase tracking-tight text-foreground">{cat.name}</CardTitle>
                      <CardDescription className="text-[10px] font-mono text-muted-foreground leading-none">slug: {cat.slug}</CardDescription>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleDelete(cat.id, "category")}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full cursor-pointer"
                  >
                    <Trash className="w-3.5 h-3.5" />
                  </Button>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Nested Subcategories</div>
                  {cat.subcategories.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {cat.subcategories.map((sub) => (
                        <div key={sub.id} className="flex justify-between items-center p-3 rounded-xl border border-border/50 bg-black/30 group">
                          <div className="flex items-center gap-2 min-w-0">
                            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-foreground leading-none">{sub.name}</p>
                              <p className="text-[9px] font-mono text-muted-foreground truncate leading-none mt-1">slug: {sub.slug}</p>
                            </div>
                          </div>
                          <Button
                            onClick={() => handleDelete(sub.id, "subcategory")}
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full cursor-pointer flex-shrink-0"
                          >
                            <Trash className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs italic text-muted-foreground font-medium">No subcategories defined for this category.</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
