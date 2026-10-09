"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface OnboardingHeaderProps {
  progressPercent: number; // 0 to 100
  onBack?: () => void;
  showBack?: boolean;
}

export default function OnboardingHeader({
  progressPercent,
  onBack,
  showBack = true,
}: OnboardingHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <header
      style={{
        width: "100%",
        maxWidth: "680px",
        margin: "0 auto",
        height: "64px",
        display: "flex",
        alignItems: "center",
        gap: "20px",
        padding: "0 20px",
      }}
    >
      {showBack && (
        <button
          onClick={handleBack}
          type="button"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "8px",
            color: "var(--duo-text-muted)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "12px",
            transition: "background-color 0.1s ease",
          }}
          aria-label="Back"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
      )}

      {/* Thin Rounded Green Progress Bar */}
      <div
        style={{
          flex: 1,
          height: "14px",
          backgroundColor: "var(--duo-border)",
          borderRadius: "8px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${Math.min(100, Math.max(5, progressPercent))}%`,
            backgroundColor: "var(--duo-green)",
            borderRadius: "8px",
            transition: "width 0.3s ease",
            position: "relative",
          }}
        >
          {/* Highlight shine */}
          <div
            style={{
              position: "absolute",
              top: "2px",
              left: "6px",
              right: "6px",
              height: "4px",
              backgroundColor: "rgba(255, 255, 255, 0.35)",
              borderRadius: "4px",
            }}
          />
        </div>
      </div>
    </header>
  );
}
