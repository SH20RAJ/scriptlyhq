"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useState, useEffect } from "react";
import { Search, ListFilter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminOrdersSearchSort() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");
  const currentSort = searchParams.get("sort") || "newest";

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
    params.delete("page");
    startTransition(() => {
      router.push(`/admin/orders?${params.toString()}`, { scroll: false });
    });
  }

  function handleSortChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    params.delete("page");
    startTransition(() => {
      router.push(`/admin/orders?${params.toString()}`, { scroll: false });
    });
  }

  return (
    <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearchSubmit(searchValue);
        }}
        className="relative group w-full md:flex-1"
      >
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-foreground transition-colors z-10" />
        <Input
          placeholder="Search by Order ID, Email, Name or Product..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="pl-10 h-11 bg-card border-border/60 rounded-xl focus-visible:ring-1 focus-visible:ring-primary transition-all text-sm"
        />
        {isPending && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        )}
      </form>

      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap px-1">
          <ListFilter className="w-3.5 h-3.5" />
          Sort By
        </div>
        <Select value={currentSort} onValueChange={handleSortChange}>
          <SelectTrigger className="w-full md:w-48 h-11 bg-card border-border/60 rounded-xl font-medium focus:ring-1 focus:ring-primary">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-border/60 bg-popover">
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="amount_asc">Amount: Low to High</SelectItem>
            <SelectItem value="amount_desc">Amount: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
