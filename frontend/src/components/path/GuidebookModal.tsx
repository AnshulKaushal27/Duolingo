"use client";

import React, { useState, useEffect, useCallback } from "react";
import { api, GuidebookData } from "@/lib/api";
import { playClickSound } from "@/lib/sound";
import { speakText } from "@/lib/speech";

interface GuidebookModalProps {
  unitId: number;
  unitTitle: string;
  unitColor: string;
  courseCode?: string;
  onClose: () => void;
}

const SPEECH_LANG_MAP: Record<string, string> = {
  es: "es-ES",
  ja: "ja-JP",
  fr: "fr-FR",
  de: "de-DE",
  it: "it-IT",
  pt: "pt-BR",
  en: "en-US",
  hi: "hi-IN",
  zh: "zh-CN",
  ko: "ko-KR",
  chess: "en-US",
};

const COURSE_FLAG_MAP: Record<string, string> = {
  es: "🇪🇸",
  ja: "🇯🇵",
  fr: "🇫🇷",
  de: "🇩🇪",
  it: "🇮🇹",
  pt: "🇧🇷",
  en: "🇺🇸",
  hi: "🇮🇳",
  zh: "🇨🇳",
  ko: "🇰🇷",
  chess: "♟️",
};

export default function GuidebookModal({
  unitId,
  unitTitle,
  unitColor,
  courseCode = "es",
  onClose,
}: GuidebookModalProps) {
  const [data, setData] = useState<GuidebookData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "phrases" | "grammar">("all");
  const [playingPhrase, setPlayingPhrase] = useState<string | null>(null);

  const effectiveCourseCode = (data?.course_code || courseCode || "es").toLowerCase();
  const speechLang = SPEECH_LANG_MAP[effectiveCourseCode] || "es-ES";
  const flagIcon = COURSE_FLAG_MAP[effectiveCourseCode] || "📖";

  useEffect(() => {
    let isCancelled = false;
    async function load() {
      try {
        setLoading(true);
        const res = await api.getGuidebook(unitId);
        if (!isCancelled) {
          setData(res);
        }
      } catch (err) {
        console.error("Failed to load guidebook", err);
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }
    load();

    return () => {
      isCancelled = true;
    };
  }, [unitId]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const speak = useCallback(
    (text: string) => {
      if (!text) return;
      playClickSound();
      setPlayingPhrase(text);
      speakText(text, speechLang, 0.88);
      setTimeout(() => {
        setPlayingPhrase(null);
      }, 1500);
    },
    [speechLang]
  );

  // Helper to extract non-English target phrase from examples of ANY language
  const extractTargetText = (ex: Record<string, string>): { target: string; en: string } => {
    const en = ex.en || ex.translation || "";
    const target =
      ex[effectiveCourseCode] ||
      ex.target ||
      ex.phrase ||
      ex.ja ||
      ex.es ||
      ex.fr ||
      ex.de ||
      ex.chess ||
      Object.entries(ex).find(([k]) => k !== "en" && k !== "translation")?.[1] ||
      "";
    return { target, en };
  };

  const phrasesCount = data?.key_phrases?.length || 0;
  const grammarCount = data?.grammar_tips?.length || 0;

  const showPhrases = activeTab === "all" || activeTab === "phrases";
  const showGrammar = activeTab === "all" || activeTab === "grammar";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.65)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          playClickSound();
          onClose();
        }
      }}
    >
      <div
        className="duo-guidebook-card"
        style={{
          width: "100%",
          maxWidth: "680px",
          maxHeight: "88vh",
          backgroundColor: "var(--duo-modal-bg, var(--duo-surface))",
          borderRadius: "28px",
          border: "2px solid var(--duo-border)",
          boxShadow: "0 24px 60px rgba(0, 0, 0, 0.35)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          animation: "duoBounce 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        {/* ===================================================================
            HEADER: Tactile Theme Banner with Course Badge & Clean Title
            =================================================================== */}
        <div
          style={{
            backgroundColor: unitColor || "var(--duo-green)",
            padding: "24px 28px",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
            borderBottom: "4px solid rgba(0, 0, 0, 0.15)",
            flexShrink: 0,
          }}
        >
          <div style={{ flex: 1, paddingRight: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <span style={{ fontSize: "18px" }}>{flagIcon}</span>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  backgroundColor: "rgba(0, 0, 0, 0.2)",
                  padding: "4px 10px",
                  borderRadius: "10px",
                }}
              >
                Unit {data?.unit_number || unitId} Guidebook
              </span>
            </div>
            <h2
              style={{
                fontSize: "24px",
                fontWeight: 900,
                margin: "2px 0 0 0",
                lineHeight: 1.2,
                letterSpacing: "-0.4px",
                textShadow: "0 2px 4px rgba(0,0,0,0.15)",
              }}
            >
              {data?.title || unitTitle}
            </h2>
            {data?.description && (
              <p
                style={{
                  fontSize: "13.5px",
                  opacity: 0.92,
                  margin: "6px 0 0 0",
                  fontWeight: 600,
                  lineHeight: 1.4,
                }}
              >
                {data.description}
              </p>
            )}
          </div>

          {/* Close button with tactile Duolingo styling */}
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            title="Close Guidebook (Esc)"
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              backgroundColor: "rgba(255, 255, 255, 0.22)",
              border: "2px solid rgba(255, 255, 255, 0.35)",
              borderBottom: "4px solid rgba(0, 0, 0, 0.2)",
              color: "#ffffff",
              fontSize: "18px",
              fontWeight: 900,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "transform 0.1s ease, background-color 0.15s ease",
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = "translateY(2px)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.35)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.22)")}
          >
            ✕
          </button>
        </div>

        {/* ===================================================================
            CATEGORY TABS: Segmented Pill Filter
            =================================================================== */}
        {!loading && (phrasesCount > 0 || grammarCount > 0) && (
          <div
            className="no-scrollbar"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "14px 28px",
              backgroundColor: "var(--duo-surface)",
              borderBottom: "2px solid var(--duo-border)",
              flexShrink: 0,
              minHeight: "fit-content",
              overflowX: "auto",
              overflowY: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            <button
              onClick={() => {
                playClickSound();
                setActiveTab("all");
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                height: "38px",
                borderRadius: "14px",
                border: `2px solid ${activeTab === "all" ? "var(--duo-blue)" : "var(--duo-border)"}`,
                borderBottom: `4px solid ${activeTab === "all" ? "var(--duo-blue-dark)" : "var(--duo-border-dark)"}`,
                backgroundColor: activeTab === "all" ? "var(--duo-blue-bg)" : "var(--duo-card-bg)",
                color: activeTab === "all" ? "var(--duo-blue-dark)" : "var(--duo-text)",
                fontWeight: 800,
                fontSize: "13px",
                cursor: "pointer",
                transition: "all 0.1s ease",
                whiteSpace: "nowrap",
                lineHeight: 1,
                boxSizing: "border-box",
                flexShrink: 0,
              }}
            >
              <span>📖</span>
              <span>All Notes</span>
            </button>

            {phrasesCount > 0 && (
              <button
                onClick={() => {
                  playClickSound();
                  setActiveTab("phrases");
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 16px",
                  height: "38px",
                  borderRadius: "14px",
                  border: `2px solid ${activeTab === "phrases" ? "var(--duo-blue)" : "var(--duo-border)"}`,
                  borderBottom: `4px solid ${activeTab === "phrases" ? "var(--duo-blue-dark)" : "var(--duo-border-dark)"}`,
                  backgroundColor: activeTab === "phrases" ? "var(--duo-blue-bg)" : "var(--duo-card-bg)",
                  color: activeTab === "phrases" ? "var(--duo-blue-dark)" : "var(--duo-text)",
                  fontWeight: 800,
                  fontSize: "13px",
                  cursor: "pointer",
                  transition: "all 0.1s ease",
                  whiteSpace: "nowrap",
                  lineHeight: 1,
                  boxSizing: "border-box",
                  flexShrink: 0,
                }}
              >
                <span>💬</span>
                <span>Key Phrases</span>
                <span
                  style={{
                    backgroundColor: activeTab === "phrases" ? "var(--duo-blue)" : "var(--duo-border)",
                    color: activeTab === "phrases" ? "#ffffff" : "var(--duo-text-muted)",
                    fontSize: "11px",
                    fontWeight: 900,
                    padding: "2px 7px",
                    borderRadius: "8px",
                    lineHeight: 1.2,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {phrasesCount}
                </span>
              </button>
            )}

            {grammarCount > 0 && (
              <button
                onClick={() => {
                  playClickSound();
                  setActiveTab("grammar");
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 16px",
                  height: "38px",
                  borderRadius: "14px",
                  border: `2px solid ${activeTab === "grammar" ? "var(--duo-blue)" : "var(--duo-border)"}`,
                  borderBottom: `4px solid ${activeTab === "grammar" ? "var(--duo-blue-dark)" : "var(--duo-border-dark)"}`,
                  backgroundColor: activeTab === "grammar" ? "var(--duo-blue-bg)" : "var(--duo-card-bg)",
                  color: activeTab === "grammar" ? "var(--duo-blue-dark)" : "var(--duo-text)",
                  fontWeight: 800,
                  fontSize: "13px",
                  cursor: "pointer",
                  transition: "all 0.1s ease",
                  whiteSpace: "nowrap",
                  lineHeight: 1,
                  boxSizing: "border-box",
                  flexShrink: 0,
                }}
              >
                <span>💡</span>
                <span>Grammar & Culture</span>
                <span
                  style={{
                    backgroundColor: activeTab === "grammar" ? "var(--duo-blue)" : "var(--duo-border)",
                    color: activeTab === "grammar" ? "#ffffff" : "var(--duo-text-muted)",
                    fontSize: "11px",
                    fontWeight: 900,
                    padding: "2px 7px",
                    borderRadius: "8px",
                    lineHeight: 1.2,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {grammarCount}
                </span>
              </button>
            )}
          </div>
        )}

        {/* ===================================================================
            SCROLLABLE CONTENT: High Contrast, Multi-Language, Accessible
            =================================================================== */}
        <div
          className="duo-scrollbar"
          style={{
            padding: "24px 28px",
            overflowY: "auto",
            flex: "1 1 auto",
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            gap: "28px",
            backgroundColor: "var(--duo-modal-bg, var(--duo-surface))",
          }}
        >
          {loading ? (
            /* Smooth Pulsing Skeleton Loader */
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div
                style={{
                  height: "24px",
                  width: "160px",
                  backgroundColor: "var(--duo-border)",
                  borderRadius: "8px",
                  opacity: 0.6,
                }}
              />
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  style={{
                    padding: "18px",
                    borderRadius: "18px",
                    border: "2px solid var(--duo-border)",
                    backgroundColor: "var(--duo-card-bg)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "16px",
                  }}
                >
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div
                      style={{
                        height: "18px",
                        width: "60%",
                        backgroundColor: "var(--duo-border)",
                        borderRadius: "6px",
                      }}
                    />
                    <div
                      style={{
                        height: "14px",
                        width: "40%",
                        backgroundColor: "var(--duo-border)",
                        borderRadius: "6px",
                        opacity: 0.7,
                      }}
                    />
                  </div>
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "14px",
                      backgroundColor: "var(--duo-border)",
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* SECTION 1: KEY PHRASES */}
              {showPhrases && data?.key_phrases && data.key_phrases.length > 0 && (
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "14px",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "18px",
                        fontWeight: 900,
                        color: "var(--duo-text-dark)",
                        margin: 0,
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        letterSpacing: "-0.2px",
                      }}
                    >
                      <span>💬</span> Key Phrases to Know
                    </h3>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--duo-text-muted)" }}>
                      Tap 🔊 to hear native audio
                    </span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {data.key_phrases.map((phrase, idx) => {
                      const isPlaying = playingPhrase === phrase.phrase;
                      return (
                        <div
                          key={idx}
                          style={{
                            padding: "16px 20px",
                            borderRadius: "18px",
                            border: "2px solid var(--duo-border)",
                            borderBottom: "4px solid var(--duo-border-dark)",
                            backgroundColor: "var(--duo-card-bg)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "16px",
                            transition: "transform 0.1s ease, border-color 0.15s ease",
                          }}
                        >
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                              <span
                                style={{
                                  fontSize: "17px",
                                  fontWeight: 800,
                                  color: "var(--duo-text-dark)",
                                  lineHeight: 1.3,
                                }}
                              >
                                {phrase.phrase}
                              </span>
                            </div>

                            <span
                              style={{
                                fontSize: "14px",
                                fontWeight: 700,
                                color: "var(--duo-text-muted)",
                                display: "block",
                                marginTop: "3px",
                                lineHeight: 1.3,
                              }}
                            >
                              {phrase.translation}
                            </span>

                            {phrase.pronunciation && (
                              <div
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "6px",
                                  marginTop: "6px",
                                  padding: "3px 8px",
                                  borderRadius: "8px",
                                  backgroundColor: "var(--duo-surface)",
                                  border: "1px solid var(--duo-border)",
                                }}
                              >
                                <span style={{ fontSize: "11px", color: "var(--duo-blue)", fontWeight: 800 }}>
                                  🗣️ {phrase.pronunciation}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* 3D Tactile Speaker Button */}
                          <button
                            onClick={() => speak(phrase.phrase)}
                            title="Listen to native pronunciation"
                            style={{
                              width: "46px",
                              height: "46px",
                              borderRadius: "14px",
                              border: "2px solid var(--duo-blue)",
                              borderBottom: isPlaying ? "2px solid var(--duo-blue-dark)" : "4px solid var(--duo-blue-dark)",
                              backgroundColor: isPlaying ? "var(--duo-blue)" : "var(--duo-surface)",
                              color: isPlaying ? "#ffffff" : "var(--duo-blue)",
                              fontSize: "19px",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                              transform: isPlaying ? "translateY(2px)" : "translateY(0)",
                              transition: "transform 0.1s ease, background-color 0.15s ease, color 0.15s ease",
                            }}
                            onMouseDown={(e) => {
                              e.currentTarget.style.transform = "translateY(2px)";
                              e.currentTarget.style.borderBottomWidth = "2px";
                            }}
                            onMouseUp={(e) => {
                              if (!isPlaying) {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.borderBottomWidth = "4px";
                              }
                            }}
                          >
                            🔊
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SECTION 2: GRAMMAR & CULTURE TIPS */}
              {showGrammar && data?.grammar_tips && data.grammar_tips.length > 0 && (
                <div>
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: 900,
                      color: "var(--duo-text-dark)",
                      marginBottom: "14px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      letterSpacing: "-0.2px",
                    }}
                  >
                    <span>💡</span> Grammar & Culture Tips
                  </h3>

                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {data.grammar_tips.map((tip, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: "20px 22px",
                          borderRadius: "20px",
                          border: "2px solid var(--duo-border)",
                          borderBottom: "4px solid var(--duo-border-dark)",
                          backgroundColor: "var(--duo-card-bg)",
                          display: "flex",
                          flexDirection: "column",
                          gap: "12px",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                          <span
                            style={{
                              fontSize: "12px",
                              fontWeight: 900,
                              color: "var(--duo-yellow-dark)",
                              backgroundColor: "var(--duo-yellow-bg)",
                              padding: "4px 8px",
                              borderRadius: "8px",
                              letterSpacing: "0.5px",
                              textTransform: "uppercase",
                              flexShrink: 0,
                            }}
                          >
                            TIP {idx + 1}
                          </span>
                          <h4
                            style={{
                              fontSize: "17px",
                              fontWeight: 900,
                              color: "var(--duo-text-dark)",
                              margin: 0,
                              lineHeight: 1.3,
                            }}
                          >
                            {tip.title}
                          </h4>
                        </div>

                        <p
                          style={{
                            fontSize: "14.5px",
                            color: "var(--duo-text)",
                            lineHeight: 1.6,
                            margin: 0,
                            fontWeight: 600,
                          }}
                        >
                          {tip.explanation}
                        </p>

                        {/* Interactive Examples Box for All Languages */}
                        {tip.examples && tip.examples.length > 0 && (
                          <div
                            style={{
                              marginTop: "4px",
                              backgroundColor: "var(--duo-surface)",
                              padding: "14px 18px",
                              borderRadius: "16px",
                              border: "1.5px solid var(--duo-border)",
                              display: "flex",
                              flexDirection: "column",
                              gap: "10px",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "11px",
                                fontWeight: 900,
                                textTransform: "uppercase",
                                letterSpacing: "0.8px",
                                color: "var(--duo-text-muted)",
                              }}
                            >
                              Examples
                            </span>

                            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                              {tip.examples.map((ex, exIdx) => {
                                const { target, en } = extractTargetText(ex);
                                return (
                                  <div
                                    key={exIdx}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                      gap: "12px",
                                      padding: "6px 0",
                                      borderBottom:
                                        exIdx < tip.examples.length - 1
                                          ? "1px solid var(--duo-border)"
                                          : "none",
                                    }}
                                  >
                                    <div style={{ flex: 1 }}>
                                      <span
                                        style={{
                                          fontSize: "15px",
                                          fontWeight: 800,
                                          color: "var(--duo-text-dark)",
                                          display: "block",
                                        }}
                                      >
                                        {target}
                                      </span>
                                      {en && (
                                        <span
                                          style={{
                                            fontSize: "13px",
                                            fontWeight: 700,
                                            color: "var(--duo-text-muted)",
                                            display: "block",
                                            marginTop: "2px",
                                          }}
                                        >
                                          {en}
                                        </span>
                                      )}
                                    </div>

                                    {target && (
                                      <button
                                        onClick={() => speak(target)}
                                        title="Hear example pronunciation"
                                        style={{
                                          width: "32px",
                                          height: "32px",
                                          borderRadius: "10px",
                                          border: "1.5px solid var(--duo-border)",
                                          backgroundColor: "var(--duo-card-bg)",
                                          cursor: "pointer",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          fontSize: "14px",
                                          flexShrink: 0,
                                          transition: "all 0.1s ease",
                                        }}
                                        onMouseEnter={(e) => {
                                          e.currentTarget.style.borderColor = "var(--duo-blue)";
                                          e.currentTarget.style.backgroundColor = "var(--duo-blue-bg)";
                                        }}
                                        onMouseLeave={(e) => {
                                          e.currentTarget.style.borderColor = "var(--duo-border)";
                                          e.currentTarget.style.backgroundColor = "var(--duo-card-bg)";
                                        }}
                                      >
                                        🔊
                                      </button>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Empty state if both key phrases and grammar tips are empty */}
              {phrasesCount === 0 && grammarCount === 0 && (
                <div style={{ textAlign: "center", padding: "48px 16px", color: "var(--duo-text-muted)" }}>
                  <div style={{ fontSize: "40px", marginBottom: "12px" }}>🦉</div>
                  <div style={{ fontSize: "16px", fontWeight: 800, color: "var(--duo-text-dark)" }}>
                    No notes yet for this unit
                  </div>
                  <div style={{ fontSize: "13px", fontWeight: 600, marginTop: "4px" }}>
                    Check back soon as more content is added!
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* ===================================================================
            FOOTER: Tactile Duolingo Action Bar
            =================================================================== */}
        <div
          style={{
            padding: "18px 28px",
            borderTop: "2px solid var(--duo-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "var(--duo-surface)",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--duo-text-muted)" }}>
            Tip: Review guidebooks before tough lessons!
          </span>

          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="duo-btn duo-btn-green"
            style={{
              padding: "12px 32px",
              fontSize: "15px",
              fontWeight: 900,
              letterSpacing: "0.8px",
              textTransform: "uppercase",
              borderRadius: "16px",
            }}
          >
            GOT IT
          </button>
        </div>
      </div>
    </div>
  );
}
