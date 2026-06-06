import type { Metadata } from "next";
import { Suspense } from "react";
import { Mail } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact & Quote Request | ScriptlyHQ",
  description: "Get in touch with ScriptlyHQ. Submit your business link or Instagram handle, request a custom build, or inquire about template customizations.",
  keywords: [
    "landing page designer cost",
    "ScriptlyHQ contact",
    "affordable landing page designer",
    "hire landing page agency"
  ]
};

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-indigo"></div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-gray-100 flex flex-col bg-grid-pattern relative">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 relative z-10">
        
        {/* Page Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-brand-emerald font-medium">
            <Mail className="h-3.5 w-3.5 text-brand-emerald" />
            <span>Consultation Request</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Contact & Quote Request
          </h1>
          <p className="text-base sm:text-lg text-gray-400">
            Tell us about your brand. Submit your Instagram profile or existing website links and let us design the optimal solution.
          </p>
        </div>

        <Suspense fallback={<LoadingFallback />}>
          <ContactForm />
        </Suspense>

      </main>

      <Footer />
    </div>
  );
}
