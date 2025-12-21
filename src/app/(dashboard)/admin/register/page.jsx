
"use client";
import { useState } from "react";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

export default function AdminRegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [setupKey, setSetupKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password || !setupKey) {
      setMsg("সব field পূরণ করুন");
      return;
    }

    setMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password, setupKey }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data.error || "Registration failed");
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
          Admin Register
        </h1>

        {msg && (
          <p className="text-center text-yellow-300 font-medium">
            {msg}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            disabled={loading}
            className="w-full bg-white/20 text-white px-4 py-3 rounded-md border border-white/30 outline-none"
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            disabled={loading}
            className="w-full bg-white/20 text-white px-4 py-3 rounded-md border border-white/30 outline-none"
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Master Setup Key"
            value={setupKey}
            disabled={loading}
            className="w-full bg-white/20 text-white px-4 py-3 rounded-md border border-white/30 outline-none"
            onChange={(e) => setSetupKey(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500/80 hover:bg-green-600 disabled:opacity-60 text-white font-bold py-3 rounded-md flex justify-center items-center"
          >
            {loading ? "Creating..." : <FiArrowRight size={22} />}
          </button>
        </form>

        <div className="text-center">
          <Link href="/admin" className="text-white underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
