"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition, useState, useEffect } from "react";
import { Search } from "lucide-react";
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
    const params = new URLSearchParams(searchParams.toString());
    if (value.trim()) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    params.delete("page"); // Reset page on search submit
    startTransition(() => {
      const targetPath = pathname === "/free" ? "/free" : (pathname === "/" ? "/" : "/search");
      router.push(`${targetPath}?${params.toString()}`, { scroll: false });
    });
  }

  function handleCategorySelect(slug: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (slug === "all") {
      params.delete("category");
    } else {
      params.set("category", slug);
    }
    params.delete("page"); // Reset page on category change
    startTransition(() => {
      const targetPath = pathname === "/free" ? "/free" : "/";
      router.push(`${targetPath}?${params.toString()}`, { scroll: false });
    });
  }

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none flex-1">
        <button
          type="button"
          className={cn(
            "rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer border",
            currentCategory === "all"
              ? "bg-foreground text-background border-foreground font-semibold"
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
              "rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer border whitespace-nowrap",
              currentCategory === cat.slug
                ? "bg-foreground text-background border-foreground font-semibold"
                : "bg-background text-muted-foreground border-border/80 hover:bg-secondary hover:text-foreground"
            )}
            onClick={() => handleCategorySelect(cat.slug)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearchSubmit(searchValue);
        }}
        className="relative group w-full md:w-80"
      >
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-foreground transition-colors" />
        <Input
          placeholder="Filter products or stack..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="pl-9 h-9 w-full rounded-md bg-secondary/30 border-border text-xs focus-visible:bg-background transition-colors"
        />
        {isPending && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        )}
      </form>
    </div>
  );
}
