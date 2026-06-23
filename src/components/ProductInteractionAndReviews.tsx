"use client";

import { useState, useEffect, useTransition } from "react";
import { 
  Eye, Download, Heart, Star, Send, ShieldCheck, 
  MessageSquare, Loader2, Sparkles 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  incrementViewAction, 
  toggleInteractionAction, 
  checkInteractionStatusAction, 
  submitReviewAction, 
  getProductReviewsAction 
} from "../lib/actions/interactions";

interface Review {
  id: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: Date | string;
  user: {
    name: string | null;
    email: string;
  };
}

interface ProductInteractionAndReviewsProps {
  productId: string;
  initialViews: number;
  initialDownloads: number;
  initialSaves: number;
  initialRating: string;
  initialRatingCount: number;
  userLoggedIn: boolean;
}

export default function ProductInteractionAndReviews({
  productId,
  initialViews,
  initialDownloads,
  initialSaves,
  initialRating,
  initialRatingCount,
  userLoggedIn
}: ProductInteractionAndReviewsProps) {
  const [views, setViews] = useState(initialViews);
  const [downloads, setDownloads] = useState(initialDownloads);
  const [saves, setSaves] = useState(initialSaves);
  const [isSaved, setIsSaved] = useState(false);
  const [reviewsList, setReviewsList] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  // Review Form state
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState("");
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  // Load reviews and check interaction status
  useEffect(() => {
    // 1. Increment views on mount
    incrementViewAction(productId).then((res) => {
      if (res.success) {
        setViews((prev) => prev + 1);
      }
    });

    // 2. Fetch reviews
    getProductReviewsAction(productId).then((res) => {
      if (res.reviews) {
        setReviewsList(res.reviews);
      }
      setLoadingReviews(false);
    });

    // 3. Check interaction status
    if (userLoggedIn) {
      checkInteractionStatusAction(productId).then((res) => {
        setIsSaved(res.isSaved);
      });
    }
  }, [productId, userLoggedIn]);

  const handleToggleSave = async () => {
    if (!userLoggedIn) {
      toast.error("Please sign in to save products to your library!");
      return;
    }

    try {
      const res = await toggleInteractionAction(productId, "save");
      if (res.error) {
        toast.error(res.error);
        return;
      }

      if (res.success) {
        setIsSaved(res.active || false);
        setSaves((prev) => (res.active ? prev + 1 : Math.max(0, prev - 1)));
        toast.success(res.active ? "Added to saved items!" : "Removed from saved items.");
      }
    } catch {
      toast.error("Failed to update save status.");
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userLoggedIn) {
      toast.error("Please sign in to write a review!");
      return;
    }

    if (!commentInput.trim()) {
      toast.error("Review comment cannot be empty.");
      return;
    }

    startTransition(async () => {
      const res = await submitReviewAction(productId, ratingInput, commentInput);
      if (res.error) {
        toast.error(res.error);
        return;
      }

      toast.success("Review submitted successfully! Thank you.");
      setCommentInput("");

      // Reload reviews list
      const freshReviews = await getProductReviewsAction(productId);
      if (freshReviews.reviews) {
        setReviewsList(freshReviews.reviews);
      }
    });
  };

  return (
    <div className="space-y-12">
      {/* 1. Real-time Interaction counters */}
      <div className="flex flex-wrap items-center gap-6 p-4 rounded-2xl border border-border/40 bg-card/45 backdrop-blur-md">
        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
          <Eye className="w-4 h-4 text-primary" />
          <span>{views} Views</span>
        </div>
        <div className="w-1.5 h-1.5 rounded-full bg-border/40" />
        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
          <Download className="w-4 h-4 text-emerald-500" />
          <span>{downloads} Downloads</span>
        </div>
        <div className="w-1.5 h-1.5 rounded-full bg-border/40" />
        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500/10" />
          <span>{saves} Saves</span>
        </div>

        <div className="sm:ml-auto">
          <Button
            onClick={handleToggleSave}
            variant="outline"
            size="sm"
            className={`rounded-xl font-bold uppercase tracking-wider text-[10px] h-9 px-4 transition-all duration-300 ${
              isSaved 
                ? "bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20" 
                : "border-border hover:bg-muted"
            }`}
          >
            <Heart className={`w-3.5 h-3.5 mr-2 ${isSaved ? "fill-rose-400" : ""}`} />
            {isSaved ? "Saved" : "Save Later"}
          </Button>
        </div>
      </div>

      {/* 2. Reviews Section */}
      <div className="space-y-6 pt-6 border-t border-border/40">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Builder Reviews & Feedback
          </h3>
          <Badge variant="secondary" className="rounded-full px-3 font-bold bg-muted/80">
            {reviewsList.length} {reviewsList.length === 1 ? "Review" : "Reviews"}
          </Badge>
        </div>

        {/* Write a review Form */}
        <div className="p-6 border-2 border-border bg-card/65 backdrop-blur-md rounded-[2rem] space-y-6">
          <h4 className="text-sm font-black uppercase tracking-wider text-foreground flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#CE82FF]" /> Share Your Feedback
          </h4>

          {userLoggedIn ? (
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Your Rating
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRatingInput(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="p-1 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star 
                        className={`w-6 h-6 transition-colors ${
                          star <= (hoverRating ?? ratingInput) 
                            ? "text-amber-400 fill-amber-400" 
                            : "text-muted-foreground/40"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Your Review
                </label>
                <textarea
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="What did you think of this product? Mention code quality, usability, or features..."
                  rows={3}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/45 transition-all resize-none"
                />
              </div>

              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={isPending}
                  className="rounded-xl font-bold uppercase tracking-wider text-[10px] bg-primary hover:bg-primary/95 text-white h-9 px-6 cursor-pointer"
                >
                  {isPending ? (
                    <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5 mr-2" />
                  )}
                  Submit Review
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-center py-4 space-y-3">
              <p className="text-sm font-medium text-muted-foreground">
                Please sign in to write a review and help the developer community.
              </p>
            </div>
          )}
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {loadingReviews ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            </div>
          ) : reviewsList.length > 0 ? (
            <div className="divide-y divide-border/30">
              {reviewsList.map((review) => {
                const initials = (review.user.name || review.user.email || "AB")
                  .slice(0, 2)
                  .toUpperCase();
                const displayDate = new Date(review.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric"
                });

                return (
                  <div key={review.id} className="py-6 flex gap-4 items-start first:pt-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 border border-primary/20 flex items-center justify-center text-xs font-black text-primary shrink-0 select-none">
                      {initials}
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-bold text-foreground">
                            {review.user.name || "Verified Builder"}
                          </p>
                          <span className="text-[10px] text-muted-foreground font-semibold">
                            {review.user.name ? review.user.email.replace(/(.{3})(.*)(@.*)/, "$1***$3") : "Verified Purchase"}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-muted-foreground">
                          {displayDate}
                        </span>
                      </div>
                      
                      {/* Rating stars */}
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star 
                            key={s} 
                            className={`w-3.5 h-3.5 ${
                              s <= review.rating 
                                ? "text-amber-400 fill-amber-400" 
                                : "text-muted-foreground/20"
                            }`} 
                          />
                        ))}
                      </div>

                      <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-border/40 rounded-3xl space-y-2">
              <Star className="w-8 h-8 text-muted-foreground/30 mx-auto" />
              <p className="text-sm font-bold text-muted-foreground">No reviews yet</p>
              <p className="text-xs text-muted-foreground/60">Be the first builder to share your feedback!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
