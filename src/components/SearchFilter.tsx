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
        <Search className="absolute left-4 w-4 h-4 text-neutral-500 group-focus-within:text-white transition-colors" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-lg border border-neutral-800 bg-black text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition-colors"
        />
        {isPending && (
          <div className="absolute right-4 w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        )}
      </form>

      {/* Category Tabs */}
      <div className="flex items-center space-x-4 overflow-x-auto pb-2 scrollbar-none mask-image">
        <button
          onClick={() => handleCategorySelect("all")}
          className={`text-sm font-medium transition-colors whitespace-nowrap ${
            currentCategory === "all"
              ? "text-white"
              : "text-neutral-500 hover:text-neutral-300"
          }`}
        >
          All Items
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategorySelect(cat.slug)}
            className={`text-sm font-medium transition-colors whitespace-nowrap ${
              currentCategory === cat.slug
                ? "text-white"
                : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
