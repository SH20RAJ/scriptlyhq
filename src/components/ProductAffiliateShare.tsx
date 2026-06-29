"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Percent, Copy, Check, ExternalLink } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface ProductAffiliateShareProps {
  productSlug: string;
  productTitle: string;
  affiliateSlug: string | null;
  isApproved: boolean;
  isLoggedIn: boolean;
  commissionPercent: number;
}

export default function ProductAffiliateShare({
  productSlug,
  productTitle,
  affiliateSlug,
  isApproved,
  isLoggedIn,
  commissionPercent,
}: ProductAffiliateShareProps) {
  const [copied, setCopied] = useState(false);

  const referralUrl = `https://scriptly.store/products/${productSlug}?ref=${affiliateSlug || ""}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    toast.success("Affiliate link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/[0.03] backdrop-blur-md rounded-2xl overflow-hidden shadow-sm hover:border-emerald-500/30 transition-all duration-300">
      <CardContent className="p-5 space-y-4">
        
        {/* Header Badge */}
        <div className="flex justify-between items-center gap-2">
          <Badge className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[9px] uppercase tracking-wider font-black h-5.5 px-2.5">
            <Percent className="w-3 h-3 mr-1" />
            {commissionPercent}% Affiliate Commission
          </Badge>
          <span className="text-[8px] text-muted-foreground uppercase tracking-widest font-bold">Earn Share</span>
        </div>

        {isLoggedIn && isApproved && affiliateSlug ? (
          <div className="space-y-3">
            <div className="space-y-1">
              <h4 className="text-xs font-black uppercase text-foreground">Your Referral Link</h4>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Share this link on your developer blog, newsletters, or Twitter. You will keep {commissionPercent}% of every resulting purchase.
              </p>
            </div>
            
            <div className="flex gap-2">
              <input
                readOnly
                value={referralUrl}
                onClick={(e) => (e.target as HTMLInputElement).select()}
                className="flex-1 bg-background text-[10px] font-mono px-3 py-2 border border-border/40 rounded-xl select-all outline-none"
              />
              <Button
                size="sm"
                onClick={handleCopy}
                className="rounded-xl bg-[#58CC02] text-white hover:bg-[#58CC02]/90 h-9 font-black uppercase tracking-wider text-[9px] cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </Button>
            </div>
          </div>
        ) : isLoggedIn && !isApproved ? (
          <div className="space-y-3">
            <div className="space-y-1">
              <h4 className="text-xs font-black uppercase text-foreground">Promote & Earn Split</h4>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Your affiliate application is currently pending review. Once approved by our admins, you will get access to copy your custom referral links here.
              </p>
            </div>
            <Button asChild variant="outline" className="w-full rounded-xl h-9 text-[9px] font-black uppercase tracking-wider border-border/40 text-foreground cursor-pointer">
              <Link href="/affiliate">
                Check Status
                <ExternalLink className="w-3 h-3 ml-1" />
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <h4 className="text-xs font-black uppercase text-foreground">Promote this Script</h4>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Share this product with other builders and developers and keep **{commissionPercent}%** of every checkout! Split payments are deposited direct to your bank.
              </p>
            </div>
            <Button asChild className="w-full rounded-xl h-9 text-[9px] font-black bg-emerald-500 hover:bg-emerald-500/90 text-white uppercase tracking-wider cursor-pointer">
              <Link href={isLoggedIn ? "/affiliate" : "/handler/sign-in?redirectTo=/affiliate"}>
                Become an Affiliate & Earn
                <ExternalLink className="w-3 h-3 ml-1" />
              </Link>
            </Button>
          </div>
        )}

      </CardContent>
    </Card>
  );
}
