"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useState, useEffect } from "react";
import { Search } from "lucide-react";

export default function SearchFilter({
  categories,
}: {
  categories: { id: string; name: string; slug: string }[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentCategory = searchParams.get("category") || "all";
  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");

  // Update local input state if URL changes externally
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
    startTransition(() => {
      router.push(`/?${params.toString()}`, { scroll: false });
    });
  }

  function handleCategorySelect(slug: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (slug === "all") {
      params.delete("category");
    } else {
      params.set("category", slug);
    }
    startTransition(() => {
      router.push(`/?${params.toString()}`, { scroll: false });
    });
  }

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto">
      {/* Search Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearchSubmit(searchValue);
        }}
        className="relative flex items-center group"
      >
        <Search className="absolute left-4 w-5 h-5 text-neutral-400 group-focus-within:text-emerald-400 transition-colors" />
        <input
          type="text"
          placeholder="Search products (press Enter to search)..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="w-full pl-12 pr-4 py-4 rounded-xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all shadow-inner"
        />
        {isPending && (
          <div className="absolute right-4 w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
        )}
      </form>

      {/* Category Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none mask-image">
        <button
          onClick={() => handleCategorySelect("all")}
          className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 border ${
            currentCategory === "all"
              ? "bg-neutral-100 text-neutral-950 border-neutral-100 shadow-md scale-105"
              : "bg-neutral-900/30 text-neutral-400 border-neutral-800 hover:border-neutral-700 hover:text-neutral-200"
          }`}
        >
          All Items
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategorySelect(cat.slug)}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 whitespace-nowrap border ${
              currentCategory === cat.slug
                ? "bg-neutral-100 text-neutral-950 border-neutral-100 shadow-md scale-105"
                : "bg-neutral-900/30 text-neutral-400 border-neutral-800 hover:border-neutral-700 hover:text-neutral-200"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
