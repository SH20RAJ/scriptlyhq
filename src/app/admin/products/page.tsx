export const dynamic = "force-dynamic";

import { db } from "../../../db";
import { products } from "../../../db/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";
import { deleteProductAction } from "../../../lib/actions/products";
import { Plus, Globe, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { AdminActions } from "./AdminActions";

export default async function AdminProductsPage() {
  const productsList = await db.query.products.findMany({
    orderBy: [desc(products.createdAt)],
  });

  return (
    <div className="space-y-12">
      
      {/* Header with CTA */}
      <div className="flex items-center justify-between border-b border-border pb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Product Catalog
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your digital assets and publishing status.
          </p>
        </div>
        
        <Button asChild className="rounded-lg h-11 px-5">
          <Link href="/admin/products/new">
            <Plus className="w-4 h-4 mr-2" />
            New Product
          </Link>
        </Button>
      </div>

      {/* Products Table Card */}
      {productsList.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-border rounded-xl bg-card/30">
          <AlertCircle className="w-10 h-10 mx-auto text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground">Your catalog is currently empty.</p>
          <Button asChild variant="link" className="mt-2 text-foreground">
            <Link href="/admin/products/new">Create your first product</Link>
          </Button>
        </div>
      ) : (
        <Card className="border-border bg-card overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="w-[40%] px-6">Product Details</TableHead>
                <TableHead className="px-6">Category</TableHead>
                <TableHead className="px-6">Price</TableHead>
                <TableHead className="px-6">Status</TableHead>
                <TableHead className="px-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productsList.map((prod) => (
                <TableRow key={prod.id} className="border-border hover:bg-muted/20 transition-colors">
                  
                  {/* Title & Slug */}
                  <TableCell className="px-6 py-5">
                    <div className="font-medium text-foreground text-base">
                      {prod.title}
                    </div>
                    <div className="text-[10px] font-mono text-muted-foreground mt-1.5 uppercase tracking-tighter opacity-70">
                      ID: {prod.id.slice(0, 8)}... | v{prod.version}
                    </div>
                  </TableCell>

                  {/* Category */}
                  <TableCell className="px-6">
                    <Badge variant="secondary" className="font-normal text-[10px] uppercase border-border/50">
                      {prod.category}
                    </Badge>
                  </TableCell>

                  {/* Price */}
                  <TableCell className="px-6 font-medium text-foreground">
                    ₹{(prod.price / 100).toLocaleString("en-IN")}
                  </TableCell>

                  {/* Status Icons */}
                  <TableCell className="px-6">
                    <div className="flex items-center gap-2">
                      {prod.published ? (
                        <Badge variant="default" className="text-[9px] uppercase px-1.5 h-4.5 bg-foreground text-background">
                          Public
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[9px] uppercase px-1.5 h-4.5 text-muted-foreground border-muted-foreground/30">
                          Draft
                        </Badge>
                      )}
                      {prod.featured && (
                        <Badge variant="outline" className="text-[9px] uppercase px-1.5 h-4.5 text-amber-500 border-amber-500/20 bg-amber-500/5">
                          Featured
                        </Badge>
                      )}
                    </div>
                  </TableCell>

                  {/* Action Buttons */}
                  <TableCell className="px-6 text-right">
                    <AdminActions productId={prod.id} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
