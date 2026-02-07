import { NextResponse } from "next/server";
import getDB from "@/lib/mongodb";
import { verifyAdminToken } from "@/lib/auth";
import { ObjectId } from "mongodb";

// ১. GET: সব ডাটা রিড করা
export async function GET() {
  try {
    const { db } = await getDB();
    const settings = await db.collection("automation_settings").find().toArray();
    return NextResponse.json(settings);
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ২. POST/PUT: ডাটা তৈরি বা আপডেট করা
export async function POST(req) {
  try {
    const admin = await verifyAdminToken();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await req.json();
    const { db } = await getDB();

    const { _id, ...updateData } = data;

    const result = await db.collection("automation_settings").updateOne(
      { category: data.category },
      { $set: { ...updateData, updatedAt: new Date() } },
      { upsert: true }
    );

    return NextResponse.json({ ok: true, id: result.upsertedId });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
//3 বিদ্যমান ডাটা আপডেট করার জন্য PUT
export async function PUT(req) {
  try {
    const admin = await verifyAdminToken();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await req.json();
    const { db } = await getDB();

    // category-কে ফিল্টার হিসেবে ব্যবহার করে আপডেট
    const result = await db.collection("automation_settings").updateOne(
      { category: data.category },
      { 
        $set: { 
          intro: data.intro,
          workflow: data.workflow,
          pricing: data.pricing,
          faqs: data.faqs,
          updatedAt: new Date() 
        } 
      }
    );

    if (result.matchedCount === 0) {
        return NextResponse.json({ error: "Data not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// 4. DELETE: নির্দিষ্ট ক্যাটাগরির ডাটা রিসেট বা ডিলিট করা
export async function DELETE(req) {
  try {
    const admin = await verifyAdminToken();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    if (!category) return NextResponse.json({ error: "Category missing" }, { status: 400 });

    const { db } = await getDB();
    await db.collection("automation_settings").deleteOne({ category });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}