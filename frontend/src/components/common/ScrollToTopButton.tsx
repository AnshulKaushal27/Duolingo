"use client";

import React, { useState, useEffect } from "react";
import { playClickSound } from "@/lib/sound";

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 280);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    playClickSound();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      title="Scroll to top"
      className="duo-scroll-top-btn"
      style={{
        position: "fixed",
        bottom: "32px",
        right: "392px",
        zIndex: 45,
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        backgroundColor: "var(--duo-surface)",
        border: "2px solid var(--duo-border)",
        borderBottom: "5px solid var(--duo-border-dark)",
        color: "var(--duo-text)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        boxShadow: "0 8px 22px rgba(0, 0, 0, 0.28)",
        opacity: visible ? 1 : 0,
        transform: visible ? "scale(1)" : "scale(0.7)",
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity 0.25s ease, transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.15s ease",
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = "scale(0.92) translateY(2px)";
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = "scale(1) translateY(0)";
      }}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </button>
  );
}
