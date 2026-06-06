"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Filter, SlidersHorizontal, ArrowRight, Star, Tag, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { TEMPLATES, Template } from "@/data";

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-indigo"></div>
    </div>
  );
}

function TemplatesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialCat = searchParams.get("cat") || "All";
  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [searchQuery, setSearchQuery] = useState("");

  // Sync category state with URL if it changes
  useEffect(() => {
    const cat = searchParams.get("cat");
    if (cat) {
      setSelectedCategory(cat);
    } else {
      setSelectedCategory("All");
    }
  }, [searchParams]);

  const categories = [
    "All",
    "SaaS",
    "Restaurant",
    "Clinic",
    "Salon",
    "Coach",
    "Event",
    "Portfolio",
    "Local Business"
  ];

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    const params = new URLSearchParams(searchParams.toString());
    if (category === "All") {
      params.delete("cat");
    } else {
      params.set("cat", category);
    }
    router.push(`/templates?${params.toString()}`);
  };

  const filteredTemplates = TEMPLATES.filter((template) => {
    // Category check
    let matchesCategory = true;
    if (selectedCategory !== "All") {
      if (selectedCategory === "Restaurant") {
        matchesCategory = template.category === "Restaurant" || template.category === "Café";
      } else if (selectedCategory === "Clinic") {
        matchesCategory = template.category === "Clinic" || template.category === "Dentist";
      } else if (selectedCategory === "Local Business") {
        matchesCategory = ["Restaurant", "Café", "Clinic", "Dentist", "Salon"].includes(template.category);
      } else {
        matchesCategory = template.category.toLowerCase() === selectedCategory.toLowerCase();
      }
    }

    // Search query check
    const matchesSearch = 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.bestFor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-12">
      {/* Search and Filter Panel */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gray-900/30 border border-white/5 flex flex-col md:flex-row items-center gap-4">
        {/* Search Input */}
        <div className="relative w-full md:flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search templates by industry, feature, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-gray-950 border border-white/10 rounded-2xl text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-brand-indigo transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Desktop Categories Scroll */}
        <div className="hidden lg:flex items-center gap-2 overflow-x-auto py-1 max-w-2xl">
          <Filter className="h-4 w-4 text-gray-400 mr-2 shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-white text-gray-950 shadow"
                  : "bg-white/5 text-gray-400 hover:text-white border border-white/5 hover:border-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Mobile / Tablet Category Select Dropdown */}
        <div className="w-full md:w-48 lg:hidden relative">
          <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <select
            value={selectedCategory}
            onChange={(e) => handleCategorySelect(e.target.value)}
            className="w-full pl-10 pr-4 py-3.5 bg-gray-950 border border-white/10 rounded-2xl text-sm text-gray-300 focus:outline-none focus:border-brand-indigo appearance-none"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat} Industry
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="group rounded-2xl border border-white/5 bg-gray-900/40 overflow-hidden flex flex-col justify-between glassmorphic-hover"
            >
              {/* Image Box */}
              <div className="relative aspect-[4/3] bg-gray-950 border-b border-white/5 overflow-hidden">
                <Image
                  src={template.previewImage}
                  alt={template.name}
                  fill
                  className="object-cover object-top group-hover:scale-[1.03] transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-gray-950/80 backdrop-blur-md text-gray-300 text-xs px-3 py-1 rounded-full border border-white/10">
                  {template.category}
                </span>
                <span className={`absolute top-4 right-4 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                  template.type === 'Premium' 
                    ? 'bg-brand-violet/20 text-brand-violet border border-brand-violet/30'
                    : 'bg-brand-indigo/20 text-brand-indigo border border-brand-indigo/30'
                }`}>
                  {template.type}
                </span>
              </div>

              {/* Info Body */}
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-white group-hover:text-brand-indigo transition-colors">
                      {template.name}
                    </h3>
                    <span className="text-lg font-extrabold text-brand-emerald">
                      {template.price}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-2 italic">
                    Best for: {template.bestFor}
                  </p>
                  <p className="text-sm text-gray-400 line-clamp-3 mb-6">
                    {template.description}
                  </p>
                </div>

                {/* Actions */}
                <div className="space-y-2.5 pt-4 border-t border-white/5">
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={`/templates/${template.id}`}
                      className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-semibold text-gray-300 bg-white/5 hover:bg-white/10 border border-white/5 transition-colors"
                    >
                      View Details
                    </Link>
                    <Link
                      href={`/contact?template=${template.id}&action=buy`}
                      className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-semibold text-gray-950 bg-white hover:bg-white/95 transition-colors"
                    >
                      Buy Now
                    </Link>
                  </div>
                  <Link
                    href={`/contact?template=${template.id}&action=customize`}
                    className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-brand-indigo to-brand-violet hover:opacity-90 transition-colors"
                  >
                    Customize this template
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-white/5 rounded-3xl bg-gray-900/10">
          <p className="text-gray-400 mb-4">No templates matching your filter criteria.</p>
          <button
            onClick={() => {
              setSelectedCategory("All");
              setSearchQuery("");
              router.push("/templates");
            }}
            className="text-xs font-semibold text-brand-emerald hover:underline"
          >
            Reset all filters
          </button>
        </div>
      )}
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
          <TemplatesContent />
        </Suspense>

      </main>

      <Footer />
    </div>
  );
}
