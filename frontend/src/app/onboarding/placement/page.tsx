"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "@/lib/onboarding-context";
import { playCorrectSound, playIncorrectSound, playClickSound } from "@/lib/sound";

interface PlacementQuestion {
  id: number;
  unitTarget: number;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUESTIONS: PlacementQuestion[] = [
  {
    id: 1,
    unitTarget: 1,
    prompt: "Which of these is 'the milk'?",
    options: ["la leche", "el agua", "el pan"],
    correctIndex: 0,
    explanation: "'la leche' means the milk in Spanish.",
  },
  {
    id: 2,
    unitTarget: 1,
    prompt: "Translate: 'Buenos días, ¿cómo estás?'",
    options: ["Good morning, how are you?", "Good night, see you tomorrow", "Hello, thank you very much"],
    correctIndex: 0,
    explanation: "'Buenos días' = Good morning; '¿cómo estás?' = how are you?",
  },
  {
    id: 3,
    unitTarget: 2,
    prompt: "Complete the sentence: 'Yo _____ un café por favor.'",
    options: ["quiero", "queremos", "quieren"],
    correctIndex: 0,
    explanation: "'Yo quiero' is the first person singular form of querer (to want).",
  },
  {
    id: 4,
    unitTarget: 2,
    prompt: "Translate: 'La cuenta, por favor.'",
    options: ["The check, please.", "A glass of water, please.", "The food is ready."],
    correctIndex: 0,
    explanation: "'La cuenta' translates to the check or bill.",
  },
  {
    id: 5,
    unitTarget: 3,
    prompt: "Translate: 'Mi hermano vive en una casa grande.'",
    options: [
      "My brother lives in a big house.",
      "My sister has a small room.",
      "My family travels to Spain.",
    ],
    correctIndex: 0,
    explanation: "'hermano' = brother, 'vive' = lives, 'casa grande' = big house.",
  },
];

export default function PlacementTestPage() {
  const router = useRouter();
  const { setPlacementUnit } = useOnboarding();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<"answering" | "correct" | "incorrect" | "finished">("answering");
  const [placedUnit, setPlacedUnit] = useState(1);

  const currentQ = QUESTIONS[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / QUESTIONS.length) * 100);

  const handleCheck = () => {
    if (selectedOption === null) return;
    const isCorrect = selectedOption === currentQ.correctIndex;
    if (isCorrect) {
      playCorrectSound();
      setScore((s) => s + 1);
      setStatus("correct");
    } else {
      playIncorrectSound();
      setStatus("incorrect");
    }
  };

  const handleSkip = () => {
    playClickSound();
    setStatus("incorrect");
  };

  const handleNext = () => {
    if (currentIndex + 1 < QUESTIONS.length) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setStatus("answering");
    } else {
      // Calculate placement
      const finalScore = status === "correct" ? score + 1 : score;
      let targetUnit = 1;
      if (finalScore >= 4) {
        targetUnit = 3;
      } else if (finalScore >= 2) {
        targetUnit = 2;
      } else {
        targetUnit = 1;
      }
      setPlacedUnit(targetUnit);
      setPlacementUnit(targetUnit);
      setStatus("finished");
    }
  };

  const handleFinishContinue = () => {
    router.push("/onboarding/goal");
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
          Great job!
        </h1>
        <div
          style={{
            maxWidth: "460px",
            backgroundColor: "var(--duo-blue-bg)",
            border: "2px solid var(--duo-blue)",
            borderRadius: "20px",
            padding: "20px 24px",
          }}
        >
          <span style={{ fontSize: "20px", fontWeight: 800, color: "var(--duo-blue-dark)" }}>
            We&apos;ve set your starting point to Unit {placedUnit}!
          </span>
          <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--duo-text)", marginTop: "8px" }}>
            {placedUnit > 1
              ? `You've jumped ahead! Units prior to Unit ${placedUnit} will be automatically unlocked.`
              : "You'll start from Unit 1 to build a solid foundation."}
          </p>
        </div>

        <button
          onClick={handleFinishContinue}
          className="duo-btn duo-btn-green"
          style={{ minWidth: "220px", height: "50px", fontSize: "16px" }}
        >
          CONTINUE
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "var(--duo-canvas)" }}>
      {/* Test Header */}
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
          onClick={() => router.push("/onboarding/start-choice")}
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

        <button
          onClick={handleSkip}
          disabled={status !== "answering"}
          type="button"
          style={{
            background: "none",
            border: "none",
            fontSize: "13px",
            fontWeight: 800,
            color: "var(--duo-text-muted)",
            cursor: status === "answering" ? "pointer" : "default",
            opacity: status === "answering" ? 1 : 0.4,
          }}
        >
          I&apos;M NOT SURE
        </button>
      </header>

      {/* Main Question Body */}
      <main
        style={{
          flex: 1,
          maxWidth: "580px",
          width: "100%",
          margin: "0 auto",
          padding: "24px 20px 140px 20px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <span
          style={{
            fontSize: "13px",
            fontWeight: 800,
            color: "var(--duo-blue)",
            letterSpacing: "0.8px",
            textTransform: "uppercase",
            marginBottom: "8px",
          }}
        >
          PLACEMENT TEST • QUESTION {currentIndex + 1} OF {QUESTIONS.length}
        </span>

        <h2 style={{ fontSize: "24px", fontWeight: 800, color: "var(--duo-text-dark)", marginBottom: "32px" }}>
          {currentQ.prompt}
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {currentQ.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  if (status === "answering") {
                    setSelectedOption(idx);
                    playClickSound();
                  }
                }}
                className={`duo-card ${isSelected ? "selected" : ""}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "18px 20px",
                  borderRadius: "16px",
                  borderWidth: "2px",
                  borderBottomWidth: "4px",
                  textAlign: "left",
                  fontSize: "17px",
                  fontWeight: 700,
                  color: "var(--duo-text-dark)",
                  outline: "none",
                  cursor: status === "answering" ? "pointer" : "default",
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
                <span>{opt}</span>
              </button>
            );
          })}
        </div>
      </main>

      {/* Bottom Sheet Action Bar */}
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
            maxWidth: "580px",
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
                disabled={selectedOption === null}
                className={`duo-btn ${selectedOption !== null ? "duo-btn-green" : "duo-btn-disabled"}`}
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
                    {status === "correct" ? "Correct!" : "Incorrect"}
                  </h4>
                  <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--duo-text-dark)" }}>
                    {currentQ.explanation}
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
