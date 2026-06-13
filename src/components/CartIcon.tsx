"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "./CartContext";
import { useEffect, useState } from "react";

export default function CartIcon() {
  const { cartCount } = useCart();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="p-2 text-muted-foreground relative">
        <ShoppingCart className="w-5 h-5" />
      </div>
    );
  }

  return (
    <Link
      href="/cart"
      className="relative p-2 text-muted-foreground hover:text-foreground transition-colors flex items-center"
      id="cart-nav-button"
    >
      <ShoppingCart className="w-5 h-5" />
      {cartCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-emerald-500 text-neutral-950 font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300">
          {cartCount}
        </span>
      )}
    </Link>
  );
}
