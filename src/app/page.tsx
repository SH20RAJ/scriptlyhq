import { Metadata } from "next";
import { getProductsAction, getCategoriesAction } from "@/lib/actions/products";
import { siteConfig } from "@/config/site";
import { BLOG_POSTS } from "@/lib/blog-data";

// Modular Homepage Components
import HeroSection from "@/components/home/HeroSection";
import TrustStrip from "@/components/home/TrustStrip";
import ProductDiscoverySection from "@/components/home/ProductDiscoverySection";
import IntentSection from "@/components/home/IntentSection";
import FeaturedCollections from "@/components/home/FeaturedCollections";
import QualitySection from "@/components/home/QualitySection";
import ProductExperienceSection from "@/components/home/ProductExperienceSection";
import CreatorSection from "@/components/home/CreatorSection";
import LearnSection from "@/components/home/LearnSection";
import FinalCTA from "@/components/home/FinalCTA";

export const metadata: Metadata = {
  title: `${siteConfig.name} — Production-Ready Code, Templates & Developer Tools`,
  description: "Discover production-ready SaaS templates, developer tools, landing pages, scripts, UI kits, automation assets, and more. Build faster with ScriptlyStore.",
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    title: `${siteConfig.name} — Production-Ready Code, Templates & Developer Tools`,
    description: "Discover production-ready SaaS templates, developer tools, landing pages, scripts, UI kits, automation assets, and more. Build faster with ScriptlyStore.",
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — Production-Ready Code, Templates & Developer Tools`,
    description: "Discover production-ready SaaS templates, developer tools, landing pages, scripts, UI kits, automation assets, and more. Build faster with ScriptlyStore.",
  },
};

export default async function Page() {
  // Parallel server-side data fetching
  const [featuredData, catalogData, freeData, categories] = await Promise.all([
    getProductsAction({
      featuredOnly: true,
      limit: 6,
      sortBy: "rating",
    }),
    getProductsAction({
      limit: 16,
      sortBy: "newest",
    }),
    getProductsAction({
      priceType: "free",
      limit: 6,
      sortBy: "rating",
    }),
    getCategoriesAction(),
  ]);

  // Ensure high quality fallback for hero display if catalog has few featured items
  const heroProducts = featuredData.products.length > 0
    ? featuredData.products
    : catalogData.products.slice(0, 3);

  const weekendProducts = freeData.products.length > 0
    ? freeData.products
    : catalogData.products.filter((p) => p.isFree || p.price === 0).slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Schema.org WebSite Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": siteConfig.name,
            "url": siteConfig.url,
            "description": siteConfig.description,
            "potentialAction": {
              "@type": "SearchAction",
              "target": `${siteConfig.url}/search?search={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />

      {/* 1. HERO SECTION */}
      <HeroSection featuredProducts={heroProducts} />

      {/* 2. TRUST STRIP / TECH STACK */}
      <TrustStrip />

      {/* 3. CORE PRODUCT DISCOVERY */}
      <ProductDiscoverySection
        products={catalogData.products}
        categories={categories}
      />

      {/* 4. INTENT-BASED DISCOVERY ("What are you building?") */}
      <IntentSection />

      {/* 5. CURATED COLLECTIONS */}
      <FeaturedCollections
        featuredProducts={heroProducts}
        freeProducts={weekendProducts}
      />

      {/* 6. PRODUCT QUALITY SYSTEM */}
      <QualitySection />

      {/* 7. PRODUCT EXPERIENCE WALKTHROUGH */}
      <ProductExperienceSection />

      {/* 8. CREATOR ACQUISITION & 5-STEP WORKFLOW */}
      <CreatorSection />

      {/* 9. EDITORIAL / LEARN */}
      <LearnSection posts={BLOG_POSTS} />

      {/* 10. FINAL RESTRAINED SPLIT CTA */}
      <FinalCTA />
    </div>
  );
}
