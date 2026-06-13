export const dynamic = "force-dynamic";

import { db } from "../../../db";
import { products } from "../../../db/schema";
import { desc, sql, ilike, and, asc } from "drizzle-orm";
import Link from "next/link";
import { Plus, AlertCircle } from "lucide-react";
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
import { Card } from "@/components/ui/card";
import { AdminActions } from "./AdminActions";
import AdminSearchSort from "./AdminSearchSort";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    sort?: string;
  }>;
}

export default async function AdminProductsPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const currentPage = parseInt(resolvedParams.page || "1", 10) || 1;
  const currentSearch = resolvedParams.search || "";
  const currentSort = resolvedParams.sort || "newest";
  const limit = 50;
  const offset = (currentPage - 1) * limit;

  // Build the where clause for search
  const whereClause = currentSearch ? ilike(products.title, `%${currentSearch}%`) : undefined;

  // Build the order by clause for sort
  let orderBy;
  switch (currentSort) {
    case "oldest":
      orderBy = [asc(products.createdAt)];
      break;
    case "price_asc":
      orderBy = [asc(products.price)];
      break;
    case "price_desc":
      orderBy = [desc(products.price)];
      break;
    case "title_asc":
      orderBy = [asc(products.title)];
      break;
    case "title_desc":
      orderBy = [desc(products.title)];
      break;
    case "newest":
    default:
      orderBy = [desc(products.createdAt)];
      break;
  }

  // Query total product count with filter
  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(products)
    .where(whereClause);
  const totalCount = Number(countResult[0]?.count || 0);

  // Fetch paginated products list with filter and sort
  const productsList = await db.query.products.findMany({
    where: whereClause,
    orderBy: orderBy,
    limit,
    offset,
  });

  const totalPages = Math.ceil(totalCount / limit);

  const getPageLink = (pageNum: number) => {
    const params = new URLSearchParams();
    if (pageNum > 1) params.set("page", pageNum.toString());
    if (currentSearch) params.set("search", currentSearch);
    if (currentSort !== "newest") params.set("sort", currentSort);
    const queryString = params.toString();
    return `/admin/products${queryString ? `?${queryString}` : ""}`;
  };

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

      <AdminSearchSort />

      {/* Products Table Card */}
      {totalCount === 0 ? (
        <div className="text-center py-24 border border-dashed border-border rounded-xl bg-card/30">
          <AlertCircle className="w-10 h-10 mx-auto text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground">
            {currentSearch ? `No results found for "${currentSearch}"` : "Your catalog is currently empty."}
          </p>
          {!currentSearch && (
            <Button asChild variant="link" className="mt-2 text-foreground">
              <Link href="/admin/products/new">Create your first product</Link>
            </Button>
          )}
        </div>
      ) : (
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
              {productsList.map((prod) => (
                <TableRow key={prod.id} className="border-border hover:bg-muted/20 transition-colors group">
                  
                  {/* Thumbnail & Product Details */}
                  <TableCell className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 rounded-lg border border-border bg-muted overflow-hidden flex-shrink-0">
                        {prod.thumbnail ? (
                          <img
                            src={prod.thumbnail}
                            alt=""
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[8px] font-black uppercase text-muted-foreground bg-muted/40 tracking-wider">
                            No Img
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">
                          {prod.title}
                        </div>
                        <div className="text-[10px] font-mono text-muted-foreground mt-1 uppercase tracking-tighter opacity-70">
                          ID: {prod.id.slice(0, 8)}... | v{prod.version}
                        </div>
                      </div>
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
                    ${(prod.price / 100).toFixed(2)}
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
                    <AdminActions productId={prod.id} productSlug={prod.slug} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-border/40 bg-muted/5">
              <div className="text-xs text-muted-foreground font-medium">
                Showing <span className="font-semibold text-foreground">{offset + 1}</span> to{" "}
                <span className="font-semibold text-foreground">
                  {Math.min(offset + limit, totalCount)}
                </span>{" "}
                of <span className="font-semibold text-foreground">{totalCount}</span> products
              </div>
              <div className="flex items-center gap-2">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className={`rounded-lg cursor-pointer ${currentPage <= 1 ? "pointer-events-none opacity-50" : ""}`}
                >
                  <Link href={getPageLink(currentPage - 1)}>Previous</Link>
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const pageNum = idx + 1;
                    const isCurrent = pageNum === currentPage;
                    return (
                      <Button
                        key={pageNum}
                        asChild
                        variant={isCurrent ? "default" : "outline"}
                        size="sm"
                        className="h-8 w-8 p-0 rounded-lg cursor-pointer"
                      >
                        <Link href={getPageLink(pageNum)}>{pageNum}</Link>
                      </Button>
                    );
                  })}
                </div>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className={`rounded-lg cursor-pointer ${currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}`}
                >
                  <Link href={getPageLink(currentPage + 1)}>Next</Link>
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

