"use client";

import { useTransition } from "react";
import { toggleProductPublishAction } from "@/lib/actions/products";
import { Button } from "@/components/ui/button";
import { EyeOff, Edit, Lock } from "lucide-react";
import Link from "next/link";

export default function AdminToolbar({ 
  productId, 
  isPublished 
}: { 
  productId: string; 
  isPublished: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      try {
        await toggleProductPublishAction(productId);
      } catch (err) {
        alert("Failed to update status");
      }
    });
  };

  return (
    <div className="bg-card/90 dark:bg-neutral-900/90 backdrop-blur-xl border border-amber-500/30 rounded-2xl px-4 py-2.5 shadow-xl flex flex-wrap items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-2.5">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
        </span>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase tracking-wider border border-amber-500/20">
            Admin View
          </span>
          <span className="text-muted-foreground text-[11px] font-medium">
            Product status is <strong className="text-foreground font-semibold">{isPublished ? "Public" : "Draft (Hidden)"}</strong>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={isPending}
          onClick={handleToggle}
          className="h-8 px-3 rounded-xl border-amber-500/30 text-amber-500 hover:bg-amber-500 hover:text-black font-bold uppercase tracking-wider text-[10px] cursor-pointer transition-colors"
        >
          {isPending ? "Updating..." : isPublished ? (
            <><EyeOff className="w-3 h-3 mr-1.5" /> Unpublish</>
          ) : (
            "Publish Now"
          )}
        </Button>

        <Button
          asChild
          variant="outline"
          size="sm"
          className="h-8 px-3 rounded-xl border-border hover:bg-muted font-bold uppercase tracking-wider text-[10px] cursor-pointer"
        >
          <Link href={`/admin/products/${productId}/edit`}>
            <Edit className="w-3 h-3 mr-1.5" />
            Edit Product
          </Link>
        </Button>
      </div>
    </div>
  );
}
