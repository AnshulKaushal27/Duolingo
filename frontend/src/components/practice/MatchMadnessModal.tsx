"use client";

import React, { useState, useEffect } from "react";
import { playClickSound, playCorrectSound } from "@/lib/sound";

interface MatchMadnessModalProps {
  onComplete: (xp: number) => void;
  onClose: () => void;
}

const VOCAB_PAIRS = [
  { es: "Hola", en: "Hello" },
  { es: "Agua", en: "Water" },
  { es: "Hombre", en: "Man" },
  { es: "Mujer", en: "Woman" },
  { es: "Pan", en: "Bread" },
  { es: "Gato", en: "Cat" },
  { es: "Perro", en: "Dog" },
  { es: "Gracias", en: "Thank you" },
];

export default function MatchMadnessModal({
  onComplete,
  onClose,
}: MatchMadnessModalProps) {
  const [timeLeft, setTimeLeft] = useState(45);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);

  // Left and right lists shuffled
  const [leftWords] = useState(() =>
    [...VOCAB_PAIRS].map((p) => p.es).sort(() => Math.random() - 0.5)
  );
  const [rightWords] = useState(() =>
    [...VOCAB_PAIRS].map((p) => p.en).sort(() => Math.random() - 0.5)
  );

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0 || isGameOver) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isGameOver]);

  const handleSelectLeft = (word: string) => {
    if (matchedPairs.includes(word)) return;
    playClickSound();
    setSelectedLeft(word);

    if (selectedRight) {
      checkPair(word, selectedRight);
    }
  };

  const handleSelectRight = (word: string) => {
    const pair = VOCAB_PAIRS.find((p) => p.en === word);
    if (!pair || matchedPairs.includes(pair.es)) return;
    playClickSound();
    setSelectedRight(word);

    if (selectedLeft) {
      checkPair(selectedLeft, word);
    }
  };

  const checkPair = (leftEs: string, rightEn: string) => {
    const pair = VOCAB_PAIRS.find((p) => p.es === leftEs && p.en === rightEn);
    if (pair) {
      playCorrectSound();
      const nextMatched = [...matchedPairs, leftEs];
      setMatchedPairs(nextMatched);
      setSelectedLeft(null);
      setSelectedRight(null);

      if (nextMatched.length === VOCAB_PAIRS.length) {
        setIsGameOver(true);
        onComplete(25);
      }
    } else {
      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 300);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.65)",
        backdropFilter: "blur(4px)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "560px",
          backgroundColor: "var(--duo-modal-bg, var(--duo-card-bg))",
          borderRadius: "24px",
          border: "2px solid var(--duo-border)",
          padding: "28px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {/* Header with Timer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "28px" }}>⚡</span>
            <div>
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: 900,
                  color: "var(--duo-text-dark)",
                  margin: 0,
                }}
              >
                Match Madness
              </h2>
              <span style={{ fontSize: "12px", color: "var(--duo-text-muted)", fontWeight: 700 }}>
                Matched: {matchedPairs.length} / {VOCAB_PAIRS.length}
              </span>
            </div>
          </div>

          <div
            style={{
              padding: "8px 16px",
              borderRadius: "16px",
              backgroundColor: timeLeft < 10 ? "var(--duo-red-bg)" : "var(--duo-blue-bg)",
              color: timeLeft < 10 ? "var(--duo-red-dark)" : "var(--duo-blue-dark)",
              fontWeight: 900,
              fontSize: "16px",
            }}
          >
            ⏱️ {timeLeft}s
          </div>
        </div>

        {isGameOver ? (
          <div
            style={{
              textAlign: "center",
              padding: "32px 0",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <span style={{ fontSize: "56px" }}>🏆</span>
            <h3 style={{ fontSize: "24px", fontWeight: 900, color: "var(--duo-text-dark)" }}>
              Match Madness Finished!
            </h3>
            <p style={{ fontSize: "15px", color: "var(--duo-text-muted)" }}>
              You matched {matchedPairs.length} pairs and earned +{matchedPairs.length * 3} XP!
            </p>
            <button
              onClick={() => {
                playClickSound();
                onClose();
              }}
              className="duo-btn duo-btn-green"
              style={{ padding: "12px 32px", fontSize: "15px", fontWeight: 800 }}
            >
              CLAIM REWARD
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {/* Left Column (Spanish) */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {leftWords.map((word) => {
                const isMatched = matchedPairs.includes(word);
                const isSelected = selectedLeft === word;

                return (
                  <button
                    key={word}
                    onClick={() => handleSelectLeft(word)}
                    disabled={isMatched}
                    style={{
                      padding: "12px 16px",
                      borderRadius: "14px",
                      border: isSelected
                        ? "2px solid var(--duo-blue)"
                        : "2px solid var(--duo-border)",
                      borderBottom: isSelected
                        ? "4px solid var(--duo-blue-dark)"
                        : "4px solid var(--duo-border-dark)",
                      backgroundColor: isMatched
                        ? "var(--duo-surface)"
                        : isSelected
                        ? "var(--duo-blue-bg)"
                        : "var(--duo-card-bg)",
                      opacity: isMatched ? 0.35 : 1,
                      fontWeight: 800,
                      fontSize: "15px",
                      color: isSelected
                        ? "var(--duo-blue)"
                        : isMatched
                        ? "var(--duo-text-muted)"
                        : "var(--duo-text-dark)",
                      cursor: isMatched ? "default" : "pointer",
                      textAlign: "center",
                      transition: "all 0.12s ease",
                    }}
                  >
                    {word}
                  </button>
                );
              })}
            </div>

            {/* Right Column (English) */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {rightWords.map((word) => {
                const pair = VOCAB_PAIRS.find((p) => p.en === word);
                const isMatched = pair ? matchedPairs.includes(pair.es) : false;
                const isSelected = selectedRight === word;

                return (
                  <button
                    key={word}
                    onClick={() => handleSelectRight(word)}
                    disabled={isMatched}
                    style={{
                      padding: "12px 16px",
                      borderRadius: "14px",
                      border: isSelected
                        ? "2px solid var(--duo-blue)"
                        : "2px solid var(--duo-border)",
                      borderBottom: isSelected
                        ? "4px solid var(--duo-blue-dark)"
                        : "4px solid var(--duo-border-dark)",
                      backgroundColor: isMatched
                        ? "var(--duo-surface)"
                        : isSelected
                        ? "var(--duo-blue-bg)"
                        : "var(--duo-card-bg)",
                      opacity: isMatched ? 0.35 : 1,
                      fontWeight: 800,
                      fontSize: "15px",
                      color: isSelected
                        ? "var(--duo-blue)"
                        : isMatched
                        ? "var(--duo-text-muted)"
                        : "var(--duo-text-dark)",
                      cursor: isMatched ? "default" : "pointer",
                      textAlign: "center",
                      transition: "all 0.12s ease",
                    }}
                  >
                    {word}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {!isGameOver && (
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={() => {
                playClickSound();
                onClose();
              }}
              style={{
                background: "none",
                border: "none",
                color: "var(--duo-text-muted)",
                fontWeight: 800,
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              QUIT GAME
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
