
// app/api/admin/logout/route.js
import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ 
    success: true, 
    message: "Logged out successfully" 
  });

  // আগের কোডে আপনি "adminToken" ব্যবহার করেছেন, তাই এখানেও তাই হবে
  res.cookies.set("adminToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0, // টোকেনটি সাথে সাথে এক্সপায়ার হয়ে যাবে
    sameSite: "lax",
  });

  return res;
}