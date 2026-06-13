"use client";

import { useUser, UserButton } from "@hexclave/next";
import Link from "next/link";
import { useEffect, useState } from "react";

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
      <div className="flex items-center space-x-3">
        <Link
          href="/handler/sign-in"
          className="text-sm font-medium text-neutral-300 hover:text-white transition-colors"
        >
          Sign In
        </Link>
        <Link
          href="/handler/sign-up"
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-black bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 rounded-md transition-all duration-200 shadow-md shadow-emerald-500/10 active:scale-95"
        >
          Get Started
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      {isAdmin && (
        <Link
          href="/admin"
          className="text-sm font-medium text-amber-400 hover:text-amber-300 hover:underline transition-all"
        >
          Admin Panel
        </Link>
      )}
      <Link
        href="/dashboard"
        className="text-sm font-medium text-neutral-300 hover:text-white transition-colors"
      >
        My Downloads
      </Link>
      <div className="flex items-center border-l border-neutral-800 pl-4 h-6">
        <UserButton />
      </div>
    </div>
  );
}
