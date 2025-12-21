"use client"

export default function AdminDashboard() {
  return (
    <div className="space-y-8 text-black">
      <div className="admin-gradient shadow-glow rounded-2xl p-8 ">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-sm opacity-90">Business overview</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat title="Total Revenue" value="৳ 0" />
        <Stat title="Products" value="0" />
        <Stat title="Orders" value="0" />
        <Stat title="Customers" value="0" />
      </div>
    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div className="admin-card p-4">
      <p className="text-xs text-gray-500">{title}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}