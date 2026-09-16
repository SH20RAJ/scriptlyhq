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
import { ArrowLeft, ExternalLink, ShieldCheck, Download, RefreshCw, Layers, CheckCircle2, ChevronRight, Sparkles } from "lucide-react";
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

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

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
  const priceText = promo.isFree ? "FREE" : `$${(promo.effectivePrice / 100).toFixed(2)}`;
  const seo = getProductSeo(product.slug, product.title, product.shortDescription, product.category, priceText);

  const ogImages: { url: string }[] = [];
  if (product.thumbnail) ogImages.push({ url: product.thumbnail });
  if (product.previewGif) ogImages.push({ url: product.previewGif });

  const keywords = product.tags 
    ? product.tags.split(",").map(t => t.trim()) 
    : [product.category, "digital asset", "source code", "boilerplate"];

  return {
    title: seo.title,
    description: seo.description,
    keywords,
    alternates: {
      canonical: `${siteConfig.url}/products/${product.slug}`,
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `${siteConfig.url}/products/${product.slug}`,
      siteName: siteConfig.name,
      type: "article",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
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

  // Load creator store name
  let storeName: string | null = null;
  if (product.creatorId) {
    const creatorRecord = await db.query.users.findFirst({
      where: eq(users.id, product.creatorId),
    });
    storeName = creatorRecord?.storeName || null;
  }

  const promo = getProductEffectivePrice(product);
  const priceText = promo.isFree ? "FREE" : `$${(promo.effectivePrice / 100).toFixed(2)}`;
  const seo = getProductSeo(product.slug, product.title, product.shortDescription, product.category, priceText);

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

  // Truthful Schema rating generation: only include aggregateRating if real ratings exist
  const hasRealRatings = (product.ratingCount ?? 0) > 0;
  const productSchema: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "image": product.thumbnail ? [product.thumbnail] : [],
    "description": product.shortDescription,
    "sku": product.id,
    "mpn": product.id,
    "offers": {
      "@type": "Offer",
      "url": `${siteConfig.url}/products/${product.slug}`,
      "priceCurrency": "USD",
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
    <div className="flex flex-col min-h-screen py-6 sm:py-10">
      {/* Product JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      {/* BreadcrumbList Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": siteConfig.url },
              { "@type": "ListItem", "position": 2, "name": product.category, "item": `${siteConfig.url}/explore?category=${encodeURIComponent(product.category.toLowerCase())}` },
              { "@type": "ListItem", "position": 3, "name": product.title, "item": `${siteConfig.url}/products/${product.slug}` },
            ],
          }),
        }}
      />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        {/* Navigation Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">Catalog</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href={`/explore?category=${encodeURIComponent(product.category.toLowerCase())}`} className="hover:text-foreground transition-colors capitalize">
            {product.category.replace(/-/g, " ")}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground truncate max-w-[200px] sm:max-w-md">{product.title}</span>
        </div>

        {isUserAdmin && (
          <AdminToolbar productId={product.id} isPublished={product.published} />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Main Visual & Content Column */}
          <div className="lg:col-span-7 space-y-8">
            {/* Visual Media Showcase */}
            <div className="rounded-lg border border-border/70 bg-card overflow-hidden">
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
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Interface Screenshots ({screenshotsList.length})
                </h3>
                <ProductScreenshots screenshots={screenshotsList} productTitle={product.title} />
              </div>
            )}

            {/* Product Overview & Markdown Documentation */}
            <div className="rounded-lg border border-border/70 bg-card p-6 sm:p-8 space-y-6">
              <div className="border-b border-border/60 pb-4">
                <h2 className="text-base font-semibold text-foreground tracking-tight">Overview & Specifications</h2>
              </div>
              <div 
                dangerouslySetInnerHTML={{ __html: htmlDescription }}
                className="markdown-content text-sm leading-relaxed"
              />
            </div>

            {/* Tech Stack / Tags */}
            {tagsList.length > 0 && (
              <div className="rounded-lg border border-border/70 bg-card p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <Layers className="h-4 w-4 text-muted-foreground" />
                  <span>Technologies & Frameworks</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {tagsList.map((tag) => (
                    <span
                      key={tag}
                      className="rounded px-2.5 py-1 text-xs font-mono bg-secondary text-foreground border border-border/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews & Social Proof */}
            <div className="rounded-lg border border-border/70 bg-card p-6 sm:p-8">
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

          {/* Sticky Checkout Sidebar */}
          <div className="lg:col-span-5">
            <div className="sticky top-20 space-y-6">
              {/* Product Header & Pricing Box */}
              <div className="rounded-lg border border-border/80 bg-card p-6 space-y-5">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[11px] capitalize">
                      {product.category.replace(/-/g, " ")}
                    </Badge>
                    {storeName && (
                      <Link href={`/stores/${product.creatorId}`} className="text-xs text-muted-foreground hover:text-foreground">
                        By {storeName}
                      </Link>
                    )}
                  </div>
                  <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground leading-snug">
                    {product.title}
                  </h1>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {product.shortDescription}
                  </p>
                </div>

                {/* Rating display */}
                {hasRealRatings && (
                  <ProductRating productId={product.id} initialRating={product.rating || "5.0"} />
                )}

                {/* Price Display */}
                <div className="border-t border-border/60 pt-4">
                  {promo.isFree ? (
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                        FREE
                      </span>
                      {promo.price > 0 && (
                        <span className="text-sm text-muted-foreground line-through font-mono">
                          ${(promo.price / 100).toFixed(2)}
                        </span>
                      )}
                    </div>
                  ) : promo.hasDiscount ? (
                    <div className="flex items-baseline gap-2.5">
                      <span className="text-3xl font-semibold text-foreground font-mono">
                        ${(promo.effectivePrice / 100).toFixed(2)}
                      </span>
                      <span className="text-sm text-muted-foreground line-through font-mono">
                        ${(promo.price / 100).toFixed(2)}
                      </span>
                      <Badge variant="destructive" className="text-[10px]">
                        Save {promo.discountPercent}%
                      </Badge>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-semibold text-foreground font-mono">
                        ${(product.price / 100).toFixed(2)}
                      </span>
                      <span className="text-xs text-muted-foreground font-mono">USD</span>
                    </div>
                  )}
                </div>

                {/* Checkout Action Component */}
                <ProductCheckout
                  product={product}
                  hasPurchased={hasPurchased}
                  userLoggedIn={!!user}
                  isFree={promo.isFree}
                />

                {/* Live Preview & Secondary Links */}
                <div className="flex items-center gap-2 pt-1">
                  {product.demoUrl && (
                    <Button asChild variant="outline" size="sm" className="flex-1 text-xs">
                      <a href={product.demoUrl} target="_blank" rel="noopener noreferrer">
                        <span>Live Preview</span>
                        <ExternalLink className="h-3 w-3 ml-1.5" />
                      </a>
                    </Button>
                  )}
                  <ShareButton productTitle={product.title} productSlug={product.slug} />
                </div>

                {/* Affiliate Share Option */}
                <ProductAffiliateShare
                  productSlug={product.slug}
                  productTitle={product.title}
                  affiliateSlug={user?.affiliateSlug || user?.id || null}
                  isApproved={isApprovedAffiliate}
                  isLoggedIn={!!user}
                  commissionPercent={product.affiliateCommissionPercent ?? 30}
                />
              </div>

              {/* Honest Purchase Inclusions Box */}
              <div className="rounded-lg border border-border/70 bg-secondary/30 p-5 space-y-3.5 text-xs">
                <p className="font-semibold text-foreground flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <span>What's Included With This Purchase</span>
                </p>

                <ul className="space-y-2.5 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong className="text-foreground font-medium">Instant Source Code Archive</strong> — Complete uncompiled source repository ZIP delivered upon payment.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong className="text-foreground font-medium">Commercial License</strong> — Permitted for use in commercial client work and proprietary SaaS products.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong className="text-foreground font-medium">Lifetime Access & Updates</strong> — Re-download future patches and releases anytime from your dashboard.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong className="text-foreground font-medium">Direct Author Support</strong> — Inquire directly with the creator for setup guidance and issue triage.</span>
                  </li>
                </ul>
              </div>

              {/* Related Products */}
              {relatedProducts.length > 0 && (
                <div className="space-y-3 pt-2">
                  <p className="text-xs font-semibold text-foreground">Related in {product.category}</p>
                  <div className="space-y-2.5">
                    {relatedProducts.map((rel) => (
                      <Link
                        key={rel.id}
                        href={`/products/${rel.slug}`}
                        className="flex items-center justify-between p-3 rounded-md border border-border/70 bg-card hover:bg-secondary/40 transition-colors text-xs"
                      >
                        <div className="truncate pr-3">
                          <p className="font-medium text-foreground truncate">{rel.title}</p>
                          <p className="text-muted-foreground text-[11px] truncate">{rel.shortDescription}</p>
                        </div>
                        <span className="font-mono font-semibold text-foreground shrink-0">
                          ${(rel.price / 100).toFixed(2)}
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
