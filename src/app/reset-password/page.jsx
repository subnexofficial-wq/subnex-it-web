"use client";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      return Swal.fire("Error", "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে", "error");
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await res.json();

      if (res.ok) {
        await Swal.fire("Success!", "পাসওয়ার্ড পরিবর্তন হয়েছে। এখন লগইন করুন।", "success");
        router.push("/login");
      } else {
        Swal.fire("Error", data.error || "লিঙ্কটি কাজ করছে না", "error");
      }
    } catch (err) {
      Swal.fire("Error", "সার্ভার সমস্যা, আবার চেষ্টা করুন", "error");
    } finally {
      setLoading(false);
    }
    console.log("Token from URL:", token); // এটি চেক করুন
  console.log("Password from input:", password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Create New Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="নতুন পাসওয়ার্ড দিন"
            className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition"
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return <Suspense><ResetPasswordContent /></Suspense>;
}