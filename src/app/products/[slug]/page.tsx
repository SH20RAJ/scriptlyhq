export const dynamic = "force-dynamic";

import { db } from "@/db";
import { products, orders, users, affiliateProfiles } from "@/db/schema";
import { eq, and, ne } from "drizzle-orm";
import { notFound } from "next/navigation";
import ProductCard from "@/components/marketplace/ProductCard";
import { getOrCreateDbUser } from "@/lib/auth-utils";
import ProductCheckout from "@/components/ProductCheckout";
import Link from "next/link";
import ProductAffiliateShare from "@/components/ProductAffiliateShare";
import { getProductEffectivePrice } from "@/lib/price-utils";
import {
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  Download,
  Layers,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  FileCode2,
  Clock,
  Store,
  Star,
} from "lucide-react";
import { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { marked } from "marked";
import ShareButton from "@/components/ShareButton";
import AdminToolbar from "@/app/products/[slug]/AdminToolbar";
import ProductScreenshots from "@/components/ProductScreenshots";
import ProductMediaSwitcher from "@/components/ProductMediaSwitcher";
import ProductRating from "@/components/ProductRating";
import ProductInteractionAndReviews from "@/components/ProductInteractionAndReviews";
import { getProductSeo } from "@/lib/seo-data";
import { siteConfig } from "@/config/site";
import { CyberBackground } from "@/components/ui/CyberBackground";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

const formatINR = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await db.query.products.findFirst({
    where: eq(products.slug, slug),
  });

  if (!product) {
    return { title: "Product Not Found | ScriptlyStore" };
  }

  const user = await getOrCreateDbUser();
  const isUserAdmin = user?.role === "admin";
  const isUserCreator = user !== null && product.creatorId === user.id;
  const isAccessible = product.published && product.status === "approved";

  if (!isAccessible && !isUserAdmin && !isUserCreator) {
    return { title: "Product Not Found | ScriptlyStore" };
  }

  const promo = getProductEffectivePrice(product);
  const priceText = promo.isFree ? "FREE" : formatINR(promo.effectivePrice / 100);
  const seo = getProductSeo(product.slug, product.title, product.shortDescription, product.category, priceText);

  const ogImages: { url: string }[] = [];
  if (product.thumbnail) ogImages.push({ url: product.thumbnail });
  if (product.previewGif) ogImages.push({ url: product.previewGif });

  const keywords = product.tags 
    ? product.tags.split(",").map((t) => t.trim()) 
    : [product.category, "developer tool", "source code", "boilerplate"];

  return {
    title: `${product.title} — ScriptlyStore`,
    description: seo.description,
    keywords,
    alternates: {
      canonical: `${siteConfig.url}/products/${product.slug}`,
    },
    openGraph: {
      title: `${product.title} | ScriptlyStore`,
      description: seo.description,
      url: `${siteConfig.url}/products/${product.slug}`,
      siteName: siteConfig.name,
      type: "article",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.title} | ScriptlyStore`,
      description: seo.description,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await db.query.products.findFirst({
    where: eq(products.slug, slug),
  });

  if (!product) notFound();

  const user = await getOrCreateDbUser();
  const isUserAdmin = user?.role === "admin";
  const isUserCreator = user !== null && product.creatorId === user.id;
  const isAccessible = product.published && product.status === "approved";

  if (!isAccessible && !isUserAdmin && !isUserCreator) {
    notFound();
  }

  // Load affiliate profile of current user to see if they are approved
  let affiliateProfile = null;
  if (user) {
    affiliateProfile = await db.query.affiliateProfiles.findFirst({
      where: eq(affiliateProfiles.id, user.id),
    });
  }
  const isApprovedAffiliate = affiliateProfile?.status === "approved";

  // Load creator store name and info
  let storeName: string | null = null;
  let creatorRecord = null;
  if (product.creatorId) {
    creatorRecord = await db.query.users.findFirst({
      where: eq(users.id, product.creatorId),
    });
    storeName = creatorRecord?.storeName || creatorRecord?.name || null;
  }

  const promo = getProductEffectivePrice(product);

  // Fetch related products in same category
  const relatedProducts = await db.query.products.findMany({
    where: and(
      eq(products.category, product.category),
      ne(products.id, product.id),
      eq(products.published, true),
      eq(products.status, "approved")
    ),
    limit: 3,
  });

  let hasPurchased = false;
  if (user) {
    const purchase = await db.query.orders.findFirst({
      where: and(
        eq(orders.userId, user.id),
        eq(orders.productId, product.id),
        eq(orders.status, "completed")
      ),
    });
    if (purchase) hasPurchased = true;
  }

  const tagsList = product.tags ? product.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
  const screenshotsList = product.screenshots ? product.screenshots.split(",").map((s) => s.trim()).filter(Boolean) : [];

  const customRenderer = new marked.Renderer();
  customRenderer.link = function(token) {
    return `<a href="${token.href}" title="${token.title || ""}" target="_blank" rel="noopener noreferrer" class="text-primary underline hover:opacity-80">${token.text}</a>`;
  };
  const htmlDescription = await marked.parse(product.description || "", { renderer: customRenderer });

  const hasRealRatings = (product.ratingCount ?? 0) > 0;
  const productSchema: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "image": product.thumbnail ? [product.thumbnail] : [],
    "description": product.shortDescription,
    "sku": product.id,
    "offers": {
      "@type": "Offer",
      "url": `${siteConfig.url}/products/${product.slug}`,
      "priceCurrency": "INR",
      "price": (promo.effectivePrice / 100).toString(),
      "priceValidUntil": "2030-01-01",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": "https://schema.org/InStock",
    },
  };

  if (hasRealRatings) {
    productSchema.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": product.rating || "5.0",
      "reviewCount": product.ratingCount,
    };
  }

  return (
    <div className="flex flex-col min-h-screen py-6 sm:py-10 bg-background text-foreground relative">
      <CyberBackground />

      {/* Structured Schema Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 space-y-8 relative z-10">
        {/* Navigation Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/explore" className="hover:text-foreground transition-colors">
            Explore
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link
            href={`/explore/${encodeURIComponent(product.category.toLowerCase())}`}
            className="hover:text-foreground transition-colors capitalize"
          >
            {product.category.replace(/-/g, " ")}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-md">
            {product.title}
          </span>
        </div>

        {isUserAdmin && (
          <AdminToolbar productId={product.id} isPublished={product.published} />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Main Visual & Documentation Column */}
          <div className="lg:col-span-7 space-y-8">
            {/* Visual Media Showcase */}
            <div className="rounded-3xl border border-border/50 bg-card/30 overflow-hidden shadow-sm">
              <ProductMediaSwitcher
                videoUrl={product.videoUrl}
                previewGif={product.previewGif}
                thumbnail={product.thumbnail}
                title={product.title}
              />
            </div>

            {/* Screenshots Gallery */}
            {screenshotsList.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                  Interface Screenshots ({screenshotsList.length})
                </h3>
                <ProductScreenshots screenshots={screenshotsList} productTitle={product.title} />
              </div>
            )}

            {/* Product Overview & Markdown Documentation */}
            <div className="p-6 sm:p-8 rounded-3xl border border-border/40 bg-card/25 backdrop-blur-md space-y-4">
              <h2 className="text-base sm:text-lg font-black text-foreground tracking-tight flex items-center gap-2 pb-3 border-b border-border/30">
                <FileCode2 className="w-4 h-4 text-primary" />
                <span>Overview & Documentation</span>
              </h2>
              <div 
                dangerouslySetInnerHTML={{ __html: htmlDescription }}
                className="markdown-content text-sm leading-relaxed text-muted-foreground/90 space-y-4"
              />
            </div>

            {/* Technologies & Frameworks */}
            {tagsList.length > 0 && (
              <div className="p-5 rounded-2xl border border-border/40 bg-card/25 space-y-3">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-foreground">
                  <Layers className="h-4 w-4 text-primary" />
                  <span>Technologies & Stack</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {tagsList.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-lg px-2.5 py-1 text-xs font-mono font-medium bg-muted/40 text-foreground border border-border/40"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Customer Reviews & Social Proof */}
            <div className="p-6 rounded-3xl border border-border/40 bg-card/25 backdrop-blur-md">
              <ProductInteractionAndReviews 
                productId={product.id}
                initialViews={product.views || 0}
                initialDownloads={product.downloadsCount || 0}
                initialSaves={product.saves || 0}
                initialRating={product.rating || "5.0"}
                initialRatingCount={product.ratingCount || 0}
                userLoggedIn={!!user}
                showStats={product.showStats}
              />
            </div>
          </div>

          {/* Sticky Checkout & Creator Sidebar */}
          <div className="lg:col-span-5">
            <div className="sticky top-20 space-y-6">
              {/* Product Pricing & Buy Panel */}
              <div className="rounded-3xl border border-border/50 bg-card/35 backdrop-blur-xl p-6 sm:p-7 space-y-5 shadow-sm">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider">
                      {product.category.replace(/-/g, " ")}
                    </span>
                    <span className="text-[11px] font-mono text-muted-foreground">
                      v{product.version || "1.0.0"}
                    </span>
                  </div>

                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground leading-snug">
                    {product.title}
                  </h1>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {product.shortDescription}
                  </p>
                </div>

                {/* Rating display */}
                {hasRealRatings && (
                  <div className="flex items-center gap-2 pt-1 border-t border-border/30">
                    <ProductRating productId={product.id} initialRating={product.rating || "5.0"} />
                  </div>
                )}

                {/* Price Display in INR */}
                <div className="border-t border-border/40 pt-4">
                  {promo.isFree ? (
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-emerald-500 font-mono">
                        FREE
                      </span>
                    </div>
                  ) : promo.hasDiscount ? (
                    <div className="space-y-1">
                      <div className="flex items-baseline gap-2.5">
                        <span className="text-3xl font-black text-foreground font-mono">
                          {formatINR(promo.effectivePrice / 100)}
                        </span>
                        <span className="text-sm text-muted-foreground line-through font-mono">
                          {formatINR(promo.price / 100)}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-500/10 text-rose-500 border border-rose-500/20">
                          {promo.discountPercent}% OFF
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground font-mono">Inclusive of all digital taxes</p>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-foreground font-mono">
                        {formatINR(product.price / 100)}
                      </span>
                      <span className="text-[11px] text-muted-foreground font-mono uppercase">INR</span>
                    </div>
                  )}
                </div>

                {/* Checkout Component */}
                <ProductCheckout
                  product={product}
                  hasPurchased={hasPurchased}
                  userLoggedIn={!!user}
                  isFree={promo.isFree}
                />

                {/* Live Demo & Secondary Actions */}
                <div className="flex items-center gap-2 pt-1">
                  {product.demoUrl && (
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="flex-1 h-10 text-xs font-bold rounded-xl border-border/60 hover:bg-muted/40"
                    >
                      <a href={product.demoUrl} target="_blank" rel="noopener noreferrer">
                        <span>Live Demo</span>
                        <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
                      </a>
                    </Button>
                  )}
                  <ShareButton productTitle={product.title} productSlug={product.slug} />
                </div>

                {/* Creator Attribution */}
                {product.creatorId && (
                  <div className="p-3 rounded-2xl bg-muted/20 border border-border/30 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary/20 to-sky-500/20 text-primary font-black text-xs flex items-center justify-center shrink-0">
                        <Store className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-muted-foreground uppercase font-bold">Created By</p>
                        <p className="font-bold text-foreground truncate">{storeName || "Verified Creator"}</p>
                      </div>
                    </div>
                    <Link
                      href={`/stores/${product.creatorId}`}
                      className="text-[11px] font-bold text-primary hover:underline shrink-0"
                    >
                      View Store →
                    </Link>
                  </div>
                )}

                {/* Affiliate Share Option */}
                <ProductAffiliateShare
                  productSlug={product.slug}
                  productTitle={product.title}
                  affiliateSlug={user?.affiliateSlug || user?.id || null}
                  isApproved={isApprovedAffiliate}
                  isLoggedIn={!!user}
                  commissionPercent={product.affiliateCommissionPercent ?? 30}
                />

                {/* Honest Purchase Inclusions */}
                <div className="pt-4 border-t border-border/40 space-y-2.5 text-xs">
                  <p className="font-bold text-foreground flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    <span>Purchase Guarantee</span>
                  </p>

                  <ul className="space-y-2 text-muted-foreground text-[11px]">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span><strong className="text-foreground font-semibold">Instant Source Archive</strong> — Full source repository ZIP delivered upon payment.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span><strong className="text-foreground font-semibold">Commercial License</strong> — Clean commercial rights for personal & client projects.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span><strong className="text-foreground font-semibold">Lifetime Access</strong> — Download future updates directly from your dashboard.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Related Products */}
              {relatedProducts.length > 0 && (
                <div className="space-y-3 pt-2">
                  <p className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                    More in {product.category.replace(/-/g, " ")}
                  </p>
                  <div className="space-y-2">
                    {relatedProducts.map((rel) => (
                      <Link
                        key={rel.id}
                        href={`/products/${rel.slug}`}
                        className="flex items-center justify-between p-3 rounded-2xl border border-border/40 bg-card/30 hover:bg-muted/30 transition-all text-xs group"
                      >
                        <div className="truncate pr-3">
                          <p className="font-bold text-foreground truncate group-hover:text-primary transition-colors">
                            {rel.title}
                          </p>
                          <p className="text-muted-foreground text-[11px] truncate mt-0.5">
                            {rel.shortDescription}
                          </p>
                        </div>
                        <span className="font-mono font-bold text-foreground shrink-0">
                          {formatINR(rel.price / 100)}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
