"use client";

import { useEffect, useState } from "react";
import { FiBox, FiUsers, FiShoppingCart, FiDollarSign, FiTrendingUp } from "react-icons/fi";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {

        console.log("Fetched stats:", data);
        setStats(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-10 text-center font-bold text-gray-400 uppercase tracking-widest">Loading Analytics...</div>;

  return (
    <div className="space-y-8 p-4 animate-in fade-in duration-500">
      {/* Welcome Header */}
      <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
        <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Overview</h1>
        <p className="text-gray-500 text-sm font-medium mt-1 uppercase tracking-widest">Analytics & Business Intelligence</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4  gap-6">
        <StatCard title="Total Transactions" value={`৳${stats?.totalRevenue}`} icon={<FiDollarSign />} color="bg-green-500" />
        <StatCard title="Total Products" value={stats?.productsCount} icon={<FiBox />} color="bg-blue-600" />
        <StatCard title="Total Orders" value={stats?.totalOrders} icon={<FiShoppingCart />} color="bg-orange-500" />
        <StatCard title="Customers" value={stats?.usersCount} icon={<FiUsers />} color="bg-purple-600" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Line Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
             <h2 className="font-black text-gray-800 uppercase text-sm tracking-widest flex items-center gap-2">
                <FiTrendingUp className="text-blue-600" /> Revenue Flow
             </h2>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.chartData}>
                <defs>
                  <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 'bold', fill: '#94a3b8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 'bold', fill: '#94a3b8'}} />
                <Tooltip 
                   contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="amount" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorAmt)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mini Stats or Recent Activity */}
        <div className="bg-white   p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-center text-center">
            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg">
                <FiBox size={32} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 uppercase">Subnex Admin</h3>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2 px-4 leading-relaxed">
                Database is connected and syncing with {stats?.productsCount} live products.
            </p>
        </div>

      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className="group bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-[0.03] -mr-8 -mt-8 rounded-full group-hover:scale-150 transition-transform duration-700`} />
      <div className="flex items-center gap-4 relative z-10">
        <div className={`${color} p-4 rounded-2xl text-white shadow-lg`}>
          {icon}
        </div>
        <div>
          <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-1">{title}</p>
          <p className="text-2xl font-black text-gray-900 tracking-tighter">{value}</p>
        </div>
      </div>
    </div>
  );
}