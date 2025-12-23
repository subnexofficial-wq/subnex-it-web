"use client";

import React, { useState, useEffect } from "react";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiClock,
  FiCheck,
  FiX,
  FiPackage,
  FiHash,
  FiFilter,
} from "react-icons/fi";
import Swal from "sweetalert2";

export default function AdminOrderDashboard() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

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

  // Filter Logic
  useEffect(() => {
    if (filter === "all") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter((order) => order.status === filter));
    }
  }, [filter, orders]);

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
          Swal.fire({
            title: "Success!",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
          fetchOrders();
        }
      } catch (err) {
        Swal.fire("Error", "Update failed", "error");
      }
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center text-xl font-bold animate-pulse text-indigo-600">
        Loading Orders...
      </div>
    );

  return (
    <div className="p-4 md:p-6 bg-[#f8fafc] min-h-screen">
      {/* Header */}
      <div className="container mx-auto mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900">
            Incoming <span className="text-indigo-600">Orders</span>
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Manage and process your store orders
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
          {["all", "pending", "completed", "cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold uppercase transition-all ${
                filter === status
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: 3 columns for better width control */}
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
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-black  tracking-wider ${
                  order.status === "completed"
                    ? "bg-emerald-100 text-emerald-700"
                    : order.status === "cancelled"
                    ? "bg-red-100 text-red-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {order.status}
              </span>
            </div>

            <div className="p-4 space-y-4 flex-grow">
              {/* Customer Info */}
              <div>
                <label className="text-[10px] font-black uppercase text-indigo-400 tracking-widest mb-1 block">
                  Customer
                </label>
                <h4 className="text-md font-bold text-slate-900 leading-tight">
                  {order.customer.firstName} {order.customer.lastName}
                </h4>
                <div className="mt-1.5 space-y-1">
                  <div className="flex items-center gap-2 text-slate-600 text-[12px]">
                    <FiMail className="text-slate-400" size={12} />{" "}
                    {order.customer.email}
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 text-[12px]">
                    <FiPhone className="text-slate-400" size={12} />{" "}
                    {order.customer.phone || "N/A"}
                  </div>
                </div>
              </div>

              {/* Items Summary (Compact) */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block">
                  Order Summary
                </label>
                <div className="space-y-2">
                  {order.orderItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <img
                        src={item.image}
                        className="w-8 h-8 rounded-lg object-cover border"
                        alt=""
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold text-slate-800 truncate">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-red-500">
                          {" "}
                          {item.duration} | Qty: {item.quantity} | ৳{" "}
                          {item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="text-[10px] font-black uppercase text-red-400 tracking-widest mb-1 block">
                  Shipping
                </label>
                <p className="text-[11px] text-orange-500 font-medium leading-snug">
                  {order.customer.address},{" "}
                  <span className="text-blue-500">
                    {" "}
                    City : {order.customer.city}
                  </span>
                  ,{" "}
                  <span className="text-green-500">
                    {" "}
                    Post Code: {order.customer.postal}
                  </span>
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/30">
              {/* Price Summary Table */}
              <div className="space-y-1 mb-4">
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-bold uppercase text-slate-400">
                    Sub Total
                  </p>
                  <p className="text-sm font-bold text-slate-700">
                    ৳{order.pricing.subtotal}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-bold uppercase text-slate-400">
                    Delivery Fee
                  </p>
                  <p className="text-sm font-bold text-slate-700">
                    ৳{order.pricing.shippingFee}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-bold uppercase text-slate-400">
                    Tip
                  </p>
                  <p className="text-sm font-bold text-slate-700">
                    ৳{order.pricing.tip}
                  </p>
                </div>
                <div className="pt-2 mt-2 border-t border-dashed border-slate-200 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-bold uppercase text-indigo-500">
                      Total Amount
                    </p>
                    <p className="text-xl font-black text-slate-900">
                      ৳{order.pricing.totalAmount}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">
                      Payment
                    </p>
                    <span
                      className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${
                        order.paymentStatus === "unpaid"
                          ? "bg-red-50 text-red-600 border border-red-100"
                          : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {order.status === "pending" && (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleStatusUpdate(order._id, "cancelled")}
                    className="py-2.5 bg-white text-red-600 border border-red-200 rounded-xl font-bold uppercase text-[10px] hover:bg-red-50 transition-all flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <FiX size={16} /> Reject
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(order._id, "completed")}
                    className="py-2.5 bg-indigo-600 text-white rounded-xl font-bold uppercase text-[10px] hover:bg-indigo-700 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-indigo-100 active:scale-95"
                  >
                    <FiCheck size={16} /> Approve
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-20 text-slate-400 font-medium">
          No orders found in this category.
        </div>
      )}
    </div>
  );
}
