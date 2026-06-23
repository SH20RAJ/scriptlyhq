import Link from "next/link";
import { BLOG_POSTS } from "../../lib/blog-data";
import { Compass, Sparkles, BookOpen, Clock, Calendar, ArrowRight, Search, FileText } from "lucide-react";
import { Metadata } from "next";
import { CyberBackground } from "../../components/ui/CyberBackground";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ScriptlyStore Blog | Traffic Driving Developer Resource Centre",
  description: "Read the latest developer guides, SaaS launching strategies, prompt engineering manuals, and software side-hustle guides.",
};

interface PageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
  }>;
}

export default async function BlogIndexPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const currentCategory = resolvedParams.category || "all";
  const currentSearch = (resolvedParams.search || "").toLowerCase();

  // Categories list
  const categoriesList = ["all", "SaaS", "Boilerplates", "Databases", "DevOps", "Side Hustle", "AI", "Business", "SEO"];

  // Filter BLOG_POSTS
  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesCategory = currentCategory === "all" || post.category.toLowerCase() === currentCategory.toLowerCase();
    const matchesSearch = !currentSearch || 
      post.title.toLowerCase().includes(currentSearch) ||
      post.excerpt.toLowerCase().includes(currentSearch) ||
      post.content.toLowerCase().includes(currentSearch);
    return matchesCategory && matchesSearch;
  });

  const featuredPost = BLOG_POSTS[0]; // First post is always featured when no active search/filter
  const displayFeatured = currentCategory === "all" && !currentSearch && filteredPosts.length > 0;
  
  const regularPosts = displayFeatured 
    ? filteredPosts.filter(p => p.slug !== featuredPost.slug)
    : filteredPosts;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground relative overflow-hidden">
      <CyberBackground />

      <div className="container max-w-6xl mx-auto px-4 py-12 md:py-20 space-y-16">
        
        {/* Header */}
        <header className="space-y-4 max-w-3xl">
          <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-[0.2em] text-[10px]">
             <BookOpen className="w-3 h-3" /> Resource Centre
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground font-sans">
            ScriptlyStore <span className="text-[#58CC02]">Dev Blog</span>
          </h1>
          <p className="text-sm md:text-base text-muted-foreground font-bold leading-relaxed">
            Actionable guides, framework reviews, deployment walkthroughs, and passive income playbooks built for solo developers and SaaS founders.
          </p>
        </header>

        {/* Filter Controls Bar */}
        <div className="sticky top-[3.5rem] z-30 bg-background/80 backdrop-blur-sm py-4 border-b border-border flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Horizontal Swiper Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none flex-1">
            {categoriesList.map((cat) => {
              const isActive = currentCategory === cat.toLowerCase();
              return (
                <Link
                  key={cat}
                  href={{
                    pathname: "/blog",
                    query: {
                      category: cat.toLowerCase(),
                      ...(currentSearch && { search: currentSearch })
                    }
                  }}
                  className={`px-4 py-2 text-xs font-black uppercase tracking-wider border-2 rounded-full transition-all cursor-pointer ${
                    isActive 
                      ? "bg-primary text-white border-primary shadow-[0_3px_0_#46A302]" 
                      : "bg-card text-muted-foreground border-border shadow-[0_3px_0_var(--border)] hover:-translate-y-0.5 active:translate-y-[2px]"
                  }`}
                >
                  {cat}
                </Link>
              );
            })}
          </div>

          {/* Search Inputs bar */}
          <form method="GET" action="/blog" className="relative group w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors z-5" />
            <input
              type="text"
              name="search"
              defaultValue={resolvedParams.search || ""}
              placeholder="Search developer resources..."
              className="pl-10 h-10 w-full bg-card border-2 border-border rounded-xl shadow-[0_3px_0_var(--border)] focus-visible:border-primary focus-visible:shadow-[0_3px_0_var(--duo-feather-shadow)] focus-visible:ring-0 transition-all font-bold text-xs"
            />
            {currentCategory !== "all" && (
              <input type="hidden" name="category" value={currentCategory} />
            )}
          </form>
        </div>

        {/* Featured Post Card */}
        {displayFeatured && (
          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#CE82FF] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#CE82FF] animate-pulse" />
                Featured Article
              </h2>
              <div className="h-px flex-1 bg-border/40" />
            </div>

            <Link
              href={`/blog/${featuredPost.slug}`}
              className="group grid grid-cols-1 lg:grid-cols-12 bg-card/35 border-2 border-border/80 hover:border-primary/60 rounded-[2.5rem] overflow-hidden transition-all shadow-[0_6px_0_var(--border)] hover:shadow-[0_6px_0_rgba(88,204,2,0.25)] hover:-translate-y-1 active:translate-y-0 active:shadow-none duration-300"
            >
              <div className="lg:col-span-7 aspect-[16/10] lg:aspect-auto relative bg-muted border-b lg:border-b-0 lg:border-r-2 border-border/80 overflow-hidden">
                <img
                  src={featuredPost.thumbnail}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                />
              </div>
              <div className="lg:col-span-5 p-8 md:p-10 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-[9px] font-black uppercase tracking-wider rounded-lg border border-primary/20">
                    {featuredPost.category}
                  </span>
                  <h3 className="text-xl md:text-2xl font-black text-foreground group-hover:text-primary transition-colors leading-tight">
                    {featuredPost.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                    {featuredPost.excerpt}
                  </p>
                </div>

                <div className="space-y-6 pt-4 border-t border-border/40">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black text-foreground">{featuredPost.author.name}</p>
                      <p className="text-[10px] text-muted-foreground font-bold">{featuredPost.author.role}</p>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-extrabold text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {featuredPost.readTime}</span>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-primary group-hover:underline">
                    Read Article <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Regular Posts Grid */}
        <section className="space-y-8">
          {displayFeatured && (
            <div className="flex items-center gap-4">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                Latest Articles
              </h2>
              <div className="h-px flex-1 bg-border/40" />
            </div>
          )}

          {filteredPosts.length === 0 ? (
            <div className="py-20 text-center border-2 border-dashed border-border/40 rounded-3xl bg-card/5 space-y-4">
              <FileText className="w-8 h-8 text-muted-foreground/60 mx-auto" />
              <p className="text-sm text-muted-foreground font-bold uppercase tracking-wider">No Articles Found</p>
              <p className="text-xs text-muted-foreground/60">Try adjusting your search queries or category filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col bg-card/35 border-2 border-border/60 hover:border-primary/60 rounded-[2rem] overflow-hidden transition-all shadow-[0_4px_0_var(--border)] hover:shadow-[0_4px_0_rgba(88,204,2,0.25)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none duration-250"
                >
                  <div className="aspect-[16/10] w-full overflow-hidden relative border-b border-border/60 bg-muted">
                    <img
                      src={post.thumbnail}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3.5 left-3.5 bg-background/90 backdrop-blur-md text-foreground text-[8px] font-black uppercase px-2 py-0.5 rounded-md border border-border/40">
                      {post.category}
                    </span>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-black text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h4>
                      <p className="text-xs text-muted-foreground font-medium line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-border/40 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-muted-foreground">By {post.author.name}</span>
                      <span className="text-[9px] font-black uppercase text-muted-foreground flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" /> {post.readTime}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
