"use client";

import React, { useState } from "react";
import { api } from "@/lib/api";
import { playClickSound, playCorrectSound } from "@/lib/sound";

interface HeartsModalProps {
  isOpen: boolean;
  onClose: () => void;
  hearts: number;
  gems: number;
  onHeartsUpdated: (newHearts: number, newGems: number) => void;
}

export default function HeartsModal({
  isOpen,
  onClose,
  hearts,
  gems,
  onHeartsUpdated,
}: HeartsModalProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRefill = async () => {
    playClickSound();
    setLoading(true);
    setMessage(null);
    try {
      const res = await api.refillHearts();
      if (res.success) {
        playCorrectSound();
        onHeartsUpdated(res.hearts, res.gems);
        setMessage("Hearts fully refilled! ❤️❤️❤️❤️❤️");
        setTimeout(() => onClose(), 1200);
      } else {
        setMessage(res.message);
      }
    } catch (err: any) {
      setMessage(err.message || "Failed to refill hearts");
    } finally {
      setLoading(false);
    }
  };

  const handlePractice = async () => {
    playClickSound();
    setLoading(true);
    setMessage(null);
    try {
      const res = await api.practiceHeart();
      if (res.success) {
        playCorrectSound();
        onHeartsUpdated(res.hearts, res.gems);
        setMessage("+1 Heart gained from practice! ❤️");
        setTimeout(() => onClose(), 1200);
      } else {
        setMessage(res.message);
      }
    } catch (err: any) {
      setMessage(err.message || "Failed to practice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 100,
      backdropFilter: "blur(2px)",
    }}>
      <div style={{
        width: "380px",
        backgroundColor: "var(--duo-canvas)",
        borderRadius: "24px",
        padding: "28px 24px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
        border: "2px solid var(--duo-border)",
        textAlign: "center",
        position: "relative",
      }}>
        {/* Close Button */}
        <button
          onClick={() => { playClickSound(); onClose(); }}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "transparent",
            border: "none",
            fontSize: "20px",
            cursor: "pointer",
            color: "var(--duo-text-muted)",
          }}
        >
          ✕
        </button>

        {/* Hearts graphic */}
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", margin: "16px 0" }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <img
              key={i}
              src="/icons/heart.svg"
              alt="Heart"
              style={{
                width: "36px",
                height: "36px",
                opacity: i <= hearts ? 1 : 0.25,
                transform: i <= hearts ? "scale(1)" : "scale(0.85)",
                transition: "all 0.2s ease",
              }}
            />
          ))}
        </div>

        <h3 style={{ fontSize: "22px", fontWeight: 800, color: "var(--duo-text)" }}>
          {hearts === 5 ? "You have full hearts!" : `${hearts} / 5 Hearts`}
        </h3>

        {hearts < 5 && (
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            backgroundColor: "var(--duo-surface)",
            padding: "6px 14px",
            borderRadius: "20px",
            fontSize: "13px",
            fontWeight: 800,
            color: "var(--duo-red)",
            marginTop: "6px",
            border: "1px solid var(--duo-border)",
          }}>
            <span>⏳</span>
            <span>Regenerates 1 heart every hour automatically</span>
          </div>
        )}

        <p style={{ color: "var(--duo-text-muted)", fontSize: "15px", margin: "12px 0 20px 0" }}>
          Hearts keep your lesson active. Make mistakes and you lose hearts. Practice or refill to keep going!
        </p>

        {message && (
          <div style={{
            padding: "10px",
            borderRadius: "10px",
            backgroundColor: "var(--duo-surface)",
            color: "var(--duo-text)",
            fontWeight: 700,
            fontSize: "14px",
            marginBottom: "16px",
          }}>
            {message}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {/* Refill Button */}
          <button
            onClick={handleRefill}
            disabled={loading || hearts >= 5 || gems < 350}
            className="duo-btn duo-btn-blue"
            style={{ width: "100%", justifyContent: "space-between", padding: "14px 20px" }}
          >
            <span>Refill Hearts</span>
            <span>💎 350 Gems</span>
          </button>

          {/* Practice to earn 1 heart */}
          <button
            onClick={handlePractice}
            disabled={loading || hearts >= 5}
            className="duo-btn duo-btn-green"
            style={{ width: "100%", padding: "14px 20px" }}
          >
            Practice to Earn 1 Heart
          </button>

          {/* Close */}
          <button
            onClick={() => { playClickSound(); onClose(); }}
            className="duo-btn duo-btn-outline"
            style={{ width: "100%", padding: "12px 20px" }}
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}
