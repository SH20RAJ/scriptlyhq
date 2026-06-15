"use client";

import { useState, useTransition } from "react";
import { updateCreatorPayoutSettingsAction } from "../lib/actions/creator";
import { toast } from "sonner";
import { Coins, Loader2, Save } from "lucide-react";

interface PayoutSettingsEditorProps {
  initialPayoutMethod: string | null;
  initialPaypalEmail: string | null;
  initialPayoutDetails: string | null;
}

export default function PayoutSettingsEditor({
  initialPayoutMethod,
  initialPaypalEmail,
  initialPayoutDetails,
}: PayoutSettingsEditorProps) {
  const [method, setMethod] = useState(initialPayoutMethod || "");
  const [paypalEmail, setPaypalEmail] = useState(initialPaypalEmail || "");
  const [details, setDetails] = useState(initialPayoutDetails || "");
  const [isPending, startTransition] = useTransition();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        const res = await updateCreatorPayoutSettingsAction(method, paypalEmail, details);
        if (res.success) {
          toast.success("Payout settings updated successfully!");
        } else {
          toast.error("Failed to update payout settings.");
        }
      } catch (err: any) {
        toast.error(err.message || "Something went wrong.");
      }
    });
  };

  return (
    <form
      onSubmit={handleSave}
      className="p-6 rounded-2xl border border-neutral-800 bg-neutral-950/40 backdrop-blur-sm space-y-4 h-full flex flex-col justify-between"
    >
      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-2 border-b border-neutral-800 pb-3">
          <Coins className="w-4 h-4 text-purple-400" />
          Payout Settings (Beta)
        </h3>

        {/* Payout Method */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-neutral-400 uppercase tracking-wider block">
            Payout Method
          </label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-neutral-800 bg-neutral-950 text-white text-xs focus:outline-none focus:border-neutral-500 font-medium cursor-pointer"
          >
            <option value="">Select Method...</option>
            <option value="paypal">PayPal</option>
            <option value="upi">UPI ID</option>
            <option value="bank">Bank Transfer</option>
          </select>
        </div>

        {/* PayPal Email */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-neutral-400 uppercase tracking-wider block">
            PayPal Email (Optional)
          </label>
          <input
            type="email"
            value={paypalEmail}
            onChange={(e) => setPaypalEmail(e.target.value)}
            placeholder="e.g. account@paypal.com"
            className="w-full px-4 py-2.5 rounded-xl border border-neutral-800 bg-neutral-950 text-white text-xs focus:outline-none focus:border-neutral-500 font-medium"
          />
        </div>

        {/* payout details */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-neutral-400 uppercase tracking-wider block">
            Account / UPI Details (Optional)
          </label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Enter Bank Account + IFSC details OR your UPI ID..."
            rows={2}
            className="w-full px-4 py-2.5 rounded-xl border border-neutral-800 bg-neutral-950 text-white text-xs focus:outline-none focus:border-neutral-500 font-medium resize-none"
          />
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-white text-black hover:bg-neutral-200 disabled:opacity-50 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer gap-1.5"
        >
          {isPending ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Save className="w-3.5 h-3.5" />
          )}
          Save Settings
        </button>
        <p className="text-[9px] text-neutral-500 mt-2 leading-relaxed">
          Payouts are currently verified manually in our beta phase. Auto-pay transfers via Razorpay/pay-out partners are coming soon.
        </p>
      </div>
    </form>
  );
}
