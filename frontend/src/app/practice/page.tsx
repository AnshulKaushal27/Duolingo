"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import RightSidebar from "@/components/layout/RightSidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/lib/auth-context";
import { api, UserProfile } from "@/lib/api";
import { playClickSound, playCorrectSound } from "@/lib/sound";
import { speakText } from "@/lib/speech";
import StoryReaderModal from "@/components/practice/StoryReaderModal";
import MatchMadnessModal from "@/components/practice/MatchMadnessModal";

interface VocabWord {
  es: string;
  en: string;
  strength: number; // 1 to 4
  category: string;
}

const VOCAB_LIST: VocabWord[] = [
  { es: "Hola", en: "Hello", strength: 4, category: "Greetings" },
  { es: "Buenos días", en: "Good morning", strength: 4, category: "Greetings" },
  { es: "Por favor", en: "Please", strength: 3, category: "Basics" },
  { es: "Gracias", en: "Thank you", strength: 4, category: "Basics" },
  { es: "Agua", en: "Water", strength: 3, category: "Food & Drinks" },
  { es: "Café", en: "Coffee", strength: 3, category: "Food & Drinks" },
  { es: "Pan", en: "Bread", strength: 4, category: "Food & Drinks" },
  { es: "Hombre", en: "Man", strength: 4, category: "People" },
  { es: "Mujer", en: "Woman", strength: 4, category: "People" },
  { es: "Niño", en: "Boy", strength: 2, category: "People" },
  { es: "Niña", en: "Girl", strength: 2, category: "People" },
  { es: "Restaurante", en: "Restaurant", strength: 2, category: "Places" },
];

export default function PracticePage() {
  return (
    <ProtectedRoute>
      <PracticeContent />
    </ProtectedRoute>
  );
}

