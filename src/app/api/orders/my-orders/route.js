import { NextResponse } from "next/server";
import getDB from "@/lib/mongodb";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const sort = searchParams.get("sort");
    const range = searchParams.get("range");

if (!email || email === "undefined" || email === "") {
      return NextResponse.json({ ok: true, orders: [] }); 
    }

    const { db } = await getDB();
    
    // ফিল্টার কুয়েরি
    let query = { userEmail: email };

    // টাইম রেঞ্জ ফিল্টার (Days)
    if (range && range !== "undefined") {
      const days = parseInt(range);
      const dateLimit = new Date();
      dateLimit.setDate(dateLimit.getDate() - days)
      query.createdAt = { $gte: dateLimit };
    }

    // সর্টিং লজিক
    let sortOptions = { createdAt: -1 };
    if (sort === "oldest") sortOptions = { createdAt: 1 };
    if (sort === "total_desc") sortOptions = { total: -1 };
    if (sort === "total_asc") sortOptions = { total: 1 };

    const orders = await db
      .collection("orders")
      .find(query)
      .sort(sortOptions)
      .toArray();

    return NextResponse.json({ ok: true, orders });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}