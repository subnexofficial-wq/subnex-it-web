
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import getDB from "@/lib/mongodb";
import { verifyAdmin } from "@/lib/verifyAdmin";

export async function PUT(req, { params }) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const updates = await req.json();
    const { db } = await getDB();

    await db.collection("products").updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          ...updates,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({ ok: true });

  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
