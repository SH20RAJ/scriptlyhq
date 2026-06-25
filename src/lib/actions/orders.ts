"use server";

import Razorpay from "razorpay";
import { getOrCreateDbUser } from "@/lib/auth-utils";
import { db } from "@/db";
import { products, orders, coupons, users, payouts } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import crypto from "crypto";
import { getProductEffectivePrice } from "@/lib/price-utils";

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
  addOnEditCopy = false,
  addOnSetupDeploy = false,
}: {
  productId?: string;
  productIds?: string[];
  couponCode?: string;
  addOnEditCopy?: boolean;
  addOnSetupDeploy?: boolean;
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
  const rawProducts = await db.query.products.findMany({
    where: inArray(products.id, idsToFetch),
  });

  if (rawProducts.length === 0) {
    throw new Error("None of the selected products were found.");
  }

  // Apply active promotions to products
  const selectedProducts = rawProducts.map(p => {
    const promo = getProductEffectivePrice(p);
    return {
      ...p,
      originalPrice: p.price,
      price: promo.effectivePrice, // Use promotion price (discounted or 0 if free)
    };
  });

  // Calculate Addon Costs per product (1/3rd of original MRP per add-on)
  const selectedProductsWithAddons = selectedProducts.map(p => {
    let addonPrice = 0;
    if (addOnEditCopy) {
      addonPrice += Math.round(p.originalPrice / 3);
    }
    if (addOnSetupDeploy) {
      addonPrice += Math.round(p.originalPrice / 3);
    }
    return {
      ...p,
      addonPrice,
    };
  });

  const totalAddonCost = selectedProductsWithAddons.reduce((sum, p) => sum + p.addonPrice, 0);

  // Calculate Subtotal (USD cents) (without addons)
  const subtotal = selectedProducts.reduce((sum, p) => sum + p.price, 0);

  // 1. Calculate Automatic 20% Discount over $60.00 (6000 cents)
  let autoDiscount = 0;
  if (subtotal >= 6000) {
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

    if (coupon && coupon.active) {
      if (coupon.creatorId) {
        // Find cart products belonging to this coupon creator
        const creatorItems = selectedProducts.filter(p => p.creatorId === coupon.creatorId);
        const creatorSubtotal = creatorItems.reduce((sum, p) => sum + p.price, 0);

        if (creatorSubtotal > 0 && amountAfterAuto >= coupon.minPurchaseAmount) {
          validatedCouponCode = coupon.code;
          if (coupon.discountType === "percentage") {
            couponDiscount = Math.round(creatorSubtotal * (coupon.discountValue / 100));
          } else if (coupon.discountType === "fixed") {
            couponDiscount = Math.min(coupon.discountValue, creatorSubtotal);
          }
        }
      } else {
        // Global coupon
        if (amountAfterAuto >= coupon.minPurchaseAmount) {
          validatedCouponCode = coupon.code;
          if (coupon.discountType === "percentage") {
            couponDiscount = Math.round(amountAfterAuto * (coupon.discountValue / 100));
          } else if (coupon.discountType === "fixed") {
            couponDiscount = Math.min(coupon.discountValue, amountAfterAuto);
          }
        }
      }
    }
  }

  const totalDiscount = autoDiscount + couponDiscount;
  const finalAmount = Math.max(subtotal - totalDiscount, 0) + totalAddonCost;

  // Check if checkout is free
  if (finalAmount === 0) {
    const freeOrderId = "free_checkout_" + crypto.randomBytes(8).toString("hex");
    const insertedOrders = [];

    for (let i = 0; i < selectedProductsWithAddons.length; i++) {
      const product = selectedProductsWithAddons[i];
      const orderId = crypto.randomUUID();

      await db.insert(orders).values({
        id: orderId,
        userId: user.id,
        productId: product.id,
        razorpayOrderId: freeOrderId,
        razorpayPaymentId: "free_pay_" + crypto.randomBytes(8).toString("hex"),
        amount: 0,
        status: "completed", // Completed instantly
        couponCode: validatedCouponCode,
        discountApplied: product.originalPrice - product.price + Math.round(totalDiscount / selectedProducts.length),
        addOnEditCopy,
        addOnSetupDeploy,
      });

      insertedOrders.push({ id: orderId, productTitle: product.title });
    }

    return {
      success: true,
      isFreeCheckout: true,
      razorpayOrderId: freeOrderId,
      redirectUrl: `/purchase-success?orderId=${insertedOrders[0].id}`,
      amount: 0,
      key: "",
      productName: selectedProducts.length === 1 ? selectedProducts[0].title : `${selectedProducts.length} items in Cart`,
      userEmail: user.email,
      userName: user.name || "",
      isMock: true,
    };
  }

  const razorpayAmount = Math.max(finalAmount, 100); // Minimum $1.00 for checkout

  // Fetch live exchange rate from USD to INR, fallback to 95 if API fails
  let usdToInrRate = 95;
  try {
    const exchangeRes = await fetch("https://open.er-api.com/v6/latest/USD", {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    if (exchangeRes.ok) {
      const exchangeData = await exchangeRes.json() as { rates?: Record<string, number> };
      const liveRate = exchangeData.rates?.["INR"];
      if (liveRate && liveRate > 0) {
        usdToInrRate = liveRate;
      }
    }
  } catch (err) {
    console.error("Failed to fetch live USD to INR exchange rate. Falling back to 95.", err);
  }

  const finalAmountInInrPaise = Math.round(razorpayAmount * usdToInrRate);

  // 3. Compile transfers array for Razorpay Route
  const transfers: any[] = [];
  let distributedAmountSum = 0;
  let distributedDiscountSum = 0;

  // Query creators
  const creatorIds = selectedProducts.map(p => p.creatorId).filter(Boolean) as string[];
  const productCreators = creatorIds.length > 0
    ? await db.query.users.findMany({ where: inArray(users.id, creatorIds) })
    : [];

  for (let i = 0; i < selectedProductsWithAddons.length; i++) {
    const product = selectedProductsWithAddons[i];
    const isLast = i === selectedProductsWithAddons.length - 1;

    let itemAmount = 0;
    if (isLast) {
      itemAmount = (razorpayAmount - totalAddonCost) - distributedAmountSum;
    } else {
      const ratio = product.price / subtotal;
      itemAmount = Math.round((razorpayAmount - totalAddonCost) * ratio);
      distributedAmountSum += itemAmount;
    }

    // Add product-specific addon price to its item amount
    itemAmount += product.addonPrice;

    const itemAmountInInrPaise = Math.round(itemAmount * usdToInrRate);
    const creatorSplitInInrPaise = Math.round(itemAmountInInrPaise * 0.95);

    const creator = productCreators.find(c => c.id === product.creatorId);
    if (creator?.razorpayAccountId && creatorSplitInInrPaise > 0) {
      transfers.push({
        account: creator.razorpayAccountId,
        amount: creatorSplitInInrPaise,
        currency: "INR",
        notes: {
          info: `Split transfer for product: ${product.title.slice(0, 30)}`,
        },
        linked_to: ["payment"],
        on_hold: false,
      });
    }
  }

  // Generate Razorpay Order
  let rzpOrderId = "rzp_order_mock_" + crypto.randomBytes(8).toString("hex");
  const isMockKeys = (process.env.RAZORPAY_KEY_ID || "").startsWith("rzp_test_mock");

  if (!isMockKeys) {
    try {
      const razorpay = getRazorpay();
      const rzpPayload: any = {
        amount: finalAmountInInrPaise, // INR paise
        currency: "INR",
        receipt: crypto.randomUUID(),
      };

      if (transfers.length > 0) {
        rzpPayload.transfers = transfers;
      }

      const rzpOrder = await razorpay.orders.create(rzpPayload);
      rzpOrderId = rzpOrder.id;
    } catch (error) {
      console.error("Razorpay order creation failed, falling back to mock:", error);
    }
  }

  // Proportionally distribute the discounts and paid amounts among orders (in USD cents)
  const insertedOrders = [];
  distributedAmountSum = 0;
  distributedDiscountSum = 0;

  for (let i = 0; i < selectedProductsWithAddons.length; i++) {
    const product = selectedProductsWithAddons[i];
    const isLast = i === selectedProductsWithAddons.length - 1;

    let itemDiscount = 0;
    let itemAmount = 0;

    if (isLast) {
      itemDiscount = totalDiscount - distributedDiscountSum;
      itemAmount = (razorpayAmount - totalAddonCost) - distributedAmountSum;
    } else {
      const ratio = product.price / subtotal;
      itemDiscount = Math.round(totalDiscount * ratio);
      itemAmount = Math.round((razorpayAmount - totalAddonCost) * ratio);

      distributedDiscountSum += itemDiscount;
      distributedAmountSum += itemAmount;
    }

    // Add product-specific addon price to its item amount
    itemAmount += product.addonPrice;

    const orderId = crypto.randomUUID();

    await db.insert(orders).values({
      id: orderId,
      userId: user.id,
      productId: product.id,
      razorpayOrderId: rzpOrderId,
      amount: itemAmount,
      status: "pending",
      couponCode: validatedCouponCode,
      discountApplied: itemDiscount + (product.originalPrice - product.price),
      addOnEditCopy,
      addOnSetupDeploy,
    });

    insertedOrders.push({ id: orderId, productTitle: product.title });
  }

  return {
    success: true,
    razorpayOrderId: rzpOrderId,
    amount: finalAmountInInrPaise, // INR paise
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

    // Route split automation auto-logging
    for (const order of orderRecords) {
      const product = await db.query.products.findFirst({ where: eq(products.id, order.productId) });
      if (product?.creatorId) {
        const creator = await db.query.users.findFirst({ where: eq(users.id, product.creatorId) });
        if (creator?.razorpayAccountId && order.amount > 0) {
          const creatorSplitCents = Math.round(order.amount * 0.95);
          await db.insert(payouts).values({
            id: crypto.randomUUID(),
            userId: creator.id,
            amount: creatorSplitCents,
            status: "processed",
            payoutMethod: "bank",
            paypalEmail: creator.paypalEmail || null,
            payoutDetails: `Automated Razorpay Route Split payout for Order ID: ${order.id}`,
            createdAt: new Date(),
          });
        }
      }
    }

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
