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
    params.delete("page"); // Reset page on category change
    startTransition(() => {
      router.push(`/?${params.toString()}`, { scroll: false });
    });
  }

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none flex-1">
        <Button
          variant={currentCategory === "all" ? "default" : "ghost"}
          size="sm"
          className="rounded-full h-9 px-4 text-[11px] uppercase tracking-wider font-bold transition-all"
          onClick={() => handleCategorySelect("all")}
        >
          All
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat.id}
            variant={currentCategory === cat.slug ? "default" : "ghost"}
            size="sm"
            className="rounded-full h-9 px-4 text-[11px] uppercase tracking-wider font-bold whitespace-nowrap transition-all"
            onClick={() => handleCategorySelect(cat.slug)}
          >
            {cat.name}
          </Button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearchSubmit(searchValue);
        }}
        className="relative group w-full md:w-80"
      >
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-foreground transition-colors z-10" />
        <Input
          placeholder="Filter products..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="pl-10 h-10 bg-muted/30 border-transparent rounded-full focus-visible:bg-background focus-visible:ring-1 focus-visible:ring-border transition-all"
        />
        {isPending && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        )}
      </form>
    </div>
  );
}

export function ProductCard({ prod, categoryName }: { prod: any, categoryName: string }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card 
      className="border-border/50 bg-card group overflow-hidden transition-all duration-300 hover:border-foreground/20 hover:shadow-2xl hover:shadow-foreground/5 rounded-2xl flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${prod.slug}`} className="block relative overflow-hidden">
        <AspectRatio ratio={4 / 3} className="bg-muted">
          {prod.thumbnail && (
            <Image
              src={prod.thumbnail}
              alt={prod.title}
              fill
              className={`object-cover transition-transform duration-700 group-hover:scale-105 ${isHovered && prod.previewGif ? 'opacity-0' : 'opacity-100'}`}
            />
          )}
          {prod.previewGif && (
             <div className={`absolute inset-0 transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <Image
                  src={prod.previewGif}
                  alt={`${prod.title} preview`}
                  fill
                  className="object-cover"
                  unoptimized
                />
             </div>
          )}
          {!prod.thumbnail && !prod.previewGif && (
            <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground uppercase font-bold tracking-widest bg-muted/50">
              {prod.category}
            </div>
          )}
        </AspectRatio>
        
        {/* Floating Category Label */}
        <div className="absolute top-4 left-4 z-20">
          <Badge variant="secondary" className="bg-background/80 backdrop-blur-md border-transparent text-[9px] uppercase font-black tracking-widest px-2 py-0.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
            {categoryName}
          </Badge>
        </div>
      </Link>
      
      <div className="flex flex-col flex-1 p-6 space-y-4">
        <div className="space-y-2 flex-1">
          <div className="flex items-center justify-between gap-4">
             <Link href={`/products/${prod.slug}`} className="flex-1">
                <h3 className="font-bold text-lg text-foreground tracking-tight line-clamp-1 group-hover:underline underline-offset-4 decoration-border transition-all">
                  {prod.title}
                </h3>
             </Link>
             <span className="text-sm font-black text-foreground tabular-nums">
                ${(prod.price / 100).toFixed(2)}
             </span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed font-medium">
            {prod.shortDescription}
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border/40">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[9px] h-5 rounded-full border-border/60 text-muted-foreground font-mono">
              v{prod.version}
            </Badge>
            {prod.featured && (
               <Badge variant="default" className="text-[9px] h-5 rounded-full px-1.5 uppercase font-black tracking-tighter">
                  Pro
               </Badge>
            )}
          </div>
          <Button asChild variant="link" size="xs" className="p-0 h-auto text-foreground font-bold uppercase tracking-widest text-[10px] hover:no-underline hover:text-muted-foreground transition-colors">
            <Link href={`/products/${prod.slug}`}>Details</Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
