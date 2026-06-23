import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { ProductCard } from "@/components/SearchFilter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ExternalLink, ShieldCheck, Globe, Star, FileText } from "lucide-react";
import { CyberBackground } from "@/components/ui/CyberBackground";

export const dynamic = "force-dynamic";

interface Directory {
  id: number;
  name: string;
  description: string;
  submission_link: string;
}

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function getDirectoryBySlug(slug: string): Promise<Directory | null> {
  try {
    const res = await fetch("https://raw.githubusercontent.com/theshubh77/awesome-saas-directories/master/launchdb.json", {
      next: { revalidate: 86400 }
    });
    const directories: Directory[] = await res.json();
    return directories.find(dir => slugify(dir.name) === slug) || null;
  } catch (err) {
    console.error("Error fetching directory details:", err);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const directory = await getDirectoryBySlug(slug);

  if (!directory) {
    return { title: "Directory Not Found | ScriptlyStore" };
  }

  return {
    title: `How to Submit to ${directory.name} - Startup Directory SEO Insights`,
    description: `Complete guide on submitting your software and SaaS products to ${directory.name}. ${directory.description}`,
    alternates: {
      canonical: `https://scriptly.store/directories/${slug}`,
    },
  };
}

export default async function DirectoryDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const directory = await getDirectoryBySlug(slug);

  if (!directory) {
    notFound();
  }

  // Fetch 3 related premium products to cross-link and boost internal SEO authority
  const relatedProducts = await db.query.products.findMany({
    where: (products, { eq, and }) => and(
      eq(products.published, true),
      eq(products.status, "approved")
    ),
    orderBy: [desc(products.rating), desc(products.createdAt)],
    limit: 3,
  });

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": `How to Submit to ${directory.name} - Startup Directory Insights`,
    "description": `Detailed submission guidelines and details for ${directory.name} SaaS directory.`,
    "publisher": {
      "@type": "Organization",
      "name": "ScriptlyStore",
      "logo": {
        "@type": "ImageObject",
        "url": "https://scriptly.store/favicon.svg"
      }
    },
    "mainEntity": {
      "@type": "Service",
      "name": directory.name,
      "description": directory.description,
      "url": directory.submission_link
    }
  };

  return (
    <div className="flex flex-col min-h-screen text-foreground relative bg-background">
      <CyberBackground />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <div className="container max-w-5xl mx-auto px-4 py-12 md:py-20 space-y-12 relative z-10 animate-in fade-in duration-300">
        
        {/* Breadcrumb Back Button */}
        <Button asChild variant="ghost" size="sm" className="-ml-3 text-muted-foreground hover:text-foreground">
          <Link href="/directories">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Directory Registry
          </Link>
        </Button>

        {/* Directory details block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Main Info */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <Badge variant="outline" className="rounded-full px-3 py-1 text-[10px] uppercase font-black tracking-[0.2em] border-[#1CB0F6]/20 text-[#1CB0F6] bg-[#1CB0F6]/5">
                 Launch Platform #{directory.id}
              </Badge>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground sm:leading-[1.1]">
                {directory.name}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed font-semibold">
                {directory.description}
              </p>
            </div>

            <div className="prose prose-neutral dark:prose-invert max-w-none text-sm text-muted-foreground leading-relaxed font-medium space-y-6">
              <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#1CB0F6]" /> Submission Instructions
              </h3>
              <p>
                To list your startup, SaaS boilerplate, or script on **{directory.name}**, follow these best practices:
              </p>
              <ul className="list-disc pl-5 space-y-3">
                <li>Prepare a clear, high-impact tagline and description explaining your product's unique value proposition.</li>
                <li>Make sure to include high-resolution screenshots and/or video demonstration links to increase review conversion rates.</li>
                <li>Select appropriate category tags (e.g. *developer tools*, *productivity*, *artificial intelligence*) that match your tech stack.</li>
                <li>Provide clean URLs to your product landing page, pricing page, or GitHub repository.</li>
              </ul>
              <p>
                Ready to submit? Use the verified direct submission URL:
              </p>
              <a 
                href={directory.submission_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-card border border-border text-xs font-black uppercase text-[#1CB0F6] hover:bg-muted/30 transition-all duration-200"
              >
                Go to submission form <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Sidebar Submission Box */}
          <div className="lg:col-span-5">
            <Card className="border-2 border-border bg-card/65 backdrop-blur-md shadow-[0_4px_0_var(--border)] dark:shadow-[0_4px_0_#2A3842] rounded-[2rem] p-6 space-y-6">
              <h3 className="text-xs font-black uppercase tracking-wider text-foreground border-b border-border/40 pb-3 flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" /> Directory Attributes
              </h3>
              <ul className="space-y-4 text-xs font-bold text-muted-foreground">
                <li className="flex justify-between items-center pb-2.5 border-b border-border/20">
                  <span>Backlink Value</span>
                  <span className="text-emerald-500 flex items-center gap-0.5"><Star className="w-3.5 h-3.5 fill-emerald-500" /> High Authority Do-Follow</span>
                </li>
                <li className="flex justify-between items-center pb-2.5 border-b border-border/20">
                  <span>Submission Type</span>
                  <span className="text-foreground">Startup & Tech Launchpad</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>Verification Type</span>
                  <span className="text-[#1CB0F6] flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> Checked & Verified</span>
                </li>
              </ul>

              <div className="pt-2">
                <Button asChild className="w-full h-11 rounded-xl font-bold uppercase tracking-widest text-[10px] bg-[#1CB0F6] hover:bg-[#1CB0F6]/90 text-white shadow-md cursor-pointer">
                  <a href={directory.submission_link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                     Direct Submit <ExternalLink className="w-3.5 h-3.5 ml-2" />
                  </a>
                </Button>
              </div>
            </Card>
          </div>

        </div>

        {/* Dynamic Related Products Cross-linking section */}
        {relatedProducts.length > 0 && (
          <div className="space-y-8 mt-20 pt-12 border-t border-border/40">
            <div className="flex items-center gap-4">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                Accelerate Launch with Pre-Built Code templates
              </h2>
              <div className="h-px flex-1 bg-border/20" />
            </div>
            
            <p className="text-xs font-semibold text-muted-foreground leading-relaxed max-w-2xl">
              Don't build from scratch. Launch your SaaS 10x faster onto directories like **{directory.name}** using our premium starter templates and verified scripts.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map((prod) => (
                <ProductCard key={prod.id} prod={prod} categoryName={prod.category} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
