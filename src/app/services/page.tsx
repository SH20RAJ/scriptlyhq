"use client";

import Link from "next/link";
import { 
  ArrowRight, 
  CheckCircle2, 
  MessageSquare, 
  Zap, 
  Sliders, 
  Layers, 
  Globe, 
  Search, 
  Settings, 
  ShieldCheck,
  Smartphone
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ServicesPage() {
  const mainServices = [
    {
      id: "ready-made",
      title: "Ready-Made Templates",
      tagline: "For quick launches",
      startingPrice: "₹999+",
      description: "Buy any of our pre-built, premium landing pages and get the source files instantly. Ideal for founders or developers who want to handle editing, deployment, and domain mapping themselves.",
      features: [
        "100% clean Next.js/HTML codebase",
        "Responsive, mobile-first layouts",
        "Configured stylesheet & layout setups",
        "Self-deployment guide included"
      ],
      icon: Layers,
      color: "brand-indigo"
    },
    {
      id: "customization",
      title: "Template Customization",
      tagline: "Our most popular service",
      startingPrice: "₹2,999+",
      description: "Choose any template in our store, send us your assets (copy, logo, brand guidelines), and we will execute the edits. We set up domains, WhatsApp hooks, contact forms, and launch the site for you.",
      features: [
        "Brand colors, logos, & copy replacement",
        "WhatsApp call-to-actions & maps integration",
        "Contact email forms set up",
        "Full domain pointing & hosting launch support"
      ],
      icon: Sliders,
      color: "brand-violet"
    },
    {
      id: "scratch",
      title: "Build From Scratch",
      tagline: "For serious brands",
      startingPrice: "₹14,999+",
      description: "Get a bespoke, completely custom landing page mapped out for your specific product launch or clinic. We write conversion copy outline, build custom assets, and execute tailored development from zero.",
      features: [
        "100% custom mockup designs",
        "Conversion copywriting alignment",
        "Custom APIs & booking tools linked",
        "Premium custom load animations"
      ],
      icon: Zap,
      color: "brand-emerald"
    }
  ];

  const ancillaryServices = [
    {
      title: "Website Setup & Deployment",
      description: "We configure DNS records, SSL security certificates, custom domain names, and set up continuous deployment pipelines on fast global CDNs.",
      icon: Globe
    },
    {
      title: "SEO & Speed Optimization",
      description: "Configure meta titles, meta descriptions, alt attributes, and social graph cards. We optimize asset sizes to achieve a near 100/100 Google PageSpeed score.",
      icon: Search
    },
    {
      title: "Monthly Support & Maintenance",
      description: "Change text, upload new team profiles, add seasonal offers, build secondary pages, and keep code frameworks secure for a flat monthly retainer.",
      icon: Settings
    }
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-gray-100 flex flex-col bg-grid-pattern relative">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 relative z-10">
        
        {/* Page Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-brand-emerald font-medium">
            <ShieldCheck className="h-3.5 w-3.5 text-brand-emerald" />
            <span>Core Agency Capabilities</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Our Services & Capabilities
          </h1>
          <p className="text-base sm:text-lg text-gray-400">
            ScriptlyHQ is a combination of a landing page store and a dedicated customization studio. Choose the level of involvement you need to launch.
          </p>
        </div>

        {/* Main Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
          {mainServices.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                id={service.id}
                className="glassmorphic p-8 rounded-3xl flex flex-col justify-between hover:border-white/10 transition-all shadow-xl relative"
              >
                <div>
                  <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mb-6">
                    <Icon className="h-6 w-6 text-brand-indigo" />
                  </div>
                  <span className="text-xs font-semibold text-brand-emerald uppercase tracking-wider block mb-1">
                    {service.tagline}
                  </span>
                  <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
                  <div className="mb-4">
                    <span className="text-2xl font-black text-white">{service.startingPrice}</span>
                    <span className="text-xs text-gray-500"> starting price</span>
                  </div>
                  <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-start text-xs sm:text-sm text-gray-300">
                        <CheckCircle2 className="h-4 w-4 text-brand-indigo mr-2 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  href={`/contact?service=${service.id}`}
                  className="w-full inline-flex items-center justify-center px-4 py-3 rounded-xl text-sm font-semibold text-gray-950 bg-white hover:bg-white/95 transition-all hover:scale-[1.01] active:scale-[0.99] text-center"
                >
                  Request Quote
                </Link>
              </div>
            );
          })}
        </div>

        {/* Visual Callout */}
        <div className="mb-24 p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-gray-900 via-gray-950 to-black border border-white/5 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-brand-violet/5 blur-3xl pointer-events-none" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                How our Customization service works
              </h2>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed max-w-2xl">
                We take care of all the technical heavy-lifting. You select a design style, pay a flat customization fee, send us your text outline, logo, and links in a WhatsApp chat or email, and we launch the live website in 2 to 4 days.
              </p>
              <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono text-gray-400">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-brand-emerald" /> Brand Matching colors</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-brand-emerald" /> Custom domain mapping</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-brand-emerald" /> SSL Certificate setup</span>
              </div>
            </div>
            <div className="lg:col-span-4 flex justify-start lg:justify-end shrink-0">
              <Link
                href="/contact?service=customization"
                className="inline-flex items-center justify-center px-6 py-4 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-brand-indigo to-brand-violet hover:opacity-95 transition-all hover:scale-[1.02]"
              >
                Start Customization
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Ancillary Services Section */}
        <div className="space-y-12">
          <h2 className="text-2xl font-extrabold text-white text-center">
            Additional Launch Essentials Included
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ancillaryServices.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-gray-900/20 border border-white/5 hover:border-white/10 transition-colors"
                >
                  <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center mb-4">
                    <Icon className="h-5 w-5 text-brand-emerald" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
