"use client";

import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const handleLogin = (e) => {
    e.preventDefault();

    const identifier = e.target.identifier.value;
    const password = e.target.password.value;

    console.log(identifier, password);
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <Image
          src="/logo.png"
          alt="Fanflix"
          width={100}
          height={30}
          className="auth-logo"
        />

        <h2 className="auth-title">Sign in</h2>
        <p className="auth-subtitle">
          Sign in or create an account
        </p>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            name="identifier"
            placeholder="Email or phone number"
            className="auth-input"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="auth-input"
            required
          />

          <button className="auth-btn">Sign in</button>
        </form>

        {/* 🔹 Forgot password */}
        <div className="auth-footer">
          <Link href="/forgot-password">Forgot password?</Link>
        </div>

        <div className="auth-footer">
          New here? <Link href="/register">Create account</Link>
        </div>
      </div>
    </div>
  );
}
