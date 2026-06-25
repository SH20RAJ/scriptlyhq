"use client";

import Link from "next/link";
import { Suspense } from "react";
import AuthButtons from "@/components/AuthButtons";
import CartIcon from "@/components/CartIcon";
import { ThemeToggle } from "@/components/ThemeToggle";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Terminal, Compass, BookOpen, Tag, ChevronRight } from "lucide-react";

const NAV_LINKS = [
  { href: "/blog", label: "Blog Home", desc: "Read developer tutorials", icon: BookOpen },
  { href: "/", label: "Marketplace", desc: "Back to coding catalog", icon: Terminal },
  { href: "/explore", label: "Explore", desc: "Discover premium templates", icon: Compass },
  { href: "/offers", label: "Deals", desc: "Special pricing campaigns", icon: Tag, badge: "Sale" },
];

export default function BlogNavbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full select-none">
      {/* Dynamic Glow Line in Blog Accent Color (Macaw Blue) */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#1CB0F6]/50 to-transparent opacity-50" />
      
      <div className="bg-background/70 backdrop-blur-xl border-b border-white/5 saturate-150">
        <div className="container flex h-16 max-w-7xl mx-auto items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <Link href="/blog" className="group flex items-center space-x-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#1CB0F6] to-[#CE82FF] text-white shadow-[0_0_15px_rgba(28,176,246,0.3)] group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="font-sans font-black text-xl tracking-tight text-foreground transition-all duration-300">
                scriptly<span className="text-[#1CB0F6]">blog</span>
              </span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "relative px-4 py-2 text-[11px] font-black uppercase tracking-wider transition-all duration-200 rounded-xl flex items-center gap-1.5 border border-transparent",
                      isActive 
                        ? "text-[#1CB0F6] bg-[#1CB0F6]/10 border-[#1CB0F6]/10" 
                        : "text-muted-foreground hover:text-foreground hover:bg-neutral-800/40"
                    )}
                  >
                    <Icon className={cn("w-3.5 h-3.5", isActive ? "text-[#1CB0F6]" : "text-muted-foreground")} />
                    {link.label}
                    {link.badge && (
                      <span className="absolute -top-1 -right-1.5 flex h-3.5 px-1 items-center justify-center bg-amber-500 text-[8px] text-white font-extrabold uppercase rounded-full animate-pulse border border-background">
                        {link.badge}
                      </span>
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
            
            <div className="hidden sm:block">
              <Suspense fallback={
                <div className="flex items-center space-x-2 animate-pulse">
                  <div className="w-16 h-8 bg-muted rounded-2xl" />
                  <div className="w-24 h-8 bg-muted rounded-2xl" />
                </div>
              }>
                <AuthButtons />
              </Suspense>
            </div>

            {/* Mobile Sheet Trigger */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground h-9 w-9 rounded-xl border border-white/5 bg-muted/30">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:max-w-sm bg-background/95 backdrop-blur-2xl border-l border-white/5 p-6 flex flex-col justify-between">
                  <div className="space-y-8">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-border/40 pb-4">
                      <div className="flex items-center space-x-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-[#1CB0F6] to-[#CE82FF] text-white">
                          <BookOpen className="w-4.5 h-4.5" />
                        </div>
                        <span className="font-sans font-black text-lg tracking-tight text-foreground">
                          scriptly<span className="text-[#1CB0F6]">blog</span>
                        </span>
                      </div>
                    </div>

                    {/* Links */}
                    <nav className="flex flex-col gap-3">
                      {NAV_LINKS.map((link) => {
                        const isActive = pathname === link.href;
                        const Icon = link.icon;
                        return (
                          <SheetClose asChild key={link.href}>
                            <Link
                              href={link.href}
                              className={cn(
                                "flex items-center justify-between p-4.5 rounded-2xl transition-all duration-200 border",
                                isActive
                                  ? "bg-[#1CB0F6]/10 border-[#1CB0F6]/20 text-[#1CB0F6]"
                                  : "bg-muted/30 hover:bg-muted/50 border-white/5 text-muted-foreground hover:text-foreground"
                              )}
                            >
                              <div className="flex items-center gap-3">
                                <div className={cn(
                                  "p-2 rounded-xl border",
                                  isActive ? "bg-[#1CB0F6]/25 border-[#1CB0F6]/20" : "bg-card border-white/5"
                                )}>
                                  <Icon className="w-4 h-4" />
                                </div>
                                <div className="text-left">
                                  <div className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-1.5">
                                    {link.label}
                                    {link.badge && (
                                      <span className="px-1.5 py-0.5 bg-amber-500 text-[8px] text-white font-extrabold uppercase rounded-full">
                                        {link.badge}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[10px] text-muted-foreground mt-0.5">{link.desc}</div>
                                </div>
                              </div>
                              <ChevronRight className="w-4 h-4 opacity-60" />
                            </Link>
                          </SheetClose>
                        );
                      })}
                    </nav>
                  </div>

                  {/* Footer (Auth and Actions) */}
                  <div className="space-y-4 border-t border-border/40 pt-6">
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/40 border border-white/5">
                      <span className="text-xs font-bold text-muted-foreground">App Preferences</span>
                      <div className="flex items-center gap-2">
                        <ThemeToggle />
                      </div>
                    </div>
                    <div className="w-full">
                      <Suspense fallback={<div className="h-10 bg-muted rounded-2xl animate-pulse" />}>
                        <div className="flex flex-col gap-2 w-full [&>*]:w-full">
                          <AuthButtons />
                        </div>
                      </Suspense>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
