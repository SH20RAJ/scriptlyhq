import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../../db";
import { coupons } from "../../../../../db/schema";
import { eq } from "drizzle-orm";
import { isAdmin } from "../../../../../lib/auth-utils";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authorized = await isAdmin();
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized: Admin access required." }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { active } = body;

    if (active === undefined) {
      return NextResponse.json({ error: "Active status is required." }, { status: 400 });
    }

    await db
      .update(coupons)
      .set({ active, updatedAt: new Date() })
      .where(eq(coupons.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH admin coupon failed:", error);
    return NextResponse.json({ error: "Server error updating coupon." }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authorized = await isAdmin();
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized: Admin access required." }, { status: 401 });
  }

  try {
    const { id } = await params;

    await db.delete(coupons).where(eq(coupons.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE admin coupon failed:", error);
    return NextResponse.json({ error: "Server error deleting coupon." }, { status: 500 });
  }
}
export const dynamic = "force-dynamic";
