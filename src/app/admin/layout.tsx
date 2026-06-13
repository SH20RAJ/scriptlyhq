import { isAdmin } from "../../lib/auth-utils";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, ShoppingCart, Package, Home, ShieldAlert } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authorized = await isAdmin();

  if (!authorized) {
    // Redirect unauthorized users to home page
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-neutral-950 text-neutral-100">
      
      {/* Admin Sidebar */}
      <aside className="w-64 border-r border-neutral-900 bg-neutral-900/10 flex flex-col justify-between flex-shrink-0">
        <div className="p-6 space-y-8">
          <div className="flex items-center space-x-2 text-amber-500 font-bold tracking-wider uppercase text-sm">
            <ShieldAlert className="w-5 h-5" />
            <span>Admin Portal</span>
          </div>

          <nav className="space-y-1">
            <Link
              href="/admin"
              className="flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-900 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview</span>
            </Link>
            <Link
              href="/admin/products"
              className="flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-900 transition-colors"
            >
              <Package className="w-4 h-4" />
              <span>Products</span>
            </Link>
            <Link
              href="/admin/orders"
              className="flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-900 transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Orders</span>
            </Link>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-neutral-900">
          <Link
            href="/"
            className="flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg text-neutral-400 hover:text-white transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>View Marketplace</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-10 bg-neutral-950">
        {children}
      </main>
    </div>
  );
}
