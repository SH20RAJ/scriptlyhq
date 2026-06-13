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
      <div className="flex items-center space-x-4">
        <Link
          href="/handler/sign-in"
          className="text-sm text-neutral-400 hover:text-white transition-colors"
        >
          Sign In
        </Link>
        <Link
          href="/handler/sign-up"
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-black bg-white hover:bg-neutral-200 rounded-lg transition-colors"
        >
          Get Started
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-6">
      {isAdmin && (
        <Link
          href="/admin"
          className="text-sm text-neutral-400 hover:text-white transition-colors"
        >
          Admin
        </Link>
      )}
      <Link
        href="/dashboard"
        className="text-sm text-neutral-400 hover:text-white transition-colors"
      >
        Downloads
      </Link>
      <div className="flex items-center border-l border-neutral-800 pl-6 h-4">
        <UserButton />
      </div>
    </div>
  );
}
