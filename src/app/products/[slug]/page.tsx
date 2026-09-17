export const dynamic = "force-dynamic";

import { db } from "@/db";
import { products, orders, users, affiliateProfiles } from "@/db/schema";
import { eq, and, ne } from "drizzle-orm";
import { notFound } from "next/navigation";
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
  Zap,
  HelpCircle,
  Code2,
  Heart,
  Home,
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

// Universal USD pricing formatter
const formatUSD = (amountPaise: number) => {
  const dollars = amountPaise / 100;
  return Number.isInteger(dollars) ? `$${dollars}` : `$${dollars.toFixed(2)}`;
};

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
  const priceText = promo.isFree ? "FREE" : formatUSD(promo.effectivePrice);
  const seo = getProductSeo(product.slug, product.title, product.shortDescription, product.category, priceText);

  const ogImages: { url: string; width?: number; height?: number; alt?: string }[] = [];
  if (product.thumbnail) {
    ogImages.push({
      url: product.thumbnail,
      width: 1200,
      height: 630,
      alt: `${product.title} Preview — ScriptlyStore`,
    });
  }
  if (product.previewGif) {
    ogImages.push({ url: product.previewGif, alt: `${product.title} Animated Demo` });
  }

  const keywords = product.tags 
    ? product.tags.split(",").map((t) => t.trim()) 
    : [product.category, "developer tool", "source code", "boilerplate", "Next.js template", "React component"];

  return {
    title: `${product.title} — Premium ${product.category.replace(/-/g, " ")} | ScriptlyStore`,
    description: seo.description,
    keywords,
    alternates: {
      canonical: `${siteConfig.url}/products/${product.slug}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title: `${product.title} | ScriptlyStore`,
      description: seo.description,
      url: `${siteConfig.url}/products/${product.slug}`,
      siteName: siteConfig.name,
      type: "website",
      images: ogImages,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.title} | ScriptlyStore`,
      description: seo.description,
      creator: "@sh20raj",
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
    return `<a href="${token.href}" title="${token.title || ""}" target="_blank" rel="noopener noreferrer" class="text-primary underline font-medium hover:opacity-80 transition-opacity">${token.text}</a>`;
  };
  const htmlDescription = await marked.parse(product.description || "", { renderer: customRenderer });

  const priceFormatted = promo.isFree ? "FREE" : formatUSD(promo.effectivePrice);
  const seo = getProductSeo(product.slug, product.title, product.shortDescription, product.category, priceFormatted);

  const hasRealRatings = (product.ratingCount ?? 0) > 0;

  // Rich Schema.org JSON-LD structured data
  const productSchema: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "image": product.thumbnail ? [product.thumbnail, ...screenshotsList] : [],
    "description": product.shortDescription,
    "sku": product.id,
    "mpn": product.slug,
    "brand": {
      "@type": "Brand",
      "name": "ScriptlyStore",
    },
    "category": product.category,
    "offers": {
      "@type": "Offer",
      "url": `${siteConfig.url}/products/${product.slug}`,
      "priceCurrency": "USD",
      "price": (promo.effectivePrice / 100).toString(),
      "priceValidUntil": "2030-12-31",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": storeName || "ScriptlyStore",
        "url": siteConfig.url,
      },
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating || "5.0",
      "reviewCount": Math.max(product.ratingCount || 1, 1),
      "bestRating": "5",
      "worstRating": "1",
    },
  };

  const breadcrumbsSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": siteConfig.url,
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Explore",
        "item": `${siteConfig.url}/explore`,
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.category.replace(/-/g, " "),
        "item": `${siteConfig.url}/explore/${encodeURIComponent(product.category.toLowerCase())}`,
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": product.title,
        "item": `${siteConfig.url}/products/${product.slug}`,
      },
    ],
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": product.title,
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web, macOS, Linux, Windows",
    "offers": {
      "@type": "Offer",
      "price": (promo.effectivePrice / 100).toString(),
      "priceCurrency": "USD",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": seo.faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };

  return (
    <div className="flex flex-col min-h-screen py-6 sm:py-10 bg-background text-foreground relative">
      <CyberBackground />

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 space-y-6 relative z-10">
        {/* Top Header & Breadcrumbs Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <nav aria-label="Breadcrumbs" className="flex items-center gap-1.5 text-muted-foreground flex-wrap">
            <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-1">
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="h-3 w-3 opacity-40" />
            <Link href="/explore" className="hover:text-foreground transition-colors">
              Explore
            </Link>
            <ChevronRight className="h-3 w-3 opacity-40" />
            <Link
              href={`/explore/${encodeURIComponent(product.category.toLowerCase())}`}
              className="hover:text-foreground transition-colors capitalize font-medium text-foreground/80"
            >
              {product.category.replace(/-/g, " ")}
            </Link>
            <ChevronRight className="h-3 w-3 opacity-40" />
            <span className="text-foreground font-semibold truncate max-w-[220px] sm:max-w-xs">
              {product.title}
            </span>
          </nav>

          {isUserAdmin && (
            <div className="self-start sm:self-auto">
              <AdminToolbar productId={product.id} isPublished={product.published} />
            </div>
          )}
        </div>

        {/* Product Page Header Banner */}
        <div className="space-y-3 pt-2">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/explore/${encodeURIComponent(product.category.toLowerCase())}`}
              className="px-3 py-1 rounded-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-[11px] font-black uppercase tracking-wider transition-colors"
            >
              {product.category.replace(/-/g, " ")}
            </Link>
            <span className="px-2.5 py-1 rounded-full bg-muted/60 text-muted-foreground border border-border/40 text-[11px] font-mono font-semibold">
              v{product.version || "1.0.0"}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[11px] font-semibold flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Instant Delivery
            </span>
            <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 text-[11px] font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Verified Source Code
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground leading-[1.15]">
            {product.title}
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-4xl font-medium">
            {product.shortDescription}
          </p>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start pt-2">
          {/* Main Visual & Documentation Column (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Visual Media Showcase */}
            <div className="rounded-3xl border border-border/50 bg-card/30 overflow-hidden shadow-xl">
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
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                    Interface Screenshots ({screenshotsList.length})
                  </h3>
                  <span className="text-[11px] text-muted-foreground font-medium">Click to enlarge</span>
                </div>
                <ProductScreenshots screenshots={screenshotsList} productTitle={product.title} />
              </div>
            )}

            {/* Product Overview & Markdown Documentation */}
            <div className="p-6 sm:p-8 rounded-3xl border border-border/40 bg-card/25 backdrop-blur-md space-y-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-border/30">
                <h2 className="text-base sm:text-lg font-black text-foreground tracking-tight flex items-center gap-2">
                  <FileCode2 className="w-5 h-5 text-primary" />
                  <span>Overview &amp; Technical Specifications</span>
                </h2>
                <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider rounded-lg border-border/60">
                  Commercial License
                </Badge>
              </div>

              <div 
                dangerouslySetInnerHTML={{ __html: htmlDescription }}
                className="markdown-content text-sm sm:text-base leading-relaxed text-muted-foreground space-y-4 prose prose-neutral dark:prose-invert max-w-none prose-headings:text-foreground prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-a:underline prose-code:text-primary prose-code:bg-muted/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-strong:text-foreground"
              />
            </div>

            {/* Technologies & Frameworks */}
            {tagsList.length > 0 && (
              <div className="p-6 rounded-3xl border border-border/40 bg-card/25 backdrop-blur-md space-y-4 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-foreground">
                  <Layers className="h-4 w-4 text-primary" />
                  <span>Technologies &amp; Architecture</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tagsList.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-xl px-3 py-1.5 text-xs font-mono font-semibold bg-muted/30 text-foreground border border-border/50 hover:border-primary/50 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Product FAQs */}
            {seo.faqs.length > 0 && (
              <div className="p-6 sm:p-8 rounded-3xl border border-border/40 bg-card/25 backdrop-blur-md space-y-6 shadow-sm">
                <div className="flex items-center gap-2 text-base font-black text-foreground tracking-tight pb-3 border-b border-border/30">
                  <HelpCircle className="w-5 h-5 text-primary" />
                  <span>Frequently Asked Questions</span>
                </div>
                <div className="space-y-4">
                  {seo.faqs.map((faq, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-muted/20 border border-border/30 space-y-2">
                      <h4 className="font-bold text-sm text-foreground flex items-start gap-2">
                        <span className="text-primary font-mono text-xs mt-0.5">Q{idx + 1}.</span>
                        <span>{faq.question}</span>
                      </h4>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pl-6">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Customer Reviews & Social Proof */}
            <div className="p-6 sm:p-8 rounded-3xl border border-border/40 bg-card/25 backdrop-blur-md shadow-sm">
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

          {/* Sticky Checkout & Creator Sidebar (5 cols) */}
          <div className="lg:col-span-5">
            <div className="sticky top-20 space-y-6">
              {/* Product Pricing & Buy Panel */}
              <div className="rounded-3xl border border-border/50 bg-card/60 dark:bg-card/30 backdrop-blur-xl p-6 sm:p-7 space-y-5 shadow-xl relative overflow-hidden">
                {/* Subtle top accent bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-emerald-500 to-sky-500 opacity-80" />

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider">
                      {product.category.replace(/-/g, " ")}
                    </span>
                    <span className="text-[11px] font-mono text-muted-foreground">
                      v{product.version || "1.0.0"}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground leading-snug">
                    {product.title}
                  </h2>

                  {/* Rating summary */}
                  <div className="pt-1 border-b border-border/30 pb-3">
                    <ProductRating productId={product.id} initialRating={product.rating || "5.0"} />
                  </div>
                </div>

                {/* Price Display in USD */}
                <div className="pt-1">
                  {promo.isFree ? (
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-emerald-500 font-mono">
                        FREE
                      </span>
                      <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                        Open Source
                      </span>
                    </div>
                  ) : promo.hasDiscount ? (
                    <div className="space-y-1">
                      <div className="flex items-baseline gap-2.5">
                        <span className="text-4xl font-black text-foreground font-mono">
                          {formatUSD(promo.effectivePrice)}
                        </span>
                        <span className="text-base text-muted-foreground line-through font-mono">
                          {formatUSD(promo.price)}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-500/10 text-rose-500 border border-rose-500/20">
                          {promo.discountPercent}% OFF
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground font-mono">
                        USD · One-time payment · Lifetime access
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-0.5">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-foreground font-mono">
                          {formatUSD(product.price)}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono uppercase font-bold tracking-wider">
                          USD
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground font-mono">
                        One-time purchase · Lifetime access · Free updates
                      </p>
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

                {/* Live Demo & Share Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  {product.demoUrl && (
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="flex-1 h-11 text-xs font-bold rounded-2xl border-border/60 hover:bg-muted/40 cursor-pointer"
                    >
                      <a href={product.demoUrl} target="_blank" rel="noopener noreferrer">
                        <span>Live Preview</span>
                        <ExternalLink className="h-3.5 w-3.5 ml-1.5 opacity-70" />
                      </a>
                    </Button>
                  )}
                  <ShareButton productTitle={product.title} productSlug={product.slug} />
                </div>

                {/* Creator Attribution & Tip/Sponsor Link */}
                <div className="p-3.5 rounded-2xl bg-muted/20 border border-border/30 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary/20 to-sky-500/20 text-primary font-black text-xs flex items-center justify-center shrink-0">
                      <Store className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Creator</p>
                      <p className="font-bold text-foreground truncate">{storeName || "Verified Developer"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <a
                      href="https://razorpay.me/@iamsh"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-bold text-rose-500 hover:underline flex items-center gap-1"
                    >
                      <Heart className="w-3 h-3 fill-current" />
                      <span>Tip &amp; Sponsor</span>
                    </a>
                    {product.creatorId && (
                      <Link
                        href={`/stores/${product.creatorId}`}
                        className="text-[11px] font-bold text-primary hover:underline"
                      >
                        Store →
                      </Link>
                    )}
                  </div>
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

                {/* Purchase Guarantee Stack */}
                <div className="pt-4 border-t border-border/40 space-y-2.5 text-xs">
                  <p className="font-bold text-foreground flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    <span>Purchase Guarantee &amp; Rights</span>
                  </p>

                  <ul className="space-y-2 text-muted-foreground text-[11px]">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span><strong className="text-foreground font-semibold">Instant Source Archive</strong> — Full source repository ZIP delivered upon checkout.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span><strong className="text-foreground font-semibold">Commercial License</strong> — Full commercial rights for unlimited personal and client projects.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span><strong className="text-foreground font-semibold">Lifetime Access</strong> — Download future updates directly from your customer dashboard.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span><strong className="text-foreground font-semibold">Verified Architecture</strong> — Clean TypeScript, Next.js, and zero obfuscated code.</span>
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
                  <div className="space-y-2.5">
                    {relatedProducts.map((rel) => (
                      <Link
                        key={rel.id}
                        href={`/products/${rel.slug}`}
                        className="flex items-center justify-between p-3.5 rounded-2xl border border-border/40 bg-card/30 hover:bg-muted/30 transition-all text-xs group"
                      >
                        <div className="truncate pr-3">
                          <p className="font-bold text-foreground truncate group-hover:text-primary transition-colors">
                            {rel.title}
                          </p>
                          <p className="text-muted-foreground text-[11px] truncate mt-0.5">
                            {rel.shortDescription}
                          </p>
                        </div>
                        <span className="font-mono font-bold text-foreground shrink-0 text-sm">
                          {formatUSD(rel.price)}
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
