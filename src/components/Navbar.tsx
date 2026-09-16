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
import { Menu, Terminal, Search, ShoppingBag } from "lucide-react";
import { MAIN_NAVIGATION } from "@/config/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/85 backdrop-blur-md transition-colors">
      <div className="container mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand & Left Navigation */}
        <div className="flex items-center gap-6 md:gap-8">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight text-foreground transition-opacity hover:opacity-90">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-foreground text-background">
              <Terminal className="h-4 w-4" />
            </div>
            <span className="text-base font-semibold">
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
                    "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                    isActive
                      ? "bg-secondary text-foreground font-semibold"
                      : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
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
          <Link
            href="/search"
            aria-label="Search products"
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Search className="h-4 w-4" />
          </Link>

          <div className="h-4 w-px bg-border/80" />

          <ThemeToggle />

          <CartIcon />

          <div className="hidden sm:block">
            <Suspense fallback={<div className="h-8 w-16 animate-pulse rounded-md bg-muted" />}>
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
                  <div className="flex items-center gap-2 border-b border-border pb-4">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-foreground text-background">
                      <Terminal className="h-4 w-4" />
                    </div>
                    <span className="font-semibold text-sm">ScriptlyStore</span>
                  </div>

                  <nav className="flex flex-col space-y-1">
                    {MAIN_NAVIGATION.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <SheetClose asChild key={item.href}>
                          <Link
                            href={item.href}
                            className={cn(
                              "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                              isActive
                                ? "bg-secondary text-foreground font-semibold"
                                : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                            )}
                          >
                            {item.label}
                          </Link>
                        </SheetClose>
                      );
                    })}
                  </nav>
                </div>

                <div className="border-t border-border pt-4">
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
