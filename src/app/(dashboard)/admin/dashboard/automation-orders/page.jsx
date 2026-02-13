"use client";
import { useState, useEffect } from "react";
import { FiCheck, FiTrash2 } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

export default function AutomationOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/automation-orders");
      const data = await res.json();
      // যদি ডাটা এরে হয় তবেই সেট করবে
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (order) => {
    if (!confirm("অর্ডারটি কি অ্যাপ্রুভ করতে চান? এটি কাস্টমারকে ইনভয়েস ইমেইল পাঠাবে।")) return;

    try {
      const res = await fetch("/api/admin/automation-orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          orderId: order._id,
          status: "completed",
          paymentStatus: "paid"
        }),
      });

      if (res.ok) {
        alert("অর্ডার সফলভাবে অ্যাপ্রুভ হয়েছে!");
        fetchOrders(); 
      }
    } catch (err) {
      alert("Error approving order");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-orange-100 text-orange-600";
      case "completed": return "bg-green-100 text-green-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  if (loading) return <div className="p-10 text-center font-bold text-gray-500 italic uppercase tracking-widest">অর্ডার লোড হচ্ছে...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-gray-800">Automation Orders</h1>
            <p className="text-xs text-gray-400 font-bold tracking-widest uppercase">Admin Control Panel</p>
          </div>
          <span className="bg-black text-white px-4 py-1 rounded-full text-xs font-bold">Total: {orders.length}</span>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-400 italic">Customer Detail</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-400 italic">Plan Info</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-400 italic">Amount & Coupon</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-400 italic">Status</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-400 italic text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-10 text-gray-400 font-bold uppercase text-xs">No orders found</td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                      {/* কাস্টমার নাম, ফোন এবং ইমেইল */}
                      <td className="px-6 py-5">
                        <p className="font-bold text-gray-900 text-sm leading-none mb-1">{order.customerName || order.customer?.firstName || "Unknown"}</p>
                        <p className="text-xs text-gray-500 font-medium mb-1">{order.customerMobile || order.customer?.phone}</p>
                        <p className="text-[10px] text-blue-500 font-black uppercase">{order.customerEmail || order.customer?.email}</p>
                      </td>

                      {/* প্ল্যান বা প্রোডাক্টের নাম */}
                      <td className="px-6 py-5">
                        <div className="text-[10px] font-black text-blue-700 bg-blue-50 inline-block px-3 py-1 rounded-full border border-blue-100 uppercase tracking-tighter">
                          {order.orderDetails?.planName || "Automation Plan"}
                        </div>
                        <p className="text-[9px] text-gray-400 mt-1 font-bold uppercase">{order.orderDetails?.category || "Service"}</p>
                      </td>
<td className="px-6 py-5">
  <p className="font-black text-gray-900 text-sm italic">
    {/* এখানে একাধিক চেক দেওয়া হয়েছে যাতে কোনোভাবেই ০ না দেখায় */}
    ৳{(order.amount || order.pricing?.totalAmount || order.totalAmount || 0).toLocaleString()}
  </p>
  <div className={`text-[9px] font-black uppercase mt-1 ${
    (order.orderDetails?.coupon && order.orderDetails.coupon !== 'NONE') 
    ? 'text-green-500' 
    : 'text-gray-300'
  }`}>
  {/* কুপন লজিক */}
  <div className="mt-1">
    { (order.orderDetails?.coupon && order.orderDetails.coupon !== "NONE") || order.appliedCoupon ? (
      <span className="text-[9px] font-black uppercase text-green-500 bg-green-50 px-2 py-0.5 rounded border border-green-100">
        Code: {order.orderDetails?.coupon || order.appliedCoupon || "USED"}
      </span>
    ) : (
      <span className="text-[9px] font-black uppercase text-gray-300">
        No Coupon
      </span>
    )}
  </div>
  </div>
</td>

                      {/* অর্ডার স্ট্যাটাস */}
                      <td className="px-6 py-5">
                        <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-tighter ${getStatusColor(order.status)}`}>
                          {order.status || "pending"}
                        </span>
                      </td>

                      {/* অ্যাকশন বাটন */}
                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end gap-2">
                          <a 
                            href={`https://wa.me/${(order.customerMobile || order.customer?.phone || "").replace(/\D/g, '')}`} 
                            target="_blank" 
                            className="p-2.5 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm"
                          >
                            <FaWhatsapp size={16} />
                          </a>

                          <button 
                            onClick={() => handleApprove(order)}
                            disabled={order.status === "completed"}
                            className={`p-2.5 rounded-xl transition-all shadow-sm ${
                              order.status === "completed" 
                              ? "bg-gray-100 text-gray-300 cursor-not-allowed" 
                              : "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white"
                            }`}
                          >
                            <FiCheck size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}