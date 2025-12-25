"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Swal from "sweetalert2";

export default function RegisterPage() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    const { email, phone, password, name } = e.target;

    if (!/^\d+$/.test(phone.value)) {
      Swal.fire("Invalid phone", "Phone must be number only", "error");
      return;
    }

    if (password.value.length < 6) {
      Swal.fire(
        "Weak password",
        "Password minimum 6 characters",
        "warning"
      );
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          mobile: phone.value,
          password: password.value,
          email: email.value,
          name: name.value,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        Swal.fire("Error", data.error || "Registration failed", "error");
        setLoading(false);
        return;
      }

      await Swal.fire({
        icon: "success",
        title: "Account created",
        text: "Welcome to Subnex it",
        timer: 1500,
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
      <div className="bg-white w-full max-w-sm p-8 rounded-xl shadow-md">

        <Image src="/logo.png" alt="Subnex" width={100} height={30} className="mx-auto mb-4" />

        <h2 className="text-xl font-semibold text-center">Create account</h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Sign up to get started
        </p>

        <form onSubmit={handleRegister} className="space-y-3">

          <input
            type="name"
            name="name"
            placeholder="Full Name"
            required
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone number"
            maxLength={11}
            onInput={(e) => (e.target.value = e.target.value.replace(/\D/g, ""))}
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
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-600">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
