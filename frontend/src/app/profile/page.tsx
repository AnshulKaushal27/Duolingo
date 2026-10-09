"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import RightSidebar from "@/components/layout/RightSidebar";
import { api, AchievementItem, UserProfile } from "@/lib/api";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/lib/auth-context";

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}

function ProfileContent() {
  const { user, logout, updateGems } = useAuth();
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [aData, profData] = await Promise.all([
          api.getAchievements(),
          api.getUserProfile(),
        ]);
        setAchievements(aData);
        setProfile(profData);
      } catch (err) {
        console.error("Failed to load profile data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const activeUser = user || profile;

  return (
    <div className="duo-app-layout">
      <Sidebar />

      <main className="duo-main-content">
        {/* User Card */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "28px",
            borderRadius: "24px",
            border: "2px solid var(--duo-border)",
            backgroundColor: "var(--duo-canvas)",
            marginBottom: "36px",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <div
              style={{
                width: "88px",
                height: "88px",
                borderRadius: "50%",
                backgroundColor: "var(--duo-surface)",
                border: "3px solid var(--duo-green)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "44px",
              }}
            >
              🦉
            </div>

            <div>
              <h1 style={{ fontSize: "26px", fontWeight: 900, color: "var(--duo-text)" }}>
                {activeUser?.display_name || "Learner"}
              </h1>
              <p style={{ color: "var(--duo-text-muted)", fontSize: "15px", fontWeight: 700 }}>
                @{activeUser?.username || "learner"} • {activeUser?.email || ""}
              </p>
            </div>
          </div>

          <button
            onClick={() => logout()}
            className="duo-btn duo-btn-red"
            style={{
              padding: "10px 20px",
              fontSize: "13px",
              borderRadius: "14px",
            }}
          >
            LOG OUT
          </button>
        </div>

        {/* Statistics Grid */}
        <h2 style={{ fontSize: "22px", fontWeight: 800, color: "var(--duo-text)", marginBottom: "16px" }}>
          Statistics
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "16px",
            marginBottom: "40px",
          }}
        >
          {/* Day Streak */}
          <div style={{
            padding: "20px",
            borderRadius: "20px",
            border: "2px solid var(--duo-border)",
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}>
            <img src="/icons/streak-flame.svg" alt="Streak" style={{ width: "36px", height: "36px" }} />
            <div>
              <span style={{ fontSize: "22px", fontWeight: 900, color: "var(--duo-text)" }}>
                {profile?.streak || 7}
              </span>
              <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--duo-text-muted)" }}>Day streak</p>
            </div>
          </div>

          {/* Total XP */}
          <div style={{
            padding: "20px",
            borderRadius: "20px",
            border: "2px solid var(--duo-border)",
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}>
            <span style={{ fontSize: "32px" }}>⚡</span>
            <div>
              <span style={{ fontSize: "22px", fontWeight: 900, color: "var(--duo-text)" }}>
                {profile?.total_xp || 345}
              </span>
              <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--duo-text-muted)" }}>Total XP</p>
            </div>
          </div>

          {/* Current League */}
          <div style={{
            padding: "20px",
            borderRadius: "20px",
            border: "2px solid var(--duo-border)",
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}>
            <span style={{ fontSize: "32px" }}>🛡️</span>
            <div>
              <span style={{ fontSize: "22px", fontWeight: 900, color: "var(--duo-text)" }}>
                Ruby
              </span>
              <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--duo-text-muted)" }}>Current league</p>
            </div>
          </div>

          {/* Top 3 Finishes */}
          <div style={{
            padding: "20px",
            borderRadius: "20px",
            border: "2px solid var(--duo-border)",
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}>
            <span style={{ fontSize: "32px" }}>🏆</span>
            <div>
              <span style={{ fontSize: "22px", fontWeight: 900, color: "var(--duo-text)" }}>
                4
              </span>
              <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--duo-text-muted)" }}>Top 3 finishes</p>
            </div>
          </div>
        </div>

        {/* Achievements Showcase */}
        <h2 style={{ fontSize: "22px", fontWeight: 800, color: "var(--duo-text)", marginBottom: "16px" }}>
          Achievements
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {achievements.map((ach) => (
            <div
              key={ach.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                padding: "20px 24px",
                borderRadius: "20px",
                border: "2px solid var(--duo-border)",
                backgroundColor: ach.unlocked ? "var(--duo-canvas)" : "var(--duo-surface)",
                opacity: ach.unlocked ? 1 : 0.7,
              }}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "16px",
                  backgroundColor: ach.unlocked ? "var(--duo-yellow-bg)" : "var(--duo-border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "28px",
                }}
              >
                {ach.code === "wildfire" ? "🔥" : ach.code === "sage" ? "📖" : ach.code === "sharpshooter" ? "🎯" : "🏆"}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <h4 style={{ fontWeight: 800, fontSize: "17px", color: "var(--duo-text)" }}>
                    {ach.title}
                  </h4>
                  {ach.unlocked && (
                    <span style={{ fontSize: "12px", fontWeight: 800, color: "var(--duo-green)", backgroundColor: "var(--duo-green-bg)", padding: "2px 8px", borderRadius: "8px" }}>
                      COMPLETED
                    </span>
                  )}
                </div>
                <p style={{ fontSize: "14px", color: "var(--duo-text-muted)", margin: "4px 0" }}>
                  {ach.description}
                </p>
                <div className="duo-progress-track" style={{ height: "10px", maxWidth: "260px" }}>
                  <div
                    className="duo-progress-fill"
                    style={{ width: `${Math.min(100, Math.round((ach.current_value / ach.target_value) * 100))}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <RightSidebar
        streak={profile?.streak ?? (activeUser?.streak ?? 1)}
        gems={profile?.gems ?? (activeUser?.gems ?? 0)}
        hearts={profile?.hearts ?? (activeUser?.hearts ?? 5)}
        xp={profile?.total_xp ?? (activeUser?.total_xp ?? 0)}
        onHeartsUpdated={(h, g) => {
          if (profile) setProfile({ ...profile, hearts: h, gems: g });
          updateGems(g);
        }}
      />
    </div>
  );
}
