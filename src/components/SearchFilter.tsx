"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useState, useEffect } from "react";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";

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
      // If we are not on home, redirect to search page
      const targetPath = window.location.pathname === "/" ? "/" : "/search";
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
    startTransition(() => {
      router.push(`/?${params.toString()}`, { scroll: false });
    });
  }

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearchSubmit(searchValue);
        }}
        className="relative group"
      >
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-foreground transition-colors z-10" />
        <Input
          placeholder="Search products..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="pl-10 h-11 bg-background border-border rounded-xl focus-visible:ring-1 focus-visible:ring-ring"
        />
        {isPending && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        )}
      </form>

      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        <Badge
          variant={currentCategory === "all" ? "default" : "outline"}
          className="cursor-pointer px-4 py-1 rounded-full text-[11px] uppercase tracking-wider"
          onClick={() => handleCategorySelect("all")}
        >
          All
        </Badge>
        {categories.map((cat) => (
          <Badge
            key={cat.id}
            variant={currentCategory === cat.slug ? "default" : "outline"}
            className="cursor-pointer px-4 py-1 rounded-full text-[11px] uppercase tracking-wider whitespace-nowrap"
            onClick={() => handleCategorySelect(cat.slug)}
          >
            {cat.name}
          </Badge>
        ))}
      </div>
    </div>
  );
}

export function ProductCard({ prod, categoryName }: { prod: any, categoryName: string }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card 
      className="border-border bg-card group overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${prod.slug}`}>
        <AspectRatio ratio={4 / 3} className="overflow-hidden bg-muted">
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
            <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground uppercase font-mono">
              {prod.category}
            </div>
          )}
        </AspectRatio>
      </Link>
      
      <CardHeader className="p-5 pb-0 space-y-2">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-[10px] uppercase border-border text-muted-foreground font-normal rounded-md px-1.5 h-4">
            {categoryName}
          </Badge>
          <span className="text-sm font-semibold text-foreground">
            ₹{(prod.price / 100).toLocaleString("en-IN")}
          </span>
        </div>
        <Link href={`/products/${prod.slug}`}>
          <h3 className="font-medium text-foreground hover:underline underline-offset-4 decoration-muted-foreground transition-all">
            {prod.title}
          </h3>
        </Link>
      </CardHeader>
      
      <CardContent className="p-5 pt-2">
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {prod.shortDescription}
        </p>
      </CardContent>

      <CardFooter className="p-5 pt-0 flex items-center justify-between border-t-0 bg-transparent">
        <span className="text-[10px] text-muted-foreground font-mono">v{prod.version}</span>
        <Button asChild variant="link" size="xs" className="p-0 h-auto text-foreground font-medium">
          <Link href={`/products/${prod.slug}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
