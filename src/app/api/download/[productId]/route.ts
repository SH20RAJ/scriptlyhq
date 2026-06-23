import { NextResponse } from "next/server";
import { db } from "../../../../db";
import { products, orders, downloads, users } from "../../../../db/schema";
import { eq, and, sql } from "drizzle-orm";
import { hexclave } from "../../../../lib/hexclave";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  let product: any = null;
  try {
    const { productId } = await params;

    // Authenticate user with Hexclave
    const hexclaveUser = await hexclave.getUser();
    if (!hexclaveUser) {
      return new Response("Unauthorized: Please sign in.", { status: 401 });
    }

    // Fetch user from DB to check role
    const dbUser = await db.query.users.findFirst({
      where: eq(users.id, hexclaveUser.id),
    });

    const isAdmin = dbUser?.role === "admin";

    // If not admin, check if user has purchased this product
    let orderRecord = null;
    if (!isAdmin) {
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

    // Fetch product details
    product = await db.query.products.findFirst({
      where: eq(products.id, productId),
    });

    if (!product || !product.fileUrl) {
      return new Response("Product file not found.", { status: 404 });
    }

    // Log the download event
    try {
      await db.insert(downloads).values({
        id: crypto.randomUUID(),
        userId: hexclaveUser.id,
        productId: productId,
        orderId: orderRecord ? orderRecord.id : "admin_download",
      });

      // Increment product downloads count
      await db
        .update(products)
        .set({
          downloadsCount: sql`${products.downloadsCount} + 1`,
        })
        .where(eq(products.id, productId));
    } catch (dbErr) {
      console.error("Failed to log download event:", dbErr);
    }

    // Handle remote storage download stream with redirect fallback
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
              "Content-Disposition": `attachment; filename="${baseName}"`,
            },
          });
        }
      } catch (err) {
        console.error("Edge fetch download failed, falling back to direct redirect:", err);
      }
      
      // Fallback: Redirect directly to the remote URL
      return NextResponse.redirect(new URL(product.fileUrl));
    }

    // Fallback for local paths: redirect relative to host
    return NextResponse.redirect(new URL(product.fileUrl, req.url));
  } catch (error) {
    console.error("Secure download error:", error);
    if (product && product.fileUrl) {
      try {
        const redirectUrl = product.fileUrl.startsWith("http://") || product.fileUrl.startsWith("https://")
          ? product.fileUrl
          : new URL(product.fileUrl, req.url).toString();
        return NextResponse.redirect(new URL(redirectUrl));
      } catch (redirectError) {
        console.error("Failed to redirect to fileUrl in catch block:", redirectError);
      }
    }
    return new Response("Internal Server Error", { status: 500 });
  }
}
