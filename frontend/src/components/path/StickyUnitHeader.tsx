"use client";

import React from "react";
import { UnitWithSkills } from "@/lib/api";
import { playClickSound } from "@/lib/sound";

interface StickyUnitHeaderProps {
  activeUnit: UnitWithSkills;
  courseCode?: string;
  onOpenGuidebook: (unitId: number, title: string, color: string) => void;
  onPreviousUnit?: () => void;
}

export default function StickyUnitHeader({
  activeUnit,
  courseCode = "es",
  onOpenGuidebook,
  onPreviousUnit,
}: StickyUnitHeaderProps) {
  // Compute Section and Unit number in that section (Units 1-3 = Section 1, Units 4-6 = Section 2)
  const section = activeUnit.unit_number <= 3 ? 1 : 2;
  const unitInSection = activeUnit.unit_number <= 3 
    ? activeUnit.unit_number 
    : activeUnit.unit_number - 3;

  // Clean title for headline (e.g. "Unit 1: Get started in Spanish" -> "Get started in Spanish")
  const cleanTitle = activeUnit.title.replace(/^Unit \d+:\s*/i, "");

  // Unit color
  const bgColor = activeUnit.color_hex || "var(--duo-green)";

  return (
    <div
      className="duo-sticky-unit-header"
      style={{
        position: "sticky",
        top: "16px",
        zIndex: 40,
        width: "100%",
        maxWidth: "600px",
        margin: "0 auto 28px auto",
        backgroundColor: bgColor,
        borderRadius: "20px",
        padding: "16px 24px",
        color: "#ffffff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.22), 0 2px 6px rgba(0, 0, 0, 0.12)",
        borderBottom: "4px solid rgba(0, 0, 0, 0.18)",
        transition: "background-color 0.35s ease, border-color 0.35s ease, box-shadow 0.3s ease",
      }}
    >
      {/* Left side: Back Arrow + Section Indicator + Headline */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "2px",
          minWidth: 0,
          flex: 1,
          marginRight: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {activeUnit.unit_number > 1 && (
            <button
              onClick={() => {
                playClickSound();
                onPreviousUnit?.();
              }}
              style={{
                background: "rgba(255, 255, 255, 0.18)",
                border: "none",
                color: "#ffffff",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 900,
                padding: "2px 8px",
                borderRadius: "8px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background-color 0.15s ease, transform 0.1s ease",
              }}
              title="Scroll to previous unit"
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.3)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.18)")}
            >
              ←
            </button>
          )}
          <span
            style={{
              textTransform: "uppercase",
              fontSize: "12px",
              fontWeight: 900,
              letterSpacing: "0.8px",
              opacity: 0.92,
              whiteSpace: "nowrap",
            }}
          >
            SECTION {section}, UNIT {unitInSection}
          </span>
        </div>

        <h2
          style={{
            fontSize: "20px",
            fontWeight: 800,
            margin: "4px 0 0 0",
            color: "#ffffff",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            letterSpacing: "-0.2px",
            textShadow: "0 1px 2px rgba(0,0,0,0.15)",
          }}
          title={cleanTitle}
        >
          {cleanTitle}
        </h2>
      </div>

      {/* Right side: GUIDEBOOK button */}
      <button
        onClick={() => {
          playClickSound();
          onOpenGuidebook(activeUnit.id, activeUnit.title, bgColor);
        }}
        className="duo-btn duo-btn-outline"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.22)",
          borderColor: "rgba(255, 255, 255, 0.38)",
          borderBottomColor: "rgba(0, 0, 0, 0.2)",
          color: "#ffffff",
          padding: "10px 18px",
          fontSize: "13px",
          fontWeight: 900,
          letterSpacing: "0.8px",
          borderRadius: "14px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          flexShrink: 0,
          cursor: "pointer",
          transition: "background-color 0.15s ease, transform 0.1s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.32)")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.22)")}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          <line x1="9" y1="7" x2="15" y2="7" />
          <line x1="9" y1="11" x2="15" y2="11" />
        </svg>
        <span>GUIDEBOOK</span>
      </button>
    </div>
  );
}
