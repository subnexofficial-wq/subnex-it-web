import { sendEmail } from "@/lib/mailer";
import getDB from "@/lib/mongodb";
import { NextResponse } from "next/server";


export async function POST(req) {
  try {
    const body = await req.json();
    const { userEmail, orderItems, customer, pricing } = body;

    if (!orderItems || orderItems.length === 0 || !pricing.totalAmount) {
      return NextResponse.json({ error: "Missing order information" }, { status: 400 });
    }

    const { db } = await getDB();
const digitalProduct = orderItems.find(item => item.category === "digital-product");
    const newOrder = {
      userEmail,
      customer,
      orderItems,
      downloadLink: digitalProduct?.downloadLink || null, 
      pricing: {
        subtotal: Number(pricing.subtotal),
        shippingFee: Number(pricing.shippingFee),
        tip: Number(pricing.tip || 0),
        discount: Number(pricing.discount || 0),
        totalAmount: Number(pricing.totalAmount),
      },
      status: "pending",
      paymentStatus: "unpaid",
      createdAt: new Date(),
    };

    const result = await db.collection("orders").insertOne(newOrder);


    try {
      const adminEmail = process.env.ADMIN_EMAIL; 
      const orderSummary = orderItems.map(item => `<li>${item.title} (x${item.quantity}) - ৳${item.price}</li>`).join("");

      await sendEmail({
        to: adminEmail,
        subject: `New Order Received From Subnex  #${result.insertedId.toString().slice(-6).toUpperCase()}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
            <h2 style="color: #4f46e5;">New Order Notification</h2>
            <p>You have received a new order from <strong>${customer.firstName} ${customer.lastName}</strong>.</p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            
            <h3>Order Details:</h3>
            <ul>${orderSummary}</ul>
            
            <p><strong>Total Amount: ৳${pricing.totalAmount}</strong></p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            
            <h3>Customer Info:</h3>
            <p>Email: ${customer.email}</p>
            <p>Phone: ${customer.phone}</p>
            <p>Address: ${customer.address}, ${customer.city}</p>
            
            <a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin/orders" 
               style="display: inline-block; background: #4f46e5; color: #fff; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold; margin-top: 10px;">
               Manage Orders in Dashboard
            </a>
          </div>
        `
      });
    } catch (mailError) {
      console.error("Mail Sending Failed:", mailError);
      
    }

    return NextResponse.json({
      message: "Order created successfully",
      orderId: result.insertedId, 
    }, { status: 201 });

  } catch (err) {
    console.error("Order API Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}