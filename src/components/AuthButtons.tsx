"use client";

import { useUser, UserButton } from "@hexclave/next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

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
    <div className="flex items-center space-x-4">
      {isAdmin && (
        <Link
          href="/admin"
          className="hidden md:inline-flex text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
        >
          Admin
        </Link>
      )}
      <Link
        href="/dashboard/creator"
        className="hidden md:inline-flex text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
      >
        Creator Console
      </Link>
      <Link
        href="/dashboard"
        className="hidden md:inline-flex text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
      >
        Dashboard
      </Link>
      <div className="flex items-center border-l border-border pl-4 h-5">
        <UserButton />
      </div>
    </div>
  );
}
