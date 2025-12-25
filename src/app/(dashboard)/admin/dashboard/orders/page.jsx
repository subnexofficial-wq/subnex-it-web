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

  if (loading) return <div className="p-10 text-center font-bold text-indigo-600">Loading...</div>;

  return (
    <div className="px-2 py-6 container mx-auto min-h-screen">
      
      {/* --- TOP BAR: Header + All Filters in One Line --- */}
      <div className="mb-8 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
            Order <span className="text-indigo-600">Dashboard</span>
          </h1>
        </div>

        {/* Unified Search/Filter Row */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Status Select (Small) */}
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-[11px] font-bold uppercase outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
          >
            {["all", "pending", "completed", "cancelled"].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* Phone Search (Compact) */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Search Phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-[11px] font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 w-40"
            />
          </div>

          {/* Date Picker (Compact) */}
          <div className="relative">
            <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-[11px] font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-600 uppercase"
            />
          </div>

          {/* Clear Button */}
          {(searchTerm || searchDate || filter !== 'all') && (
            <button 
              onClick={() => {setSearchTerm(""); setSearchDate(""); setFilter("all")}}
              className="text-[10px] font-black text-red-500 uppercase hover:bg-red-50 px-2 py-2 rounded-lg transition-all"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* --- GRID (Original Card Design) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
        {filteredOrders.map((order) => (
          <div
            key={order._id}
            className="bg-white border border-slate-200 rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col h-full max-w-md mx-auto w-full"
          >
            {/* Header: ID and Status */}
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-2">
                <FiHash className="text-indigo-500" size={14} />
                <h3 className="text-sm font-black text-slate-700 uppercase tracking-tight">
                  #{order._id.slice(-6)}
                </h3>
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider ${
                  order.status === "completed" ? "bg-emerald-100 text-emerald-700" : 
                  order.status === "cancelled" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                }`}
              >
                {order.status}
              </span>
            </div>

            <div className="p-4 space-y-4 flex-grow">
              {/* Customer Info */}
              <div>
                <label className="text-[10px] font-black uppercase text-indigo-400 tracking-widest mb-1 block">Customer</label>
                <h4 className="text-md font-bold text-slate-900 leading-tight">
                  {order.customer.firstName} {order.customer.lastName}
                </h4>
                <div className="mt-1.5 space-y-1">
                  <div className="flex items-center gap-2 text-slate-600 text-[12px]">
                    <FiMail className="text-slate-400" size={12} /> {order.customer.email}
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 text-[12px]">
                    <FiPhone className="text-slate-400" size={12} /> {order.customer.phone || "N/A"}
                  </div>
                </div>
              </div>

              {/* Items Summary (Compact) */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block">Order Summary</label>
                <div className="space-y-2">
                  {order.orderItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <img src={item.image} className="w-8 h-8 rounded-lg object-cover border" alt="" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold text-slate-800 truncate">{item.title}</p>
                        <p className="text-[11px] text-red-500">{item.duration} | Qty: {item.quantity} | ৳{item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="text-[10px] font-black uppercase text-red-400 tracking-widest mb-1 block">Shipping</label>
                <p className="text-[11px] text-orange-500 font-medium leading-snug">
                  {order.customer.address}, <span className="text-blue-500">City : {order.customer.city}</span>, <span className="text-green-500">Post Code: {order.customer.postal}</span>
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/30">
              <div className="space-y-1 mb-4 text-[12px]">
                <div className="flex justify-between items-center"><p className="text-[10px] font-bold uppercase text-slate-400">Sub Total</p><p className="font-bold text-slate-700">৳{order.pricing.subtotal}</p></div>
                <div className="flex justify-between items-center"><p className="text-[10px] font-bold uppercase text-slate-400">Delivery Fee</p><p className="font-bold text-slate-700">৳{order.pricing.shippingFee}</p></div>
                <div className="pt-2 mt-2 border-t border-dashed border-slate-200 flex justify-between items-center">
                  <div><p className="text-[10px] font-bold uppercase text-indigo-500">Total Amount</p><p className="text-xl font-black text-slate-900">৳{order.pricing.totalAmount}</p></div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">Payment</p>
                    <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${order.paymentStatus === "unpaid" ? "bg-red-50 text-red-600 border border-red-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"}`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>

              {order.status === "pending" && (
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => handleStatusUpdate(order._id, "cancelled")} className="py-2.5 bg-white text-red-600 border border-red-200 rounded-xl font-bold uppercase text-[10px] flex items-center justify-center gap-1.5 active:scale-95"><FiX size={16} /> Reject</button>
                  <button onClick={() => handleStatusUpdate(order._id, "completed")} className="py-2.5 bg-indigo-600 text-white rounded-xl font-bold uppercase text-[10px] flex items-center justify-center gap-1.5 shadow-md shadow-indigo-100 active:scale-95"><FiCheck size={16} /> Approve</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}