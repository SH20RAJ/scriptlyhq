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
      // Check if user is admin by fetching role via server action
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
        <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
          <Link href="/handler/sign-in">Sign In</Link>
        </Button>
        <Button asChild size="sm">
          <Link href="/handler/sign-up">Get Started</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      {isAdmin && (
        <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
          <Link href="/admin">Admin</Link>
        </Button>
      )}
      <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
        <Link href="/dashboard">Downloads</Link>
      </Button>
      <div className="flex items-center border-l border-border pl-4 h-4">
        <UserButton />
      </div>
    </div>
  );
}
