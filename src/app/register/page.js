"use client";

import FAQSection from "@/Components/Faq";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function RegisterPage() {
  const [show, setShow] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();
    const { email, phone, password } = e.target;

    if (!/^\d+$/.test(phone.value)) {
      alert("Phone must be number only");
      return;
    }

    if (password.value.length < 6) {
      alert("Password minimum 6 characters");
      return;
    }

    console.log(email.value, phone.value, password.value);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-sm p-8 rounded-xl shadow-md">
        <Image
          src="/logo.png"
          alt="Subnex"
          width={100}
          height={30}
          className="mx-auto mb-4"
        />

        <h2 className="text-xl font-semibold text-center">
          Create account
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Sign up to get started
        </p>

        <form onSubmit={handleRegister} className="space-y-3">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full border rounded-lg px-3 py-2 text-sm"
            required
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone number"
            onInput={(e) =>
              (e.target.value = e.target.value.replace(/\D/g, ""))
            }
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

          <button className="w-full bg-indigo-600 text-white py-2 rounded-lg">
            Create account
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-600">
            Sign in
          </Link>
        </p>
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
