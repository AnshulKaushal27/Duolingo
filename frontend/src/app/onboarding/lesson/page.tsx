"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "@/lib/onboarding-context";
import {
  playCorrectSound,
  playIncorrectSound,
  playClickSound,
  playFanfareSound,
} from "@/lib/sound";

interface QuickExercise {
  id: number;
  type: "picture_select" | "multiple_choice" | "word_bank";
  prompt: string;
  options?: { label: string; icon?: string; correct: boolean }[];
  tokens?: string[];
  distractors?: string[];
  canonicalAnswer?: string;
  explanation: string;
}

const QUICK_EXERCISES: QuickExercise[] = [
  {
    id: 1,
    type: "picture_select",
    prompt: "Which one of these is 'the woman'?",
    options: [
      { label: "la mujer", icon: "👩", correct: true },
      { label: "el hombre", icon: "👨", correct: false },
      { label: "la niña", icon: "👧", correct: false },
    ],
    explanation: "'la mujer' is Spanish for 'the woman'.",
  },
  {
    id: 2,
    type: "multiple_choice",
    prompt: "Which one of these is 'the man'?",
    options: [
      { label: "el hombre", correct: true },
      { label: "la mujer", correct: false },
      { label: "el niño", correct: false },
    ],
    explanation: "'el hombre' is Spanish for 'the man'.",
  },
  {
    id: 3,
    type: "word_bank",
    prompt: "The woman drinks water",
    tokens: ["La", "mujer", "bebe", "agua"],
    distractors: ["como", "leche"],
    canonicalAnswer: "La mujer bebe agua",
    explanation: "'La mujer bebe agua' translates to 'The woman drinks water'.",
  },
  {
    id: 4,
    type: "multiple_choice",
    prompt: "Complete the sentence: 'Yo _____ un hombre.'",
    options: [
      { label: "soy", correct: true },
      { label: "eres", correct: false },
      { label: "es", correct: false },
    ],
    explanation: "'Yo soy' means 'I am'.",
  },
  {
    id: 5,
    type: "word_bank",
    prompt: "I am a boy",
    tokens: ["Yo", "soy", "un", "niño"],
    distractors: ["una", "chica"],
    canonicalAnswer: "Yo soy un niño",
    explanation: "'Yo soy un niño' translates to 'I am a boy'.",
  },
];

