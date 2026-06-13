import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../db";
import { coupons } from "../../../../db/schema";
import { eq, desc } from "drizzle-orm";
import { isAdmin } from "../../../../lib/auth-utils";

export async function GET() {
  const authorized = await isAdmin();
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized: Admin access required." }, { status: 401 });
  }

  try {
    const list = await db.query.coupons.findMany({
      orderBy: [desc(coupons.createdAt)],
    });
    return NextResponse.json({ success: true, coupons: list });
  } catch (error) {
    console.error("GET admin coupons failed:", error);
    return NextResponse.json({ error: "Server error fetching coupons." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authorized = await isAdmin();
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized: Admin access required." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { code, discountType, discountValue, minPurchaseAmount } = body;

    if (!code || !discountType || discountValue === undefined) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const codeUpper = code.trim().toUpperCase();

    // Check if code already exists
    const existing = await db.query.coupons.findFirst({
      where: eq(coupons.code, codeUpper),
    });

    if (existing) {
      return NextResponse.json({ error: "A coupon with this code already exists." }, { status: 409 });
    }

    const id = crypto.randomUUID();

    await db.insert(coupons).values({
      id,
      code: codeUpper,
      discountType,
      discountValue: parseInt(discountValue, 10),
      minPurchaseAmount: minPurchaseAmount ? parseInt(minPurchaseAmount, 10) : 0,
      active: true,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST admin coupons failed:", error);
    return NextResponse.json({ error: "Server error creating coupon." }, { status: 500 });
  }
}
export const dynamic = "force-dynamic";
