"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Home, Compass, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CyberBackground } from "@/components/ui/CyberBackground";

export default function NotFound() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-6 py-12 md:py-24 overflow-hidden bg-background">
      {/* Cool animated background mesh lights and grids */}
      <CyberBackground />

      <div className="max-w-xl w-full text-center relative z-10 space-y-8">
        {/* Floating Animated Header Illustration */}
        <div className="relative flex justify-center mb-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            {/* Pulsing light behind 404 */}
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-75 animate-pulse" />
            
            {/* Playful 404 text with 3D shadow */}
            <motion.h1
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="text-8xl md:text-9xl font-black tracking-tight text-foreground select-none relative z-10 drop-shadow-[0_8px_0_var(--border)] dark:drop-shadow-[0_8px_0_#2A3842]"
            >
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">4</span>
              <span className="text-[#FFC800] dark:text-[#FFC800]">0</span>
              <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">4</span>
            </motion.h1>
          </motion.div>

          {/* Floating warning icon */}
          <motion.div
            initial={{ rotate: -20, scale: 0 }}
            animate={{ rotate: 12, scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
            className="absolute -top-4 right-1/4 bg-destructive text-destructive-foreground p-3 rounded-2xl shadow-[0_4px_0_#E53535] border-2 border-border"
          >
            <AlertCircle className="size-6 md:size-8" />
          </motion.div>
        </div>

        {/* Text Details */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
            Lost in Code Space?
          </h2>
          <p className="text-muted-foreground text-sm md:text-base font-medium max-w-md mx-auto">
            The page you are looking for doesn't exist, was moved, or has run out of parameters. Let's get you back on track!
          </p>
        </motion.div>

        {/* Dynamic Search Box */}
        <motion.form
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          onSubmit={handleSearch}
          className="relative max-w-md mx-auto w-full group"
        >
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search for templates, scripts, design kits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-28 py-3 text-sm font-medium rounded-2xl border-2 border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none transition-all shadow-[0_4px_0_var(--border)] dark:shadow-[0_4px_0_#2A3842] focus:translate-y-[2px] focus:shadow-[0_2px_0_var(--border)]"
            />
            <Search className="absolute left-4 size-5 text-muted-foreground group-focus-within:text-accent transition-colors" />
            <button
              type="submit"
              className="absolute right-2 px-4 py-1.5 text-xs font-extrabold uppercase bg-accent text-white rounded-xl shadow-[0_3px_0_#1899D6] hover:brightness-105 active:translate-y-[2px] active:shadow-none transition-all"
            >
              Search
            </button>
          </div>
        </motion.form>

        {/* Playful Interactive Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 items-center justify-center max-w-md mx-auto pt-4"
        >
          <Button asChild size="lg" className="w-full sm:w-auto font-black">
            <Link href="/" className="flex items-center justify-center gap-2">
              <Home className="size-5" />
              Go Back Home
            </Link>
          </Button>

          <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto font-black">
            <Link href="/explore" className="flex items-center justify-center gap-2">
              <Compass className="size-5" />
              Explore Library
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
