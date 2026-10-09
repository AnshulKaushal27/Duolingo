"use client";

import React from "react";
import { playClickSound } from "@/lib/sound";

interface OnboardingHeaderBarProps {
  progressPercent: number;
  onBack: () => void;
}

export default function OnboardingHeaderBar({
  progressPercent,
  onBack,
}: OnboardingHeaderBarProps) {
  const handleBack = () => {
    playClickSound();
    onBack();
  };

  return (
    <header
      style={{
        width: "100%",
        maxWidth: "1040px",
        margin: "0 auto",
        padding: "24px 24px 12px 24px",
        display: "flex",
        alignItems: "center",
        gap: "20px",
      }}
    >
      {/* Back Arrow Button */}
      <button
        id="onboarding-back-btn"
        data-test="onboarding-back-btn"
        onClick={handleBack}
        aria-label="Go back"
        style={{
          background: "none",
          border: "none",
          color: "#8599a6",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "40px",
          height: "40px",
          borderRadius: "12px",
          padding: 0,
          transition: "color 0.15s, background-color 0.15s",
          outline: "none",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#ffffff";
          e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.08)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "#8599a6";
          e.currentTarget.style.backgroundColor = "transparent";
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Progress Bar Track */}
      <div
        style={{
          flex: 1,
          height: "16px",
          backgroundColor: "#37464f",
          borderRadius: "9999px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Animated Progress Fill */}
        <div
          style={{
            height: "100%",
            width: `${Math.max(4, Math.min(100, progressPercent))}%`,
            backgroundColor: "#58cc02",
            borderRadius: "9999px",
            transition: "width 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            position: "relative",
          }}
        >
          {/* Subtle top shine */}
          <div
            style={{
              position: "absolute",
              top: "2px",
              left: "6px",
              right: "6px",
              height: "4px",
              backgroundColor: "rgba(255, 255, 255, 0.35)",
              borderRadius: "9999px",
            }}
          />
        </div>
      </div>
    </header>
  );
}
