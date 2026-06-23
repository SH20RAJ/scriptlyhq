"use client";

import Link from "next/link";
import { Suspense } from "react";
import AuthButtons from "./AuthButtons";
import CartIcon from "./CartIcon";
import { ThemeToggle } from "./ThemeToggle";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/blog", label: "Blog Home" },
  { href: "/", label: "Marketplace" },
  { href: "/explore", label: "Explore" },
  { href: "/offers", label: "Deals" },
];

export default function BlogNavbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Dynamic Glow Line in Blog Accent Color (Macaw Blue) */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#1CB0F6]/50 to-transparent opacity-50" />
      
      <div className="bg-background/80 backdrop-blur-xl border-b border-white/5">
        <div className="container flex h-16 max-w-7xl mx-auto items-center justify-between px-4">
          <div className="flex items-center gap-10">
            <Link href="/blog" className="group flex items-center space-x-2">
              <span className="font-sans font-black text-2xl tracking-tighter text-foreground transition-all duration-300 group-hover:tracking-normal">
                scriptly<span className="text-[#1CB0F6]">blog</span>
              </span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "relative px-4 py-2 text-[11px] font-black uppercase tracking-widest transition-colors duration-200",
                      isActive ? "text-[#1CB0F6]" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="blog-nav-underline"
                        className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#1CB0F6] shadow-[0_0_8px_rgba(28,176,246,0.6)]"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center justify-end space-x-2">
            <div className="flex items-center p-1.5 bg-muted/40 border border-white/5 rounded-2xl">
              <ThemeToggle />
              <div className="w-px h-4 bg-border/40 mx-2" />
              <CartIcon />
            </div>
            
            <Suspense fallback={
              <div className="flex items-center space-x-2 animate-pulse">
                <div className="w-16 h-8 bg-muted rounded-2xl" />
                <div className="w-24 h-8 bg-muted rounded-2xl" />
              </div>
            }>
              <AuthButtons />
            </Suspense>
          </div>
        </div>
      </div>
    </header>
  );
}
