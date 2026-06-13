"use client";

import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import Link from "next/link";
import { deleteProductAction } from "@/lib/actions/products";
import { useTransition } from "react";

export function AdminActions({ productId }: { productId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this product?")) {
      startTransition(async () => {
        try {
          await deleteProductAction(productId);
        } catch (err) {
          console.error("Delete failed:", err);
          alert("Failed to delete product.");
        }
      });
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <Button asChild variant="outline" size="icon" className="h-8 w-8">
        <Link href={`/admin/products/${productId}/edit`}>
          <Edit2 className="w-3.5 h-3.5" />
        </Link>
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        disabled={isPending}
        className="h-8 w-8 text-destructive hover:bg-destructive/10 border-destructive/20 cursor-pointer"
        onClick={handleDelete}
      >
        <Trash2 className="w-3.5 h-3.5" />
      </Button>
    </div>
  );
}
