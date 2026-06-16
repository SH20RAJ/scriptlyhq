"use client";

import { useState, useTransition } from "react";
import { updateCreatorPayoutSettingsAction } from "../lib/actions/creator";
import { toast } from "sonner";
import { Coins, Loader2, Save, Landmark } from "lucide-react";

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
          "", // No PayPal Email
          "", // No UPI details
          bankName,
          bankAccountName,
          bankAccountNumber,
          bankIfsc
        );
        if (res.success) {
          toast.success("Bank details saved successfully!");
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
      className="p-6 rounded-2xl border-2 border-border bg-card shadow-sm space-y-4 h-full flex flex-col justify-between"
    >
      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-foreground flex items-center gap-2 border-b border-border pb-3">
          <Coins className="w-4 h-4 text-[#CE82FF]" />
          Payout & Split Settings
        </h3>

        {/* Payout Method Status (Locked to Bank Routing) */}
        <div className="space-y-1.5 p-3 rounded-xl border border-emerald-500/15 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400">
          <label className="text-[10px] font-black uppercase tracking-wider block">
            Payout Split Method
          </label>
          <div className="flex items-center gap-1.5 text-xs font-black text-foreground">
            <Landmark className="w-4 h-4 text-emerald-500" />
            Direct Bank (via Razorpay Route)
          </div>
          <p className="text-[9px] text-muted-foreground leading-relaxed font-semibold mt-1">
            PayPal and UPI manual settlements have been phased out. Earnings split dynamically (95% creator / 5% platform) directly to your bank.
          </p>
        </div>

        {/* Bank Transfer Details Form */}
        <div className="space-y-3 p-3 rounded-xl border-2 border-border bg-background/50">
          <p className="text-[9px] text-primary font-black uppercase tracking-wider">
            Razorpay Route Linked Account Details
          </p>
          
          <div className="space-y-1.5">
            <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">
              Bank Name
            </label>
            <input
              type="text"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="e.g. HDFC Bank"
              className="w-full px-3 py-2 rounded-lg border-2 border-border bg-background text-foreground text-xs focus:outline-none focus:border-primary focus:shadow-[0_3px_0_var(--duo-feather-shadow)] shadow-[0_3px_0_var(--border)] transition-all font-bold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">
              Beneficiary / Account Name
            </label>
            <input
              type="text"
              value={bankAccountName}
              onChange={(e) => setBankAccountName(e.target.value)}
              placeholder="Name exactly as in passbook"
              className="w-full px-3 py-2 rounded-lg border-2 border-border bg-background text-foreground text-xs focus:outline-none focus:border-primary focus:shadow-[0_3px_0_var(--duo-feather-shadow)] shadow-[0_3px_0_var(--border)] transition-all font-bold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">
              Bank Account Number
            </label>
            <input
              type="text"
              value={bankAccountNumber}
              onChange={(e) => setBankAccountNumber(e.target.value)}
              placeholder="Enter Account Number"
              className="w-full px-3 py-2 rounded-lg border-2 border-border bg-background text-foreground text-xs focus:outline-none focus:border-primary focus:shadow-[0_3px_0_var(--duo-feather-shadow)] shadow-[0_3px_0_var(--border)] transition-all font-mono font-bold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">
              IFSC Code
            </label>
            <input
              type="text"
              value={bankIfsc}
              onChange={(e) => setBankIfsc(e.target.value.toUpperCase())}
              placeholder="e.g. HDFC0000240"
              className="w-full px-3 py-2 rounded-lg border-2 border-border bg-background text-foreground text-xs focus:outline-none focus:border-primary focus:shadow-[0_3px_0_var(--duo-feather-shadow)] shadow-[0_3px_0_var(--border)] transition-all font-mono font-bold"
            />
          </div>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-primary text-primary-foreground hover:brightness-105 disabled:opacity-50 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer gap-1.5 shadow-[0_3px_0_var(--duo-feather-shadow)] active:translate-y-px active:shadow-none"
        >
          {isPending ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Save className="w-3.5 h-3.5" />
          )}
          Save Settings
        </button>
      </div>
    </form>
  );
}
