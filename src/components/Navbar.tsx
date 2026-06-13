import Link from "next/link";
import { Suspense } from "react";
import AuthButtons from "./AuthButtons";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-7xl mx-auto items-center justify-between px-4">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold sm:text-xl tracking-tighter">
              ScriptHQ
            </span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Browse
            </Link>
            <Link
              href="/search"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Search
            </Link>
          </nav>
        </div>

        <div className="flex items-center justify-end space-x-4">
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
