"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import AuthInput from "./AuthInput";
import AuthButton from "./AuthButton";
import AuthDivider from "./AuthDivider";
import SocialAuthButton from "./SocialAuthButton";

export default function LoginForm() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ identifier?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const validate = () => {
    const newErrors: { identifier?: string; password?: string } = {};
    if (!identifier.trim()) {
      newErrors.identifier = "Please enter your email or username.";
    }
    if (!password) {
      newErrors.password = "Please enter your password.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validate()) return;

    try {
      setIsLoading(true);
      await login(identifier, password);
      router.push("/learn");
    } catch (err: any) {
      setErrors({
        general: err.message || "Incorrect username or password. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Title */}
      <div style={{ textAlign: "center", marginBottom: "8px" }}>
        <h1
          style={{
            fontSize: "28px",
            fontWeight: 800,
            color: "var(--duo-text-dark)",
            marginBottom: "6px",
          }}
        >
          Log in
        </h1>
      </div>

      {/* General Error Banner */}
      {errors.general && (
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
          <span>{errors.general}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <AuthInput
          id="login-identifier"
          placeholder="Email or username"
          value={identifier}
          onChange={(e) => {
            setIdentifier(e.target.value);
            if (errors.identifier) setErrors({ ...errors, identifier: undefined });
          }}
          error={errors.identifier}
          autoComplete="username"
        />

        <AuthInput
          id="login-password"
          placeholder="Password"
          type="password"
          showPasswordToggle
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) setErrors({ ...errors, password: undefined });
          }}
          error={errors.password}
          autoComplete="current-password"
          rightElement={
            <Link
              href="/auth/forgot-password"
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "var(--duo-blue)",
                textDecoration: "none",
              }}
            >
              FORGOT?
            </Link>
          }
        />

        <div style={{ marginTop: "4px" }}>
          <AuthButton type="submit" variant="green" isLoading={isLoading}>
            LOG IN
          </AuthButton>
        </div>
      </form>

      {/* Divider */}
      <AuthDivider text="OR" />

      {/* Social Logins */}
      <div style={{ display: "flex", gap: "12px", width: "100%" }}>
        <SocialAuthButton
          provider="google"
          onError={(msg) => setErrors({ general: msg })}
        />
        <SocialAuthButton
          provider="facebook"
          onError={(msg) => setErrors({ general: msg })}
        />
      </div>

      {/* Terms & Switch to Signup */}
      <div
        style={{
          textAlign: "center",
          marginTop: "16px",
          fontSize: "14px",
          color: "var(--duo-text-muted)",
          fontWeight: 700,
        }}
      >
        <span>Don&apos;t have an account? </span>
        <Link
          href="/auth/signup"
          style={{
            color: "var(--duo-blue)",
            textDecoration: "none",
            fontWeight: 800,
          }}
        >
          SIGN UP
        </Link>
      </div>
    </div>
  );
}
