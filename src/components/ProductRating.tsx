"use client";

import { useState, useTransition } from "react";
import { Star } from "lucide-react";
import { rateProductAction } from "@/lib/actions/products";
import { toast } from "sonner";

interface ProductRatingProps {
  productId: string;
  initialRating: string; // e.g. "4.8"
}

export default function ProductRating({ productId, initialRating }: ProductRatingProps) {
  const [rating, setRating] = useState(parseFloat(initialRating));
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleRate = (value: number) => {
    startTransition(async () => {
      try {
        const res = await rateProductAction(productId, value);
        if (res.success && res.rating) {
          setRating(parseFloat(res.rating));
          toast.success("Thank you for your rating!");
        } else {
          toast.error("Failed to submit rating.");
        }
      } catch (err: any) {
        toast.error(err.message || "Something went wrong.");
      }
    });
  };

  return (
    <div className="flex items-center gap-3 py-1 text-xs">
      {/* Interactive Star Row */}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((value) => {
          const isStarred = hoverRating !== null ? value <= hoverRating : value <= Math.round(rating);
          return (
            <button
              key={value}
              type="button"
              disabled={isPending}
              onClick={() => handleRate(value)}
              onMouseEnter={() => setHoverRating(value)}
              onMouseLeave={() => setHoverRating(null)}
              className={`p-0.5 transition-transform hover:scale-125 disabled:opacity-50 cursor-pointer ${
                isStarred ? "text-amber-400" : "text-muted-foreground/30 hover:text-amber-400/60"
              }`}
              title={`Rate ${value} stars`}
            >
              <Star className="w-4 h-4 fill-current" />
            </button>
          );
        })}
      </div>

      {/* Dynamic Display Score */}
      <div className="flex items-center gap-1.5 font-medium">
        <span className="font-mono font-bold text-foreground">
          {rating.toFixed(1)}
        </span>
        <span className="text-[10px] text-muted-foreground">
          ({hoverRating ? `Rate ${hoverRating}★` : "Verified Rating"})
        </span>
      </div>
    </div>
  );
}
