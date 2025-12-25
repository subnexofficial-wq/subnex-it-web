
import { NextResponse } from "next/server";
import getDB from "@/lib/mongodb";
import { verifyAdminToken } from "@/lib/auth";

// স্লাইডার লিস্ট দেখার জন্য
export async function GET() {
  try {
    const { db } = await getDB();
    const sliders = await db.collection("sliders").find({}).toArray();
    return NextResponse.json(sliders);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch sliders" }, { status: 500 });
  }
}

// নতুন স্লাইডার অ্যাড করার জন্য
export async function POST(req) {
  try {
    const admin = await verifyAdminToken();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { image, alt } = await req.json();
    const { db } = await getDB();
    
    const newSlider = { image, alt, createdAt: new Date() };
    await db.collection("sliders").insertOne(newSlider);
    
    return NextResponse.json({ message: "Slider added successfully" });
  } catch (err) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

// স্লাইডার ডিলিট করার জন্য (DELETE Method)
export async function DELETE(req) {
  try {
    const admin = await verifyAdminToken();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const { db } = await getDB();
    const { ObjectId } = require("mongodb");

    await db.collection("sliders").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ message: "Slider deleted" });
  } catch (err) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}