export const dynamic = "force-dynamic";

import { db } from "../../../db";
import { products, orders, users } from "../../../db/schema";
import { eq, and, ne } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ProductCard } from "../../../components/SearchFilter";
import { getOrCreateDbUser } from "../../../lib/auth-utils";
import ProductCheckout from "../../../components/ProductCheckout";
import Link from "next/link";
import { getProductEffectivePrice } from "../../../lib/price-utils";
import { ArrowLeft, ExternalLink, ShieldCheck, Zap, Download, RefreshCw, Headphones, Lock, CheckCircle2 } from "lucide-react";
import { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { marked } from "marked";
import ShareButton from "../../../components/ShareButton";
import { isAdmin } from "../../../lib/auth-utils";
import AdminToolbar from "./AdminToolbar";
import TweetEmbed from "../../../components/TweetEmbed";
import ProductScreenshots from "../../../components/ProductScreenshots";
import ProductMediaSwitcher from "../../../components/ProductMediaSwitcher";
import ProductRating from "../../../components/ProductRating";
import { CyberBackground } from "../../../components/ui/CyberBackground";
import ProductInteractionAndReviews from "../../../components/ProductInteractionAndReviews";


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

  // Parse screenshots list
  const screenshotsList = product.screenshots ? product.screenshots.split(",").map((s) => s.trim()) : [];
  
  // Construct dynamic list of images for OG/Twitter
  const ogImages: { url: string }[] = [];
  if (product.thumbnail) ogImages.push({ url: product.thumbnail });
  if (product.previewGif) ogImages.push({ url: product.previewGif });
  screenshotsList.forEach((src) => {
    if (src) ogImages.push({ url: src });
  });

  const keywords = product.tags 
    ? product.tags.split(",").map(t => t.trim()) 
    : [product.category, "digital asset", "source code", "boilerplate"];

  return {
    title: `${product.title} - ScriptlyStore`,
    description: product.shortDescription,
    keywords,
    alternates: {
      canonical: `https://scriptly.store/products/${product.slug}`,
    },
    openGraph: {
      title: `${product.title} - ScriptlyStore`,
      description: product.shortDescription,
      url: `https://scriptly.store/products/${product.slug}`,
      siteName: "ScriptlyStore",
      type: "article",
      images: ogImages,
      videos: product.videoUrl ? [{ url: product.videoUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.title} - ScriptlyStore`,
      description: product.shortDescription,
      images: product.thumbnail ? [product.thumbnail] : [],
      creator: "@SH20RAJ",
    },
    other: {
      "apple-mobile-web-app-title": product.title,
      "msapplication-TileImage": product.thumbnail || "",
    }
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

  const authorized = isUserAdmin;

  // Load creator store name
  let storeName: string | null = null;
  if (product.creatorId) {
    const creatorRecord = await db.query.users.findFirst({
      where: eq(users.id, product.creatorId),
    });
    storeName = creatorRecord?.storeName || null;
  }

  const promo = getProductEffectivePrice(product);

  // Fetch related products (same category, not current product, published/approved)
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

  const updatedDate = new Date(product.updatedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });

  const tagsList = product.tags ? product.tags.split(",").map((t) => t.trim()) : [];
  const screenshotsList = product.screenshots ? product.screenshots.split(",").map((s) => s.trim()) : [];

  const customRenderer = new marked.Renderer();
  customRenderer.link = function(token) {
    return `<a href="${token.href}" title="${token.title || ""}" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:text-blue-600 underline">${token.text}</a>`;
  };
  const htmlDescription = await marked.parse(product.description || "", { renderer: customRenderer });

  const isTweet = product.videoUrl?.includes("twitter.com") || product.videoUrl?.includes("x.com");
  const tweetId = isTweet ? product.videoUrl?.match(/status\/(\d+)/)?.[1] : null;


  return (
    <div className="flex flex-col min-h-screen">
      {/* Product JSON-LD Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.title,
            "image": product.thumbnail ? [product.thumbnail] : [],
            "description": product.shortDescription,
            "sku": product.id,
            "mpn": product.id,
            "offers": {
              "@type": "Offer",
              "url": `https://scriptly.store/products/${product.slug}`,
              "priceCurrency": "USD",
              "price": (promo.effectivePrice / 100).toString(),
              "priceValidUntil": "2030-01-01",
              "itemCondition": "https://schema.org/NewCondition",
              "availability": "https://schema.org/InStock"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": product.rating || "5.0",
              "reviewCount": product.ratingCount || 1
            }
          })
        }}
      />
      <CyberBackground />
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <Button asChild variant="ghost" size="sm" className="-ml-3 text-muted-foreground hover:text-foreground mb-8">
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Library
          </Link>
        </Button>

        {authorized && (
          <AdminToolbar productId={product.id} isPublished={product.published} />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Main Content */}
          <div className="lg:col-span-7 space-y-12">
            <div className="space-y-6">
              <ProductMediaSwitcher
                videoUrl={product.videoUrl}
                previewGif={product.previewGif}
                thumbnail={product.thumbnail}
                title={product.title}
              />

              {screenshotsList.length > 0 && (
                <ProductScreenshots screenshots={screenshotsList} productTitle={product.title} />
              )}
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-xl font-bold tracking-tight">Overview</h2>
                <div 
                  dangerouslySetInnerHTML={{ __html: htmlDescription }}
                  className="markdown-content text-base leading-relaxed space-y-4 font-medium"
                />
              </div>

              {tagsList.length > 0 && (
                <div className="pt-8 border-t border-border/40">
                  <div className="flex flex-wrap gap-2">
                    {tagsList.map((tag) => (
                      <Badge key={tag} variant="secondary" className="rounded-full px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-muted/50 hover:bg-muted transition-colors cursor-pointer" asChild>
                        <Link href={`/tags/${encodeURIComponent(tag)}`}>{tag}</Link>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-12 border-t border-border/40">
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
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 space-y-10">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className="rounded-full px-3 text-[10px] uppercase font-black tracking-[0.2em] border-primary/20 text-primary">
                        {product.category}
                      </Badge>
                      {storeName && (
                        <Link href={`/stores/${product.creatorId}`}>
                          <Badge variant="secondary" className="rounded-full px-3 text-[10px] uppercase font-bold tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20 cursor-pointer transition-all">
                            Store: {storeName}
                          </Badge>
                        </Link>
                      )}
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tighter text-foreground leading-[1.1]">
                      {product.title}
                    </h1>
                  </div>
                  <ProductRating productId={product.id} initialRating={product.rating || "5.0"} />
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                  {product.shortDescription}
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  {promo.isFree ? (
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-black tracking-tighter text-emerald-500 uppercase">
                        FREE
                      </span>
                      {promo.price > 0 && (
                        <span className="text-xl font-bold text-muted-foreground line-through decoration-destructive/60 tabular-nums">
                          ${(promo.price / 100).toFixed(2)}
                        </span>
                      )}
                    </div>
                  ) : promo.hasDiscount ? (
                    <div className="flex flex-col gap-1">
                      <div className="flex items-baseline gap-3">
                        <span className="text-5xl font-black tracking-tighter text-foreground tabular-nums">
                          ${(promo.effectivePrice / 100).toFixed(2)}
                        </span>
                        <span className="text-xl font-bold text-muted-foreground line-through decoration-destructive/60 tabular-nums">
                          ${(promo.price / 100).toFixed(2)}
                        </span>
                        <Badge variant="destructive" className="rounded-md px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wider">
                          -{promo.discountPercent}% OFF
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-black tracking-tighter tabular-nums">
                        ${(product.price / 100).toFixed(2)}
                      </span>
                      <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">USD</span>
                    </div>
                  )}

                  {/* Countdown Warning / Banner */}
                  {promo.isPromoActive && promo.promoEnd && (
                    <div className="mt-2 text-xs font-bold text-amber-500 flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-3 py-2 rounded-xl">
                      <span className="animate-pulse w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span>
                        Limited time offer! Ends on {new Date(promo.promoEnd).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <ProductCheckout
                    product={product}
                    hasPurchased={hasPurchased}
                    userLoggedIn={!!user}
                    isFree={promo.isFree}
                  />
                  
                  {product.demoUrl && (
                    <Button asChild className="w-full h-12 rounded-xl font-bold uppercase tracking-widest text-[11px] bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-white border-0 shadow-xl shadow-emerald-500/10 transition-all duration-300 group/preview cursor-pointer">
                      <a href={product.demoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                        Live Preview
                        <ExternalLink className="w-3.5 h-3.5 ml-2 group-hover/preview:translate-x-0.5 group-hover/preview:-translate-y-0.5 transition-transform" />
                      </a>
                    </Button>
                  )}

                  <ShareButton productTitle={product.title} productSlug={product.slug} />
                </div>

                {/* High-Conversion Inclusions Box */}
                <div className="p-6 border-2 border-border bg-card/65 backdrop-blur-md shadow-[0_4px_0_var(--border)] dark:shadow-[0_4px_0_#2A3842] rounded-[2rem] space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-foreground border-b border-border/40 pb-2.5 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-primary" /> Purchase Inclusions
                  </h4>
                  <ul className="space-y-3 text-xs font-bold text-muted-foreground">
                    <li className="flex items-start gap-2.5">
                      <Download className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Instant Secure Download (Access files immediately after checkout)</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      <span>100% Audited & Verified Codebase (Safe and zero malware)</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <RefreshCw className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                      <span>Lifetime Access & Free Updates (No recurring fees)</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Headphones className="w-4 h-4 text-[#FF9600] shrink-0 mt-0.5" />
                      <span>Premium Developer Support (Dedicated creator help desk)</span>
                    </li>
                  </ul>
                  
                  <div className="pt-2 border-t border-border/30 flex items-center justify-between text-[10px] text-muted-foreground uppercase font-black tracking-widest">
                    <span className="flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-emerald-500" /> Secure 256-bit SSL Checkout
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      Secure Payment
                   </div>
                   <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      <Zap className="w-4 h-4 text-amber-500" />
                      Instant Access
                   </div>
                </div>
              </div>

              <div className="pt-8 border-t border-border/40 space-y-4">
                <div className="flex items-center justify-between text-[11px] uppercase font-bold tracking-widest">
                  <span className="text-muted-foreground">Latest Build</span>
                  <span className="text-foreground font-mono">v{product.version}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] uppercase font-bold tracking-widest">
                  <span className="text-muted-foreground">Released</span>
                  <span className="text-foreground">{updatedDate}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] uppercase font-bold tracking-widest">
                  <span className="text-muted-foreground">Type</span>
                  <span className="text-foreground">Commercial License</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Grid */}
        {relatedProducts.length > 0 && (
          <div className="space-y-8 mt-20 pt-12 border-t border-border/40">
            <div className="flex items-center gap-4">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">You May Also Like</h2>
              <div className="h-px flex-1 bg-border/20" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} prod={rel} categoryName={rel.category} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
