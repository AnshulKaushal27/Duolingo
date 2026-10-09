"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import RightSidebar from "@/components/layout/RightSidebar";
import { api, QuestItem, UserProfile } from "@/lib/api";

import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function QuestsPage() {
  return (
    <ProtectedRoute>
      <QuestsContent />
    </ProtectedRoute>
  );
}

function QuestsContent() {
  const [quests, setQuests] = useState<QuestItem[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [qData, profData] = await Promise.all([
          api.getQuests(),
          api.getUserProfile(),
        ]);
        setQuests(qData);
        setProfile(profData);
      } catch (err) {
        console.error("Failed to load quests data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "var(--duo-canvas)" }}>
      <Sidebar />

      <main
        style={{
          marginLeft: "256px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "36px 24px 80px 24px",
          maxWidth: "680px",
          width: "100%",
        }}
      >
        <div style={{ width: "100%", marginBottom: "32px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: 900, color: "var(--duo-text)" }}>
            Daily Quests
          </h1>
          <p style={{ color: "var(--duo-text-muted)", fontSize: "15px", marginTop: "4px" }}>
            Complete quests every day to earn gems and unlock monthly badges!
          </p>
        </div>

        {/* Quests Container */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "16px" }}>
          {loading ? (
            <div style={{ padding: "40px", textAlign: "center", color: "var(--duo-text-muted)" }}>
              Loading daily quests...
            </div>
          ) : (
            quests.map((quest) => {
              const progressPct = Math.min(100, Math.round((quest.current_progress / quest.target_progress) * 100));

              return (
                <div
                  key={quest.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "20px 24px",
                    borderRadius: "20px",
                    border: "2px solid var(--duo-border)",
                    backgroundColor: "var(--duo-canvas)",
                    gap: "20px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", flex: 1 }}>
                    <div
                      style={{
                        width: "52px",
                        height: "52px",
                        borderRadius: "16px",
                        backgroundColor: "var(--duo-surface)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "26px",
                      }}
                    >
                      {quest.completed ? "🎁" : "📜"}
                    </div>

                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontWeight: 800, fontSize: "16px", color: "var(--duo-text)", marginBottom: "6px" }}>
                        {quest.title}
                      </h4>
                      <div className="duo-progress-track" style={{ height: "12px", maxWidth: "340px" }}>
                        <div className="duo-progress-fill" style={{ width: `${progressPct}%` }} />
                      </div>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--duo-text-muted)", marginTop: "4px", display: "inline-block" }}>
                        {quest.current_progress} / {quest.target_progress}
                      </span>
                    </div>
                  </div>

                  {/* Reward Badge */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 14px",
                      borderRadius: "12px",
                      backgroundColor: quest.completed ? "var(--duo-green-bg)" : "var(--duo-surface)",
                      color: quest.completed ? "var(--duo-green-dark)" : "var(--duo-text)",
                      fontWeight: 800,
                      fontSize: "14px",
                    }}
                  >
                    <span>💎</span>
                    <span>+{quest.reward_gems}</span>
                    {quest.completed && <span>✓</span>}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      <RightSidebar
        streak={profile?.streak || 7}
        gems={profile?.gems || 780}
        hearts={profile?.hearts || 5}
        xp={profile?.total_xp || 345}
        onHeartsUpdated={() => {}}
      />
    </div>
  );
}
