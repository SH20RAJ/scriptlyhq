import Link from "next/link";
import { Suspense } from "react";
import AuthButtons from "./AuthButtons";
import CartIcon from "./CartIcon";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-7xl mx-auto items-center justify-between px-4">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-sans font-black text-xl tracking-tight text-foreground">
              scriptly<span className="text-[#58CC02]">store</span>
            </span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/explore"
              className="flex items-center text-sm font-bold text-muted-foreground transition-colors hover:text-foreground"
            >
              Explore
            </Link>
            <Link
              href="/search"
              className="flex items-center text-sm font-bold text-muted-foreground transition-colors hover:text-foreground"
            >
              Search
            </Link>
            <Link
              href="/blog"
              className="flex items-center text-sm font-bold text-muted-foreground transition-colors hover:text-foreground"
            >
              Blog
            </Link>
            <Link
              href="/offers"
              className="flex items-center text-sm font-bold text-muted-foreground transition-colors hover:text-foreground"
            >
              Offers
            </Link>
          </nav>
        </div>

        <div className="flex items-center justify-end space-x-3">
          <ThemeToggle />
          <CartIcon />
          <Suspense fallback={
            <div className="flex items-center space-x-2 animate-pulse">
              <div className="w-16 h-8 bg-muted rounded-md" />
              <div className="w-24 h-8 bg-muted rounded-md" />
            </div>
          }>
            <AuthButtons />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
