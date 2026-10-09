"use client";

import React, { useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import AuthInput from "./AuthInput";
import AuthButton from "./AuthButton";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setIsLoading(true);
      await api.forgotPassword(email);
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: "18px",
        }}
      >
        <img
          src="/mascot/duo-happy.svg"
          alt="Success"
          style={{ width: "80px", height: "80px" }}
        />
        <h1
          style={{
            fontSize: "26px",
            fontWeight: 800,
            color: "var(--duo-text-dark)",
          }}
        >
          Check your email
        </h1>
        <p
          style={{
            fontSize: "15px",
            color: "var(--duo-text-muted)",
            fontWeight: 600,
            lineHeight: 1.5,
          }}
        >
          If an account exists for <strong style={{ color: "var(--duo-text-dark)" }}>{email}</strong>, we have sent instructions to reset your password.
        </p>

        <Link
          href="/auth/login"
          className="duo-btn duo-btn-green"
          style={{
            width: "100%",
            height: "48px",
            textDecoration: "none",
            marginTop: "10px",
          }}
        >
          BACK TO LOG IN
        </Link>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ textAlign: "center" }}>
        <h1
          style={{
            fontSize: "28px",
            fontWeight: 800,
            color: "var(--duo-text-dark)",
            marginBottom: "8px",
          }}
        >
          Forgot password
        </h1>
        <p
          style={{
            fontSize: "15px",
            color: "var(--duo-text-muted)",
            fontWeight: 600,
            lineHeight: 1.4,
          }}
        >
          Enter the email associated with your account and we&apos;ll send you a reset link.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          style={{
            backgroundColor: "var(--duo-red-bg)",
            border: "2px solid var(--duo-red)",
            borderRadius: "14px",
            padding: "12px 16px",
            fontSize: "14px",
            fontWeight: 700,
            color: "var(--duo-red-dark)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <AuthInput
          id="forgot-email"
          placeholder="Email address"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError(null);
          }}
          autoComplete="email"
        />

        <AuthButton type="submit" variant="blue" isLoading={isLoading}>
          SEND RESET LINK
        </AuthButton>
      </form>

      <div style={{ textAlign: "center", marginTop: "8px" }}>
        <Link
          href="/auth/login"
          style={{
            fontSize: "14px",
            fontWeight: 800,
            color: "var(--duo-blue)",
            textDecoration: "none",
          }}
        >
          BACK TO LOG IN
        </Link>
      </div>
    </div>
  );
}
