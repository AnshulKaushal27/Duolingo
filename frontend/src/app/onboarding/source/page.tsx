"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import OnboardingHeader from "@/components/onboarding/OnboardingHeader";
import { useOnboarding } from "@/lib/onboarding-context";

interface SourceOption {
  id: string;
  label: string;
  icon: string;
}

const SOURCES: SourceOption[] = [
  { id: "tiktok", label: "TikTok", icon: "📱" },
  { id: "youtube", label: "YouTube", icon: "▶️" },
  { id: "social", label: "Facebook / Instagram", icon: "📸" },
  { id: "friends", label: "Friends or family", icon: "👥" },
  { id: "google", label: "Google Search", icon: "🔍" },
  { id: "news", label: "News / Article / Blog", icon: "📰" },
  { id: "tv", label: "TV", icon: "📺" },
  { id: "store", label: "App Store / Play Store", icon: "🏪" },
  { id: "other", label: "Other", icon: "💬" },
];

export default function ReferralSourcePage() {
  const router = useRouter();
  const { state, setReferralSource } = useOnboarding();
  const [selected, setSelected] = useState<string>(state.referralSource || "");

  const handleSelect = (id: string) => {
    setSelected(id);
    setReferralSource(id);
  };

  const handleContinue = () => {
    if (!selected) return;
    router.push("/onboarding/motivation");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "var(--duo-canvas)" }}>
      <OnboardingHeader progressPercent={24} onBack={() => router.push("/onboarding/language")} />

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
          How did you hear about Duolingo?
        </h1>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {SOURCES.map((source) => {
            const isSelected = selected === source.id;
            return (
              <button
                key={source.id}
                type="button"
                onClick={() => handleSelect(source.id)}
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
                <span style={{ fontSize: "24px" }}>{source.icon}</span>
                <span style={{ fontSize: "16px", fontWeight: 700, color: "var(--duo-text-dark)", flex: 1 }}>
                  {source.label}
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
