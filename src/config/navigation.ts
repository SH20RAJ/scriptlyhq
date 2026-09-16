export interface NavItem {
  href: string;
  label: string;
  badge?: string;
  description?: string;
}

export const MAIN_NAVIGATION: NavItem[] = [
  { href: "/explore", label: "Shop", description: "Browse developer tools, scripts and templates" },
  { href: "/free", label: "Free Tools", description: "Open source boilerplates and scripts" },
  { href: "/directories", label: "Directories", description: "Curated launch and developer tool indexes" },
  { href: "/blog", label: "Resources", description: "Engineering guides, changelogs and tutorials" },
  { href: "/creator", label: "For Creators", description: "Sell your code and keep 95% of sales" },
];

export const FOOTER_NAVIGATION = {
  products: [
    { href: "/explore", label: "Browse Catalog" },
    { href: "/explore?category=saas-templates", label: "SaaS Templates" },
    { href: "/explore?category=scripts", label: "Developer Scripts" },
    { href: "/explore?category=ai-prompts", label: "AI & Automation" },
    { href: "/free", label: "Free Resources" },
  ],
  creators: [
    { href: "/creator", label: "Sell on ScriptlyStore" },
    { href: "/affiliate", label: "Affiliate Program" },
    { href: "/trust", label: "Creator Security & Split" },
  ],
  resources: [
    { href: "/blog", label: "Engineering Blog" },
    { href: "/directories", label: "Tool Directories" },
    { href: "/docs/api", label: "API Reference" },
  ],
  company: [
    { href: "/about", label: "About" },
    { href: "/trust", label: "Trust Center" },
    { href: "/contact", label: "Contact & Support" },
  ],
  legal: [
    { href: "/licenses", label: "Licensing Terms" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/refund", label: "Refund Policy" },
    { href: "/dmca", label: "DMCA Policy" },
  ],
};
