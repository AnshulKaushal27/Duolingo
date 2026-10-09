"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import RightSidebar from "@/components/layout/RightSidebar";
import { api, LeaderboardData, UserProfile } from "@/lib/api";

import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function LeaderboardPage() {
  return (
    <ProtectedRoute>
      <LeaderboardContent />
    </ProtectedRoute>
  );
}

function LeaderboardContent() {
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [lbData, profData] = await Promise.all([
          api.getLeaderboard(),
          api.getUserProfile(),
        ]);
        setData(lbData);
        setProfile(profData);
      } catch (err) {
        console.error("Failed to load leaderboard data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="duo-app-layout">
      <Sidebar />

      <main className="duo-main-content">
        {/* League Header Card */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontSize: "64px", marginBottom: "8px" }}>🛡️</div>
          <h1 style={{ fontSize: "28px", fontWeight: 900, color: "var(--duo-text)" }}>
            {data?.league || "Ruby"} League
          </h1>
          <p style={{ color: "var(--duo-text-muted)", fontSize: "15px", marginTop: "4px" }}>
            Top 7 advance to the Obsidian League! • {data?.time_remaining || "3 days left"}
          </p>
        </div>

        {/* League Tiers Ribbon */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            overflowX: "auto",
            maxWidth: "100%",
            paddingBottom: "12px",
            marginBottom: "20px",
          }}
        >
          {["Bronze", "Silver", "Gold", "Sapphire", "Ruby", "Emerald", "Amethyst", "Pearl", "Obsidian", "Diamond"].map((lg) => {
            const isCurrent = lg === (data?.league || "Ruby");
            return (
              <span
                key={lg}
                style={{
                  padding: "6px 14px",
                  borderRadius: "12px",
                  fontSize: "12px",
                  fontWeight: 800,
                  backgroundColor: isCurrent ? "var(--duo-blue)" : "var(--duo-surface)",
                  color: isCurrent ? "#ffffff" : "var(--duo-text-muted)",
                  border: isCurrent ? "2px solid var(--duo-blue)" : "2px solid var(--duo-border)",
                  whiteSpace: "nowrap",
                }}
              >
                {lg}
              </span>
            );
          })}
        </div>

        {/* Leaderboard Entries List */}
        <div
          style={{
            width: "100%",
            borderRadius: "20px",
            border: "2px solid var(--duo-border)",
            backgroundColor: "var(--duo-canvas)",
            overflow: "hidden",
          }}
        >
          {loading ? (
            <div style={{ padding: "40px", textAlign: "center", color: "var(--duo-text-muted)" }}>
              Loading league standings...
            </div>
          ) : (
            data?.entries.map((user, idx) => {
              const totalUsers = data.entries.length;
              const isPromotion = user.rank <= 10;
              const isDemotion = user.rank > totalUsers - 5 && totalUsers >= 15;
              const isMe = user.is_current_user;

              return (
                <React.Fragment key={user.id}>
                  {/* Promotion Zone Divider after rank 10 */}
                  {idx === 10 && (
                    <div
                      style={{
                        padding: "8px 20px",
                        backgroundColor: "var(--duo-green-bg)",
                        borderTop: "2px solid var(--duo-green)",
                        borderBottom: "2px solid var(--duo-green)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        fontSize: "12px",
                        fontWeight: 900,
                        color: "var(--duo-green-dark)",
                        textTransform: "uppercase",
                        letterSpacing: "0.8px",
                      }}
                    >
                      <span>▲ PROMOTION ZONE (TOP 10 ADVANCE)</span>
                      <span>🏆</span>
                    </div>
                  )}

                  {/* Demotion Zone Divider before bottom 5 */}
                  {idx === totalUsers - 5 && totalUsers >= 15 && (
                    <div
                      style={{
                        padding: "8px 20px",
                        backgroundColor: "var(--duo-red-bg)",
                        borderTop: "2px solid var(--duo-red)",
                        borderBottom: "2px solid var(--duo-red)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        fontSize: "12px",
                        fontWeight: 900,
                        color: "var(--duo-red-dark)",
                        textTransform: "uppercase",
                        letterSpacing: "0.8px",
                      }}
                    >
                      <span>▼ DEMOTION ZONE (BOTTOM 5 RELEGATE)</span>
                      <span>⚠️</span>
                    </div>
                  )}

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "16px 20px",
                      borderBottom: idx < data.entries.length - 1 ? "2px solid var(--duo-border)" : "none",
                      backgroundColor: isMe ? "var(--duo-blue-bg)" : "transparent",
                      transition: "background-color 0.1s ease",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      {/* Rank Number / Medal */}
                      <span
                        style={{
                          width: "28px",
                          fontWeight: 900,
                          fontSize: "17px",
                          color: user.rank === 1 ? "#ffc800" : user.rank === 2 ? "#afafaf" : user.rank === 3 ? "#cd7f32" : "var(--duo-text-muted)",
                          textAlign: "center",
                        }}
                      >
                        {user.rank}
                      </span>

                      {/* Avatar */}
                      <div
                        style={{
                          width: "44px",
                          height: "44px",
                          borderRadius: "50%",
                          backgroundColor: "var(--duo-surface)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "22px",
                          border: isMe ? "2px solid var(--duo-blue)" : "2px solid var(--duo-border)",
                        }}
                      >
                        {isMe ? "🦉" : "👤"}
                      </div>

                      {/* Display Name */}
                      <div>
                        <h4 style={{ fontWeight: 800, fontSize: "16px", color: isMe ? "var(--duo-blue-dark)" : "var(--duo-text)" }}>
                          {user.display_name} {isMe && "(You)"}
                        </h4>
                        {isPromotion && (
                          <span style={{ fontSize: "12px", color: "var(--duo-green)", fontWeight: 700 }}>
                            ▲ Promoted
                          </span>
                        )}
                        {isDemotion && (
                          <span style={{ fontSize: "12px", color: "var(--duo-red)", fontWeight: 700 }}>
                            ▼ At risk of demotion
                          </span>
                        )}
                      </div>
                    </div>

                    {/* XP Badge */}
                    <span style={{ fontWeight: 800, fontSize: "15px", color: "var(--duo-text-muted)" }}>
                      {user.weekly_xp} XP
                    </span>
                  </div>
                </React.Fragment>
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
