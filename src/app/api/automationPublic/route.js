import { NextResponse } from "next/server";
import getDB from "@/lib/mongodb";

// ===============================
// GET: Public Landing Page
// ===============================
export async function GET() {
  try {
    const { db } = await getDB();
    const data = await db
      .collection("automation_settings")
      .find({})
      .toArray();

    // 🔥 category based object
    const formatted = {};
    data.forEach(item => {
      formatted[item.category] = item;
    });

    return NextResponse.json(formatted);
  } catch (err) {
    console.error("PUBLIC GET ERROR:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}