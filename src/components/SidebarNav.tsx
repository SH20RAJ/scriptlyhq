"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Package, Store, Coins, Gift, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    name: "Overview",
    href: "/creator/dashboard",
    icon: LayoutGrid,
  },
  {
    name: "Creations",
    href: "/creator/products",
    icon: Package,
  },
  {
    name: "Store Branding",
    href: "/creator/store",
    icon: Store,
  },
  {
    name: "Bank & Payouts",
    href: "/creator/payouts",
    icon: Coins,
  },
  {
    name: "Coupons",
    href: "/creator/coupons",
    icon: Gift,
  },
  {
    name: "Sales Ledger",
    href: "/creator/ledger",
    icon: Activity,
  },
];

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible scrollbar-none py-1 md:py-0 w-full">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || (item.href === "/creator/dashboard" && pathname === "/creator");

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap",
              isActive
                ? "bg-primary/10 text-primary font-black"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            )}
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
