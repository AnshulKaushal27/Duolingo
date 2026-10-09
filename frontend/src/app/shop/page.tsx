"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import RightSidebar from "@/components/layout/RightSidebar";
import { api, UserProfile } from "@/lib/api";
import { playClickSound, playCorrectSound } from "@/lib/sound";

import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function ShopPage() {
  return (
    <ProtectedRoute>
      <ShopContent />
    </ProtectedRoute>
  );
}

function ShopContent() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const prof = await api.getUserProfile();
        setProfile(prof);
      } catch (e) {
        console.error(e);
      }
    }
    loadProfile();
  }, []);

  const handleRefillHearts = async () => {
    playClickSound();
    try {
      const res = await api.refillHearts();
      if (res.success) {
        playCorrectSound();
        if (profile) {
          setProfile({ ...profile, hearts: res.hearts, gems: res.gems });
        }
        setMessage("Hearts successfully refilled! ❤️❤️❤️❤️❤️");
      } else {
        setMessage(res.message);
      }
    } catch (e: any) {
      setMessage(e.message);
    }
  };

  const handleBuyStreakFreeze = () => {
    playClickSound();
    if (!profile || profile.gems < 200) {
      setMessage("Not enough gems for Streak Freeze!");
      return;
    }
    playCorrectSound();
    setProfile({ ...profile, gems: profile.gems - 200 });
    setMessage("Streak Freeze equipped! 🧊 Your streak is protected for 1 missed day.");
  };

  return (
    <div className="duo-app-layout">
      <Sidebar />

      <main className="duo-main-content">
        <div style={{ width: "100%", marginBottom: "28px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: 900, color: "var(--duo-text)" }}>
            Shop
          </h1>
          <p style={{ color: "var(--duo-text-muted)", fontSize: "15px", marginTop: "4px" }}>
            Power up your learning journey with gems and Super Duolingo!
          </p>
        </div>

        {message && (
          <div style={{
            padding: "14px 20px",
            borderRadius: "14px",
            backgroundColor: "var(--duo-green-bg)",
            color: "var(--duo-green-dark)",
            fontWeight: 800,
            marginBottom: "24px",
          }}>
            {message}
          </div>
        )}

        {/* Super Duolingo Big Banner */}
        <div
          style={{
            background: "linear-gradient(135deg, #1899d6 0%, #005086 100%)",
            borderRadius: "24px",
            padding: "32px",
            color: "#ffffff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 8px 24px rgba(24,153,214,0.3)",
            marginBottom: "40px",
          }}
        >
          <div>
            <span style={{ textTransform: "uppercase", fontWeight: 800, fontSize: "13px", letterSpacing: "1px", color: "#8de0fd" }}>
              PREMIUM EXPERIENCE
            </span>
            <h2 style={{ fontSize: "26px", fontWeight: 900, margin: "6px 0 10px 0" }}>
              Super Duolingo
            </h2>
            <p style={{ fontSize: "15px", maxWidth: "340px", opacity: 0.9 }}>
              No ads, personalized practice, and unlimited hearts so learning never has to pause.
            </p>
          </div>
          <button
            onClick={() => { playClickSound(); alert("Super Duolingo: Free 2-week trial started! Unlimited hearts enabled."); }}
            className="duo-btn"
            style={{
              backgroundColor: "#ffffff",
              color: "var(--duo-blue-dark)",
              borderColor: "#e5e5e5",
              borderBottomColor: "#cecece",
              padding: "14px 24px",
              fontSize: "14px",
            }}
          >
            START FREE TRIAL
          </button>
        </div>

        {/* Power-ups Section */}
        <h2 style={{ fontSize: "22px", fontWeight: 800, color: "var(--duo-text)", marginBottom: "20px" }}>
          Power-Ups
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Item 1: Refill Hearts */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 24px",
            borderRadius: "20px",
            border: "2px solid var(--duo-border)",
            backgroundColor: "var(--duo-canvas)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <img src="/icons/heart.svg" alt="Heart" style={{ width: "48px", height: "48px" }} />
              <div>
                <h4 style={{ fontWeight: 800, fontSize: "17px", color: "var(--duo-text)" }}>
                  Heart Refill
                </h4>
                <p style={{ fontSize: "14px", color: "var(--duo-text-muted)", marginTop: "2px" }}>
                  Get back to full health with 5 hearts.
                </p>
              </div>
            </div>

            <button
              onClick={handleRefillHearts}
              disabled={profile?.hearts === 5}
              className="duo-btn duo-btn-blue"
              style={{ padding: "10px 18px", fontSize: "14px" }}
            >
              💎 350 GEMS
            </button>
          </div>

          {/* Item 2: Streak Freeze */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 24px",
            borderRadius: "20px",
            border: "2px solid var(--duo-border)",
            backgroundColor: "var(--duo-canvas)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <span style={{ fontSize: "42px" }}>🧊</span>
              <div>
                <h4 style={{ fontWeight: 800, fontSize: "17px", color: "var(--duo-text)" }}>
                  Streak Freeze
                </h4>
                <p style={{ fontSize: "14px", color: "var(--duo-text-muted)", marginTop: "2px" }}>
                  Protects your streak for 1 full day of inactivity.
                </p>
              </div>
            </div>

            <button
              onClick={handleBuyStreakFreeze}
              className="duo-btn duo-btn-blue"
              style={{ padding: "10px 18px", fontSize: "14px" }}
            >
              💎 200 GEMS
            </button>
          </div>

          {/* Item 3: Double or Nothing */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 24px",
            borderRadius: "20px",
            border: "2px solid var(--duo-border)",
            backgroundColor: "var(--duo-canvas)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <span style={{ fontSize: "42px" }}>🎲</span>
              <div>
                <h4 style={{ fontWeight: 800, fontSize: "17px", color: "var(--duo-text)" }}>
                  Double or Nothing
                </h4>
                <p style={{ fontSize: "14px", color: "var(--duo-text-muted)", marginTop: "2px" }}>
                  Wager 50 gems and maintain a 7-day streak to win 100 gems!
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                if (!profile || profile.gems < 50) {
                  setMessage("Not enough gems to place a wager!");
                  return;
                }
                playCorrectSound();
                setProfile({ ...profile, gems: profile.gems - 50 });
                setMessage("🎲 7-Day Wager placed! Keep your streak active for 7 days to win 100 gems!");
              }}
              className="duo-btn duo-btn-outline"
              style={{ padding: "10px 18px", fontSize: "14px" }}
            >
              💎 50 GEMS
            </button>
          </div>
        </div>

        {/* Duo Outfits Section */}
        <h2 style={{ fontSize: "22px", fontWeight: 800, color: "var(--duo-text)", margin: "36px 0 20px 0" }}>
          Duo Outfits
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
          {[
            { id: "tux", name: "Formal Attire", price: 400, icon: "🎩", desc: "Duo dresses in a sharp tuxedo." },
            { id: "super", name: "Super Duo Cape", price: 600, icon: "🦸", desc: "Heroic cape for fast learning." },
            { id: "crown", name: "Royal Crown", price: 1000, icon: "👑", desc: "Golden crown fit for a polyglot." },
          ].map((outfit) => (
            <div
              key={outfit.id}
              style={{
                borderRadius: "20px",
                border: "2px solid var(--duo-border)",
                backgroundColor: "var(--duo-canvas)",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: "10px",
              }}
            >
              <span style={{ fontSize: "48px" }}>{outfit.icon}</span>
              <h4 style={{ fontSize: "16px", fontWeight: 800, color: "var(--duo-text)" }}>
                {outfit.name}
              </h4>
              <p style={{ fontSize: "13px", color: "var(--duo-text-muted)", flex: 1 }}>
                {outfit.desc}
              </p>
              <button
                onClick={() => {
                  if (!profile || profile.gems < outfit.price) {
                    setMessage(`Not enough gems for ${outfit.name}!`);
                    return;
                  }
                  playCorrectSound();
                  setProfile({ ...profile, gems: profile.gems - outfit.price });
                  setMessage(`✨ Equipped ${outfit.name}! Duo looks spectacular.`);
                }}
                className="duo-btn duo-btn-blue"
                style={{ width: "100%", padding: "10px", fontSize: "13px" }}
              >
                💎 {outfit.price} GEMS
              </button>
            </div>
          ))}
        </div>

        {/* Gem Bundles Section */}
        <h2 style={{ fontSize: "22px", fontWeight: 800, color: "var(--duo-text)", margin: "36px 0 20px 0" }}>
          Gem Bank
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {[
            { name: "Handful of Gems", amount: 500, price: "$4.99", icon: "💎" },
            { name: "Treasure Chest of Gems", amount: 1200, price: "$9.99", icon: "🎁" },
          ].map((bundle, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "18px 24px",
                borderRadius: "20px",
                border: "2px solid var(--duo-border)",
                backgroundColor: "var(--duo-canvas)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <span style={{ fontSize: "36px" }}>{bundle.icon}</span>
                <div>
                  <h4 style={{ fontWeight: 800, fontSize: "16px", color: "var(--duo-text)" }}>
                    {bundle.name} (+{bundle.amount} Gems)
                  </h4>
                  <p style={{ fontSize: "13px", color: "var(--duo-text-muted)" }}>
                    Instantly credit your learner balance
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  playCorrectSound();
                  if (profile) setProfile({ ...profile, gems: profile.gems + bundle.amount });
                  setMessage(`🎉 Purchased ${bundle.name}! Added +${bundle.amount} gems.`);
                }}
                className="duo-btn duo-btn-green"
                style={{ padding: "10px 20px", fontSize: "14px" }}
              >
                {bundle.price}
              </button>
            </div>
          ))}
        </div>
      </main>

      <RightSidebar
        streak={profile?.streak || 7}
        gems={profile?.gems || 780}
        hearts={profile?.hearts || 5}
        xp={profile?.total_xp || 345}
        onHeartsUpdated={(h, g) => {
          if (profile) setProfile({ ...profile, hearts: h, gems: g });
        }}
      />
    </div>
  );
}
