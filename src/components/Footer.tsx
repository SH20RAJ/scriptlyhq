import Link from "next/link";
import { FOOTER_NAVIGATION } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { Terminal, ShieldCheck, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-card/30 py-12 sm:py-16 text-xs transition-colors">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-10 pb-12 border-b border-border/50">
          {/* Brand Column */}
          <div className="col-span-2 space-y-3.5">
            <Link href="/" className="flex items-center gap-2 font-bold text-foreground">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-foreground text-background">
                <Terminal className="h-3.5 w-3.5" />
              </div>
              <span className="text-sm font-bold">{siteConfig.name}</span>
            </Link>
            <p className="text-muted-foreground leading-relaxed max-w-sm text-xs">
              The marketplace for software you can actually build on. Production-ready templates, scripts, and developer tools to ship products faster.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              <span>Verified code · Instant delivery · 95% creator split</span>
            </div>
          </div>

          {/* Marketplace Column */}
          <div className="space-y-3">
            <p className="font-bold text-foreground tracking-tight">Marketplace</p>
            <ul className="space-y-2 text-muted-foreground">
              {FOOTER_NAVIGATION.marketplace.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-foreground transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Creators Column */}
          <div className="space-y-3">
            <p className="font-bold text-foreground tracking-tight">Creators</p>
            <ul className="space-y-2 text-muted-foreground">
              {FOOTER_NAVIGATION.creators.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-foreground transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Learn Column */}
          <div className="space-y-3">
            <p className="font-bold text-foreground tracking-tight">Learn</p>
            <ul className="space-y-2 text-muted-foreground">
              {FOOTER_NAVIGATION.learn.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-foreground transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company & Legal Column */}
          <div className="space-y-3">
            <p className="font-bold text-foreground tracking-tight">Company & Legal</p>
            <ul className="space-y-2 text-muted-foreground">
              {FOOTER_NAVIGATION.company.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-foreground transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
              {FOOTER_NAVIGATION.legal.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-foreground transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-muted-foreground">
          <p>© {new Date().getFullYear()} {siteConfig.name}. Built for developers who ship.</p>
          <div className="flex items-center gap-6">
            <Link href={siteConfig.social.github} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              GitHub
            </Link>
            <Link href={siteConfig.social.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              Twitter
            </Link>
            <Link href="/trust" className="hover:text-foreground transition-colors">
              Trust & Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
