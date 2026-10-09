"use client";

import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "@/components/layout/Sidebar";
import RightSidebar from "@/components/layout/RightSidebar";
import UnitSection from "@/components/path/UnitSection";
import StickyUnitHeader from "@/components/path/StickyUnitHeader";
import ScrollToTopButton from "@/components/common/ScrollToTopButton";
import GuidebookModal from "@/components/path/GuidebookModal";
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
  const [activeCourse, setActiveCourse] = useState<string>("es");
  const [tree, setTree] = useState<CourseTree | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeUnitNumber, setActiveUnitNumber] = useState<number>(1);
  const [guidebookTarget, setGuidebookTarget] = useState<{
    unitId: number;
    unitTitle: string;
    unitColor: string;
  } | null>(null);

  // Load course tree for a given code
  const loadCourseData = useCallback(async (courseCode: string) => {
    try {
      setLoading(true);
      let treeData = null;
      let profData = null;
      try {
        treeData = await api.getCourseTree(courseCode);
      } catch (err) {
        console.error("Failed to load course tree for", courseCode, err);
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
  }, []);

  // Initial load: resolve course from query param, localStorage, or user profile
  useEffect(() => {
    let resolvedCode = "es";
    if (typeof window !== "undefined") {
      const param = new URLSearchParams(window.location.search).get("course");
      const stored = localStorage.getItem("duo_active_course");
      if (param) {
        resolvedCode = param.toLowerCase();
      } else if (stored) {
        resolvedCode = stored.toLowerCase();
      } else if (user?.current_course_code) {
        resolvedCode = user.current_course_code.toLowerCase();
      }
    }
    setActiveCourse(resolvedCode);
    loadCourseData(resolvedCode);

    const handleBackendOnline = () => {
      loadCourseData(resolvedCode);
    };

    const handleCourseChanged = (e: any) => {
      const newCode = e.detail?.code?.toLowerCase() || "es";
      setActiveCourse(newCode);
      loadCourseData(newCode);
    };

    window.addEventListener("duo:backend_online", handleBackendOnline);
    window.addEventListener("duo:course_changed", handleCourseChanged);

    return () => {
      window.removeEventListener("duo:backend_online", handleBackendOnline);
      window.removeEventListener("duo:course_changed", handleCourseChanged);
    };
  }, [user?.current_course_code, loadCourseData]);

  const handleCourseSwitched = async (newCode: string) => {
    const code = newCode.toLowerCase();
    setActiveCourse(code);
    if (typeof window !== "undefined") {
      localStorage.setItem("duo_active_course", code);
      const url = new URL(window.location.href);
      url.searchParams.set("course", code);
      window.history.replaceState({}, "", url.toString());
    }
    await loadCourseData(code);
  };

  const refreshPath = async () => {
    try {
      let treeData = null;
      let profData = null;
      try {
        treeData = await api.getCourseTree(activeCourse);
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
    } else {
      updateUserLocally((prev) => (prev ? { ...prev, gems: newGems } : null));
    }
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("duo:gems_updated", { detail: { gems: newGems } }));
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
    } else {
      updateUserLocally((prev) => (prev ? { ...prev, hearts: newHearts, gems: newGems } : null));
    }
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("duo:gems_updated", { detail: { gems: newGems } }));
      window.dispatchEvent(new CustomEvent("duo:hearts_updated", { detail: { hearts: newHearts } }));
    }
  };

  // Dynamic Scroll Tracking: Detect which Unit is currently in the active viewport area
  useEffect(() => {
    const handleScroll = () => {
      if (!tree || !tree.units || tree.units.length === 0) return;

      const stickyThreshold = 180; // px from top of viewport
      let currentActive = tree.units[0].unit_number;

      for (const unit of tree.units) {
        const el = document.getElementById(`unit-section-${unit.unit_number}`);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        // If the top of this unit is at or above the threshold and its bottom is still below the threshold
        if (rect.top <= stickyThreshold && rect.bottom > stickyThreshold) {
          currentActive = unit.unit_number;
          break;
        }
      }

      setActiveUnitNumber(currentActive);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [tree]);

  const handlePreviousUnit = () => {
    if (activeUnitNumber > 1) {
      const targetUnit = activeUnitNumber - 1;
      const prevEl = document.getElementById(`unit-section-${targetUnit}`);
      if (prevEl) {
        const rect = prevEl.getBoundingClientRect();
        const targetY = window.scrollY + rect.top - 100;
        window.scrollTo({ top: Math.max(0, targetY), behavior: "smooth" });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const activeUnit =
    tree?.units.find((u) => u.unit_number === activeUnitNumber) || tree?.units[0] || null;

  return (
    <div className="duo-app-layout">
      {/* 1. Left Fixed Sidebar */}
      <Sidebar activeCourse={activeCourse} />

      {/* 2. Middle Content Feed (Serpentine Learning Path) */}
      <main className="duo-main-content">
        {/* Dynamic Sticky Unit Header (Remains fixed on top and dynamically changes as units scroll) */}
        {!loading && activeUnit && (
          <StickyUnitHeader
            activeUnit={activeUnit}
            courseCode={tree?.code || activeCourse}
            onOpenGuidebook={(unitId, unitTitle, unitColor) => {
              setGuidebookTarget({ unitId, unitTitle, unitColor });
            }}
            onPreviousUnit={handlePreviousUnit}
          />
        )}

        {loading ? (
          <div style={{ padding: "60px 0", textAlign: "center" }}>
            <img
              src="/mascot/duo-happy.svg"
              alt="Loading"
              style={{ width: "80px", height: "80px", animation: "duoBounce 1s infinite" }}
            />
            <h3
              style={{
                fontSize: "18px",
                fontWeight: 800,
                marginTop: "16px",
                color: "var(--duo-text-muted)",
              }}
            >
              Loading {activeCourse === "ja" ? "Japanese" : "Spanish"} learning path...
            </h3>
          </div>
        ) : tree && tree.units.length > 0 ? (
          tree.units.map((unit) => (
            <UnitSection
              key={unit.id}
              unit={unit}
              courseCode={tree.code || activeCourse}
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
        gems={profile?.gems ?? (user?.gems ?? 0)}
        hearts={profile?.hearts ?? (user?.hearts ?? 5)}
        xp={profile?.total_xp ?? (user?.total_xp ?? 0)}
        courseCode={tree?.code || activeCourse}
        courseTitle={tree?.title || (activeCourse === "ja" ? "Japanese" : "Spanish")}
        onHeartsUpdated={handleHeartsUpdated}
        onCourseSwitched={handleCourseSwitched}
      />

      {/* 4. Floating Scroll To Top Button */}
      <ScrollToTopButton />

      {/* 5. Guidebook Modal */}
      {guidebookTarget && (
        <GuidebookModal
          unitId={guidebookTarget.unitId}
          unitTitle={guidebookTarget.unitTitle}
          unitColor={guidebookTarget.unitColor}
          courseCode={tree?.code || activeCourse}
          onClose={() => setGuidebookTarget(null)}
        />
      )}
    </div>
  );
}
