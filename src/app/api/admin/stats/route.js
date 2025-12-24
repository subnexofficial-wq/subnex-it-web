import { NextResponse } from "next/server";
import getDB from "@/lib/mongodb";
import { verifyAdminToken } from "@/lib/auth";

export async function GET() {
  try {
    const admin = await verifyAdminToken();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { db } = await getDB();

    // ১. গত ৭ দিনের ডেট রেঞ্জ তৈরি করা
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      return d;
    }).reverse();

    // ২. সব ডাটা একসাথে ফেচ করা
    // আপনার ডাটাবেসে ফিল্ডের নাম 'submittedAt' এবং গ্রাফের জন্য শুধুমাত্র 'approved' স্ট্যাটাস নেওয়া হচ্ছে
    const [productsCount, usersCount, ordersCount, recentTransactions] = await Promise.all([
      db.collection("products").countDocuments(),
      db.collection("users").countDocuments(),
      db.collection("orders").countDocuments(),
      db.collection("transactions").find({ 
        status: "approved",
        submittedAt: { $gte: last7Days[0] } 
      }).toArray(),
    ]);

    // ৩. টোটাল রেভিনিউ ক্যালকুলেশন (সব approved ট্রানজাকশন থেকে)
    // এখানে আপনার ডাটাবেস অনুযায়ী 'amountPaid' ফিল্ড ব্যবহার করা হয়েছে
    const allApprovedTransactions = await db.collection("transactions").find({ status: "approved" }).toArray();
    const totalRevenue = allApprovedTransactions.reduce((acc, curr) => {
        return acc + (Number(curr.amountPaid) || 0);
    }, 0);

    // ৪. গ্রাফের ডাটা ফরম্যাট করা
    const chartData = last7Days.map(date => {
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
      
      const dayTotal = recentTransactions
        .filter(t => {
          // 'submittedAt' ফিল্ডকে ডেট অবজেক্টে রূপান্তর করে চেক করা হচ্ছে
          const tDate = new Date(t.submittedAt);
          return tDate.toDateString() === date.toDateString();
        })
        .reduce((acc, curr) => acc + (Number(curr.amountPaid) || 0), 0);

      return { name: dayName, amount: dayTotal };
    });

    return NextResponse.json({
      productsCount,
      usersCount,
      totalOrders: ordersCount, 
      totalRevenue,
      chartData
    });
  } catch (err) {
    console.error("Dashboard Stats Error:", err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}