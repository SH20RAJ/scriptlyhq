import { Terminal, Layout, Bot, Cpu, Sparkles, FolderCode, Layers, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const PRODUCT_TYPES = [
  {
    icon: Layout,
    title: "SaaS Boilerplates & Starters",
    description: "Complete full-stack starter code with auth, Neon database, billing, and email pipelines pre-configured.",
    priceRange: "₹2,499 – ₹6,999",
    usdRange: "$39 – $99",
    popularTags: ["Next.js", "Supabase", "Tailwind", "Razorpay"],
    badge: "Highest Demand",
  },
  {
    icon: Terminal,
    title: "Backend Scripts & Automations",
    description: "Battle-tested scrapers, cron pipelines, webhook processors, and API sync utilities that save hours.",
    priceRange: "₹999 – ₹2,999",
    usdRange: "$15 – $49",
    popularTags: ["Python", "Node.js", "Puppeteer", "Docker"],
    badge: "Fast to Build",
  },
  {
    icon: Layers,
    title: "UI Kits & Component Systems",
    description: "Modern design systems, animated dashboard widgets, chart templates, and responsive layout libraries.",
    priceRange: "₹1,499 – ₹3,999",
    usdRange: "$25 – $59",
    popularTags: ["React", "Framer Motion", "Tailwind v4", "Radix"],
    badge: "High Conversion",
  },
  {
    icon: Bot,
    title: "AI Prompts & Agent Workflows",
    description: "RAG pipelines, LangChain chains, structured output generators, and system prompts that actually work.",
    priceRange: "₹499 – ₹1,999",
    usdRange: "$9 – $29",
    popularTags: ["OpenAI", "Claude", "LangChain", "Vector DB"],
    badge: "Trending",
  },
  {
    icon: Cpu,
    title: "Developer Micro-Tools & CLIs",
    description: "Terminal tools, code generators, schema mappers, git hooks, and productivity utilities for engineers.",
    priceRange: "₹799 – ₹1,999",
    usdRange: "$12 – $35",
    popularTags: ["Rust", "Go", "TypeScript", "CLI"],
    badge: "Dev Favorite",
  },
  {
    icon: FolderCode,
    title: "Developer Landing Pages",
    description: "High-converting marketing themes for open source libraries, developer tools, and waitlist campaigns.",
    priceRange: "₹1,299 – ₹3,499",
    usdRange: "$19 – $49",
    popularTags: ["Next.js", "Astro", "Tailwind CSS", "MDX"],
    badge: "Consistent Sales",
  },
];

export default function CreatorProductTypes() {
  return (
    <section className="py-16 md:py-24 border-b border-border/40">
      <div className="max-w-6xl mx-auto px-4 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> High-Demand Formats
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            What can you sell on Scriptly?
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            If it saves developers time, it belongs on Scriptly. These are our top-performing product categories:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRODUCT_TYPES.map((type, idx) => {
            const Icon = type.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-card/40 border border-border/60 hover:border-primary/40 transition-all duration-200 hover:-translate-y-1 shadow-sm flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-muted/60 text-muted-foreground text-[10px] font-black uppercase tracking-wider">
                      {type.badge}
                    </span>
                  </div>

                  <h3 className="font-black text-base text-foreground tracking-tight group-hover:text-primary transition-colors">
                    {type.title}
                  </h3>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {type.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-border/40 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground font-semibold">Typical Price:</span>
                    <span className="font-black text-foreground">{type.priceRange}</span>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {type.popularTags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded-md bg-muted/40 text-muted-foreground text-[10px] font-mono">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
