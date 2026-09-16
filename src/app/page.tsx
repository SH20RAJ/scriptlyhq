import { Metadata } from "next";
import Link from "next/link";
import { getProductsAction, getCategoriesAction } from "@/lib/actions/products";
import SearchFilter from "@/components/SearchFilter";
import ProductCard from "@/components/marketplace/ProductCard";
import { ProductPagination } from "@/components/ProductPagination";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code2, Download, ShieldCheck, Zap, Sparkles, BookOpen } from "lucide-react";
import { siteConfig } from "@/config/site";
import { BLOG_POSTS } from "@/lib/blog-data";

export const metadata: Metadata = {
  title: `${siteConfig.name} — Premium Developer Marketplace`,
  description: "Ship faster with ready-to-use SaaS templates, automation scripts, browser extensions, and developer tools. Sell code and keep 95% of sales.",
  alternates: {
    canonical: siteConfig.url,
  },
};

interface PageProps {
  searchParams: Promise<{
    category?: string;
    subcategory?: string;
    search?: string;
    priceType?: "all" | "free" | "paid";
    sortBy?: "newest" | "rating" | "price_asc" | "price_desc";
    page?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentCategory = params.category || "all";
  const currentSubcategory = params.subcategory || "";
  const currentSearch = params.search || "";
  const currentPriceType = params.priceType || "all";
  const currentSortBy = params.sortBy || "newest";
  const currentPage = parseInt(params.page || "1", 10);

  // Parallel server-side data fetching
  const [productsData, categories, featuredData] = await Promise.all([
    getProductsAction({
      category: currentCategory,
      subcategory: currentSubcategory,
      search: currentSearch,
      priceType: currentPriceType,
      sortBy: currentSortBy,
      page: currentPage,
      limit: 18,
    }),
    getCategoriesAction(),
    getProductsAction({
      featuredOnly: true,
      limit: 4,
      sortBy: "rating",
    }),
  ]);

  const recentBlogPosts = BLOG_POSTS.slice(0, 3);
  const isFiltering = currentCategory !== "all" || currentSearch !== "" || currentPriceType !== "all";

  return (
    <div className="flex flex-col min-h-screen">
      {/* Schema JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": siteConfig.name,
            "url": siteConfig.url,
            "description": siteConfig.description,
            "potentialAction": {
              "@type": "SearchAction",
              "target": `${siteConfig.url}/search?search={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />

      {/* Hero Section */}
      <section className="border-b border-border/50 bg-gradient-to-b from-secondary/30 via-background to-background py-14 sm:py-20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs font-mono text-muted-foreground shadow-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Developer Marketplace</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.15]">
              Production-ready templates & developer scripts.
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
              Curated SaaS boilerplates, automation workflows, browser extensions, and developer tools.
              Download source code immediately with clear commercial licensing.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button asChild size="default" className="rounded-xl font-bold">
                <Link href="/explore">
                  <span>Browse Products</span>
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="default" className="rounded-xl font-bold">
                <Link href="/creator">
                  <span>Sell Your Code</span>
                </Link>
              </Button>
            </div>
          </div>

          {/* Featured Products Showcase inside Hero */}
          {featuredData.products.length > 0 && (
            <div className="pt-12 sm:pt-16 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-border/40 pt-8">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
                      Handpicked by Editors
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                    Featured Marketplace Products
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Top-rated templates, verified architecture, and instant production boilerplates.
                  </p>
                </div>

                <Button asChild variant="outline" size="sm" className="rounded-xl font-bold text-xs self-start sm:self-auto">
                  <Link href="/featured" className="flex items-center gap-1.5">
                    <span>View More Featured Products</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {featuredData.products.map((product) => {
                  const catObj = categories.find((c) => c.slug === product.category);
                  return (
                    <ProductCard
                      key={product.id}
                      product={product}
                      categoryName={catObj?.name}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Marketplace Catalog Section */}
      <section className="py-10">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 space-y-6">
          {/* Search & Category Filter */}
          <SearchFilter categories={categories} />

          {/* Product Grid Header */}
          <div className="flex items-center justify-between border-b border-border/60 pb-3 text-xs text-muted-foreground">
            <div>
              {isFiltering ? (
                <span>
                  Showing {productsData.total} result{productsData.total === 1 ? "" : "s"}
                  {currentCategory !== "all" ? ` in "${currentCategory}"` : ""}
                  {currentSearch ? ` for "${currentSearch}"` : ""}
                </span>
              ) : (
                <span>All Catalog Solutions ({productsData.total})</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Link href="/free" className="hover:text-foreground transition-colors font-medium">
                Free Tools
              </Link>
              <span>•</span>
              <Link href="/explore" className="hover:text-foreground transition-colors font-medium">
                View All
              </Link>
            </div>
          </div>

          {/* Products Grid */}
          {productsData.products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {productsData.products.map((product) => {
                const catObj = categories.find((c) => c.slug === product.category);
                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    categoryName={catObj?.name}
                  />
                );
              })}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border py-16 text-center space-y-3">
              <p className="text-sm font-medium text-foreground">No products found</p>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                No items match your selected category or search keywords. Try searching for something else or reset your filters.
              </p>
              <Button asChild variant="outline" size="sm">
                <Link href="/">Reset Filters</Link>
              </Button>
            </div>
          )}

          {/* Pagination */}
          <ProductPagination
            totalPages={productsData.totalPages}
            currentPage={productsData.currentPage}
          />
        </div>
      </section>

      {/* Value Pillars / Trust Section */}
      <section className="border-t border-border/60 bg-secondary/30 py-12 sm:py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-background border border-border text-primary">
                <Download className="h-4 w-4" />
              </div>
              <h3 className="font-semibold text-sm text-foreground">Instant Source Delivery</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Direct access to repository archives and ZIP packages immediately upon purchase confirmation. No delayed onboarding.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-background border border-border text-primary">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <h3 className="font-semibold text-sm text-foreground">Transparent Licensing</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Clear personal and commercial license terms. Deploy in client projects and commercial SaaS without recurring platform royalties.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-background border border-border text-primary">
                <Code2 className="h-4 w-4" />
              </div>
              <h3 className="font-semibold text-sm text-foreground">Developer-Built Tools</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Real code written by independent software engineers. Verified dependencies, TypeScript types, and modern frameworks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Creator Value Proposition Banner */}
      <section className="border-t border-border/60 py-12 sm:py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="rounded-lg border border-border bg-card p-6 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
                Sell your code. Keep 95% of direct sales.
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Distribute boilerplates, automation scripts, and developer libraries directly to customers worldwide. Transparent automated payouts with zero monthly hosting fees.
              </p>
            </div>
            <Button asChild size="default" className="shrink-0">
              <Link href="/creator">
                <span>Start Selling</span>
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Editorial Resources & Articles */}
      {recentBlogPosts.length > 0 && (
        <section className="border-t border-border/60 bg-secondary/15 py-12 sm:py-16">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-foreground">Engineering Guides & Articles</h2>
                <p className="text-xs text-muted-foreground">Practical write-ups on shipping software, micro-SaaS, and automation.</p>
              </div>
              <Link href="/blog" className="text-xs font-medium text-primary hover:underline">
                View all articles →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {recentBlogPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group rounded-lg border border-border/70 bg-card p-4 transition-colors hover:border-foreground/25 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    <h3 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="pt-4 text-[11px] font-medium text-primary flex items-center gap-1">
                    <span>Read guide</span>
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
