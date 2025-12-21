import { NextResponse } from "next/server";
import getDB from "@/lib/mongodb";
import { verifyAdminToken } from "@/lib/auth";

export async function GET() {
  const admin = await verifyAdminToken(); 

  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { db } = await getDB();
  const users = await db
    .collection("users")
    .find({})
    .sort({ createdAt: -1 })
    .project({ password: 0 })
    .toArray();

  return NextResponse.json({ ok: true, users });
}
