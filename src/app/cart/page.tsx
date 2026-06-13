import { Metadata } from "next";
import CartClient from "../../components/CartClient";

export const metadata: Metadata = {
  title: "Shopping Cart | ScriptlyStore",
  description: "Review your selected digital assets and checkout securely.",
};

export default function CartPage() {
  return (
    <div className="container max-w-7xl mx-auto px-4 py-12 md:py-20" id="cart-page-root">
      <div className="flex flex-col gap-2 border-b border-border/60 pb-8 mb-12">
        <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-foreground">Shopping Cart</h1>
        <p className="text-sm text-muted-foreground font-medium">Review your items and complete checkout.</p>
      </div>

      <CartClient />
    </div>
  );
}
export const dynamic = "force-dynamic";
