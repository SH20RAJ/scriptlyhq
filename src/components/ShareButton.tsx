"use client";

import { useState } from "react";
import { Share2, Copy, Check, MessageSquare, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareButtonProps {
  productTitle: string;
  productSlug: string;
}

// Inline custom SVG icons to avoid Lucide package mismatch version issues
const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

export default function ShareButton({ productTitle, productSlug }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const productUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/products/${productSlug}`
    : `https://scriptlyhq.strivio.world/products/${productSlug}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(productUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const shareOptions = [
    {
      name: "Twitter / X",
      icon: TwitterIcon,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${productTitle} on ScriptHQ!`)}&url=${encodeURIComponent(productUrl)}`,
      color: "hover:bg-neutral-800 hover:text-white"
    },
    {
      name: "LinkedIn",
      icon: LinkedinIcon,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(productUrl)}`,
      color: "hover:bg-blue-600/10 hover:text-blue-400"
    },
    {
      name: "Facebook",
      icon: FacebookIcon,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`,
      color: "hover:bg-blue-700/10 hover:text-blue-500"
    },
    {
      name: "WhatsApp",
      icon: MessageSquare,
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out ${productTitle} on ScriptHQ: ${productUrl}`)}`,
      color: "hover:bg-emerald-600/10 hover:text-emerald-400"
    },
    {
      name: "Email",
      icon: Mail,
      url: `mailto:?subject=${encodeURIComponent(productTitle)}&body=${encodeURIComponent(`Check out this premium digital product on ScriptHQ:\n\n${productUrl}`)}`,
      color: "hover:bg-neutral-800 hover:text-neutral-200"
    }
  ];

  return (
    <div className="relative w-full">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        className="w-full h-12 rounded-xl font-bold uppercase tracking-widest text-[10px] border-border/60 hover:bg-muted/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <Share2 className="w-3.5 h-3.5" />
        Share Product
      </Button>

      {isOpen && (
        <>
          {/* Overlay to close when clicking outside */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          
          {/* Popover container */}
          <div className="absolute top-14 left-0 w-full z-50 p-4 rounded-2xl border border-neutral-800/80 bg-neutral-950/95 backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 space-y-3">
            <h4 className="text-[10px] font-black uppercase tracking-wider text-neutral-400 border-b border-neutral-900 pb-2">
              Share Options
            </h4>

            {/* Quick copy field */}
            <div className="flex items-center gap-2 bg-neutral-900 p-2 rounded-xl border border-neutral-800">
              <input
                type="text"
                readOnly
                value={productUrl}
                className="flex-1 bg-transparent text-[10px] text-neutral-300 outline-none overflow-ellipsis font-mono"
              />
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors cursor-pointer"
                title="Copy Link"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-neutral-400" />
                )}
              </button>
            </div>

            {/* Social shares */}
            <div className="grid grid-cols-1 gap-1">
              {shareOptions.map((opt) => {
                const Icon = opt.icon;
                return (
                  <a
                    key={opt.name}
                    href={opt.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-neutral-400 text-xs font-semibold transition-all ${opt.color}`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{opt.name}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
