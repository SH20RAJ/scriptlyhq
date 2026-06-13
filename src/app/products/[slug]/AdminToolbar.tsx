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
    <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 mb-8 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center">
          <Lock className="w-4 h-4 text-black" />
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-amber-500">Admin Control</p>
          <p className="text-[10px] text-amber-500/70 font-bold uppercase tracking-tighter">
            This product is currently {isPublished ? "Public" : "a Draft"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={isPending}
          onClick={handleToggle}
          className="rounded-xl bg-amber-500/5 border-amber-500/20 text-amber-500 hover:bg-amber-500 hover:text-black font-bold uppercase tracking-widest text-[10px] h-9 cursor-pointer"
        >
          {isPending ? "Updating..." : isPublished ? (
            <><EyeOff className="w-3.5 h-3.5 mr-2" /> Unpublish (Draft)</>
          ) : (
            "Publish Now"
          )}
        </Button>

        <Button
          asChild
          variant="outline"
          size="sm"
          className="rounded-xl bg-amber-500/5 border-amber-500/20 text-amber-500 hover:bg-amber-500 hover:text-black font-bold uppercase tracking-widest text-[10px] h-9 cursor-pointer"
        >
          <Link href={`/admin/products/${productId}/edit`}>
            <Edit className="w-3.5 h-3.5 mr-2" />
            Edit Product
          </Link>
        </Button>
      </div>
    </div>
  );
}
