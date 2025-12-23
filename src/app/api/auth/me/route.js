
import { NextResponse } from "next/server";
import getDB from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { verifyToken } from "@/lib/auth";

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No token" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    
   
    const userId = decoded.sub || decoded.userId;

    if (!userId) {
      return NextResponse.json({ error: "Invalid token structure" }, { status: 401 });
    }

    const { db } = await getDB();
    const user = await db.collection("users").findOne(
      { _id: new ObjectId(userId) },
      { projection: { password: 0 } } 
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });

  } catch (err) {
    return NextResponse.json(
      { error: "Server error", details: err.message },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = verifyToken(token);
    const userId = decoded?.sub || decoded?.userId;

    if (!userId) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const body = await req.json();
    
    // শুধু নির্দিষ্ট ফিল্ডগুলো আলাদা করা
    const updateData = {};
    if (body.firstName) updateData.firstName = body.firstName;
    if (body.lastName) updateData.lastName = body.lastName;
    if (body.email) updateData.email = body.email;
    if (body.photo) updateData.photo = body.photo; // ImgBB URL এখানে আসবে
    if (body.address !== undefined) updateData.address = body.address;

    const { db } = await getDB();
    
    // ডাটাবেস আপডেট
    const result = await db.collection("users").findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: updateData },
      { returnDocument: 'after' } // আপডেটেড ডাটা রিটার্ন করবে
    );

    if (!result) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, user: result }, { status: 200 });
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


export async function DELETE(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = verifyToken(token);
    const userId = decoded?.sub || decoded?.userId;

    const { db } = await getDB();
    
    // ১. ডাটাবেস থেকে ইউজার ডিলিট করা
    const result = await db.collection("users").deleteOne({
      _id: new ObjectId(userId),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }


    const response = NextResponse.json(
      { ok: true, message: "Account deleted successfully" },
      { status: 200 }
    );
    response.cookies.set("token", "", { expires: new Date(0) });

    return response;
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}