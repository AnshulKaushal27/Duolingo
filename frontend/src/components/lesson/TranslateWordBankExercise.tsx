"use client";

import React from "react";
import { ExerciseClient } from "@/lib/api";
import { playTilePlaceSound, playTileRemoveSound } from "@/lib/sound";
import { speakText } from "@/lib/speech";

import PromptWordHints from "./PromptWordHints";

interface TranslateWordBankExerciseProps {
  exercise: ExerciseClient;
  placedTokens: string[];
  onTokensChange: (tokens: string[]) => void;
  disabled?: boolean;
}

export default function TranslateWordBankExercise({
  exercise,
  placedTokens,
  onTokensChange,
  disabled,
}: TranslateWordBankExerciseProps) {
  const allTokens: string[] = exercise.client_payload?.tokens || [];

  // Track which tokens from the bank have been used (by index to allow duplicates if any)
  // We match placed tokens with bank tokens
  const usedIndices = new Set<number>();
  placedTokens.forEach((placedToken) => {
    for (let i = 0; i < allTokens.length; i++) {
      if (!usedIndices.has(i) && allTokens[i] === placedToken) {
        usedIndices.add(i);
        break;
      }
    }
  });

  const handleAddToken = (token: string, bankIndex: number) => {
    if (disabled || usedIndices.has(bankIndex)) return;
    playTilePlaceSound();
    speakText(token);
    onTokensChange([...placedTokens, token]);
  };

  const handleRemoveToken = (placedIndex: number) => {
    if (disabled) return;
    playTileRemoveSound();
    speakText(placedTokens[placedIndex]);
    const updated = placedTokens.filter((_, idx) => idx !== placedIndex);
    onTokensChange(updated);
  };

  return (
    <div style={{ width: "100%", maxWidth: "600px", margin: "0 auto" }}>
      {/* Exercise Prompt */}
      <h2 style={{ fontSize: "24px", fontWeight: 800, color: "var(--duo-text)", marginBottom: "24px" }}>
        {exercise.prompt}
      </h2>

      {/* Mascot Speech Bubble with Question */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
        <img
          src="/mascot/duo-happy.svg"
          alt="Duo"
          style={{ width: "84px", height: "84px", flexShrink: 0 }}
        />

        {/* Speech Bubble */}
        <div style={{
          position: "relative",
          backgroundColor: "var(--duo-canvas)",
          border: "2px solid var(--duo-border)",
          padding: "16px 20px",
          borderRadius: "18px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        }}>
          {exercise.audio_text && (
            <button
              onClick={() => speakText(exercise.audio_text || "")}
              className="duo-btn duo-btn-blue"
              style={{ width: "38px", height: "38px", borderRadius: "10px", padding: 0, fontSize: "16px" }}
            >
              🔊
            </button>
          )}
          <PromptWordHints
            sentence={exercise.question_text}
            customHints={exercise.client_payload?.hints}
          />

          {/* Speech bubble pointer */}
          <div style={{
            position: "absolute",
            left: "-10px",
            top: "50%",
            transform: "translateY(-50%)",
            width: 0,
            height: 0,
            borderTop: "8px solid transparent",
            borderBottom: "8px solid transparent",
            borderRight: "10px solid var(--duo-border)",
          }} />
        </div>
      </div>

      {/* Answer Area Slots (Where placed tokens appear) */}
      <div style={{
        minHeight: "72px",
        borderTop: "2px solid var(--duo-border)",
        borderBottom: "2px solid var(--duo-border)",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "8px",
        padding: "12px 0",
        marginBottom: "36px",
      }}>
        {placedTokens.length === 0 ? (
          <span style={{ color: "var(--duo-text-dim)", fontSize: "16px", fontWeight: 600 }}>
            Tap the word tokens below to form your answer
          </span>
        ) : (
          placedTokens.map((token, idx) => (
            <button
              key={idx}
              onClick={() => handleRemoveToken(idx)}
              className="word-tile anim-bounce"
            >
              {token}
            </button>
          ))
        )}
      </div>

      {/* Word Bank Tray */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "10px",
      }}>
        {allTokens.map((token, idx) => {
          const isPlaced = usedIndices.has(idx);
          return (
            <div key={idx} style={{ position: "relative" }}>
              {isPlaced ? (
                <div className="word-tile word-tile-placed">
                  {token}
                </div>
              ) : (
                <button
                  onClick={() => handleAddToken(token, idx)}
                  disabled={disabled}
                  className="word-tile"
                >
                  {token}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
