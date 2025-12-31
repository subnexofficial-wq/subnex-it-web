"use client";

import { useAuth } from "@/hooks/useAuth";
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
  FiCreditCard,
  FiPackage,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";

export default function OrdersPage() {
  const { user } = useAuth();
  const [view, setView] = useState("list");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sidebars states
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  // Selections
  const [sortBy, setSortBy] = useState("Newest to oldest");
  const [orderDate, setOrderDate] = useState("Last 30 days");



  const fetchOrders = async (params = {}) => {
    setLoading(true);
    const email = user?.email || "";
    try {
      const query = new URLSearchParams({ email, ...params }).toString();
      const res = await fetch(`/api/orders/my-orders?${query}`);
      const data = await res.json();
      if (data.ok) setOrders(data.orders);
    } catch (error) {
      console.error("Order fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders({ range: 30 }); 
  }, []);

  const applySort = () => {
    setSortOpen(false);
    const map = {
      "Newest to oldest": "newest",
      "Oldest to newest": "oldest",
      "Order total (high to low)": "total_desc",
      "Order total (low to high)": "total_asc",
    };
    fetchOrders({ sort: map[sortBy] });
  };

  const applyFilter = () => {
    setFilterOpen(false);
    const ranges = { Today: 1, "Last 7 days": 7, "Last 30 days": 30, "Last 90 days": 90, "Last 12 months": 365 };
    fetchOrders({ range: ranges[orderDate] });
  };

  return (
    <div className="max-w-6xl mx-auto min-h-screen px-4 py-8 md:px-6 bg-gray-50/30">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase italic">
            My <span className="text-indigo-600">Orders</span>
          </h1>
          <p className="text-slate-500 text-sm font-bold mt-1 uppercase tracking-widest opacity-70">
            {loading ? "Syncing Archive..." : `${orders.length} Successful Transactions`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex p-1 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <button onClick={() => setView("list")} className={`p-2.5 rounded-xl transition-all ${view === "list" ? "bg-slate-900 text-white shadow-lg" : "text-slate-400"}`}><FiList size={20} /></button>
            <button onClick={() => setView("grid")} className={`p-2.5 rounded-xl transition-all ${view === "grid" ? "bg-slate-900 text-white shadow-lg" : "text-slate-400"}`}><FiGrid size={20} /></button>
          </div>
          <button onClick={() => setSortOpen(true)} className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">Sort <FiChevronDown /></button>
          <button onClick={() => setFilterOpen(true)} className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-xl shadow-indigo-100">Filter <FiFilter /></button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map(i => <div key={i} className="h-64 w-full bg-white border border-slate-100 animate-pulse rounded-[2.5rem]" />)}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] py-32 text-center">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200"><FiShoppingBag size={48} /></div>
            <h3 className="text-2xl font-black text-slate-900 uppercase italic">No Orders Found</h3>
            <p className="text-slate-500 mb-8 font-medium">Try changing your filters or start a new shop.</p>
            <Link href="/" className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:scale-105 transition-transform">Browse Store</Link>
        </div>
      ) : (
        <div className={view === "list" ? "space-y-8" : "grid grid-cols-1 lg:grid-cols-2 gap-8"}>
          {orders.map((o) => (
            <div key={o._id} className="bg-white border border-slate-100  overflow-hidden hover:shadow-3xl hover:shadow-slate-200/50 transition-all group relative">
              
              {/* STATUS BAR */}
              <div className="px-4 py-2  border-slate-50 flex flex-wrap items-center justify-between gap-4 bg-slate-50/30">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID</span>
                    <span className="text-sm font-black text-slate-900 italic">#{o._id.slice(-8).toUpperCase()}</span>
                  </div>
                  <div className="w-[1px] h-8 bg-slate-200 hidden sm:block"></div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date Placed</span>
                    <span className="text-sm font-bold text-slate-700 flex items-center gap-1.5"><FiCalendar className="text-indigo-500" /> {new Date(o.createdAt).toLocaleDateString("en-GB", {day: '2-digit', month: 'short', year: 'numeric'})}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                   <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm ${o.paymentStatus === 'unpaid' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                     <FiCreditCard size={12} /> {o.paymentStatus}
                   </span>
                   <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm ${o.status === 'pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                     {o.status === 'pending' ? <FiClock size={12}/> : <FiCheckCircle size={12}/>} {o.status}
                   </span>
                </div>
              </div>

              {/* ITEMS SECTION */}
              <div className="px-4 py-1">
                <div className="space-y-6">
                  {o.orderItems?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-6 group/item">
                      <div className="w-20 h-20 bg-slate-50 rounded-[1.5rem] overflow-hidden border border-slate-100 flex-shrink-0 relative">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500" />
                        <span className="absolute top-1 right-1 bg-slate-900 text-white text-[10px] font-black w-6 h-6 rounded-lg flex items-center justify-center shadow-lg">x{item.quantity}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-black text-slate-900 tracking-tight leading-tight truncate">{item.title}</h4>
                        <p className="text-xs text-slate-400 font-bold uppercase mt-1 tracking-tighter">Product SKU: {item.productId?.slice(-6).toUpperCase()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-slate-900 italic">৳ {o.pricing?.totalAmount?.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DRAWER OVERLAY */}
      {(sortOpen || filterOpen) && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] transition-opacity" onClick={() => {setSortOpen(false); setFilterOpen(false)}} />
      )}

      {/* SORT DRAWER */}
      <aside className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white z-[110] shadow-2xl transition-transform duration-700 cubic-bezier(0.16, 1, 0.3, 1) ${sortOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-8 border-b flex justify-between items-center bg-slate-50/30">
            <h2 className="text-2xl font-black italic uppercase tracking-tighter">Sort <span className="text-indigo-600">Archive</span></h2>
            <button onClick={() => setSortOpen(false)} className="p-3 bg-white hover:bg-slate-50 rounded-2xl shadow-sm border border-slate-100"><FiX /></button>
          </div>
          <div className="flex-1 p-8 space-y-3 overflow-y-auto">
            {["Newest to oldest", "Oldest to newest", "Order total (high to low)", "Order total (low to high)"].map(item => (
              <label key={item} className={`flex items-center justify-between p-6 rounded-[1.5rem] cursor-pointer transition-all border-2 ${sortBy === item ? 'border-indigo-600 bg-indigo-50/20' : 'border-transparent bg-slate-50/50 hover:bg-slate-50'}`}>
                <span className={`text-sm font-black uppercase tracking-tight ${sortBy === item ? "text-indigo-600" : "text-slate-500"}`}>{item}</span>
                <input type="radio" checked={sortBy === item} onChange={() => setSortBy(item)} className="w-5 h-5 accent-indigo-600 cursor-pointer" />
              </label>
            ))}
          </div>
          <div className="p-8 border-t bg-slate-50/30 flex gap-4">
            <button onClick={() => setSortBy("Newest to oldest")} className="flex-1 py-5 text-slate-400 font-black uppercase text-[10px] tracking-[0.2em] hover:text-slate-600">Reset</button>
            <button onClick={applySort} className="flex-[2] py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-indigo-100">Apply Sort</button>
          </div>
        </div>
      </aside>

      {/* FILTER DRAWER */}
      <aside className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white z-[110] shadow-2xl transition-transform duration-700 cubic-bezier(0.16, 1, 0.3, 1) ${filterOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-8 border-b flex justify-between items-center bg-slate-50/30">
            <h2 className="text-2xl font-black italic uppercase tracking-tighter">Time <span className="text-indigo-600">Filter</span></h2>
            <button onClick={() => setFilterOpen(false)} className="p-3 bg-white hover:bg-slate-50 rounded-2xl shadow-sm border border-slate-100"><FiX /></button>
          </div>
          <div className="flex-1 p-8 space-y-3 overflow-y-auto">
            {["Today", "Last 7 days", "Last 30 days", "Last 90 days", "Last 12 months"].map(item => (
              <label key={item} className={`flex items-center justify-between p-6 rounded-[1.5rem] cursor-pointer transition-all border-2 ${orderDate === item ? 'border-indigo-600 bg-indigo-50/20' : 'border-transparent bg-slate-50/50 hover:bg-slate-50'}`}>
                <span className={`text-sm font-black uppercase tracking-tight ${orderDate === item ? "text-indigo-600" : "text-slate-500"}`}>{item}</span>
                <input type="radio" checked={orderDate === item} onChange={() => setOrderDate(item)} className="w-5 h-5 accent-indigo-600 cursor-pointer" />
              </label>
            ))}
          </div>
          <div className="p-8 border-t bg-slate-50/30 flex gap-4">
            <button onClick={() => setOrderDate("Last 30 days")} className="flex-1 py-5 text-slate-400 font-black uppercase text-[10px] tracking-[0.2em] hover:text-slate-600">Reset</button>
            <button onClick={applyFilter} className="flex-[2] py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-indigo-100">Apply Filter</button>
          </div>
        </div>
      </aside>
    </div>
  );
}