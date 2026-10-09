"use client";

import React, { useState } from "react";
import { UnitWithSkills } from "@/lib/api";
import SkillNode from "./SkillNode";
import ChestRewardModal from "./ChestRewardModal";
import { playClickSound } from "@/lib/sound";

interface UnitSectionProps {
  unit: UnitWithSkills;
  courseCode?: string;
  onRefreshPath?: () => void;
  onGemsUpdated?: (newGems: number) => void;
}

interface CharacterSceneConfig {
  src: string;
  alt: string;
  side: "left" | "right";
  top: string;
  width: string;
  title: string;
}

const UNIT_CHARACTERS: Record<number, CharacterSceneConfig> = {
  1: {
    src: "/images/characters/bea_smores.svg",
    alt: "Bea roasting marshmallows",
    side: "right",
    top: "120px",
    width: "140px",
    title: "Bea roasting marshmallows at camp!",
  },
  2: {
    src: "/images/characters/vikram_pansies.svg",
    alt: "Vikram watering flowers",
    side: "left",
    top: "110px",
    width: "140px",
    title: "Vikram watering flowers!",
  },
  3: {
    src: "/images/characters/junior_frog.svg",
    alt: "Junior and frog",
    side: "right",
    top: "110px",
    width: "135px",
    title: "Junior with his frog friend!",
  },
  4: {
    src: "/images/characters/lily_doomscroll.svg",
    alt: "Lily listening to music",
    side: "left",
    top: "60px",
    width: "125px",
    title: "Lily listening to tunes!",
  },
  5: {
    src: "/images/characters/oscar_bonsai.svg",
    alt: "Oscar pruning bonsai",
    side: "right",
    top: "60px",
    width: "135px",
    title: "Oscar tending his bonsai!",
  },
  6: {
    src: "/images/characters/eddy_basketball.svg",
    alt: "Eddy playing basketball",
    side: "left",
    top: "60px",
    width: "135px",
    title: "Eddy playing basketball!",
  },
};

export default function UnitSection({
  unit,
  courseCode = "es",
  onRefreshPath,
  onGemsUpdated,
}: UnitSectionProps) {
  const [showChest, setShowChest] = useState(false);

  const charScene = UNIT_CHARACTERS[unit.unit_number];

  return (
    <div
      id={`unit-section-${unit.unit_number}`}
      data-unit-number={unit.unit_number}
      style={{
        width: "100%",
        maxWidth: "600px",
        margin: "0 auto 48px auto",
        scrollMarginTop: "100px",
      }}
    >

      {showChest && (
        <ChestRewardModal
          unitNumber={unit.unit_number}
          onClaimed={(newGems) => {
            onGemsUpdated?.(newGems);
          }}
          onClose={() => setShowChest(false)}
        />
      )}

      {/* CEFR Section Header (Displayed before Unit 1) */}
      {unit.unit_number === 1 && (
        <div
          style={{
            backgroundColor: "#2b70c9",
            borderRadius: "20px",
            padding: "16px 24px",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "24px",
            boxShadow: "0 6px 0 #18509c",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "28px" }}>🗺️</span>
            <div>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                  opacity: 0.9,
                }}
              >
                {courseCode === "ja" ? "Section 1 • Intro to Japanese" : "Section 1 • CEFR A1"}
              </span>
              <h3 style={{ fontSize: "18px", fontWeight: 800, margin: 0 }}>
                {courseCode === "ja" ? "Hiragana & Everyday Basics" : "Rookie: First Steps in Spanish"}
              </h3>
            </div>
          </div>

          <span
            style={{
              fontSize: "12px",
              fontWeight: 800,
              backgroundColor: "rgba(255,255,255,0.2)",
              padding: "6px 12px",
              borderRadius: "12px",
            }}
          >
            Units 1 - 6
          </span>
        </div>
      )}

      {/* Unit In-Path Transition Marker (Flanked divider for Units > 1) */}
      {unit.unit_number > 1 && (
        <div
          style={{
            width: "100%",
            maxWidth: "520px",
            margin: "8px auto 36px auto",
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div style={{ flex: 1, height: "2px", backgroundColor: "var(--duo-border)", opacity: 0.6 }} />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px 18px",
              borderRadius: "16px",
              backgroundColor: "var(--duo-surface)",
              border: "2px solid var(--duo-border)",
              boxShadow: "0 4px 0 var(--duo-border-dark)",
            }}
          >
            <span
              style={{
                fontSize: "12px",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "0.8px",
                color: unit.color_hex || "var(--duo-green)",
              }}
            >
              Unit {unit.unit_number}
            </span>
            <span style={{ color: "var(--duo-border)", fontWeight: 900 }}>•</span>
            <span
              style={{
                fontSize: "13px",
                fontWeight: 800,
                color: "var(--duo-text)",
              }}
            >
              {unit.title.replace(/^Unit \d+:\s*/i, "")}
            </span>
          </div>
          <div style={{ flex: 1, height: "2px", backgroundColor: "var(--duo-border)", opacity: 0.6 }} />
        </div>
      )}

      {/* Winding Serpentine Path of Skills with Companion Scene Illustrations */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          gap: "44px",
          width: "100%",
          padding: "8px 0 20px 0",
        }}
      >
        {/* Unit Companion Character Scene (Positioned cleanly in the gutter alongside the path) */}
        {charScene && (
          <div
            className="duo-char-illustration"
            style={{
              position: "absolute",
              [charScene.side === "right" ? "left" : "right"]: "calc(50% + 145px)",
              top: charScene.top,
              width: charScene.width,
              zIndex: 4,
              filter: "drop-shadow(0 8px 18px rgba(0,0,0,0.18))",
              cursor: "pointer",
              transition: "transform 0.15s ease",
            }}
            title={charScene.title}
            onClick={() => playClickSound()}
          >
            <img
              src={charScene.src}
              alt={charScene.alt}
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </div>
        )}

        {unit.skills.map((skill, idx) => (
          <SkillNode
            key={skill.id}
            skill={skill}
            index={idx}
            unitColor={unit.color_hex}
            unitId={unit.id}
            unitNumber={unit.unit_number}
            onRefreshPath={onRefreshPath}
          />
        ))}

        {/* Milestone Treasure Chest Node */}
        <div style={{ marginTop: "36px", marginBottom: "16px", textAlign: "center" }}>
          <div
            onClick={() => {
              playClickSound();
              setShowChest(true);
            }}
            title="Tap to claim milestone reward!"
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              backgroundColor: "var(--duo-surface)",
              border: "2px solid var(--duo-border)",
              borderBottom: "6px solid var(--duo-border-dark)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "transform 0.1s ease",
              margin: "0 auto",
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = "translateY(3px)";
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <img src="/icons/chest.svg" alt="Chest" style={{ width: "40px", height: "40px" }} />
          </div>
          <span
            style={{
              fontSize: "12px",
              fontWeight: 800,
              color: "var(--duo-text-muted)",
              marginTop: "8px",
              display: "block",
            }}
          >
            Reward Chest
          </span>
        </div>
      </div>
    </div>
  );
}

