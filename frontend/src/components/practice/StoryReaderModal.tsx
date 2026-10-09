"use client";

import React, { useState } from "react";
import { playClickSound, playCorrectSound } from "@/lib/sound";
import { speakText } from "@/lib/speech";

interface StoryLine {
  speaker: string;
  avatar: string;
  spanish: string;
  english: string;
}

interface StoryQuestion {
  prompt: string;
  options: string[];
  correctIndex: number;
}

interface StoryData {
  id: string;
  title: string;
  spanishTitle: string;
  xpReward: number;
  lines: StoryLine[];
  questionAfterLine: number;
  question: StoryQuestion;
}

const SAMPLE_STORIES: Record<string, StoryData> = {
  "buenos-dias": {
    id: "buenos-dias",
    title: "Good Morning!",
    spanishTitle: "¡Buenos días!",
    xpReward: 20,
    lines: [
      {
        speaker: "Junior",
        avatar: "👦",
        spanish: "¡Papá! ¡Papá! ¡Buenos días!",
        english: "Dad! Dad! Good morning!",
      },
      {
        speaker: "Eddy",
        avatar: "🧔",
        spanish: "Buenos días, Junior. ¿Dónde está mi café?",
        english: "Good morning, Junior. Where is my coffee?",
      },
      {
        speaker: "Junior",
        avatar: "👦",
        spanish: "Tu café está en la mesa, pero necesitas azúcar.",
        english: "Your coffee is on the table, but you need sugar.",
      },
      {
        speaker: "Eddy",
        avatar: "🧔",
        spanish: "Ah, sí. Aquí está el azúcar... ¡Espera, esto es sal!",
        english: "Ah, yes. Here is the sugar... Wait, this is salt!",
      },
      {
        speaker: "Junior",
        avatar: "👦",
        spanish: "¡Jajaja! ¡Es el Día de los Inocentes, papá!",
        english: "Hahaha! It's April Fool's Day, Dad!",
      },
    ],
    questionAfterLine: 3,
    question: {
      prompt: "What did Eddy accidentally put in his coffee?",
      options: ["Milk", "Salt instead of sugar", "Pepper"],
      correctIndex: 1,
    },
  },
  "el-restaurante": {
    id: "el-restaurante",
    title: "A Date at the Restaurant",
    spanishTitle: "Una cita en el restaurante",
    xpReward: 25,
    lines: [
      {
        speaker: "Bea",
        avatar: "👩",
        spanish: "Buenas tardes. Tengo una reserva para dos.",
        english: "Good afternoon. I have a reservation for two.",
      },
      {
        speaker: "Mesero",
        avatar: "👨‍🍳",
        spanish: "Por supuesto, señorita. Su mesa está aquí junto a la ventana.",
        english: "Of course, miss. Your table is here by the window.",
      },
      {
        speaker: "Bea",
        avatar: "👩",
        spanish: "Gracias. Mi cita llega en cinco minutos.",
        english: "Thank you. My date arrives in five minutes.",
      },
      {
        speaker: "Bea",
        avatar: "👩",
        spanish: "¡Espera! ¿Ese de allí es mi profesor de español?",
        english: "Wait! Is that my Spanish teacher over there?",
      },
      {
        speaker: "Mesero",
        avatar: "👨‍🍳",
        spanish: "¡Hola Bea! Hoy es mi segundo trabajo como mesero.",
        english: "Hello Bea! Today is my second job as a waiter.",
      },
    ],
    questionAfterLine: 3,
    question: {
      prompt: "Who did Bea recognize at the restaurant?",
      options: ["Her brother", "Her Spanish teacher", "Her best friend"],
      correctIndex: 1,
    },
  },
};

interface StoryReaderModalProps {
  storyId: string;
  onComplete: (xp: number) => void;
  onClose: () => void;
}

