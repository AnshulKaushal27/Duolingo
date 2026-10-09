"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { api, LessonStartData, ExerciseClient, ExerciseSubmitResult, LessonCompleteResult } from "@/lib/api";
import {
  playClickSound,
  playCorrectSound,
  playIncorrectSound,
  playHeartLostSound,
} from "@/lib/sound";

import MultipleChoiceExercise from "@/components/lesson/MultipleChoiceExercise";
import TranslateWordBankExercise from "@/components/lesson/TranslateWordBankExercise";
import MatchPairsExercise from "@/components/lesson/MatchPairsExercise";
import FillInTheBlankExercise from "@/components/lesson/FillInTheBlankExercise";
import TypeTheAnswerExercise from "@/components/lesson/TypeTheAnswerExercise";
import FeedbackBar from "@/components/lesson/FeedbackBar";
import ExitModal from "@/components/lesson/ExitModal";
import OutOfHeartsModal from "@/components/lesson/OutOfHeartsModal";
import LessonCompleteScreen from "@/components/lesson/LessonCompleteScreen";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/lib/auth-context";

export default function LessonPage() {
  return (
    <ProtectedRoute>
      <Suspense
        fallback={
          <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            Loading lesson...
          </div>
        }
      >
        <LessonContent />
      </Suspense>
    </ProtectedRoute>
  );
}

