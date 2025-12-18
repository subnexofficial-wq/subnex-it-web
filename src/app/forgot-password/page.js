"use client";

import Image from "next/image";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const handleForgotPassword = (e) => {
    e.preventDefault();

    const identifier = e.target.identifier.value;
    console.log(identifier);
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

        <h2 className="auth-title">Forgot password</h2>
        <p className="auth-subtitle">
          Enter your email or phone number
        </p>

        <form onSubmit={handleForgotPassword}>
          <input
            type="text"
            name="identifier"
            placeholder="Email or phone number"
            className="auth-input"
            required
          />

          <button className="auth-btn">Continue</button>
        </form>

        <div className="auth-footer">
          Back to <Link href="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
