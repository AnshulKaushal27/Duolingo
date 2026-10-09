"use client";

import React from "react";
import { ExerciseClient } from "@/lib/api";
import { playClickSound } from "@/lib/sound";
import { speakText } from "@/lib/speech";

interface FillInTheBlankExerciseProps {
  exercise: ExerciseClient;
  selectedOption: string | null;
  onSelectOption: (option: string) => void;
  disabled?: boolean;
}

export default function FillInTheBlankExercise({
  exercise,
  selectedOption,
  onSelectOption,
  disabled,
}: FillInTheBlankExerciseProps) {
  const parts: string[] = exercise.client_payload?.sentence_parts || [];
  const options: string[] = exercise.client_payload?.options || [];

  return (
    <div style={{ width: "100%", maxWidth: "600px", margin: "0 auto" }}>
      {/* Exercise Prompt */}
      <h2 style={{ fontSize: "24px", fontWeight: 800, color: "var(--duo-text)", marginBottom: "32px" }}>
        {exercise.prompt}
      </h2>

      {/* Sentence with Blank Container */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        flexWrap: "wrap",
        fontSize: "22px",
        fontWeight: 700,
        color: "var(--duo-text)",
        minHeight: "80px",
        padding: "24px",
        borderRadius: "20px",
        backgroundColor: "var(--duo-surface)",
        marginBottom: "36px",
      }}>
        <span>{parts[0]}</span>

        {/* The Blank Slot */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: "100px",
            height: "44px",
            padding: "0 16px",
            borderRadius: "12px",
            border: selectedOption ? "2px solid var(--duo-blue)" : "2px dashed var(--duo-border)",
            backgroundColor: selectedOption ? "var(--duo-blue-bg)" : "var(--duo-canvas)",
            color: selectedOption ? "var(--duo-blue-dark)" : "var(--duo-text-dim)",
            fontWeight: 800,
            fontSize: "20px",
          }}
        >
          {selectedOption || "____"}
        </div>

        {parts.length > 1 && <span>{parts[1]}</span>}
      </div>

      {/* Options Pill Buttons */}
      <div style={{ display: "flex", justifyContent: "center", gap: "14px", flexWrap: "wrap" }}>
        {options.map((opt) => {
          const isSelected = selectedOption === opt;
          return (
            <button
              key={opt}
              onClick={() => {
                if (disabled) return;
                playClickSound();
                speakText(opt);
                onSelectOption(opt);
              }}
              disabled={disabled}
              className={`duo-btn ${isSelected ? "duo-btn-blue" : "duo-btn-outline"}`}
              style={{
                fontSize: "18px",
                padding: "14px 28px",
                textTransform: "none",
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
