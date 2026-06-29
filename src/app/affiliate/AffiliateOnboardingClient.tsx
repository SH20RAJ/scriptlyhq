"use client";

import { useState } from "react";
import { registerAffiliateAction } from "@/lib/actions/affiliates";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Percent, Users, Target, ArrowRight, ShieldCheck, HelpCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function AffiliateOnboardingClient({
  initialSlug,
  isLoggedIn,
  status,
}: {
  initialSlug: string;
  isLoggedIn: boolean;
  status: string | null;
}) {
  const [slug, setSlug] = useState(initialSlug);
  const [channels, setChannels] = useState("");
  const [loading, setLoading] = useState(false);

  // Calculator states
  const [salesVal, setSalesVal] = useState(1500); // USD
  const [commRate, setCommRate] = useState(30); // Percentage

  const potentialEarnings = Math.round(salesVal * (commRate / 100));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.error("Please sign in to register.");
      return;
    }
    if (!slug) {
      toast.error("Please enter a custom handle.");
      return;
    }

    setLoading(true);
    try {
      const res = await registerAffiliateAction({ slug, channels });
      if (res.success) {
        toast.success("Application submitted successfully!");
        window.location.reload();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to submit application.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "pending") {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center">
        <Card className="border border-border/40 bg-card/45 backdrop-blur-md shadow-xl rounded-3xl p-8 space-y-6">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
            <HelpCircle className="w-8 h-8 animate-pulse" />
          </div>
          <div className="space-y-2">
            <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[10px] uppercase font-black tracking-widest h-6">
              Application Under Review
            </Badge>
            <h2 className="text-xl md:text-2xl font-black text-foreground">We are reviewing your application</h2>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto">
              Our administrators are reviewing your promotional channels. You will receive an email notification once your profile is approved.
            </p>
          </div>
          <Button asChild className="rounded-xl w-full max-w-xs uppercase tracking-wider text-[10px] font-black h-11 bg-muted hover:bg-muted/80 text-foreground cursor-pointer">
            <Link href="/explore">
              Return to Catalog
            </Link>
          </Button>
        </Card>
      </div>
    );
  }

  if (status === "rejected") {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center">
        <Card className="border border-border/40 bg-card/45 backdrop-blur-md shadow-xl rounded-3xl p-8 space-y-6">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <Badge className="bg-rose-500/10 text-rose-500 border-rose-500/20 text-[10px] uppercase font-black tracking-widest h-6">
              Application Rejected
            </Badge>
            <h2 className="text-xl md:text-2xl font-black text-foreground">Application Status</h2>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto">
              Unfortunately, your application was not approved. This can happen if your channels do not meet our developer-focused content standards.
            </p>
          </div>
          <div className="pt-4 border-t border-border/40">
            <h4 className="text-xs font-black uppercase text-foreground mb-4">Submit a revised application</h4>
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Desired Link Handle</label>
                <Input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. devshare"
                  className="rounded-xl h-11 bg-muted/50 border-border/40 focus-visible:ring-primary"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Updated Promotional Channels</label>
                <Textarea
                  value={channels}
                  onChange={(e) => setChannels(e.target.value)}
                  placeholder="Tell us about your developer channels (Twitter, blog, YouTube, newsletter link) where you will refer buyers..."
                  className="rounded-xl bg-muted/50 border-border/40 min-h-[100px] focus-visible:ring-primary text-xs"
                  required
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full rounded-xl uppercase tracking-wider text-[10px] font-black h-11 bg-primary text-white hover:bg-primary/90">
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Re-apply Now"}
              </Button>
            </form>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 space-y-16 animate-in fade-in duration-300">
      
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <Badge className="bg-[#CE82FF]/10 text-[#CE82FF] border-[#CE82FF]/20 text-[9px] uppercase tracking-widest font-black h-6">
          Affiliate Program
        </Badge>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
          Partner with Scriptly. <br />
          <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
            Earn Recurrent Commissions.
          </span>
        </h1>
        <p className="text-sm text-muted-foreground font-medium max-w-xl mx-auto leading-relaxed">
          Promote developer scripts, SaaS templates, and creator eBooks. Set custom handle handles, track real-time click metrics, and earn split payouts.
        </p>
      </div>

      {/* Grid: Benefits & Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left: How it works & Benefits */}
        <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Why Partner With Us?</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 border border-border/40 bg-card/35 backdrop-blur-md rounded-2xl flex gap-4">
                <div className="p-2.5 h-10 w-10 rounded-xl bg-primary/10 text-primary shrink-0 flex items-center justify-center">
                  <Percent className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-black uppercase text-foreground">High Payout Splits</h4>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">Get paid up to 30% of sales commissions configured per product by the creators.</p>
                </div>
              </div>

              <div className="p-5 border border-border/40 bg-card/35 backdrop-blur-md rounded-2xl flex gap-4">
                <div className="p-2.5 h-10 w-10 rounded-xl bg-purple-500/10 text-purple-400 shrink-0 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-black uppercase text-foreground">Targeted Audience</h4>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">Promote high-converting code files, SaaS blueprints, templates, and tech ebooks.</p>
                </div>
              </div>

              <div className="p-5 border border-border/40 bg-card/35 backdrop-blur-md rounded-2xl flex gap-4">
                <div className="p-2.5 h-10 w-10 rounded-xl bg-blue-500/10 text-blue-400 shrink-0 flex items-center justify-center">
                  <Target className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-black uppercase text-foreground">Real-time Analytics</h4>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">Track referral clicks, conversion rates, and accrued commission earnings live.</p>
                </div>
              </div>

              <div className="p-5 border border-border/40 bg-card/35 backdrop-blur-md rounded-2xl flex gap-4">
                <div className="p-2.5 h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-black uppercase text-foreground">Razorpay Split Routes</h4>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">Link your Razorpay Account for instant automated splits direct to your bank.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 border border-primary/20 bg-primary/5 rounded-2xl mt-4">
            <h4 className="text-xs font-black uppercase text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
              Developer Referral Bonus
            </h4>
            <p className="text-[10px] text-muted-foreground leading-relaxed mt-2">
              Every Scriptly store user receives a standard affiliate option. Promote eBooks and plugins across your newsletters, Twitter accounts, and developer blogs. Direct bank settlements occur automatically.
            </p>
          </div>
        </div>

        {/* Right: Dynamic Income Calculator */}
        <div className="lg:col-span-5 border border-border/40 bg-card/35 backdrop-blur-md shadow-lg rounded-3xl p-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-foreground">Earnings Estimator</h3>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Drag the sliders below to estimate your potential affiliate earnings based on sales volume and commission percentage.
            </p>

            {/* Slider 1: Sales Value */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs font-black uppercase text-foreground">
                <span>Monthly Referrals</span>
                <span className="text-primary">${salesVal.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="100"
                max="10000"
                step="100"
                value={salesVal}
                onChange={(e) => setSalesVal(Number(e.target.value))}
                className="w-full accent-primary h-1.5 bg-muted rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[8px] font-bold text-muted-foreground">
                <span>$100</span>
                <span>$10,000</span>
              </div>
            </div>

            {/* Slider 2: Commission Rate */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs font-black uppercase text-foreground">
                <span>Avg Commission Rate</span>
                <span className="text-purple-400">{commRate}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={commRate}
                onChange={(e) => setCommRate(Number(e.target.value))}
                className="w-full accent-purple-500 h-1.5 bg-muted rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[8px] font-bold text-muted-foreground">
                <span>5%</span>
                <span>50%</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border/40 text-center space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Est. Monthly Earnings</p>
            <h2 className="text-4xl md:text-5xl font-black text-[#58CC02] drop-shadow-[0_2px_10px_rgba(88,204,2,0.2)]">
              ${potentialEarnings.toLocaleString()}
            </h2>
            <p className="text-[8px] text-muted-foreground font-medium pt-1">
              Calculations based on target sales volume. Payouts are made in direct USD equivalents.
            </p>
          </div>
        </div>
      </div>

      {/* Onboarding Registration Form */}
      <div className="max-w-2xl mx-auto border border-border/40 bg-card/35 backdrop-blur-md rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-1.5 border-b border-border pb-4">
          <h3 className="text-lg font-black uppercase text-foreground">Affiliate Registration</h3>
          <p className="text-[10px] text-muted-foreground font-medium">
            Fill out the form below to register your unique referral handle.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Desired Link Handle (ref)</label>
            <div className="flex rounded-xl overflow-hidden border border-border/40 bg-muted/30 focus-within:ring-2 focus-within:ring-primary transition-all duration-200">
              <span className="bg-muted px-4 flex items-center text-xs font-bold text-muted-foreground border-r border-border/40 select-none">
                scriptly.store/?ref=
              </span>
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                placeholder="username"
                className="flex-1 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 font-bold text-xs shadow-none h-11 rounded-none px-4"
                required
              />
            </div>
            <p className="text-[8px] text-muted-foreground font-medium">
              Only lowercase letters, numbers, hyphens, or underscores. This will be used in your referral URLs.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Promotional Channels & Traffic Source</label>
            <Textarea
              value={channels}
              onChange={(e) => setChannels(e.target.value)}
              placeholder="Provide links to your Twitter handle, developer blog, YouTube channel, or email newsletters where you intend to share product links..."
              className="rounded-xl bg-muted/30 border-border/40 min-h-[100px] focus-visible:ring-primary text-xs leading-relaxed"
              required
            />
          </div>

          {isLoggedIn ? (
            <Button type="submit" disabled={loading} className="w-full rounded-xl uppercase tracking-wider text-[10px] font-black h-11 bg-[#58CC02] text-white hover:bg-[#58CC02]/90 cursor-pointer">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Submitting Application...
                </>
              ) : (
                <>
                  Apply for Affiliate Access
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </>
              )}
            </Button>
          ) : (
            <Button asChild className="w-full rounded-xl uppercase tracking-wider text-[10px] font-black h-11 bg-primary text-white hover:bg-primary/90 cursor-pointer">
              <Link href="/handler/sign-in?redirectTo=/affiliate">
                Sign In to Apply
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            </Button>
          )}
        </form>
      </div>

    </div>
  );
}
