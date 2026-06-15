import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../db";
import { coupons, products } from "../../../../db/schema";
import { eq, inArray } from "drizzle-orm";
import { getProductEffectivePrice } from "../../../../lib/price-utils";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code")?.trim().toUpperCase();
  const amountStr = searchParams.get("amount");
  const productIdsStr = searchParams.get("productIds");

  if (!code) {
    return NextResponse.json({ success: false, message: "Coupon code is required." }, { status: 400 });
  }

  const amount = amountStr ? parseInt(amountStr, 10) : 0;
  const productIds = productIdsStr ? productIdsStr.split(",").map(id => id.trim()).filter(Boolean) : [];

  try {
    const coupon = await db.query.coupons.findFirst({
      where: eq(coupons.code, code),
    });

    if (!coupon) {
      return NextResponse.json({ success: false, message: "Coupon code does not exist." });
    }

    if (!coupon.active) {
      return NextResponse.json({ success: false, message: "This coupon code is inactive." });
    }

    // Creator specific coupon check
    if (coupon.creatorId) {
      if (productIds.length === 0) {
        return NextResponse.json({
          success: false,
          message: "This is a store-specific coupon. Product selection is required to validate it.",
        });
      }

      // Query products in cart
      const cartProducts = await db.query.products.findMany({
        where: inArray(products.id, productIds),
      });

      // Filter products belonging to coupon creator
      const eligibleProducts = cartProducts.filter(p => p.creatorId === coupon.creatorId);

      if (eligibleProducts.length === 0) {
        return NextResponse.json({
          success: false,
          message: "This coupon is only valid for items from a specific creator's store, which are not present in your cart.",
        });
      }

      // Calculate effective price of eligible items
      const eligibleSubtotal = eligibleProducts.reduce((sum, p) => {
        const promo = getProductEffectivePrice(p);
        return sum + promo.effectivePrice;
      }, 0);

      if (eligibleSubtotal < coupon.minPurchaseAmount) {
        const minAmountInUSD = (coupon.minPurchaseAmount / 100).toFixed(2);
        return NextResponse.json({
          success: false,
          message: `This coupon requires a minimum purchase of $${minAmountInUSD} USD of items from this store.`,
        });
      }
    } else {
      // Global coupon
      if (amount < coupon.minPurchaseAmount) {
        const minAmountInUSD = (coupon.minPurchaseAmount / 100).toFixed(2);
        return NextResponse.json({
          success: false,
          message: `This coupon requires a minimum purchase of $${minAmountInUSD} USD.`,
        });
      }
    }

    return NextResponse.json({
      success: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        creatorId: coupon.creatorId,
      },
    });
  } catch (error) {
    console.error("Coupon validation error:", error);
    return NextResponse.json({ success: false, message: "Server error validating coupon." }, { status: 500 });
  }
}
export const dynamic = "force-dynamic";
