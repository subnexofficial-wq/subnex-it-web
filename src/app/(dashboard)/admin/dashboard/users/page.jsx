"use client";

import { useEffect, useState } from "react";
import { Download, Users, Mail, Phone, Calendar, ShieldCheck, User, MoreVertical } from "lucide-react";

export default function CustomersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/users/list", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) setUsers(data.users);
      })
      .finally(() => setLoading(false));
  }, []);

  const downloadCSV = () => {
    const headers = ["Email", "Mobile", "Role", "Active", "Created At"];
    const rows = users.map((u) => [
      u.email,
      u.mobile,
      u.role,
      u.isActive ? "Yes" : "No",
      new Date(u.createdAt).toLocaleString(),
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "customers.csv";
    a.click();
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="text-blue-600" size={28} /> Customers
            </h1>
            <p className="text-sm text-gray-500">Total {users.length} users registered</p>
          </div>
          <button
            onClick={downloadCSV}
            className="flex items-center justify-center gap-2 bg-black  border border-gray-200  text-white px-4 py-2 rounded-lg transition-all shadow-sm font-medium text-sm"
          >
            <Download size={16} /> Export CSV
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* --- MOBILE & MEDIUM DEVICE VIEW (Cards) --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 lg:hidden gap-4">
              {users.map((user) => (
                <div key={user._id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
                  <div className={`absolute top-0 left-0 w-1 h-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  
                  <div className="flex justify-between items-start mb-4">
                    <div className="h-10 w-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                      <User size={20} />
                    </div>
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                      user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {user.isActive ? 'Active' : 'Blocked'}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-bold tracking-tighter">Email Address</p>
                      <p className="text-gray-900 font-medium truncate">{user.email}</p>
                    </div>
                    
                    <div className="flex justify-between border-t border-gray-50 pt-3">
                      <div>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter">Mobile</p>
                        <p className="text-sm text-gray-700">{user.mobile || "N/A"}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter">Role</p>
                        <p className="text-sm text-purple-600 font-semibold capitalize">{user.role}</p>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center gap-1.5 text-xs text-gray-400">
                      <Calendar size={12} />
                      Joined: {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* --- LARGE DEVICE VIEW (Desktop Table) --- */}
            <div className="hidden lg:block bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Customer Info</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Mobile</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Join Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-bold">
                            {user.email[0].toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-800">{user.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{user.mobile || "—"}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-purple-50 text-purple-600 text-xs font-semibold rounded-full border border-purple-100 capitalize">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`h-2 w-2 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                          <span className={`text-sm font-medium ${user.isActive ? 'text-green-700' : 'text-red-700'}`}>
                            {user.isActive ? 'Active' : 'Blocked'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 italic">
                        {new Date(user.createdAt).toLocaleDateString("en-GB")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {users.length === 0 && (
              <div className="bg-white p-20 rounded-xl border border-dashed border-gray-300 text-center">
                <p className="text-gray-400">No customers found in the database.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}