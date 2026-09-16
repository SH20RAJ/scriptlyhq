export interface NavItem {
  href: string;
  label: string;
  badge?: string;
  description?: string;
}

export const MAIN_NAVIGATION: NavItem[] = [
  { href: "/explore", label: "Explore", description: "Browse developer tools, scripts and templates" },
  { href: "/explore?category=all", label: "Categories", description: "Explore categories" },
  { href: "/free", label: "Free", description: "Open source boilerplates, scripts and tools" },
  { href: "/blog", label: "Learn", description: "Engineering guides, tutorials and monetization" },
  { href: "/creator", label: "Sell on Scriptly", description: "Sell your code and keep 95% of sales" },
];

export const FOOTER_NAVIGATION = {
  marketplace: [
    { href: "/explore", label: "Explore" },
    { href: "/explore?category=all", label: "Categories" },
    { href: "/free", label: "Free Products" },
    { href: "/offers", label: "Offers" },
    { href: "/featured", label: "Featured" },
  ],
  creators: [
    { href: "/creator", label: "Sell on Scriptly" },
    { href: "/creator/new", label: "Submit Product" },
    { href: "/affiliate", label: "Affiliate Program" },
    { href: "/trust", label: "Creator Economics & Split" },
  ],
  learn: [
    { href: "/blog", label: "Blog" },
    { href: "/blog", label: "Developer Guides" },
    { href: "/licenses", label: "License Guide" },
    { href: "/docs/api", label: "API Docs" },
  ],
  company: [
    { href: "/about", label: "About" },
    { href: "/trust", label: "Trust Center" },
    { href: "/contact", label: "Support & Contact" },
  ],
  legal: [
    { href: "/terms", label: "Terms of Service" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/refund", label: "Refund Policy" },
    { href: "/dmca", label: "DMCA Policy" },
  ],
};
