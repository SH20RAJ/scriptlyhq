import { Terminal, Layout, Bot, Cpu, Sparkles, FolderCode, Layers } from "lucide-react";

const PRODUCT_TYPES = [
  {
    icon: Layout,
    title: "SaaS Starters & Boilerplates",
    description: "Full-stack starters with auth, Neon database, Razorpay payments, and email pipelines pre-wired.",
    priceRange: "₹2,499 – ₹6,999",
    popularTags: ["Next.js", "Drizzle", "Tailwind", "Razorpay"],
    badge: "High Demand",
  },
  {
    icon: Terminal,
    title: "Backend Scripts & Scrapers",
    description: "Battle-tested scrapers, cron pipelines, webhook processors, and API sync utilities that save hours.",
    priceRange: "₹999 – ₹2,999",
    popularTags: ["Python", "Node.js", "Puppeteer", "Docker"],
    badge: "Fast to Build",
  },
  {
    icon: Layers,
    title: "UI Kits & Design Systems",
    description: "Modern component systems, animated dashboard widgets, chart templates, and responsive layouts.",
    priceRange: "₹1,499 – ₹3,999",
    popularTags: ["React", "Tailwind v4", "Radix UI", "Framer"],
    badge: "High Conversion",
  },
  {
    icon: Bot,
    title: "AI Prompts & Agent Workflows",
    description: "RAG pipelines, LangChain chains, structured output schemas, and production-tested system prompts.",
    priceRange: "₹499 – ₹1,999",
    popularTags: ["OpenAI", "Claude", "LangChain", "Vector DB"],
    badge: "Trending",
  },
  {
    icon: Cpu,
    title: "Developer CLIs & Micro-Tools",
    description: "Terminal tools, code generators, schema mappers, git hooks, and developer productivity utilities.",
    priceRange: "₹799 – ₹1,999",
    popularTags: ["TypeScript", "Go", "Rust", "CLI"],
    badge: "Dev Favorite",
  },
  {
    icon: FolderCode,
    title: "Marketing & Landing Pages",
    description: "High-converting marketing templates for developer tools, open source libraries, and waitlists.",
    priceRange: "₹1,299 – ₹3,499",
    popularTags: ["Next.js", "Astro", "Tailwind", "MDX"],
    badge: "Consistent Sales",
  },
];

export default function CreatorProductTypes() {
  return (
    <section className="py-16 md:py-24 border-b border-border/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> High-Demand Formats
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            What can you sell on Scriptly?
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            If it saves engineers time, it belongs on Scriptly. These formats consistently command high prices and solid sales velocity:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PRODUCT_TYPES.map((type, idx) => {
            const Icon = type.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-card/30 border border-border/40 hover:border-primary/40 transition-all duration-200 hover:-translate-y-0.5 shadow-sm flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-muted/40 text-muted-foreground text-[10px] font-black uppercase tracking-wider">
                      {type.badge}
                    </span>
                  </div>

                  <h3 className="font-black text-sm text-foreground group-hover:text-primary transition-colors">
                    {type.title}
                  </h3>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {type.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-border/30 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground text-[11px]">Typical Price</span>
                    <span className="font-black text-foreground">{type.priceRange}</span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {type.popularTags.map((tag) => (
                      <span key={tag} className="px-1.5 py-0.5 rounded bg-muted/30 text-muted-foreground text-[10px] font-mono">
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
