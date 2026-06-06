"use client";

import Link from "next/link";
import { Check, X, ShieldAlert, BadgeHelp, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PRICING_PLANS } from "@/data";

export default function PricingPage() {
  const comparisonFeatures = [
    {
      name: "Responsive Mobile-First Codebase",
      template: true,
      customization: true,
      custom: true,
      support: true,
    },
    {
      name: "Raw Source Files Download",
      template: true,
      customization: true,
      custom: true,
      support: true,
    },
    {
      name: "Color & Typography Customization",
      template: false,
      customization: true,
      custom: true,
      support: true,
    },
    {
      name: "Logo & Copy Writing Insertion",
      template: false,
      customization: true,
      custom: true,
      support: true,
    },
    {
      name: "Form Leads / WhatsApp Setup",
      template: false,
      customization: true,
      custom: true,
      support: true,
    },
    {
      name: "Custom domain pointing (DNS)",
      template: false,
      customization: true,
      custom: true,
      support: true,
    },
    {
      name: "Custom wireframes / Bespoke layouts",
      template: false,
      customization: false,
      custom: true,
      support: false,
    },
    {
      name: "Speed CDN hosting & SSL setup",
      template: false,
      customization: true,
      custom: true,
      support: true,
    },
    {
      name: "Dedicated Launch Support",
      template: "Guide only",
      customization: "Basic",
      custom: "30-days",
      support: "Ongoing",
    },
    {
      name: "Code updates & offer revisions",
      template: false,
      customization: false,
      custom: false,
      support: "Unlimited",
    }
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-gray-100 flex flex-col bg-grid-pattern relative">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 relative z-10">
        
        {/* Page Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-brand-emerald font-medium">
            <CheckCircle2 className="h-3.5 w-3.5 text-brand-emerald" />
            <span>Simple, Flat Rates</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Transparent Pricing & Plans
          </h1>
          <p className="text-base sm:text-lg text-gray-400">
            No long contract forms or sales calls. Pick the pricing model that fits your launching timeline.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`glassmorphic p-6 rounded-3xl flex flex-col justify-between relative overflow-hidden transition-all ${
                plan.id === "customization" 
                  ? "border-brand-violet bg-brand-violet/5 hover:border-brand-violet/60" 
                  : "hover:border-white/10"
              }`}
            >
              {plan.id === "customization" && (
                <span className="absolute top-3 right-3 bg-brand-violet text-white text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded">
                  Best Value
                </span>
              )}
              <div>
                <h3 className="text-lg font-bold text-white mb-2">{plan.title}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-extrabold text-brand-emerald">{plan.price}</span>
                </div>
                <p className="text-xs text-gray-400 mb-6 min-h-[36px]">{plan.description}</p>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start text-xs text-gray-300">
                      <Check className="h-4 w-4 text-brand-emerald mr-2 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href={`/contact?plan=${plan.id}`}
                className={`w-full inline-flex items-center justify-center py-3 rounded-xl text-xs font-semibold text-center transition-all hover:scale-[1.01] ${
                  plan.id === "customization"
                    ? "bg-brand-violet text-white hover:bg-brand-violet/90"
                    : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/5"
                }`}
              >
                Choose {plan.title}
              </Link>
            </div>
          ))}
        </div>

        {/* Comparison Table Section */}
        <div className="border-t border-white/5 pt-20">
          <h2 className="text-2xl font-extrabold text-white text-center mb-12">
            Detailed Package Comparison
          </h2>

          <div className="overflow-x-auto rounded-2xl border border-white/5 bg-gray-900/10">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-white/5 bg-gray-950/40 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <th className="p-5">Service Deliverable</th>
                  <th className="p-5 text-center">Template Only</th>
                  <th className="p-5 text-center bg-brand-violet/5">Customization</th>
                  <th className="p-5 text-center">Custom Build</th>
                  <th className="p-5 text-center">Monthly Support</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {comparisonFeatures.map((feat, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.01] transition-colors">
                    <td className="p-5 font-medium text-gray-300">{feat.name}</td>
                    
                    {/* Template Only */}
                    <td className="p-5 text-center text-gray-400">
                      {typeof feat.template === "boolean" ? (
                        feat.template ? <Check className="h-5 w-5 text-brand-emerald mx-auto" /> : <X className="h-5 w-5 text-red-500/50 mx-auto" />
                      ) : (
                        <span className="text-xs">{feat.template}</span>
                      )}
                    </td>

                    {/* Customize Template */}
                    <td className="p-5 text-center text-gray-300 bg-brand-violet/5">
                      {typeof feat.customization === "boolean" ? (
                        feat.customization ? <Check className="h-5 w-5 text-brand-emerald mx-auto" /> : <X className="h-5 w-5 text-red-500/50 mx-auto" />
                      ) : (
                        <span className="text-xs font-semibold">{feat.customization}</span>
                      )}
                    </td>

                    {/* Custom build from scratch */}
                    <td className="p-5 text-center text-gray-400">
                      {typeof feat.custom === "boolean" ? (
                        feat.custom ? <Check className="h-5 w-5 text-brand-emerald mx-auto" /> : <X className="h-5 w-5 text-red-500/50 mx-auto" />
                      ) : (
                        <span className="text-xs">{feat.custom}</span>
                      )}
                    </td>

                    {/* Monthly support */}
                    <td className="p-5 text-center text-gray-400">
                      {typeof feat.support === "boolean" ? (
                        feat.support ? <Check className="h-5 w-5 text-brand-emerald mx-auto" /> : <X className="h-5 w-5 text-red-500/50 mx-auto" />
                      ) : (
                        <span className="text-xs">{feat.support}</span>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
