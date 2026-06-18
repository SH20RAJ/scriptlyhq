import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Creator Console",
  description: "Manage your ScriptlyStore creator storefront, products, coupons, and payouts.",
};

import Link from "next/link";
import { getOrCreateDbUser } from "@/lib/auth-utils";
import {
  LayoutGrid,
  Package,
  Store,
  Coins,
  Gift,
  Activity,
  ArrowLeft,
} from "lucide-react";
import SidebarNav from "@/components/SidebarNav";

export default async function CreatorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getOrCreateDbUser();
  if (!user) {
    redirect("/handler/sign-in?redirectTo=/dashboard/creator");
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full px-4 py-8 md:py-12 gap-8">
        
        {/* Left Navigation Sidebar */}
        <aside className="w-full md:w-64 shrink-0 flex flex-col gap-4">
          <div className="p-5 border-2 border-border bg-card rounded-2xl shadow-sm space-y-3">
            <div className="space-y-1">
              <h2 className="text-sm font-black uppercase tracking-wider text-foreground">Creator console</h2>
              <p className="text-[10px] text-muted-foreground font-semibold leading-relaxed">
                Storefront: <span className="text-primary font-bold">{user.storeName || "Unnamed Store"}</span>
              </p>
            </div>
            <Link
              href={`/stores/${user.id}`}
              target="_blank"
              className="flex items-center justify-center gap-1.5 w-full py-2 bg-[#1CB0F6] hover:bg-[#1CB0F6]/90 text-white rounded-xl text-[10px] font-black uppercase tracking-wider shadow-[0_3px_0_#1899D6] active:translate-y-px active:shadow-none transition-all duration-150"
            >
              View Public Store
            </Link>
          </div>

          {/* Interactive Navigation Client Component */}
          <div className="border-2 border-border bg-card rounded-2xl p-4 shadow-sm">
            <SidebarNav />
          </div>

          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-border bg-card text-xs font-bold uppercase tracking-wider text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Customer Dashboard
          </Link>
        </aside>

        {/* Main Panel Content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
