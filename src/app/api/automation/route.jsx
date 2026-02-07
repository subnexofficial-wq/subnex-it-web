import { NextResponse } from "next/server";
import getDB from "@/lib/mongodb";

export async function GET() {
  try {
    const { db } = await getDB();
    const settings = await db.collection("automation_settings").find().toArray();

    const data = settings.reduce((acc, item) => {
      acc[item.category] = item;
      return acc;
    }, {});

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}