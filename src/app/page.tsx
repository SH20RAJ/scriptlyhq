import { Metadata } from "next";
import ClientHome from "@/components/ClientHome";

export const metadata: Metadata = {
  title: "ScriptlyStore - Premium Digital Products, Templates & Developer Scripts",
  description: "Ship 10x faster with ready-to-use SaaS templates, automation scripts, browser extensions, AI prompts, and digital tools. Sell your code & keep 95% of sales!",
  alternates: {
    canonical: "https://scriptly.store",
  },
};

interface PageProps {
  searchParams: Promise<{
    category?: string;
    subcategory?: string;
    search?: string;
    priceType?: "all" | "free" | "paid";
    sortBy?: "newest" | "rating" | "price_asc" | "price_desc";
    page?: string;
  }>;
}

export default function Page({ searchParams }: PageProps) {
  return (
    <>
      {/* WebSite JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "ScriptlyStore",
            "url": "https://scriptly.store",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://scriptly.store/search?search={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />
      {/* Organization JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "ScriptlyStore",
            "url": "https://scriptly.store",
            "logo": "https://scriptly.store/logo.png",
            "sameAs": [
              "https://github.com/SH20RAJ",
              "https://x.com/sh20raj"
            ]
          })
        }}
      />
      {/* BreadcrumbList JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://scriptly.store/"
              }
            ]
          })
        }}
      />
      <ClientHome searchParams={searchParams} />
    </>
  );
}
