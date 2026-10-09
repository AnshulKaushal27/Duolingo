"use client";

import React from "react";
import Link from "next/link";
import { playClickSound } from "@/lib/sound";

interface ExitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExitModal({ isOpen, onClose }: ExitModalProps) {
  if (!isOpen) return null;

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
        padding: "32px 24px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
        border: "2px solid var(--duo-border)",
        textAlign: "center",
      }}>
        <img
          src="/mascot/duo-crying.svg"
          alt="Duo sad"
          style={{ width: "96px", height: "96px", marginBottom: "16px" }}
        />

        <h3 style={{ fontSize: "22px", fontWeight: 800, color: "var(--duo-text)", marginBottom: "8px" }}>
          Wait, don't leave!
        </h3>

        <p style={{ color: "var(--duo-text-muted)", fontSize: "15px", marginBottom: "28px" }}>
          If you quit now, you will lose your progress in this lesson.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <button
            onClick={() => { playClickSound(); onClose(); }}
            className="duo-btn duo-btn-blue"
            style={{ width: "100%", padding: "14px 20px" }}
          >
            KEEP LEARNING
          </button>

          <Link
            href="/learn"
            onClick={() => playClickSound()}
            className="duo-btn duo-btn-outline"
            style={{ width: "100%", padding: "14px 20px", color: "var(--duo-red)" }}
          >
            QUIT LESSON
          </Link>
        </div>
      </div>
    </div>
  );
}
