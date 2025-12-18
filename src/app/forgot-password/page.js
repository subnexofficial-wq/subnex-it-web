"use client";

import Image from "next/image";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const handleForgotPassword = (e) => {
    e.preventDefault();
    const identifier = e.target.identifier.value.trim();

    if (!identifier) {
      alert("Please enter email or phone number");
      return;
    }

    console.log(identifier);
    // 👉 API call later
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-sm p-8 rounded-xl shadow-md">
        {/* Logo */}
        <Image
          src="/logo.png"
          alt="Subnex"
          width={100}
          height={30}
          className="mx-auto mb-4"
        />

        {/* Title */}
        <h2 className="text-xl font-semibold text-center">
          Forgot password
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Enter your email or phone number
        </p>

        {/* Form */}
        <form onSubmit={handleForgotPassword} className="space-y-3">
          <input
            type="text"
            name="identifier"
            placeholder="Email or phone number"
            className="w-full border rounded-lg px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2
                       rounded-lg text-sm hover:bg-indigo-700"
          >
            Continue
          </button>
        </form>

        {/* Footer */}
        <p className="text-sm text-center mt-4">
          Back to{" "}
          <Link href="/login" className="text-indigo-600 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
