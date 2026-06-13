"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useState, useEffect } from "react";
import { Search } from "lucide-react";
import Image from "next/image";

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

export function ProductCard({ prod, categoryName }: { prod: any, categoryName: string }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={`/products/${prod.slug}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group flex flex-col justify-between overflow-hidden rounded-xl border border-neutral-800 bg-black transition-colors hover:border-neutral-600"
    >
      <div className="relative aspect-[4/3] w-full bg-neutral-900 border-b border-neutral-800 overflow-hidden">
        {prod.thumbnail && (
          <Image
            src={prod.thumbnail}
            alt={prod.title}
            fill
            className={`object-cover transition-opacity duration-500 ${isHovered && prod.previewGif ? 'opacity-0' : 'opacity-100'}`}
          />
        )}
        {prod.previewGif && isHovered && (
          <Image
            src={prod.previewGif}
            alt={`${prod.title} preview`}
            fill
            className="object-cover opacity-100 transition-opacity duration-500"
            unoptimized
          />
        )}
        {!prod.thumbnail && !prod.previewGif && (
          <div className="w-full h-full flex items-center justify-center text-xs text-neutral-600 uppercase font-mono">
            {prod.category}
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500">
              {categoryName}
            </span>
            <span className="text-sm font-medium text-white">
              ₹{(prod.price / 100).toLocaleString("en-IN")}
            </span>
          </div>
          <h3 className="font-medium text-white group-hover:underline decoration-neutral-500 underline-offset-4 text-base line-clamp-1">
            {prod.title}
          </h3>
          <p className="text-sm text-neutral-400 line-clamp-2 leading-relaxed">
            {prod.shortDescription}
          </p>
        </div>

        <div className="pt-4 flex items-center justify-between border-t border-neutral-900">
          <span className="text-xs text-neutral-600">v{prod.version}</span>
          <div className="inline-flex items-center text-xs font-medium text-white">
            View Details
          </div>
        </div>
      </div>
    </Link>
  );
}
