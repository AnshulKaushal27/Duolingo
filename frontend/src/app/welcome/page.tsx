"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { playClickSound } from "@/lib/sound";
import DuoWelcomeMascot from "@/components/welcome/DuoWelcomeMascot";

export default function WelcomePage() {
  const router = useRouter();

  const handleContinue = () => {
    playClickSound();
    router.push("/onboarding/source");
  };

  // Keyboard shortcut: Pressing Enter triggers CONTINUE
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleContinue();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div
      style={{
        backgroundColor: "rgb(19, 31, 36)",
        color: "#ffffff",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden",
        fontFamily: 'var(--duo-font, "Nunito", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
        userSelect: "none",
      }}
    >
      {/* Center Stage: Speech Bubble + Duo Mascot */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: "96px", // Space for the fixed bottom bar
          paddingLeft: "24px",
          paddingRight: "24px",
        }}
      >
        {/* Speech Bubble */}
        <div
          style={{
            position: "relative",
            marginBottom: "24px",
            animation: "duoBubbleFloat 3s ease-in-out infinite",
          }}
        >
          <div
            style={{
              backgroundColor: "#202f36",
              border: "2px solid #37464f",
              borderRadius: "16px",
              padding: "14px 26px",
              fontSize: "19px",
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-0.2px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)",
              position: "relative",
              whiteSpace: "nowrap",
            }}
          >
            Hi there! I&apos;m Duo!

            {/* Pointer arrow pointing downwards towards Duo */}
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
          </div>
        </div>

        {/* Duo Mascot Vector */}
        <div
          style={{
            width: "260px",
            height: "240px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "duoFloat 3s ease-in-out infinite",
          }}
        >
          <DuoWelcomeMascot />
        </div>
      </main>

      {/* Fixed Bottom Footer Bar */}
      <footer
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: "96px",
          backgroundColor: "rgb(19, 31, 36)",
          borderTop: "2px solid #28373e",
          display: "flex",
          alignItems: "center",
          padding: "0 40px",
          zIndex: 40,
        }}
      >
        <div
          style={{
            maxWidth: "1040px",
            width: "100%",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <button
            id="welcome-continue-btn"
            data-test="welcome-continue-btn"
            onClick={handleContinue}
            style={{
              backgroundColor: "#58cc02",
              color: "#131f24",
              fontSize: "15px",
              fontWeight: 800,
              letterSpacing: "0.8px",
              textTransform: "uppercase",
              padding: "0 36px",
              height: "50px",
              minWidth: "150px",
              borderRadius: "16px",
              border: "none",
              borderBottom: "4px solid #46a302",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "filter 0.15s, transform 0.1s, border-bottom-width 0.1s",
              fontFamily: "inherit",
              outline: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.filter = "brightness(1.06)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = "none";
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.borderBottomWidth = "4px";
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = "translateY(2px)";
              e.currentTarget.style.borderBottomWidth = "2px";
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.borderBottomWidth = "4px";
            }}
          >
            CONTINUE
          </button>
        </div>
      </footer>

      {/* Floating Keyframe Animations */}
      <style jsx global>{`
        @keyframes duoFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        @keyframes duoBubbleFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }
      `}</style>
    </div>
  );
}
