"use client";

import React, { useState, useEffect } from "react";
import {
  FiMail,
  FiPhone,
  FiCheck,
  FiX,
  FiHash,
  FiSearch,
  FiCalendar,
  FiZap,
} from "react-icons/fi";
import Swal from "sweetalert2";

export default function AdminOrderDashboard() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDate, setSearchDate] = useState("");

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      setOrders(data);
      setFilteredOrders(data);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    let result = orders;
    if (filter !== "all") {
      result = result.filter((order) => order.status === filter);
    }
    if (searchTerm) {
      result = result.filter((order) =>
        order.customer.phone?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (searchDate) {
      result = result.filter((order) => {
        const orderDate = new Date(order.createdAt).toISOString().split("T")[0];
        return orderDate === searchDate;
      });
    }
    setFilteredOrders(result);
  }, [filter, searchTerm, searchDate, orders]);

  const handleStatusUpdate = async (id, newStatus) => {
    const actionText = newStatus === "completed" ? "Approve" : "Reject";
    const result = await Swal.fire({
      title: `Confirm ${actionText}?`,
      text: `Are you sure you want to ${actionText.toLowerCase()} this order?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: newStatus === "completed" ? "#059669" : "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: `Yes, ${actionText}`,
      borderRadius: "24px",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/admin/orders/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        });
        if (res.ok) {
          Swal.fire({ title: "Success!", icon: "success", timer: 1500, showConfirmButton: false });
          fetchOrders();
        }
      } catch (err) {
        Swal.fire("Error", "Update failed", "error");
      }
    }
  };

  if (loading) return <div className="p-10 text-center font-bold text-indigo-600 animate-pulse uppercase tracking-widest">Loading Orders...</div>;

  return (
    <div className="px-2 py-6 container mx-auto min-h-screen bg-gray-50/50">
      
      {/* --- TOP BAR --- */}
      <div className="mb-8 flex flex-col xl:flex-row xl:items-center justify-between gap-4 px-2">
        <div>
          <h1 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
            Order <span className="text-indigo-600">Dashboard</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Management Console</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-[11px] font-bold uppercase outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm"
          >
            {["all", "pending", "completed", "cancelled"].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <div className="relative shadow-sm rounded-xl">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Search Phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-[11px] font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 w-40"
            />
          </div>

          <div className="relative shadow-sm rounded-xl">
            <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-[11px] font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-600 uppercase"
            />
          </div>

          {(searchTerm || searchDate || filter !== 'all') && (
            <button 
              onClick={() => {setSearchTerm(""); setSearchDate(""); setFilter("all")}}
              className="text-[10px] font-black text-red-500 uppercase hover:bg-red-50 px-3 py-2 rounded-xl transition-all border border-transparent hover:border-red-100"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* --- GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {filteredOrders.map((order) => {
          // Condition for Express Delivery
          const isExpress = order.pricing?.shippingFee === 100;

          return (
            <div
              key={order._id}
              className={`bg-white rounded-[28px] overflow-hidden transition-all duration-300 flex flex-col h-full max-w-md mx-auto w-full relative border-2 
                ${isExpress 
                  ? "border-emerald-500 shadow-[0_10px_30px_-15px_rgba(16,185,129,0.3)] ring-4 ring-emerald-50" 
                  : "border-slate-100 shadow-sm hover:shadow-md"}`}
            >
              {/* Express Badge */}
              {isExpress && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[9px] font-black uppercase px-4 py-1.5 rounded-b-2xl tracking-[0.2em] shadow-sm z-10 flex items-center gap-1">
                  <FiZap size={10} fill="white" /> Express
                </div>
              )}

              {/* Header */}
              <div className={`p-4 border-b flex justify-between items-center ${isExpress ? "bg-emerald-50/40 border-emerald-100" : "bg-slate-50/50 border-slate-100"}`}>
                <div className="flex items-center gap-2">
                  <FiHash className={isExpress ? "text-emerald-600" : "text-indigo-500"} size={14} />
                  <h3 className="text-sm font-black text-slate-700 uppercase tracking-tight">
                    #{order._id.slice(-6)}
                  </h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase ${
                    order.status === "completed" ? "bg-emerald-100 text-emerald-700" : 
                    order.status === "cancelled" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <div className="p-5 space-y-4 flex-grow">
                {/* Customer Info */}
                <div>
                  <label className={`text-[10px] font-black uppercase tracking-widest mb-1 block ${isExpress ? "text-emerald-600" : "text-indigo-400"}`}>
                    Customer Details
                  </label>
                  <h4 className="text-md font-bold text-slate-900 leading-tight">
                    {order.customer.firstName} {order.customer.lastName}
                  </h4>
                  <div className="mt-2 space-y-1.5">
                    <div className="flex items-center gap-2 text-slate-600 text-[12px] font-medium">
                      <FiMail className="text-slate-400" size={13} /> {order.customer.email}
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 text-[12px] font-medium">
                      <FiPhone className="text-slate-400" size={13} /> {order.customer.phone || "N/A"}
                    </div>
                  </div>
                </div>

                {/* Items Summary */}
                <div className={`${isExpress ? "bg-emerald-50/30 border-emerald-100" : "bg-slate-50 border-slate-100"} p-3 rounded-2xl border`}>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block">Order Items</label>
                  <div className="space-y-3">
                    {order.orderItems.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <img src={item.image} className="w-10 h-10 rounded-xl object-cover border-2 border-white shadow-sm" alt="" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-bold text-slate-800 truncate uppercase tracking-tighter">{item.title}</p>
                          <p className="text-[10px] font-bold text-indigo-500 uppercase">{item.duration} <span className="text-slate-300 mx-1">|</span> Qty: {item.quantity} <span className="text-slate-300 mx-1">|</span> ৳{item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <label className="text-[10px] font-black uppercase text-red-400 tracking-widest mb-1 block">Shipping Destination</label>
                  <p className="text-[11px] text-slate-600 font-bold leading-relaxed bg-orange-50/50 p-2 rounded-lg border border-orange-100/50">
                    {order.customer.address}, <span className="text-blue-600">City: {order.customer.city}</span>, <span className="text-emerald-600">Zip: {order.customer.postal}</span>
                  </p>
                </div>
              </div>

          
            {/* Footer / Pricing */}
                    <div className={`p-5 border-t ${isExpress ? "bg-emerald-50/20 border-emerald-100" : "bg-slate-50/30 border-slate-100"}`}>
                      <div className="mb-4">
                        <div className="flex justify-between items-end">
                          <div>
                            <p className={`text-[9px] font-black uppercase tracking-widest ${isExpress ? "text-emerald-600" : "text-slate-400"}`}>
                              Final Amount
                            </p>
                            <p className="text-2xl font-black text-slate-900 tracking-tighter">৳{order.pricing.totalAmount}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[9px] font-black uppercase text-slate-400 mb-1 tracking-widest">Payment Status</p>
                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border transition-all ${
                              order.paymentStatus === "paid" 
                                ? "bg-emerald-50 text-emerald-600 border-emerald-200 ring-4 ring-emerald-50/50" 
                                : "bg-red-50 text-red-600 border-red-100"
                            }`}>
                              {order.paymentStatus === "paid" ? "✅ Paid" : "❌ Unpaid"}
                            </span>
                            
                            {/* যদি পেমেন্ট হয়ে থাকে, তবে ট্রানজ্যাকশন আইডি দেখাবে */}
                            {order.transactionId && (
                              <p className="text-[8px] font-mono text-slate-400 mt-1.5 uppercase tracking-tighter">
                                TXID: {order.transactionId}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                {/* Action Buttons */}
                {order.status === "pending" && (
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => handleStatusUpdate(order._id, "cancelled")} 
                      className="py-3 bg-white text-red-600 border border-red-200 rounded-2xl font-black uppercase text-[10px] flex items-center justify-center gap-1.5 transition-all hover:bg-red-50 active:scale-95 shadow-sm"
                    >
                      <FiX size={14} strokeWidth={3} /> Reject
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(order._id, "completed")} 
                      className={`py-3 text-white rounded-2xl font-black uppercase text-[10px] flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-lg 
                        ${isExpress 
                          ? "bg-emerald-600 shadow-emerald-200 hover:bg-emerald-700" 
                          : "bg-indigo-600 shadow-indigo-200 hover:bg-indigo-700"}`}
                    >
                      <FiCheck size={14} strokeWidth={3} /> Approve
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {!loading && filteredOrders.length === 0 && (
        <div className="py-20 text-center bg-white rounded-[32px] border-2 border-dashed border-slate-200 max-w-md mx-auto mt-10">
          <p className="text-slate-400 font-black uppercase text-xs tracking-widest">No matching orders found</p>
        </div>
      )}
    </div>
  );
}