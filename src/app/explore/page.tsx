import { getProductsAction, getCategoriesAction } from "../../lib/actions/products";
import { ProductCard } from "../../components/SearchFilter";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Compass, Terminal, Zap, Palette, Bot, BookOpen, LayoutGrid, HelpCircle } from "lucide-react";
import { Metadata } from "next";
import { CyberBackground } from "../../components/ui/CyberBackground";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Explore Library - Premium Digital Products & Scripts | ScriptlyStore",
  description: "Browse our extensive, developer-verified library of SaaS boilerplates, browser extensions, automation scrapers, design kits, and ebooks.",
};

export default async function ExplorePage() {
  const categories = await getCategoriesAction();
  
  // Fetch initial products for each category to show previews (Limit to 12 for max products)
  const allCategoriesWithProducts = await Promise.all(
    categories.map(async (cat) => {
      const { products } = await getProductsAction({ 
        category: cat.slug, 
        limit: 12,
        sortBy: "featured_premium"
      });
      return { ...cat, products };
    })
  );

  // Filter out categories with no products
  const categoriesWithProducts = allCategoriesWithProducts.filter(cat => cat.products.length > 0);

  const getCategoryIcon = (slug: string) => {
    switch(slug) {
      case "scripts": return <Terminal className="w-5 h-5 text-[#1CB0F6]" />;
      case "saas-templates": return <Zap className="w-5 h-5 text-[#58CC02]" />;
      case "design-assets": return <Palette className="w-5 h-5 text-[#CE82FF]" />;
      case "ai-prompts": return <Bot className="w-5 h-5 text-[#FFC800]" />;
      case "ebooks": return <BookOpen className="w-5 h-5 text-[#FF9600]" />;
      default: return <LayoutGrid className="w-5 h-5 text-primary" />;
    }
  };

  const getCategoryColor = (slug: string) => {
    switch(slug) {
      case "scripts": return "text-[#1CB0F6]";
      case "saas-templates": return "text-[#58CC02]";
      case "design-assets": return "text-[#CE82FF]";
      case "ai-prompts": return "text-[#FFC800]";
      case "ebooks": return "text-[#FF9600]";
      default: return "text-primary";
    }
  };

  return (
    <div className="flex flex-col min-h-screen text-foreground relative bg-background">
      <CyberBackground />
      
      <div className="container max-w-7xl mx-auto px-4 py-12 md:py-20 space-y-24">
        
        {/* Typographic Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px]">
               <Compass className="w-4 h-4 text-primary animate-pulse" /> Discover
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground leading-none">
              Explore Library
            </h1>
            <p className="text-muted-foreground font-bold max-w-xl text-sm sm:text-base leading-relaxed">
              Accelerate your pipeline with our complete, developer-curated catalog of templates, boilerplates, and automated tools.
            </p>
          </div>
        </div>

        {/* Categories Sections */}
        <div className="space-y-24">
          {categoriesWithProducts.map((cat) => (
            <section key={cat.id} className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
                 <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-muted/40 rounded-xl">
                       {getCategoryIcon(cat.slug)}
                    </div>
                    <div className="space-y-0.5">
                       <h2 className="text-xl md:text-2xl font-black uppercase tracking-wider text-foreground">{cat.name}</h2>
                       <p className="text-[11px] text-muted-foreground font-bold tracking-wide uppercase">
                         Premium verified developer tools under {cat.name}
                       </p>
                    </div>
                 </div>
                 <Button asChild variant="ghost" className="font-extrabold uppercase tracking-widest text-[9px] gap-2 h-9 border border-border bg-card/40 shadow-sm active:translate-y-[2px]">
                    <Link href={`/?category=${cat.slug}`}>
                       View All Products ({cat.products.length}+)
                       <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                 </Button>
              </div>

              {cat.products.length === 0 ? (
                <div className="py-12 border-2 border-dashed border-border/40 rounded-[2rem] text-center bg-card/10">
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

        {/* Bottom Call to Action */}
        <div className="pt-16 border-t border-border text-center space-y-6">
           <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">Can't find what you need?</h2>
           <p className="text-muted-foreground text-sm font-semibold max-w-md mx-auto">
             Get custom development features, request a script, or search with advanced tags.
           </p>
           <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="xl" className="w-full sm:w-auto font-black shadow-[0_5px_0_#46A302]">
                 <Link href="/search">Try Advanced Search</Link>
              </Button>
              <Button asChild variant="outline" size="xl" className="w-full sm:w-auto font-black">
                 <Link href="/contact">Request a Custom Script</Link>
              </Button>
           </div>
        </div>
      </div>
    </div>
  );
}
