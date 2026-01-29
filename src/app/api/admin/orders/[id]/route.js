import { NextResponse } from "next/server";
import getDB from "@/lib/mongodb";
import { verifyAdminToken } from "@/lib/auth";
import { ObjectId } from "mongodb";
import { sendEmail } from "@/lib/mailer"; // ইমেইল ফাংশনটি ইমপোর্ট করলাম

export async function PATCH(req, { params }) {
  try {
    // ১. এডমিন টোকেন ভেরিফাই করা
    const admin = await verifyAdminToken();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { status } = await req.json(); 

    // ২. স্ট্যাটাস ভ্যালিডেশন
    const validStatuses = ["pending", "processing", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const { db } = await getDB();

    // ৩. ডাটাবেসে আপডেট করা এবং অর্ডারের ডাটা তুলে আনা (ইমেইল পাঠানোর জন্য)
    const order = await db.collection("orders").findOne({ _id: new ObjectId(id) });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const result = await db.collection("orders").updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          status: status,
          updatedAt: new Date() 
        } 
      }
    );

    // ৪. যদি স্ট্যাটাস 'completed' হয়, তবে ক্লায়েন্টকে ইনভয়েস ইমেইল পাঠানো
    if (status === "completed" && order.customer?.email) {
      try {
        await sendEmail({
          to: order.customer.email,
          subject: `Order Completed - #${order._id.toString().slice(-6)}`,
          html: `
            <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
              <div style="background-color: #4f46e5; padding: 30px; text-align: center; color: white;">
                <h1 style="margin: 0; font-size: 24px;">Order Confirmed!</h1>
                <p style="margin-top: 10px; opacity: 0.9;">Your order has been successfully processed.</p>
              </div>
              
              <div style="padding: 30px; color: #334155;">
                <p>Hello <strong>${order.customer.firstName}</strong>,</p>
                <p>Great news! Your order <strong>#${order._id.toString().slice(-6)}</strong> has been marked as completed.</p>
                
                <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 25px 0;">
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 8px 0; color: #64748b;">Total Amount:</td>
                      <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #4f46e5;">৳${order.pricing?.totalAmount}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #64748b;">Order Status:</td>
                      <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #10b981;">COMPLETED</td>
                    </tr>
                  </table>
                </div>

                <p style="font-size: 14px; color: #64748b;">If you have any questions, feel free to contact our support team.</p>
                
                <div style="text-align: center; margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
                  <p style="font-size: 12px; font-weight: bold; color: #4f46e5;">Team Subnex</p>
                </div>
              </div>
            </div>
          `
        });
      } catch (emailErr) {
        console.error("Email Sending Failed:", emailErr);
        // ইমেইল না গেলেও যেন স্ট্যাটাস আপডেট সাকসেস দেখায়, তাই এখানে রিটার্ন করছি না
      }
    }

    return NextResponse.json({ message: `Order status updated to ${status}` });

  } catch (err) {
    console.error("Admin Status Update Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}