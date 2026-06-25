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
    <div className="flex flex-col gap-2 p-4 rounded-2xl border border-neutral-800 bg-neutral-950/40 backdrop-blur-sm max-w-sm">
      <div className="flex items-center gap-3">
        {/* Interactive Star Row */}
        <div className="flex items-center gap-1.5">
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
                className={`p-1 transition-all transform hover:scale-125 disabled:opacity-50 cursor-pointer ${
                  isStarred ? "text-amber-400" : "text-neutral-700 hover:text-amber-400/60"
                }`}
              >
                <Star className="w-5 h-5 fill-current" />
              </button>
            );
          })}
        </div>

        {/* Dynamic Display Score */}
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-black text-white font-mono">
            {rating.toFixed(1)}
          </span>
          <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">
            / 5.0
          </span>
        </div>
      </div>
      
      <p className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider">
        Click to rate this script
      </p>
    </div>
  );
}
