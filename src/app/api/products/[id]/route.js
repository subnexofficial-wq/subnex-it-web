
import { NextResponse } from "next/server";
import getDB from "@/lib/mongodb";

export async function GET(req, { params }) {
  try {
    const { id } = params;
    const { db } = await getDB();

    const product = await db.collection("products").findOne(
      { id, active: true }
    );

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);

  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
