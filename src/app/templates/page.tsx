import type { Metadata } from "next";
import { Suspense } from "react";
import { Tag } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TemplatesGallery from "@/components/TemplatesGallery";

export const metadata: Metadata = {
  title: "Templates Store | ScriptlyHQ Landing Pages",
  description: "Browse premium, high-converting landing page layouts. Buy the raw code or select the Customization package to launch in 4 days.",
  keywords: [
    "buy landing page template",
    "website templates for restaurants",
    "website templates for clinics",
    "SaaS landing page layouts"
  ]
};

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-indigo"></div>
    </div>
  );
}

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-gray-100 flex flex-col bg-grid-pattern relative">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 relative z-10">
        
        {/* Page Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-brand-indigo font-medium">
            <Tag className="h-3.5 w-3.5 text-brand-indigo" />
            <span>Landing Page Store</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Browse our landing page templates
          </h1>
          <p className="text-base sm:text-lg text-gray-400">
            Choose a responsive layout designed for high conversion. Buy the raw code or select the Customization package to let us edit and launch it for you.
          </p>
        </div>

        <Suspense fallback={<LoadingFallback />}>
          <TemplatesGallery />
        </Suspense>

      </main>

      <Footer />
    </div>
  );
}
