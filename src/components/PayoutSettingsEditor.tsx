"use client";

import { useState, useTransition } from "react";
import { updateCreatorPayoutSettingsAction } from "../lib/actions/creator";
import { toast } from "sonner";
import { Coins, Loader2, Save } from "lucide-react";

interface PayoutSettingsEditorProps {
  initialPayoutMethod: string | null;
  initialPaypalEmail: string | null;
  initialPayoutDetails: string | null;
  initialBankName: string | null;
  initialBankAccountName: string | null;
  initialBankAccountNumber: string | null;
  initialBankIfsc: string | null;
}

export default function PayoutSettingsEditor({
  initialPayoutMethod,
  initialPaypalEmail,
  initialPayoutDetails,
  initialBankName,
  initialBankAccountName,
  initialBankAccountNumber,
  initialBankIfsc,
}: PayoutSettingsEditorProps) {
  const [method, setMethod] = useState(initialPayoutMethod || "");
  const [paypalEmail, setPaypalEmail] = useState(initialPaypalEmail || "");
  const [details, setDetails] = useState(initialPayoutDetails || "");
  const [bankName, setBankName] = useState(initialBankName || "");
  const [bankAccountName, setBankAccountName] = useState(initialBankAccountName || "");
  const [bankAccountNumber, setBankAccountNumber] = useState(initialBankAccountNumber || "");
  const [bankIfsc, setBankIfsc] = useState(initialBankIfsc || "");
  
  const [isPending, startTransition] = useTransition();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (method === "paypal" && !paypalEmail) {
      toast.error("PayPal email is required when choosing PayPal payout.");
      return;
    }
    if (method === "upi" && !details) {
      toast.error("UPI VPA ID is required when choosing UPI payout.");
      return;
    }
    if (method === "bank") {
      if (!bankName || !bankAccountName || !bankAccountNumber || !bankIfsc) {
        toast.error("All bank details are required for bank transfers.");
        return;
      }
    }

    startTransition(async () => {
      try {
        const res = await updateCreatorPayoutSettingsAction(
          method,
          paypalEmail,
          details,
          bankName,
          bankAccountName,
          bankAccountNumber,
          bankIfsc
        );
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
          Payout & Split Settings
        </h3>

        {/* Payout Method */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-neutral-400 uppercase tracking-wider block">
            Payout Split Method
          </label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-neutral-800 bg-neutral-950 text-white text-xs focus:outline-none focus:border-neutral-500 font-medium cursor-pointer"
          >
            <option value="">Select Method...</option>
            <option value="bank">Direct Bank (via Razorpay Route)</option>
            <option value="paypal">PayPal (Manual Settlement)</option>
            <option value="upi">UPI ID (Manual Settlement)</option>
          </select>
        </div>

        {/* Bank Transfer Details Form */}
        {method === "bank" && (
          <div className="space-y-3 p-3 rounded-xl border border-neutral-900 bg-black/20 animate-in fade-in duration-200">
            <p className="text-[9px] text-purple-400 font-bold uppercase tracking-wider">
              Razorpay Route Linked Account Details
            </p>
            
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">
                Bank Name
              </label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="e.g. HDFC Bank"
                className="w-full px-3 py-2 rounded-lg border border-neutral-800 bg-neutral-950 text-white text-xs focus:outline-none focus:border-neutral-500 font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">
                Beneficiary / Account Name
              </label>
              <input
                type="text"
                value={bankAccountName}
                onChange={(e) => setBankAccountName(e.target.value)}
                placeholder="Name exactly as in passbook"
                className="w-full px-3 py-2 rounded-lg border border-neutral-800 bg-neutral-950 text-white text-xs focus:outline-none focus:border-neutral-500 font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">
                Bank Account Number
              </label>
              <input
                type="text"
                value={bankAccountNumber}
                onChange={(e) => setBankAccountNumber(e.target.value)}
                placeholder="Enter Account Number"
                className="w-full px-3 py-2 rounded-lg border border-neutral-800 bg-neutral-950 text-white text-xs focus:outline-none focus:border-neutral-500 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">
                IFSC Code
              </label>
              <input
                type="text"
                value={bankIfsc}
                onChange={(e) => setBankIfsc(e.target.value.toUpperCase())}
                placeholder="e.g. HDFC0000240"
                className="w-full px-3 py-2 rounded-lg border border-neutral-800 bg-neutral-950 text-white text-xs focus:outline-none focus:border-neutral-500 font-mono"
              />
            </div>
          </div>
        )}

        {/* PayPal Email */}
        {method === "paypal" && (
          <div className="space-y-1.5 animate-in fade-in duration-200">
            <label className="text-[10px] font-black text-neutral-400 uppercase tracking-wider block">
              PayPal Email Address
            </label>
            <input
              type="email"
              value={paypalEmail}
              onChange={(e) => setPaypalEmail(e.target.value)}
              placeholder="e.g. account@paypal.com"
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-800 bg-neutral-950 text-white text-xs focus:outline-none focus:border-neutral-500 font-medium"
            />
          </div>
        )}

        {/* UPI ID */}
        {method === "upi" && (
          <div className="space-y-1.5 animate-in fade-in duration-200">
            <label className="text-[10px] font-black text-neutral-400 uppercase tracking-wider block">
              UPI VPA ID
            </label>
            <input
              type="text"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="e.g. username@upi"
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-800 bg-neutral-950 text-white text-xs focus:outline-none focus:border-neutral-500 font-medium"
            />
          </div>
        )}
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
        <p className="text-[9px] text-neutral-500 mt-2 leading-relaxed font-medium">
          {method === "bank"
            ? "When bank transfer is active, Razorpay Route splits 95% of customer checkout payments to your bank automatically."
            : "PayPal/UPI settlements are processed manually. Settlements are made on demand via the Platform Administrator."}
        </p>
      </div>
    </form>
  );
}
