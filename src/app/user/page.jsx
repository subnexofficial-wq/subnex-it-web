"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  FiFilter,
  FiChevronDown,
  FiGrid,
  FiList,
  FiX,
  FiShoppingBag,
  FiCalendar,
} from "react-icons/fi";

export default function OrdersPage() {
  const [view, setView] = useState("list"); // 'list' or 'grid'
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Sidebars states
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  // Selections
  const [sortBy, setSortBy] = useState("Newest to oldest");
  const [orderDate, setOrderDate] = useState("Today");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchOrders = async (params = {}) => {
    setLoading(true);
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`/api/orders?${query}`, { credentials: "include" });
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Order fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const applySort = () => {
    setSortOpen(false);
    const map = {
      "Newest to oldest": "newest",
      "Oldest to newest": "oldest",
      "Order number (high to low)": "order_desc",
      "Order number (low to high)": "order_asc",
      "Order total (high to low)": "total_desc",
      "Order total (low to high)": "total_asc",
    };
    fetchOrders({ sort: map[sortBy] });
  };

  const applyFilter = () => {
    setFilterOpen(false);
    if (orderDate === "Custom") {
      fetchOrders({ start: startDate, end: endDate });
    } else {
      const ranges = { "Today": 1, "Last 7 days": 7, "Last 30 days": 30, "Last 90 days": 90, "Last 12 months": 365 };
      fetchOrders({ range: ranges[orderDate] });
    }
  };

  return (
    <div className="max-w-6xl mx-auto min-h-screen px-4 py-8 md:px-0">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase italic">
            Your <span className="text-indigo-600">Orders</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">Manage and track your recent purchases.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex p-1 bg-slate-100 rounded-xl">
            <button 
              onClick={() => setView("list")} 
              className={`p-2 rounded-lg transition-all ${view === "list" ? "bg-white shadow-sm text-indigo-600" : "text-slate-500"}`}
            >
              <FiList size={18} />
            </button>
            <button 
              onClick={() => setView("grid")} 
              className={`p-2 rounded-lg transition-all ${view === "grid" ? "bg-white shadow-sm text-indigo-600" : "text-slate-500"}`}
            >
              <FiGrid size={18} />
            </button>
          </div>
          <button 
            onClick={() => setSortOpen(true)} 
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
          >
            Sort <FiChevronDown />
          </button>
          <button 
            onClick={() => setFilterOpen(true)} 
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
          >
            Filter <FiFilter />
          </button>
        </div>
      </div>

      {/* ORDERS DISPLAY */}
      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 w-full bg-slate-100 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-[32px] py-24 text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
            <FiShoppingBag size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No orders found</h3>
          <p className="text-slate-500 mt-2 mb-8">It looks like you haven't placed any orders yet.</p>
          <Link href="/" className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className={view === "list" ? "space-y-4" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"}>
          {orders.map((o) => (
            <div 
              key={o._id} 
              className={`bg-white border border-slate-100 rounded-2xl transition-all hover:shadow-xl hover:shadow-slate-100 group ${view === "list" ? "p-4 flex items-center justify-between" : "p-6"}`}
            >
              <div className={`flex items-center gap-5 ${view === 'grid' ? 'mb-6' : ''}`}>
                <div className="relative w-16 h-16 md:w-20 md:h-20 bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 flex-shrink-0">
                  <img 
                    src={o.items?.[0]?.image || "https://placehold.co/400x400/f1f5f9/64748b?text=Subnex"} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded">Order</span>
                    <p className="font-black text-slate-900">#{o.orderNumber || '0000'}</p>
                  </div>
                  <p className="text-xs font-bold text-slate-400 uppercase italic">
                    {o.items?.length || 1} {o.items?.length > 1 ? 'Items' : 'Item'} • <FiCalendar className="inline mb-0.5" /> Dec 22
                  </p>
                  {view === 'list' && (
                    <div className="mt-2">
                       <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full uppercase">Confirmed</span>
                    </div>
                  )}
                </div>
              </div>

              <div className={view === "list" ? "text-right" : "flex items-center justify-between border-t pt-4"}>
                {view === 'grid' && <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full uppercase">Confirmed</span>}
                <p className="text-xl font-black text-slate-900">
                  <span className="text-sm font-normal text-slate-400 mr-1 italic">৳</span>
                  {o.total?.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DRAWER OVERLAY */}
      {(sortOpen || filterOpen) && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] transition-opacity duration-300" 
          onClick={() => {setSortOpen(false); setFilterOpen(false)}} 
        />
      )}

      {/* SORT DRAWER */}
      <aside className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white z-[110] shadow-2xl transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${sortOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-8 border-b flex justify-between items-center bg-slate-50/50">
            <h2 className="text-2xl font-black italic uppercase tracking-tighter">Sort By</h2>
            <button onClick={() => setSortOpen(false)} className="p-2 hover:bg-white rounded-full transition-colors shadow-sm"><FiX /></button>
          </div>
          <div className="flex-1 p-8 space-y-3 overflow-y-auto">
            {["Newest to oldest", "Oldest to newest", "Order number (high to low)", "Order number (low to high)", "Order total (high to low)", "Order total (low to high)"].map(item => (
              <label key={item} className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all border ${sortBy === item ? 'border-indigo-600 bg-indigo-50/30' : 'border-transparent hover:bg-slate-50'}`}>
                <span className={`text-sm font-bold ${sortBy === item ? "text-indigo-600" : "text-slate-600"}`}>{item}</span>
                <input type="radio" checked={sortBy === item} onChange={() => setSortBy(item)} className="w-5 h-5 accent-indigo-600" />
              </label>
            ))}
          </div>
          <div className="p-8 border-t flex gap-4">
            <button onClick={() => setSortBy("Newest to oldest")} className="flex-1 py-4 text-slate-400 font-bold uppercase text-xs tracking-widest hover:text-slate-600 transition-colors">Reset</button>
            <button onClick={applySort} className="flex-2 px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold uppercase text-xs tracking-widest shadow-lg shadow-indigo-100">Apply Sort</button>
          </div>
        </div>
      </aside>

      {/* FILTER DRAWER */}
      <aside className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white z-[110] shadow-2xl transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${filterOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-8 border-b flex justify-between items-center bg-slate-50/50">
            <h2 className="text-2xl font-black italic uppercase tracking-tighter">Filter</h2>
            <button onClick={() => setFilterOpen(false)} className="p-2 hover:bg-white rounded-full transition-colors shadow-sm"><FiX /></button>
          </div>
          <div className="flex-1 p-8 space-y-3 overflow-y-auto">
            {["Today", "Last 7 days", "Last 30 days", "Last 90 days", "Last 12 months", "Custom"].map(item => (
              <label key={item} className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all border ${orderDate === item ? 'border-indigo-600 bg-indigo-50/30' : 'border-transparent hover:bg-slate-50'}`}>
                <span className={`text-sm font-bold ${orderDate === item ? "text-indigo-600" : "text-slate-600"}`}>{item}</span>
                <input type="radio" checked={orderDate === item} onChange={() => setOrderDate(item)} className="w-5 h-5 accent-indigo-600" />
              </label>
            ))}
            {orderDate === "Custom" && (
              <div className="space-y-4 pt-6 mt-4 border-t border-slate-100 animate-in fade-in slide-in-from-top-2">
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-2 ml-1 tracking-widest">Start Date</p>
                  <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full bg-slate-50 border-none p-4 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-2 ml-1 tracking-widest">End Date</p>
                  <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full bg-slate-50 border-none p-4 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-600" />
                </div>
              </div>
            )}
          </div>
          <div className="p-8 border-t flex gap-4">
            <button onClick={() => setOrderDate("Today")} className="flex-1 py-4 text-slate-400 font-bold uppercase text-xs tracking-widest hover:text-slate-600 transition-colors">Reset</button>
            <button onClick={applyFilter} className="flex-2 px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold uppercase text-xs tracking-widest shadow-lg shadow-indigo-100">Apply Filter</button>
          </div>
        </div>
      </aside>
    </div>
  );
}