"use client";

import React, { useState, useEffect } from "react";
import { api, GuidebookData } from "@/lib/api";
import { playClickSound } from "@/lib/sound";
import { speakText } from "@/lib/speech";

interface GuidebookModalProps {
  unitId: number;
  unitTitle: string;
  unitColor: string;
  onClose: () => void;
}

export default function GuidebookModal({
  unitId,
  unitTitle,
  unitColor,
  onClose,
}: GuidebookModalProps) {
  const [data, setData] = useState<GuidebookData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await api.getGuidebook(unitId);
        setData(res);
      } catch (err) {
        console.error("Failed to load guidebook", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [unitId]);

  const speak = (text: string) => {
    speakText(text);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.55)",
        backdropFilter: "blur(4px)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "640px",
          maxHeight: "85vh",
          backgroundColor: "#ffffff",
          borderRadius: "24px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          animation: "duoBounce 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        {/* Unit Color Header */}
        <div
          style={{
            backgroundColor: unitColor || "var(--duo-green)",
            padding: "24px 28px",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "1px",
                opacity: 0.9,
              }}
            >
              Unit Guidebook
            </span>
            <h2 style={{ fontSize: "22px", fontWeight: 800, margin: "4px 0 0 0" }}>
              {data?.title || unitTitle}
            </h2>
          </div>

          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.25)",
              border: "none",
              color: "#ffffff",
              fontSize: "18px",
              fontWeight: 800,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content */}
        <div
          style={{
            padding: "24px 28px",
            overflowY: "auto",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "28px",
          }}
        >
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <p style={{ fontWeight: 800, color: "var(--duo-text-muted)" }}>
                Loading guidebook notes...
              </p>
            </div>
          ) : (
            <>
              {/* Section 1: Key Phrases */}
              <div>
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: 800,
                    color: "var(--duo-text-dark)",
                    marginBottom: "14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span>💬</span> Key Phrases
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {data?.key_phrases.map((phrase, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: "14px 18px",
                        borderRadius: "16px",
                        border: "2px solid var(--duo-border)",
                        backgroundColor: "var(--duo-canvas)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "12px",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span
                            style={{
                              fontSize: "16px",
                              fontWeight: 800,
                              color: "var(--duo-text-dark)",
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
                            marginTop: "2px",
                          }}
                        >
                          {phrase.translation}
                        </span>
                        {phrase.pronunciation && (
                          <span
                            style={{
                              fontSize: "12px",
                              color: "var(--duo-blue)",
                              fontWeight: 700,
                              fontStyle: "italic",
                              marginTop: "2px",
                              display: "block",
                            }}
                          >
                            🗣️ {phrase.pronunciation}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => speak(phrase.phrase)}
                        title="Listen to pronunciation"
                        style={{
                          width: "42px",
                          height: "42px",
                          borderRadius: "12px",
                          border: "2px solid var(--duo-blue)",
                          borderBottom: "4px solid var(--duo-blue-dark)",
                          backgroundColor: "#ffffff",
                          color: "var(--duo-blue)",
                          fontSize: "18px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        🔊
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 2: Grammar Tips */}
              <div>
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: 800,
                    color: "var(--duo-text-dark)",
                    marginBottom: "14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span>💡</span> Grammar Notes & Tips
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {data?.grammar_tips.map((tip, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: "16px 20px",
                        borderRadius: "18px",
                        border: "2px solid var(--duo-border)",
                        backgroundColor: "#ffffff",
                      }}
                    >
                      <h4
                        style={{
                          fontSize: "16px",
                          fontWeight: 800,
                          color: "var(--duo-text-dark)",
                          marginBottom: "6px",
                        }}
                      >
                        {tip.title}
                      </h4>
                      <p
                        style={{
                          fontSize: "14px",
                          color: "var(--duo-text-muted)",
                          lineHeight: 1.5,
                          marginBottom: "12px",
                        }}
                      >
                        {tip.explanation}
                      </p>

                      {tip.examples && tip.examples.length > 0 && (
                        <div
                          style={{
                            backgroundColor: "var(--duo-canvas)",
                            padding: "10px 14px",
                            borderRadius: "12px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "6px",
                          }}
                        >
                          {tip.examples.map((ex, exIdx) => (
                            <div
                              key={exIdx}
                              style={{
                                fontSize: "13px",
                                display: "flex",
                                justifyContent: "space-between",
                                gap: "10px",
                              }}
                            >
                              <span style={{ fontWeight: 800, color: "var(--duo-text-dark)" }}>
                                {ex.ja || ex.es}
                              </span>
                              <span style={{ color: "var(--duo-text-muted)", fontWeight: 700 }}>
                                {ex.en}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "16px 28px",
            borderTop: "2px solid var(--duo-border)",
            display: "flex",
            justifyContent: "flex-end",
            backgroundColor: "#ffffff",
          }}
        >
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="duo-btn duo-btn-green"
            style={{
              padding: "12px 28px",
              fontSize: "15px",
              fontWeight: 800,
            }}
          >
            GOT IT
          </button>
        </div>
      </div>
    </div>
  );
}
