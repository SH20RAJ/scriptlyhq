import { db } from "../../../db";
import { products, orders } from "../../../db/schema";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getOrCreateDbUser } from "../../../lib/auth-utils";
import ProductCheckout from "../../../components/ProductCheckout";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ExternalLink, Calendar, ShieldCheck, Tag } from "lucide-react";
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
  const updatedDate = new Date(product.updatedAt).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Extract tags list
  const tagsList = product.tags
    ? product.tags.split(",").map((t) => t.trim())
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back Button */}
      <Link
        href="/"
        className="inline-flex items-center text-sm text-neutral-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to browse
      </Link>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Side: Images, Info, Description */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Main Display Image */}
          <div className="relative aspect-video w-full rounded-2xl border border-neutral-900 bg-neutral-950 overflow-hidden shadow-2xl">
            {product.thumbnail ? (
              <Image
                src={product.thumbnail}
                alt={product.title}
                fill
                priority
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-600 bg-neutral-950 font-mono uppercase text-sm">
                No Preview Available
              </div>
            )}
          </div>

          {/* Description Card */}
          <div className="p-8 rounded-2xl border border-neutral-900 bg-neutral-900/10 backdrop-blur-sm space-y-6">
            <h2 className="text-xl font-bold text-white border-b border-neutral-900 pb-3">
              Description
            </h2>
            <div className="text-neutral-300 leading-relaxed space-y-4 whitespace-pre-wrap">
              {product.description}
            </div>
          </div>

          {/* Tags */}
          {tagsList.length > 0 && (
            <div className="p-6 rounded-xl border border-neutral-900 bg-neutral-900/10 backdrop-blur-sm space-y-3">
              <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                <Tag className="w-3.5 h-3.5" /> Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {tagsList.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-neutral-900 border border-neutral-800 text-neutral-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Sticky Details & Purchase Options */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 p-6 rounded-2xl border border-neutral-900 bg-neutral-900/30 backdrop-blur-md space-y-6 shadow-2xl shadow-emerald-500/2">
            
            <div className="space-y-2">
              <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-400">
                {product.category}
              </span>
              <h1 className="text-2xl font-extrabold text-white tracking-tight leading-snug">
                {product.title}
              </h1>
              <p className="text-sm text-neutral-400">
                {product.shortDescription}
              </p>
            </div>

            <div className="border-t border-neutral-900 pt-6 space-y-4">
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-neutral-500">Price</span>
                <span className="text-3xl font-black text-white">
                  ₹{(product.price / 100).toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Actions Panel */}
            <div className="pt-2 space-y-3">
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
                  className="w-full inline-flex items-center justify-center space-x-2 px-6 py-3.5 border border-neutral-800 hover:border-neutral-700 bg-neutral-900/20 hover:bg-neutral-900/40 text-neutral-300 hover:text-white transition-all text-sm font-semibold rounded-xl text-center cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Live Demo</span>
                </a>
              )}
            </div>

            {/* Product Meta */}
            <div className="border-t border-neutral-900 pt-6 space-y-3.5 text-xs text-neutral-400">
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Version</span>
                <span className="font-mono text-neutral-300">v{product.version}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Last updated</span>
                <span className="flex items-center gap-1.5 text-neutral-300">
                  <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                  {updatedDate}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Delivery</span>
                <span className="flex items-center gap-1.5 text-neutral-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  Instant Download
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
