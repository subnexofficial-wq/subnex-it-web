"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FiMenu, FiLogOut, FiLoader, FiGrid, FiUsers, FiBox, FiShoppingCart, FiCreditCard, FiSettings, FiCode } from "react-icons/fi";
import { useState } from "react";
import Swal from "sweetalert2";
import { FileSignatureIcon, Zap } from "lucide-react";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const nav = [
    { name: "Dashboard", href: "/admin/dashboard", icon: <FiGrid /> },
    { name: "Customers", href: "/admin/dashboard/users", icon: <FiUsers /> },
    { name: "Products", href: "/admin/dashboard/products", icon: <FiBox /> },
    { name: "Orders", href: "/admin/dashboard/orders", icon: <FiShoppingCart /> },
    { name: "Transactions", href: "/admin/dashboard/transactions", icon: <FiCreditCard /> },
    { name: "Pay Methods", href: "/admin/dashboard/payments-Methods", icon: <FiSettings /> },
    { name: " Add Sliders", href: "/admin/dashboard/sliders", icon: <FiSettings /> },
    { name: "Coupons", href: "/admin/dashboard/coupons", icon: <FiCode /> },
    { name: "Automation", href: "/admin/dashboard/automation", icon: <Zap /> },
  ];

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to exit?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, Logout",
    });

    if (result.isConfirmed) {
      setIsLoggingOut(true);
      try {
        const res = await fetch("/api/admin/auth/logout", { method: "POST" });
        if (res.ok) window.location.replace("/admin");
      } catch (err) {
        Swal.fire("Error", "Logout failed", "error");
      } finally {
        setIsLoggingOut(false);
      }
    }
  };

  return (
    <div className="flex h-screen bg-[#F3F4F6] overflow-hidden font-sans text-gray-900">
      
      {/* ================= Sidebar (Desktop & Fixed) ================= */}
      <aside className="hidden md:flex w-72 bg-white border-r border-gray-200 flex-col shrink-0">
        {/* Logo */}
        <div className="px-8 py-7">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-1.5 rounded-lg shadow-lg shadow-blue-200">
              <Image src="/logo.png" alt="logo" width={28} height={28} className="invert brightness-0" />
            </div>
            <span className="text-xl font-black uppercase tracking-tighter text-gray-800">Subnex <span className="text-blue-600">Admin</span></span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto mt-4">
          {nav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 group
                  ${isActive 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-100" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-blue-600"
                  }`}
              >
                <span className={`text-xl ${isActive ? "text-white" : "text-gray-400 group-hover:text-blue-600"}`}>
                  {item.icon}
                </span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User / Logout */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center justify-center gap-2 px-4 py-4 text-xs font-black uppercase tracking-widest rounded-2xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300 disabled:opacity-50"
          >
            {isLoggingOut ? <FiLoader className="animate-spin" /> : <FiLogOut size={16} />}
            {isLoggingOut ? "Processing..." : "Log Out"}
          </button>
        </div>
      </aside>

      {/* ================= Main Viewport ================= */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Topbar */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-6 shrink-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setOpen(true)} className="md:hidden p-2 bg-gray-50 rounded-xl text-gray-700">
              <FiMenu size={22} />
            </button>
            <h1 className="text-sm font-black uppercase tracking-widest text-gray-400">
              {nav.find(n => n.href === pathname)?.name || "Overview"}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-gray-800 uppercase">Administrator</p>
                <p className="text-[10px] font-bold text-green-500 uppercase tracking-tighter">System Online</p>
             </div>
             <div className="w-10 h-10 bg-blue-100 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-blue-600 font-black">A</div>
          </div>
        </header>

        {/* Page Content (Scrollable Area) */}
        <main className="flex-1 overflow-y-auto  custom-scrollbar">
          <div className=" ">
            {children}
          </div>
        </main>
      </div>

      {/* ================= Mobile Sidebar (Drawer) ================= */}
      {open && (
        <>
          <div onClick={() => setOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] md:hidden transition-opacity" />
          <aside className="fixed top-0 left-0 h-full w-72 bg-white z-[70] flex flex-col shadow-2xl animate-in slide-in-from-left duration-300 md:hidden">
            <div className="p-8 border-b border-gray-50">
               <span className="text-xl font-black uppercase tracking-tighter">Subnex <span className="text-blue-600">Admin</span></span>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-4 py-4 rounded-2xl font-bold text-sm ${pathname === item.href ? "bg-blue-600 text-white" : "text-gray-500"}`}
                >
                  <span className="text-xl">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="p-4">
              <button onClick={handleLogout} className="w-full py-4 rounded-2xl bg-red-600 text-white font-black text-xs uppercase tracking-widest">Logout</button>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}