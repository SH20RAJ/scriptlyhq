import Link from "next/link";

export default function BlogFooter() {
  return (
    <footer className="mt-auto border-t border-border/40 bg-card/20 py-16">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-border/40 pb-12 mb-10">
          <div className="space-y-4">
            <p className="text-lg font-black tracking-tighter">
              scriptly<span className="text-[#1CB0F6]">blog</span>
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xs font-medium">
              Read actionable guidelines, backend architectures, tech branching systems, and frontend optimizations curated by indie developers and SaaS builders.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-foreground">Blog Topics</h4>
            <ul className="space-y-2 text-xs font-medium text-muted-foreground">
              <li><Link href="/blog" className="hover:text-foreground transition-colors">React 19 & Next.js 15</Link></li>
              <li><Link href="/blog" className="hover:text-foreground transition-colors">Neon Serverless PostgreSQL</Link></li>
              <li><Link href="/blog" className="hover:text-foreground transition-colors">SaaS Architectural Patterns</Link></li>
              <li><Link href="/blog" className="hover:text-foreground transition-colors">Developer Monetization</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-foreground">Digital Store</h4>
            <ul className="space-y-2 text-xs font-medium text-muted-foreground">
              <li><Link href="/" className="hover:text-foreground transition-colors">Marketplace Home</Link></li>
              <li><Link href="/explore" className="hover:text-foreground transition-colors">Explore Assets</Link></li>
              <li><Link href="/offers" className="hover:text-foreground transition-colors">Deals & Coupons</Link></li>
              <li><Link href="/creator" className="hover:text-foreground transition-colors">List Your Code</Link></li>
              <li><Link href="/docs/route-guide" className="hover:text-foreground transition-colors">Route Guide</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-foreground">Platform</h4>
            <ul className="space-y-2 text-xs font-medium text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact Support</Link></li>
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground font-medium">© 2026 Strivio Inc. All rights reserved.</p>
          <p className="text-[10px] text-muted-foreground/60 font-mono">Designed for developers & digital creators.</p>
        </div>
      </div>
    </footer>
  );
}
