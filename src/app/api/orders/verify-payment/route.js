import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import getDB from "@/lib/mongodb";

export async function POST(req) {
  try {
    const { orderId, method, sender, transactionId, amount, senderEmail } = await req.json();

    if (!orderId || !transactionId) {
      return NextResponse.json({ error: "orderId and transactionId are required" }, { status: 400 });
    }

    const { db } = await getDB();

    const result = await db.collection("orders").updateOne(
      { _id: new ObjectId(orderId) },
      {
        $set: {
          paymentMethod: method || null,
          senderNumber: sender || null,
          transactionId,
          submittedAmount: Number(amount || 0),
          paymentStatus: "submitted",
          submittedBy: senderEmail || "guest",
          paymentSubmittedAt: new Date(),
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Verify Payment API Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
