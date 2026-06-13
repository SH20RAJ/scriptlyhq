import { NextResponse } from "next/server";
import { getOrCreateDbUser } from "../../../../lib/auth-utils";

export async function GET() {
  try {
    const user = await getOrCreateDbUser();
    return NextResponse.json({ role: user?.role || "user" });
  } catch (error) {
    console.error("Error fetching user role:", error);
    return NextResponse.json({ role: "user" }, { status: 500 });
  }
}
