import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { INSPIRATION_STYLES } from "@/data";

export const metadata: Metadata = {
  title: "Design Inspiration Gallery | ScriptlyHQ",
  description: "Browse curated visual directions and landing page layout themes. Choose minimal SaaS, premium restaurant, clinic trust, and salon beauty styles.",
  keywords: [
    "landing page inspiration India",
    "minimalist landing page layout",
    "modern web design themes",
    "premium CSS templates"
  ]
};

export default function InspirationPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-gray-100 flex flex-col bg-grid-pattern relative">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 relative z-10">
        
        {/* Page Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-brand-emerald font-medium">
            <Sparkles className="h-3.5 w-3.5 text-brand-emerald" />
            <span>Design Studio Showcase</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Design Inspiration Styles
          </h1>
          <p className="text-base sm:text-lg text-gray-400">
            Browse through various design movements and layout styles. We can reconstruct, adapt, and deploy any of these visual styles for your custom landing page or template customization.
          </p>
        </div>

        {/* Disclaimer / Credits Notice */}
        <div className="mb-12 p-5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-4">
          <AlertCircle className="h-5 w-5 text-brand-indigo shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-gray-400 space-y-1">
            <p className="font-semibold text-white">Visual Style Replication License</p>
            <p>
              We do not directly hotlink or reproduce copyrighted creative works commercially. The visual cards below represent original layout mockups created internally, inspired by top modern landing page designs. If you want us to match a specific external live site, we can build custom designs from scratch.
            </p>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {INSPIRATION_STYLES.map((style) => (
            <div
              key={style.id}
              className="group glassmorphic rounded-2xl overflow-hidden hover:border-white/15 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Image Preview */}
              <div className="relative aspect-[4/3] bg-gray-950 border-b border-white/5 overflow-hidden">
                <Image
                  src={style.previewImage}
                  alt={style.name}
                  fill
                  className="object-cover object-top opacity-80 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-500"
                />
                <div className="absolute bottom-4 left-4 bg-gray-900/90 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs text-gray-300">
                  {style.category} Direction
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    {style.name}
                  </h3>
                  <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                    {style.description}
                  </p>
                </div>
                
                {/* Actions */}
                <div className="space-y-2 pt-4 border-t border-white/5">
                  <Link
                    href={`/contact?style=${style.id}`}
                    className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-950 bg-white hover:bg-white/95 transition-all hover:scale-[1.01] active:scale-[0.99]"
                  >
                    Use this style for my page
                  </Link>
                  <Link
                    href="/contact"
                    className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-400 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                  >
                    Ask for custom inspiration style
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </main>

      <Footer />
    </div>
  );
}
