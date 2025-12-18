"use client";

import Image from "next/image";
import Link from "next/link";

export default function RegisterPage() {
  const handleRegister = (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const phone = e.target.phone.value;
    const password = e.target.password.value;

    console.log(email, phone, password);
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

        <h2 className="auth-title">Create account</h2>
        <p className="auth-subtitle">
          Sign up to get started
        </p>

        <form onSubmit={handleRegister}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="auth-input"
            required
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone number"
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

          <button className="auth-btn">Create account</button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link href="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
