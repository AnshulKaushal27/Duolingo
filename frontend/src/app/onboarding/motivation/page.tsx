"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import OnboardingHeader from "@/components/onboarding/OnboardingHeader";
import { useOnboarding } from "@/lib/onboarding-context";

interface MotivationOption {
  id: string;
  label: string;
  emoji: string;
}

const MOTIVATIONS: MotivationOption[] = [
  { id: "travel", label: "Prepare for travel", emoji: "✈️" },
  { id: "productive", label: "Spend time productively", emoji: "⏱️" },
  { id: "education", label: "Support my education", emoji: "🎓" },
  { id: "connect", label: "Connect with people", emoji: "💬" },
  { id: "career", label: "Boost my career", emoji: "💼" },
  { id: "brain", label: "Expand brain power", emoji: "🧠" },
  { id: "fun", label: "Just for fun / Other", emoji: "🎉" },
];

export default function MotivationPage() {
  const router = useRouter();
  const { state, setMotivation } = useOnboarding();
  const [selected, setSelected] = useState<string>(state.motivation || "");

  const handleSelect = (id: string) => {
    setSelected(id);
    setMotivation(id);
  };

  const handleContinue = () => {
    if (!selected) return;
    router.push("/onboarding/level");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "var(--duo-canvas)" }}>
      <OnboardingHeader progressPercent={36} onBack={() => router.push("/onboarding/source")} />

      <main
        style={{
          flex: 1,
          maxWidth: "580px",
          width: "100%",
          margin: "0 auto",
          padding: "20px 20px 100px 20px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Duo Mascot Prompt */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
          <img src="/mascot/duo-happy.svg" alt="Duo" style={{ width: "64px", height: "64px" }} />
          <div
            style={{
              padding: "12px 18px",
              border: "2px solid var(--duo-border)",
              borderRadius: "16px",
              backgroundColor: "var(--duo-canvas)",
              position: "relative",
            }}
          >
            <span style={{ fontSize: "16px", fontWeight: 800, color: "var(--duo-text-dark)" }}>
              Why are you learning {state.targetLanguageName || "Spanish"}?
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {MOTIVATIONS.map((item) => {
            const isSelected = selected === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`duo-card ${isSelected ? "selected" : ""}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "16px 20px",
                  gap: "16px",
                  borderRadius: "16px",
                  borderWidth: "2px",
                  borderBottomWidth: "4px",
                  textAlign: "left",
                  outline: "none",
                }}
              >
                <span style={{ fontSize: "26px" }}>{item.emoji}</span>
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
            disabled={!selected}
            className={`duo-btn ${selected ? "duo-btn-green" : "duo-btn-disabled"}`}
            style={{ minWidth: "160px", height: "48px" }}
          >
            CONTINUE
          </button>
        </div>
      </footer>
    </div>
  );
}
