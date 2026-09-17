"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition, useState, useEffect } from "react";
import { Search, X, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import ProductCard from "@/components/marketplace/ProductCard";

export { ProductCard };

export default function SearchFilter({
  categories,
}: {
  categories: { id: string; name: string; slug: string }[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const currentCategory = searchParams.get("category") || "all";
  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");

  useEffect(() => {
    setSearchValue(searchParams.get("search") || "");
  }, [searchParams]);

  function handleSearchSubmit(value: string) {
    const term = value.trim();
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    params.delete("page");

    startTransition(() => {
      if (pathname.startsWith("/explore")) {
        router.push(`/explore?${params.toString()}`);
      } else if (pathname === "/free") {
        router.push(`/free?${params.toString()}`);
      } else if (pathname === "/search") {
        router.push(`/search?${params.toString()}`);
      } else {
        router.push(`/search?${params.toString()}`);
      }
    });
  }

  function handleCategorySelect(slug: string) {
    if (slug === "all") {
      if (pathname.startsWith("/explore")) {
        router.push("/explore");
      } else {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("category");
        params.delete("page");
        router.push(`${pathname}?${params.toString()}`);
      }
    } else {
      if (pathname.startsWith("/explore")) {
        router.push(`/explore/${slug}`);
      } else {
        const params = new URLSearchParams(searchParams.toString());
        params.set("category", slug);
        params.delete("page");
        router.push(`${pathname}?${params.toString()}`);
      }
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none flex-1">
        <button
          type="button"
          className={cn(
            "rounded-xl px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer border whitespace-nowrap",
            currentCategory === "all"
              ? "bg-foreground text-background border-foreground shadow-sm"
              : "bg-background text-muted-foreground border-border/80 hover:bg-secondary hover:text-foreground"
          )}
          onClick={() => handleCategorySelect("all")}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={cn(
              "rounded-xl px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer border whitespace-nowrap",
              currentCategory === cat.slug
                ? "bg-foreground text-background border-foreground shadow-sm"
                : "bg-background text-muted-foreground border-border/80 hover:bg-secondary hover:text-foreground"
            )}
            onClick={() => handleCategorySelect(cat.slug)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Search Bar with Submit & Clear Button */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearchSubmit(searchValue);
        }}
        className="relative group w-full md:w-80 flex items-center"
      >
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input
          placeholder="Filter scripts or stack..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="pl-9 pr-14 h-9 w-full rounded-xl bg-secondary/40 border-border text-xs focus-visible:bg-background transition-colors font-medium placeholder:text-muted-foreground"
        />

        {searchValue && (
          <button
            type="button"
            onClick={() => {
              setSearchValue("");
              handleSearchSubmit("");
            }}
            className="absolute right-7 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
            title="Clear search"
          >
            <X className="h-3 w-3" />
          </button>
        )}

        <button
          type="submit"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 bg-primary text-primary-foreground rounded-lg hover:brightness-105 transition-all cursor-pointer"
          title="Search"
        >
          {isPending ? (
            <div className="h-3 w-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <ArrowRight className="h-3 w-3" />
          )}
        </button>
      </form>
    </div>
  );
}
