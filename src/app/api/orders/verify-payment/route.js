import getDB from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const body = await req.json();
    const { orderId, method, sender, transactionId, amount } = body;

    // ডাটা ভ্যালিডেশন
    if (!orderId || !transactionId || !sender) {
      return NextResponse.json(
        { error: "Missing required payment details" },
        { status: 400 }
      );
    }

    const { db } = await getDB();

    // ১. আলাদা 'transactions' কালেকশনে পেমেন্ট ডাটা সেভ করা
    const newTransaction = {
      orderId: new ObjectId(orderId), // অর্ডারের সাথে লিংক করার জন্য
      method: method,
      senderNumber: sender,
      trxId: transactionId,
      amountPaid: Number(amount),
      status: "pending", // অ্যাডমিন ভেরিফাই করার জন্য ডিফল্ট পেন্ডিং
      submittedAt: new Date(),
    };

    const transactionResult = await db.collection("transactions").insertOne(newTransaction);

    // ২. মূল 'orders' কালেকশনে পেমেন্ট স্ট্যাটাস আপডেট করা (ঐচ্ছিক কিন্তু ভালো প্র্যাকটিস)
    const orderUpdate = await db.collection("orders").updateOne(
      { _id: new ObjectId(orderId) },
      {
        $set: {
          paymentStatus: "pending_verification",
          lastTransactionId: transactionResult.insertedId // ট্রানজেকশন আইডির রেফারেন্স রাখা
        },
      }
    );

    if (orderUpdate.matchedCount === 0) {
      return NextResponse.json(
        { error: "Order not found but transaction recorded" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        message: "Payment submitted successfully!", 
        transactionId: transactionResult.insertedId 
      }, 
      { status: 201 }
    );

  } catch (err) {
    console.error("Payment API Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}