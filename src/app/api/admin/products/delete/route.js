
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import getDB from "@/lib/mongodb";
import { verifyAdmin } from "@/lib/verifyAdmin";

export async function DELETE(req, { params }) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { db } = await getDB();

    await db.collection("products").deleteOne({
      _id: new ObjectId(params.id),
    });

    return NextResponse.json({ ok: true });

  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
