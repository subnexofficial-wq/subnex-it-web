"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Swal from "sweetalert2";

export default function LoginPage() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- Forgot Password Logic ---
  const handleForgotPassword = async () => {
    const { value: email } = await Swal.fire({
      title: "Forgot Password",
      text: "আপনার রেজিস্টার্ড জিমেইল অ্যাড্রেসটি লিখুন",
      input: "email",
      inputPlaceholder: "example@gmail.com",
      showCancelButton: true,
      confirmButtonText: "Send Link",
      confirmButtonColor: "#4f46e5",
    });

    if (email) {
      Swal.fire({ 
        title: "Sending...", 
        allowOutsideClick: false, 
        didOpen: () => Swal.showLoading() 
      });
      
      try {
        const res = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // token: tokenFromUrl,
          body: JSON.stringify({ email: email.trim().toLowerCase() }),
        });

        const data = await res.json();

        if (res.ok) {
          Swal.fire("Sent!", "আপনার ইমেইলে রিসেট লিঙ্ক পাঠানো হয়েছে।", "success");
        } else {
          Swal.fire("Error", data.error || "এই ইমেইলটি আমাদের সিস্টেমে নেই!", "error");
        }
      } catch (err) {
        Swal.fire("Error", "সার্ভারের সাথে যোগাযোগ করা যাচ্ছে না", "error");
      }
    }
  };

  // --- Login Logic ---
  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ 
          email: email.trim().toLowerCase(), 
          password 
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        Swal.fire("Login failed", data.error || "Invalid credentials", "error");
        setLoading(false);
        return;
      }

      await Swal.fire({
        icon: "success",
        title: "Welcome back 👋",
        timer: 1200,
        showConfirmButton: false,
      });

      // সরাসরি রিফ্রেশ করে হোম পেজে পাঠানো (auth state আপডেট হবে)
      window.location.href = "/";

    } catch (error) {
      Swal.fire("Server error", "Please try again later", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm p-8 rounded-xl bg-white shadow-md border border-gray-100">
        
        <div className="flex justify-center mb-6">
          <Image src="/logo.png" alt="logo" width={120} height={40} priority />
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800">Sign in</h2>
        <p className="text-sm text-gray-500 text-center mb-8">
          Welcome back! Please enter your details.
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-xs text-indigo-600 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {show ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-70"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                Signing in...
              </span>
            ) : "Sign in"}
          </button>
        </form>

        <div className="text-sm text-center mt-6 text-gray-600">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-indigo-600 font-semibold hover:underline">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}