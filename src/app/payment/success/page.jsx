"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

function InvoiceContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (orderId) {
      // রিয়েল ডাটা ফেচ করা হচ্ছে
      fetch(`/api/orders/${orderId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Order not found");
          return res.json();
        })
        .then((data) => setOrder(data))
        .catch((err) => {
          console.error("Fetch Error:", err);
          setError(true);
        });
    }
  }, [orderId]);

  if (error) return (
    <div className="min-h-screen flex items-center justify-center text-red-500 font-bold bg-white">
      Error: Order Data Not Found! 
    </div>
  );

  if (!order) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc]">
      <div className="w-10 h-10 border-4 border-[#2563eb] border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="font-black text-[#2563eb] animate-pulse">FETCHING REAL-TIME DATA...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 flex flex-col items-center">
      <div className="w-full max-w-[850px] bg-white border p-10 rounded-3xl shadow-sm">
        
        {/* Header - SubNex Logo & Status */}
        <div className="flex justify-between items-center border-b pb-8 mb-10">
          <div>
            <Image src="/logo2.png" alt="SubNex Logo" width={100} height={40}></Image>
            <p className="text-[11px] font-bold text-slate-400 mt-2 uppercase tracking-widest">
              Invoice: #{orderId.slice(-6)}
            </p>
          </div>
          <div className="text-right">
            <span className="bg-[#e0ecff] text-[#2563eb] px-6 py-2 rounded-full text-xs font-black uppercase">
              {order.paymentStatus === "paid" ? "PAID" : "COMPLETED"}
            </span>
          </div>
        </div>

        {/* Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
          <div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Invoice To:</h3>
            <p className="font-black text-slate-800 text-lg">
              {order.customer?.firstName} {order.customer?.lastName}
            </p>
            <p className="text-sm text-slate-500">{order.customer?.email}</p>
            <p className="text-sm text-slate-500">{order.customer?.phone}</p>
            <p className="text-sm text-slate-500">{order.customer?.address}</p>
          </div>
          <div className="md:text-right">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Invoice Date:</h3>
            <p className="font-bold text-slate-800 italic">
              {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Table Items */}
        <div className="border rounded-2xl overflow-hidden mb-10">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="p-5 font-black text-slate-400 uppercase text-[10px]">Item Description</th>
                <th className="p-5 font-black text-slate-400 uppercase text-[10px] text-center">Qty</th>
                <th className="p-5 font-black text-slate-400 uppercase text-[10px] text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {order.orderItems?.map((item, idx) => (
                <tr key={idx}>
                  <td className="p-5 font-bold text-slate-700">{item.title}</td>
                  <td className="p-5 text-center font-bold text-slate-600">{item.quantity}</td>
                  <td className="p-5 text-right font-black text-slate-800">
                    ৳{item.totalPrice || (item.price * item.quantity)}.00
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pricing Summary */}
        <div className="flex justify-end pr-5">
          <div className="w-64 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="font-bold text-slate-400">Sub Total</span>
              <span className="font-bold text-slate-800">৳{order.pricing?.subtotal}.00</span>
            </div>
            {order.pricing?.discount > 0 && (
              <div className="flex justify-between text-sm text-red-500">
                <span className="font-bold">Discount</span>
                <span className="font-bold">-৳{order.pricing?.discount}.00</span>
              </div>
            )}
            <div className="flex justify-between border-t-2 border-slate-50 pt-4 mt-4 items-center">
              <span className="text-sm font-black text-slate-800 uppercase">Total Paid</span>
              <span className="text-2xl font-black text-[#2563eb]">৳{order.pricing?.totalAmount}.00</span>
            </div>
          </div>
        </div>

        <button 
          onClick={() => window.print()} 
          className="w-full mt-10 bg-black text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl no-print hover:scale-[1.01] transition-all"
        >
          Download / Print Invoice
        </button>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InvoiceContent />
    </Suspense>
  );
}