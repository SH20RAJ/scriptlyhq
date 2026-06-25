import { Metadata } from "next";
import { 
  Mail, Globe, ExternalLink, Sparkles, Terminal, CheckCircle2 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Hire Shaswat Raj — Next.js & AI Product Developer",
  description: "Hire remote Next.js, TypeScript, AI, SaaS MVP, landing page, dashboard, and automation developer. View portfolio and socials.",
  alternates: {
    canonical: "https://scriptly.store/hire-me",
  },
};

export default function HireMePage() {
  const socialLinks = [
    {
      name: "GitHub",
      url: "https://github.com/SH20RAJ",
      desc: "Open source tools & repositories",
      svg: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      ),
      color: "hover:text-white hover:bg-neutral-900 border-white/5",
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com/in/sh20raj",
      desc: "Professional updates & networking",
      svg: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      ),
      color: "hover:text-[#0A66C2] hover:bg-[#0A66C2]/10 border-[#0A66C2]/10",
    },
    {
      name: "CodePen",
      url: "https://codepen.io/sh20raj",
      desc: "Creative CSS & frontend animations",
      svg: (
        <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <path d="M12 2l10 6.5v7L12 22 2 15.5v-7L12 2zM12 22v-6.5M22 8.5l-10 7-10-7M2 15.5l10-7 10 7M12 2v6.5"/>
        </svg>
      ),
      color: "hover:text-[#FFDD00] hover:bg-[#FFDD00]/10 border-[#FFDD00]/10",
    },
    {
      name: "X (Twitter)",
      url: "https://x.com/SH20RAJ",
      desc: "Tech discussions & startup building",
      svg: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      color: "hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/10 border-[#1DA1F2]/10",
    },
    {
      name: "YouTube",
      url: "https://www.youtube.com/@StackShade",
      desc: "Programming tutorials & video logs",
      svg: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.107C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.388.511a3.002 3.002 0 0 0-2.11 2.107C0 8.053 0 12 0 12s0 3.947.502 5.837a3.003 3.003 0 0 0 2.11 2.107c1.883.511 9.388.511 9.388.511s7.505 0 9.388-.511a3.002 3.002 0 0 0 2.11-2.107C24 15.947 24 12 24 12s0-3.947-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ),
      color: "hover:text-[#FF0000] hover:bg-[#FF0000]/10 border-[#FF0000]/10",
    },
    {
      name: "npm Profile",
      url: "https://www.npmjs.com/~sh20raj",
      desc: "Published developer packages",
      svg: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M0 7.334v8h11.5v-8h-11.5zm9.167 5.666h-1.167v-3.333h-1.167v3.333h-2.333v-5h4.667v5zm5.833-5.666v8h5.667v-3h1.167v-5h-6.834zm5 5h-1.167v-2.333h-1.167v2.333h-1.5v-3.333h3.834v3.333z"/>
        </svg>
      ),
      color: "hover:text-[#CB3837] hover:bg-[#CB3837]/10 border-[#CB3837]/10",
    },
  ];

  const highlights = [
    "Next.js App Router & Server Components expert",
    "Tailwind CSS, Radix UI & shadcn/ui custom layout builder",
    "PostgreSQL, Neon, Drizzle ORM, & serverless setups",
    "SaaS dashboards, auth integrations, & Razorpay checkouts",
    "AI APIs (OpenAI, Claude, Gemini) & autonomous workflows",
    "Remote-first contract & agency overflow sprint developer",
  ];

  return (
    <div className="container max-w-5xl mx-auto px-4 py-16 md:py-24 space-y-16" id="hire-me-page-root">
      {/* 1. Header Hero section */}
      <div className="text-center space-y-6 max-w-2xl mx-auto">
        <div className="flex justify-center select-none pb-2">
          <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-[#1CB0F6]/20 bg-[#1CB0F6]/5 shadow-xl shadow-primary/5">
            <img 
              src="https://sh20raj.github.io/profile.jpg" 
              alt="Shaswat Raj Profile Picture"
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>
        </div>
        <Badge variant="outline" className="rounded-full px-4 py-1 text-[10px] uppercase font-black tracking-[0.2em] border-[#1CB0F6]/20 text-[#1CB0F6] bg-[#1CB0F6]/5">
          <Sparkles className="w-3.5 h-3.5 mr-1.5 animate-pulse text-[#1CB0F6]" />
          Available for Hire
        </Badge>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground leading-[1.05]">
          Shaswat Raj <br />
          <span className="bg-gradient-to-r from-[#1CB0F6] to-[#58CC02] bg-clip-text text-transparent">Next.js & AI Developer</span>
        </h1>
        <p className="text-base text-muted-foreground font-semibold leading-relaxed">
          I build landing pages, SaaS dashboards, AI tools, and MVPs for founders who need a working product, not a slide deck. Shipping fast using Next.js, TypeScript, Cloudflare, and custom AI setups.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button asChild size="lg" className="rounded-xl font-bold uppercase tracking-wider text-xs bg-[#1CB0F6] hover:bg-[#1CB0F6]/90 text-white h-11 px-8 cursor-pointer shadow-[0_0_15px_rgba(28,176,246,0.3)]">
            <a href="mailto:sh20raj@gmail.com">
              <Mail className="w-4 h-4 mr-2" />
              sh20raj@gmail.com
            </a>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-xl font-bold uppercase tracking-wider text-xs border-border/80 hover:bg-card h-11 px-8 cursor-pointer">
            <a href="https://sh20raj.github.io" target="_blank" rel="noopener noreferrer">
              <Globe className="w-4 h-4 mr-2" />
              sh20raj.github.io
              <ExternalLink className="w-3 h-3 ml-1.5 opacity-60" />
            </a>
          </Button>
        </div>
      </div>

      {/* 2. Main content split layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start max-w-4xl mx-auto">
        {/* Core Expertise Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-card/30 border border-border/40 rounded-3xl p-6 md:p-8 space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-foreground flex items-center gap-2 pb-4 border-b border-border/40">
              <Terminal className="w-5 h-5 text-[#58CC02]" />
              Expertise
            </h3>
            <ul className="space-y-4">
              {highlights.map((item, idx) => (
                <li key={idx} className="flex gap-3 items-start text-xs font-semibold text-muted-foreground leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-[#58CC02] flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Channels / Social Links */}
        <div className="lg:col-span-7 space-y-6">
          <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Channels &amp; Social Links</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {socialLinks.map((social) => {
              return (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group p-4 bg-card/20 hover:bg-card/40 border rounded-2xl transition-all duration-200 flex items-center justify-between ${social.color}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-background/50 border border-border/30 group-hover:scale-105 transition-transform">
                      {social.svg}
                    </div>
                    <div className="text-left">
                      <h4 className="text-xs font-black uppercase tracking-wider text-foreground leading-none">
                        {social.name}
                      </h4>
                      <p className="text-[10px] text-muted-foreground mt-1 leading-tight max-w-[140px]">
                        {social.desc}
                      </p>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Footer Banner Callout */}
      <div className="max-w-3xl mx-auto bg-gradient-to-r from-[#1CB0F6]/10 to-[#58CC02]/10 border border-[#1CB0F6]/25 rounded-3xl p-8 space-y-4 text-center">
        <h3 className="text-xl font-bold text-foreground">Need custom SaaS modules or landing pages built?</h3>
        <p className="text-xs font-semibold text-muted-foreground max-w-lg mx-auto leading-relaxed">
          Let's connect. I work sprint-based contract roles helping founders and teams push features to production quickly.
        </p>
        <div className="pt-2">
          <a
            href="mailto:sh20raj@gmail.com"
            className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#1CB0F6] hover:underline"
          >
            Send email inquiries &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
