"use client";

import { useState, useTransition } from "react";
import { updateAffiliateStatusAction, payoutAffiliateCommissionAction } from "@/lib/actions/affiliates";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Users, HelpCircle, Check, X, Loader2, Coins } from "lucide-react";
import { toast } from "sonner";

interface AffiliateProfile {
  id: string;
  status: string;
  channels: string | null;
  createdAt: string;
  userName: string | null;
  userEmail: string;
  affiliateSlug: string | null;
}

interface PendingCommission {
  id: string;
  amount: number;
  percent: number;
  createdAt: string;
  affiliateName: string | null;
  affiliateEmail: string;
  orderId: string;
  productTitle: string;
}

export default function AffiliatesAdminClient({
  pendingProfiles,
  pendingCommissions,
}: {
  pendingProfiles: AffiliateProfile[];
  pendingCommissions: PendingCommission[];
}) {
  const [isPending, startTransition] = useTransition();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleStatusUpdate = (userId: string, status: "approved" | "rejected") => {
    setProcessingId(userId);
    startTransition(async () => {
      try {
        const res = await updateAffiliateStatusAction({ userId, status });
        if (res.success) {
          toast.success(`Application ${status} successfully!`);
        }
      } catch (err: any) {
        toast.error(err.message || "Failed to update application.");
      } finally {
        setProcessingId(null);
      }
    });
  };

  const handlePayout = (commissionId: string) => {
    setProcessingId(commissionId);
    startTransition(async () => {
      try {
        const res = await payoutAffiliateCommissionAction(commissionId);
        if (res.success) {
          toast.success("Affiliate payout processed!");
        }
      } catch (err: any) {
        toast.error(err.message || "Failed to process payout.");
      } finally {
        setProcessingId(null);
      }
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
            Affiliate Management
            <Badge className="bg-primary/10 text-primary border-primary/20 text-[9px] uppercase tracking-wider h-5 font-black">
              Admin Control
            </Badge>
          </h1>
          <p className="text-xs text-muted-foreground font-medium mt-1">
            Review pending applications, audit affiliate links, and process manual commission payouts.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left: Pending Applications */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-foreground flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-400" />
            Pending Applications ({pendingProfiles.length})
          </h3>

          <div className="space-y-4">
            {pendingProfiles.length === 0 ? (
              <Card className="border border-border/40 bg-card/35 p-6 rounded-2xl text-center text-xs text-muted-foreground font-semibold">
                No pending affiliate applications.
              </Card>
            ) : (
              pendingProfiles.map((prof) => (
                <Card key={prof.id} className="border border-border/40 bg-card/35 rounded-2xl shadow-sm overflow-hidden">
                  <CardContent className="p-5 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h4 className="text-sm font-black text-foreground">{prof.userName || "Unnamed User"}</h4>
                        <p className="text-[10px] text-muted-foreground font-semibold">{prof.userEmail}</p>
                        <Badge className="bg-muted text-primary border-border/40 text-[9px] font-mono font-bold mt-1">
                          Handle: {prof.affiliateSlug}
                        </Badge>
                      </div>
                      <span className="text-[9px] text-muted-foreground font-semibold">
                        {new Date(prof.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="p-3 bg-muted/30 border border-border/20 rounded-xl space-y-1.5">
                      <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Promotional Channels</span>
                      <p className="text-[10px] text-foreground leading-relaxed whitespace-pre-wrap">
                        {prof.channels || "No details provided."}
                      </p>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        disabled={isPending && processingId === prof.id}
                        onClick={() => handleStatusUpdate(prof.id, "approved")}
                        className="flex-1 rounded-xl h-9 bg-emerald-500 text-white hover:bg-emerald-500/90 font-black uppercase tracking-wider text-[9px] cursor-pointer"
                      >
                        {isPending && processingId === prof.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <>
                            <Check className="w-3.5 h-3.5 mr-1" />
                            Approve Partner
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={isPending && processingId === prof.id}
                        onClick={() => handleStatusUpdate(prof.id, "rejected")}
                        className="rounded-xl h-9 font-black uppercase tracking-wider text-[9px] cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Right: Pending Settlements */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-foreground flex items-center gap-2">
            <Coins className="w-4 h-4 text-purple-400" />
            Pending Settlements ({pendingCommissions.length})
          </h3>

          <div className="space-y-4">
            {pendingCommissions.length === 0 ? (
              <Card className="border border-border/40 bg-card/35 p-6 rounded-2xl text-center text-xs text-muted-foreground font-semibold">
                No pending manual affiliate settlements.
              </Card>
            ) : (
              pendingCommissions.map((comm) => (
                <Card key={comm.id} className="border border-border/40 bg-card/35 rounded-2xl shadow-sm overflow-hidden">
                  <CardContent className="p-5 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h4 className="text-xs font-black text-foreground">Referred Sale: {comm.productTitle}</h4>
                        <p className="text-[9px] text-muted-foreground font-semibold">
                          Affiliate: <strong className="text-foreground">{comm.affiliateName || "Partner"}</strong> ({comm.affiliateEmail})
                        </p>
                        <p className="text-[9px] text-muted-foreground font-mono">
                          Order ID: {comm.orderId.slice(0, 8)}... • Commission rate: {comm.percent}%
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-black text-primary block">
                          ${(comm.amount / 100).toFixed(2)}
                        </span>
                        <span className="text-[8px] text-muted-foreground font-semibold">
                          {new Date(comm.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      disabled={isPending && processingId === comm.id}
                      onClick={() => handlePayout(comm.id)}
                      className="w-full rounded-xl h-9 bg-primary text-white hover:bg-primary/90 font-black uppercase tracking-wider text-[9px] cursor-pointer"
                    >
                      {isPending && processingId === comm.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <>
                          <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                          Release Manual Payout
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
