"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Package,
  Store,
  Coins,
  Gift,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    name: "Overview",
    href: "/dashboard/creator",
    icon: LayoutGrid,
  },
  {
    name: "Creations",
    href: "/dashboard/creator/products",
    icon: Package,
  },
  {
    name: "Store Branding",
    href: "/dashboard/creator/store",
    icon: Store,
  },
  {
    name: "Bank & Payouts",
    href: "/dashboard/creator/payouts",
    icon: Coins,
  },
  {
    name: "Coupons",
    href: "/dashboard/creator/coupons",
    icon: Gift,
  },
  {
    name: "Sales Ledger",
    href: "/dashboard/creator/ledger",
    icon: Activity,
  },
];

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible scrollbar-none py-1 md:py-0 w-full">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 text-[10px] md:text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-200 border-2 border-transparent w-full whitespace-nowrap",
              isActive
                ? "bg-primary/15 text-primary border-primary/30 shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
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
