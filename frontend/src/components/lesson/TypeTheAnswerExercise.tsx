"use client";

import React, { useRef, useState } from "react";
import { ExerciseClient } from "@/lib/api";
import { playClickSound } from "@/lib/sound";
import { speakText, isJapaneseText } from "@/lib/speech";

interface TypeTheAnswerExerciseProps {
  exercise: ExerciseClient;
  answerText: string;
  onTextChange: (text: string) => void;
  disabled?: boolean;
}

const SPANISH_ACCENT_CHARS = ["á", "é", "í", "ó", "ú", "ñ", "¿", "¡"];

// Curated frequent Japanese kana pills for quick typing assistance
const JAPANESE_QUICK_KANA = [
  "あ", "い", "う", "え", "お",
  "か", "き", "く", "け", "こ",
  "さ", "し", "す", "せ", "そ",
  "た", "ち", "つ", "て", "と",
  "な", "に", "ぬ", "ね", "の",
  "は", "ひ", "ふ", "へ", "ほ",
  "ま", "み", "む", "め", "も",
  "や", "ゆ", "よ",
  "ら", "り", "る", "れ", "ろ",
  "わ", "を", "ん", "っ", "ー", "。"
];

export default function TypeTheAnswerExercise({
  exercise,
  answerText,
  onTextChange,
  disabled,
}: TypeTheAnswerExerciseProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [showAllKana, setShowAllKana] = useState(false);

  const isJapanese =
    exercise.client_payload?.target_language === "ja" ||
    isJapaneseText(exercise.audio_text || "") ||
    isJapaneseText(exercise.question_text || "") ||
    exercise.prompt.toLowerCase().includes("japanese");

  const langCode = isJapanese ? "ja-JP" : "es-ES";

  const handleInsertChar = (char: string) => {
    if (disabled) return;
    playClickSound();
    const updated = answerText + char;
    onTextChange(updated);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const displayedKana = showAllKana ? JAPANESE_QUICK_KANA : JAPANESE_QUICK_KANA.slice(0, 15);

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
        <div
          style={{
            backgroundColor: "var(--duo-canvas)",
            border: "2px solid var(--duo-border)",
            padding: "16px 20px",
            borderRadius: "18px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          {exercise.audio_text && (
            <div style={{ display: "flex", gap: "6px" }}>
              <button
                onClick={() => speakText(exercise.audio_text || "", langCode, 0.9)}
                className="duo-btn duo-btn-blue"
                title="Normal pronunciation"
                style={{ width: "36px", height: "36px", borderRadius: "10px", padding: 0 }}
              >
                🔊
              </button>
              <button
                onClick={() => speakText(exercise.audio_text || "", langCode, 0.65)}
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
          placeholder={isJapanese ? "Type in Japanese or Romaji (e.g. arigatou)..." : "Type in Spanish..."}
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

      {/* Helper Keyboard Bar */}
      {isJapanese ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center" }}>
            {displayedKana.map((char) => (
              <button
                key={char}
                onClick={() => handleInsertChar(char)}
                disabled={disabled}
                className="duo-btn duo-btn-outline"
                style={{
                  padding: "6px 12px",
                  fontSize: "16px",
                  minWidth: "36px",
                  textTransform: "none",
                }}
              >
                {char}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setShowAllKana(!showAllKana)}
            style={{
              background: "none",
              border: "none",
              color: "var(--duo-blue)",
              fontSize: "12px",
              fontWeight: 800,
              cursor: "pointer",
              padding: "4px 8px",
            }}
          >
            {showAllKana ? "▲ SHOW FEWER KANA" : "▼ SHOW MORE KANA"}
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
          {SPANISH_ACCENT_CHARS.map((char) => (
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
      )}
    </div>
  );
}
