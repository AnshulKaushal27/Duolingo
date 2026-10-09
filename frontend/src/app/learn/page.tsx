"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import RightSidebar from "@/components/layout/RightSidebar";
import UnitSection from "@/components/path/UnitSection";
import { api, CourseTree, UserProfile } from "@/lib/api";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/lib/auth-context";

export default function LearnPage() {
  return (
    <ProtectedRoute>
      <LearnContent />
    </ProtectedRoute>
  );
}

function LearnContent() {
  const { user, updateUserLocally } = useAuth();
  const [tree, setTree] = useState<CourseTree | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        let treeData = null;
        let profData = null;
        try {
          treeData = await api.getCourseTree("es");
        } catch (err) {
          console.error("Failed to load course tree", err);
        }
        try {
          profData = await api.getUserProfile();
        } catch {
          profData = null;
        }
        setTree(treeData);
        setProfile(profData);
      } catch (err) {
        console.error("Failed to load path data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const refreshPath = async () => {
    try {
      let treeData = null;
      let profData = null;
      try {
        treeData = await api.getCourseTree("es");
      } catch {}
      try {
        profData = await api.getUserProfile();
      } catch {}
      if (treeData) setTree(treeData);
      if (profData) setProfile(profData);
    } catch (err) {
      console.error("Failed to reload path", err);
    }
  };

  const handleGemsUpdated = (newGems: number) => {
    if (profile) {
      const updated = { ...profile, gems: newGems };
      setProfile(updated);
      updateUserLocally(() => updated);
    }
  };

  const handleHeartsUpdated = (newHearts: number, newGems: number) => {
    if (profile) {
      const updated = {
        ...profile,
        hearts: newHearts,
        gems: newGems,
      };
      setProfile(updated);
      updateUserLocally(() => updated);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "var(--duo-canvas)" }}>
      {/* 1. Left Fixed Sidebar */}
      <Sidebar />

      {/* 2. Middle Content Feed (Serpentine Learning Path) */}
      <main
        style={{
          marginLeft: "256px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "32px 24px 80px 24px",
          maxWidth: "760px",
          width: "100%",
        }}
      >
        {loading ? (
          <div style={{ padding: "60px 0", textAlign: "center" }}>
            <img src="/mascot/duo-happy.svg" alt="Loading" style={{ width: "80px", height: "80px", animation: "duoBounce 1s infinite" }} />
            <h3 style={{ fontSize: "18px", fontWeight: 800, marginTop: "16px", color: "var(--duo-text-muted)" }}>
              Loading learning path...
            </h3>
          </div>
        ) : tree && tree.units.length > 0 ? (
          tree.units.map((unit) => (
            <UnitSection
              key={unit.id}
              unit={unit}
              onRefreshPath={refreshPath}
              onGemsUpdated={handleGemsUpdated}
            />
          ))
        ) : (
          <div style={{ padding: "60px 0", textAlign: "center" }}>
            <p>No units available. Please check backend connection.</p>
          </div>
        )}
      </main>

      {/* 3. Right Sticky Sidebar */}
      <RightSidebar
        streak={profile?.streak ?? (user?.streak ?? 1)}
        gems={profile?.gems ?? (user?.gems ?? 505)}
        hearts={profile?.hearts ?? (user?.hearts ?? 5)}
        xp={profile?.total_xp ?? (user?.total_xp ?? 20)}
        courseCode={tree?.code || "es"}
        courseTitle={tree?.title || "Spanish"}
        onHeartsUpdated={handleHeartsUpdated}
      />
    </div>
  );
}
