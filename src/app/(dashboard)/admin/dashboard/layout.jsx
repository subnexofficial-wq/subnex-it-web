"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation"; // useRouter যুক্ত করা হয়েছে
import { FiMenu, FiLogOut, FiLoader } from "react-icons/fi"; // FiLoader যুক্ত করা হয়েছে
import { useState } from "react";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false); // লোডিং স্টেট

  const nav = [
    { name: "Dashboard", href: "/admin/dashboard" },
    { name: "Customers", href: "/admin/dashboard/users" },
    { name: "Products", href: "/admin/dashboard/products" },
    { name: "Orders", href: "/admin/dashboard/orders" },
    { name: "Payments", href: "/admin/dashboard/payments" },
    { name: "Settings", href: "/admin/dashboard/settings" },
  ];

  // ================= Logout Function =================
  const handleLogout = async () => {
    if (!confirm("Are you sure you want to logout?")) return;

    setIsLoggingOut(true);
    try {
      const res = await fetch("/api/admin/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        // সফল হলে লগইন পেজে পাঠিয়ে দিবে এবং হিস্ট্রি ক্লিয়ার করবে
        window.location.replace("/admin");
      } else {
        alert("Logout failed. Please try again.");
      }
    } catch (err) {
      console.error("Logout Error:", err);
      alert("Something went wrong!");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 flex font-sans">
      {/* ================= Sidebar (Desktop) ================= */}
      <aside className="hidden md:flex w-64 bg-black text-white flex-col">
        {/* Logo */}
        <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-800">
          <Image src="/logo.png" alt="logo" width={32} height={32} />
          <span className="text-xl font-bold">Subnex Admin</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1 text-sm">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-2 rounded transition
                ${
                  pathname === item.href
                    ? "bg-indigo-600 text-white"
                    : "hover:bg-gray-800"
                }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Logout Button (Desktop) */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm rounded bg-red-600 hover:bg-red-700 transition disabled:opacity-50"
          >
            {isLoggingOut ? <FiLoader className="animate-spin" /> : <FiLogOut />}
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </aside>

      {/* ================= Mobile Sidebar Overlay ================= */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      {/* ================= Mobile Sidebar ================= */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-black text-white z-50 transform transition-transform md:hidden
          ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="px-6 py-5 border-b border-gray-800 flex items-center gap-2">
          <Image src="/logo.png" alt="logo" width={32} height={32} />
          <span className="text-lg font-bold">Subnex Admin</span>
        </div>

        <nav className="px-4 py-4 space-y-1 text-sm">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`block px-4 py-2 rounded transition
                ${
                  pathname === item.href
                    ? "bg-indigo-600"
                    : "hover:bg-gray-800"
                }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Logout Button (Mobile) */}
        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm bg-red-600 rounded active:scale-95 disabled:opacity-50"
          >
            {isLoggingOut ? <FiLoader className="animate-spin" /> : <FiLogOut />}
            Logout
          </button>
        </div>
      </aside>

      {/* ================= Main Content ================= */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="h-14 bg-white border-b flex items-center px-4 md:px-6 shadow-sm">
          <button
            onClick={() => setOpen(true)}
            className="md:hidden text-gray-700"
          >
            <FiMenu size={22} />
          </button>
          <h1 className="ml-3 text-sm font-semibold text-gray-700">
            Admin Panel
          </h1>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}