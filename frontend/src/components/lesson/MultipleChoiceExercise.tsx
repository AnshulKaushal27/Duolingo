"use client";

import React, { useEffect } from "react";
import { ExerciseClient } from "@/lib/api";
import { playClickSound } from "@/lib/sound";
import { speakText } from "@/lib/speech";

interface MultipleChoiceExerciseProps {
  exercise: ExerciseClient;
  selectedAnswer: any;
  onSelectAnswer: (answer: any) => void;
  disabled?: boolean;
}

export default function MultipleChoiceExercise({
  exercise,
  selectedAnswer,
  onSelectAnswer,
  disabled,
}: MultipleChoiceExerciseProps) {
  const options = exercise.client_payload?.options || [];

  const handleChoose = (opt: any) => {
    if (disabled) return;
    playClickSound();
    if (opt.text) {
      speakText(opt.text, "es-ES", 0.9);
    }
    onSelectAnswer(opt.id);
  };

  // Listen to keyboard shortcuts 1, 2, 3
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled) return;
      const num = parseInt(e.key);
      if (num >= 1 && num <= options.length) {
        const target = options[num - 1];
        handleChoose(target);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [options, disabled, onSelectAnswer]);

  return (
    <div style={{ width: "100%", maxWidth: "600px", margin: "0 auto" }}>
      {/* Exercise Prompt */}
      <div style={{ marginBottom: "28px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: 800, color: "var(--duo-text)" }}>
          {exercise.prompt}
        </h2>
      </div>

      {/* Options Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: options.length <= 3 ? "repeat(auto-fit, minmax(160px, 1fr))" : "repeat(2, 1fr)",
          gap: "16px",
        }}
      >
        {options.map((opt: any, idx: number) => {
          const isSelected = selectedAnswer === opt.id || selectedAnswer === opt.text;
          return (
            <div
              key={opt.id}
              onClick={() => handleChoose(opt)}
              className={`duo-card ${isSelected ? "selected" : ""}`}
              style={{
                padding: "20px 16px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                minHeight: "140px",
                cursor: disabled ? "default" : "pointer",
                userSelect: "none",
                outline: "none",
              }}
            >
              {opt.image && (
                <span style={{ fontSize: "40px", lineHeight: 1 }}>{opt.image}</span>
              )}
              <span style={{ fontSize: "19px", fontWeight: 700, textAlign: "center", color: "var(--duo-text)" }}>
                {opt.text}
              </span>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 800,
                  color: "var(--duo-text-muted)",
                  backgroundColor: "var(--duo-surface)",
                  padding: "2px 8px",
                  borderRadius: "6px",
                  border: "1px solid var(--duo-border)",
                }}
              >
                {idx + 1}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
