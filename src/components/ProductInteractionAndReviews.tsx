"use client";

import { useState, useEffect, useTransition } from "react";
import { Eye, Download, Heart, Star, Send, MessageSquare, Loader2, Sparkles, CornerDownRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { incrementViewAction, toggleInteractionAction, checkInteractionStatusAction, submitReviewAction, getProductReviewsAction, toggleReviewLikeAction } from "@/lib/actions/interactions";

interface Review {
  id: string;
  userId: string;
  rating: number;
  comment: string;
  parentId: string | null;
  createdAt: Date | string;
  user: {
    name: string | null;
    email: string;
  };
  likesCount: number;
  userLiked: boolean;
}

interface ProductInteractionAndReviewsProps {
  productId: string;
  initialViews: number;
  initialDownloads: number;
  initialSaves: number;
  initialRating: string;
  initialRatingCount: number;
  userLoggedIn: boolean;
  showStats?: boolean;
}

const QUICK_EMOJIS = ["❤️", "🙌", "🔥", "👏", "😍", "😂", "😮", "💯"];

export default function ProductInteractionAndReviews({
  productId,
  initialViews,
  initialDownloads,
  initialSaves,
  initialRating,
  initialRatingCount,
  userLoggedIn,
  showStats = false
}: ProductInteractionAndReviewsProps) {
  const [views, setViews] = useState(initialViews);
  const [downloads, setDownloads] = useState(initialDownloads);
  const [saves, setSaves] = useState(initialSaves);
  const [isSaved, setIsSaved] = useState(false);
  const [reviewsList, setReviewsList] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  // Review Form states
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState("");
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  
  // Pagination & Loading States
  const [visibleCount, setVisibleCount] = useState(5);

  // Reply Mode states
  const [replyToReview, setReplyToReview] = useState<Review | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({});

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
    loadReviews();

    // 3. Check interaction status
    if (userLoggedIn) {
      checkInteractionStatusAction(productId).then((res) => {
        setIsSaved(res.isSaved);
      });
    }
  }, [productId, userLoggedIn]);

  const loadReviews = async () => {
    const res = await getProductReviewsAction(productId);
    if (res.reviews) {
      setReviewsList(res.reviews as Review[]);
    }
    setLoadingReviews(false);
  };

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

  const handleToggleReviewLike = async (reviewId: string) => {
    if (!userLoggedIn) {
      toast.error("Please sign in to like reviews!");
      return;
    }

    try {
      const res = await toggleReviewLikeAction(reviewId);
      if (res.error) {
        toast.error(res.error);
        return;
      }

      // Update local state immediately for instant feedback
      setReviewsList((prevList) => 
        prevList.map((r) => {
          if (r.id === reviewId) {
            const nextLiked = !r.userLiked;
            return {
              ...r,
              userLiked: nextLiked,
              likesCount: nextLiked ? r.likesCount + 1 : Math.max(0, r.likesCount - 1),
            };
          }
          return r;
        })
      );
    } catch {
      toast.error("Failed to like review.");
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userLoggedIn) {
      toast.error("Please sign in to post!");
      return;
    }

    if (!commentInput.trim()) {
      toast.error("Comment cannot be empty.");
      return;
    }

    startTransition(async () => {
      const parentId = replyToReview?.id;
      // If it's a reply, we set the rating to 5 (standard default) to avoid affecting average
      const rating = parentId ? 5 : ratingInput;

      const res = await submitReviewAction(productId, rating, commentInput, parentId);
      if (res.error) {
        toast.error(res.error);
        return;
      }

      toast.success(parentId ? "Reply submitted successfully!" : "Review submitted successfully!");
      setCommentInput("");
      setReplyToReview(null);

      // Reload reviews
      await loadReviews();
    });
  };

  const handleEmojiClick = (emoji: string) => {
    setCommentInput((prev) => prev + emoji);
  };

  const toggleRepliesVisibility = (reviewId: string) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  // Process comments into hierarchy
  const parentReviews = reviewsList.filter((r) => !r.parentId);
  const repliesMap = reviewsList.reduce<Record<string, Review[]>>((acc, r) => {
    if (r.parentId) {
      if (!acc[r.parentId]) acc[r.parentId] = [];
      acc[r.parentId].push(r);
    }
    return acc;
  }, {});

  // Pagination slice
  const paginatedParents = parentReviews.slice(0, visibleCount);
  const hasMore = parentReviews.length > visibleCount;

  return (
    <div className="space-y-12">
      {/* 1. Real-time Interaction counters */}
      <div className="flex flex-wrap items-center gap-6 p-4 rounded-2xl border border-border/40 bg-card/45 backdrop-blur-md">
        {showStats && (
          <>
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
          </>
        )}

        <div className={showStats ? "sm:ml-auto" : "w-full flex justify-end"}>
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
            {parentReviews.length} {parentReviews.length === 1 ? "Review" : "Reviews"}
          </Badge>
        </div>

        {/* Input Box for review / reply */}
        <div id="review-input-form" className="p-6 border-2 border-border bg-card/65 backdrop-blur-md rounded-[2rem] space-y-4">
          {replyToReview && (
            <div className="flex items-center justify-between px-3.5 py-2 bg-[#1CB0F6]/10 border border-[#1CB0F6]/20 rounded-xl text-xs text-[#1CB0F6] font-bold animate-in slide-in-from-top-2 duration-200">
              <span className="flex items-center gap-1.5">
                <CornerDownRight className="w-3.5 h-3.5" />
                Replying to @{replyToReview.user.name || "Verified Builder"}
              </span>
              <button 
                onClick={() => setReplyToReview(null)}
                className="p-1 hover:bg-white/10 rounded-full cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <h4 className="text-sm font-black uppercase tracking-wider text-foreground flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#CE82FF]" /> 
            {replyToReview ? "Post a Reply" : "Share Your Feedback"}
          </h4>

          {userLoggedIn ? (
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              {!replyToReview && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
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
              )}

              {/* Instagram Emoji Quick added bar */}
              <div className="flex flex-wrap items-center gap-1.5 pb-1">
                <span className="text-[9px] font-black uppercase tracking-wider text-muted-foreground mr-1">Quick Emojis:</span>
                {QUICK_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => handleEmojiClick(emoji)}
                    className="h-7 w-7 flex items-center justify-center text-sm rounded-lg hover:bg-white/10 cursor-pointer transition-colors active:scale-95"
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <textarea
                  id="review-comment-textarea"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder={replyToReview ? "Write a reply..." : "What did you think of this product? Mention code quality, usability, or features..."}
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
                  {replyToReview ? "Reply" : "Submit"}
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
        <div className="space-y-6">
          {loadingReviews ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            </div>
          ) : paginatedParents.length > 0 ? (
            <div className="divide-y divide-border/30">
              {paginatedParents.map((review) => {
                const initials = (review.user.name || review.user.email || "AB")
                  .slice(0, 2)
                  .toUpperCase();
                const displayDate = new Date(review.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric"
                });

                const childReplies = repliesMap[review.id] || [];
                const showRepliesList = expandedReplies[review.id] || false;

                return (
                  <div key={review.id} className="py-6 space-y-4 first:pt-0">
                    <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 border border-primary/20 flex items-center justify-center text-xs font-black text-primary shrink-0 select-none">
                        {initials}
                      </div>
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <p className="text-sm font-bold text-foreground truncate">
                              {review.user.name || "Verified Builder"}
                            </p>
                            <span className="text-[10px] text-muted-foreground font-semibold block">
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

                        {/* Interactive Buttons (Instagram Style: Like & Reply) */}
                        <div className="flex items-center gap-4.5 pt-2 text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                          {/* Likes Count & Button */}
                          <button
                            onClick={() => handleToggleReviewLike(review.id)}
                            className={`flex items-center gap-1 hover:text-rose-400 transition-colors cursor-pointer ${review.userLiked ? 'text-rose-500' : ''}`}
                          >
                            <Heart className={`w-3.5 h-3.5 ${review.userLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                            <span>{review.likesCount} {review.likesCount === 1 ? 'like' : 'likes'}</span>
                          </button>

                          {/* Reply Button */}
                          <button
                            onClick={() => {
                              if (!userLoggedIn) {
                                toast.error("Please sign in to reply!");
                                return;
                              }
                              setReplyToReview(review);
                              const reviewInputSection = document.getElementById("review-input-form");
                              reviewInputSection?.scrollIntoView({ behavior: "smooth" });
                              setTimeout(() => {
                                document.getElementById("review-comment-textarea")?.focus();
                              }, 100);
                            }}
                            className="hover:text-primary transition-colors cursor-pointer"
                          >
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Replies Drawer Section */}
                    {childReplies.length > 0 && (
                      <div className="pl-12 space-y-3">
                        <button
                          onClick={() => toggleRepliesVisibility(review.id)}
                          className="text-[10px] font-black uppercase tracking-widest text-[#1CB0F6] hover:underline cursor-pointer flex items-center gap-1.5"
                        >
                          <CornerDownRight className="w-3.5 h-3.5" />
                          {showRepliesList ? "Hide Replies" : `View Replies (${childReplies.length})`}
                        </button>

                        {showRepliesList && (
                          <div className="space-y-4 pl-4 border-l-2 border-border/30 animate-in slide-in-from-top-2 duration-200">
                            {childReplies.map((reply) => {
                              const rInitials = (reply.user.name || reply.user.email || "AB")
                                .slice(0, 2)
                                .toUpperCase();
                              const rDate = new Date(reply.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric"
                              });

                              return (
                                <div key={reply.id} className="flex gap-3 items-start py-2">
                                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neutral-800 to-neutral-900 border border-border/50 flex items-center justify-center text-[10px] font-black text-muted-foreground shrink-0 select-none">
                                    {rInitials}
                                  </div>
                                  <div className="space-y-1 flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                      <p className="text-xs font-bold text-foreground truncate">
                                        {reply.user.name || "Verified Builder"}
                                      </p>
                                      <span className="text-[9px] font-mono text-muted-foreground">
                                        {rDate}
                                      </span>
                                    </div>
                                    <p className="text-xs font-semibold text-muted-foreground leading-relaxed">
                                      {reply.comment}
                                    </p>
                                    
                                    <div className="flex items-center gap-3 pt-1 text-[9px] font-black uppercase tracking-wider text-muted-foreground">
                                      {/* Reply Like */}
                                      <button
                                        onClick={() => handleToggleReviewLike(reply.id)}
                                        className={`flex items-center gap-1 hover:text-rose-400 transition-colors cursor-pointer ${reply.userLiked ? 'text-rose-500' : ''}`}
                                      >
                                        <Heart className={`w-3 h-3 ${reply.userLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                                        <span>{reply.likesCount} {reply.likesCount === 1 ? 'like' : 'likes'}</span>
                                      </button>
                                      
                                      {/* Reply Button */}
                                      <button
                                        onClick={() => {
                                          if (!userLoggedIn) {
                                            toast.error("Please sign in to reply!");
                                            return;
                                          }
                                          setReplyToReview(review);
                                          setCommentInput(`@${reply.user.name || "builder"} `);
                                          const reviewInputSection = document.getElementById("review-input-form");
                                          reviewInputSection?.scrollIntoView({ behavior: "smooth" });
                                          setTimeout(() => {
                                            document.getElementById("review-comment-textarea")?.focus();
                                          }, 100);
                                        }}
                                        className="hover:text-primary transition-colors cursor-pointer"
                                      >
                                        Reply
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
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

          {/* Load More Pagination Trigger */}
          {hasMore && (
            <div className="flex justify-center pt-4">
              <Button
                onClick={() => setVisibleCount((prev) => prev + 5)}
                variant="outline"
                size="sm"
                className="rounded-xl font-bold uppercase tracking-wider text-[10px] border-border hover:bg-muted"
              >
                Load More Reviews
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
