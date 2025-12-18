"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function LoginPage() {
  const [show, setShow] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    const { identifier, password } = e.target;
    console.log(identifier.value, password.value);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative">
      {/* Login Box */}
      <div className="w-full max-w-sm p-8 rounded-xl shadow-md">
        <Image
          src="/logo.png"
          alt="logo"
          width={100}
          height={30}
          className="mx-auto mb-4"
        />

        <h2 className="text-xl font-semibold text-center">Sign in</h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Sign in or create an account
        </p>

        <form onSubmit={handleLogin} className="space-y-3">
          <input
            type="text"
            name="identifier"
            placeholder="Email or phone number"
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />

          <div className="relative">
            <input
              type={show ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="w-full border rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

          <button className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm hover:bg-indigo-700">
            Sign in
          </button>
        </form>

        <div className="text-sm text-center mt-4 space-y-2">
          <Link href="/forgot-password" className="text-indigo-600 block">
            Forgot password?
          </Link>
          <p>
            New here?{" "}
            <Link href="/register" className="text-indigo-600 font-medium">
              Create account
            </Link>
          </p>
        </div>
      </div>

      {/* ✅ Responsive Terms & Privacy (Fixed & Correct) */}
      <div
        className="
          fixed bottom-3 inset-x-0
          md:inset-x-auto md:right-4
          text-center md:text-right
          text-[11px] text-gray-500
          px-4
        "
      >
        By continuing, you agree to our{" "}
        <Link
          href="/terms-of-service"
          className="text-indigo-600 hover:underline font-medium"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy-policy"
          className="text-indigo-600 hover:underline font-medium"
        >
          Privacy Policy
        </Link>
        .
      </div>
    </div>
  );
}
