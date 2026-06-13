export const dynamic = "force-dynamic";

import { db } from "../../../db";
import { products, orders } from "../../../db/schema";
import { eq, and, ne } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ProductCard } from "../../../components/SearchFilter";
import { getOrCreateDbUser } from "../../../lib/auth-utils";
import ProductCheckout from "../../../components/ProductCheckout";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ExternalLink, ShieldCheck, Zap } from "lucide-react";
import { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { marked } from "marked";
import ShareButton from "../../../components/ShareButton";
import { Tweet } from "react-tweet";


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

  return {
    title: `${product.title} - ScriptlyStore`,
    description: product.shortDescription,
    openGraph: {
      title: `${product.title} - ScriptlyStore`,
      description: product.shortDescription,
      images: product.thumbnail ? [{ url: product.thumbnail }] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await db.query.products.findFirst({
    where: eq(products.slug, slug),
  });

  if (!product) notFound();

  // Fetch related products (same category, not current product, published)
  const relatedProducts = await db.query.products.findMany({
    where: and(
      eq(products.category, product.category),
      ne(products.id, product.id),
      eq(products.published, true)
    ),
    limit: 3,
  });

  const user = await getOrCreateDbUser();
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

  const htmlDescription = await marked.parse(product.description || "");

  const isTweet = product.videoUrl?.includes("twitter.com") || product.videoUrl?.includes("x.com");
  const tweetId = isTweet ? product.videoUrl?.match(/status\/(\d+)/)?.[1] : null;


  return (
    <div className="flex flex-col min-h-screen">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <Button asChild variant="ghost" size="sm" className="-ml-3 text-muted-foreground hover:text-foreground mb-8">
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Library
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Main Content */}
          <div className="lg:col-span-7 space-y-12">
            <div className="space-y-6">
              {product.videoUrl ? (
                tweetId ? (
                  <div className="rounded-3xl border border-border/60 bg-black/20 overflow-hidden shadow-2xl shadow-primary/5 flex justify-center p-4">
                    <div className="w-full max-w-[550px]">
                      <Tweet id={tweetId} />
                    </div>
                  </div>
                ) : (
                  <div className="rounded-3xl border border-border/60 bg-black overflow-hidden shadow-2xl shadow-primary/5">
                    <AspectRatio ratio={16 / 9}>
                      {product.videoUrl.split("?")[0].toLowerCase().endsWith(".mp4") || product.videoUrl.toLowerCase().includes(".mp4") ? (
                        <video
                          src={product.videoUrl}
                          controls
                          className="absolute inset-0 w-full h-full object-cover"
                          poster={product.thumbnail || undefined}
                          preload="metadata"
                        />
                      ) : (
                        <iframe
                          src={product.videoUrl.replace("watch?v=", "embed/").split("&")[0]}
                          title={product.title}
                          className="absolute inset-0 w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      )}
                    </AspectRatio>
                  </div>
                )
              ) : (
                <div className="rounded-3xl border border-border/60 bg-muted overflow-hidden shadow-sm">
                  <AspectRatio ratio={4 / 3}>
                    {product.thumbnail ? (
                      <Image src={product.thumbnail} alt={product.title} fill priority className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground font-bold uppercase tracking-widest text-xs">
                        No Preview
                      </div>
                    )}
                  </AspectRatio>
                </div>
              )}

              {screenshotsList.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {screenshotsList.map((src, i) => (
                    <AspectRatio key={i} ratio={16 / 9} className="rounded-xl border border-border/40 bg-muted overflow-hidden group cursor-zoom-in shadow-sm">
                      <Image
                        src={src}
                        alt={`${product.title} screenshot ${i + 1}`}
                        fill
                        loading="lazy"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </AspectRatio>
                  ))}
                </div>
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
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 space-y-10">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Badge variant="outline" className="rounded-full px-3 text-[10px] uppercase font-black tracking-[0.2em] border-primary/20 text-primary">
                    {product.category}
                  </Badge>
                  <h1 className="text-3xl md:text-5xl font-extrabold tracking-tighter text-foreground leading-[1.1]">
                    {product.title}
                  </h1>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                  {product.shortDescription}
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black tracking-tighter tabular-nums">
                    ${(product.price / 100).toFixed(2)}
                  </span>
                  <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">USD</span>
                </div>

                <div className="space-y-4">
                  <ProductCheckout
                    product={product}
                    hasPurchased={hasPurchased}
                    userLoggedIn={!!user}
                  />
                  
                  {product.demoUrl && (
                    <Button asChild variant="outline" className="w-full h-12 rounded-xl font-bold uppercase tracking-widest text-[11px]">
                      <a href={product.demoUrl} target="_blank" rel="noopener noreferrer">
                        Live Preview
                        <ExternalLink className="w-3.5 h-3.5 ml-2" />
                      </a>
                    </Button>
                  )}

                  <ShareButton productTitle={product.title} productSlug={product.slug} />
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
