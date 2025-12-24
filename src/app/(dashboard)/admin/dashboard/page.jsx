"use client";

import { useEffect, useState } from "react";
import { FiBox, FiUsers, FiShoppingCart, FiDollarSign, FiTrendingUp } from "react-icons/fi";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

export default function AdminDashboard() {
  // ১. ডামি ডেটা দিয়ে ইনিশিয়াল স্টেট সেট করা
  const [stats, setStats] = useState({
    totalRevenue: "0000",
    productsCount: "00",
    totalOrders: "00",
    usersCount: "00",
    chartData: [
        { name: "Jan", amount: 0 },
        { name: "Feb", amount: 0 },
        { name: "Mar", amount: 0 },
    ]
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className={`space-y-8 p-4 transition-opacity duration-700 ${loading ? 'opacity-60 cursor-wait' : 'opacity-100'}`}>
      
      {/* Welcome Header */}
      <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
        <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Overview</h1>
        <p className="text-gray-500 text-sm font-medium mt-1 uppercase tracking-widest">
            {loading ? "Syncing Live Intelligence..." : "Analytics & Business Intelligence"}
        </p>
      </div>

      {/* Stats Cards - এখানে stats এর ভ্যালু সরাসরি কাজ করবে */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard 
            title="Total Transactions" 
            value={loading ? "৳00" : `৳${stats.totalRevenue}`} 
            icon={<FiDollarSign />} 
            color="bg-green-500" 
            loading={loading}
        />
        <StatCard 
            title="Total Products" 
            value={loading ? "00" : stats.productsCount} 
            icon={<FiBox />} 
            color="bg-blue-600" 
            loading={loading}
        />
        <StatCard 
            title="Total Orders" 
            value={loading ? "00" : stats.totalOrders} 
            icon={<FiShoppingCart />} 
            color="bg-orange-500" 
            loading={loading}
        />
        <StatCard 
            title="Customers" 
            value={loading ? "00" : stats.usersCount} 
            icon={<FiUsers />} 
            color="bg-purple-600" 
            loading={loading}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
             <h2 className="font-black text-gray-800 uppercase text-sm tracking-widest flex items-center gap-2">
                <FiTrendingUp className="text-blue-600" /> Revenue Flow
             </h2>
             {loading && <span className="text-[10px] animate-pulse bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold">UPDATING</span>}
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.chartData}>
                <defs>
                  <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 'bold', fill: '#94a3b8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 'bold', fill: '#94a3b8'}} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none' }} />
                <Area type="monotone" dataKey="amount" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorAmt)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-center text-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg transition-colors ${loading ? 'bg-gray-100 text-gray-400' : 'bg-blue-50 text-blue-600'}`}>
                <FiBox size={32} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 uppercase">Subnex Admin</h3>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2 px-4 leading-relaxed">
                {loading ? "Establishing secure connection to database..." : `Database is connected and syncing with ${stats.productsCount} live products.`}
            </p>
        </div>
      </div>
    </div>
  );
}

// কার্ড কম্পোনেন্টেও loading prop ব্যবহার করে এনিমেশন দেওয়া হয়েছে
function StatCard({ title, value, icon, color, loading }) {
  return (
    <div className={`group bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm transition-all duration-300 relative overflow-hidden ${loading ? 'animate-pulse' : 'hover:shadow-xl'}`}>
      <div className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-[0.03] -mr-8 -mt-8 rounded-full group-hover:scale-150 transition-transform duration-700`} />
      <div className="flex items-center gap-4 relative z-10">
        <div className={`${loading ? 'bg-gray-200' : color} p-4 rounded-2xl text-white shadow-lg transition-colors`}>
          {icon}
        </div>
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{title}</p>
          <p className="text-2xl font-black text-gray-900 tracking-tighter">{value}</p>
        </div>
      </div>
    </div>
  );
}