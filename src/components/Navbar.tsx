import Link from "next/link";
import { Suspense } from "react";
import AuthButtons from "./AuthButtons";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-lg font-semibold tracking-tight text-foreground">
            ScriptlyHQ
          </span>
        </Link>

        <nav className="flex items-center space-x-4">
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex text-muted-foreground hover:text-foreground">
            <Link href="/">Browse</Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex text-muted-foreground hover:text-foreground">
            <Link href="/search">Search</Link>
          </Button>
          <Suspense fallback={
            <div className="flex items-center space-x-2 animate-pulse">
              <div className="w-16 h-8 bg-muted rounded-md" />
              <div className="w-24 h-8 bg-muted rounded-md" />
            </div>
          }>
            <AuthButtons />
          </Suspense>
        </nav>
      </div>
    </header>
  );
}
