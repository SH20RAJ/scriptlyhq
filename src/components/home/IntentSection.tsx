import Link from "next/link";
import { ArrowRight, Layers, Bot, Layout, Terminal, Palette, Cpu, ShoppingBag, Globe } from "lucide-react";

interface IntentItem {
  title: string;
  description: string;
  icon: any;
  href: string;
  badge: string;
}

const INTENT_ITEMS: IntentItem[] = [
  {
    title: "SaaS Boilerplates",
    description: "Full-stack Next.js, authentication, payment webhooks & admin portals.",
    icon: Layers,
    href: "/explore?category=saas-templates",
    badge: "Full-Stack",
  },
  {
    title: "AI Applications",
    description: "LLM streaming interfaces, OpenAI/Claude SDK setups & agent prompt kits.",
    icon: Bot,
    href: "/explore?category=ai-prompts",
    badge: "AI Native",
  },
  {
    title: "Agency & Landing Pages",
    description: "High-converting marketing themes with smooth micro-interactions.",
    icon: Layout,
    href: "/explore?category=landing-pages",
    badge: "Commercial",
  },
  {
    title: "Developer Tools & CLIs",
    description: "Reusable Node/Python scripts, utility boilerplates & API starters.",
    icon: Terminal,
    href: "/explore?category=scripts",
    badge: "Productivity",
  },
  {
    title: "UI Design Systems",
    description: "Tailwind CSS component libraries, glassmorphism kits & dashboard designs.",
    icon: Palette,
    href: "/explore?category=templates",
    badge: "Design",
  },
  {
    title: "Automations & Bots",
    description: "Python DevOps scripts, web scrapers, and automated background jobs.",
    icon: Cpu,
    href: "/explore?search=automation",
    badge: "Scripts",
  },
  {
    title: "E-Commerce Stores",
    description: "Digital product storefronts, carts, and payment checkout integrations.",
    icon: ShoppingBag,
    href: "/explore?search=ecommerce",
    badge: "Storefront",
  },
  {
    title: "Browser Extensions",
    description: "Chrome Manifest V3 templates with background workers and options pages.",
    icon: Globe,
    href: "/explore?search=extension",
    badge: "Extension",
  },
];

export default function IntentSection() {
  return (
    <section className="py-16 sm:py-24 border-b border-border/50 bg-secondary/10">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 space-y-10">
        <div className="max-w-2xl space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-primary">
            Intent-Based Discovery
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            What are you building?
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Skip days of boilerplate setup. Choose your project archetype to discover curated, production-tested architectures.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {INTENT_ITEMS.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.title}
                href={item.href}
                className="group relative flex flex-col justify-between p-5 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-md hover:bg-card hover:border-border hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono uppercase font-bold text-muted-foreground bg-secondary/80 px-2 py-0.5 rounded-full border border-border/40">
                      {item.badge}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-1 text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors">
                  <span>Explore Assets</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
