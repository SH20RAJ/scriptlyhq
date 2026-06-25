import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AdminLoading() {
  return (
    <div className="space-y-12">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-2 border-b border-border/60 pb-8">
        <Skeleton className="h-9 w-32 rounded-md" />
        <Skeleton className="h-4 w-64 rounded-md" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, idx) => (
          <Card key={idx} className="border-border/50 bg-card/50 rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-6">
              <Skeleton className="h-3 w-16 rounded-sm" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-2">
              <Skeleton className="h-8 w-24 rounded-md" />
              <Skeleton className="h-3 w-32 rounded-sm" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-28 rounded-sm" />
          <div className="h-px flex-1 bg-border/40" />
        </div>

        <Card className="border-border/50 bg-card/50 rounded-[2rem] overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="border-border/40 hover:bg-transparent">
                <TableHead className="px-8 h-12 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Customer</TableHead>
                <TableHead className="px-8 h-12 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Product</TableHead>
                <TableHead className="px-8 h-12 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Amount</TableHead>
                <TableHead className="px-8 h-12 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</TableHead>
                <TableHead className="px-8 h-12 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 6 }).map((_, idx) => (
                <TableRow key={idx} className="border-border/40 hover:bg-transparent">
                  <TableCell className="px-8 py-5">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-28 rounded-md" />
                      <Skeleton className="h-3 w-36 rounded-md" />
                    </div>
                  </TableCell>
                  <TableCell className="px-8 py-5">
                    <Skeleton className="h-4 w-48 rounded-md" />
                  </TableCell>
                  <TableCell className="px-8 py-5">
                    <Skeleton className="h-4 w-12 rounded-md" />
                  </TableCell>
                  <TableCell className="px-8 py-5">
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </TableCell>
                  <TableCell className="px-8 py-5 text-right flex justify-end">
                    <Skeleton className="h-4.5 w-10 rounded-md" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
