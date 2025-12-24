import getDB from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function PATCH(req) {
  try {
    const { transactionId, orderId, status } = await req.json(); 

    const { db } = await getDB();


    await db.collection("transactions").updateOne(
      { _id: new ObjectId(transactionId) },
      { $set: { status: status, processedAt: new Date() } }
    );


    const newPaymentStatus = status === 'approved' ? 'paid' : 'unpaid';

    await db.collection("orders").updateOne(
      { _id: new ObjectId(orderId) },
      { 
        $set: { 
          paymentStatus: newPaymentStatus,
        } 
      }
    );

    return NextResponse.json({ message: `Transaction ${status} successfully` }, { status: 200 });

  } catch (err) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}