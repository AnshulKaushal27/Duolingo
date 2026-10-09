"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import RightSidebar from "@/components/layout/RightSidebar";
import { api, UserProfile } from "@/lib/api";
import { playClickSound, playCorrectSound } from "@/lib/sound";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/lib/auth-context";

const GOAL_OPTIONS = [
  { xp: 10, label: "Casual", description: "5 min a day" },
  { xp: 20, label: "Regular", description: "10 min a day" },
  { xp: 30, label: "Serious", description: "15 min a day" },
  { xp: 50, label: "Intense", description: "20 min a day" },
];

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  );
}

function SettingsContent() {
  const { user, updateGems } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [dailyGoal, setDailyGoal] = useState(30);
  const [emailReminders, setEmailReminders] = useState(true);
  const [friendActivity, setFriendActivity] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const prof = await api.getUserProfile();
        setProfile(prof);
        if (prof.daily_goal_xp) {
          setDailyGoal(prof.daily_goal_xp);
        }
      } catch (err) {
        console.error(err);
      }

      // Read local preferences
      const savedTheme = localStorage.getItem("duo-theme");
      setDarkMode(savedTheme === "dark");

      const savedSound = localStorage.getItem("duo_sound_enabled");
      if (savedSound !== null) {
        setSoundEnabled(savedSound === "true");
      }
    }
    load();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleToggleSound = () => {
    playClickSound();
    const next = !soundEnabled;
    setSoundEnabled(next);
    localStorage.setItem("duo_sound_enabled", String(next));
    showToast(next ? "Sound effects enabled 🔊" : "Sound effects muted 🔇");
  };

  const handleToggleTheme = () => {
    playClickSound();
    const next = !darkMode;
    setDarkMode(next);
    const themeStr = next ? "dark" : "light";
    localStorage.setItem("duo-theme", themeStr);
    document.documentElement.setAttribute("data-theme", themeStr);
    showToast(next ? "Dark mode activated 🌙" : "Light mode activated ☀️");
  };

  const handleGoalSelect = async (xp: number) => {
    playClickSound();
    setDailyGoal(xp);
    try {
      await api.updateDailyGoal(xp);
      playCorrectSound();
      showToast(`Daily goal updated to ${xp} XP/day! 🎯`);
    } catch {
      showToast("Failed to save daily goal.");
    }
  };

  const handleSimulateDay = async (daysAgo: number) => {
    playClickSound();
    setSimulating(true);
    try {
      const res = await api.simulateDay(daysAgo);
      if (res.success) {
        playCorrectSound();
        const prof = await api.getUserProfile();
        setProfile(prof);
        showToast(`Simulation Success: ${res.message} (Streak: ${res.streak})`);
      }
    } catch (e: any) {
      showToast(`Simulation failed: ${e.message}`);
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="duo-app-layout">
      <Sidebar />

      <main className="duo-main-content">
        <div style={{ maxWidth: "680px", margin: "0 auto", paddingBottom: "60px" }}>
          {/* Header */}
          <div style={{ marginBottom: "28px" }}>
            <h1 style={{ fontSize: "28px", fontWeight: 900, color: "var(--duo-text)" }}>
              Settings
            </h1>
            <p style={{ color: "var(--duo-text-muted)", fontSize: "15px", marginTop: "4px" }}>
              Manage your account preferences, daily learning goal, and app experience.
            </p>
          </div>

          {/* Toast Notification */}
          {toastMessage && (
            <div
              style={{
                position: "fixed",
                top: "24px",
                right: "24px",
                backgroundColor: "var(--duo-green)",
                color: "#ffffff",
                padding: "14px 22px",
                borderRadius: "16px",
                fontWeight: 800,
                fontSize: "15px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                zIndex: 100,
                animation: "fadeIn 0.2s ease",
              }}
            >
              {toastMessage}
            </div>
          )}

          {/* 1. Account Section */}
          <section className="duo-card" style={{ padding: "24px", marginBottom: "24px" }}>
            <h2 style={{ fontSize: "19px", fontWeight: 900, color: "var(--duo-text)", marginBottom: "16px" }}>
              Account
            </h2>
            <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "20px" }}>
              <img
                src={profile?.avatar_url || "/mascot/duo-happy.svg"}
                alt="Avatar"
                style={{ width: "64px", height: "64px", borderRadius: "50%", border: "2px solid var(--duo-border)" }}
              />
              <div>
                <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--duo-text)" }}>
                  {profile?.display_name || "Learner"}
                </div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--duo-text-muted)" }}>
                  @{profile?.username || user?.username || "learner"} • {profile?.email || user?.email || ""}
                </div>
              </div>
            </div>
          </section>

          {/* 2. Daily Goal Section (S6 [C]) */}
          <section className="duo-card" style={{ padding: "24px", marginBottom: "24px" }}>
            <h2 style={{ fontSize: "19px", fontWeight: 900, color: "var(--duo-text)", marginBottom: "8px" }}>
              Daily Learning Goal
            </h2>
            <p style={{ fontSize: "14px", color: "var(--duo-text-muted)", marginBottom: "18px", fontWeight: 600 }}>
              Set your target XP to stay motivated every day.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "12px" }}>
              {GOAL_OPTIONS.map((opt) => {
                const isSelected = dailyGoal === opt.xp;
                return (
                  <div
                    key={opt.xp}
                    onClick={() => handleGoalSelect(opt.xp)}
                    className={`duo-card ${isSelected ? "selected" : ""}`}
                    style={{
                      padding: "16px 12px",
                      textAlign: "center",
                      cursor: "pointer",
                      borderColor: isSelected ? "var(--duo-blue)" : "var(--duo-border)",
                      backgroundColor: isSelected ? "var(--duo-blue-bg)" : "var(--duo-surface)",
                    }}
                  >
                    <div style={{ fontSize: "16px", fontWeight: 900, color: isSelected ? "var(--duo-blue-dark)" : "var(--duo-text)" }}>
                      {opt.label}
                    </div>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: isSelected ? "var(--duo-blue)" : "var(--duo-text-muted)", marginTop: "4px" }}>
                      {opt.xp} XP / day
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--duo-text-muted)", marginTop: "2px" }}>
                      {opt.description}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 3. Preferences (Sound & Dark Mode) */}
          <section className="duo-card" style={{ padding: "24px", marginBottom: "24px" }}>
            <h2 style={{ fontSize: "19px", fontWeight: 900, color: "var(--duo-text)", marginBottom: "18px" }}>
              Preferences
            </h2>

            {/* Sound Toggle */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "16px", borderBottom: "1px solid var(--duo-border)" }}>
              <div>
                <div style={{ fontSize: "16px", fontWeight: 800, color: "var(--duo-text)" }}>Sound Effects</div>
                <div style={{ fontSize: "13px", color: "var(--duo-text-muted)", fontWeight: 600 }}>Play authentic Duo chime, correct/wrong sounds</div>
              </div>
              <button
                type="button"
                onClick={handleToggleSound}
                className={`duo-btn ${soundEnabled ? "duo-btn-green" : "duo-btn-secondary"}`}
                style={{ padding: "8px 20px", fontSize: "13px" }}
              >
                {soundEnabled ? "ON" : "OFF"}
              </button>
            </div>

            {/* Dark Mode Toggle */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "16px" }}>
              <div>
                <div style={{ fontSize: "16px", fontWeight: 800, color: "var(--duo-text)" }}>Dark Mode</div>
                <div style={{ fontSize: "13px", color: "var(--duo-text-muted)", fontWeight: 600 }}>Enjoy Duolingo with a sleek dark aesthetic</div>
              </div>
              <button
                type="button"
                onClick={handleToggleTheme}
                className={`duo-btn ${darkMode ? "duo-btn-blue" : "duo-btn-secondary"}`}
                style={{ padding: "8px 20px", fontSize: "13px" }}
              >
                {darkMode ? "ON" : "OFF"}
              </button>
            </div>
          </section>

          {/* 4. Notifications */}
          <section className="duo-card" style={{ padding: "24px", marginBottom: "24px" }}>
            <h2 style={{ fontSize: "19px", fontWeight: 900, color: "var(--duo-text)", marginBottom: "18px" }}>
              Notifications
            </h2>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "16px", borderBottom: "1px solid var(--duo-border)" }}>
              <div>
                <div style={{ fontSize: "16px", fontWeight: 800, color: "var(--duo-text)" }}>Daily Practice Reminders</div>
                <div style={{ fontSize: "13px", color: "var(--duo-text-muted)", fontWeight: 600 }}>Stay consistent and protect your streak</div>
              </div>
              <button
                type="button"
                onClick={() => { playClickSound(); setEmailReminders(!emailReminders); }}
                className={`duo-btn ${emailReminders ? "duo-btn-green" : "duo-btn-secondary"}`}
                style={{ padding: "8px 20px", fontSize: "13px" }}
              >
                {emailReminders ? "ON" : "OFF"}
              </button>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "16px" }}>
              <div>
                <div style={{ fontSize: "16px", fontWeight: 800, color: "var(--duo-text)" }}>Friend Activity & Leaderboards</div>
                <div style={{ fontSize: "13px", color: "var(--duo-text-muted)", fontWeight: 600 }}>Get notified when rivals pass you in the League</div>
              </div>
              <button
                type="button"
                onClick={() => { playClickSound(); setFriendActivity(!friendActivity); }}
                className={`duo-btn ${friendActivity ? "duo-btn-green" : "duo-btn-secondary"}`}
                style={{ padding: "8px 20px", fontSize: "13px" }}
              >
                {friendActivity ? "ON" : "OFF"}
              </button>
            </div>
          </section>

          {/* 5. Evaluator & Debug Controls (S2 [C] Streak Verification) */}
          <section
            className="duo-card"
            style={{
              padding: "24px",
              backgroundColor: "var(--duo-surface)",
              border: "2px dashed var(--duo-border)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <span style={{ fontSize: "20px" }}>🧪</span>
              <h2 style={{ fontSize: "18px", fontWeight: 900, color: "var(--duo-text)" }}>
                Evaluator Tools (Day Progression & Streak Testing)
              </h2>
            </div>
            <p style={{ fontSize: "13px", color: "var(--duo-text-muted)", marginBottom: "16px", fontWeight: 600 }}>
              Use these controls to simulate calendar days passing and verify S2 [C] streak rules without altering the host OS clock.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              <button
                type="button"
                disabled={simulating}
                onClick={() => handleSimulateDay(0)}
                className="duo-btn duo-btn-secondary"
                style={{ padding: "10px 16px", fontSize: "13px" }}
              >
                Reset to Today (0 Days Ago)
              </button>

              <button
                type="button"
                disabled={simulating}
                onClick={() => handleSimulateDay(1)}
                className="duo-btn duo-btn-blue"
                style={{ padding: "10px 16px", fontSize: "13px" }}
              >
                Simulate Yesterday (1 Day Ago) → Next lesson increments streak
              </button>

              <button
                type="button"
                disabled={simulating}
                onClick={() => handleSimulateDay(2)}
                className="duo-btn duo-btn-red"
                style={{ padding: "10px 16px", fontSize: "13px" }}
              >
                Simulate 2 Days Ago (Missed Day) → Resets streak (or consumes freeze)
              </button>
            </div>
          </section>
        </div>
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
