export const dynamic = "force-dynamic";

import { db } from "../../../db";
import { products, users } from "../../../db/schema";
import { eq, and } from "drizzle-orm";
import { getOrCreateDbUser } from "../../../lib/auth-utils";
import { redirect } from "next/navigation";
import AdminApprovalsList from "../../../components/AdminApprovalsList";

export default async function AdminApprovalsPage() {
  const user = await getOrCreateDbUser();
  if (!user || user.role !== "admin") {
    redirect("/dashboard");
  }

  // Fetch all products with 'pending' status
  // Join the users table to get the creator's display name and primary email
  const pendingProducts = await db
    .select({
      id: products.id,
      title: products.title,
      slug: products.slug,
      price: products.price,
      category: products.category,
      fileUrl: products.fileUrl,
      createdAt: products.createdAt,
      creator: {
        name: users.name,
        email: users.email,
      },
    })
    .from(products)
    .leftJoin(users, eq(products.creatorId, users.id))
    .where(eq(products.status, "pending"));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Product Submissions
        </h1>
        <p className="text-sm text-neutral-400 mt-1">
          Review, download, and approve scripts submitted by creators before they are listed on the store.
        </p>
      </div>

      <AdminApprovalsList pendingItems={pendingProducts} />
    </div>
  );
}
