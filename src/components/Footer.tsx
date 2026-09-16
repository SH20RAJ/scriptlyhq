import Link from "next/link";
import { FOOTER_NAVIGATION } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { Terminal } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border/70 bg-card/40 py-12 sm:py-16 text-xs transition-colors">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-10 pb-12 border-b border-border/60">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <Link href="/" className="flex items-center gap-2 font-semibold text-foreground">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-foreground text-background">
                <Terminal className="h-3.5 w-3.5" />
              </div>
              <span className="text-sm font-semibold">{siteConfig.name}</span>
            </Link>
            <p className="text-muted-foreground leading-relaxed">
              Production-ready templates, scripts, and developer tools to ship products faster.
            </p>
          </div>

          {/* Products Column */}
          <div className="space-y-3">
            <p className="font-semibold text-foreground tracking-tight">Products</p>
            <ul className="space-y-2 text-muted-foreground">
              {FOOTER_NAVIGATION.products.map((item) => (
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
            <p className="font-semibold text-foreground tracking-tight">Creators</p>
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

          {/* Resources Column */}
          <div className="space-y-3">
            <p className="font-semibold text-foreground tracking-tight">Resources</p>
            <ul className="space-y-2 text-muted-foreground">
              {FOOTER_NAVIGATION.resources.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-foreground transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Column */}
          <div className="space-y-3">
            <p className="font-semibold text-foreground tracking-tight">Legal & Trust</p>
            <ul className="space-y-2 text-muted-foreground">
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
          <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
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
