"use client";

import { useState } from "react";
import { DollarSign, TrendingUp, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CreatorEarningsCalculator() {
  const [price, setPrice] = useState<number>(1999);
  const [sales, setSales] = useState<number>(35);

  const grossMonthly = price * sales;
  const scriptlyTakeHome = Math.round(grossMonthly * 0.95);
  const competitor50 = Math.round(grossMonthly * 0.50);
  const competitor70 = Math.round(grossMonthly * 0.70);
  const extraVs50 = scriptlyTakeHome - competitor50;
  const extraVs70 = scriptlyTakeHome - competitor70;

  const formatINR = (val: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <section id="calculator" className="py-16 md:py-24 border-b border-border/40 scroll-mt-12">
      <div className="max-w-6xl mx-auto px-4 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-black uppercase tracking-wider">
            <DollarSign className="w-3.5 h-3.5" /> Creator Economics
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            Calculate your monthly earnings
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Adjust the price and monthly sales below to see how much more you take home on Scriptly compared to legacy marketplaces.
          </p>
        </div>

        <div className="max-w-4xl mx-auto rounded-3xl border border-border/60 bg-card/40 backdrop-blur-2xl p-6 sm:p-10 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Sliders Area */}
          <div className="lg:col-span-7 space-y-8">
            {/* Slider 1: Product Price */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                  Product Price
                </label>
                <span className="text-xl font-black text-foreground font-mono">
                  {formatINR(price)}
                </span>
              </div>
              <input
                type="range"
                min="499"
                max="9999"
                step="100"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full h-2.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                <span>₹499 (Micro Script)</span>
                <span>₹4,999 (SaaS Starter)</span>
                <span>₹9,999 (Full System)</span>
              </div>
            </div>

            {/* Slider 2: Monthly Sales */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                  Estimated Monthly Sales
                </label>
                <span className="text-xl font-black text-foreground font-mono">
                  {sales} <span className="text-xs font-normal text-muted-foreground">orders/mo</span>
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="250"
                step="1"
                value={sales}
                onChange={(e) => setSales(Number(e.target.value))}
                className="w-full h-2.5 bg-muted rounded-lg appearance-none cursor-pointer accent-[#1CB0F6]"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                <span>5 /mo (Side project)</span>
                <span>50 /mo (Consistent tool)</span>
                <span>250 /mo (Viral boilerplate)</span>
              </div>
            </div>

            {/* Comparison Bars */}
            <div className="pt-2 space-y-3">
              <p className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">
                Monthly Payout Comparison
              </p>

              <div className="space-y-2 text-xs">
                {/* Scriptly */}
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                  <span className="font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Scriptly (95% Payout)
                  </span>
                  <span className="font-black text-foreground text-sm font-mono">
                    {formatINR(scriptlyTakeHome)}
                  </span>
                </div>

                {/* Gumroad / Lemon Squeezy typical */}
                <div className="p-3 rounded-xl bg-muted/30 border border-border/40 flex items-center justify-between opacity-80">
                  <span className="font-semibold text-muted-foreground">
                    Standard Platforms (70% Payout)
                  </span>
                  <span className="font-bold text-muted-foreground text-sm font-mono">
                    {formatINR(competitor70)}
                  </span>
                </div>

                {/* Legacy Template Marketplaces */}
                <div className="p-3 rounded-xl bg-muted/20 border border-border/30 flex items-center justify-between opacity-60">
                  <span className="font-semibold text-muted-foreground">
                    Legacy Marketplaces (50% Payout)
                  </span>
                  <span className="font-bold text-muted-foreground text-sm font-mono">
                    {formatINR(competitor50)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Result Card Highlight */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-background/80 border border-primary/30 space-y-6 text-center shadow-lg">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-500 flex items-center justify-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Your Monthly Take-Home
              </span>
              <p className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
                {formatINR(scriptlyTakeHome)}
              </p>
              <p className="text-[11px] text-muted-foreground">
                Deposited straight to your bank account via automated Razorpay Route.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400 font-bold space-y-0.5">
              <p>You keep an extra</p>
              <p className="text-lg font-black">{formatINR(extraVs70)}/month</p>
              <p className="text-[10px] font-normal opacity-80">compared to other digital storefronts</p>
            </div>

            <Button
              asChild
              className="w-full bg-[#58CC02] hover:bg-[#58CC02]/90 text-white font-black text-xs uppercase tracking-wider rounded-xl py-5 shadow-[0_3px_0_#46A302] active:translate-y-px active:shadow-none transition-all"
            >
              <Link href="/handler/sign-in?redirectTo=/creator/new">
                Claim Your 95% Cut <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