export default function StoryReaderModal({
  storyId,
  onComplete,
  onClose,
}: StoryReaderModalProps) {
  const story = SAMPLE_STORIES[storyId] || SAMPLE_STORIES["buenos-dias"];
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [showQuestion, setShowQuestion] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [questionAnswered, setQuestionAnswered] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [showTranslations, setShowTranslations] = useState(true);

  const totalLines = story.lines.length;

  const handleNextLine = () => {
    playClickSound();
    if (currentLineIndex === story.questionAfterLine && !questionAnswered) {
      setShowQuestion(true);
      return;
    }

    if (currentLineIndex + 1 < totalLines) {
      setCurrentLineIndex((prev) => prev + 1);
      const nextLine = story.lines[currentLineIndex + 1];
      speakText(nextLine.spanish, "es-ES", 0.95);
    } else {
      setCompleted(true);
      playCorrectSound();
      onComplete(story.xpReward);
    }
  };

  const handleSelectOption = (index: number) => {
    if (questionAnswered) return;
    playClickSound();
    setSelectedOption(index);
  };

  const handleCheckQuestion = () => {
    if (selectedOption === null) return;
    if (selectedOption === story.question.correctIndex) {
      playCorrectSound();
      setQuestionAnswered(true);
      setShowQuestion(false);
      setCurrentLineIndex((prev) => prev + 1);
    } else {
      alert("Try again! Pick the right answer.");
    }
  };

  const progressPercent = Math.round(
    ((currentLineIndex + 1) / (totalLines + 1)) * 100
  );

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.65)",
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
          maxWidth: "680px",
          height: "85vh",
          backgroundColor: "#ffffff",
          borderRadius: "24px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 24px",
            borderBottom: "2px solid var(--duo-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
          }}
        >
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            style={{
              background: "none",
              border: "none",
              fontSize: "22px",
              cursor: "pointer",
              fontWeight: 800,
              color: "var(--duo-text-muted)",
            }}
          >
            ✕
          </button>

          {/* Progress Bar */}
          <div style={{ flex: 1, maxWidth: "420px" }}>
            <div className="duo-progress-track" style={{ height: "12px" }}>
              <div
                className="duo-progress-fill"
                style={{ width: `${completed ? 100 : progressPercent}%` }}
              />
            </div>
          </div>

          {/* Translation Toggle */}
          <button
            onClick={() => setShowTranslations(!showTranslations)}
            style={{
              fontSize: "12px",
              fontWeight: 800,
              padding: "6px 12px",
              borderRadius: "12px",
              border: "2px solid var(--duo-border)",
              backgroundColor: showTranslations ? "var(--duo-blue-bg)" : "#fff",
              color: showTranslations ? "var(--duo-blue-dark)" : "var(--duo-text-muted)",
              cursor: "pointer",
            }}
          >
            {showTranslations ? "Hide EN" : "Show EN"}
          </button>
        </div>

        {/* Content Body */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "32px 28px",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          {completed ? (
            <div
              style={{
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "20px",
                margin: "auto",
              }}
            >
              <img
                src="/mascot/duo-celebrate.svg"
                alt="Story Complete"
                style={{ width: "120px", height: "120px" }}
              />
              <h2
                style={{
                  fontSize: "28px",
                  fontWeight: 900,
                  color: "var(--duo-text-dark)",
                }}
              >
                Story Complete!
              </h2>
              <p style={{ fontSize: "16px", color: "var(--duo-text-muted)" }}>
                You finished &ldquo;{story.spanishTitle}&rdquo; and earned +{story.xpReward} XP!
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  fontSize: "24px",
                  fontWeight: 900,
                  color: "var(--duo-yellow-dark)",
                }}
              >
                <span>⭐</span>
                <span>⭐</span>
                <span>⭐</span>
              </div>
            </div>
          ) : showQuestion ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div
                style={{
                  backgroundColor: "var(--duo-blue-bg)",
                  padding: "16px 20px",
                  borderRadius: "16px",
                  border: "2px solid var(--duo-blue)",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 900,
                    textTransform: "uppercase",
                    color: "var(--duo-blue)",
                  }}
                >
                  Quick Comprehension Check
                </span>
                <h3
                  style={{
                    fontSize: "19px",
                    fontWeight: 800,
                    color: "var(--duo-text-dark)",
                    marginTop: "6px",
                  }}
                >
                  {story.question.prompt}
                </h3>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {story.question.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      style={{
                        padding: "16px 20px",
                        borderRadius: "16px",
                        border: isSelected
                          ? "2px solid var(--duo-blue)"
                          : "2px solid var(--duo-border)",
                        borderBottom: isSelected
                          ? "5px solid var(--duo-blue-dark)"
                          : "4px solid var(--duo-border-dark)",
                        backgroundColor: isSelected ? "var(--duo-blue-bg)" : "#ffffff",
                        fontSize: "16px",
                        fontWeight: 800,
                        textAlign: "left",
                        cursor: "pointer",
                        color: "var(--duo-text-dark)",
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {story.lines.slice(0, currentLineIndex + 1).map((line, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "16px",
                    animation: "duoBounce 0.25s ease-out",
                  }}
                >
                  <span
                    style={{
                      fontSize: "36px",
                      width: "48px",
                      height: "48px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50%",
                      backgroundColor: "var(--duo-surface)",
                      flexShrink: 0,
                    }}
                  >
                    {line.avatar}
                  </span>

                  <div
                    style={{
                      backgroundColor: "var(--duo-canvas)",
                      border: "2px solid var(--duo-border)",
                      borderRadius: "20px",
                      padding: "16px 20px",
                      flex: 1,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "4px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: 800,
                          color: "var(--duo-text-muted)",
                        }}
                      >
                        {line.speaker}
                      </span>
                      <button
                        onClick={() => speakText(line.spanish, "es-ES", 0.9)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "16px",
                        }}
                        title="Listen"
                      >
                        🔊
                      </button>
                    </div>

                    <p
                      style={{
                        fontSize: "18px",
                        fontWeight: 800,
                        color: "var(--duo-text-dark)",
                        margin: 0,
                      }}
                    >
                      {line.spanish}
                    </p>

                    {showTranslations && (
                      <p
                        style={{
                          fontSize: "14px",
                          color: "var(--duo-text-muted)",
                          marginTop: "6px",
                          marginBottom: 0,
                        }}
                      >
                        {line.english}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: "2px solid var(--duo-border)",
            display: "flex",
            justifyContent: "flex-end",
            backgroundColor: "#ffffff",
          }}
        >
          {completed ? (
            <button
              onClick={() => {
                playClickSound();
                onClose();
              }}
              className="duo-btn duo-btn-green"
              style={{ padding: "14px 32px", fontSize: "16px", fontWeight: 800 }}
            >
              CONTINUE
            </button>
          ) : showQuestion ? (
            <button
              onClick={handleCheckQuestion}
              disabled={selectedOption === null}
              className="duo-btn duo-btn-green"
              style={{ padding: "14px 32px", fontSize: "16px", fontWeight: 800 }}
            >
              CHECK
            </button>
          ) : (
            <button
              onClick={handleNextLine}
              className="duo-btn duo-btn-green"
              style={{ padding: "14px 32px", fontSize: "16px", fontWeight: 800 }}
            >
              CONTINUE
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
