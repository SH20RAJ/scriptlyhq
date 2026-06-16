import { BLOG_POSTS, BlogPost } from "../../../lib/blog-data";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Calendar, ChevronRight, Share2, Sparkles } from "lucide-react";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) {
    return {
      title: "Article Not Found | ScriptlyStore",
    };
  }
  return {
    title: `${post.title} | ScriptlyStore Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.thumbnail }],
      type: "article",
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) {
    notFound();
  }

  // Parse custom markdown layout simply
  const renderContent = (markdown: string) => {
    const blocks = markdown.split("\n\n");
    let inCodeBlock = false;
    let codeContent: string[] = [];

    return blocks.map((block, i) => {
      const trimmed = block.trim();
      if (!trimmed) return null;

      // Handle Code Blocks
      if (trimmed.startsWith("```")) {
        if (inCodeBlock) {
          inCodeBlock = false;
          const content = codeContent.join("\n\n");
          codeContent = [];
          return (
            <pre key={i} className="my-6 p-5 bg-card border-2 border-border rounded-2xl overflow-x-auto font-mono text-xs text-foreground shadow-sm">
              <code>{content.replace(/```[a-z]*/g, "")}</code>
            </pre>
          );
        } else {
          inCodeBlock = true;
          codeContent.push(trimmed);
          return null;
        }
      }

      if (inCodeBlock) {
        codeContent.push(trimmed);
        return null;
      }

      // Headings
      if (trimmed.startsWith("## ")) {
        return (
          <h2 key={i} className="text-xl md:text-2xl font-black text-foreground mt-8 mb-4 tracking-tight leading-tight uppercase">
            {trimmed.replace("## ", "")}
          </h2>
        );
      }
      if (trimmed.startsWith("### ")) {
        return (
          <h3 key={i} className="text-lg font-black text-foreground mt-6 mb-3 tracking-tight uppercase">
            {trimmed.replace("### ", "")}
          </h3>
        );
      }

      // Bullet points
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        const items = trimmed.split("\n").map(li => li.replace(/^[-*]\s+/, ""));
        return (
          <ul key={i} className="list-disc pl-6 my-4 space-y-2 text-sm text-muted-foreground font-medium leading-relaxed">
            {items.map((item, idx) => (
              <li key={idx} dangerouslySetInnerHTML={{ __html: parseInlineStyles(item) }} />
            ))}
          </ul>
        );
      }

      // Normal paragraph
      return (
        <p 
          key={i} 
          className="my-4 text-sm md:text-base text-muted-foreground font-medium leading-relaxed"
          dangerouslySetInnerHTML={{ __html: parseInlineStyles(trimmed) }}
        />
      );
    });
  };

  // Helper to parse links and bold inline styles
  const parseInlineStyles = (text: string) => {
    let html = text;
    // Bold: **text** -> <strong>text</strong>
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    // Code blocks: `code` -> <code class="bg-muted px-1.5 py-0.5 rounded font-mono text-xs">code</code>
    html = html.replace(/`(.*?)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded font-mono text-xs text-foreground">$1</code>');
    // Markdown links: [text](url) -> <a href="url" class="text-primary hover:underline font-black">text</a>
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-primary hover:underline font-black">$1</a>');
    return html;
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground relative overflow-hidden">
      
      {/* Mesh Background Lights */}
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-purple-500/5 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-[800px] right-[-300px] w-[600px] h-[600px] bg-emerald-500/5 blur-[160px] rounded-full pointer-events-none -z-10" />

      {/* Cyberpunk Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none -z-20" />

      <div className="container max-w-4xl mx-auto px-4 py-12 md:py-16 space-y-10">
        
        {/* Navigation Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
          <Link href="/blog" className="hover:text-foreground flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Blog
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground max-w-[200px] truncate">{post.category}</span>
        </nav>

        {/* Article Header */}
        <header className="space-y-6">
          <div className="space-y-3">
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider rounded-lg border border-primary/20">
              {post.category}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground tracking-tight leading-tight font-sans">
              {post.title}
            </h1>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-border/40">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-xs font-black text-foreground">By {post.author.name}</p>
                <p className="text-[10px] text-muted-foreground font-bold">{post.author.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-[11px] font-extrabold text-muted-foreground uppercase">
              <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {post.createdAt}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {post.readTime}</span>
            </div>
          </div>
        </header>

        {/* Feature Image Banner */}
        <div className="aspect-[21/9] w-full rounded-3xl overflow-hidden border-2 border-border shadow-md bg-muted">
          <img
            src={post.thumbnail}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Main Content prose */}
        <main className="max-w-3xl mx-auto py-4 prose dark:prose-invert">
          {renderContent(post.content)}
        </main>

        {/* Footer Author Callout */}
        <footer className="max-w-3xl mx-auto border-t border-border/60 pt-8 mt-12">
          <div className="p-6 bg-card/45 border-2 border-border rounded-3xl flex flex-col md:flex-row items-center gap-6 shadow-[0_3px_0_var(--border)]">
            <div className="space-y-2 text-center md:text-left flex-1">
              <p className="text-xs text-primary font-black uppercase tracking-wider">About the Team</p>
              <h4 className="text-sm font-black text-foreground">{post.author.name}</h4>
              <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                The {post.author.name} is a group of passionate software developers, templates designers, and technical writers specializing in modern framework architectures, database scaling, prompt engineering, and SaaS growth frameworks.
              </p>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}
