"use client";

import React, { useRef } from "react";
import { ExerciseClient } from "@/lib/api";
import { playClickSound } from "@/lib/sound";
import { speakText } from "@/lib/speech";

interface TypeTheAnswerExerciseProps {
  exercise: ExerciseClient;
  answerText: string;
  onTextChange: (text: string) => void;
  disabled?: boolean;
}

const ACCENT_CHARS = ["á", "é", "í", "ó", "ú", "ñ", "¿", "¡"];

export default function TypeTheAnswerExercise({
  exercise,
  answerText,
  onTextChange,
  disabled,
}: TypeTheAnswerExerciseProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleInsertChar = (char: string) => {
    if (disabled) return;
    playClickSound();
    const updated = answerText + char;
    onTextChange(updated);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div style={{ width: "100%", maxWidth: "600px", margin: "0 auto" }}>
      {/* Exercise Prompt */}
      <h2 style={{ fontSize: "24px", fontWeight: 800, color: "var(--duo-text)", marginBottom: "24px" }}>
        {exercise.prompt}
      </h2>

      {/* Question Speech Bubble with Duo */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "28px" }}>
        <img
          src="/mascot/duo-happy.svg"
          alt="Duo"
          style={{ width: "72px", height: "72px", flexShrink: 0 }}
        />
        <div style={{
          backgroundColor: "var(--duo-canvas)",
          border: "2px solid var(--duo-border)",
          padding: "16px 20px",
          borderRadius: "18px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}>
          {exercise.audio_text && (
            <div style={{ display: "flex", gap: "6px" }}>
              <button
                onClick={() => speakText(exercise.audio_text || "", "es-ES", 0.9)}
                className="duo-btn duo-btn-blue"
                title="Normal pronunciation"
                style={{ width: "36px", height: "36px", borderRadius: "10px", padding: 0 }}
              >
                🔊
              </button>
              <button
                onClick={() => speakText(exercise.audio_text || "", "es-ES", 0.65)}
                className="duo-btn duo-btn-outline"
                title="Slow pronunciation"
                style={{ width: "36px", height: "36px", borderRadius: "10px", padding: 0, fontSize: "16px" }}
              >
                🐢
              </button>
            </div>
          )}
          <span style={{ fontSize: "19px", fontWeight: 700, color: "var(--duo-text)" }}>
            {exercise.question_text}
          </span>
        </div>
      </div>

      {/* Typing Textarea */}
      <div style={{ position: "relative", marginBottom: "16px" }}>
        <textarea
          ref={inputRef}
          value={answerText}
          onChange={(e) => onTextChange(e.target.value)}
          disabled={disabled}
          placeholder="Type in Spanish..."
          rows={3}
          style={{
            width: "100%",
            padding: "16px 20px",
            fontSize: "19px",
            fontWeight: 700,
            borderRadius: "16px",
            border: "2px solid var(--duo-border)",
            backgroundColor: "var(--duo-surface)",
            color: "var(--duo-text)",
            outline: "none",
            resize: "none",
            fontFamily: "var(--duo-font)",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--duo-blue)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "var(--duo-border)";
          }}
        />
      </div>

      {/* Accented Character Helper Keyboard Pills */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
        {ACCENT_CHARS.map((char) => (
          <button
            key={char}
            onClick={() => handleInsertChar(char)}
            disabled={disabled}
            className="duo-btn duo-btn-outline"
            style={{
              padding: "8px 14px",
              fontSize: "16px",
              minWidth: "40px",
              textTransform: "none",
            }}
          >
            {char}
          </button>
        ))}
      </div>
    </div>
  );
}
