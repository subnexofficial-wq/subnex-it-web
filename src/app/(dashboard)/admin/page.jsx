"use client";
import { useState } from "react";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setMsg("Username এবং password দিন");
      return;
    }

    setMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 423) {
          setMsg("Account সাময়িকভাবে locked। পরে চেষ্টা করুন।");
        } else {
          setMsg(data.error || "Invalid credentials");
        }
        return;
      }

      // ✅ Cookie saved → redirect
      window.location.replace("/admin/dashboard");

    } catch {
      setMsg("Server বা network সমস্যা");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-4"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1497250681960-ef046c08a56e?q=80&w=1974&auto=format&fit=crop')",
      }}
    >
      <div className="w-full max-w-md bg-black/30 backdrop-blur-md rounded-2xl shadow-lg p-8 space-y-6">

        <h1 className="text-4xl font-bold text-white text-center">
          Admin Login
        </h1>

        {msg && (
          <p className="text-center text-red-400 font-medium">
            {msg}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Username"
            value={username}
            autoComplete="username"
            disabled={loading}
            className="w-full bg-white/20 text-white px-4 py-3 rounded-md border border-white/30 outline-none"
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            autoComplete="current-password"
            disabled={loading}
            className="w-full bg-white/20 text-white px-4 py-3 rounded-md border border-white/30 outline-none"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500/80 hover:bg-green-600 disabled:opacity-60 text-white font-bold py-3 rounded-md flex justify-center items-center"
          >
            {loading ? "Checking..." : <FiArrowRight size={22} />}
          </button>
        </form>

        <div className="text-center">
          <Link href="/admin/register" className="text-white underline">
            Create Admin
          </Link>
        </div>
      </div>
    </div>
  );
}
