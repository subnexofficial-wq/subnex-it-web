"use client";
import { useState, useEffect } from "react";
import { FiEye, FiCheck, FiTrash2 } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

export default function AutomationOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  // ১. শুধুমাত্র অটোমেশন অর্ডার ফেচ করার API কল
  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/automation-orders"); 
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ২. অর্ডার অ্যাপ্রুভ করার ফাংশন
  const handleApprove = async (order) => {
    if (!confirm("Approve this order and send confirmation?")) return;

    try {
      const res = await fetch("/api/admin/automation-orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          orderId: order._id,
          email: order.customer.email,
          customerName: order.customer.firstName 
        }),
      });

      if (res.ok) {
        alert("Order Approved Successfully!");
        fetchOrders(); // লিস্ট রিফ্রেশ
      }
    } catch (err) {
      alert("Error approving order");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-orange-100 text-orange-600";
      case "completed": return "bg-green-100 text-green-600 text-xs";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  if (loading) return <div className="p-10 text-center font-bold text-gray-500 italic">অর্ডার লোড হচ্ছে...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-gray-800">Automation Orders</h1>
            <p className="text-xs text-gray-400 font-bold">Manage orders from landing pages</p>
          </div>
          <span className="bg-black text-white px-4 py-1 rounded-full text-xs font-bold">Total: {orders.length}</span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 italic">Customer / Contact</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 italic">Product Items</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 italic">Amount</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 italic">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 italic text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900 text-sm">{order.customer?.firstName} {order.customer?.lastName}</p>
                      <p className="text-xs text-gray-500 font-medium">{order.customer?.phone}</p>
                      <p className="text-[10px] text-blue-500 font-bold">{order.customer?.email}</p>
                    </td>
                  <td className="px-6 py-4">

  {Array.isArray(order.items || order.orderItems) ? (
    (order.items || order.orderItems).map((item, idx) => (
      <div 
        key={idx} 
        className="text-[10px] font-black text-gray-700 bg-gray-100 inline-block px-2 py-1 rounded-md mr-1 mb-1 border border-gray-200 uppercase"
      >
        {item.title} <span className="text-blue-600">x{item.quantity}</span>
      </div>
    ))
  ) : (
    <span className="text-[10px] text-gray-400 italic font-bold uppercase tracking-tighter">
      No items found
    </span>
  )}
</td>
                    <td className="px-6 py-4">
                      <p className="font-black text-gray-900 text-sm">৳{(order.pricing?.totalAmount || order.amount || 0).toLocaleString()}</p>
                      <p className={`text-[9px] font-black uppercase ${order.paymentStatus === 'paid' ? 'text-green-500' : 'text-red-400'}`}>
                        {order.paymentStatus}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-tighter ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {/* WhatsApp Contact */}
                        <a 
                          href={`https://wa.me/88${order.customer?.phone}`} 
                          target="_blank" 
                          className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all shadow-sm"
                          title="WhatsApp Chat"
                        >
                          <FaWhatsapp size={14} />
                        </a>

                        {/* Approve Button */}
                        <button 
                          onClick={() => handleApprove(order)}
                          disabled={order.status === "completed"}
                          className={`p-2 rounded-lg transition-all shadow-sm ${
                            order.status === "completed" 
                            ? "bg-gray-100 text-gray-300 cursor-not-allowed" 
                            : "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white"
                          }`}
                          title="Approve Order"
                        >
                          <FiCheck size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}