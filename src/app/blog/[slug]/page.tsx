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

  // Parse custom markdown layout simply and correctly line-by-line
  const renderContent = (markdown: string) => {
    const lines = markdown.split("\n");
    const elements: React.ReactNode[] = [];
    
    let i = 0;
    
    while (i < lines.length) {
      const line = lines[i];
      const trimmed = line.trim();
      
      // 1. Handle Code Blocks
      if (trimmed.startsWith("```")) {
        const lang = trimmed.slice(3).trim();
        const codeLines: string[] = [];
        i++;
        while (i < lines.length && !lines[i].trim().startsWith("```")) {
          codeLines.push(lines[i]);
          i++;
        }
        // skip the closing ```
        i++;
        elements.push(
          <pre key={`code-${i}`} className="my-6 p-5 bg-card border-2 border-border rounded-2xl overflow-x-auto font-mono text-xs text-foreground shadow-sm">
            <code className={lang ? `language-${lang}` : ""}>{codeLines.join("\n")}</code>
          </pre>
        );
        continue;
      }
      
      // 2. Handle Tables
      if (trimmed.startsWith("|")) {
        const tableLines: string[] = [];
        while (i < lines.length && lines[i].trim().startsWith("|")) {
          tableLines.push(lines[i].trim());
          i++;
        }
        
        const rows = tableLines.map(row => {
          const cells = row.split("|").map(c => c.trim());
          if (cells[0] === "") cells.shift();
          if (cells[cells.length - 1] === "") cells.pop();
          return cells;
        });
        
        const filteredRows = rows.filter(row => {
          return !row.every(cell => /^:?-+:?$/.test(cell));
        });
        
        if (filteredRows.length > 0) {
          const headers = filteredRows[0];
          const bodyRows = filteredRows.slice(1);
          
          elements.push(
            <div key={`table-${i}`} className="my-6 overflow-x-auto rounded-xl border-2 border-border shadow-sm">
              <table className="min-w-full divide-y-2 divide-border text-sm">
                <thead className="bg-card">
                  <tr>
                    {headers.map((h, idx) => (
                      <th key={idx} className="px-4 py-3 text-left font-black text-xs text-foreground uppercase tracking-wider border-r border-border last:border-r-0" dangerouslySetInnerHTML={{ __html: parseInlineStyles(h) }} />
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-background/50">
                  {bodyRows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-card/20 transition-colors">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="px-4 py-3 text-muted-foreground font-medium border-r border-border last:border-r-0" dangerouslySetInnerHTML={{ __html: parseInlineStyles(cell) }} />
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        continue;
      }
      
      // 3. Handle Blockquotes
      if (trimmed.startsWith(">")) {
        const bqLines: string[] = [];
        while (i < lines.length && lines[i].trim().startsWith(">")) {
          let bqLine = lines[i].trim().slice(1);
          if (bqLine.startsWith(" ")) bqLine = bqLine.slice(1);
          bqLines.push(bqLine);
          i++;
        }
        
        elements.push(
          <div key={`bq-${i}`} className="my-6 pl-4 border-l-4 border-primary bg-primary/5 py-3 pr-4 rounded-r-xl text-muted-foreground italic font-medium leading-relaxed" dangerouslySetInnerHTML={{ __html: parseInlineStyles(bqLines.join(" ")) }} />
        );
        continue;
      }
      
      // 4. Handle Lists (unordered & ordered)
      const ulMatch = trimmed.match(/^[-*]\s+(.*)/);
      const olMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
      
      if (ulMatch) {
        const listItems: string[] = [];
        while (i < lines.length) {
          const currentTrimmed = lines[i].trim();
          const match = currentTrimmed.match(/^[-*]\s+(.*)/);
          if (match) {
            listItems.push(match[1]);
            i++;
          } else {
            break;
          }
        }
        elements.push(
          <ul key={`ul-${i}`} className="list-disc pl-6 my-4 space-y-2 text-sm md:text-base text-muted-foreground font-medium leading-relaxed">
            {listItems.map((item, idx) => (
              <li key={idx} dangerouslySetInnerHTML={{ __html: parseInlineStyles(item) }} />
            ))}
          </ul>
        );
        continue;
      }
      
      if (olMatch) {
        const listItems: string[] = [];
        while (i < lines.length) {
          const currentTrimmed = lines[i].trim();
          const match = currentTrimmed.match(/^(\d+)\.\s+(.*)/);
          if (match) {
            listItems.push(match[2]);
            i++;
          } else {
            break;
          }
        }
        elements.push(
          <ol key={`ol-${i}`} className="list-decimal pl-6 my-4 space-y-2 text-sm md:text-base text-muted-foreground font-medium leading-relaxed">
            {listItems.map((item, idx) => (
              <li key={idx} dangerouslySetInnerHTML={{ __html: parseInlineStyles(item) }} />
            ))}
          </ol>
        );
        continue;
      }
      
      // 5. Handle Horizontal Rules
      if (trimmed === "---") {
        elements.push(<hr key={`hr-${i}`} className="my-8 border-t-2 border-border/60" />);
        i++;
        continue;
      }
      
      // 6. Handle Headings
      if (trimmed.startsWith("#### ")) {
        elements.push(
          <h4 key={`h4-${i}`} className="text-base font-black text-foreground mt-4 mb-2 tracking-tight">
            {trimmed.replace("#### ", "")}
          </h4>
        );
        i++;
        continue;
      }
      if (trimmed.startsWith("### ")) {
        elements.push(
          <h3 key={`h3-${i}`} className="text-lg font-black text-foreground mt-6 mb-3 tracking-tight">
            {trimmed.replace("### ", "")}
          </h3>
        );
        i++;
        continue;
      }
      if (trimmed.startsWith("## ")) {
        elements.push(
          <h2 key={`h2-${i}`} className="text-xl md:text-2xl font-black text-foreground mt-8 mb-4 tracking-tight leading-tight">
            {trimmed.replace("## ", "")}
          </h2>
        );
        i++;
        continue;
      }
      
      // 7. Empty lines
      if (!trimmed) {
        i++;
        continue;
      }
      
      // 8. Normal Paragraph
      elements.push(
        <p 
          key={`p-${i}`} 
          className="my-4 text-sm md:text-base text-muted-foreground font-medium leading-relaxed"
          dangerouslySetInnerHTML={{ __html: parseInlineStyles(trimmed) }}
        />
      );
      i++;
    }
    
    return elements;
  };

  // Helper to parse links and bold inline styles
  const parseInlineStyles = (text: string) => {
    let html = text;
    // Unescape common characters
    html = html.replace(/\\`/g, "`");
    html = html.replace(/\\\*/g, "*");
    html = html.replace(/\\_/g, "_");
    
    // Bold: **text** -> <strong>text</strong>
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold text-foreground">$1</strong>');
    
    // Code blocks: `code` -> <code class="bg-muted px-1.5 py-0.5 rounded font-mono text-xs text-foreground">code</code>
    html = html.replace(/`(.*?)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded font-mono text-[11px] text-foreground border border-border/60">$1</code>');
    
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
