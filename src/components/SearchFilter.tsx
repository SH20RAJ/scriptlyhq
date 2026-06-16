"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useState, useEffect } from "react";
import { Search } from "lucide-react";
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

import { useCart } from "./CartContext";
import { getProductEffectivePrice } from "../lib/price-utils";

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
    <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-5 py-2">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none flex-1">
        <Button
          variant={currentCategory === "all" ? "default" : "outline"}
          size="sm"
          className="rounded-full h-9 px-4 text-[11px] uppercase tracking-wider font-extrabold transition-all cursor-pointer"
          onClick={() => handleCategorySelect("all")}
        >
          All
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat.id}
            variant={currentCategory === cat.slug ? "default" : "outline"}
            size="sm"
            className="rounded-full h-9 px-4 text-[11px] uppercase tracking-wider font-extrabold whitespace-nowrap transition-all cursor-pointer"
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
        <Search className="absolute left-1 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors z-5 p-4" />
        <Input
          placeholder="Filter products..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="pl-10 h-10 bg-card border-2 border-border rounded-xl shadow-[0_3px_0_var(--border)] focus-visible:border-primary focus-visible:shadow-[0_3px_0_var(--duo-feather-shadow)] focus-visible:ring-0 transition-all font-bold text-xs"
        />
        {isPending && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        )}
      </form>
    </div>
  );
}

export function ProductCard({ prod, categoryName }: { prod: any, categoryName: string }) {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart, isInCart } = useCart();
  const inCart = isInCart(prod.id);
  const promo = getProductEffectivePrice(prod);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: prod.id,
      title: prod.title,
      slug: prod.slug,
      price: prod.price,
      category: prod.category,
      thumbnail: prod.thumbnail,
    });
  };

  return (
    <Card 
      className="border-border/50 bg-card group overflow-hidden rounded-2xl flex flex-col h-full [--card-spacing:0px] py-0 gap-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${prod.slug}`} className="block relative overflow-hidden rounded-t-[22px]">
        <AspectRatio ratio={4 / 3} className="bg-muted">
          {prod.thumbnail && (
            <img
              src={prod.thumbnail}
              alt={prod.title}
              loading="lazy"
              className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${isHovered && prod.previewGif ? 'opacity-0' : 'opacity-100'}`}
            />
          )}
          {prod.previewGif && (
             <div className={`absolute inset-0 transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <img
                  src={prod.previewGif}
                  alt={`${prod.title} preview`}
                  loading="lazy"
                  className="w-full h-full object-cover"
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
        <div className="absolute top-4.5 left-4.5 z-20">
          <Badge className="bg-background/90 backdrop-blur-md text-foreground border border-border/40 text-[9px] uppercase font-black tracking-widest px-2.5 py-1 rounded-md shadow-sm">
            {categoryName}
          </Badge>
        </div>

        {/* Floating Price & Discount Badge */}
        <div className="absolute top-4.5 right-4.5 z-20 flex flex-col items-end gap-1.5">
          {promo.isFree ? (
            <Badge className="bg-emerald-500 text-white border-none text-[9px] font-black tracking-wider px-2.5 py-1 rounded-md shadow-md uppercase">
              Free
            </Badge>
          ) : (
            <>
              {promo.hasDiscount && (
                <Badge className="bg-[#FF4B4B] text-white border-none text-[8.5px] font-black tracking-widest px-2 py-0.5 rounded-full uppercase shadow-sm">
                  Save {prod.discountPercent}%
                </Badge>
              )}
              <Badge className="bg-foreground text-background border-none text-[10px] font-black tracking-tight px-3 py-1 rounded-md shadow-md">
                ${(promo.effectivePrice / 100).toFixed(2)}
              </Badge>
            </>
          )}
        </div>
      </Link>
      
      <div className="flex flex-col flex-1 p-6 space-y-4">
        <div className="space-y-2 flex-1">
          <div className="space-y-1">
            <Link href={`/products/${prod.slug}`}>
              <h3 className="font-extrabold text-lg text-foreground tracking-tight line-clamp-1 group-hover:underline underline-offset-4 decoration-border transition-all">
                {prod.title}
              </h3>
            </Link>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed font-medium">
            {prod.shortDescription}
          </p>
          {prod.tags && (
            <div className="flex flex-wrap gap-1.5 pt-1.5">
              {prod.tags.split(",").slice(0, 3).map((tag: string) => (
                <Badge key={tag} variant="outline" className="text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-muted/30 text-muted-foreground border border-border/60">
                  {tag.trim()}
                </Badge>
              ))}
            </div>
          )}
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
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="xs" className="h-8 px-2.5 uppercase tracking-widest text-[9px] font-bold rounded-lg cursor-pointer">
              <Link href={`/products/${prod.slug}`}>Details</Link>
            </Button>
            <Button
              onClick={handleAddToCart}
              disabled={inCart}
              variant={inCart ? "secondary" : "default"}
              size="xs"
              className="h-8 px-2.5 font-bold uppercase tracking-widest text-[9px] rounded-lg transition-all cursor-pointer"
            >
              {inCart ? "In Cart" : "Add to Cart"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
