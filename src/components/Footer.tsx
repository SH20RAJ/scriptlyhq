import Link from "next/link";
import { Layers, Instagram, ArrowUpRight, MessageSquare, Send } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-[#02040a] border-t border-white/5 pt-16 pb-12 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 -translate-y-1/2 w-80 h-80 rounded-full bg-brand-indigo/10 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 translate-y-1/2 w-80 h-80 rounded-full bg-brand-emerald/5 blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Core Conversion Banner in Footer */}
        <div className="mb-16 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative">
          <div className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/3 w-32 h-32 rounded-full bg-brand-violet/20 blur-2xl" />
          <div className="max-w-xl text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Not sure what to choose?
            </h3>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              Send us your Instagram handle or business link. We’ll study your business and suggest the best landing page style for you.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <Link
              href="/contact?ref=footer_link"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/10 transition-colors text-center"
            >
              <Send className="mr-2 h-4 w-4" />
              Submit Business Link
            </Link>
            <a
              href="https://www.instagram.com/scriptlyhq/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-sm font-semibold text-gray-950 bg-brand-emerald hover:bg-brand-emerald/90 transition-colors text-center"
            >
              <Instagram className="mr-2 h-4 w-4 text-gray-950" />
              DM on Instagram
              <ArrowUpRight className="ml-1 h-3 w-3 text-gray-950" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-brand-violet via-brand-indigo to-brand-emerald flex items-center justify-center">
                <Layers className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                Scriptly<span className="text-brand-emerald">HQ</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Buy ready-made landing pages, customize them for your brand, or get a new one built from scratch. High conversion designs that launch in days.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/scriptlyhq/"
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-4">Marketplace</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/templates" className="text-sm text-gray-400 hover:text-white transition-colors">
                  All Templates
                </Link>
              </li>
              <li>
                <Link href="/templates?cat=SaaS" className="text-sm text-gray-400 hover:text-white transition-colors">
                  SaaS Templates
                </Link>
              </li>
              <li>
                <Link href="/templates?cat=Restaurant" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Restaurant & Cafe
                </Link>
              </li>
              <li>
                <Link href="/templates?cat=Clinic" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Clinic & Dental
                </Link>
              </li>
            </ul>
          </div>

          {/* Agency Services */}
          <div>
            <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-4">Agency Services</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/services#customization" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Template Customization
                </Link>
              </li>
              <li>
                <Link href="/services#scratch" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Build From Scratch
                </Link>
              </li>
              <li>
                <Link href="/services#hosting" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Website Deployment
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Agency Packages
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-4">Contact</h4>
            <ul className="space-y-2.5">
              <li>
                <span className="text-sm text-gray-400 block">Website:</span>
                <span className="text-sm text-white font-medium">scriptlyhq.strivio.world</span>
              </li>
              <li>
                <span className="text-sm text-gray-400 block">Instagram DM:</span>
                <a
                  href="https://www.instagram.com/scriptlyhq/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-brand-emerald hover:underline inline-flex items-center gap-1"
                >
                  @scriptlyhq <ArrowUpRight className="h-3 w-3" />
                </a>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Submit Enquiry Form
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 mt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} ScriptlyHQ. All rights reserved. Designed for founders.
          </p>
          <div className="flex space-x-6 text-xs text-gray-500">
            <Link href="/templates" className="hover:text-gray-400 transition-colors">
              Marketplace
            </Link>
            <Link href="/inspiration" className="hover:text-gray-400 transition-colors">
              Inspiration Styles
            </Link>
            <Link href="/contact" className="hover:text-gray-400 transition-colors">
              Get Quote
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
