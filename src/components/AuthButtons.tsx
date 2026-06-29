"use client";

import { useUser, UserButton } from "@hexclave/next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, LayoutDashboard, Shield, Store } from "lucide-react";

export default function AuthButtons() {
  const user = useUser();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      fetch("/api/auth/role")
        .then((res) => res.json())
        .then((data: any) => {
          setIsAdmin(data.role === "admin");
        })
        .catch(() => setIsAdmin(false));
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex items-center space-x-2">
        <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex px-3">
          <Link href="/handler/sign-in">Sign In</Link>
        </Button>
        <Button asChild size="sm" className="px-4 font-semibold tracking-tight">
          <Link href="/handler/sign-up">Sign Up</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-9 px-4 rounded-xl font-black uppercase tracking-wider text-[10px] flex items-center gap-1.5 bg-muted/30 border-white/5 hover:bg-muted text-foreground cursor-pointer transition-all duration-200">
            Console
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 p-1.5 rounded-2xl border border-border/40 bg-background/95 backdrop-blur-2xl shadow-xl z-[100] space-y-0.5">
          <DropdownMenuItem asChild className="rounded-xl px-3 py-2 text-xs font-bold hover:bg-muted hover:text-foreground text-foreground cursor-pointer flex items-center gap-2">
            <Link href="/dashboard">
              <LayoutDashboard className="w-4 h-4 text-blue-400" />
              Customer Area
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="rounded-xl px-3 py-2 text-xs font-bold hover:bg-muted hover:text-foreground text-foreground cursor-pointer flex items-center gap-2">
            <Link href="/creator">
              <Store className="w-4 h-4 text-purple-400" />
              Creator Console
            </Link>
          </DropdownMenuItem>
          {isAdmin && (
            <DropdownMenuItem asChild className="rounded-xl px-3 py-2 text-xs font-bold hover:bg-muted hover:text-foreground text-foreground cursor-pointer flex items-center gap-2">
              <Link href="/admin">
                <Shield className="w-4 h-4 text-rose-400" />
                Admin Console
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex items-center border-l border-border/40 pl-3 h-5">
        <UserButton />
      </div>
    </div>
  );
}

