"use client";
import { useState, useEffect } from "react";
import { FiCheck } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import Swal from "sweetalert2";

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
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (order) => {
    if (!confirm("Approve this order and send invoice to customer?")) return;

    try {
      const res = await fetch("/api/admin/automation-orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order._id,
          status: "completed",
          paymentStatus: "paid",
        }),
      });

      if (res.ok) {
        Swal.fire({
          title: "Success!",
          text: "Order approved successfully.",
          icon: "success",
        });
        fetchOrders();
      }
    } catch (err) {
      Swal.fire({
        title: "Error!",
        text: "Error approving order.",
        icon: "error",
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-orange-100 text-orange-600";
      case "completed":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  if (loading) return <div className="p-10 text-center font-bold text-gray-500 italic uppercase tracking-widest">Loading orders...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
      
          <span className="bg-black text-white px-4 py-1 rounded-full text-xs font-bold">Total: {orders.length}</span>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-400 italic">Customer</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-400 italic">Plan</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-400 italic">Pricing</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-400 italic">Transaction</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-400 italic">Status</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-400 italic text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-gray-400 font-bold uppercase text-xs">No orders found</td>
                  </tr>
                ) : (
                  orders.map((order) => {
                    const details = order.orderDetails || order.items || {};
                    const planName = details.planName || "Automation Plan";
                    const category = details.category || "service";
                    const couponCode = details.coupon || order.pricing?.couponCode || "NONE";
                    const originalPrice = Number(details.originalPrice || order.pricing?.total || order.amount || 0);
                    const finalPrice = Number(details.finalPrice || order.pricing?.totalAmount || order.amount || 0);
                    const discountAmount = Number(details.discountAmount || order.pricing?.discount || Math.max(0, originalPrice - finalPrice));
                    const transactionRef =
                      order.transactionId ||
                      order.gatewayTransactionId ||
                      order.paymentVerifyPayload?.transaction_id ||
                      order.paymentVerifyPayload?.transactionId ||
                      order.gatewayInvoiceId ||
                      "N/A";

                    return (
                      <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-5">
                          <p className="font-bold text-gray-900 text-[20px] leading-none mb-1">{order.customerName || order.customer?.firstName || "Unknown"}</p>
                          <p className="text-xs text-gray-500 font-medium mb-1">{order.customerMobile || order.customer?.phone}</p>
                          <p className="text-[12px]  font-black ">{order.customerEmail || order.customer?.email}</p>
                        </td>

                        <td className="px-6 py-5">
                          <div className="text-[10px] font-black text-blue-700 bg-blue-50 inline-block px-3 py-1 rounded-full border border-blue-100 uppercase tracking-tighter">
                            {planName}
                          </div>
                          <p className="text-[9px] text-gray-400 mt-1 font-bold uppercase">{category}</p>
                        </td>

                        <td className="px-6 py-5">
                          <p className="text-[10px] font-bold text-gray-400">Original: ৳{originalPrice.toLocaleString()}</p>
                          <p className="text-[10px] font-black text-green-600">Discount: -৳{discountAmount.toLocaleString()}</p>
                          <p className="font-black text-gray-900 text-sm italic">Payable: ৳{finalPrice.toLocaleString()}</p>
                          <div className="mt-1">
                            {couponCode && couponCode !== "NONE" ? (
                              <span className="text-[9px] font-black uppercase text-green-500 bg-green-50 px-2 py-0.5 rounded border border-green-100">
                                Code: {couponCode}
                              </span>
                            ) : (
                              <span className="text-[9px] font-black uppercase text-gray-300">No Coupon</span>
                            )}
                          </div>
                        
                        </td>

                        <td className="px-6 py-5">
                          <p className="text-[11px] font-bold text-gray-800 break-all">{transactionRef}</p>
                        </td>

                        <td className="px-6 py-5">
                          <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-tighter ${getStatusColor(order.status)}`}>
                            {order.status || "pending"}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-right">
                          <div className="flex justify-end gap-2">
                            <a
                              href={`https://wa.me/${(order.customerMobile || order.customer?.phone || "").replace(/\D/g, "")}`}
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
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
