"use client";

import React, { useState } from "react";
import { ExerciseClient } from "@/lib/api";
import { playClickSound, playTilePlaceSound } from "@/lib/sound";
import { speakText, isJapaneseText } from "@/lib/speech";

interface MatchPairsExerciseProps {
  exercise: ExerciseClient;
  matchedPairs: Record<string, string>;
  onPairsChange: (pairs: Record<string, string>) => void;
  disabled?: boolean;
}

export default function MatchPairsExercise({
  exercise,
  matchedPairs,
  onPairsChange,
  disabled,
}: MatchPairsExerciseProps) {
  const leftWords: string[] = exercise.client_payload?.left_words || [];
  const rightWords: string[] = exercise.client_payload?.right_words || [];

  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [hoveredWord, setHoveredWord] = useState<string | null>(null);

  const matchedCount = Object.keys(matchedPairs).length;
  const totalPairs = leftWords.length;

  const handleSelectLeft = (word: string) => {
    if (disabled) return;

    // If already matched, tap to unmatch and free the pair
    if (matchedPairs[word]) {
      playClickSound();
      const updated = { ...matchedPairs };
      delete updated[word];
      onPairsChange(updated);
      setHoveredWord(null);
      return;
    }

    // Toggle off if already selected
    if (selectedLeft === word) {
      setSelectedLeft(null);
      return;
    }

    playClickSound();
    speakText(word);
    setSelectedLeft(word);

    if (selectedRight) {
      // Pair with pending right word
      pairUp(word, selectedRight);
    }
  };

  const handleSelectRight = (word: string) => {
    if (disabled) return;

    // Find if this right word is already matched
    const matchedLeftKey = Object.entries(matchedPairs).find(([_, r]) => r === word)?.[0];
    if (matchedLeftKey) {
      playClickSound();
      const updated = { ...matchedPairs };
      delete updated[matchedLeftKey];
      onPairsChange(updated);
      setHoveredWord(null);
      return;
    }

    // Toggle off if already selected
    if (selectedRight === word) {
      setSelectedRight(null);
      return;
    }

    playClickSound();
    setSelectedRight(word);

    if (selectedLeft) {
      // Pair with pending left word
      pairUp(selectedLeft, word);
    }
  };

  const pairUp = (left: string, right: string) => {
    playTilePlaceSound();
    const updated = { ...matchedPairs, [left]: right };
    onPairsChange(updated);
    setSelectedLeft(null);
    setSelectedRight(null);
  };

  return (
    <div style={{ width: "100%", maxWidth: "620px", margin: "0 auto" }}>
      {/* Exercise Prompt & Helper Status */}
      <div style={{ marginBottom: "28px" }}>
        <h2
          style={{
            fontSize: "24px",
            fontWeight: 900,
            color: "var(--duo-text-dark)",
            margin: 0,
            letterSpacing: "-0.2px",
          }}
        >
          {exercise.prompt || "Tap the matching pairs:"}
        </h2>
        {totalPairs > 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "8px",
              fontSize: "14px",
              fontWeight: 700,
              color: matchedCount === totalPairs ? "var(--duo-green)" : "var(--duo-text-muted)",
              transition: "color 0.15s ease",
            }}
          >
            <span>
              {matchedCount === totalPairs
                ? `🎉 All ${totalPairs} pairs matched! Ready to check.`
                : `${matchedCount} of ${totalPairs} pairs matched`}
            </span>
            {matchedCount > 0 && !disabled && (
              <span style={{ fontSize: "12px", opacity: 0.75 }}>
                • (tap a paired tile to unmatch)
              </span>
            )}
          </div>
        )}
      </div>

      {/* Two-Column Matching Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {/* Left Column (Japanese / Foreign Language) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {leftWords.map((word) => {
            const isMatched = !!matchedPairs[word];
            const isSelected = selectedLeft === word;
            const isJapanese = isJapaneseText(word);

            // Is this word or its partner hovered?
            const isHovered = hoveredWord === word;
            const isPartnerHovered =
              hoveredWord !== null &&
              isMatched &&
              matchedPairs[word] === hoveredWord;

            return (
              <button
                key={word}
                onClick={() => handleSelectLeft(word)}
                onMouseEnter={() => setHoveredWord(word)}
                onMouseLeave={() => setHoveredWord(null)}
                disabled={disabled}
                className={`pair-tile ${isMatched ? "matched" : ""} ${isSelected ? "selected" : ""} ${isPartnerHovered ? "partner-hover" : ""} ${disabled ? "disabled" : ""}`}
                style={{
                  fontSize: isJapanese ? "20px" : "18px",
                  letterSpacing: isJapanese ? "0.5px" : "normal",
                }}
                title={isMatched && !disabled ? "Tap to unmatch" : undefined}
              >
                <span>{word}</span>
                {isMatched && !disabled && (
                  <span
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "11px",
                      fontWeight: 800,
                      padding: "2px 6px",
                      borderRadius: "6px",
                      backgroundColor: "var(--duo-surface)",
                      border: "1px solid var(--duo-border)",
                      color: isHovered || isPartnerHovered ? "var(--duo-red)" : "var(--duo-text-muted)",
                      transition: "color 0.12s ease",
                    }}
                  >
                    {isHovered || isPartnerHovered ? "✕" : "✓"}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Column (English translation) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {rightWords.map((word) => {
            const matchedLeftKey = Object.entries(matchedPairs).find(([_, r]) => r === word)?.[0];
            const isMatched = !!matchedLeftKey;
            const isSelected = selectedRight === word;

            // Is this word or its partner hovered?
            const isHovered = hoveredWord === word;
            const isPartnerHovered =
              hoveredWord !== null &&
              isMatched &&
              matchedLeftKey === hoveredWord;

            return (
              <button
                key={word}
                onClick={() => handleSelectRight(word)}
                onMouseEnter={() => setHoveredWord(word)}
                onMouseLeave={() => setHoveredWord(null)}
                disabled={disabled}
                className={`pair-tile ${isMatched ? "matched" : ""} ${isSelected ? "selected" : ""} ${isPartnerHovered ? "partner-hover" : ""} ${disabled ? "disabled" : ""}`}
                title={isMatched && !disabled ? "Tap to unmatch" : undefined}
              >
                <span>{word}</span>
                {isMatched && !disabled && (
                  <span
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "11px",
                      fontWeight: 800,
                      padding: "2px 6px",
                      borderRadius: "6px",
                      backgroundColor: "var(--duo-surface)",
                      border: "1px solid var(--duo-border)",
                      color: isHovered || isPartnerHovered ? "var(--duo-red)" : "var(--duo-text-muted)",
                      transition: "color 0.12s ease",
                    }}
                  >
                    {isHovered || isPartnerHovered ? "✕" : "✓"}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
