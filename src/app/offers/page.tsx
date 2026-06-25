import { db } from "@/db";
import { coupons } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Percent, Gift, ArrowRight } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Exclusive Deals, Offers & Coupons",
  description: "Redeem active coupon codes and flat discounts on premium SaaS templates, browser extensions, automation scripts, and digital tools.",
  alternates: {
    canonical: "https://scriptly.store/offers",
  },
};

export const dynamic = "force-dynamic";

export default async function OffersPage() {
  // Fetch active coupons from the database
  const activeCoupons = await db.query.coupons.findMany({
    where: eq(coupons.active, true),
  });

  return (
    <div className="container max-w-7xl mx-auto px-4 py-16 md:py-24 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <Badge variant="outline" className="rounded-full px-3 py-1 text-[10px] uppercase font-black tracking-[0.2em] border-emerald-500/20 text-emerald-500 bg-emerald-500/5">
          Exclusive Deals
        </Badge>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground sm:leading-[1.1]">
          Marketplace Offers <br />
          <span className="text-muted-foreground">& Discounts.</span>
        </h1>
        <p className="text-base text-muted-foreground font-medium max-w-md mx-auto leading-relaxed">
          Grab high-quality templates, kits, and ebooks for a fraction of the cost with our active campaigns.
        </p>
      </div>

      {/* Offers Grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Auto Offer Card */}
        <Card className="border-emerald-500/20 bg-emerald-500/5 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl shadow-emerald-500/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[50px] rounded-full pointer-events-none" />
          <div className="space-y-6 relative z-10">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <Badge className="bg-emerald-500 text-neutral-950 font-black text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full">
                Auto Applied
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground leading-tight">
                Get 20% Off Your Purchase
              </h2>
              <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                Add premium boilerplates, kits, or prompts to your cart. Once your subtotal exceeds **$60.00**, a **20% flat discount** will be automatically applied at checkout.
              </p>
            </div>
          </div>
          <div className="pt-8 border-t border-border/40 mt-8 flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Min. Cart: $60.00</span>
            <Button asChild className="rounded-xl h-10 px-6 font-bold uppercase tracking-wider text-[10px] cursor-pointer">
              <Link href="/">
                Shop Now
                <ArrowRight className="w-3.5 h-3.5 ml-2" />
              </Link>
            </Button>
          </div>
        </Card>

        {/* Dynamic Coupon Offer Cards */}
        {activeCoupons.length > 0 ? (
          activeCoupons.map((coupon) => (
            <Card key={coupon.id} className="border-border/50 bg-card/40 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-md relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[50px] rounded-full pointer-events-none" />
              <div className="space-y-6 relative z-10">
                <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center text-foreground/80">
                  {coupon.discountType === "percentage" ? (
                    <Percent className="w-5 h-5" />
                  ) : (
                    <Gift className="w-5 h-5" />
                  )}
                </div>
                <div className="space-y-2">
                  <Badge variant="secondary" className="font-bold text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full">
                    Coupon Code
                  </Badge>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground leading-tight">
                    {coupon.discountType === "percentage" 
                      ? `Get ${coupon.discountValue}% Discount` 
                      : `Get $${(coupon.discountValue / 100).toFixed(2)} Off`}
                  </h2>
                  <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                    Use the coupon code <strong className="text-foreground tracking-wider font-bold">"{coupon.code}"</strong> in your cart page to redeem this exclusive discount. 
                    {coupon.minPurchaseAmount > 0 && ` Applicable for purchases over $${(coupon.minPurchaseAmount / 100).toFixed(2)}.`}
                  </p>
                </div>
              </div>
              <div className="pt-8 border-t border-border/40 mt-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Code to copy:</span>
                  <span className="text-base font-black text-foreground tracking-wider uppercase">{coupon.code}</span>
                </div>
                <Button asChild variant="outline" className="rounded-xl h-10 px-6 font-bold uppercase tracking-wider text-[10px] cursor-pointer w-full sm:w-auto">
                  <Link href="/">
                    Copy & Shop
                  </Link>
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <Card className="border-border/50 bg-card/40 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-md relative overflow-hidden group">
            <div className="space-y-6">
              <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center text-muted-foreground">
                <Gift className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <Badge variant="outline" className="font-bold text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full">
                  Upcoming Promo
                </Badge>
                <h2 className="text-2xl font-black tracking-tight text-foreground">
                  Stay Tuned!
                </h2>
                <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                  We launch custom coupon codes during holiday drops and builder spotlights. Check back soon for coupon code promotions.
                </p>
              </div>
            </div>
            <div className="pt-8 border-t border-border/40 mt-8 flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Stay Updated</span>
              <Button asChild variant="ghost" className="rounded-xl h-10 px-4 font-bold uppercase tracking-wider text-[10px] cursor-pointer">
                <Link href="/">
                  Back to Catalog
                </Link>
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
