import Link from "next/link";
import { ArrowRight, BookOpen, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface LearnSectionProps {
  posts: any[];
}

export default function LearnSection({ posts = [] }: LearnSectionProps) {
  const displayPosts = posts.slice(0, 3);

  return (
    <section className="py-16 sm:py-24 border-b border-border/50">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Engineering & Growth</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
              Learn to ship
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-lg">
              Practical guides on micro-SaaS architecture, digital monetization, and shipping developer side projects.
            </p>
          </div>

          <Button asChild variant="outline" size="sm" className="rounded-xl font-bold self-start md:self-auto">
            <Link href="/blog" className="flex items-center gap-1.5">
              <span>View All Guides</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-border/50 bg-card/60 backdrop-blur-md hover:bg-card hover:border-border hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 transition-all duration-200"
            >
              <div>
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-secondary/40">
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="outline" className="rounded-full bg-background/90 backdrop-blur-md text-[10px] font-bold uppercase px-2.5">
                      {post.category}
                    </Badge>
                  </div>
                </div>

                <div className="p-5 sm:p-6 space-y-2">
                  <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{post.readTime}</span>
                    <span>•</span>
                    <span>{post.createdAt}</span>
                  </div>

                  <h3 className="font-bold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-5 sm:px-6 pb-5 pt-0 flex items-center gap-1 text-xs font-bold text-primary">
                <span>Read Article</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
