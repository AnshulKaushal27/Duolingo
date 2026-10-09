"use client";

import React, { useState } from "react";
import { api } from "@/lib/api";
import { playCorrectSound, playClickSound } from "@/lib/sound";

interface ChestRewardModalProps {
  unitNumber: number;
  onClaimed: (newGems: number) => void;
  onClose: () => void;
}

export default function ChestRewardModal({
  unitNumber,
  onClaimed,
  onClose,
}: ChestRewardModalProps) {
  const [opened, setOpened] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [gemsAwarded, setGemsAwarded] = useState(25);

  const handleOpen = async () => {
    if (opened || claiming) return;
    try {
      setClaiming(true);
      playCorrectSound();
      const res = await api.claimChest();
      setGemsAwarded(res.reward || 25);
      setOpened(true);
      onClaimed(res.gems);
    } catch (err) {
      console.error("Failed to claim chest", err);
      // Fallback local open
      setOpened(true);
    } finally {
      setClaiming(false);
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
        if (e.target === e.currentTarget && opened) onClose();
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "#ffffff",
          borderRadius: "24px",
          padding: "36px 28px",
          textAlign: "center",
          boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
          animation: "duoBounce 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        <span
          style={{
            fontSize: "13px",
            fontWeight: 900,
            color: "var(--duo-yellow-dark)",
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}
        >
          Unit {unitNumber} Milestone Reward
        </span>

        {/* Chest Illustration */}
        <div
          onClick={handleOpen}
          style={{
            width: "120px",
            height: "120px",
            cursor: opened ? "default" : "pointer",
            transform: opened ? "scale(1.15)" : "scale(1)",
            transition: "transform 0.2s ease",
            position: "relative",
          }}
        >
          <img
            src="/icons/chest.svg"
            alt="Treasure Chest"
            style={{
              width: "100%",
              height: "100%",
              filter: opened
                ? "drop-shadow(0 0 20px rgba(255, 200, 0, 0.8))"
                : "drop-shadow(0 8px 16px rgba(0,0,0,0.15))",
            }}
          />
          {opened && (
            <div
              style={{
                position: "absolute",
                top: "-15px",
                right: "-15px",
                fontSize: "32px",
                animation: "duoBounce 0.5s infinite alternate",
              }}
            >
              ✨
            </div>
          )}
        </div>

        <div>
          <h2
            style={{
              fontSize: "24px",
              fontWeight: 900,
              color: "var(--duo-text-dark)",
              marginBottom: "8px",
            }}
          >
            {opened ? `You found +${gemsAwarded} Gems!` : "You reached a milestone!"}
          </h2>
          <p
            style={{
              fontSize: "15px",
              color: "var(--duo-text-muted)",
              lineHeight: 1.4,
            }}
          >
            {opened
              ? "Great effort! These gems have been added to your bank. Use them in the Shop for Streak Freezes and refills."
              : "Tap the chest to unlock your bonus gems reward!"}
          </p>
        </div>

        {opened ? (
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="duo-btn duo-btn-yellow"
            style={{
              width: "100%",
              height: "50px",
              fontSize: "16px",
              fontWeight: 800,
            }}
          >
            AWESOME!
          </button>
        ) : (
          <button
            onClick={handleOpen}
            disabled={claiming}
            className="duo-btn duo-btn-green"
            style={{
              width: "100%",
              height: "50px",
              fontSize: "16px",
              fontWeight: 800,
            }}
          >
            {claiming ? "OPENING..." : "OPEN CHEST"}
          </button>
        )}
      </div>
    </div>
  );
}