export default function QuickFirstLessonPage() {
  const router = useRouter();
  const { completeGuestLesson } = useOnboarding();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [status, setStatus] = useState<"answering" | "correct" | "incorrect" | "finished">("answering");

  const currentEx = QUICK_EXERCISES[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / QUICK_EXERCISES.length) * 100);

  // Word bank available pool
  const allChips = currentEx.tokens
    ? [...currentEx.tokens, ...(currentEx.distractors || [])]
    : [];

  const handleSelectOption = (idx: number) => {
    if (status !== "answering") return;
    setSelectedOption(idx);
    playClickSound();
  };

  const handleTapBankChip = (chip: string) => {
    if (status !== "answering") return;
    playClickSound();
    setSelectedChips([...selectedChips, chip]);
  };

  const handleTapAnswerChip = (index: number) => {
    if (status !== "answering") return;
    playClickSound();
    const next = [...selectedChips];
    next.splice(index, 1);
    setSelectedChips(next);
  };

  const handleCheck = () => {
    let isCorrect = false;
    if (currentEx.type === "picture_select" || currentEx.type === "multiple_choice") {
      if (selectedOption !== null && currentEx.options) {
        isCorrect = currentEx.options[selectedOption].correct;
      }
    } else if (currentEx.type === "word_bank") {
      const sentence = selectedChips.join(" ").trim().toLowerCase();
      const canonical = currentEx.canonicalAnswer?.trim().toLowerCase();
      isCorrect = sentence === canonical;
    }

    if (isCorrect) {
      playCorrectSound();
      setStatus("correct");
    } else {
      playIncorrectSound();
      setStatus("incorrect");
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < QUICK_EXERCISES.length) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setSelectedChips([]);
      setStatus("answering");
    } else {
      playFanfareSound();
      completeGuestLesson(10);
      setStatus("finished");
    }
  };

  const handleSaveProgress = () => {
    router.push("/auth/signup");
  };

  if (status === "finished") {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "var(--duo-canvas)",
          padding: "24px",
          textAlign: "center",
          gap: "24px",
        }}
      >
        <img
          src="/mascot/duo-celebrate.svg"
          alt="Celebrate"
          style={{ width: "160px", height: "160px" }}
        />

        <h1 style={{ fontSize: "32px", fontWeight: 900, color: "var(--duo-text-dark)" }}>
          Lesson complete!
        </h1>

        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
          {/* XP Stat */}
          <div
            style={{
              padding: "16px 24px",
              borderRadius: "18px",
              backgroundColor: "var(--duo-yellow-bg)",
              border: "2px solid var(--duo-yellow-dark)",
              minWidth: "130px",
            }}
          >
            <span style={{ fontSize: "14px", fontWeight: 800, color: "var(--duo-yellow-dark)", textTransform: "uppercase" }}>
              TOTAL XP
            </span>
            <h3 style={{ fontSize: "28px", fontWeight: 900, color: "var(--duo-text-dark)", marginTop: "4px" }}>
              +10
            </h3>
          </div>

          {/* Streak Stat */}
          <div
            style={{
              padding: "16px 24px",
              borderRadius: "18px",
              backgroundColor: "var(--duo-surface)",
              border: "2px solid var(--duo-orange)",
              minWidth: "130px",
            }}
          >
            <span style={{ fontSize: "14px", fontWeight: 800, color: "var(--duo-orange)", textTransform: "uppercase" }}>
              DAY STREAK
            </span>
            <h3 style={{ fontSize: "28px", fontWeight: 900, color: "var(--duo-text-dark)", marginTop: "4px" }}>
              🔥 1
            </h3>
          </div>
        </div>

        <p style={{ maxWidth: "400px", fontSize: "15px", fontWeight: 700, color: "var(--duo-text-muted)" }}>
          Create a free profile to save your progress, track your streak, and unlock the full Spanish learning path!
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%", maxWidth: "340px" }}>
          <button
            onClick={handleSaveProgress}
            className="duo-btn duo-btn-green"
            style={{ width: "100%", height: "50px", fontSize: "15px" }}
          >
            CREATE PROFILE TO SAVE
          </button>
        </div>
      </div>
    );
  }

  const isCheckEnabled =
    currentEx.type === "word_bank" ? selectedChips.length > 0 : selectedOption !== null;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "var(--duo-canvas)" }}>
      {/* Top Header */}
      <header
        style={{
          height: "64px",
          display: "flex",
          alignItems: "center",
          gap: "20px",
          maxWidth: "680px",
          width: "100%",
          margin: "0 auto",
          padding: "0 20px",
        }}
      >
        <button
          onClick={() => router.push("/onboarding/interstitial")}
          type="button"
          style={{
            background: "none",
            border: "none",
            fontSize: "20px",
            color: "var(--duo-text-muted)",
            cursor: "pointer",
          }}
        >
          ✕
        </button>

        <div
          style={{
            flex: 1,
            height: "14px",
            backgroundColor: "var(--duo-border)",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progressPercent}%`,
              backgroundColor: "var(--duo-green)",
              transition: "width 0.3s ease",
            }}
          />
        </div>
      </header>

      {/* Main Exercise Area */}
      <main
        style={{
          flex: 1,
          maxWidth: "600px",
          width: "100%",
          margin: "0 auto",
          padding: "24px 20px 140px 20px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h2 style={{ fontSize: "24px", fontWeight: 800, color: "var(--duo-text-dark)", marginBottom: "28px" }}>
          {currentEx.prompt}
        </h2>

        {/* 1. Picture Select Layout */}
        {currentEx.type === "picture_select" && currentEx.options && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px" }}>
            {currentEx.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectOption(idx)}
                  className={`duo-card ${isSelected ? "selected" : ""}`}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "28px 12px",
                    gap: "12px",
                    borderRadius: "18px",
                    borderWidth: "2px",
                    borderBottomWidth: "4px",
                    outline: "none",
                  }}
                >
                  <span style={{ fontSize: "52px", lineHeight: 1 }}>{opt.icon}</span>
                  <span style={{ fontSize: "16px", fontWeight: 800, color: "var(--duo-text-dark)" }}>
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* 2. Multiple Choice Layout */}
        {currentEx.type === "multiple_choice" && currentEx.options && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {currentEx.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectOption(idx)}
                  className={`duo-card ${isSelected ? "selected" : ""}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "18px 20px",
                    borderRadius: "16px",
                    borderWidth: "2px",
                    borderBottomWidth: "4px",
                    fontSize: "17px",
                    fontWeight: 700,
                    color: "var(--duo-text-dark)",
                    outline: "none",
                  }}
                >
                  <span
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "8px",
                      border: "2px solid var(--duo-border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "13px",
                      fontWeight: 800,
                      marginRight: "14px",
                      color: isSelected ? "var(--duo-blue)" : "var(--duo-text-muted)",
                      borderColor: isSelected ? "var(--duo-blue)" : "var(--duo-border)",
                    }}
                  >
                    {idx + 1}
                  </span>
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* 3. Word Bank Layout */}
        {currentEx.type === "word_bank" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            {/* Slot area */}
            <div
              style={{
                minHeight: "80px",
                borderBottom: "2px solid var(--duo-border)",
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                alignItems: "center",
                padding: "8px 0",
              }}
            >
              {selectedChips.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleTapAnswerChip(idx)}
                  className="word-tile"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Word bank pool */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
              {allChips.map((chip, idx) => {
                const countInSelected = selectedChips.filter((c) => c === chip).length;
                const countInTotal = allChips.filter((c) => c === chip).length;
                const isUsed = countInSelected >= countInTotal;

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={isUsed}
                    onClick={() => handleTapBankChip(chip)}
                    className={`word-tile ${isUsed ? "word-tile-placed" : ""}`}
                  >
                    {chip}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Bottom Action Footer */}
      <footer
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor:
            status === "correct"
              ? "var(--duo-green-bg)"
              : status === "incorrect"
              ? "var(--duo-red-bg)"
              : "var(--duo-canvas)",
          borderTop: `2px solid ${
            status === "correct"
              ? "var(--duo-green)"
              : status === "incorrect"
              ? "var(--duo-red)"
              : "var(--duo-border)"
          }`,
          padding: "20px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 50,
          transition: "background-color 0.2s ease",
        }}
      >
        <div
          style={{
            maxWidth: "600px",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {status === "answering" ? (
            <div style={{ display: "flex", width: "100%", justifyContent: "flex-end" }}>
              <button
                onClick={handleCheck}
                disabled={!isCheckEnabled}
                className={`duo-btn ${isCheckEnabled ? "duo-btn-green" : "duo-btn-disabled"}`}
                style={{ minWidth: "160px", height: "48px" }}
              >
                CHECK
              </button>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "28px" }}>{status === "correct" ? "🎉" : "❌"}</span>
                <div>
                  <h4
                    style={{
                      fontSize: "18px",
                      fontWeight: 900,
                      color: status === "correct" ? "var(--duo-green-dark)" : "var(--duo-red-dark)",
                    }}
                  >
                    {status === "correct" ? "Great job!" : "Correct solution:"}
                  </h4>
                  <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--duo-text-dark)" }}>
                    {status === "correct" ? currentEx.explanation : currentEx.canonicalAnswer || currentEx.explanation}
                  </p>
                </div>
              </div>

              <button
                onClick={handleNext}
                className={`duo-btn ${status === "correct" ? "duo-btn-green" : "duo-btn-red"}`}
                style={{ minWidth: "160px", height: "48px" }}
              >
                CONTINUE
              </button>
            </>
          )}
        </div>
      </footer>
    </div>
  );
}
