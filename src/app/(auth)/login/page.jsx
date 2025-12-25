"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Swal from "sweetalert2";

export default function LoginPage() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = e.target;

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: email.value,
          password: password.value,
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

      window.location.href = "/";

    } catch {
      Swal.fire("Server error", "Please try again later", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center ">

      <div className="w-full max-w-sm p-8 rounded-xl bg-white shadow-md">

        <Image src="/logo.png" alt="logo" width={100} height={30} className="mx-auto mb-4" />

        <h2 className="text-xl font-semibold text-center">Sign in</h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Sign in to continue
        </p>

        <form onSubmit={handleLogin} className="space-y-3">

          <input
            type="text"
            name="email"
            placeholder="email"
            className="w-full border rounded-lg px-3 py-2 text-sm"
            required
          />

          <div className="relative">
            <input
              type={show ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="w-full border rounded-lg px-3 py-2 pr-10 text-sm"
              required
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {show ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          <button
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="text-sm text-center mt-4">
          New here?{" "}
          <Link href="/register" className="text-indigo-600 font-medium">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
