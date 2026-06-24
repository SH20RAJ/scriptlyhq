"use server";

import { db } from "../../db";
import { products, reviews, userInteractions, users, reviewLikes } from "../../db/schema";
import { eq, and, sql, desc, isNull } from "drizzle-orm";
import { getOrCreateDbUser } from "../auth-utils";
import { revalidatePath } from "next/cache";

export async function incrementViewAction(productId: string) {
  try {
    await db
      .update(products)
      .set({
        views: sql`${products.views} + 1`,
      })
      .where(eq(products.id, productId));
    return { success: true };
  } catch (error) {
    console.error("Failed to increment views:", error);
    return { error: "Failed to increment views" };
  }
}

export async function getProductStatsAction(productId: string) {
  try {
    const product = await db.query.products.findFirst({
      where: eq(products.id, productId),
      columns: {
        views: true,
        downloadsCount: true,
        saves: true,
      },
    });
    return { success: true, stats: product || { views: 0, downloadsCount: 0, saves: 0 } };
  } catch (error) {
    console.error("Failed to get product stats:", error);
    return { error: "Failed to get stats" };
  }
}

export async function toggleInteractionAction(productId: string, type: "save" | "like") {
  try {
    const user = await getOrCreateDbUser();
    if (!user) {
      return { error: "Unauthorized: Sign in required." };
    }

    const existing = await db.query.userInteractions.findFirst({
      where: and(
        eq(userInteractions.userId, user.id),
        eq(userInteractions.productId, productId),
        eq(userInteractions.type, type)
      ),
    });

    if (existing) {
      // Remove interaction
      await db
        .delete(userInteractions)
        .where(eq(userInteractions.id, existing.id));

      // Decrement saves count in products
      if (type === "save") {
        await db
          .update(products)
          .set({
            saves: sql`GREATEST(0, ${products.saves} - 1)`,
          })
          .where(eq(products.id, productId));
      }

      return { success: true, active: false };
    } else {
      // Add interaction
      await db.insert(userInteractions).values({
        id: crypto.randomUUID(),
        userId: user.id,
        productId,
        type,
      });

      // Increment saves count in products
      if (type === "save") {
        await db
          .update(products)
          .set({
            saves: sql`${products.saves} + 1`,
          })
          .where(eq(products.id, productId));
      }

      return { success: true, active: true };
    }
  } catch (error: any) {
    console.error("Failed to toggle interaction:", error);
    return { error: error.message || "Failed to update interaction" };
  }
}

export async function checkInteractionStatusAction(productId: string) {
  try {
    const user = await getOrCreateDbUser();
    if (!user) {
      return { isSaved: false, isLiked: false };
    }

    const saved = await db.query.userInteractions.findFirst({
      where: and(
        eq(userInteractions.userId, user.id),
        eq(userInteractions.productId, productId),
        eq(userInteractions.type, "save")
      ),
    });

    const liked = await db.query.userInteractions.findFirst({
      where: and(
        eq(userInteractions.userId, user.id),
        eq(userInteractions.productId, productId),
        eq(userInteractions.type, "like")
      ),
    });

    return { isSaved: !!saved, isLiked: !!liked };
  } catch {
    return { isSaved: false, isLiked: false };
  }
}

export async function submitReviewAction(productId: string, rating: number, comment: string, parentId?: string) {
  try {
    const user = await getOrCreateDbUser();
    if (!user) {
      return { error: "Unauthorized: Sign in required." };
    }

    if (rating < 1 || rating > 5) {
      return { error: "Rating must be between 1 and 5." };
    }

    if (!comment.trim()) {
      return { error: "Comment cannot be empty." };
    }

    const id = crypto.randomUUID();
    await db.insert(reviews).values({
      id,
      userId: user.id,
      productId,
      rating,
      comment: comment.trim(),
      parentId: parentId || null,
    });

    // Only recalculate average rating if it's a top-level review (not a reply)
    if (!parentId) {
      const allReviews = await db.query.reviews.findMany({
        where: and(
          eq(reviews.productId, productId),
          isNull(reviews.parentId)
        ),
      });

      const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
      const avgRating = allReviews.length > 0 ? (totalRating / allReviews.length).toFixed(1) : "5.0";

      await db
        .update(products)
        .set({
          rating: avgRating,
          ratingCount: allReviews.length,
        })
        .where(eq(products.id, productId));
    }

    revalidatePath(`/products/${productId}`);
    return { success: true };
  } catch (error: any) {
    console.error("Failed to submit review:", error);
    return { error: error.message || "Failed to submit review" };
  }
}

export async function toggleReviewLikeAction(reviewId: string) {
  try {
    const user = await getOrCreateDbUser();
    if (!user) {
      return { error: "Unauthorized: Sign in required." };
    }

    const existing = await db.query.reviewLikes.findFirst({
      where: and(
        eq(reviewLikes.userId, user.id),
        eq(reviewLikes.reviewId, reviewId)
      ),
    });

    if (existing) {
      await db.delete(reviewLikes).where(eq(reviewLikes.id, existing.id));
      return { success: true, liked: false };
    } else {
      await db.insert(reviewLikes).values({
        id: crypto.randomUUID(),
        userId: user.id,
        reviewId,
      });
      return { success: true, liked: true };
    }
  } catch (error: any) {
    console.error("Failed to toggle review like:", error);
    return { error: error.message || "Failed to toggle like" };
  }
}

export async function getProductReviewsAction(productId: string) {
  try {
    const user = await getOrCreateDbUser();

    // Fetch all reviews (both top-level and replies)
    const list = await db.query.reviews.findMany({
      where: eq(reviews.productId, productId),
      orderBy: [desc(reviews.createdAt)],
    });

    // Populate user names / emails, like counts, and reply mapping
    const mappedReviews = await Promise.all(
      list.map(async (r) => {
        // User profile
        const u = await db.query.users.findFirst({
          where: eq(users.id, r.userId),
          columns: {
            name: true,
            email: true,
          },
        });

        // Likes count
        const likes = await db.query.reviewLikes.findMany({
          where: eq(reviewLikes.reviewId, r.id),
        });

        // User liked status
        const userLiked = user 
          ? likes.some(l => l.userId === user.id)
          : false;

        return {
          ...r,
          user: u || { name: "Anonymous Builder", email: "anon@scriptly.store" },
          likesCount: likes.length,
          userLiked,
        };
      })
    );

    return { success: true, reviews: mappedReviews };
  } catch (error: any) {
    console.error("Failed to get product reviews:", error);
    return { error: "Failed to get reviews", reviews: [] };
  }
}
