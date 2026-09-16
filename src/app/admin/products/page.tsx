export const dynamic = "force-dynamic";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products",
};

import { db } from "@/db";
import { products } from "@/db/schema";
import { desc, sql, ilike, asc, and, eq } from "drizzle-orm";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminSearchSort from "@/app/admin/products/AdminSearchSort";
import AdminProductsTable from "@/app/admin/products/AdminProductsTable";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    sort?: string;
    status?: string;
  }>;
}

export default async function AdminProductsPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const currentPage = parseInt(resolvedParams.page || "1", 10) || 1;
  const currentSearch = resolvedParams.search || "";
  const currentSort = resolvedParams.sort || "newest";
  const currentStatus = resolvedParams.status || "all";
  const limit = 50;
  const offset = (currentPage - 1) * limit;

  // Build the where conditions
  const conditions = [];
  if (currentSearch) {
    conditions.push(ilike(products.title, `%${currentSearch}%`));
  }
  if (currentStatus === "published") {
    conditions.push(eq(products.published, true));
  } else if (currentStatus === "draft") {
    conditions.push(eq(products.published, false));
  } else if (currentStatus === "featured") {
    conditions.push(eq(products.featured, true));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

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

  // Parallel database operations
  const [
    allCountRes,
    publishedCountRes,
    draftCountRes,
    featuredCountRes,
    countResult,
    productsList,
  ] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(products),
    db.select({ count: sql<number>`count(*)` }).from(products).where(eq(products.published, true)),
    db.select({ count: sql<number>`count(*)` }).from(products).where(eq(products.published, false)),
    db.select({ count: sql<number>`count(*)` }).from(products).where(eq(products.featured, true)),
    db.select({ count: sql<number>`count(*)` }).from(products).where(whereClause),
    db.query.products.findMany({
      where: whereClause,
      orderBy: orderBy,
      limit,
      offset,
    }),
  ]);

  const allCount = Number(allCountRes[0]?.count || 0);
  const publishedCount = Number(publishedCountRes[0]?.count || 0);
  const draftCount = Number(draftCountRes[0]?.count || 0);
  const featuredCount = Number(featuredCountRes[0]?.count || 0);
  const totalCount = Number(countResult[0]?.count || 0);
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="space-y-8">
      {/* Header with CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Product Catalog
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Manage your digital assets, draft status, and publishing workflows.
          </p>
        </div>

        <Button asChild className="rounded-xl font-bold h-11 px-5 self-start sm:self-auto">
          <Link href="/admin/products/new">
            <Plus className="w-4 h-4 mr-2" />
            New Product
          </Link>
        </Button>
      </div>

      <AdminSearchSort />

      <AdminProductsTable
        products={productsList.map((p) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          category: p.category,
          price: p.price,
          published: p.published,
          featured: p.featured,
          version: p.version,
          thumbnail: p.thumbnail,
          createdAt: p.createdAt,
        }))}
        totalCount={totalCount}
        allCount={allCount}
        publishedCount={publishedCount}
        draftCount={draftCount}
        featuredCount={featuredCount}
        currentPage={currentPage}
        totalPages={totalPages}
        limit={limit}
        currentStatus={currentStatus}
        currentSearch={currentSearch}
        currentSort={currentSort}
      />
    </div>
  );
}
