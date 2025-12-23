"use client";

import FooterCountrySelector from "@/Components/CountrySection";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiLogOut, FiUser, FiSettings, FiShoppingBag } from "react-icons/fi";

export default function UserLayout({ children }) {
  const [userOpen, setUserOpen] = useState(false);
  const userRef = useRef(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setUser(data.user);
      });
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) {
        setUserOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const logout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    window.location.href = "/";
  };

  const initials =
    user?.firstName && user?.lastName
      ? (user.firstName[0] + user.lastName[0]).toUpperCase()
      : "U";

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans flex flex-col">
      {/* ================= TOP BAR (Sticky & Glass) ================= */}
      <header className="sticky top-0 z-[100] bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="container mx-auto h-16 flex items-center justify-between px-6">
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <Image
              src="/logo2.png"
              alt="Logo"
              width={130}
              height={36}
              priority
              className="w-auto h-8"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-[13px] font-semibold uppercase tracking-wider text-slate-600">
            <Link href="/" className="hover:text-black transition-colors">Shop</Link>
            <Link href="/user" className="text-black border-b-2 border-black pb-1">
              Orders
            </Link>
          </nav>

          {/* ================= USER DROPDOWN ================= */}
          <div className="relative" ref={userRef}>
            <button
              onClick={() => setUserOpen(!userOpen)}
              className="flex items-center gap-2 group p-1 pr-2 rounded-full hover:bg-slate-100 transition-all"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-200 to-slate-100 border border-slate-300 overflow-hidden flex items-center justify-center shadow-sm">
                {user?.photo ? (
                  <img src={user.photo} className="w-full h-full object-cover" alt="Profile" />
                ) : (
                  <span className="text-xs font-bold text-slate-600">{initials}</span>
                )}
              </div>
              <FiChevronDown className={`text-slate-400 transition-transform duration-300 ${userOpen ? 'rotate-180' : ''}`} />
            </button>

            {userOpen && (
              <div className="absolute right-0 mt-3 w-72 bg-white border border-slate-200 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-5 py-4 bg-slate-50/50 border-b border-slate-100">
                  <p className="text-sm font-bold text-slate-900 truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-slate-500 truncate mt-0.5">{user?.email}</p>
                </div>

                <div className="p-2">
                  <Link
                    href="/user/profile"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-black rounded-lg transition-colors"
                  >
                    <FiUser className="text-lg opacity-70" />
                    My Profile
                  </Link>

                  <Link
                    href="/user"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-black rounded-lg transition-colors md:hidden"
                  >
                    <FiShoppingBag className="text-lg opacity-70" />
                    Orders
                  </Link>

                  <Link
                    href="/user/settings"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-black rounded-lg transition-colors"
                  >
                    <FiSettings className="text-lg opacity-70" />
                    Account Settings
                  </Link>

                  <div className="h-px bg-slate-100 my-2 mx-2"></div>

                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FiLogOut className="text-lg" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 container mx-auto max-w-6xl w-full px-6 py-12">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {children}
        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="mt-auto border-t border-slate-200 bg-white">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
            <div className="scale-90 origin-left">
              <FooterCountrySelector defaultCountry="French Polynesia" />
            </div>

            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {[
                { label: "Refund policy", href: "/policies/refund-exchange-policy" },
                { label: "Shipping", href: "/policies/shipping" },
                { label: "Privacy policy", href: "/privacy-policy" },
                { label: "Terms of service", href: "/terms-of-service" },
                { label: "Contact", href: "/policies/ContactInformation" },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-[11px] font-medium text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          
          <p className="text-center mt-8 text-[10px] text-slate-400 uppercase tracking-widest">
            © {new Date().getFullYear()} Subnex. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}