"use client";

import React, { useState } from "react";
import { api } from "@/lib/api";
import { playCorrectSound, playClickSound } from "@/lib/sound";

interface JumpAheadModalProps {
  unitId: number;
  unitNumber: number;
  unitTitle: string;
  onSuccess: () => void;
  onClose: () => void;
}

export default function JumpAheadModal({
  unitId,
  unitNumber,
  unitTitle,
  onSuccess,
  onClose,
}: JumpAheadModalProps) {
  const [loading, setLoading] = useState(false);

  const handleJump = async () => {
    try {
      setLoading(true);
      playCorrectSound();
      await api.jumpAhead(unitId);
      onSuccess();
    } catch (err: any) {
      console.error("Jump ahead failed", err);
      alert(err.message || "Failed to jump ahead.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
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
          maxWidth: "440px",
          backgroundColor: "#ffffff",
          borderRadius: "24px",
          padding: "32px 28px",
          textAlign: "center",
          boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "18px",
          animation: "duoBounce 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        <img
          src="/mascot/duo-celebrate.svg"
          alt="Jump Ahead"
          style={{ width: "90px", height: "90px" }}
        />

        <div>
          <span
            style={{
              fontSize: "12px",
              fontWeight: 900,
              color: "var(--duo-blue)",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Placement Jump
          </span>
          <h2
            style={{
              fontSize: "22px",
              fontWeight: 900,
              color: "var(--duo-text-dark)",
              margin: "6px 0",
            }}
          >
            Jump to Unit {unitNumber}?
          </h2>
          <p
            style={{
              fontSize: "15px",
              color: "var(--duo-text-muted)",
              lineHeight: 1.4,
            }}
          >
            {unitTitle}
          </p>
          <p
            style={{
              fontSize: "13px",
              color: "var(--duo-text-muted)",
              marginTop: "8px",
            }}
          >
            Skipping ahead will mark all previous units as completed and award you +50 bonus XP!
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", marginTop: "6px" }}>
          <button
            onClick={handleJump}
            disabled={loading}
            className="duo-btn duo-btn-green"
            style={{
              height: "48px",
              fontSize: "15px",
              fontWeight: 800,
            }}
          >
            {loading ? "JUMPING..." : `JUMP TO UNIT ${unitNumber}`}
          </button>

          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="duo-btn duo-btn-outline"
            style={{
              height: "48px",
              fontSize: "15px",
              fontWeight: 800,
            }}
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
}
