"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";

export default function CustomersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/users/list", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (data.ok) setUsers(data.users);
      })
      .finally(() => setLoading(false));
  }, []);

  // 📥 CSV Download
  const downloadCSV = () => {
    const headers = [
      "Email",
      "Mobile",
      "Role",
      "Active",
      "Created At",
    ];

    const rows = users.map(u => [
      u.email,
      u.mobile,
      u.role,
      u.isActive ? "Yes" : "No",
      new Date(u.createdAt).toLocaleString(),
    ]);

    const csv =
      [headers, ...rows]
        .map(row => row.join(","))
        .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "customers.csv";
    a.click();
  };

  return (
    <div className="admin-card text-black p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">
          Customers
        </h1>

        <button
          onClick={downloadCSV}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded text-sm"
        >
          <Download size={16} />
          Export Excel
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <table className="w-full text-sm">
          <thead className="border-b text-gray-500">
            <tr>
              <th className="text-left py-2">Email</th>
              <th>Mobile</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>

          <tbody>
            {users.map(user => (
              <tr key={user._id} className="border-b">
                <td className="py-3">{user.email}</td>
                <td className="text-center">{user.mobile}</td>
                <td className="text-center capitalize">{user.role}</td>
                <td className="text-center">
                  {user.isActive ? (
                    <span className="text-green-600">Active</span>
                  ) : (
                    <span className="text-red-600">Blocked</span>
                  )}
                </td>
                <td className="text-center">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
