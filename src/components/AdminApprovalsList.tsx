"use client";

import { useState, useTransition } from "react";
import { approveProductAction, rejectProductAction } from "@/lib/actions/products";
import { toast } from "sonner";
import { Check, X, Eye, Download, ShieldAlert, Loader2, Calendar, User, Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PendingProduct {
  id: string;
  title: string;
  slug: string;
  price: number;
  category: string;
  fileUrl: string | null;
  createdAt: Date;
  creator: {
    name: string | null;
    email: string;
  } | null;
}

interface AdminApprovalsListProps {
  pendingItems: PendingProduct[];
}

export default function AdminApprovalsList({ pendingItems }: AdminApprovalsListProps) {
  const [items, setItems] = useState<PendingProduct[]>(pendingItems);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleApprove = (id: string, title: string) => {
    if (!confirm(`Are you sure you want to approve "${title}"? This will list it live on the marketplace.`)) return;

    setProcessingId(id);
    startTransition(async () => {
      try {
        const res = await approveProductAction(id);
        if (res.success) {
          toast.success(`"${title}" approved successfully!`);
          setItems((prev) => prev.filter((item) => item.id !== id));
        } else {
          toast.error("Failed to approve script.");
        }
      } catch (err: any) {
        toast.error(err.message || "Something went wrong.");
      } finally {
        setProcessingId(null);
      }
    });
  };

  const handleReject = (id: string, title: string) => {
    if (!confirm(`Are you sure you want to reject "${title}"? This will set its status to rejected and keep it unlisted.`)) return;

    setProcessingId(id);
    startTransition(async () => {
      try {
        const res = await rejectProductAction(id);
        if (res.success) {
          toast.success(`"${title}" rejected.`);
          setItems((prev) => prev.filter((item) => item.id !== id));
        } else {
          toast.error("Failed to reject script.");
        }
      } catch (err: any) {
        toast.error(err.message || "Something went wrong.");
      } finally {
        setProcessingId(null);
      }
    });
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 border border-dashed border-neutral-800 rounded-3xl bg-neutral-900/10 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
          <Check className="w-6 h-6 text-emerald-400" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-white uppercase tracking-wider">Inbox Clean</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
            All creator script submissions have been moderated. Good job!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border border-neutral-800/80 rounded-2xl overflow-hidden bg-neutral-900/10 backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-800/80 bg-neutral-950/40 text-[10px] font-black uppercase tracking-wider text-neutral-400">
                <th className="py-4 px-6">Product & Creator</th>
                <th className="py-4 px-6">Proposed Price</th>
                <th className="py-4 px-6">Assets & Code</th>
                <th className="py-4 px-6 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/40 text-sm font-medium text-neutral-300">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-neutral-800/10 transition-colors">
                  {/* Title & Creator Info */}
                  <td className="py-5 px-6 space-y-2.5">
                    <div className="space-y-1">
                      <Link href={`/products/${item.slug}`} target="_blank" className="text-base font-extrabold text-white hover:underline flex items-center gap-2">
                        {item.title}
                        <span className="text-[9px] px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 font-bold uppercase tracking-wide">
                          {item.category}
                        </span>
                      </Link>
                      <div className="flex items-center gap-3 text-[10px] text-neutral-500 font-bold">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                        <span>•</span>
                        <span className="font-mono">ID: {item.id.slice(0, 8)}</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-neutral-950/40 border border-neutral-800/50 space-y-1.5 max-w-sm">
                      <div className="flex items-center gap-2 text-xs text-neutral-300">
                        <User className="w-3.5 h-3.5 text-neutral-500" />
                        <span className="font-bold">{item.creator?.name || "Anonymous Creator"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10.5px] text-neutral-500">
                        <Mail className="w-3.5 h-3.5 text-neutral-500" />
                        <span className="font-mono">{item.creator?.email || "no-email@hexclave.com"}</span>
                      </div>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="py-5 px-6">
                    <div className="flex items-baseline text-white font-mono font-black text-xl">
                      <span className="text-neutral-500 text-sm font-sans mr-0.5">$</span>
                      {(item.price / 100).toFixed(2)}
                    </div>
                  </td>

                  {/* File & Review Links */}
                  <td className="py-5 px-6 space-y-2">
                    {item.fileUrl ? (
                      <Button asChild size="sm" variant="outline" className="rounded-xl h-9 px-4 text-[10px] font-black uppercase tracking-widest border-neutral-800 hover:bg-neutral-800/50 hover:text-white cursor-pointer">
                        <a href={item.fileUrl} download>
                          <Download className="w-3.5 h-3.5 mr-2 text-amber-500" />
                          Download Script Bundle
                        </a>
                      </Button>
                    ) : (
                      <div className="text-[10px] text-rose-400 font-bold flex items-center gap-1.5">
                        <ShieldAlert className="w-4 h-4" />
                        No Script ZIP Uploaded
                      </div>
                    )}
                    <div>
                      <Button asChild size="sm" variant="ghost" className="h-8 text-[9px] font-black uppercase tracking-widest text-neutral-400 hover:text-white">
                        <Link href={`/products/${item.slug}`} target="_blank">
                          <Eye className="w-3.5 h-3.5 mr-1.5" />
                          Preview Page Layout
                        </Link>
                      </Button>
                    </div>
                  </td>

                  {/* Approve / Reject CTA */}
                  <td className="py-5 px-6 text-right">
                    <div className="flex items-center justify-end gap-2.5">
                      <button
                        type="button"
                        disabled={processingId !== null}
                        onClick={() => handleReject(item.id, item.title)}
                        className="inline-flex items-center justify-center p-2.5 rounded-xl border border-neutral-800 text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20 transition-all disabled:opacity-40 cursor-pointer"
                        title="Reject Listing"
                      >
                        {processingId === item.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-rose-400" />
                        ) : (
                          <X className="w-4.5 h-4.5" />
                        )}
                      </button>

                      <button
                        type="button"
                        disabled={processingId !== null}
                        onClick={() => handleApprove(item.id, item.title)}
                        className="inline-flex items-center justify-center p-2.5 rounded-xl bg-white text-black hover:bg-neutral-200 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-40 shadow-lg cursor-pointer"
                        title="Approve & Publish Live"
                      >
                        {processingId === item.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-black" />
                        ) : (
                          <Check className="w-4.5 h-4.5" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
