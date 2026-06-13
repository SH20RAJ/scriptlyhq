import Link from "next/link";
import { Suspense } from "react";
import AuthButtons from "./AuthButtons";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-900 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-lg font-semibold tracking-tight text-white">
            ScriptlyHQ
          </span>
        </Link>

        <nav className="flex items-center space-x-6">
          <Link
            href="/"
            className="text-sm text-neutral-400 hover:text-white transition-colors hidden sm:inline-block"
          >
            Browse
          </Link>
          <Suspense fallback={
            <div className="flex items-center space-x-2 animate-pulse">
              <div className="w-16 h-8 bg-neutral-900 rounded-md" />
              <div className="w-24 h-8 bg-neutral-900 rounded-md" />
            </div>
          }>
            <AuthButtons />
          </Suspense>
        </nav>
      </div>
    </header>
  );
}
