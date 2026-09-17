"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, KeyRound, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface KeyUnlockCardProps {
  token: string;
  initialError?: string | null;
}

export default function KeyUnlockCard({ token, initialError }: KeyUnlockCardProps) {
  const router = useRouter();
  const [keyInput, setKeyInput] = useState("");
  const [error, setError] = useState(initialError || "");
  const [loading, setLoading] = useState(false);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyInput.trim()) {
      setError("Please enter the decryption key.");
      return;
    }

    setLoading(true);
    setError("");
    const params = new URLSearchParams();
    params.set("data", token);
    params.set("key", keyInput.trim());
    router.push(`/pay?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 sm:p-8 rounded-3xl bg-card/90 border border-amber-500/30 backdrop-blur-xl shadow-2xl space-y-6 animate-in fade-in zoom-in-95">
      <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mx-auto shadow-inner">
        <KeyRound className="w-7 h-7" />
      </div>

      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase tracking-wider border border-amber-500/20">
          <Lock className="w-3 h-3" /> Key Protected Checkout
        </div>
        <h2 className="text-xl font-black text-foreground">Decryption Key Required</h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          This payment link was encrypted by the creator using a private security key. Enter the key below to access checkout.
        </p>
      </div>

      <form onSubmit={handleUnlock} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">
            Security / Access Key
          </label>
          <Input
            type="password"
            value={keyInput}
            onChange={(e) => {
              setKeyInput(e.target.value);
              if (error) setError("");
            }}
            placeholder="Enter security key..."
            className="rounded-xl h-11 text-sm bg-background/80 border-border/60 focus:border-amber-500"
            autoFocus
          />
        </div>

        {error && (
          <p className="text-xs text-rose-500 font-semibold text-center bg-rose-500/10 py-2 px-3 rounded-lg border border-rose-500/20">
            {error}
          </p>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[#58CC02] hover:bg-[#58CC02]/90 text-white font-black text-xs uppercase tracking-wider rounded-xl h-11 shadow-[0_3px_0_#46A302] active:translate-y-px active:shadow-none transition-all"
        >
          {loading ? "Decrypting..." : "Unlock Checkout"}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </form>

      <div className="pt-2 border-t border-border/30 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>256-bit AES Authenticated Encryption</span>
      </div>
    </div>
  );
}
