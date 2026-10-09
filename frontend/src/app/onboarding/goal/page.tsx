"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import OnboardingHeader from "@/components/onboarding/OnboardingHeader";
import { useOnboarding } from "@/lib/onboarding-context";

interface GoalOption {
  xp: number;
  minutes: number;
  title: string;
}

const GOALS: GoalOption[] = [
  { xp: 10, minutes: 5, title: "Casual" },
  { xp: 20, minutes: 10, title: "Regular" },
  { xp: 30, minutes: 15, title: "Serious" },
  { xp: 50, minutes: 20, title: "Intense" },
];

export default function DailyGoalPage() {
  const router = useRouter();
  const { state, setDailyGoalXp } = useOnboarding();
  const [selectedXp, setSelectedXp] = useState<number>(state.dailyGoalXp || 20);

  const handleSelect = (xp: number) => {
    setSelectedXp(xp);
    setDailyGoalXp(xp);
  };

  const handleContinue = () => {
    router.push("/onboarding/interstitial");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "var(--duo-canvas)" }}>
      <OnboardingHeader progressPercent={65} onBack={() => router.back()} />

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
            marginBottom: "8px",
          }}
        >
          What&apos;s your daily learning goal?
        </h1>
        <p style={{ color: "var(--duo-text-muted)", fontSize: "15px", fontWeight: 700, marginBottom: "28px" }}>
          You can always change this in your profile settings later.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {GOALS.map((g) => {
            const isSelected = selectedXp === g.xp;
            return (
              <button
                key={g.xp}
                type="button"
                onClick={() => handleSelect(g.xp)}
                className={`duo-card ${isSelected ? "selected" : ""}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "18px 22px",
                  borderRadius: "16px",
                  borderWidth: "2px",
                  borderBottomWidth: "4px",
                  outline: "none",
                }}
              >
                <div>
                  <span style={{ fontSize: "17px", fontWeight: 800, color: "var(--duo-text-dark)" }}>
                    {g.title}
                  </span>
                  <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--duo-text-muted)", marginTop: "2px" }}>
                    {g.minutes} min / day
                  </p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "14px", fontWeight: 800, color: "var(--duo-yellow-dark)" }}>
                    ⚡ {g.xp} XP
                  </span>
                  {isSelected && <span style={{ color: "var(--duo-blue)", fontWeight: 900 }}>✓</span>}
                </div>
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
