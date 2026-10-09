"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import OnboardingHeader from "@/components/onboarding/OnboardingHeader";
import { useOnboarding } from "@/lib/onboarding-context";

export default function StartChoicePage() {
  const router = useRouter();
  const { setStartChoice, setPlacementUnit } = useOnboarding();
  const [choice, setChoice] = useState<"scratch" | "placement">("placement");

  const handleContinue = () => {
    setStartChoice(choice);
    if (choice === "scratch") {
      setPlacementUnit(1);
      router.push("/onboarding/goal");
    } else {
      router.push("/onboarding/placement");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "var(--duo-canvas)" }}>
      <OnboardingHeader progressPercent={55} onBack={() => router.push("/onboarding/level")} />

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
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "28px" }}>
          <img src="/mascot/duo-happy.svg" alt="Duo" style={{ width: "64px", height: "64px" }} />
          <div
            style={{
              padding: "12px 18px",
              border: "2px solid var(--duo-border)",
              borderRadius: "16px",
              backgroundColor: "var(--duo-canvas)",
            }}
          >
            <span style={{ fontSize: "16px", fontWeight: 800, color: "var(--duo-text-dark)" }}>
              Let&apos;s find the best place to start!
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Option 1: Scratch */}
          <button
            type="button"
            onClick={() => setChoice("scratch")}
            className={`duo-card ${choice === "scratch" ? "selected" : ""}`}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "22px 20px",
              gap: "20px",
              borderRadius: "18px",
              borderWidth: "2px",
              borderBottomWidth: "4px",
              textAlign: "left",
              outline: "none",
            }}
          >
            <span style={{ fontSize: "36px" }}>🌱</span>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: "17px", fontWeight: 800, color: "var(--duo-text-dark)", marginBottom: "4px" }}>
                START FROM SCRATCH
              </h3>
              <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--duo-text-muted)" }}>
                Start at Unit 1 with greetings and introductions
              </p>
            </div>
            {choice === "scratch" && <span style={{ color: "var(--duo-blue)", fontWeight: 900 }}>✓</span>}
          </button>

          {/* Option 2: Placement */}
          <button
            type="button"
            onClick={() => setChoice("placement")}
            className={`duo-card ${choice === "placement" ? "selected" : ""}`}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "22px 20px",
              gap: "20px",
              borderRadius: "18px",
              borderWidth: "2px",
              borderBottomWidth: "4px",
              textAlign: "left",
              outline: "none",
            }}
          >
            <span style={{ fontSize: "36px" }}>🧭</span>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: "17px", fontWeight: 800, color: "var(--duo-text-dark)", marginBottom: "4px" }}>
                FIND MY LEVEL
              </h3>
              <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--duo-text-muted)" }}>
                Take a quick 5-minute test to jump ahead into your level
              </p>
            </div>
            {choice === "placement" && <span style={{ color: "var(--duo-blue)", fontWeight: 900 }}>✓</span>}
          </button>
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
