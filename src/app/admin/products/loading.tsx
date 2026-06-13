import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";

export default function AdminProductsLoading() {
  return (
    <div className="space-y-12">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between border-b border-border pb-8">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 rounded-md" />
          <Skeleton className="h-4 w-72 rounded-md" />
        </div>
        <Skeleton className="h-11 w-32 rounded-lg" />
      </div>

      {/* Table Card Skeleton */}
      <Card className="border-border bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="w-[45%] px-6">Product Details</TableHead>
              <TableHead className="px-6">Category</TableHead>
              <TableHead className="px-6">Price</TableHead>
              <TableHead className="px-6">Status</TableHead>
              <TableHead className="px-6 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 6 }).map((_, idx) => (
              <TableRow key={idx} className="border-border hover:bg-transparent">
                {/* Details Cell */}
                <TableCell className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-12 h-12 rounded-lg shrink-0" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-48 rounded-md" />
                      <Skeleton className="h-3 w-32 rounded-md" />
                    </div>
                  </div>
                </TableCell>
                
                {/* Category Cell */}
                <TableCell className="px-6">
                  <Skeleton className="h-6 w-20 rounded-full" />
                </TableCell>
                
                {/* Price Cell */}
                <TableCell className="px-6">
                  <Skeleton className="h-4 w-12 rounded-md" />
                </TableCell>
                
                {/* Status Cell */}
                <TableCell className="px-6">
                  <div className="flex gap-2">
                    <Skeleton className="h-5.5 w-14 rounded-md" />
                  </div>
                </TableCell>
                
                {/* Actions Cell */}
                <TableCell className="px-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-8 w-8 rounded-lg" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {/* Pagination control skeleton footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border/40 bg-muted/5">
          <Skeleton className="h-4 w-48 rounded-md" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-16 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-16 rounded-md" />
          </div>
        </div>
      </Card>
    </div>
  );
}
