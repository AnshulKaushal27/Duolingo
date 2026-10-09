"use client";

import React from "react";
import { useRouter } from "next/navigation";
import OnboardingHeader from "@/components/onboarding/OnboardingHeader";
import { useOnboarding } from "@/lib/onboarding-context";

export default function MotivationInterstitialPage() {
  const router = useRouter();
  const { state } = useOnboarding();
  const langName = state.targetLanguageName || "Spanish";

  const handleContinue = () => {
    router.push("/onboarding/lesson");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "var(--duo-canvas)" }}>
      <OnboardingHeader progressPercent={75} onBack={() => router.back()} />

      <main
        style={{
          flex: 1,
          maxWidth: "520px",
          width: "100%",
          margin: "0 auto",
          padding: "32px 20px 100px 20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: "24px",
        }}
      >
        <img
          src="/mascot/duo-celebrate.svg"
          alt="Celebrate"
          style={{ width: "160px", height: "160px" }}
        />

        <h1
          style={{
            fontSize: "30px",
            fontWeight: 900,
            color: "var(--duo-text-dark)",
            lineHeight: 1.25,
          }}
        >
          You&apos;re on your way!
        </h1>

        <p
          style={{
            fontSize: "16px",
            fontWeight: 700,
            color: "var(--duo-text-muted)",
            lineHeight: 1.5,
          }}
        >
          Just <strong>{state.dailyGoalXp ? Math.round(state.dailyGoalXp / 2) : 10} minutes a day</strong> will help you build a lifelong habit in {langName}.
        </p>

        {/* Motivational Stat Cards */}
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginTop: "12px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              padding: "16px 20px",
              borderRadius: "16px",
              backgroundColor: "var(--duo-surface)",
              border: "2px solid var(--duo-border)",
              textAlign: "left",
            }}
          >
            <span style={{ fontSize: "28px" }}>🚀</span>
            <div>
              <h4 style={{ fontSize: "16px", fontWeight: 800, color: "var(--duo-text-dark)" }}>
                Learn 3x faster
              </h4>
              <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--duo-text-muted)" }}>
                Scientifically proven to keep learners engaged with bite-sized lessons.
              </p>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              padding: "16px 20px",
              borderRadius: "16px",
              backgroundColor: "var(--duo-surface)",
              border: "2px solid var(--duo-border)",
              textAlign: "left",
            }}
          >
            <span style={{ fontSize: "28px" }}>🔥</span>
            <div>
              <h4 style={{ fontSize: "16px", fontWeight: 800, color: "var(--duo-text-dark)" }}>
                Build your daily streak
              </h4>
              <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--duo-text-muted)" }}>
                Join millions forming consistent daily learning habits.
              </p>
            </div>
          </div>
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
        <div style={{ maxWidth: "520px", width: "100%", display: "flex", justifyContent: "center" }}>
          <button
            onClick={handleContinue}
            className="duo-btn duo-btn-green"
            style={{ width: "100%", height: "48px" }}
          >
            LET&apos;S TRY A LESSON!
          </button>
        </div>
      </footer>
    </div>
  );
}
