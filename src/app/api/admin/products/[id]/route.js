
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import getDB from "@/lib/mongodb";
import { verifyAdminToken } from "@/lib/auth";


/* ================= UPDATE PRODUCT ================= */
export async function PUT(req, { params }) {
  try {
    const admin = await verifyAdminToken();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
     
    // ভুল ছিল: const {id} = await params.id
    // সঠিক পদ্ধতি:
    const resolvedParams = await params; 
    const id = resolvedParams.id;

    const updates = await req.json();
    const { db } = await getDB();


    const { _id, ...updateData } = updates;

    const result = await db.collection("products").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("PRODUCT UPDATE ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/* ================= DELETE PRODUCT ================= */
export async function DELETE(req, { params }) {
  try {
    const admin = await verifyAdminToken(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { db } = await getDB();

        const resolvedParams = await params; 
    const id = resolvedParams.id;

    await db.collection("products").deleteOne({
      _id: new ObjectId(id),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("PRODUCT DELETE ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
