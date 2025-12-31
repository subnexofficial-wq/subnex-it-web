"use client";

import { useEffect, useState } from "react";
import { Download, Users, Calendar, User, ChevronLeft, ChevronRight } from "lucide-react";

export default function CustomersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  const fetchUsers = (page) => {
    setLoading(true);
    fetch(`/api/admin/users/list?page=${page}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setUsers(data.users);
          setTotalPages(data.totalPages);
          setTotalUsers(data.totalUsers);
          setCurrentPage(data.currentPage);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const downloadCSV = () => {
    const headers = ["Name", "Email", "Mobile", "Role", "Active", "Created At"];
    const rows = users.map((u) => [
      u.name,
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
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="text-blue-600" size={28} /> Customers
          </h1>
          <p className="text-sm text-gray-500 font-medium uppercase tracking-widest">
            Total {totalUsers} Users Registered
          </p>
        </div>
        <button
          onClick={downloadCSV}
          className="flex items-center justify-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl transition-all shadow-lg text-sm font-bold"
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
          {/* --- LARGE DEVICE VIEW --- */}
          <div className="hidden lg:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 font-black italic uppercase text-[10px] tracking-widest text-gray-400">
                  <th className="px-6 py-5">Customer Info</th>
                  <th className="px-6 py-5">Mobile</th>
                  <th className="px-6 py-5">Name</th>
                  <th className="px-6 py-5">Role</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5">Join Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 font-black italic shadow-sm">
                          {user.email[0].toUpperCase()}
                        </div>
                        <span className="font-bold text-gray-800">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-600">{user?.mobile || "—"}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-600">{user?.name || "—"}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-purple-50 text-purple-600 text-[10px] font-black uppercase rounded-lg border border-purple-100">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${user.isActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        {user.isActive ? 'Active' : 'Blocked'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-gray-400 italic">
                      {new Date(user.createdAt).toLocaleDateString("en-GB")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* --- MOBILE VIEW (Cards) --- */}
          <div className="grid grid-cols-1 gap-4 lg:hidden mb-6">
            {users.map((user) => (
               <div key={user._id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                 <div className={`absolute top-0 left-0 w-1.5 h-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                 <div className="flex justify-between items-center mb-3">
                    <p className="font-black text-gray-900 truncate pr-4">{user.email}</p>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{user.isActive ? 'Active' : 'Blocked'}</span>
                 </div>
                 <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                    <div>Mobile: <span className="text-gray-700 block text-sm">{user.mobile || "N/A"}</span></div>
                    <div className="text-right">Role: <span className="text-purple-600 block text-sm">{user.role}</span></div>
                 </div>
               </div>
            ))}
          </div>

          {/* PAGINATION CONTROLS (১০ টার বেশি ডাটা থাকলে দেখাবে) */}
          {totalUsers > 10 && (
            <div className="flex items-center justify-between bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Page <span className="text-gray-900 font-black italic">{currentPage}</span> of {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="p-2 rounded-xl bg-gray-50 border border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 transition-all"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="p-2 rounded-xl bg-gray-50 border border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 transition-all"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}

          {users.length === 0 && (
            <div className="bg-white p-20 rounded-3xl border-2 border-dashed border-gray-200 text-center">
              <p className="font-black text-gray-300 uppercase tracking-widest italic">No customers found</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}