"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import OnboardingHeader from "@/components/onboarding/OnboardingHeader";
import { useOnboarding } from "@/lib/onboarding-context";

interface LevelOption {
  level: number;
  label: string;
}

export default function ProficiencyLevelPage() {
  const router = useRouter();
  const { state, setProficiencyLevel, setPlacementUnit } = useOnboarding();
  const langName = state.targetLanguageName || "Spanish";

  const LEVELS: LevelOption[] = [
    { level: 1, label: `I'm new to ${langName}` },
    { level: 2, label: "I know some common words" },
    { level: 3, label: "I can have basic conversations" },
    { level: 4, label: "I can talk about various topics" },
    { level: 5, label: "I can discuss most topics in detail" },
  ];

  const [selected, setSelected] = useState<number>(state.proficiencyLevel || 1);

  const handleSelect = (level: number) => {
    setSelected(level);
    setProficiencyLevel(level);
  };

  const handleContinue = () => {
    if (selected === 1) {
      setPlacementUnit(1);
      router.push("/onboarding/goal");
    } else {
      router.push("/onboarding/start-choice");
    }
  };

  const renderBars = (level: number) => {
    return (
      <div style={{ display: "flex", alignItems: "flex-end", gap: "3px", height: "24px" }}>
        {[1, 2, 3, 4, 5].map((bar) => {
          const height = bar * 4 + 4; // 8px to 24px
          const isFilled = bar <= level;
          return (
            <div
              key={bar}
              style={{
                width: "4px",
                height: `${height}px`,
                borderRadius: "2px",
                backgroundColor: isFilled ? "var(--duo-blue)" : "var(--duo-border)",
              }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "var(--duo-canvas)" }}>
      <OnboardingHeader progressPercent={48} onBack={() => router.push("/onboarding/motivation")} />

      <main
        style={{
          flex: 1,
          maxWidth: "580px",
          width: "100%",
          margin: "0 auto",
          padding: "24px 20px 100px 20px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h1
          style={{
            fontSize: "28px",
            fontWeight: 800,
            color: "var(--duo-text-dark)",
            marginBottom: "24px",
          }}
        >
          How much {langName} do you know?
        </h1>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {LEVELS.map((item) => {
            const isSelected = selected === item.level;
            return (
              <button
                key={item.level}
                type="button"
                onClick={() => handleSelect(item.level)}
                className={`duo-card ${isSelected ? "selected" : ""}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "18px 20px",
                  gap: "18px",
                  borderRadius: "16px",
                  borderWidth: "2px",
                  borderBottomWidth: "4px",
                  textAlign: "left",
                  outline: "none",
                }}
              >
                {renderBars(item.level)}
                <span style={{ fontSize: "16px", fontWeight: 700, color: "var(--duo-text-dark)", flex: 1 }}>
                  {item.label}
                </span>
                {isSelected && <span style={{ color: "var(--duo-blue)", fontWeight: 900 }}>✓</span>}
              </button>
            );
          })}
        </div>
      </main>

      <footer
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: "80px",
          backgroundColor: "var(--duo-canvas)",
          borderTop: "2px solid var(--duo-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 24px",
          zIndex: 40,
        }}
      >
        <div style={{ maxWidth: "580px", width: "100%", display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={handleContinue}
            className="duo-btn duo-btn-green"
            style={{ minWidth: "160px", height: "48px" }}
          >
            CONTINUE
          </button>
        </div>
      </footer>
    </div>
  );
}
