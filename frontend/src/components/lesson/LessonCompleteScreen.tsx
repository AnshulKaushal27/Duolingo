"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { LessonCompleteResult } from "@/lib/api";
import { playVictorySound, playClickSound } from "@/lib/sound";

interface LessonCompleteScreenProps {
  result: LessonCompleteResult;
}

export default function LessonCompleteScreen({ result }: LessonCompleteScreenProps) {
  useEffect(() => {
    // Play fanfare
    playVictorySound();

    // Trigger double confetti blast
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
      }, 300);
    } catch {}
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 24px",
        backgroundColor: "var(--duo-canvas)",
        textAlign: "center",
      }}
    >
      {/* Duo Celebratory Mascot */}
      <img
        src="/mascot/duo-celebrate.svg"
        alt="Duo Celebrating"
        style={{
          width: "160px",
          height: "160px",
          marginBottom: "24px",
          animation: "duoBounce 1.5s infinite ease-in-out",
        }}
      />

      {/* Main Victory Title */}
      <h1
        style={{
          fontSize: "36px",
          fontWeight: 900,
          color: "var(--duo-yellow-dark)",
          marginBottom: "8px",
        }}
      >
        Lesson Complete!
      </h1>
      <p style={{ fontSize: "18px", color: "var(--duo-text-muted)", marginBottom: "36px" }}>
        You crushed it today! Keep the momentum going.
      </p>

      {/* Stats Summary Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "16px",
          width: "100%",
          maxWidth: "520px",
          marginBottom: "48px",
        }}
      >
        {/* Total XP Card */}
        <div
          style={{
            backgroundColor: "var(--duo-yellow-bg)",
            border: "2px solid var(--duo-yellow)",
            borderBottom: "4px solid var(--duo-yellow-dark)",
            borderRadius: "20px",
            padding: "20px 16px",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          <span style={{ fontSize: "13px", fontWeight: 800, textTransform: "uppercase", color: "var(--duo-yellow-dark)" }}>
            TOTAL XP
          </span>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
            <span style={{ fontSize: "24px" }}>⚡</span>
            <span style={{ fontSize: "26px", fontWeight: 900, color: "var(--duo-yellow-dark)" }}>
              +{result.xp_earned}
            </span>
          </div>
        </div>

        {/* Accuracy Card */}
        <div
          style={{
            backgroundColor: "var(--duo-green-bg)",
            border: "2px solid var(--duo-green)",
            borderBottom: "4px solid var(--duo-green-dark)",
            borderRadius: "20px",
            padding: "20px 16px",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          <span style={{ fontSize: "13px", fontWeight: 800, textTransform: "uppercase", color: "var(--duo-green-dark)" }}>
            ACCURACY
          </span>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
            <span style={{ fontSize: "24px" }}>🎯</span>
            <span style={{ fontSize: "26px", fontWeight: 900, color: "var(--duo-green-dark)" }}>
              {result.accuracy_percentage}%
            </span>
          </div>
        </div>

        {/* Streak Extended Card */}
        <div
          style={{
            backgroundColor: "var(--duo-blue-bg)",
            border: "2px solid var(--duo-blue)",
            borderBottom: "4px solid var(--duo-blue-dark)",
            borderRadius: "20px",
            padding: "20px 16px",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          <span style={{ fontSize: "13px", fontWeight: 800, textTransform: "uppercase", color: "var(--duo-orange-dark)" }}>
            STREAK
          </span>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
            <img src="/icons/streak-flame.svg" alt="Flame" style={{ width: "26px", height: "26px" }} />
            <span style={{ fontSize: "26px", fontWeight: 900, color: "var(--duo-orange)" }}>
              {result.streak}
            </span>
          </div>
        </div>
      </div>

      {/* Return to Path Button */}
      <Link
        href="/learn"
        onClick={() => playClickSound()}
        className="duo-btn duo-btn-green"
        style={{
          width: "100%",
          maxWidth: "360px",
          padding: "16px 36px",
          fontSize: "17px",
        }}
      >
        CONTINUE TO LEARNING PATH
      </Link>
    </div>
  );
}
