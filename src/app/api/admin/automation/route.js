import { NextResponse } from "next/server";
import getDB from "@/lib/mongodb";
import { verifyAdminToken } from "@/lib/auth";

/* ===============================
   GET: Admin Dashboard
================================ */
export async function GET() {
  try {
    const { db } = await getDB();
    const data = await db
      .collection("automation_settings")
      .find({})
      .toArray();

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/* ===============================
   POST: Create category
================================ */
export async function POST(req) {
  try {
    const admin = await verifyAdminToken();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const { db } = await getDB();

    if (!data.category) {
      return NextResponse.json(
        { error: "Category is required" },
        { status: 400 }
      );
    }

    const exists = await db
      .collection("automation_settings")
      .findOne({ category: data.category });

    if (exists) {
      return NextResponse.json(
        { error: "Category already exists. Use PUT." },
        { status: 400 }
      );
    }

    await db.collection("automation_settings").insertOne({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}

/* ===============================
   PUT: Update / Upsert category
================================ */
export async function PUT(req) {
  try {
    const admin = await verifyAdminToken();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const { db } = await getDB();

    const { _id, ...updateData } = data;

    if (!updateData.category) {
      return NextResponse.json(
        { error: "Category is required" },
        { status: 400 }
      );
    }

    await db.collection("automation_settings").updateOne(
      { category: updateData.category },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

/* ===============================
   DELETE: Category delete
================================ */
export async function DELETE(req) {
  try {
    const admin = await verifyAdminToken();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    if (!category) {
      return NextResponse.json(
        { error: "Category required" },
        { status: 400 }
      );
    }

    const { db } = await getDB();
    const result = await db
      .collection("automation_settings")
      .deleteOne({ category });

    if (!result.deletedCount) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}