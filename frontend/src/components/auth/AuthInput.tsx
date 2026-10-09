"use client";

import React, { useState, InputHTMLAttributes, ReactNode } from "react";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  rightElement?: ReactNode;
  showPasswordToggle?: boolean;
}

export default function AuthInput({
  label,
  error,
  rightElement,
  showPasswordToggle,
  type = "text",
  id,
  ...props
}: AuthInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const effectiveType = showPasswordToggle ? (showPassword ? "text" : "password") : type;

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "6px" }}>
      {label && (
        <label
          htmlFor={id}
          style={{
            fontSize: "14px",
            fontWeight: 700,
            color: error ? "var(--duo-red)" : "var(--duo-text-dark)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>{label}</span>
          {rightElement}
        </label>
      )}

      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          width: "100%",
        }}
      >
        <input
          id={id}
          type={effectiveType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          aria-invalid={!!error}
          style={{
            width: "100%",
            height: "48px",
            padding: showPasswordToggle || rightElement ? "0 46px 0 16px" : "0 16px",
            backgroundColor: "var(--duo-surface)",
            border: `2px solid ${
              error
                ? "var(--duo-red)"
                : isFocused
                ? "var(--duo-blue)"
                : "var(--duo-border)"
            }`,
            borderRadius: "14px",
            fontSize: "15px",
            fontWeight: 600,
            color: "var(--duo-text-dark)",
            outline: "none",
            transition: "border-color 0.15s ease, background-color 0.15s ease",
          }}
          {...props}
        />

        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            style={{
              position: "absolute",
              right: "12px",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "16px",
              color: "var(--duo-text-muted)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "4px",
            }}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        )}
      </div>

      {error && (
        <div
          role="alert"
          style={{
            fontSize: "13px",
            fontWeight: 700,
            color: "var(--duo-red)",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            marginTop: "2px",
          }}
        >
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
