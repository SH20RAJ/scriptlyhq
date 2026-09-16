"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star, Check } from "lucide-react";
import { useCart } from "@/components/CartContext";
import { getProductEffectivePrice } from "@/lib/price-utils";

export interface ProductCardProps {
  product?: any;
  prod?: any;
  categoryName?: string;
}

export default function ProductCard(props: ProductCardProps) {
  const product = props.product || props.prod;
  const categoryName = props.categoryName;
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart, isInCart } = useCart();
  const inCart = isInCart(product.id);
  const promo = getProductEffectivePrice(product);

  const tagsList: string[] = typeof product?.tags === "string"
    ? product.tags.split(",").map((t: string) => t.trim()).filter(Boolean).slice(0, 3)
    : [];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      title: product.title,
      slug: product.slug,
      price: promo.effectivePrice,
      originalPrice: product.price,
      category: product.category,
      thumbnail: product.thumbnail || null,
    });
  };

  const hasGenuineRating = (product.ratingCount ?? 0) > 0;
  const displayRating = hasGenuineRating ? (product.rating || "5.0") : null;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col justify-between overflow-hidden rounded-lg border border-border/80 bg-card transition-all duration-200 hover:border-foreground/25 hover:shadow-sm"
    >
      <Link href={`/products/${product.slug}`} className="block flex-1">
        {/* Visual Preview Container */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-secondary/50 border-b border-border/60">
          {product.thumbnail ? (
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className={`object-cover transition-transform duration-300 group-hover:scale-[1.02] ${
                isHovered && product.previewGif ? "opacity-0" : "opacity-100"
              }`}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs font-mono text-muted-foreground">
              {categoryName || product.category}
            </div>
          )}

          {/* Hover Preview GIF if available */}
          {product.previewGif && isHovered && (
            <img
              src={product.previewGif}
              alt={`${product.title} animated preview`}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}

          {/* Minimal Badges */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
            <span className="rounded bg-background/90 backdrop-blur-sm px-2 py-0.5 text-[10px] font-medium text-foreground border border-border/80">
              {categoryName || product.category}
            </span>
          </div>

          {promo.isFree && (
            <div className="absolute top-2.5 right-2.5">
              <span className="rounded bg-emerald-500/90 text-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
                Free
              </span>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="flex flex-1 flex-col p-4">
          <div className="space-y-1.5">
            <h3 className="font-medium text-sm text-foreground tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
              {product.title}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {product.shortDescription}
            </p>
          </div>

          {/* Tech Stack Pills */}
          {tagsList.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-1">
              {tagsList.map((tag) => (
                <span
                  key={tag}
                  className="rounded px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground bg-secondary/80 border border-border/40"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>

      {/* Footer / Pricing & Actions */}
      <div className="flex items-center justify-between border-t border-border/50 px-4 py-2.5 bg-secondary/20">
        <div className="flex items-center gap-2">
          {promo.isFree ? (
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
              $0.00
            </span>
          ) : (
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-semibold text-foreground font-mono">
                ${(promo.effectivePrice / 100).toFixed(2)}
              </span>
              {promo.hasDiscount && (
                <span className="text-xs text-muted-foreground line-through font-mono">
                  ${(product.price / 100).toFixed(2)}
                </span>
              )}
            </div>
          )}

          {displayRating && (
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground border-l border-border/60 pl-2">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span>{displayRating}</span>
              <span className="text-[10px]">({product.ratingCount})</span>
            </div>
          )}
        </div>

        <Button
          type="button"
          size="xs"
          variant={inCart ? "secondary" : "outline"}
          onClick={handleAddToCart}
          className="h-7 px-2 text-[11px]"
          aria-label={inCart ? "In Cart" : "Add to Cart"}
        >
          {inCart ? (
            <>
              <Check className="h-3 w-3 mr-1 text-primary" />
              <span>Added</span>
            </>
          ) : (
            <>
              <ShoppingCart className="h-3 w-3 mr-1" />
              <span>Add</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
