"use client";

import Link from "next/link";
import { Suspense, useEffect } from "react";
import AuthButtons from "@/components/AuthButtons";
import CartIcon from "@/components/CartIcon";
import { ThemeToggle } from "@/components/ThemeToggle";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Terminal, Search } from "lucide-react";
import { MAIN_NAVIGATION } from "@/config/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        router.push("/search");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-md transition-colors">
      <div className="container mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand & Desktop Navigation */}
        <div className="flex items-center gap-6 md:gap-8">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight text-foreground transition-opacity hover:opacity-90">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-foreground text-background">
              <Terminal className="h-4 w-4" />
            </div>
            <span className="text-base font-bold tracking-tight">
              scriptly<span className="text-primary font-mono text-sm">.store</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {MAIN_NAVIGATION.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
                    isActive
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Utilities & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Compact ⌘K Search Trigger */}
          <Link
            href="/search"
            aria-label="Search products"
            className="hidden sm:flex items-center gap-2 h-8 px-2.5 rounded-xl border border-border/70 bg-secondary/30 text-muted-foreground hover:text-foreground hover:bg-secondary/60 hover:border-border transition-all text-xs group"
          >
            <Search className="h-3.5 w-3.5 group-hover:text-primary transition-colors" />
            <span className="text-[11px] font-medium">Search products...</span>
            <kbd className="pointer-events-none inline-flex h-4 select-none items-center gap-0.5 rounded border border-border/80 bg-background px-1.5 font-mono text-[9px] font-semibold text-muted-foreground">
              ⌘K
            </kbd>
          </Link>

          {/* Mobile Search Icon */}
          <Link
            href="/search"
            aria-label="Search products"
            className="flex sm:hidden h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Search className="h-4 w-4" />
          </Link>

          <div className="h-4 w-px bg-border/60" />

          <ThemeToggle />

          <CartIcon />

          <div className="hidden sm:block">
            <Suspense fallback={<div className="h-8 w-16 animate-pulse rounded-lg bg-muted" />}>
              <AuthButtons />
            </Suspense>
          </div>

          {/* Mobile Navigation Drawer */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 p-6 flex flex-col justify-between">
                <div className="space-y-6">
                  <div className="flex items-center gap-2 border-b border-border/60 pb-4">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-foreground text-background">
                      <Terminal className="h-4 w-4" />
                    </div>
                    <span className="font-bold text-sm">ScriptlyStore</span>
                  </div>

                  <nav className="flex flex-col space-y-1">
                    {MAIN_NAVIGATION.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <SheetClose asChild key={item.href}>
                          <Link
                            href={item.href}
                            className={cn(
                              "rounded-xl px-3 py-2 text-sm font-semibold transition-colors",
                              isActive
                                ? "bg-secondary text-foreground"
                                : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                            )}
                          >
                            {item.label}
                          </Link>
                        </SheetClose>
                      );
                    })}
                  </nav>
                </div>

                <div className="border-t border-border/60 pt-4">
                  <Suspense fallback={null}>
                    <AuthButtons />
                  </Suspense>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
