"use client";

import React, { ButtonHTMLAttributes, ReactNode } from "react";

interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "green" | "blue" | "outline";
  isLoading?: boolean;
}

export default function AuthButton({
  children,
  variant = "green",
  isLoading = false,
  disabled,
  style,
  ...props
}: AuthButtonProps) {
  const variantClass =
    variant === "green"
      ? "duo-btn-green"
      : variant === "blue"
      ? "duo-btn-blue"
      : "duo-btn-outline";

  return (
    <button
      className={`duo-btn ${variantClass}`}
      disabled={disabled || isLoading}
      style={{
        width: "100%",
        height: "48px",
        fontSize: "15px",
        fontWeight: 800,
        letterSpacing: "0.8px",
        ...style,
      }}
      {...props}
    >
      {isLoading ? (
        <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
          <svg
            style={{
              animation: "spin 0.8s linear infinite",
              width: "20px",
              height: "20px",
            }}
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              strokeOpacity="0.3"
            />
            <path
              d="M12 2a10 10 0 0 1 10 10"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
          <span>PLEASE WAIT...</span>
        </span>
      ) : (
        children
      )}
      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </button>
  );
}
