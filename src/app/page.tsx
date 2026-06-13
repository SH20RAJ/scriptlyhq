export const dynamic = "force-dynamic";

import { getProductsAction, getCategoriesAction } from "../lib/actions/products";
import SearchFilter, { ProductCard } from "../components/SearchFilter";
import { ProductPagination } from "../components/ProductPagination";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    page?: string;
  }>;
}

export default async function Home({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const currentCategory = resolvedParams.category || "all";
  const currentSearch = resolvedParams.search || "";
  const currentPage = parseInt(resolvedParams.page || "1");

  // Fetch products and categories using server actions
  const { products: productsList, totalPages } = await getProductsAction({
    category: currentCategory,
    search: currentSearch,
    page: currentPage,
    limit: 12,
  });

  const categoriesList = await getCategoriesAction();

  // Separate featured products
  const featuredProducts = productsList.filter((p) => p.featured);
  const regularProducts = productsList.filter((p) => !p.featured);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-20 md:pt-32 md:pb-28">
        <div className="container max-w-7xl mx-auto px-4 relative z-10 text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground sm:leading-[1.1]">
              The premium marketplace <br />
              <span className="text-muted-foreground">for digital craft.</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed">
              Curated collection of SaaS boilerplates, UI kits, templates and developer tools to help you ship faster.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="h-12 px-8 rounded-full font-semibold">
              <Link href="/search">Explore Library</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 px-8 rounded-full font-semibold">
              <Link href="/handler/sign-up">Join as Builder</Link>
            </Button>
          </div>
        </div>
        
        {/* Subtle Decorative Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none -z-10 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container max-w-7xl mx-auto px-4 pb-24 space-y-24">
        
        {/* Filter & Search */}
        <div className="sticky top-[3.5rem] z-30 bg-background/80 backdrop-blur-sm py-4 border-b border-border/40">
           <SearchFilter categories={categoriesList} />
        </div>

        <div className="space-y-20">
          {/* Featured Section */}
          {featuredProducts.length > 0 && !currentSearch && (
            <section className="space-y-10">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold tracking-tight">Featured Drops</h2>
                <div className="h-px flex-1 bg-border/50" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {featuredProducts.map((prod) => (
                  <ProductCard 
                    key={prod.id} 
                    prod={prod} 
                    categoryName={categoriesList.find((c) => c.slug === prod.category)?.name || prod.category} 
                  />
                ))}
              </div>
            </section>
          )}

          {/* Regular Catalog */}
          <section className="space-y-10">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                <h2 className="text-xl font-bold tracking-tight">
                  {currentSearch || currentCategory !== "all" ? "Search Results" : "Latest Releases"}
                </h2>
                <div className="h-px flex-1 bg-border/50" />
              </div>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest whitespace-nowrap">
                {productsList.length} Items Available
              </span>
            </div>

            {productsList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 border border-dashed border-border rounded-3xl bg-muted/20">
                <p className="text-muted-foreground text-sm font-medium">No results found for your selection.</p>
                <Button asChild variant="link" className="mt-2 text-foreground">
                  <Link href="/">Clear all filters</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {(currentSearch || currentCategory !== "all" ? productsList : regularProducts).map((prod) => (
                  <ProductCard 
                    key={prod.id} 
                    prod={prod} 
                    categoryName={categoriesList.find((c) => c.slug === prod.category)?.name || prod.category} 
                  />
                ))}
              </div>
            )}

            <div className="pt-8 border-t border-border/40">
              <ProductPagination totalPages={totalPages} currentPage={currentPage} />
            </div>
          </section>
        </div>
      </div>
      
      {/* Premium Footer */}
      <footer className="mt-auto border-t border-border/40 bg-card/20 py-16">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-border/40 pb-12 mb-10">
            <div className="space-y-4">
              <p className="text-lg font-black tracking-tighter">ScriptlyStore</p>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-xs font-medium">
                Premium digital product marketplace for developer templates, SaaS boilerplates, prompts, scripts, and UI kits.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-foreground">Marketplace</h4>
              <ul className="space-y-2 text-xs font-medium text-muted-foreground">
                <li><Link href="/" className="hover:text-foreground transition-colors">Explore</Link></li>
                <li><Link href="/search" className="hover:text-foreground transition-colors">Search</Link></li>
                <li><Link href="/offers" className="hover:text-foreground transition-colors">Offers</Link></li>
                <li><Link href="/rss" className="hover:text-foreground transition-colors">RSS Feed</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-foreground">Legal & Compliance</h4>
              <ul className="space-y-2 text-xs font-medium text-muted-foreground">
                <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link href="/refund" className="hover:text-foreground transition-colors">Refund Policy</Link></li>
                <li><Link href="/shipping" className="hover:text-foreground transition-colors">Shipping Policy</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-foreground">Company</h4>
              <ul className="space-y-2 text-xs font-medium text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact Support</Link></li>
                <li><Link href="/licenses" className="hover:text-foreground transition-colors">Product Licenses</Link></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground font-medium">© 2026 Strivio Inc. All rights reserved.</p>
            <p className="text-[10px] text-muted-foreground/60 font-mono">Designed for developers & digital creators.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
