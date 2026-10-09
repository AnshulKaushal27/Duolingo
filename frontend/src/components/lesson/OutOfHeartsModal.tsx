"use client";

import React from "react";
import Link from "next/link";
import { playClickSound } from "@/lib/sound";

interface OutOfHeartsModalProps {
  isOpen: boolean;
  onRefill: () => void;
  gems: number;
}

export default function OutOfHeartsModal({ isOpen, onRefill, gems }: OutOfHeartsModalProps) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0,0,0,0.65)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 100,
      backdropFilter: "blur(3px)",
    }}>
      <div style={{
        width: "390px",
        backgroundColor: "var(--duo-canvas)",
        borderRadius: "24px",
        padding: "36px 28px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
        border: "2px solid var(--duo-border)",
        textAlign: "center",
      }} className="anim-shake">
        <img
          src="/mascot/duo-crying.svg"
          alt="Out of Hearts"
          style={{ width: "110px", height: "110px", marginBottom: "16px" }}
        />

        <h3 style={{ fontSize: "24px", fontWeight: 900, color: "var(--duo-red)", marginBottom: "8px" }}>
          You ran out of hearts!
        </h3>

        <p style={{ color: "var(--duo-text-muted)", fontSize: "15px", marginBottom: "28px" }}>
          You made several mistakes and need hearts to continue this lesson. Refill now with gems or return to practice.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {gems >= 350 ? (
            <button
              onClick={() => { playClickSound(); onRefill(); }}
              className="duo-btn duo-btn-blue"
              style={{ width: "100%", justifyContent: "space-between", padding: "16px 20px" }}
            >
              <span>REFILL HEARTS</span>
              <span>💎 350 GEMS</span>
            </button>
          ) : (
            <div style={{ color: "var(--duo-red)", fontSize: "14px", fontWeight: 700 }}>
              Not enough gems to refill (have: {gems}, need: 350)
            </div>
          )}

          <Link
            href="/learn"
            onClick={() => playClickSound()}
            className="duo-btn duo-btn-outline"
            style={{ width: "100%", padding: "14px 20px" }}
          >
            END LESSON
          </Link>
        </div>
      </div>
    </div>
  );
}
