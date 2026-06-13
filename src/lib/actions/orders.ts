"use server";

import Razorpay from "razorpay";
import { getOrCreateDbUser } from "../auth-utils";
import { db } from "../../db";
import { products, orders, coupons } from "../../db/schema";
import { eq, inArray } from "drizzle-orm";
import crypto from "crypto";

let razorpayInstance: any = null;

function getRazorpay() {
  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_mockkeyid123",
      key_secret: process.env.RAZORPAY_KEY_SECRET || "rzp_test_mocksecret123",
    });
  }
  return razorpayInstance;
}

export async function createRazorpayOrderAction({
  productId,
  productIds,
  couponCode,
}: {
  productId?: string;
  productIds?: string[];
  couponCode?: string;
}) {
  const user = await getOrCreateDbUser();
  if (!user) {
    throw new Error("Unauthorized: Please sign in to purchase.");
  }

  // Support both single productId and array of productIds
  const idsToFetch = productIds && productIds.length > 0 
    ? productIds 
    : productId 
      ? [productId] 
      : [];

  if (idsToFetch.length === 0) {
    throw new Error("No products selected for purchase.");
  }

  // Fetch all selected products
  const selectedProducts = await db.query.products.findMany({
    where: inArray(products.id, idsToFetch),
  });

  if (selectedProducts.length === 0) {
    throw new Error("None of the selected products were found.");
  }

  // Calculate Subtotal (paise)
  const subtotal = selectedProducts.reduce((sum, p) => sum + p.price, 0);

  // 1. Calculate Automatic 20% Discount over ₹5,000 (500000 paise)
  let autoDiscount = 0;
  if (subtotal >= 500000) {
    autoDiscount = Math.round(subtotal * 0.20);
  }

  const amountAfterAuto = subtotal - autoDiscount;

  // 2. Validate and Apply Coupon if provided
  let couponDiscount = 0;
  let validatedCouponCode: string | null = null;

  if (couponCode) {
    const codeUpper = couponCode.trim().toUpperCase();
    const coupon = await db.query.coupons.findFirst({
      where: eq(coupons.code, codeUpper),
    });

    if (coupon && coupon.active && amountAfterAuto >= coupon.minPurchaseAmount) {
      validatedCouponCode = coupon.code;
      if (coupon.discountType === "percentage") {
        couponDiscount = Math.round(amountAfterAuto * (coupon.discountValue / 100));
      } else if (coupon.discountType === "fixed") {
        // cap fixed discount at the remaining amount
        couponDiscount = Math.min(coupon.discountValue, amountAfterAuto);
      }
    }
  }

  const totalDiscount = autoDiscount + couponDiscount;
  const finalAmount = Math.max(subtotal - totalDiscount, 100); // minimum ₹1.00 for Razorpay

  // Generate Razorpay Order
  let rzpOrderId = "rzp_order_mock_" + crypto.randomBytes(8).toString("hex");
  const isMockKeys = (process.env.RAZORPAY_KEY_ID || "").startsWith("rzp_test_mock");

  if (!isMockKeys) {
    try {
      const razorpay = getRazorpay();
      const rzpOrder = await razorpay.orders.create({
        amount: finalAmount,
        currency: "INR",
        receipt: crypto.randomUUID(),
      });
      rzpOrderId = rzpOrder.id;
    } catch (error) {
      console.error("Razorpay order creation failed, falling back to mock:", error);
    }
  }

  // Proportionally distribute the discounts and paid amounts among orders
  const insertedOrders = [];
  let distributedAmountSum = 0;
  let distributedDiscountSum = 0;

  for (let i = 0; i < selectedProducts.length; i++) {
    const product = selectedProducts[i];
    const isLast = i === selectedProducts.length - 1;

    let itemDiscount = 0;
    let itemAmount = 0;

    if (isLast) {
      // absorb rounding errors on the last product
      itemDiscount = totalDiscount - distributedDiscountSum;
      itemAmount = finalAmount - distributedAmountSum;
    } else {
      const ratio = product.price / subtotal;
      itemDiscount = Math.round(totalDiscount * ratio);
      itemAmount = Math.round(finalAmount * ratio);

      distributedDiscountSum += itemDiscount;
      distributedAmountSum += itemAmount;
    }

    const orderId = crypto.randomUUID();

    await db.insert(orders).values({
      id: orderId,
      userId: user.id,
      productId: product.id,
      razorpayOrderId: rzpOrderId,
      amount: itemAmount,
      status: "pending",
      couponCode: validatedCouponCode,
      discountApplied: itemDiscount,
    });

    insertedOrders.push({ id: orderId, productTitle: product.title });
  }

  return {
    success: true,
    razorpayOrderId: rzpOrderId,
    amount: finalAmount,
    key: process.env.RAZORPAY_KEY_ID || "rzp_test_mockkeyid123",
    productName: selectedProducts.length === 1 ? selectedProducts[0].title : `${selectedProducts.length} items in Cart`,
    userEmail: user.email,
    userName: user.name || "",
    isMock: isMockKeys,
  };
}

export async function verifyPaymentAction({
  razorpayPaymentId,
  razorpayOrderId,
  razorpaySignature,
}: {
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature?: string;
}) {
  const user = await getOrCreateDbUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const isMockKeys = (process.env.RAZORPAY_KEY_ID || "").startsWith("rzp_test_mock");
  let isValid = false;

  if (isMockKeys || !razorpaySignature) {
    isValid = true;
  } else {
    const text = `${razorpayOrderId}|${razorpayPaymentId}`;
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(text)
      .digest("hex");

    isValid = generatedSignature === razorpaySignature;
  }

  const orderRecords = await db.query.orders.findMany({
    where: eq(orders.razorpayOrderId, razorpayOrderId),
  });

  if (orderRecords.length === 0) {
    throw new Error("Order not found");
  }

  if (isValid) {
    await db
      .update(orders)
      .set({
        status: "completed",
        razorpayPaymentId,
      })
      .where(eq(orders.razorpayOrderId, razorpayOrderId));

    return { success: true, orderId: orderRecords[0].id };
  } else {
    await db
      .update(orders)
      .set({
        status: "failed",
        razorpayPaymentId,
      })
      .where(eq(orders.razorpayOrderId, razorpayOrderId));

    return { success: false };
  }
}
