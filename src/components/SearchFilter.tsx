"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition, useState, useEffect } from "react";
import { Search } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";

import { useCart } from "@/components/CartContext";
import { getProductEffectivePrice } from "@/lib/price-utils";

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
      // If we are on '/free', stay on '/free'. If on '/', stay on '/'. Otherwise, fallback to '/search'.
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
  const getCategoryBtnStyle = (slug: string, isActive: boolean) => {
    const baseClass = "rounded-full h-9 px-4.5 text-[9px] uppercase tracking-widest font-black transition-all cursor-pointer border-2 ";
    if (!isActive) {
      return baseClass + "bg-card/45 text-muted-foreground border-border/50 hover:text-foreground hover:border-foreground/30 shadow-[0_3px_0_var(--border)] active:translate-y-[2px] active:shadow-none";
    }
    switch (slug) {
      case "all":
        return baseClass + "bg-primary text-white border-primary shadow-[0_3px_0_#46A302]";
      case "scripts":
        return baseClass + "bg-[#1CB0F6] text-white border-[#1CB0F6] shadow-[0_3px_0_#148FCA]";
      case "saas-templates":
        return baseClass + "bg-[#58CC02] text-white border-[#58CC02] shadow-[0_3px_0_#46A302]";
      case "design-assets":
        return baseClass + "bg-[#CE82FF] text-white border-[#CE82FF] shadow-[0_3px_0_#A85BE2]";
      case "ai-prompts":
        return baseClass + "bg-[#FFC800] text-white border-[#FFC800] shadow-[0_3px_0_#CCA000]";
      case "ebooks":
        return baseClass + "bg-[#FF9600] text-white border-[#FF9600] shadow-[0_3px_0_#CC7800]";
      default:
        return baseClass + "bg-primary text-white border-primary shadow-[0_3px_0_#46A302]";
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-5 py-2">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none flex-1">
        <button
          type="button"
          className={getCategoryBtnStyle("all", currentCategory === "all")}
          onClick={() => handleCategorySelect("all")}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={getCategoryBtnStyle(cat.slug, currentCategory === cat.slug)}
            onClick={() => handleCategorySelect(cat.slug)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearchSubmit(searchValue);
        }}
        className="relative group w-full lg:w-96"
      >
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors z-5" />
        <Input
          placeholder="Search millions of developer scripts..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="pl-10 h-10 w-full bg-card border-2 border-border rounded-xl shadow-[0_3px_0_var(--border)] focus-visible:border-primary focus-visible:shadow-[0_3px_0_var(--duo-feather-shadow)] focus-visible:ring-0 transition-all font-bold text-xs"
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
      price: promo.effectivePrice,
      originalPrice: prod.price,
      category: prod.category,
      thumbnail: prod.thumbnail,
    });
  };

  const getCategoryColor = (slug: string) => {
    switch(slug) {
      case "scripts": return "hover:border-[#1CB0F6]/40 hover:shadow-[#1CB0F6]/10";
      case "saas-templates": return "hover:border-[#58CC02]/40 hover:shadow-[#58CC02]/10";
      case "design-assets": return "hover:border-[#CE82FF]/40 hover:shadow-[#CE82FF]/10";
      case "ai-prompts": return "hover:border-[#FFC800]/40 hover:shadow-[#FFC800]/10";
      case "ebooks": return "hover:border-[#FF9600]/40 hover:shadow-[#FF9600]/10";
      default: return "hover:border-primary/40 hover:shadow-primary/10";
    }
  };

  return (
    <Card 
      className={`border-border bg-card group overflow-hidden rounded-[2rem] flex flex-col h-full shadow-[0_4px_0_var(--border)] dark:shadow-[0_4px_0_#2A3842] hover:translate-y-[-6px] hover:shadow-[0_12px_0_var(--border)] active:translate-y-0.5 active:shadow-none transition-all duration-300 p-0 ${getCategoryColor(prod.category)}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${prod.slug}`} className="block relative overflow-hidden rounded-t-[30px]">
        <AspectRatio ratio={16 / 10} className="bg-muted overflow-hidden">
          {prod.thumbnail && (
            <img
              src={prod.thumbnail}
              alt={prod.title}
              loading="lazy"
              className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${isHovered && prod.previewGif ? 'opacity-0 scale-100' : 'opacity-100'}`}
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
            <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground uppercase font-black tracking-widest bg-muted/40">
              {prod.category}
            </div>
          )}
        </AspectRatio>
        
        {/* Floating Category Label & Star Rating */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5">
          <Badge className="bg-card/90 backdrop-blur-md text-foreground border border-border text-[9px] uppercase font-black tracking-widest px-3 py-1.5 rounded-xl shadow-md">
            {categoryName}
          </Badge>
          <Badge className="bg-[#FFC800] text-white border-none text-[9px] font-black tracking-wider px-2 py-1.5 rounded-xl shadow-md flex items-center gap-0.5">
            ⭐ {prod.rating || "5.0"}
          </Badge>
        </div>

        {/* Floating Price & Discount Badge */}
        <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-1.5">
          {promo.isFree ? (
            <Badge className="bg-emerald-500 text-white border-none text-[9px] font-black tracking-widest px-3 py-1.5 rounded-xl shadow-md uppercase">
              Free
            </Badge>
          ) : (
            <>
              {promo.hasDiscount && (
                <Badge className="bg-[#FF4B4B] text-white border-none text-[8.5px] font-black tracking-widest px-2.5 py-1 rounded-full uppercase shadow-md animate-pulse">
                  Save {prod.discountPercent}%
                </Badge>
              )}
              <Badge className="bg-card/95 backdrop-blur-sm text-foreground border border-border text-[11px] font-black tracking-tight px-3 py-1.5 rounded-xl shadow-md">
                ${(promo.effectivePrice / 100).toFixed(2)}
              </Badge>
            </>
          )}
        </div>
      </Link>
      
      <div className="flex flex-col flex-1 p-6 space-y-5 bg-card">
        <div className="space-y-2 flex-1">
          <Link href={`/products/${prod.slug}`}>
            <h3 className="font-extrabold text-lg text-foreground tracking-tight line-clamp-1 group-hover:text-primary transition-colors leading-snug">
              {prod.title}
            </h3>
          </Link>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed font-bold opacity-85">
            {prod.shortDescription}
          </p>
          {prod.tags && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {prod.tags.split(",").slice(0, 3).map((tag: string) => (
                <Badge key={tag} variant="outline" className="text-[8.5px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-muted/20 text-muted-foreground border border-border/40">
                  #{tag.trim()}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border/40">
          <div className="flex items-center gap-1.5">
            <Badge variant="outline" className="text-[8.5px] h-5.5 rounded-md border-border/40 text-muted-foreground font-mono font-bold">
              v{prod.version}
            </Badge>
            {prod.featured && (
               <Badge variant="default" className="text-[8.5px] h-5.5 rounded-md px-2 bg-gradient-to-r from-yellow-500 to-amber-600 text-white border-none uppercase font-black tracking-wider">
                  Pro
               </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="xs" className="h-8 px-3 uppercase tracking-widest text-[9px] font-black rounded-xl cursor-pointer">
              <Link href={`/products/${prod.slug}`}>Details</Link>
            </Button>
            <Button
              onClick={handleAddToCart}
              disabled={inCart}
              variant={inCart ? "secondary" : "default"}
              size="xs"
              className="h-8 px-3.5 font-black uppercase tracking-widest text-[9px] rounded-xl transition-all cursor-pointer"
            >
              {inCart ? "In Cart" : "Get"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
