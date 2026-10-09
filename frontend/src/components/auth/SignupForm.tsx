"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import AuthInput from "./AuthInput";
import AuthButton from "./AuthButton";
import AuthDivider from "./AuthDivider";
import SocialAuthButton from "./SocialAuthButton";

import { useOnboarding } from "@/lib/onboarding-context";

export default function SignupForm() {
  const { state } = useOnboarding();
  const [age, setAge] = useState<string>("18");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    age?: string;
    name?: string;
    email?: string;
    username?: string;
    password?: string;
    general?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const { signup } = useAuth();
  const router = useRouter();

  const validate = () => {
    const newErrors: typeof errors = {};
    const ageNum = parseInt(age, 10);
    if (!age || isNaN(ageNum) || ageNum < 5) {
      newErrors.age = "Please enter a valid age.";
    }
    if (!name.trim()) {
      newErrors.name = "Please enter your name.";
    }
    if (!email.trim() || !email.includes("@") || !email.includes(".")) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!username.trim() || username.length < 3) {
      newErrors.username = "Username must be at least 3 characters.";
    }
    if (!password || password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
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
      await signup({
        name,
        email,
        username,
        password,
        age: parseInt(age, 10),
        placement_unit: state.placementUnit || 1,
        daily_goal_xp: state.dailyGoalXp || 20,
      } as any);
      router.push("/learn");
    } catch (err: any) {
      setErrors({
        general: err.message || "Failed to create account. Please check your details.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "18px" }}>
      {/* Title */}
      <div style={{ textAlign: "center", marginBottom: "4px" }}>
        <h1
          style={{
            fontSize: "28px",
            fontWeight: 800,
            color: "var(--duo-text-dark)",
            marginBottom: "6px",
          }}
        >
          Create your profile
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
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        <AuthInput
          id="signup-age"
          placeholder="Age"
          type="number"
          value={age}
          onChange={(e) => {
            setAge(e.target.value);
            if (errors.age) setErrors({ ...errors, age: undefined });
          }}
          error={errors.age}
        />

        <AuthInput
          id="signup-name"
          placeholder="Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) setErrors({ ...errors, name: undefined });
          }}
          error={errors.name}
          autoComplete="name"
        />

        <AuthInput
          id="signup-email"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors({ ...errors, email: undefined });
          }}
          error={errors.email}
          autoComplete="email"
        />

        <AuthInput
          id="signup-username"
          placeholder="Username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            if (errors.username) setErrors({ ...errors, username: undefined });
          }}
          error={errors.username}
          autoComplete="username"
        />

        <AuthInput
          id="signup-password"
          placeholder="Password (6+ characters)"
          type="password"
          showPasswordToggle
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) setErrors({ ...errors, password: undefined });
          }}
          error={errors.password}
          autoComplete="new-password"
        />

        <div style={{ marginTop: "6px" }}>
          <AuthButton type="submit" variant="green" isLoading={isLoading}>
            CREATE ACCOUNT
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

      {/* Terms & Switch to Login */}
      <div
        style={{
          textAlign: "center",
          marginTop: "12px",
          fontSize: "14px",
          color: "var(--duo-text-muted)",
          fontWeight: 700,
        }}
      >
        <span>Already have an account? </span>
        <Link
          href="/auth/login"
          style={{
            color: "var(--duo-blue)",
            textDecoration: "none",
            fontWeight: 800,
          }}
        >
          LOG IN
        </Link>
      </div>

      {/* Guest Bypass */}
      <div style={{ textAlign: "center", marginTop: "4px" }}>
        <button
          type="button"
          onClick={() => router.push("/learn")}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: 800,
            color: "var(--duo-text-muted)",
            letterSpacing: "0.5px",
            textTransform: "uppercase",
            padding: "8px 16px",
          }}
        >
          NOT NOW / CONTINUE AS GUEST
        </button>
      </div>
    </div>
  );
}
