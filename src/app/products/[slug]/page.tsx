export const dynamic = "force-dynamic";

import { db } from "../../../db";
import { products, orders } from "../../../db/schema";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getOrCreateDbUser } from "../../../lib/auth-utils";
import ProductCheckout from "../../../components/ProductCheckout";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Dynamic SEO metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await db.query.products.findFirst({
    where: eq(products.slug, slug),
  });

  if (!product) {
    return {
      title: "Product Not Found | ScriptlyHQ",
    };
  }

  return {
    title: `${product.title} - ScriptlyHQ`,
    description: product.shortDescription,
    openGraph: {
      title: `${product.title} - ScriptlyHQ`,
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

  if (!product) {
    notFound();
  }

  // Get current session user to check if they have purchased
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
    if (purchase) {
      hasPurchased = true;
    }
  }

  // Format date
  const updatedDate = new Date(product.updatedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Extract tags list
  const tagsList = product.tags
    ? product.tags.split(",").map((t) => t.trim())
    : [];

  // Extract screenshots list
  const screenshotsList = product.screenshots
    ? product.screenshots.split(",").map((s) => s.trim())
    : [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Back Button */}
      <Button asChild variant="ghost" size="sm" className="-ml-2 text-muted-foreground hover:text-foreground">
        <Link href="/">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to browse
        </Link>
      </Button>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* Left Side: Images, Info, Description */}
        <div className="lg:col-span-7 space-y-12">
          
          {/* Main Media (Video or Image) */}
          <div className="space-y-6">
            {product.videoUrl ? (
              <AspectRatio ratio={16 / 9} className="rounded-xl border border-border bg-black overflow-hidden shadow-sm">
                <iframe
                  src={product.videoUrl.replace("watch?v=", "embed/").split("&")[0]}
                  title={product.title}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </AspectRatio>
            ) : (
              <AspectRatio ratio={4 / 3} className="rounded-xl border border-border bg-muted overflow-hidden">
                {product.thumbnail ? (
                  <Image
                    src={product.thumbnail}
                    alt={product.title}
                    fill
                    priority
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-black font-mono uppercase text-sm">
                    No Preview Available
                  </div>
                )}
              </AspectRatio>
            )}

            {/* Screenshots Gallery */}
            {screenshotsList.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {screenshotsList.map((src, i) => (
                  <AspectRatio key={i} ratio={16 / 9} className="rounded-lg border border-border bg-muted overflow-hidden group cursor-zoom-in">
                    <Image
                      src={src}
                      alt={`${product.title} screenshot ${i + 1}`}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </AspectRatio>
                ))}
              </div>
            )}
          </div>

          {/* Description Content */}
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-foreground">Overview</h2>
            <div className="text-muted-foreground text-base leading-relaxed space-y-4 whitespace-pre-wrap">
              {product.description}
            </div>
          </div>

          {/* Tags */}
          {tagsList.length > 0 && (
            <div className="space-y-4 pt-6">
              <Separator className="mb-6" />
              <h3 className="text-sm font-medium text-foreground">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tagsList.map((tag) => (
                  <Badge key={tag} variant="secondary" asChild>
                    <Link href={`/tags/${encodeURIComponent(tag)}`}>
                      {tag}
                    </Link>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Sticky Details & Purchase Options */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 space-y-8">
            
            <div className="space-y-4">
              <Badge variant="outline" className="uppercase tracking-wide text-muted-foreground border-border">
                {product.category}
              </Badge>
              <h1 className="text-3xl sm:text-4xl font-semibold text-foreground tracking-tight leading-snug">
                {product.title}
              </h1>
              <p className="text-base text-muted-foreground leading-relaxed">
                {product.shortDescription}
              </p>
            </div>

            <div className="pt-4 space-y-6">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-foreground">
                  ₹{(product.price / 100).toLocaleString("en-IN")}
                </span>
                <span className="text-sm text-muted-foreground">INR</span>
              </div>

              {/* Actions Panel */}
              <div className="space-y-3">
                <ProductCheckout
                  productId={product.id}
                  productSlug={product.slug}
                  price={product.price}
                  hasPurchased={hasPurchased}
                  userLoggedIn={!!user}
                />
                
                {product.demoUrl && (
                  <Button asChild variant="outline" className="w-full h-11 rounded-lg">
                    <a
                      href={product.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>View Live Demo</span>
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                )}
              </div>
            </div>

            {/* Product Meta */}
            <div className="space-y-4 pt-6">
              <Separator />
              <div className="space-y-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Version</span>
                  <span className="text-foreground font-mono">v{product.version}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Last updated</span>
                  <span className="text-foreground">{updatedDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Access</span>
                  <span className="text-foreground">Instant Download</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
