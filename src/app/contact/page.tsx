"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Mail, MessageSquare, Send, Instagram, ArrowUpRight, CheckCircle2, ShieldAlert } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-indigo"></div>
    </div>
  );
}

function ContactFormContent() {
  const searchParams = useSearchParams();

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    socialLink: "",
    service: "customization",
    budget: "5k-15k",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Parse URL Parameters for pre-filling
  useEffect(() => {
    const templateParam = searchParams.get("template");
    const planParam = searchParams.get("plan");
    const serviceParam = searchParams.get("service");
    const styleParam = searchParams.get("style");
    const actionParam = searchParams.get("action");

    let messagePrefill = "";
    let selectedService = formData.service;
    let selectedBudget = formData.budget;

    if (templateParam) {
      if (actionParam === "buy") {
        selectedService = "ready-made";
        selectedBudget = "under-5k";
        messagePrefill = `Hi! I want to buy the raw code for the template: "${templateParam}". Please send the download link.`;
      } else {
        selectedService = "customization";
        messagePrefill = `Hi! I love the template "${templateParam}" and would like to customize it for my business.`;
      }
    } else if (planParam) {
      if (planParam === "template-only") {
        selectedService = "ready-made";
        selectedBudget = "under-5k";
      } else if (planParam === "customization") {
        selectedService = "customization";
        selectedBudget = "5k-15k";
      } else if (planParam === "custom-build") {
        selectedService = "scratch";
        selectedBudget = "15k-30k";
      } else if (planParam === "monthly-support") {
        selectedService = "support";
        selectedBudget = "under-5k";
      }
      messagePrefill = `Hi! I'm interested in the "${planParam}" pricing package.`;
    } else if (serviceParam) {
      if (serviceParam === "buy-template" || serviceParam === "ready-made") {
        selectedService = "ready-made";
      } else if (serviceParam === "customize-template" || serviceParam === "customization") {
        selectedService = "customization";
      } else if (serviceParam === "build-from-scratch" || serviceParam === "scratch") {
        selectedService = "scratch";
        selectedBudget = "15k-30k";
      }
      messagePrefill = `Hi! I want to discuss details for the service: "${serviceParam}".`;
    } else if (styleParam) {
      selectedService = "scratch";
      selectedBudget = "15k-30k";
      messagePrefill = `Hi! I want to build a landing page inspired by the "${styleParam}" design style.`;
    }

    setFormData((prev) => ({
      ...prev,
      service: selectedService,
      budget: selectedBudget,
      message: messagePrefill,
    }));
  }, [searchParams]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.businessName) {
      setErrorMessage("Please fill out your Name and Business Name.");
      return;
    }
    
    // Simple demonstration success
    setErrorMessage("");
    setIsSubmitted(true);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
      {/* Left Column: Direct info & Instagram Callout */}
      <div className="lg:col-span-5 space-y-8">
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Let&apos;s talk about your landing page
          </h2>
          <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
            Fill out this quick enquiry form with your requirements. We typically reply within 2 to 4 hours with recommendations and quotes.
          </p>
        </div>

        {/* Visual Instagram Highlight Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-900/10 via-indigo-950/15 to-black border border-white/10 space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-24 h-24 rounded-full bg-brand-violet/20 blur-xl" />
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-500 flex items-center justify-center text-white">
              <Instagram className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Suggest my Style</h4>
              <p className="text-xs text-gray-500">Instagram Direct Message</p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            Send us your current Instagram profile link or raw business idea. We will study your target industry and recommend the best high-converting landing page style for you.
          </p>
          <a
            href="https://www.instagram.com/scriptlyhq/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/5 hover:border-white/10 transition-colors"
          >
            Send IG Handle on Instagram
            <ArrowUpRight className="ml-1 h-3.5 w-3.5 text-gray-400" />
          </a>
        </div>

        {/* Core details */}
        <div className="space-y-4 text-sm text-gray-400">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-brand-emerald shrink-0" />
            <span>scriptlyhq.strivio.world</span>
          </div>
          <div className="flex items-center gap-3">
            <MessageSquare className="h-5 w-5 text-brand-indigo shrink-0" />
            <span>Direct support via WhatsApp available on customization</span>
          </div>
        </div>
      </div>

      {/* Right Column: Contact Form */}
      <div className="lg:col-span-7">
        <div className="glassmorphic p-8 rounded-3xl relative">
          {isSubmitted ? (
            <div className="text-center py-12 space-y-6">
              <div className="mx-auto h-16 w-16 rounded-full bg-brand-emerald/10 border border-brand-emerald/20 flex items-center justify-center text-brand-emerald">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-white">Enquiry Received!</h3>
              <p className="text-sm text-gray-400 max-w-sm mx-auto leading-relaxed">
                Thank you for reaching out, <span className="text-white font-medium">{formData.name}</span>. We will review your business requirements for <span className="text-white font-medium">{formData.businessName}</span> and contact you shortly.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="inline-flex items-center justify-center text-xs font-semibold text-brand-indigo hover:underline"
              >
                Submit another enquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-xs text-red-400">
                  <ShieldAlert className="h-5 w-5 text-red-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Name & Business */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 bg-gray-950 border border-white/10 rounded-xl text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-brand-indigo transition-colors"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="businessName" className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                    Business Name
                  </label>
                  <input
                    type="text"
                    id="businessName"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    placeholder="e.g. Nexus Corp"
                    className="w-full px-4 py-3 bg-gray-950 border border-white/10 rounded-xl text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-brand-indigo transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Instagram handle or web link */}
              <div className="space-y-2">
                <label htmlFor="socialLink" className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                  Instagram / Business Link
                </label>
                <input
                  type="text"
                  id="socialLink"
                  name="socialLink"
                  value={formData.socialLink}
                  onChange={handleInputChange}
                  placeholder="e.g. instagram.com/brandname or yoursite.com"
                  className="w-full px-4 py-3 bg-gray-950 border border-white/10 rounded-xl text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-brand-indigo transition-colors"
                />
                <span className="text-[10px] text-gray-500 block">
                  We use this link to suggest colors and design alignments.
                </span>
              </div>

              {/* Service & Budget Select */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="service" className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                    Service Needed
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-950 border border-white/10 rounded-xl text-sm text-gray-300 focus:outline-none focus:border-brand-indigo appearance-none"
                  >
                    <option value="ready-made">Buy Ready-Made Template</option>
                    <option value="customization">Template Customization</option>
                    <option value="scratch">Build From Scratch</option>
                    <option value="support">Monthly Support Contract</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="budget" className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                    Budget Tier
                  </label>
                  <select
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-950 border border-white/10 rounded-xl text-sm text-gray-300 focus:outline-none focus:border-brand-indigo appearance-none"
                  >
                    <option value="under-5k">Under ₹5,000</option>
                    <option value="5k-15k">₹5,000 – ₹15,000</option>
                    <option value="15k-30k">₹15,000 – ₹30,000</option>
                    <option value="30k-plus">₹30,000+</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label htmlFor="message" className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                  Project Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Briefly describe what changes you want or your business idea..."
                  className="w-full px-4 py-3 bg-gray-950 border border-white/10 rounded-xl text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-brand-indigo transition-colors resize-y"
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center px-6 py-4 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-brand-indigo to-brand-violet hover:opacity-95 transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                Send Quote Request
                <Send className="ml-2 h-4 w-4" />
              </button>
            </form>
          )}
        </div>
      </div>
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
          <ContactFormContent />
        </Suspense>

      </main>

      <Footer />
    </div>
  );
}
