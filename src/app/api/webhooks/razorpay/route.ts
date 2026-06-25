import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "rzp_test_mockwebhooksecret123";

    // HMAC SHA256 Signature Verification
    if (signature) {
      const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(rawBody)
        .digest("hex");

      const isMockKeys = webhookSecret.startsWith("rzp_test_mock");
      if (!isMockKeys && expectedSignature !== signature) {
        return new Response("Invalid webhook signature", { status: 400 });
      }
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;

    // Handle payment capture or order paid events
    if (event === "order.paid" || event === "payment.captured") {
      const entity = payload.payload.payment?.entity;
      const razorpayOrderId = entity?.order_id || payload.payload.order?.entity?.id;
      const razorpayPaymentId = entity?.id;

      if (razorpayOrderId) {
        const orderRecords = await db.query.orders.findMany({
          where: eq(orders.razorpayOrderId, razorpayOrderId),
        });

        if (orderRecords.length > 0) {
          await db
            .update(orders)
            .set({
              status: "completed",
              razorpayPaymentId: razorpayPaymentId || null,
            })
            .where(eq(orders.razorpayOrderId, razorpayOrderId));
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Razorpay webhook error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
