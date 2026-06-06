"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowRight, 
  CheckCircle2, 
  MessageCircle, 
  Zap, 
  Sliders, 
  Globe, 
  HelpCircle, 
  Star, 
  Plus, 
  Minus,
  Instagram,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Layers,
  Heart
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { TEMPLATES, INSPIRATION_STYLES, SERVICES, PRICING_PLANS, FAQS, CATEGORIES } from "@/data";

export default function Home() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const featuredTemplates = TEMPLATES.slice(0, 6);

  return (
    <div className="min-h-screen bg-[#030712] text-gray-100 flex flex-col bg-grid-pattern relative">
      <Navbar />

      {/* Hero Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] rounded-full bg-brand-indigo/15 blur-[120px] animate-pulse" />
        <div className="absolute top-[10%] right-[20%] w-[400px] h-[400px] rounded-full bg-brand-violet/10 blur-[100px]" />
      </div>

      <main className="flex-grow relative z-10">
        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 md:pt-20 md:pb-28 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Tag / Trust points */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs sm:text-sm text-brand-emerald font-medium">
              <Zap className="h-4 w-4 text-brand-emerald" />
              <span>Ready-made templates</span>
              <span className="text-white/20">•</span>
              <span>Custom edits available</span>
              <span className="text-white/20">•</span>
              <span>Launch support included</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              Landing pages you can <br className="hidden sm:inline" />
              <span className="text-gradient">buy, customize, and launch fast</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Browse ready-made landing pages, choose a style you love, and let ScriptlyHQ customize it for your business. Need something unique? We’ll build it from scratch.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/templates"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-brand-indigo to-brand-violet hover:from-brand-indigo/90 hover:to-brand-violet/90 transition-all hover:scale-[1.02] shadow-xl shadow-brand-indigo/20 active:scale-[0.98]"
              >
                Browse Templates
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/contact?service=custom-build"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-semibold text-gray-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Get Custom Landing Page
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-8 flex flex-wrap justify-center items-center gap-x-8 gap-y-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-brand-emerald" /> 1-on-1 WhatsApp Support</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-brand-emerald" /> Cloudflare Speed Hosting</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-brand-emerald" /> SEO Configured Out of Box</span>
            </div>
          </div>

          {/* Hero Mockup Image */}
          <div className="mt-16 max-w-5xl mx-auto rounded-2xl border border-white/10 p-2 bg-gray-900/50 backdrop-blur-sm shadow-2xl relative">
            <div className="absolute top-0 inset-x-0 h-8 rounded-t-2xl bg-gray-950/80 border-b border-white/5 flex items-center px-4 gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              <div className="mx-auto w-32 sm:w-64 h-4 rounded bg-white/5 border border-white/5 text-[9px] text-gray-500 flex items-center justify-center font-mono">
                scriptlyhq.strivio.world
              </div>
            </div>
            <div className="mt-8 rounded-xl overflow-hidden bg-gray-950 aspect-[16/9] relative">
              <Image 
                src="/images/bento_saas_preview.png"
                alt="Sleek SaaS Landing Page Preview"
                fill
                className="object-cover object-top hover:scale-[1.01] transition-transform duration-700"
                priority
              />
            </div>
          </div>
        </section>

        {/* CHOOSE YOUR PATH SECTION */}
        <section className="bg-gradient-to-b from-transparent to-[#040816] py-20 border-t border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                Choose your path
              </h2>
              <p className="mt-4 text-gray-400 max-w-xl mx-auto">
                No matter where you are in your business launch, we have a fast solution ready.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              
              {/* Path 1 */}
              <div className="glassmorphic p-6 rounded-2xl flex flex-col justify-between hover:border-brand-indigo/30 transition-colors">
                <div>
                  <div className="text-xs font-semibold text-brand-indigo uppercase tracking-wider mb-2">Step 1</div>
                  <h3 className="text-lg font-bold text-white mb-2">Buy a Landing Page</h3>
                  <p className="text-sm text-gray-400 mb-6">
                    Browse and purchase beautiful, responsive landing page templates you can download instantly.
                  </p>
                </div>
                <Link
                  href="/templates"
                  className="w-full inline-flex items-center justify-center py-2.5 rounded-xl text-xs font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                >
                  Browse Templates
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Path 2 */}
              <div className="glassmorphic p-6 rounded-2xl flex flex-col justify-between hover:border-brand-violet/30 transition-colors">
                <div>
                  <div className="text-xs font-semibold text-brand-violet uppercase tracking-wider mb-2">Step 2</div>
                  <h3 className="text-lg font-bold text-white mb-2">Customize a Template</h3>
                  <p className="text-sm text-gray-400 mb-6">
                    Pick a template style you love and let our agency replace text, add logo, connect domains, and launch.
                  </p>
                </div>
                <Link
                  href="/services#customization"
                  className="w-full inline-flex items-center justify-center py-2.5 rounded-xl text-xs font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                >
                  Customize Template
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Path 3 */}
              <div className="glassmorphic p-6 rounded-2xl flex flex-col justify-between hover:border-brand-emerald/30 transition-colors">
                <div>
                  <div className="text-xs font-semibold text-brand-emerald uppercase tracking-wider mb-2">Step 3</div>
                  <h3 className="text-lg font-bold text-white mb-2">Build from Scratch</h3>
                  <p className="text-sm text-gray-400 mb-6">
                    Work with us to design and develop a completely bespoke, high-converting landing page from zero.
                  </p>
                </div>
                <Link
                  href="/contact?service=custom-build"
                  className="w-full inline-flex items-center justify-center py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-brand-indigo to-brand-violet hover:opacity-90 transition-colors"
                >
                  Build from Scratch
                </Link>
              </div>

              {/* Path 4 */}
              <div className="glassmorphic p-6 rounded-2xl flex flex-col justify-between hover:border-brand-emerald/30 transition-colors">
                <div>
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Step 4</div>
                  <h3 className="text-lg font-bold text-white mb-2">Need regular updates?</h3>
                  <p className="text-sm text-gray-400 mb-6">
                    Sign up for monthly design iterations, updates, analytics tuning, and continuous support.
                  </p>
                </div>
                <Link
                  href="/pricing#support"
                  className="w-full inline-flex items-center justify-center py-2.5 rounded-xl text-xs font-semibold text-gray-400 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                >
                  Monthly Support
                </Link>
              </div>

            </div>
          </div>
        </section>

        {/* FEATURED TEMPLATES SECTION */}
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                Featured Ready-Made Templates
              </h2>
              <p className="mt-3 text-gray-400 max-w-xl">
                Ready-to-use landing pages handcrafted for performance. Tap to preview structure, buy raw code, or order complete brand customizations.
              </p>
            </div>
            <Link
              href="/templates"
              className="inline-flex items-center text-sm font-semibold text-brand-emerald hover:text-brand-emerald/80 transition-colors shrink-0 group"
            >
              See all templates
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredTemplates.map((template) => (
              <div
                key={template.id}
                className="group rounded-2xl border border-white/5 bg-gray-900/40 overflow-hidden flex flex-col justify-between glassmorphic-hover relative"
              >
                {/* Image Wrap */}
                <div className="relative aspect-[4/3] bg-gray-950 border-b border-white/5 overflow-hidden">
                  <Image
                    src={template.previewImage}
                    alt={template.name}
                    fill
                    className="object-cover object-top group-hover:scale-[1.03] transition-transform duration-500"
                  />
                  {/* Category badge */}
                  <span className="absolute top-4 left-4 bg-gray-950/80 backdrop-blur-md text-gray-300 text-xs px-3 py-1 rounded-full border border-white/10">
                    {template.category}
                  </span>
                  {/* Premium Badge */}
                  <span className={`absolute top-4 right-4 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                    template.type === 'Premium' 
                      ? 'bg-brand-violet/20 text-brand-violet border border-brand-violet/30'
                      : 'bg-brand-indigo/20 text-brand-indigo border border-brand-indigo/30'
                  }`}>
                    {template.type}
                  </span>
                </div>

                {/* Content */}
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
        </section>

        {/* BROWSE BY CATEGORY SECTION */}
        <section className="bg-gray-950/40 py-16 border-t border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-center text-white mb-8">
              Browse templates by industry
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {CATEGORIES.filter(cat => cat !== "All").map((category) => (
                <Link
                  key={category}
                  href={`/templates?cat=${category}`}
                  className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/15 text-sm font-medium text-gray-300 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Launch your site in 4 easy steps
            </h2>
            <p className="mt-4 text-gray-400 max-w-xl mx-auto">
              How we partner with you to turn an inspiration style or template code into a live website.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            
            {/* Step 1 */}
            <div className="relative p-6 rounded-2xl bg-gray-900/20 border border-white/5">
              <div className="absolute -top-6 left-6 h-12 w-12 rounded-xl bg-gradient-to-tr from-brand-indigo to-brand-violet flex items-center justify-center text-lg font-black text-white shadow-lg shadow-brand-indigo/10">
                01
              </div>
              <h3 className="text-lg font-bold text-white mt-4 mb-2">Choose Layout</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Pick a template from our shop or show us an inspiration style you want to replicate.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative p-6 rounded-2xl bg-gray-900/20 border border-white/5">
              <div className="absolute -top-6 left-6 h-12 w-12 rounded-xl bg-gradient-to-tr from-brand-violet to-brand-emerald flex items-center justify-center text-lg font-black text-white shadow-lg shadow-brand-violet/10">
                02
              </div>
              <h3 className="text-lg font-bold text-white mt-4 mb-2">Buy or request edits</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Buy the template directly for instant access, or request our customization package.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative p-6 rounded-2xl bg-gray-900/20 border border-white/5">
              <div className="absolute -top-6 left-6 h-12 w-12 rounded-xl bg-gradient-to-tr from-brand-emerald to-brand-indigo flex items-center justify-center text-lg font-black text-white shadow-lg shadow-brand-emerald/10">
                03
              </div>
              <h3 className="text-lg font-bold text-white mt-4 mb-2">Send your assets</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Send us your logo, business descriptions, preferred color palette, links, and contact forms.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative p-6 rounded-2xl bg-gray-900/20 border border-white/5">
              <div className="absolute -top-6 left-6 h-12 w-12 rounded-xl bg-gradient-to-tr from-brand-indigo via-brand-violet to-brand-emerald flex items-center justify-center text-lg font-black text-white shadow-lg shadow-brand-indigo/10">
                04
              </div>
              <h3 className="text-lg font-bold text-white mt-4 mb-2">Deploy & Handover</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                We make the edits, set up domain records, deploy for maximum performance, and hand over the code.
              </p>
            </div>

          </div>
        </section>

        {/* SERVICES SECTION */}
        <section className="bg-gradient-to-b from-[#040816] to-[#02040a] py-24 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold text-white">
                How we can help you build
              </h2>
              <p className="mt-4 text-gray-400 max-w-xl mx-auto">
                Simple pathways to get your business website online. No hidden contract fees.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {SERVICES.map((service) => (
                <div
                  key={service.id}
                  className="glassmorphic p-8 rounded-2xl flex flex-col justify-between hover:border-white/10 transition-all shadow-xl relative overflow-hidden"
                >
                  <div>
                    <span className="text-xs font-semibold text-brand-emerald uppercase tracking-wider block mb-2">
                      Starting {service.startingPrice}
                    </span>
                    <h3 className="text-xl font-bold text-white mb-4">
                      {service.title}
                    </h3>
                    <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                      {service.description}
                    </p>
                    <ul className="space-y-3 mb-8">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-start text-xs text-gray-300">
                          <CheckCircle2 className="h-4 w-4 text-brand-indigo mr-2 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link
                    href={`/contact?service=${service.id}`}
                    className="w-full inline-flex items-center justify-center py-3 rounded-xl text-sm font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                  >
                    Select Pathway
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* INSPIRATION GALLERY SECTION */}
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                Design Inspiration Gallery
              </h2>
              <p className="mt-3 text-gray-400 max-w-xl">
                Love these styles? We can recreate these high-converting aesthetics for your startup or clinic.
              </p>
            </div>
            <Link
              href="/inspiration"
              className="inline-flex items-center text-sm font-semibold text-brand-emerald hover:text-brand-emerald/80 transition-colors group"
            >
              Browse all styles
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {INSPIRATION_STYLES.map((style) => (
              <div
                key={style.id}
                className="group glassmorphic rounded-2xl overflow-hidden hover:border-white/15 transition-all duration-300"
              >
                <div className="relative aspect-[4/3] bg-gray-950 border-b border-white/5 overflow-hidden">
                  <Image
                    src={style.previewImage}
                    alt={style.name}
                    fill
                    className="object-cover object-top opacity-80 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-500"
                  />
                  <div className="absolute bottom-4 left-4 bg-gray-900/90 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs text-gray-300">
                    Aesthetic Direction
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white mb-2">
                    {style.name}
                  </h3>
                  <p className="text-sm text-gray-400 mb-6 line-clamp-2">
                    {style.description}
                  </p>
                  <Link
                    href={`/contact?style=${style.id}`}
                    className="inline-flex items-center justify-center w-full px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-950 bg-white hover:bg-gray-150 transition-colors"
                  >
                    Use this style
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PRICING SECTION */}
        <section id="pricing" className="bg-gray-950/30 py-24 border-t border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold text-white">
                Transparent Pricing Packages
              </h2>
              <p className="mt-4 text-gray-400 max-w-xl mx-auto">
                No surprises. Simple flat pricing for templates, customized launches, and bespoke builds.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {PRICING_PLANS.map((plan) => (
                <div
                  key={plan.id}
                  className="glassmorphic p-6 rounded-2xl flex flex-col justify-between hover:border-brand-indigo/20 transition-all"
                >
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">{plan.title}</h3>
                    <div className="mb-4">
                      <span className="text-3xl font-extrabold text-brand-emerald">{plan.price}</span>
                    </div>
                    <p className="text-xs text-gray-400 mb-6">{plan.description}</p>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start text-xs text-gray-300">
                          <CheckCircle2 className="h-4 w-4 text-brand-emerald mr-2 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link
                    href={`/contact?plan=${plan.id}`}
                    className="w-full inline-flex items-center justify-center py-2.5 rounded-xl text-xs font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors mt-4"
                  >
                    Get Package
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHY SCRIPTLYHQ SECTION */}
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            <div className="lg:col-span-1">
              <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
                Why startups and clinics choose ScriptlyHQ
              </h2>
              <p className="mt-4 text-gray-400 leading-relaxed">
                Hiring a traditional agency takes months and costs a fortune. Building with DIY page builders produces slow sites that fail to capture leads. ScriptlyHQ gives you agency quality at template speeds.
              </p>
              <div className="mt-8">
                <a
                  href="https://www.instagram.com/scriptlyhq/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-brand-emerald hover:underline text-sm font-semibold"
                >
                  <Instagram className="h-4 w-4" />
                  Follow our progress on Instagram
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
              
              <div className="p-6 rounded-2xl bg-gray-900/20 border border-white/5">
                <Clock className="h-8 w-8 text-brand-indigo mb-4" />
                <h3 className="text-base font-bold text-white mb-2">Cheaper & Faster</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Avoid paying thousands for design iterations. Get a fully working setup customized and deployed in under 4 days.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-gray-900/20 border border-white/5">
                <TrendingUp className="h-8 w-8 text-brand-emerald mb-4" />
                <h3 className="text-base font-bold text-white mb-2">Designed to Convert</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Our pages focus on clear value propositions, trust signals, direct contact fields, and clickable WhatsApp channels.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-gray-900/20 border border-white/5">
                <Globe className="h-8 w-8 text-brand-violet mb-4" />
                <h3 className="text-base font-bold text-white mb-2">Optimized Tech Stack</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  No clunky WordPress plugins. Built in modern Next.js/HTML, hosted on global CDNs, delivering instant loads.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-gray-900/20 border border-white/5">
                <CheckCircle2 className="h-8 w-8 text-brand-indigo mb-4" />
                <h3 className="text-base font-bold text-white mb-2">Zero Dev Hassle</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  We configure SSL certificates, register custom domain pointers, setup email captures, and verify responsive views.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="bg-gradient-to-b from-[#02040a] to-[#030712] py-24 border-t border-white/5">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold text-white">
                Frequently Asked Questions
              </h2>
              <p className="mt-4 text-gray-400">
                Everything you need to know about buying templates and customization processes.
              </p>
            </div>

            <div className="space-y-4">
              {FAQS.map((faq, index) => {
                const isOpen = activeFaq === index;
                return (
                  <div
                    key={index}
                    className="rounded-2xl border border-white/5 bg-gray-900/20 overflow-hidden"
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full flex items-center justify-between p-6 text-left focus:outline-none transition-colors hover:bg-white/5"
                    >
                      <span className="font-semibold text-white text-sm sm:text-base">
                        {faq.question}
                      </span>
                      {isOpen ? (
                        <Minus className="h-4 w-4 text-brand-emerald shrink-0" />
                      ) : (
                        <Plus className="h-4 w-4 text-brand-indigo shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-6 text-sm sm:text-base text-gray-400 border-t border-white/5 pt-4 leading-relaxed">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FINAL CTA SECTION */}
        <section className="py-24 relative overflow-hidden">
          {/* Background Glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-indigo/10 blur-[130px] z-0" />
          
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Choose a landing page today.<br />Launch your business faster.
            </h2>
            <p className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              We eliminate technical roadblocks so you can start selling. Pick a layout style and launch.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link
                href="/templates"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-brand-indigo to-brand-violet hover:from-brand-indigo/90 hover:to-brand-violet/90 transition-all hover:scale-[1.02] shadow-xl"
              >
                Browse Templates
              </Link>
              <Link
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-semibold text-gray-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-all hover:scale-[1.02]"
              >
                Request Custom Design
              </Link>
            </div>
            <p className="text-xs text-gray-500 pt-4 flex items-center justify-center gap-1">
              Made with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> for founders globally.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
