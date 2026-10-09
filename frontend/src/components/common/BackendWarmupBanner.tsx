"use client";

import React, { useState, useEffect, useRef } from "react";
import { api } from "@/lib/api";

type WarmupStatus = "idle" | "warming" | "restored";

export default function BackendWarmupBanner() {
  const [status, setStatus] = useState<WarmupStatus>("idle");
  const [elapsed, setElapsed] = useState<number>(0);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  // Ping backend to check if it's currently awake
  const pingBackend = async () => {
    const isHealthy = await api.checkHealth(3000);
    return isHealthy;
  };

  const startWarmingUp = () => {
    if (status === "warming") return;
    setStatus("warming");
    setIsDismissed(false);
    setElapsed(0);

    // Elapsed seconds ticker
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);

    // Continuous poll every 2.5 seconds
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      const healthy = await pingBackend();
      if (healthy) {
        onRestored();
      }
    }, 2500);
  };

  const onRestored = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (pollRef.current) clearInterval(pollRef.current);
    setStatus("restored");

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("duo:backend_online"));
    }

    // Auto-dismiss after 2 seconds
    setTimeout(() => {
      setStatus("idle");
    }, 2000);
  };

  // Initial liveness check on page mount
  useEffect(() => {
    let active = true;

    const initialCheck = async () => {
      // Race initial check: if backend doesn't reply in 1.4s, assume cold start / spin-down
      const timeoutPromise = new Promise<boolean>((resolve) =>
        setTimeout(() => resolve(false), 1400)
      );
      const pingPromise = pingBackend();

      const fastOk = await Promise.race([pingPromise, timeoutPromise]);
      if (!active) return;

      if (!fastOk) {
        // Cold start in progress or backend still starting
        startWarmingUp();
      }
    };

    initialCheck();

    // Listen to network failures emitted by api.ts
    const handleBackendOffline = () => {
      startWarmingUp();
    };

    window.addEventListener("duo:backend_offline", handleBackendOffline);

    return () => {
      active = false;
      if (timerRef.current) clearInterval(timerRef.current);
      if (pollRef.current) clearInterval(pollRef.current);
      window.removeEventListener("duo:backend_offline", handleBackendOffline);
    };
  }, []);

  if (status === "idle" || isDismissed) {
    return null;
  }

  const isRestored = status === "restored";

  return (
    <aside
      aria-label="Server status alert"
      style={{
        position: "fixed",
        top: "16px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 99999,
        width: "90%",
        maxWidth: "520px",
        backgroundColor: isRestored ? "#143a22" : "#131f24",
        border: `2px solid ${isRestored ? "#58cc02" : "#ff9600"}`,
        boxShadow: "0 12px 32px rgba(0,0,0,0.45)",
        borderRadius: "20px",
        padding: "16px 20px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        color: "#ffffff",
        fontFamily: "var(--font-nunito), -apple-system, BlinkMacSystemFont, sans-serif",
        transition: "all 0.3s ease",
        animation: "slideDown 0.35s ease-out",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img
            src="/mascot/duo-happy.svg"
            alt="Duo Mascot"
            style={{
              width: "44px",
              height: "44px",
              animation: isRestored ? "none" : "duoBounce 1.2s infinite ease-in-out",
            }}
          />
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  display: "inline-block",
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: isRestored ? "#58cc02" : "#ff9600",
                  boxShadow: `0 0 10px ${isRestored ? "#58cc02" : "#ff9600"}`,
                }}
              />
              <span style={{ fontWeight: 800, fontSize: "16px", color: isRestored ? "#58cc02" : "#ffffff" }}>
                {isRestored ? "Server Online! Ready to Learn!" : "Waking up Duo's server..."}
              </span>
            </div>
            {!isRestored && (
              <span style={{ fontSize: "12px", color: "#a5b4be", fontWeight: 700 }}>
                Cold start elapsed: {elapsed}s (typically takes 30–50s)
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() => setIsDismissed(true)}
          style={{
            background: "none",
            border: "none",
            color: "#a5b4be",
            fontSize: "18px",
            fontWeight: 800,
            cursor: "pointer",
            padding: "4px 8px",
            lineHeight: 1,
          }}
          aria-label="Dismiss banner"
        >
          ✕
        </button>
      </div>

      {!isRestored ? (
        <>
          <p style={{ margin: 0, fontSize: "13px", lineHeight: "1.45", color: "#dbe4eb" }}>
            The backend is hosted on <strong>Render&apos;s free tier</strong>, which spins down idle servers after inactivity. We are waking it up for you right now!
          </p>

          <div
            style={{
              width: "100%",
              height: "8px",
              backgroundColor: "#202f36",
              borderRadius: "4px",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div
              style={{
                width: `${Math.min(95, Math.max(10, (elapsed / 45) * 100))}%`,
                height: "100%",
                backgroundColor: "#ff9600",
                borderRadius: "4px",
                transition: "width 1s linear",
                boxShadow: "0 0 8px rgba(255, 150, 0, 0.6)",
              }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "4px" }}>
            <button
              onClick={async () => {
                const healthy = await pingBackend();
                if (healthy) onRestored();
              }}
              style={{
                backgroundColor: "#202f36",
                color: "#ff9600",
                border: "2px solid #37464f",
                borderRadius: "12px",
                padding: "6px 14px",
                fontSize: "13px",
                fontWeight: 800,
                cursor: "pointer",
                transition: "background-color 0.15s ease",
              }}
            >
              Ping Now 🔄
            </button>
          </div>
        </>
      ) : (
        <p style={{ margin: 0, fontSize: "13px", color: "#bbf7d0", fontWeight: 700 }}>
          ✓ Backend service is live. All exercises and course features are ready!
        </p>
      )}
    </aside>
  );
}
