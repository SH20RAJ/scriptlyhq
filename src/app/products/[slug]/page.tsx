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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Back Button */}
      <Link
        href="/"
        className="inline-flex items-center text-sm font-medium text-neutral-500 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to browse
      </Link>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* Left Side: Images, Info, Description */}
        <div className="lg:col-span-7 space-y-12">
          
          {/* Main Display Image */}
          <div className="relative aspect-[4/3] w-full rounded-xl border border-neutral-800 bg-neutral-900 overflow-hidden">
            {product.thumbnail ? (
              <Image
                src={product.thumbnail}
                alt={product.title}
                fill
                priority
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-600 bg-black font-mono uppercase text-sm">
                No Preview Available
              </div>
            )}
          </div>

          {/* Description Content */}
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-white">Overview</h2>
            <div className="text-neutral-400 text-base leading-relaxed space-y-4 whitespace-pre-wrap">
              {product.description}
            </div>
          </div>

          {/* Tags */}
          {tagsList.length > 0 && (
            <div className="space-y-4 pt-6 border-t border-neutral-900">
              <h3 className="text-sm font-medium text-white">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tagsList.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-md text-xs font-medium bg-neutral-900 border border-neutral-800 text-neutral-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Sticky Details & Purchase Options */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 space-y-8">
            
            <div className="space-y-4">
              <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
                {product.category}
              </span>
              <h1 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight leading-snug">
                {product.title}
              </h1>
              <p className="text-base text-neutral-400 leading-relaxed">
                {product.shortDescription}
              </p>
            </div>

            <div className="pt-4 space-y-6">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white">
                  ₹{(product.price / 100).toLocaleString("en-IN")}
                </span>
                <span className="text-sm text-neutral-500">INR</span>
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
                  <a
                    href={product.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center space-x-2 px-6 py-3 border border-neutral-800 hover:border-neutral-600 bg-transparent text-white transition-colors text-sm font-medium rounded-lg text-center cursor-pointer"
                  >
                    <span>View Live Demo</span>
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </a>
                )}
              </div>
            </div>

            {/* Product Meta */}
            <div className="border-t border-neutral-900 pt-6 space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Version</span>
                <span className="text-neutral-300 font-mono">v{product.version}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Last updated</span>
                <span className="text-neutral-300">{updatedDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Access</span>
                <span className="text-neutral-300">Instant Download</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
