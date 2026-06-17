import { getProductsAction, getCategoriesAction } from "../../lib/actions/products";
import { ProductCard } from "../../components/SearchFilter";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Explore Library | ScriptlyStore",
  description: "Browse premium digital assets by category. SaaS templates, UI kits, boilerplates and more.",
};

export default async function ExplorePage() {
  const categories = await getCategoriesAction();
  
  // Fetch initial products for each category to show previews
  const allCategoriesWithProducts = await Promise.all(
    categories.map(async (cat) => {
      const { products } = await getProductsAction({ 
        category: cat.slug, 
        limit: 3,
        sortBy: "featured_premium"
      });
      return { ...cat, products };
    })
  );

  // Filter out categories with no products
  const categoriesWithProducts = allCategoriesWithProducts.filter(cat => cat.products.length > 0);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container max-w-7xl mx-auto px-4 py-12 md:py-20 space-y-20">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/60 pb-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-[0.2em] text-[10px]">
               <Compass className="w-3 h-3" /> Discover
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tighter text-foreground">
              Explore Library
            </h1>
            <p className="text-muted-foreground font-medium max-w-xl">
              Our complete catalog of professional assets, refined and organized for your next build.
            </p>
          </div>
        </div>

        {/* Categories Sections */}
        <div className="space-y-32">
          {categoriesWithProducts.map((cat) => (
            <section key={cat.id} className="space-y-10">
              <div className="flex items-center justify-between gap-4">
                 <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">{cat.name}</h2>
                    <p className="text-sm text-muted-foreground font-medium">Premium {cat.name.toLowerCase()} for modern developers.</p>
                 </div>
                 <Button asChild variant="ghost" className="font-bold uppercase tracking-widest text-[10px] gap-2">
                    <Link href={`/?category=${cat.slug}`}>
                       View All
                       <ArrowRight className="w-3 h-3" />
                    </Link>
                 </Button>
              </div>

              {cat.products.length === 0 ? (
                <div className="py-10 border border-dashed border-border rounded-3xl text-center">
                   <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Collection coming soon</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {cat.products.map((prod) => (
                    <ProductCard key={prod.id} prod={prod} categoryName={cat.name} />
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Action Bar */}
        <div className="pt-20 border-t border-border/40 text-center space-y-6">
           <h2 className="text-xl font-bold tracking-tight">Can't find what you're looking for?</h2>
           <div className="flex items-center justify-center gap-4">
              <Button asChild size="lg" className="rounded-full px-8 h-12 font-bold uppercase tracking-widest text-[10px]">
                 <Link href="/search">Try Advanced Search</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8 h-12 font-bold uppercase tracking-widest text-[10px]">
                 <Link href="/contact">Request a Script</Link>
              </Button>
           </div>
        </div>
      </div>
    </div>
  );
}
