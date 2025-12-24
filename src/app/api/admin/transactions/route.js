
import getDB from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "pending";

    const { db } = await getDB();


    const transactions = await db
      .collection("transactions")
      .find({ status: status })
      .sort({ submittedAt: -1 })
      .toArray();

    return NextResponse.json(transactions, { status: 200 });
  } catch (err) {
    console.error("Fetch Transactions Error:", err);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}