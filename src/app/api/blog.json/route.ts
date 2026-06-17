import { NextRequest, NextResponse } from "next/server";
import { BLOG_POSTS } from "../../../lib/blog-data";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get("limit");
  const category = searchParams.get("category");
  const slug = searchParams.get("slug");

  try {
    let posts = [...BLOG_POSTS];

    // Filter by slug
    if (slug) {
      posts = posts.filter((p) => p.slug === slug);
    }

    // Filter by category
    if (category) {
      posts = posts.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Apply limit
    if (limit) {
      const limitNum = parseInt(limit);
      if (!isNaN(limitNum)) {
        posts = posts.slice(0, limitNum);
      }
    }

    const publicPosts = posts.map((post) => ({
      ...post,
      url: `https://scriptly.store/blog/${post.slug}`,
    }));

    return NextResponse.json({
      success: true,
      count: publicPosts.length,
      posts: publicPosts,
    });
  } catch (error) {
    console.error("GET blog.json failed:", error);
    return NextResponse.json(
      { error: "Server error fetching blog posts." },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
