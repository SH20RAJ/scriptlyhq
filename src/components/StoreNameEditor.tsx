"use client";

import { useState, useTransition } from "react";
import { updateCreatorStoreNameAction } from "@/lib/actions/creator";
import { toast } from "sonner";
import { Store, Loader2, Save } from "lucide-react";

interface StoreNameEditorProps {
  initialStoreName: string | null;
}

export default function StoreNameEditor({ initialStoreName }: StoreNameEditorProps) {
  const [storeName, setStoreName] = useState(initialStoreName || "");
  const [isPending, startTransition] = useTransition();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        const res = await updateCreatorStoreNameAction(storeName);
        if (res.success) {
          toast.success("Store name updated successfully!");
        } else {
          toast.error("Failed to update store name.");
        }
      } catch (err: any) {
        toast.error(err.message || "Something went wrong.");
      }
    });
  };

  return (
    <form
      onSubmit={handleSave}
      className="p-6 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-md shadow-sm space-y-5"
    >
      <div className="flex items-center gap-2.5 pb-4 border-b border-border/40">
        <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
          <Store className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-black text-foreground">Store Identity</h3>
          <p className="text-[11px] text-muted-foreground">Public storefront brand name</p>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block">
          Public Store Name
        </label>
        <div className="flex flex-col sm:flex-row gap-2.5">
          <input
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            placeholder="e.g. Acme Studio, DevLabs, Nova Scripts"
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-border/60 bg-background/50 text-foreground text-xs focus:outline-none focus:border-primary/50 transition-colors font-medium placeholder:text-muted-foreground/60"
          />
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center justify-center px-5 py-2.5 bg-primary text-primary-foreground hover:brightness-105 disabled:opacity-50 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer gap-1.5 shadow-[0_3px_0_var(--duo-feather-shadow)] active:translate-y-px active:shadow-none shrink-0"
          >
            {isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            Save Name
          </button>
        </div>
        <p className="text-[11px] text-muted-foreground">
          This store name appears across your product pages and public creator profile.
        </p>
      </div>
    </form>
  );
}
