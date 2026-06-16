import { NextResponse } from "next/server";
import { db } from "../../../../db";
import { products, orders, downloads, users } from "../../../../db/schema";
import { eq, and } from "drizzle-orm";
import { hexclave } from "../../../../lib/hexclave";
import fs from "fs/promises";
import path from "path";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
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
    const product = await db.query.products.findFirst({
      where: eq(products.id, productId),
    });

    if (!product || !product.fileUrl) {
      return new Response("Product file not found.", { status: 404 });
    }

    // Log the download event
    await db.insert(downloads).values({
      id: crypto.randomUUID(),
      userId: hexclaveUser.id,
      productId: productId,
      orderId: orderRecord ? orderRecord.id : "admin_download",
    });

    // Read file from secure uploads folder or fetch remote URL
    let fileBuffer: Uint8Array | ArrayBuffer;
    let fileName: string;

    if (product.fileUrl.startsWith("http://") || product.fileUrl.startsWith("https://")) {
      const response = await fetch(product.fileUrl);
      if (!response.ok) {
        return new Response(`Failed to fetch file from storage: ${response.statusText}`, { status: 502 });
      }
      fileBuffer = await response.arrayBuffer();
      
      let baseName = product.fileUrl.split("/").pop()?.split("?")[0] || "";
      if (!baseName.endsWith(".zip") && !baseName.endsWith(".pdf") && !baseName.endsWith(".tar.gz")) {
        baseName = `${product.slug}.zip`;
      }
      fileName = baseName;
    } else {
      // Read file from local secure uploads folder
      const fileBuf = await fs.readFile(product.fileUrl);
      fileBuffer = new Uint8Array(fileBuf);
      fileName = path.basename(product.fileUrl);
    }

    // Stream the file back
    return new Response(fileBuffer as any, {
      headers: {
        "Content-Type": fileName.endsWith(".zip") ? "application/zip" : "application/octet-stream",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error("Secure download error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
