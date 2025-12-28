"use client";

import { useEffect, useState } from "react";
import { FiBox, FiUsers, FiShoppingCart, FiDollarSign, FiTrendingUp, FiCalendar, FiClock, FiActivity } from "react-icons/fi";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Legend } from "recharts";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalRevenue: 0, productsCount: 0, totalOrders: 0, usersCount: 0, chartData: [] });
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState("7days"); 
  const [selectedDate, setSelectedDate] = useState("");

  const fetchStats = () => {
    setLoading(true);
    let url = `/api/admin/stats?filter=${timeFilter}`;
    if (timeFilter === "custom" && selectedDate) {
      url = `/api/admin/stats?date=${selectedDate}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    if (timeFilter !== "custom") fetchStats();
  }, [timeFilter]);

  useEffect(() => {
    if (timeFilter === "custom" && selectedDate) fetchStats();
  }, [selectedDate]);

  return (
    <div className={`space-y-8 p-4 transition-all duration-500 ${loading ? 'opacity-60' : 'opacity-100'}`}>
      
      {/* HEADER SECTION */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center bg-white border border-gray-100 rounded-[1rem] p-8 shadow-sm gap-6">
        <div>
           <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight italic">
            Dashboard <span className="text-blue-600">Intelligence</span>
           </h1>
           <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Unified Data Stream</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
           <div className="flex items-center gap-2 bg-gray-50 px-4 py-2.5 rounded-2xl border border-gray-100">
              <FiClock className="text-blue-600" size={14}/>
              <select 
                value={timeFilter} 
                onChange={(e) => setTimeFilter(e.target.value)}
                className="bg-transparent text-[11px] font-black uppercase outline-none cursor-pointer text-gray-700"
              >
                <option value="7days">Weekly Flow</option>
                <option value="month">Monthly Overview</option>
                <option value="custom">Specific Date</option>
              </select>
           </div>

           {timeFilter === "custom" && (
             <div className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-2xl shadow-lg animate-in fade-in slide-in-from-right-4">
                <FiCalendar className="text-white" size={14}/>
                <input 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-transparent text-white text-[11px] font-black outline-none [color-scheme:dark]"
                />
             </div>
           )}
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value={`৳${stats.totalRevenue}`} icon={<FiDollarSign />} color="bg-emerald-500" loading={loading} />
        <StatCard title="Total Products" value={stats.productsCount} icon={<FiBox />} color="bg-blue-600" loading={loading} />
        <StatCard title="Total Orders" value={stats.totalOrders} icon={<FiShoppingCart />} color="bg-orange-500" loading={loading} />
        <StatCard title="Total Users" value={stats.usersCount} icon={<FiUsers />} color="bg-violet-600" loading={loading} />
      </div>

      {/* MULTI-METRIC CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
        <div className="lg:col-span-3 bg-white p-5 rounded-[1rem] border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-10">
              <h2 className="font-black text-gray-800 uppercase text-xs tracking-[0.2em] flex items-center gap-2">
                <FiActivity className="text-blue-600 animate-pulse" /> Multi-Metric Growth
              </h2>
          </div>
          
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.chartData}>
                <defs>
                  <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', padding: '20px' }} 
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }} />
                
                <Area name="Income (৳)" type="monotone" dataKey="income" stroke="#2563eb" strokeWidth={4} fill="url(#colorInc)" />
                <Area name="Orders" type="monotone" dataKey="orders" stroke="#f97316" strokeWidth={3} fill="transparent" />
                <Area name="Users" type="monotone" dataKey="users" stroke="#8b5cf6" strokeWidth={3} fill="transparent" />
                <Area name="Products" type="monotone" dataKey="products" stroke="#10b981" strokeWidth={3} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SUMMARY SIDE PANEL */}
        <div className="bg-white p-5 rounded-[1rem] text-white flex flex-col justify-between">
            <div>
                <h3 className="font-black uppercase text-[10px] tracking-[0.3em] text-black mb-6">Period Insights</h3>
                <div className="space-y-6">
                    <InsightRow label="Total Income" value={`৳${stats.totalRevenue}`} color="text-blue-500" />
                    <InsightRow label="New Orders" value={stats.chartData.reduce((a, b) => a + b.orders, 0)} color="text-orange-500" />
                    <InsightRow label="New Users" value={stats.chartData.reduce((a, b) => a + b.users, 0)} color="text-violet-500" />
                    <InsightRow label="New Products" value={stats.chartData.reduce((a, b) => a + b.products, 0)} color="text-emerald-500" />
                </div>
            </div>
            <div className="mt-8 p-6 bg-gray-100 rounded-3xl text-black border border-slate-700/50">
                <p className="text-[9px] font-bold text-slate-500 uppercase">Status</p>
                <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <p className="text-xs font-black"> TODAY </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, loading }) {
  return (
    <div className={`group bg-white p-7 rounded-[1rem] border border-gray-100 shadow-sm transition-all duration-500 ${loading ? 'animate-pulse' : 'hover:shadow-xl'}`}>
      <div className="flex items-center gap-5">
        <div className={`${color} p-4 rounded-2xl text-white transition-transform group-hover:scale-110`}>
          {icon}
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{title}</p>
          <p className="text-2xl font-black text-slate-900 tracking-tighter">{value}</p>
        </div>
      </div>
    </div>
  );
}

function InsightRow({ label, value, color }) {
    return (
        <div>
            <p className="text-[9px] font-black text-black uppercase mb-1">{label}</p>
            <p className={`text-xl font-black ${color}`}>{value}</p>
        </div>
    )
}