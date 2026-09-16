import { NextResponse } from "next/server";
import { db } from "@/db";
import { products, orders, downloads, users } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { hexclave } from "@/lib/hexclave";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;

    // Authenticate user with Hexclave
    const hexclaveUser = await hexclave.getUser();
    if (!hexclaveUser) {
      return new Response("Unauthorized: Please sign in to download.", { status: 401 });
    }

    // Fetch user from DB to check role
    const dbUser = await db.query.users.findFirst({
      where: eq(users.id, hexclaveUser.id),
    });

    const isAdmin = dbUser?.role === "admin";

    // Fetch product details
    const product = await db.query.products.findFirst({
      where: eq(products.id, productId),
    });

    if (!product || !product.fileUrl) {
      return new Response("Product or file not found.", { status: 404 });
    }

    // If not admin and not free, verify completed purchase entitlement
    let orderRecord = null;
    if (!isAdmin && !product.isFree) {
      orderRecord = await db.query.orders.findFirst({
        where: and(
          eq(orders.userId, hexclaveUser.id),
          eq(orders.productId, productId),
          eq(orders.status, "completed")
        ),
      });

      if (!orderRecord) {
        return new Response("Forbidden: You have not purchased this product.", { status: 403 });
      }
    }

    // Log the download audit event
    try {
      await db.insert(downloads).values({
        id: crypto.randomUUID(),
        userId: hexclaveUser.id,
        productId: productId,
        orderId: orderRecord ? orderRecord.id : (isAdmin ? "admin_download" : "free_download"),
      });

      // Increment product downloads count atomically
      await db
        .update(products)
        .set({
          downloadsCount: sql`${products.downloadsCount} + 1`,
        })
        .where(eq(products.id, productId));
    } catch (dbErr) {
      console.error("Failed to log download audit event:", dbErr);
    }

    // Handle remote storage downloads
    if (product.fileUrl.startsWith("http://") || product.fileUrl.startsWith("https://")) {
      if (product.redirectDownload) {
        return NextResponse.redirect(new URL(product.fileUrl));
      }

      try {
        const response = await fetch(product.fileUrl);
        if (response.ok) {
          const fileBuffer = await response.arrayBuffer();
          let baseName = product.fileUrl.split("/").pop()?.split("?")[0] || "";
          if (!baseName.endsWith(".zip") && !baseName.endsWith(".pdf") && !baseName.endsWith(".tar.gz")) {
            baseName = `${product.slug}.zip`;
          }
          return new Response(fileBuffer as any, {
            headers: {
              "Content-Type": baseName.endsWith(".zip") ? "application/zip" : "application/octet-stream",
              "Content-Disposition": `attachment; filename="${encodeURIComponent(baseName)}"`,
              "X-Content-Type-Options": "nosniff",
              "Cache-Control": "private, no-cache, no-store, must-revalidate",
            },
          });
        }
      } catch (err) {
        console.error("Fetch download failed, falling back to direct URL redirect:", err);
      }
      
      return NextResponse.redirect(new URL(product.fileUrl));
    }

    // Local path handling: strictly prevent directory traversal
    const safePath = product.fileUrl.replace(/\.\./g, "");
    return NextResponse.redirect(new URL(safePath, req.url));
  } catch (error) {
    console.error("Secure download authorization error:", error);
    return new Response("Internal Server Error: Unable to process secure download.", { status: 500 });
  }
}
