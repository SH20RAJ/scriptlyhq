import { Metadata } from "next";
import { db } from "@/db";
import { users, products, coupons } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/SearchFilter";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Landmark, ArrowLeft, Code, Tag, ShoppingBag, Globe } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface StorePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: StorePageProps): Promise<Metadata> {
  const { id } = await params;
  const creator = await db.query.users.findFirst({
    where: eq(users.id, id),
  });

  if (!creator) {
    return {
      title: "Store Not Found | ScriptlyStore",
    };
  }

  const displayName = creator.storeName || creator.name || "Creator's Store";

  return {
    title: `${displayName} Storefront | ScriptlyStore`,
    description: `Explore SaaS templates, extensions, prompts, and developer scripts listed by ${displayName} on ScriptlyStore.`,
  };
}

export default async function CreatorStorefrontPage({ params }: StorePageProps) {
  const { id } = await params;

  // 1. Fetch Creator details
  const creator = await db.query.users.findFirst({
    where: eq(users.id, id),
  });

  // Redirect to notFound only if the user doesn't exist at all
  if (!creator) {
    notFound();
  }

  const displayName = creator.storeName || creator.name || "Creator's Store";

  // 2. Fetch Creator's approved & published products
  const storeProducts = await db.query.products.findMany({
    where: and(
      eq(products.creatorId, id),
      eq(products.status, "approved"),
      eq(products.published, true)
    ),
    orderBy: desc(products.createdAt),
  });

  // 3. Fetch Creator's active coupons
  const activeCoupons = await db.query.coupons.findMany({
    where: and(
      eq(coupons.creatorId, id),
      eq(coupons.active, true)
    ),
    orderBy: desc(coupons.createdAt),
  });

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Visual Header Banner */}
      <div className="w-full bg-neutral-950 border-b border-border/40 py-16 md:py-24 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container max-w-7xl mx-auto px-4 space-y-6 relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Explore
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Landmark className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-white">
                    {displayName}
                  </h1>
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Code className="w-3.5 h-3.5" />
                      Creator ID: {creator.id.slice(0, 8)}...
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <ShoppingBag className="w-3.5 h-3.5" />
                      {storeProducts.length} Listings
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Split Route Active Indicator */}
            {creator.razorpayAccountId && (
              <Badge variant="outline" className="h-7 px-3 rounded-full font-bold uppercase tracking-widest text-[9px] bg-emerald-500/5 text-emerald-400 border-emerald-500/20 flex items-center gap-1.5 self-start md:self-center">
                <Globe className="w-3.5 h-3.5" />
                Automated Split routing Active
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 py-12 md:py-16 space-y-16">
        
        {/* Dynamic Promotions / Coupons */}
        {activeCoupons.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500 flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-purple-400" />
                Active Store Promos
              </h2>
              <div className="h-px flex-1 bg-neutral-900" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {activeCoupons.map((coupon) => (
                <Card key={coupon.id} className="border-border/40 bg-neutral-950/40 backdrop-blur-sm rounded-2xl relative overflow-hidden select-none hover:border-purple-500/20 transition-all duration-300">
                  <CardContent className="p-4 flex flex-col gap-2">
                    <div className="flex justify-between items-center gap-2">
                      <Badge className="font-mono text-xs tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        {coupon.code}
                      </Badge>
                      <span className="text-[10px] font-bold text-neutral-400 uppercase">
                        {coupon.discountType === "percentage" ? `${coupon.discountValue}% Off` : `$${(coupon.discountValue / 100).toFixed(0)} Off`}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">
                      Applies on all items in this store. Min Purchase: ${(coupon.minPurchaseAmount / 100).toFixed(2)} USD.
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Catalog */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">
              Catalog Items
            </h2>
            <div className="h-px flex-1 bg-neutral-900" />
          </div>

          {storeProducts.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-neutral-900 rounded-3xl">
              <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                No items currently published on this storefront
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {storeProducts.map((prod) => (
                <ProductCard key={prod.id} prod={prod} categoryName={prod.category} />
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
