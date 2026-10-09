"use client";

import React, { useState } from "react";
import { UnitWithSkills } from "@/lib/api";
import SkillNode from "./SkillNode";
import GuidebookModal from "./GuidebookModal";
import ChestRewardModal from "./ChestRewardModal";
import { playClickSound } from "@/lib/sound";

interface UnitSectionProps {
  unit: UnitWithSkills;
  courseCode?: string;
  onRefreshPath?: () => void;
  onGemsUpdated?: (newGems: number) => void;
}

export default function UnitSection({
  unit,
  courseCode = "es",
  onRefreshPath,
  onGemsUpdated,
}: UnitSectionProps) {
  const [showGuidebook, setShowGuidebook] = useState(false);
  const [showChest, setShowChest] = useState(false);

  return (
    <div style={{ width: "100%", maxWidth: "600px", margin: "0 auto 40px auto" }}>
      {/* Modals */}
      {showGuidebook && (
        <GuidebookModal
          unitId={unit.id}
          unitTitle={unit.title}
          unitColor={unit.color_hex}
          onClose={() => setShowGuidebook(false)}
        />
      )}

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

      {/* Unit Header Banner */}
      <div
        style={{
          backgroundColor: unit.color_hex || "var(--duo-green)",
          borderRadius: "20px",
          padding: "24px 28px",
          color: "#ffffff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 6px 0 rgba(0,0,0,0.15)",
          marginBottom: "36px",
        }}
      >
        <div>
          <span
            style={{
              textTransform: "uppercase",
              fontSize: "13px",
              fontWeight: 800,
              letterSpacing: "0.8px",
              opacity: 0.9,
            }}
          >
            Unit {unit.unit_number}
          </span>
          <h2 style={{ fontSize: "22px", fontWeight: 800, margin: "4px 0" }}>{unit.title}</h2>
          <p style={{ fontSize: "14px", opacity: 0.9, maxWidth: "400px" }}>{unit.description}</p>
        </div>

        {/* Guidebook Button */}
        <button
          onClick={() => {
            playClickSound();
            setShowGuidebook(true);
          }}
          className="duo-btn duo-btn-outline"
          style={{
            backgroundColor: "rgba(255,255,255,0.2)",
            borderColor: "rgba(255,255,255,0.4)",
            borderBottomColor: "rgba(0,0,0,0.2)",
            color: "#ffffff",
            padding: "10px 16px",
            fontSize: "13px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span>📖</span>
          <span>Guidebook</span>
        </button>
      </div>

      {/* Winding Serpentine Path of Skills with Companion Scene Illustrations */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          gap: "16px",
          width: "100%",
        }}
      >
        {/* Unit 1: Bea S'mores campfire scene (Image 3/4) & Duo Cheer (Image 1) */}
        {unit.unit_number === 1 && (
          <>
            <div
              className="duo-char-illustration"
              style={{
                position: "absolute",
                left: "calc(50% + 55px)",
                top: "135px",
                width: "155px",
                zIndex: 4,
                filter: "drop-shadow(0 8px 18px rgba(0,0,0,0.18))",
                cursor: "pointer",
                transition: "transform 0.15s ease",
              }}
              title="Bea roasting marshmallows!"
              onClick={() => playClickSound()}
            >
              <img
                src="/images/characters/bea_smores.svg"
                alt="Bea roasting marshmallows"
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </div>

            <div
              className="duo-char-illustration"
              style={{
                position: "absolute",
                left: "calc(50% - 175px)",
                top: "40px",
                width: "115px",
                zIndex: 4,
                filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.16))",
                cursor: "pointer",
                transition: "transform 0.15s ease",
              }}
              title="Duo cheering!"
              onClick={() => playClickSound()}
            >
              <img
                src="/images/characters/duo_cheer.svg"
                alt="Duo cheering"
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </div>
          </>
        )}

        {/* Unit 2: Vikram watering pansy flowers (Image 5) */}
        {unit.unit_number === 2 && (
          <div
            className="duo-char-illustration"
            style={{
              position: "absolute",
              left: "calc(50% + 55px)",
              top: "90px",
              width: "150px",
              zIndex: 4,
              filter: "drop-shadow(0 8px 18px rgba(0,0,0,0.18))",
              cursor: "pointer",
              transition: "transform 0.15s ease",
            }}
            title="Vikram watering flowers!"
            onClick={() => playClickSound()}
          >
            <img
              src="/images/characters/vikram_pansies.svg"
              alt="Vikram watering flowers"
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </div>
        )}

        {/* Unit 3: Junior with frog */}
        {unit.unit_number === 3 && (
          <div
            className="duo-char-illustration"
            style={{
              position: "absolute",
              left: "calc(50% + 55px)",
              top: "80px",
              width: "140px",
              zIndex: 4,
              filter: "drop-shadow(0 8px 18px rgba(0,0,0,0.18))",
              cursor: "pointer",
              transition: "transform 0.15s ease",
            }}
            title="Junior and frog!"
            onClick={() => playClickSound()}
          >
            <img
              src="/images/characters/junior_frog.svg"
              alt="Junior with frog"
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
        <div style={{ margin: "24px 0", textAlign: "center" }}>
          <div
            onClick={() => {
              playClickSound();
              setShowChest(true);
            }}
            title="Tap to claim milestone reward!"
            style={{
              width: "68px",
              height: "68px",
              borderRadius: "50%",
              backgroundColor: "var(--duo-surface)",
              border: "2px solid var(--duo-border)",
              borderBottom: "5px solid var(--duo-border-dark)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "transform 0.1s ease",
            }}
          >
            <img src="/icons/chest.svg" alt="Chest" style={{ width: "38px", height: "38px" }} />
          </div>
          <span
            style={{
              fontSize: "12px",
              fontWeight: 800,
              color: "var(--duo-text-muted)",
              marginTop: "6px",
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

