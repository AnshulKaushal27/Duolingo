"use client";

import React from "react";
import { playClickSound } from "@/lib/sound";

interface FeedbackBarProps {
  status: "idle" | "submitting" | "correct" | "incorrect";
  canCheck: boolean;
  onCheck: () => void;
  onContinue: () => void;
  onSkip?: () => void;
  correctSolution?: string;
  explanation?: string;
  comboStreak?: number;
}

export default function FeedbackBar({
  status,
  canCheck,
  onCheck,
  onContinue,
  onSkip,
  correctSolution,
  explanation,
  comboStreak = 0,
}: FeedbackBarProps) {
  const isCorrect = status === "correct";
  const isIncorrect = status === "incorrect";
  const isEvaluated = isCorrect || isIncorrect;

  const getPraiseTitle = () => {
    if (comboStreak >= 3) {
      return `🔥 ${comboStreak} in a row! You're on fire!`;
    }
    return "Nicely done!";
  };

  return (
    <footer
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        padding: "24px 32px",
        borderTop: "2px solid var(--duo-border)",
        backgroundColor: isCorrect
          ? "var(--duo-green-bg)"
          : isIncorrect
          ? "var(--duo-red-bg)"
          : "var(--duo-canvas)",
        zIndex: 40,
        transition: "background-color 0.2s ease",
      }}
      className={isEvaluated ? "anim-slide-up" : ""}
    >
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
        }}
      >
        {/* Left Side: Status & Feedback message OR Skip Button */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {!isEvaluated && onSkip && (
            <button
              type="button"
              onClick={() => {
                if (status !== "submitting") {
                  playClickSound();
                  onSkip();
                }
              }}
              className="duo-btn duo-btn-secondary"
              style={{
                padding: "14px 28px",
                fontSize: "15px",
                letterSpacing: "0.8px",
              }}
            >
              SKIP
            </button>
          )}

          {isCorrect && (
            <>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  backgroundColor: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "28px",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                }}
              >
                ✓
              </div>
              <div>
                <h3 style={{ fontSize: "22px", fontWeight: 900, color: "var(--duo-green-dark)" }}>
                  {getPraiseTitle()}
                </h3>
                <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--duo-green-dark)", opacity: 0.85 }}>
                  {explanation || "You got it right!"}
                </p>
                <div style={{ display: "flex", gap: "16px", marginTop: "4px" }}>
                  <button
                    type="button"
                    onClick={() => alert("Thank you! Reported to the Duolingo language team.")}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "var(--duo-green-dark)",
                      fontWeight: 800,
                      fontSize: "13px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      opacity: 0.85,
                      padding: 0,
                    }}
                  >
                    🚩 Report
                  </button>
                  <button
                    type="button"
                    onClick={() => alert("Discussion thread is active in Super Duolingo!")}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "var(--duo-green-dark)",
                      fontWeight: 800,
                      fontSize: "13px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      opacity: 0.85,
                      padding: 0,
                    }}
                  >
                    💬 Discuss
                  </button>
                </div>
              </div>
            </>
          )}

          {isIncorrect && (
            <>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  backgroundColor: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "28px",
                  color: "var(--duo-red)",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                }}
              >
                ✕
              </div>
              <div>
                <h3 style={{ fontSize: "20px", fontWeight: 900, color: "var(--duo-red-dark)" }}>
                  Correct solution:
                </h3>
                <p style={{ fontSize: "16px", fontWeight: 800, color: "var(--duo-red-dark)" }}>
                  {correctSolution}
                </p>
                <div style={{ display: "flex", gap: "16px", marginTop: "4px" }}>
                  <button
                    type="button"
                    onClick={() => alert("Thank you! Reported to the Duolingo language team.")}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "var(--duo-red-dark)",
                      fontWeight: 800,
                      fontSize: "13px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      opacity: 0.85,
                      padding: 0,
                    }}
                  >
                    🚩 Report
                  </button>
                  <button
                    type="button"
                    onClick={() => alert("Discussion thread is active in Super Duolingo!")}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "var(--duo-red-dark)",
                      fontWeight: 800,
                      fontSize: "13px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      opacity: 0.85,
                      padding: 0,
                    }}
                  >
                    💬 Discuss
                  </button>
                </div>
              </div>
            </>
          )}

          {!isEvaluated && !onSkip && <div />}
        </div>

        {/* Right Side: Action Button */}
        <div>
          {!isEvaluated ? (
            <button
              onClick={() => {
                if (canCheck && status !== "submitting") {
                  playClickSound();
                  onCheck();
                }
              }}
              disabled={!canCheck || status === "submitting"}
              className={`duo-btn ${canCheck ? "duo-btn-green" : "duo-btn-disabled"}`}
              style={{ minWidth: "150px", padding: "16px 36px", fontSize: "16px" }}
            >
              {status === "submitting" ? "CHECKING..." : "CHECK"}
            </button>
          ) : (
            <button
              onClick={() => {
                playClickSound();
                onContinue();
              }}
              className={`duo-btn ${isCorrect ? "duo-btn-green" : "duo-btn-red"}`}
              style={{ minWidth: "160px", padding: "16px 36px", fontSize: "16px" }}
            >
              CONTINUE
            </button>
          )}
        </div>
      </div>
    </footer>
  );
}
