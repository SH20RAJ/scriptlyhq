import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Compass, ExternalLink, ArrowRight } from "lucide-react";
import { CyberBackground } from "@/components/ui/CyberBackground";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Awesome SaaS Launch Directories - Complete SEO Registry",
  description: "Browse 150+ top SaaS directories, startup launchpads, and marketing directories to submit your software, boost domain authority, and accelerate SEO.",
  alternates: {
    canonical: "https://scriptly.store/directories",
  },
};

interface Directory {
  id: number;
  name: string;
  description: string;
  submission_link: string;
}

interface PageProps {
  searchParams: Promise<{
    search?: string;
  }>;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default async function DirectoriesPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const searchQuery = resolvedParams.search || "";

  // Fetch awesome saas directories list from SSR
  const res = await fetch("https://raw.githubusercontent.com/theshubh77/awesome-saas-directories/master/launchdb.json", {
    next: { revalidate: 86400 } // Cache for 24 hours
  });
  const directories: Directory[] = await res.json();

  // Filter items if search query is provided
  const filtered = directories.filter(dir => 
    dir.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dir.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Awesome SaaS Launch Directories",
    "description": "A curated directory of places to launch your SaaS and boost SEO.",
    "numberOfItems": directories.length,
    "itemListElement": directories.slice(0, 50).map((dir, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `https://scriptly.store/directories/${slugify(dir.name)}`,
      "name": dir.name,
      "description": dir.description
    }))
  };

  return (
    <div className="flex flex-col min-h-screen text-foreground relative bg-background">
      <CyberBackground />
      
      {/* Schema.org Script injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <div className="container max-w-7xl mx-auto px-4 py-16 md:py-24 space-y-16 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <Badge variant="outline" className="rounded-full px-3 py-1 text-[10px] uppercase font-black tracking-[0.2em] border-[#1CB0F6]/20 text-[#1CB0F6] bg-[#1CB0F6]/5 animate-pulse">
             SEO Booster Registry
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground sm:leading-[1.1]">
            Awesome SaaS Directories <br />
            <span className="bg-gradient-to-r from-primary via-[#1CB0F6] to-[#CE82FF] bg-clip-text text-transparent">Launch & SEO Backlinks</span>
          </h1>
          <p className="text-base text-muted-foreground font-medium leading-relaxed max-w-2xl mx-auto">
            Submit your startup to 150+ high-authority platforms to gain early adopters, build authoritative backlinks, and improve domain ranking.
          </p>
        </div>

        {/* Server-Side Search Filter */}
        <div className="max-w-md mx-auto w-full">
          <form method="GET" action="/directories" className="relative group">
            <input
              type="text"
              name="search"
              defaultValue={searchQuery}
              placeholder="Search directories by name or description..."
              className="w-full pl-12 pr-28 py-3 text-xs font-semibold rounded-2xl border-2 border-border bg-card/60 backdrop-blur-md text-foreground placeholder:text-muted-foreground focus:outline-none transition-all shadow-[0_4px_0_var(--border)] dark:shadow-[0_4px_0_#2A3842]"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 text-[9px] font-black uppercase bg-[#1CB0F6] text-white rounded-xl shadow-[0_3px_0_#1899D6] hover:brightness-105 active:translate-y-[1px] active:shadow-none transition-all"
            >
              Search
            </button>
          </form>
        </div>

        {/* Directories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-20 border border-dashed border-border rounded-[2.5rem] bg-card/10 space-y-4">
              <Compass className="w-10 h-10 text-muted-foreground mx-auto" />
              <p className="text-sm font-bold text-muted-foreground">No directories match your query.</p>
              <Button asChild variant="outline" size="sm">
                <Link href="/directories">Reset Search</Link>
              </Button>
            </div>
          ) : (
            filtered.map((dir) => {
              const slug = slugify(dir.name);
              return (
                <Card 
                  key={dir.id}
                  className="border-2 border-border bg-card/45 backdrop-blur-sm shadow-[0_4px_0_var(--border)] dark:shadow-[0_4px_0_#2A3842] hover:translate-y-[-4px] hover:shadow-[0_8px_0_var(--border)] transition-all duration-300 rounded-[2rem] flex flex-col justify-between overflow-hidden group"
                >
                  <CardContent className="p-6 sm:p-8 flex flex-col justify-between h-full space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge className="bg-primary/10 text-primary border-primary/20 text-[8px] uppercase tracking-wider font-bold">
                           Directory #{dir.id}
                        </Badge>
                        <a 
                          href={dir.submission_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-[#1CB0F6] transition-colors"
                          title="Direct Submission Link"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                      <h3 className="text-lg font-black text-foreground group-hover:text-[#1CB0F6] transition-colors line-clamp-1">
                        {dir.name}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed font-semibold line-clamp-3">
                        {dir.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-border/40 flex items-center justify-between">
                      <a 
                        href={dir.submission_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[9px] font-black uppercase text-[#1CB0F6] hover:underline flex items-center gap-1"
                      >
                        Submit Tool <ExternalLink className="w-3 h-3" />
                      </a>
                      <Button asChild size="sm" variant="secondary" className="rounded-xl h-8 px-4 font-bold text-[9px] uppercase tracking-wider">
                        <Link href={`/directories/${slug}`} className="flex items-center gap-1">
                          SEO Insights
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