function LessonContent() {
  const params = useParams();
  const router = useRouter();
  const lessonId = parseInt(params.lessonId as string, 10);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user, updateGems } = useAuth();
  const [lessonData, setLessonData] = useState<LessonStartData | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [gems, setGems] = useState(user?.gems ?? 0);
  const [comboStreak, setComboStreak] = useState(0);

  // Current Exercise interaction state
  const [currentAnswer, setCurrentAnswer] = useState<any>(null);
  const [feedbackStatus, setFeedbackStatus] = useState<"idle" | "submitting" | "correct" | "incorrect">("idle");
  const [evalResult, setEvalResult] = useState<ExerciseSubmitResult | null>(null);

  // Modals & Final Screens
  const [exitModalOpen, setExitModalOpen] = useState(false);
  const [outOfHeartsOpen, setOutOfHeartsOpen] = useState(false);
  const [completeResult, setCompleteResult] = useState<LessonCompleteResult | null>(null);

  // Load lesson from backend
  useEffect(() => {
    async function loadLesson() {
      try {
        setLoading(true);
        // Also fetch user profile to get accurate hearts
        try {
          const prof = await api.getUserProfile();
          setHearts(prof.hearts);
          setGems(prof.gems);
        } catch {}

        const data = await api.startLesson(lessonId);
        setLessonData(data);
      } catch (err: any) {
        setError(err.message || "Failed to load lesson");
      } finally {
        setLoading(false);
      }
    }
    if (lessonId) {
      loadLesson();
    }

    const handleBackendOnline = () => {
      if (lessonId) loadLesson();
    };

    window.addEventListener("duo:backend_online", handleBackendOnline);
    return () => {
      window.removeEventListener("duo:backend_online", handleBackendOnline);
    };
  }, [lessonId]);

  const currentExercise = lessonData?.exercises?.[currentIndex];
  const totalExercises = lessonData?.exercises?.length || 0;
  const isEvaluated = feedbackStatus === "correct" || feedbackStatus === "incorrect";

  // Check if user has provided an answer to enable the "CHECK" button
  const canCheckAnswer = () => {
    if (!currentAnswer || !currentExercise) return false;
    if (currentExercise.type === "translate_word_bank") {
      return Array.isArray(currentAnswer) && currentAnswer.length > 0;
    }
    if (currentExercise.type === "match_pairs") {
      const targetPairsCount = currentExercise.client_payload?.left_words?.length || 4;
      return Object.keys(currentAnswer).length >= targetPairsCount;
    }
    if (currentExercise.type === "type_the_answer") {
      return typeof currentAnswer === "string" && currentAnswer.trim().length > 0;
    }
    return true;
  };

  // Submit answer to backend (Backend Authoritative!)
  const handleCheck = async () => {
    if (!lessonData || !currentExercise) return;
    setFeedbackStatus("submitting");
    try {
      const res = await api.submitExercise(
        lessonId,
        currentExercise.id,
        lessonData.attempt_id,
        currentAnswer
      );

      setEvalResult(res);
      setHearts(res.hearts_remaining);

      if (res.is_correct) {
        playCorrectSound();
        setFeedbackStatus("correct");
        setComboStreak((prev) => prev + 1);
      } else {
        playIncorrectSound();
        playHeartLostSound();
        setFeedbackStatus("incorrect");
        setComboStreak(0);

        // Mistake re-queue: Duolingo re-queues missed exercises at the end of the lesson
        setLessonData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            exercises: [...prev.exercises, currentExercise],
          };
        });

        if (res.hearts_remaining <= 0) {
          setTimeout(() => setOutOfHeartsOpen(true), 600);
        }
      }
    } catch (err: any) {
      alert("Error submitting answer: " + err.message);
      setFeedbackStatus("idle");
    }
  };

  // Handle Skip (E8: counts as wrong, loses a heart, reveals solution, requeues exercise)
  const handleSkip = async () => {
    if (!lessonData || !currentExercise || feedbackStatus === "submitting" || isEvaluated) return;
    setFeedbackStatus("submitting");
    try {
      const res = await api.submitExercise(
        lessonId,
        currentExercise.id,
        lessonData.attempt_id,
        "__SKIPPED__"
      );
      setEvalResult(res);
      setHearts(res.hearts_remaining);
      playIncorrectSound();
      playHeartLostSound();
      setFeedbackStatus("incorrect");
      setComboStreak(0);

      // Requeue exercise at the end
      setLessonData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          exercises: [...prev.exercises, currentExercise],
        };
      });

      if (res.hearts_remaining <= 0) {
        setTimeout(() => setOutOfHeartsOpen(true), 600);
      }
    } catch (err: any) {
      alert("Error skipping exercise: " + err.message);
      setFeedbackStatus("idle");
    }
  };

  // Continue to next exercise or complete lesson
  const handleContinue = async () => {
    if (!lessonData) return;
    if (currentIndex + 1 < totalExercises) {
      setCurrentIndex((prev) => prev + 1);
      setCurrentAnswer(null);
      setFeedbackStatus("idle");
      setEvalResult(null);
    } else {
      try {
        const finalRes = await api.completeLesson(lessonId, lessonData.attempt_id);
        setCompleteResult(finalRes);
        if (typeof finalRes.gems === "number") {
          setGems(finalRes.gems);
          updateGems(finalRes.gems);
        }
      } catch (err: any) {
        alert("Error finalizing lesson: " + err.message);
        router.push("/learn");
      }
    }
  };

  // Keyboard shortcut: Enter key submits or continues (E7)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if loading, modal open or completed
      if (loading || !lessonData || completeResult || exitModalOpen || outOfHeartsOpen) return;

      if (e.key === "Enter") {
        if (isEvaluated) {
          handleContinue();
        } else if (canCheckAnswer() && feedbackStatus !== "submitting") {
          handleCheck();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [loading, lessonData, completeResult, exitModalOpen, outOfHeartsOpen, isEvaluated, feedbackStatus, currentAnswer, currentIndex]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px" }}>
        <img src="/mascot/duo-happy.svg" alt="Loading Duo" style={{ width: "90px", height: "90px", animation: "duoBounce 1s infinite" }} />
        <h2 style={{ fontSize: "20px", fontWeight: 800, color: "var(--duo-text)" }}>Loading lesson...</h2>
      </div>
    );
  }

  if (error || !lessonData || !lessonData.exercises.length || !currentExercise) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px", padding: "20px", textAlign: "center" }}>
        <img src="/mascot/duo-crying.svg" alt="Error Duo" style={{ width: "90px", height: "90px" }} />
        <h2 style={{ fontSize: "22px", fontWeight: 800, color: "var(--duo-red)" }}>Could not load lesson</h2>
        <p style={{ color: "var(--duo-text-muted)" }}>{error || "No exercises found for this lesson"}</p>
        <button onClick={() => router.push("/learn")} className="duo-btn duo-btn-blue" style={{ marginTop: "16px" }}>
          RETURN TO HOME
        </button>
      </div>
    );
  }

  // If lesson completed, show celebratory screen!
  if (completeResult) {
    return <LessonCompleteScreen result={completeResult} />;
  }

  // Progress Bar width calculation
  const progressPercent = Math.round(((currentIndex + (isEvaluated ? 1 : 0)) / totalExercises) * 100);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "var(--duo-canvas)" }}>
      {/* Top Header Bar */}
      <header
        style={{
          height: "72px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 28px",
          gap: "24px",
          maxWidth: "1000px",
          width: "100%",
          margin: "0 auto",
        }}
      >
        {/* Exit Chevron / Close button */}
        <button
          onClick={() => { playClickSound(); setExitModalOpen(true); }}
          style={{
            background: "transparent",
            border: "none",
            fontSize: "24px",
            color: "var(--duo-text-muted)",
            cursor: "pointer",
            fontWeight: 800,
          }}
        >
          ✕
        </button>

        {/* Lesson Progress Bar */}
        <div style={{ flex: 1, maxWidth: "680px" }}>
          <div className="duo-progress-track">
            <div className="duo-progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        {/* Hearts & Combo Indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          {comboStreak >= 3 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                padding: "4px 10px",
                borderRadius: "12px",
                backgroundColor: "var(--duo-yellow-bg)",
                border: "2px solid var(--duo-yellow)",
                fontSize: "12px",
                fontWeight: 900,
                color: "var(--duo-yellow-dark)",
                animation: "duoBounce 0.4s infinite alternate",
              }}
            >
              <span>🔥</span>
              <span>{comboStreak} IN A ROW!</span>
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 800, fontSize: "17px", color: "var(--duo-red)" }}>
            <img
              src="/icons/heart.svg"
              alt="Hearts"
              style={{ width: "26px", height: "26px" }}
              className={feedbackStatus === "incorrect" ? "anim-shake" : ""}
            />
            <span>{hearts}</span>
          </div>
        </div>
      </header>

      {/* Main Exercise Area */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px 20px 140px 20px",
          maxWidth: "800px",
          width: "100%",
          margin: "0 auto",
        }}
      >
        {currentExercise.type === "multiple_choice" && (
          <MultipleChoiceExercise
            exercise={currentExercise}
            selectedAnswer={currentAnswer}
            onSelectAnswer={(ans) => setCurrentAnswer(ans)}
            disabled={isEvaluated}
          />
        )}

        {currentExercise.type === "translate_word_bank" && (
          <TranslateWordBankExercise
            exercise={currentExercise}
            placedTokens={currentAnswer || []}
            onTokensChange={(tokens) => setCurrentAnswer(tokens)}
            disabled={isEvaluated}
          />
        )}

        {currentExercise.type === "match_pairs" && (
          <MatchPairsExercise
            exercise={currentExercise}
            matchedPairs={currentAnswer || {}}
            onPairsChange={(pairs) => setCurrentAnswer(pairs)}
            disabled={isEvaluated}
          />
        )}

        {currentExercise.type === "fill_in_the_blank" && (
          <FillInTheBlankExercise
            exercise={currentExercise}
            selectedOption={currentAnswer}
            onSelectOption={(opt) => setCurrentAnswer(opt)}
            disabled={isEvaluated}
          />
        )}

        {currentExercise.type === "type_the_answer" && (
          <TypeTheAnswerExercise
            exercise={currentExercise}
            answerText={currentAnswer || ""}
            onTextChange={(text) => setCurrentAnswer(text)}
            disabled={isEvaluated}
          />
        )}
      </main>

      {/* Bottom Feedback Bar */}
      <FeedbackBar
        status={feedbackStatus}
        canCheck={canCheckAnswer()}
        onCheck={handleCheck}
        onContinue={handleContinue}
        onSkip={handleSkip}
        correctSolution={evalResult?.correct_solution}
        explanation={evalResult?.explanation}
        comboStreak={comboStreak}
      />

      {/* Exit Modal */}
      <ExitModal isOpen={exitModalOpen} onClose={() => setExitModalOpen(false)} />

      {/* Out of Hearts Modal */}
      <OutOfHeartsModal
        isOpen={outOfHeartsOpen}
        gems={gems}
        onRefill={async () => {
          try {
            const res = await api.refillHearts();
            if (res.success) {
              setHearts(res.hearts);
              setGems(res.gems);
              updateGems(res.gems);
              setOutOfHeartsOpen(false);
            }
          } catch (e: any) {
            alert(e.message);
          }
        }}
      />
    </div>
  );
}
