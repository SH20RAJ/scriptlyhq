import { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getOrCreateDbUser } from "@/lib/auth-utils";
import { ArrowLeft, ExternalLink } from "lucide-react";
import SidebarNav from "@/components/SidebarNav";

export const metadata: Metadata = {
  title: "Creator Console | ScriptlyStore",
  description: "Manage your ScriptlyStore creator storefront, products, coupons, and payouts.",
};

export default async function CreatorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getOrCreateDbUser();
  if (!user) {
    redirect("/handler/sign-in?redirectTo=/creator/dashboard");
  }

  const storeInitials = (user.storeName || user.name || "My Store")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 md:py-10 gap-8">
        {/* Unified Sleek Minimal Sidebar */}
        <aside className="w-full md:w-60 shrink-0 flex flex-col">
          <div className="p-4 rounded-3xl bg-card/40 border border-border/50 backdrop-blur-xl shadow-sm flex flex-col gap-4">
            {/* Store Identity */}
            <div className="flex items-center gap-3 px-1 pt-1">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-primary/15 to-[#1CB0F6]/15 border border-primary/25 flex items-center justify-center text-primary font-black text-xs shrink-0">
                {storeInitials}
              </div>
              <div className="space-y-0.5 min-w-0 flex-1">
                <h2 className="text-xs font-black text-foreground truncate">
                  {user.storeName || "Creator Store"}
                </h2>
                <p className="text-[10px] text-muted-foreground font-semibold truncate">
                  {user.email}
                </p>
              </div>
            </div>

            <Link
              href={`/stores/${user.id}`}
              target="_blank"
              className="flex items-center justify-center gap-1.5 w-full py-2 bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground rounded-xl text-[10px] font-black uppercase tracking-wider transition-all"
            >
              <span>View Storefront</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <div className="h-px bg-border/40" />

            {/* Navigation Links */}
            <SidebarNav />

            <div className="h-px bg-border/40" />

            {/* Customer Area Return */}
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Customer Area</span>
            </Link>
          </div>
        </aside>

        {/* Main Panel Content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
