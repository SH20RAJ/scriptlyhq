import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../db";
import { coupons } from "../../../../db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code")?.trim().toUpperCase();
  const amountStr = searchParams.get("amount");

  if (!code) {
    return NextResponse.json({ success: false, message: "Coupon code is required." }, { status: 400 });
  }

  const amount = amountStr ? parseInt(amountStr, 10) : 0;

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

    if (amount < coupon.minPurchaseAmount) {
      const minAmountInUSD = (coupon.minPurchaseAmount / 100).toFixed(2);
      return NextResponse.json({
        success: false,
        message: `This coupon requires a minimum purchase of $${minAmountInUSD} USD.`,
      });
    }

    return NextResponse.json({
      success: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
      },
    });
  } catch (error) {
    console.error("Coupon validation error:", error);
    return NextResponse.json({ success: false, message: "Server error validating coupon." }, { status: 500 });
  }
}
export const dynamic = "force-dynamic";