function PracticeContent() {
  const { user, updateGems } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "vocabulary" | "stories">("overview");
  const [activeStoryId, setActiveStoryId] = useState<string | null>(null);
  const [showMatchMadness, setShowMatchMadness] = useState(false);
  const [vocabSearch, setVocabSearch] = useState("");
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const prof = await api.getUserProfile();
        setProfile(prof);
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    }
    load();
  }, []);

  const handleXpGained = (xp: number, msg: string) => {
    playCorrectSound();
    if (profile) {
      setProfile({
        ...profile,
        total_xp: profile.total_xp + xp,
      });
    }
    setNotification(`${msg} (+${xp} XP!)`);
    setTimeout(() => setNotification(null), 4000);
  };

  const filteredVocab = VOCAB_LIST.filter(
    (w) =>
      w.es.toLowerCase().includes(vocabSearch.toLowerCase()) ||
      w.en.toLowerCase().includes(vocabSearch.toLowerCase())
  );

  return (
    <div className="duo-app-layout">
      <Sidebar />

      {/* Story Modal */}
      {activeStoryId && (
        <StoryReaderModal
          storyId={activeStoryId}
          onComplete={(xp) => {
            handleXpGained(xp, "Story Completed!");
          }}
          onClose={() => setActiveStoryId(null)}
        />
      )}

      {/* Match Madness Modal */}
      {showMatchMadness && (
        <MatchMadnessModal
          onComplete={(xp) => {
            handleXpGained(xp, "Match Madness Round Won!");
          }}
          onClose={() => setShowMatchMadness(false)}
        />
      )}

      <main className="duo-main-content">
        {/* Header */}
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: 900, color: "var(--duo-text-dark)" }}>
            Practice Hub
          </h1>
          <p style={{ color: "var(--duo-text-muted)", fontSize: "15px", marginTop: "4px" }}>
            Target weak skills, master new vocabulary, and immerse in interactive stories.
          </p>
        </div>

        {notification && (
          <div
            style={{
              padding: "14px 20px",
              borderRadius: "14px",
              backgroundColor: "var(--duo-green-bg)",
              color: "var(--duo-green-dark)",
              fontWeight: 800,
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span>🎉</span>
            <span>{notification}</span>
          </div>
        )}

        {/* Tab Pills */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "28px" }}>
          {[
            { id: "overview", label: "OVERVIEW", icon: "🏋️" },
            { id: "vocabulary", label: "WORDS & VOCABULARY", icon: "📚" },
            { id: "stories", label: "STORIES", icon: "📖" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  playClickSound();
                  setActiveTab(tab.id as any);
                }}
                style={{
                  padding: "10px 20px",
                  borderRadius: "16px",
                  border: isActive ? "2px solid var(--duo-blue)" : "2px solid var(--duo-border)",
                  borderBottom: isActive
                    ? "4px solid var(--duo-blue-dark)"
                    : "4px solid var(--duo-border-dark)",
                  backgroundColor: isActive ? "var(--duo-blue-bg)" : "var(--duo-card-bg)",
                  color: isActive ? "var(--duo-blue)" : "var(--duo-text)",
                  fontWeight: 800,
                  fontSize: "14px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  transition: "all 0.12s ease",
                }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {/* Card 1: Practice Mistakes */}
            <div
              style={{
                backgroundColor: "var(--duo-card-bg)",
                borderRadius: "20px",
                border: "2px solid var(--duo-border)",
                borderBottom: "4px solid var(--duo-border-dark)",
                padding: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "20px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "16px",
                    backgroundColor: "var(--duo-red-bg)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "28px",
                    flexShrink: 0,
                  }}
                >
                  🎯
                </div>
                <div>
                  <h3 style={{ fontSize: "18px", fontWeight: 800, color: "var(--duo-text-dark)" }}>
                    Practice Your Mistakes
                  </h3>
                  <p style={{ fontSize: "14.5px", color: "var(--duo-text-muted)", marginTop: "4px", lineHeight: 1.4 }}>
                    Clear flagged exercises to regain full confidence and reinforce weak areas.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  playClickSound();
                  window.location.href = "/lesson/1";
                }}
                className="duo-btn duo-btn-green"
                style={{ padding: "12px 24px", fontSize: "14px", whiteSpace: "nowrap", flexShrink: 0 }}
              >
                START (+15 XP)
              </button>
            </div>

            {/* Card 2: Match Madness */}
            <div
              style={{
                backgroundColor: "var(--duo-card-bg)",
                borderRadius: "20px",
                border: "2px solid var(--duo-border)",
                borderBottom: "4px solid var(--duo-border-dark)",
                padding: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "20px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "16px",
                    backgroundColor: "var(--duo-yellow-bg)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "28px",
                    flexShrink: 0,
                  }}
                >
                  ⚡
                </div>
                <div>
                  <h3 style={{ fontSize: "18px", fontWeight: 800, color: "var(--duo-text-dark)" }}>
                    Match Madness
                  </h3>
                  <p style={{ fontSize: "14.5px", color: "var(--duo-text-muted)", marginTop: "4px", lineHeight: 1.4 }}>
                    Race against the clock in 45 seconds to pair words as fast as possible!
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  playClickSound();
                  setShowMatchMadness(true);
                }}
                className="duo-btn duo-btn-yellow"
                style={{ padding: "12px 24px", fontSize: "14px", whiteSpace: "nowrap", flexShrink: 0 }}
              >
                PLAY NOW (+25 XP)
              </button>
            </div>

            {/* Card 3: Listening Practice */}
            <div
              style={{
                backgroundColor: "var(--duo-card-bg)",
                borderRadius: "20px",
                border: "2px solid var(--duo-border)",
                borderBottom: "4px solid var(--duo-border-dark)",
                padding: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "20px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "16px",
                    backgroundColor: "var(--duo-blue-bg)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "28px",
                    flexShrink: 0,
                  }}
                >
                  🎧
                </div>
                <div>
                  <h3 style={{ fontSize: "18px", fontWeight: 800, color: "var(--duo-text-dark)" }}>
                    Listening Practice
                  </h3>
                  <p style={{ fontSize: "14.5px", color: "var(--duo-text-muted)", marginTop: "4px", lineHeight: 1.4 }}>
                    Sharpen your ear with high-speed and slow audio pronunciation drills.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  playClickSound();
                  window.location.href = "/lesson/2";
                }}
                className="duo-btn duo-btn-blue"
                style={{ padding: "12px 24px", fontSize: "14px", whiteSpace: "nowrap", flexShrink: 0 }}
              >
                START (+15 XP)
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Vocabulary Spaced Repetition */}
        {activeTab === "vocabulary" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <input
              type="text"
              placeholder="Search words in Spanish or English..."
              value={vocabSearch}
              onChange={(e) => setVocabSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "14px 18px",
                borderRadius: "16px",
                border: "2px solid var(--duo-border)",
                backgroundColor: "var(--duo-card-bg)",
                color: "var(--duo-text-dark)",
                fontSize: "15px",
                fontWeight: 700,
                outline: "none",
                marginBottom: "8px",
              }}
            />

            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "10px" }}>
              {filteredVocab.map((w, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "16px 20px",
                    borderRadius: "16px",
                    backgroundColor: "var(--duo-card-bg)",
                    border: "2px solid var(--duo-border)",
                    borderBottom: "4px solid var(--duo-border-dark)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <button
                      onClick={() => speakText(w.es, "es-ES", 0.9)}
                      title="Listen"
                      style={{
                        width: "38px",
                        height: "38px",
                        borderRadius: "10px",
                        border: "2px solid var(--duo-blue)",
                        backgroundColor: "var(--duo-surface)",
                        color: "var(--duo-blue)",
                        cursor: "pointer",
                        fontSize: "16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      🔊
                    </button>
                    <div>
                      <span
                        style={{
                          fontSize: "17px",
                          fontWeight: 800,
                          color: "var(--duo-text-dark)",
                        }}
                      >
                        {w.es}
                      </span>
                      <span
                        style={{
                          fontSize: "14px",
                          color: "var(--duo-text-muted)",
                          display: "block",
                          marginTop: "2px",
                        }}
                      >
                        {w.en} • {w.category}
                      </span>
                    </div>
                  </div>

                  {/* Strength Meter (4 bars) */}
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    {[1, 2, 3, 4].map((bar) => (
                      <div
                        key={bar}
                        style={{
                          width: "8px",
                          height: "18px",
                          borderRadius: "4px",
                          backgroundColor:
                            bar <= w.strength ? "var(--duo-green)" : "var(--duo-border)",
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Stories */}
        {activeTab === "stories" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              {
                id: "buenos-dias",
                title: "¡Buenos días!",
                subtitle: "Eddy searches for his morning coffee with humorous results.",
                xp: 20,
                stars: 3,
                icon: "☕",
              },
              {
                id: "el-restaurante",
                title: "Una cita en el restaurante",
                subtitle: "Bea has an unexpected surprise waiting at her dinner table.",
                xp: 25,
                stars: 3,
                icon: "🍽️",
              },
            ].map((story) => (
              <div
                key={story.id}
                style={{
                  backgroundColor: "var(--duo-card-bg)",
                  borderRadius: "20px",
                  border: "2px solid var(--duo-border)",
                  borderBottom: "4px solid var(--duo-border-dark)",
                  padding: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "20px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
                  <span style={{ fontSize: "40px" }}>{story.icon}</span>
                  <div>
                    <h3 style={{ fontSize: "18px", fontWeight: 800, color: "var(--duo-text-dark)" }}>
                      {story.title}
                    </h3>
                    <p style={{ fontSize: "14px", color: "var(--duo-text-muted)", marginTop: "2px" }}>
                      {story.subtitle}
                    </p>
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: 900,
                        color: "var(--duo-yellow-dark)",
                        marginTop: "4px",
                        display: "inline-block",
                      }}
                    >
                      ⭐⭐⭐ COMPLETED
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    playClickSound();
                    setActiveStoryId(story.id);
                  }}
                  className="duo-btn duo-btn-blue"
                  style={{ padding: "12px 24px", fontSize: "14px", whiteSpace: "nowrap" }}
                >
                  READ STORY (+{story.xp} XP)
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      <RightSidebar
        streak={profile?.streak ?? (user?.streak ?? 1)}
        gems={profile?.gems ?? (user?.gems ?? 0)}
        hearts={profile?.hearts ?? (user?.hearts ?? 5)}
        xp={profile?.total_xp ?? (user?.total_xp ?? 0)}
        onHeartsUpdated={(h, g) => {
          if (profile) setProfile({ ...profile, hearts: h, gems: g });
          updateGems(g);
        }}
      />
    </div>
  );
}
