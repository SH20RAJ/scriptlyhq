import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border/40 bg-card/20 py-16">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-border/40 pb-12 mb-10">
          <div className="space-y-4">
            <p className="text-lg font-black tracking-tighter">ScriptlyStore</p>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xs font-medium">
              Premium digital product marketplace for developer templates, SaaS boilerplates, prompts, scripts, and UI kits.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-foreground">Marketplace</h4>
            <ul className="space-y-2 text-xs font-medium text-muted-foreground">
              <li><Link href="/" className="hover:text-foreground transition-colors">Explore</Link></li>
              <li><Link href="/search" className="hover:text-foreground transition-colors">Search</Link></li>
              <li><Link href="/offers" className="hover:text-foreground transition-colors">Offers</Link></li>
              <li><Link href="/rss" className="hover:text-foreground transition-colors">RSS Feed</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-foreground">Legal & Compliance</h4>
            <ul className="space-y-2 text-xs font-medium text-muted-foreground">
              <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="/refund" className="hover:text-foreground transition-colors">Refund Policy</Link></li>
              <li><Link href="/shipping" className="hover:text-foreground transition-colors">Shipping Policy</Link></li>
              <li><Link href="/dmca" className="hover:text-foreground transition-colors">DMCA Policy</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-foreground">Company</h4>
            <ul className="space-y-2 text-xs font-medium text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact Support</Link></li>
              <li><Link href="/licenses" className="hover:text-foreground transition-colors">Product Licenses</Link></li>
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
