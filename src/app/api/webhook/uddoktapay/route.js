import { NextResponse } from "next/server";
import getDB from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req) {
  const data = await req.json();
  const { db } = await getDB();

  if (data.status === "Completed") {
    await db.collection("orders").updateOne(
      { _id: new ObjectId(data.metadata.orderId) },
      { 
        $set: { 
          paymentStatus: "paid", 
          status: "completed", 
          transactionId: data.transaction_id,
          updatedAt: new Date() 
        } 
      }
    );
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ ok: false }, { status: 400 });
}