import { NextResponse } from "next/server";
import getDB from "@/lib/mongodb";
import { verifyAdminToken } from "@/lib/auth";

export async function GET(req) {
  const admin = await verifyAdminToken();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const { db } = await getDB();
  
  // মোট ইউজারের সংখ্যা বের করা (প্যাজিনেশনের জন্য)
  const totalUsers = await db.collection("users").countDocuments();
  
  const users = await db
    .collection("users")
    .find({})
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();

  return NextResponse.json({ 
    ok: true, 
    users, 
    totalPages: Math.ceil(totalUsers / limit),
    totalUsers,
    currentPage: page
  });
}