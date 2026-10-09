"use client";

import React from "react";

interface TypewriterBubbleProps {
  text: string;
  arrowDirection?: "left" | "bottom";
}

export default function TypewriterBubble({
  text,
  arrowDirection = "left",
}: TypewriterBubbleProps) {
  return (
    <div
      style={{
        position: "relative",
        backgroundColor: "#202f36",
        border: "2px solid #37464f",
        borderRadius: "16px",
        padding: "14px 22px",
        fontSize: "19px",
        fontWeight: 700,
        color: "#ffffff",
        letterSpacing: "-0.2px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)",
        display: "inline-flex",
        alignItems: "center",
        lineHeight: 1.35,
        animation: "bubbleFadeIn 0.2s ease-out",
      }}
    >
      <span>{text}</span>

      {/* Pointer Arrow pointing to the left towards Duo */}
      {arrowDirection === "left" && (
        <>
          <div
            style={{
              position: "absolute",
              left: "-11px",
              top: "50%",
              transform: "translateY(-50%)",
              width: 0,
              height: 0,
              borderTop: "8px solid transparent",
              borderBottom: "8px solid transparent",
              borderRight: "11px solid #37464f",
              zIndex: 1,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "-8px",
              top: "50%",
              transform: "translateY(-50%)",
              width: 0,
              height: 0,
              borderTop: "6px solid transparent",
              borderBottom: "6px solid transparent",
              borderRight: "9px solid #202f36",
              zIndex: 2,
            }}
          />
        </>
      )}

      {/* Pointer Arrow pointing downwards towards Duo */}
      {arrowDirection === "bottom" && (
        <>
          <div
            style={{
              position: "absolute",
              bottom: "-11px",
              left: "50%",
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "10px solid transparent",
              borderRight: "10px solid transparent",
              borderTop: "10px solid #37464f",
              zIndex: 1,
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-8px",
              left: "50%",
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "8px solid transparent",
              borderRight: "8px solid transparent",
              borderTop: "8px solid #202f36",
              zIndex: 2,
            }}
          />
        </>
      )}
    </div>
  );
}
