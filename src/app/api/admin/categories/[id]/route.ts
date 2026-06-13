import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../../db";
import { categories, subcategories } from "../../../../../db/schema";
import { eq } from "drizzle-orm";
import { isAdmin } from "../../../../../lib/auth-utils";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authorized = await isAdmin();
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized: Admin access required." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type"); // 'category' or 'subcategory'

  if (!type) {
    return NextResponse.json({ error: "Type query parameter is required." }, { status: 400 });
  }

  try {
    const { id } = await params;

    if (type === "category") {
      await db.delete(categories).where(eq(categories.id, id));
      return NextResponse.json({ success: true });
    } else if (type === "subcategory") {
      await db.delete(subcategories).where(eq(subcategories.id, id));
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Invalid type parameter." }, { status: 400 });
    }
  } catch (error) {
    console.error("DELETE admin category failed:", error);
    return NextResponse.json({ error: "Server error deleting category or subcategory." }, { status: 500 });
  }
}
export const dynamic = "force-dynamic";
