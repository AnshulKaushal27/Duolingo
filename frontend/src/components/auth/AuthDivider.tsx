"use client";

import React from "react";

export default function AuthDivider({ text = "OR" }: { text?: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        margin: "18px 0",
        gap: "14px",
      }}
    >
      <div
        style={{
          flex: 1,
          height: "2px",
          backgroundColor: "var(--duo-border)",
        }}
      />
      <span
        style={{
          fontSize: "13px",
          fontWeight: 800,
          color: "var(--duo-text-dim)",
          letterSpacing: "1px",
        }}
      >
        {text}
      </span>
      <div
        style={{
          flex: 1,
          height: "2px",
          backgroundColor: "var(--duo-border)",
        }}
      />
    </div>
  );
}
