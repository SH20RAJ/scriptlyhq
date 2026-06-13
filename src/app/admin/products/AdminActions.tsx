"use client";

import { Edit2, Trash2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { deleteProductAction, toggleProductPublishAction } from "@/lib/actions/products";
import { useTransition } from "react";

export function AdminActions({ 
  productId, 
  productSlug, 
  isPublished 
}: { 
  productId: string; 
  productSlug: string;
  isPublished: boolean;
}) {
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

  const handleTogglePublish = async () => {
    startTransition(async () => {
      try {
        await toggleProductPublishAction(productId);
      } catch (err) {
        console.error("Toggle publish failed:", err);
        alert("Failed to update status.");
      }
    });
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        variant="outline"
        size="icon"
        disabled={isPending}
        className={`h-8 w-8 cursor-pointer ${isPublished ? "text-amber-500 hover:text-amber-600" : "text-emerald-500 hover:text-emerald-600"}`}
        title={isPublished ? "Convert to Draft" : "Publish Now"}
        onClick={handleTogglePublish}
      >
        {isPublished ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
      </Button>

      <Button asChild variant="outline" size="icon" className="h-8 w-8" title="View Item">
        <Link href={`/products/${productSlug}`} target="_blank">
          <Eye className="w-3.5 h-3.5" />
        </Link>
      </Button>

      <Button asChild variant="outline" size="icon" className="h-8 w-8" title="Edit Item">
        <Link href={`/admin/products/${productId}/edit`}>
          <Edit2 className="w-3.5 h-3.5" />
        </Link>
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        disabled={isPending}
        className="h-8 w-8 text-destructive hover:bg-destructive/10 border-destructive/20 cursor-pointer"
        title="Delete Item"
        onClick={handleDelete}
      >
        <Trash2 className="w-3.5 h-3.5" />
      </Button>
    </div>
  );
}
