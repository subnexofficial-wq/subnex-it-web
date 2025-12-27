"use client";

import { FiLogOut, FiShield, FiTrash2, FiAlertCircle } from "react-icons/fi";
import Swal from "sweetalert2";

export default function UserSettingsPage() {

  // ✅ Sign out (this device)
  const signOut = async () => {
    Swal.fire({
      title: "Logging out...",
      text: "Are you sure you want to sign out?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#4f46e5",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, Sign Out",
      borderRadius: "24px",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await fetch("/api/auth/logout", { method: "POST" });
        window.location.href = "/login";
      }
    });
  };

  // ✅ Sign out everywhere
  const signOutEverywhere = async () => {
    Swal.fire({
      title: "Sign out from all devices?",
      text: "You will be logged out from all active sessions.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4f46e5",
      confirmButtonText: "Yes, Sign out all",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await fetch("/api/auth/logout", { method: "POST" });
        window.location.href = "/login";
      }
    });
  };

  // ✅ Delete account
  const deleteAccount = async () => {
    Swal.fire({
      title: "Are you absolutely sure?",
      text: "This action is permanent and cannot be undone!",
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete my account",
      cancelButtonText: "Cancel",
      background: "#fff",
      customClass: {
        popup: "rounded-[32px]",
        confirmButton: "rounded-xl px-6 py-3 font-bold uppercase text-xs tracking-widest",
        cancelButton: "rounded-xl px-6 py-3 font-bold uppercase text-xs tracking-widest",
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await fetch("/api/auth/me", { method: "DELETE" });
        
        if (res.ok) {
          Swal.fire({
            title: "Deleted!",
            text: "Your account has been deleted.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false
          });
          setTimeout(() => {
            window.location.href = "/";
          }, 2000);
        } else {
          Swal.fire("Error", "Could not delete account. Try again.", "error");
        }
      }
    });
  };

  return (
    <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="mb-10">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase italic">
          Account <span className="text-indigo-600">Settings</span>
        </h1>
        <p className="text-slate-500 text-sm mt-1 font-medium">
          Manage your account security and preferences.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Account Security Card */}
        <div className="group bg-white border border-slate-100 p-8 rounded-[32px] shadow-sm hover:shadow-xl hover:shadow-slate-100 transition-all duration-300">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <FiShield size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Global Security</h3>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            Suspicious activity? Sign out from all other devices to keep your data safe.
          </p>
          <button
            onClick={signOutEverywhere}
            className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
          >
            Sign out everywhere
          </button>
        </div>

        {/* Standard Sign Out Card */}
        <div className="group bg-white border border-slate-100 p-8 rounded-[32px] shadow-sm hover:shadow-xl hover:shadow-slate-100 transition-all duration-300">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <FiLogOut size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Current Session</h3>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            Ready to leave? You will need to login again to access your account.
          </p>
          <button
            onClick={signOut}
            className="w-full py-3 bg-white border-2 border-slate-100 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 hover:text-orange-600 hover:border-orange-100 transition-all"
          >
            Sign out
          </button>
        </div>

        {/* Danger Zone Card */}


        
      </div>

    </div>
  );
}