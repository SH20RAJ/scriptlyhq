export const dynamic = "force-dynamic";

import { Metadata } from "next";
import { getOrCreateDbUser } from "@/lib/auth-utils";
import { redirect } from "next/navigation";
import PayoutSettingsEditor from "@/components/PayoutSettingsEditor";

export const metadata: Metadata = {
  title: "Bank & Payouts | Creator Console",
  description: "Configure bank split details via Razorpay Route nodes.",
};

export default async function CreatorPayoutsPage() {
  const user = await getOrCreateDbUser();
  if (!user) {
    redirect("/handler/sign-in?redirectTo=/creator/dashboard");
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-b border-border/40 pb-5">
        <h1 className="text-2xl font-black tracking-tight text-foreground">
          Payout & Split Settings
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Link your bank account to automate checkout payout splits (95% creator / 5% platform).
        </p>
      </div>

      {/* Editor Card */}
      <div className="max-w-xl">
        <PayoutSettingsEditor
          initialBankName={user.bankName}
          initialBankAccountName={user.bankAccountName}
          initialBankAccountNumber={user.bankAccountNumber}
          initialBankIfsc={user.bankIfsc}
        />
      </div>
    </div>
  );
}
