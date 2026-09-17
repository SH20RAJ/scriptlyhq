"use client";

import { useState, useTransition } from "react";
import { updateCreatorPayoutSettingsAction } from "@/lib/actions/creator";
import { toast } from "sonner";
import { Coins, Loader2, Save, Landmark, ShieldCheck } from "lucide-react";

interface PayoutSettingsEditorProps {
  initialBankName: string | null;
  initialBankAccountName: string | null;
  initialBankAccountNumber: string | null;
  initialBankIfsc: string | null;
}

export default function PayoutSettingsEditor({
  initialBankName,
  initialBankAccountName,
  initialBankAccountNumber,
  initialBankIfsc,
}: PayoutSettingsEditorProps) {
  const [bankName, setBankName] = useState(initialBankName || "");
  const [bankAccountName, setBankAccountName] = useState(initialBankAccountName || "");
  const [bankAccountNumber, setBankAccountNumber] = useState(initialBankAccountNumber || "");
  const [bankIfsc, setBankIfsc] = useState(initialBankIfsc || "");

  const [isPending, startTransition] = useTransition();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!bankName || !bankAccountName || !bankAccountNumber || !bankIfsc) {
      toast.error("All bank details are required for automated split routing.");
      return;
    }

    startTransition(async () => {
      try {
        const res = await updateCreatorPayoutSettingsAction(
          "bank",
          "",
          "",
          bankName,
          bankAccountName,
          bankAccountNumber,
          bankIfsc
        );
        if (res.success) {
          toast.success("Bank payout details saved successfully!");
        } else {
          toast.error("Failed to update bank details.");
        }
      } catch (err: any) {
        toast.error(err.message || "Something went wrong.");
      }
    });
  };

  return (
    <form
      onSubmit={handleSave}
      className="p-6 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-md shadow-sm space-y-6"
    >
      <div className="flex items-center justify-between pb-4 border-b border-border/40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Coins className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-foreground">Direct Bank Payouts</h3>
            <p className="text-[11px] text-muted-foreground">Automated Razorpay Route settlements</p>
          </div>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" /> 95% Direct Split
        </span>
      </div>

      {/* Info Notice */}
      <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/15 text-xs space-y-1">
        <div className="flex items-center gap-1.5 font-bold text-foreground text-xs">
          <Landmark className="w-3.5 h-3.5 text-emerald-500" />
          <span>Automated Sub-Merchant Settlement</span>
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Customer checkouts automatically split 95% directly to your registered bank account without manual invoice filing.
        </p>
      </div>

      {/* Input Fields */}
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block">
            Bank Name
          </label>
          <input
            type="text"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            placeholder="e.g. HDFC Bank, ICICI Bank, SBI"
            className="w-full px-3.5 py-2.5 rounded-xl border border-border/60 bg-background/50 text-foreground text-xs focus:outline-none focus:border-primary/50 transition-colors font-medium placeholder:text-muted-foreground/60"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block">
            Account Holder Name
          </label>
          <input
            type="text"
            value={bankAccountName}
            onChange={(e) => setBankAccountName(e.target.value)}
            placeholder="Name exactly as on your bank records"
            className="w-full px-3.5 py-2.5 rounded-xl border border-border/60 bg-background/50 text-foreground text-xs focus:outline-none focus:border-primary/50 transition-colors font-medium placeholder:text-muted-foreground/60"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block">
              Account Number
            </label>
            <input
              type="text"
              value={bankAccountNumber}
              onChange={(e) => setBankAccountNumber(e.target.value)}
              placeholder="Enter Account Number"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border/60 bg-background/50 text-foreground text-xs font-mono focus:outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground/60"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block">
              IFSC Code
            </label>
            <input
              type="text"
              value={bankIfsc}
              onChange={(e) => setBankIfsc(e.target.value.toUpperCase())}
              placeholder="e.g. HDFC0000240"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border/60 bg-background/50 text-foreground text-xs font-mono focus:outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground/60"
            />
          </div>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-primary text-primary-foreground hover:brightness-105 disabled:opacity-50 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer gap-2 shadow-[0_3px_0_var(--duo-feather-shadow)] active:translate-y-px active:shadow-none"
        >
          {isPending ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Save className="w-3.5 h-3.5" />
          )}
          Save Payout Settings
        </button>
      </div>
    </form>
  );
}
