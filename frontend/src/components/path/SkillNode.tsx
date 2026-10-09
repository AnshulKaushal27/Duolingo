"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SkillStatus } from "@/lib/api";
import { playClickSound } from "@/lib/sound";

interface SkillNodeProps {
  skill: SkillStatus;
  index: number;
  unitColor: string;
  unitId?: number;
  unitNumber?: number;
  onRefreshPath?: () => void;
}

import JumpAheadModal from "./JumpAheadModal";

export default function SkillNode({
  skill,
  index,
  unitColor,
  unitId,
  unitNumber = 1,
  onRefreshPath,
}: SkillNodeProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [showJumpModal, setShowJumpModal] = useState(false);

  // Compute smooth winding serpentine horizontal offset
  const offsetMultiplier = Math.sin((index * Math.PI) / 2);
  const horizontalOffset = Math.round(offsetMultiplier * 54);

  const isCompleted = skill.status === "completed" || skill.status === "mastered";
  const isAvailable = skill.status === "available";
  const isLocked = skill.status === "locked";

  // Colors
  const activeColor = unitColor || "var(--duo-green)";

  // Icon mapping
  const iconMap: Record<string, string> = {
    star: "⭐",
    chat: "💬",
    cup: "☕",
    burger: "🍔",
    heart: "❤️",
    calendar: "📅",
  };
  const icon = iconMap[skill.icon_name] || "⭐";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transform: `translateX(${horizontalOffset}px)`,
        position: "relative",
        margin: "18px 0",
      }}
    >
      {/* Jump Ahead Modal */}
      {showJumpModal && unitId && (
        <JumpAheadModal
          unitId={unitId}
          unitNumber={unitNumber}
          unitTitle={skill.title}
          onSuccess={() => {
            setShowJumpModal(false);
            setPopoverOpen(false);
            onRefreshPath?.();
          }}
          onClose={() => setShowJumpModal(false)}
        />
      )}

      {/* Popover Card */}
      {popoverOpen && (
        <div
          style={{
            position: "absolute",
            bottom: "94px",
            backgroundColor: isLocked ? "var(--duo-surface)" : activeColor,
            color: "#ffffff",
            padding: "16px 20px",
            borderRadius: "18px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            zIndex: 30,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            minWidth: "220px",
            textAlign: "center",
          }}
        >
          <span style={{ fontWeight: 800, fontSize: "16px", color: isLocked ? "var(--duo-text-dark)" : "#fff" }}>
            {skill.title}
          </span>
          <span style={{ fontSize: "13px", opacity: 0.9, color: isLocked ? "var(--duo-text-muted)" : "#fff" }}>
            {isCompleted
              ? `Skill Completed! (${skill.crowns_earned}/${skill.total_crowns} Crowns)`
              : isAvailable
              ? `Lesson ${skill.completed_lessons + 1} of ${skill.total_lessons}`
              : "Complete previous skills or jump ahead!"}
          </span>

          {!isLocked && skill.next_lesson_id && (
            <Link
              href={`/lesson/${skill.next_lesson_id}`}
              className="duo-btn duo-btn-outline"
              style={{
                marginTop: "6px",
                width: "100%",
                padding: "10px 16px",
                fontSize: "14px",
                backgroundColor: "#ffffff",
                color: activeColor,
              }}
              onClick={() => playClickSound()}
            >
              {isCompleted ? "PRACTICE (+15 XP)" : "START (+15 XP)"}
            </Link>
          )}

          {isLocked && unitId && (
            <button
              onClick={() => {
                playClickSound();
                setShowJumpModal(true);
              }}
              className="duo-btn duo-btn-outline"
              style={{
                marginTop: "6px",
                width: "100%",
                padding: "10px 14px",
                fontSize: "13px",
                color: "var(--duo-text-dark)",
              }}
            >
              JUMP HERE? 🚀
            </button>
          )}

          {/* Pointer Triangle */}
          <div
            style={{
              position: "absolute",
              bottom: "-8px",
              width: 0,
              height: 0,
              borderLeft: "8px solid transparent",
              borderRight: "8px solid transparent",
              borderTop: `8px solid ${isLocked ? "var(--duo-surface)" : activeColor}`,
            }}
          />
        </div>
      )}

      {/* 3D Stepping Stone Skill Button */}
      <div style={{ position: "relative" }}>
        {/* Authentic START Speech Bubble (Matching Image 1, 3, 4) */}
        {isAvailable && !popoverOpen && (
          <div
            style={{
              position: "absolute",
              top: "-42px",
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "var(--duo-surface)",
              border: "2px solid var(--duo-border)",
              borderRadius: "12px",
              padding: "5px 14px",
              fontWeight: 900,
              fontSize: "13px",
              letterSpacing: "0.8px",
              color: "var(--duo-text)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.18)",
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
              animation: "duoBounce 2s ease-in-out infinite",
            }}
          >
            <span>START</span>
            {/* Arrow pointing down */}
            <div
              style={{
                position: "absolute",
                bottom: "-6px",
                left: "50%",
                transform: "translateX(-50%)",
                width: 0,
                height: 0,
                borderLeft: "6px solid transparent",
                borderRight: "6px solid transparent",
                borderTop: "6px solid var(--duo-border)",
              }}
            />
          </div>
        )}

        {/* Pulsing ring for available active skill */}
        {isAvailable && (
          <div
            className="anim-pulse"
            style={{
              position: "absolute",
              inset: "-6px",
              borderRadius: "50%",
              border: `4px solid ${activeColor}`,
              zIndex: 0,
            }}
          />
        )}

        <button
          onClick={() => {
            playClickSound();
            setPopoverOpen(!popoverOpen);
          }}
          style={{
            position: "relative",
            zIndex: 1,
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            border: "none",
            backgroundColor: isCompleted
              ? "var(--duo-yellow)"
              : isAvailable
              ? activeColor
              : "var(--duo-border)",
            boxShadow: isCompleted
              ? "0 7px 0 var(--duo-yellow-dark)"
              : isAvailable
              ? `0 7px 0 ${activeColor === "var(--duo-green)" ? "var(--duo-green-dark)" : "var(--duo-blue-dark)"}`
              : "0 7px 0 var(--duo-border-dark)",
            cursor: isLocked ? "default" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "30px",
            color: "#ffffff",
            transition: "transform 0.1s ease",
            outline: "none",
          }}
          onMouseDown={(e) => {
            if (!isLocked) e.currentTarget.style.transform = "translateY(3px)";
          }}
          onMouseUp={(e) => {
            if (!isLocked) e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          {isLocked ? (
            <span style={{ fontSize: "24px", opacity: 0.5 }}>🔒</span>
          ) : isCompleted ? (
            <span>👑</span>
          ) : (
            <span>{icon}</span>
          )}
        </button>

        {/* Floating Mascot Cameo on available node */}
        {isAvailable && (
          <img
            src="/mascot/duo-happy.svg"
            alt="Duo"
            style={{
              position: "absolute",
              top: "-38px",
              right: "-32px",
              width: "48px",
              height: "48px",
              zIndex: 2,
              animation: "duoBounce 2s infinite ease-in-out",
            }}
          />
        )}
      </div>

      {/* Skill Title Subtitle under button */}
      <span
        style={{
          marginTop: "12px",
          fontWeight: 800,
          fontSize: "14px",
          color: isLocked ? "var(--duo-text-muted)" : "var(--duo-text)",
          textAlign: "center",
          maxWidth: "110px",
        }}
      >
        {skill.title}
      </span>
    </div>
  );
}
