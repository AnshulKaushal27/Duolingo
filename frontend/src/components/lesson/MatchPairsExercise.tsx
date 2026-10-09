"use client";

import React, { useState } from "react";
import { ExerciseClient } from "@/lib/api";
import { playClickSound, playTilePlaceSound, playIncorrectSound } from "@/lib/sound";
import { speakText } from "@/lib/speech";

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
  const [mismatchedLeft, setMismatchedLeft] = useState<string | null>(null);
  const [mismatchedRight, setMismatchedRight] = useState<string | null>(null);

  const handleSelectLeft = (word: string) => {
    if (disabled || matchedPairs[word]) return;
    playClickSound();
    speakText(word);
    setSelectedLeft(word);

    if (selectedRight) {
      // Form pair candidate
      pairUp(word, selectedRight);
    }
  };

  const handleSelectRight = (word: string) => {
    if (disabled || Object.values(matchedPairs).includes(word)) return;
    playClickSound();
    setSelectedRight(word);

    if (selectedLeft) {
      // Form pair candidate
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
    <div style={{ width: "100%", maxWidth: "600px", margin: "0 auto" }}>
      {/* Exercise Prompt */}
      <h2 style={{ fontSize: "24px", fontWeight: 800, color: "var(--duo-text)", marginBottom: "32px" }}>
        {exercise.prompt}
      </h2>

      {/* Two-Column Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        {/* Left Column (Spanish words) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {leftWords.map((word) => {
            const isMatched = !!matchedPairs[word];
            const isSelected = selectedLeft === word;
            const isMismatch = mismatchedLeft === word;

            return (
              <button
                key={word}
                onClick={() => handleSelectLeft(word)}
                disabled={disabled || isMatched}
                className={`pair-tile ${isMatched ? "matched" : ""} ${isSelected ? "selected" : ""} ${isMismatch ? "mismatch" : ""}`}
              >
                {word}
              </button>
            );
          })}
        </div>

        {/* Right Column (English words) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {rightWords.map((word) => {
            const isMatched = Object.values(matchedPairs).includes(word);
            const isSelected = selectedRight === word;
            const isMismatch = mismatchedRight === word;

            return (
              <button
                key={word}
                onClick={() => handleSelectRight(word)}
                disabled={disabled || isMatched}
                className={`pair-tile ${isMatched ? "matched" : ""} ${isSelected ? "selected" : ""} ${isMismatch ? "mismatch" : ""}`}
              >
                {word}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
