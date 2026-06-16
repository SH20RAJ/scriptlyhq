"use client";

import { useState, useTransition } from "react";
import { updateCreatorStoreNameAction } from "../lib/actions/creator";
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
    <form onSubmit={handleSave} className="p-6 rounded-2xl border-2 border-border bg-card shadow-sm space-y-4">
      <h3 className="text-xs font-black uppercase tracking-widest text-foreground flex items-center gap-2 border-b border-border pb-3">
        <Store className="w-4 h-4 text-[#CE82FF]" />
        Storefront Branding
      </h3>

      <div className="space-y-2">
        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Store Name</label>
        <div className="flex gap-2.5">
          <input
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            placeholder="e.g. Acme Scripts Store"
            className="flex-1 px-4 py-2.5 rounded-xl border-2 border-border bg-background text-foreground text-xs focus:outline-none focus:border-primary focus:shadow-[0_3px_0_var(--duo-feather-shadow)] shadow-[0_3px_0_var(--border)] transition-all font-bold"
          />
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center justify-center px-4 py-2.5 bg-primary text-primary-foreground hover:brightness-105 disabled:opacity-50 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer gap-1.5 shadow-[0_3px_0_var(--duo-feather-shadow)] active:translate-y-px active:shadow-none"
          >
            {isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            Save
          </button>
        </div>
        <p className="text-[9px] text-muted-foreground font-semibold">
          This store name will be displayed on your product pages for customers to identify your catalog.
        </p>
      </div>
    </form>
  );
}
