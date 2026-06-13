import Link from "next/link";
import { Suspense } from "react";
import AuthButtons from "./AuthButtons";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-900 bg-neutral-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            ScriptlyHQ
          </span>
        </Link>

        <nav className="flex items-center space-x-4">
          <Link
            href="/"
            className="text-sm font-medium text-neutral-400 hover:text-neutral-200 transition-colors mr-4 hidden sm:inline-block"
          >
            Browse Products
          </Link>
          <Suspense fallback={
            <div className="flex items-center space-x-2 animate-pulse">
              <div className="w-16 h-8 bg-neutral-900 rounded" />
              <div className="w-24 h-8 bg-neutral-900 rounded" />
            </div>
          }>
            <AuthButtons />
          </Suspense>
        </nav>
      </div>
    </header>
  );
}
