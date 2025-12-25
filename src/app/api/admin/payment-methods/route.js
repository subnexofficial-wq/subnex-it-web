import { NextResponse } from "next/server";
import getDB from "@/lib/mongodb";
import { verifyAdminToken } from "@/lib/auth";


export async function GET() {
  try {
    const { db } = await getDB();


    let settings = await db
      .collection("settings")
      .findOne({ type: "payment_methods" });


    if (!settings) {
      settings = {
        type: "payment_methods",
        methods: {
          bkash: { adminNum: "017XXXXXXXX", active: true },
          nagad: { adminNum: "018XXXXXXXX", active: true },
          upay: { adminNum: "019XXXXXXXX", active: true },
          roket: { adminNum: "016XXXXXXXX", active: true },
        },
      };
    }

    return NextResponse.json({ ok: true, methods: settings.methods });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  const admin = await verifyAdminToken();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { method, newNumber } = await req.json();
    const { db } = await getDB();

    const updateField = `methods.${method}.adminNum`;

    const result = await db.collection("settings").updateOne(
      { type: "payment_methods" },
      {
        $set: { [updateField]: newNumber },
      },
      { upsert: true }
    );

    return NextResponse.json({ ok: true, message: "Updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
