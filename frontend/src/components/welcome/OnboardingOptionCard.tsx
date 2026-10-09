"use client";

import React from "react";
import { playClickSound } from "@/lib/sound";

interface OnboardingOptionCardProps {
  id: string;
  label: string;
  subtitle?: string;
  icon?: string | React.ReactNode;
  selected: boolean;
  shortcutKey?: number | string;
  onSelect: () => void;
  fullWidth?: boolean;
}

export default function OnboardingOptionCard({
  id,
  label,
  subtitle,
  icon,
  selected,
  shortcutKey,
  onSelect,
  fullWidth = true,
}: OnboardingOptionCardProps) {
  const handleClick = () => {
    playClickSound();
    onSelect();
  };

  return (
    <button
      id={`option-${id}`}
      data-test={`onboarding-option-${id}`}
      onClick={handleClick}
      style={{
        width: fullWidth ? "100%" : "auto",
        backgroundColor: selected ? "rgba(88, 204, 2, 0.12)" : "#202f36",
        border: selected ? "2px solid #58cc02" : "2px solid #37464f",
        borderBottom: selected ? "4px solid #46a302" : "4px solid #28373e",
        borderRadius: "16px",
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
        cursor: "pointer",
        textAlign: "left",
        outline: "none",
        transition: "all 0.15s ease",
        fontFamily: "inherit",
        color: "#ffffff",
      }}
      onMouseEnter={(e) => {
        if (!selected) {
          e.currentTarget.style.backgroundColor = "#283941";
          e.currentTarget.style.borderColor = "#455864";
        }
      }}
      onMouseLeave={(e) => {
        if (!selected) {
          e.currentTarget.style.backgroundColor = "#202f36";
          e.currentTarget.style.borderColor = "#37464f";
        }
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.borderBottomWidth = "4px";
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = "translateY(2px)";
        e.currentTarget.style.borderBottomWidth = "2px";
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.borderBottomWidth = "4px";
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "16px", flex: 1 }}>
        {icon && (
          <div
            style={{
              fontSize: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "36px",
              height: "36px",
              flexShrink: 0,
            }}
          >
            {icon}
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <span
            style={{
              fontSize: "17px",
              fontWeight: 700,
              color: selected ? "#58cc02" : "#ffffff",
              lineHeight: 1.3,
            }}
          >
            {label}
          </span>
          {subtitle && (
            <span
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#8599a6",
                lineHeight: 1.3,
              }}
            >
              {subtitle}
            </span>
          )}
        </div>
      </div>

      {shortcutKey !== undefined && (
        <span
          style={{
            fontSize: "12px",
            fontWeight: 800,
            color: selected ? "#58cc02" : "#566b76",
            border: selected ? "1.5px solid #58cc02" : "1.5px solid #37464f",
            borderRadius: "8px",
            padding: "2px 8px",
            lineHeight: "16px",
            letterSpacing: "0.5px",
          }}
        >
          {shortcutKey}
        </span>
      )}
    </button>
  );
}
