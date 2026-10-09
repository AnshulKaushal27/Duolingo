"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { playClickSound } from "@/lib/sound";

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

interface SidebarProps {
  activeCourse?: string;
}

const CHARACTER_LANGUAGES: Record<string, NavItem> = {
  ja: { label: "CHARACTERS", href: "/characters", icon: "あ" },
  ko: { label: "CHARACTERS", href: "/characters", icon: "ㅎ" },
  zh: { label: "CHARACTERS", href: "/characters", icon: "字" },
  ru: { label: "CHARACTERS", href: "/characters", icon: "Д" },
  hi: { label: "CHARACTERS", href: "/characters", icon: "अ" },
  ar: { label: "CHARACTERS", href: "/characters", icon: "ع" },
};

const BASE_NAV_ITEMS_BEFORE: NavItem[] = [
  { label: "LEARN", href: "/learn", icon: "🏠" },
];

const BASE_NAV_ITEMS_AFTER: NavItem[] = [
  { label: "PRACTICE", href: "/practice", icon: "🏋️" },
  { label: "LEADERBOARDS", href: "/leaderboard", icon: "🏆" },
  { label: "QUESTS", href: "/quests", icon: "📜" },
  { label: "SHOP", href: "/shop", icon: "🏪" },
  { label: "PROFILE", href: "/profile", icon: "👤" },
];

export default function Sidebar({ activeCourse }: SidebarProps = {}) {
  const pathname = usePathname();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();

  const [currentCourse, setCurrentCourse] = useState<string>(() => {
    if (activeCourse) return activeCourse.toLowerCase();
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("duo_active_course");
      if (stored) return stored.toLowerCase();
    }
    return user?.current_course_code?.toLowerCase() || "es";
  });

  useEffect(() => {
    if (activeCourse) {
      setCurrentCourse(activeCourse.toLowerCase());
      return;
    }
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("duo_active_course");
      if (stored) {
        setCurrentCourse(stored.toLowerCase());
        return;
      }
    }
    if (user?.current_course_code) {
      setCurrentCourse(user.current_course_code.toLowerCase());
    }
  }, [activeCourse, user?.current_course_code]);

  useEffect(() => {
    const handleCourseChanged = (e: any) => {
      const code = e.detail?.code?.toLowerCase();
      if (code) {
        setCurrentCourse(code);
      }
    };
    window.addEventListener("duo:course_changed", handleCourseChanged);
    return () => window.removeEventListener("duo:course_changed", handleCourseChanged);
  }, []);

  const navItems = React.useMemo(() => {
    const charTab = CHARACTER_LANGUAGES[currentCourse];
    if (charTab) {
      return [...BASE_NAV_ITEMS_BEFORE, charTab, ...BASE_NAV_ITEMS_AFTER];
    }
    return [...BASE_NAV_ITEMS_BEFORE, ...BASE_NAV_ITEMS_AFTER];
  }, [currentCourse]);

  useEffect(() => {
    const saved = localStorage.getItem("duo-theme") as "light" | "dark";
    if (saved) {
      setTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
    }
  }, []);

  // Close MORE menu on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setShowMoreMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("duo-theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  return (
    <>
      <aside
        className="duo-sidebar-desktop"
        style={{
          borderRight: "2px solid var(--duo-border)",
          backgroundColor: "var(--duo-canvas)",
        }}
      >
      {/* Brand Header */}
      <Link
        href="/learn"
        onClick={() => playClickSound()}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "0 12px 28px 12px",
          textDecoration: "none",
        }}
      >
        <img src="/mascot/duo-happy.svg" alt="Duo" style={{ width: "36px", height: "36px" }} />
        <span
          style={{
            color: "var(--duo-green)",
            fontWeight: 900,
            fontSize: "28px",
            letterSpacing: "-0.5px",
          }}
        >
          duolingo
        </span>
      </Link>

      {/* Navigation List */}
      <nav style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href === "/learn" && pathname === "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => playClickSound()}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                padding: "12px 16px",
                borderRadius: "14px",
                textDecoration: "none",
                fontWeight: 800,
                fontSize: "15px",
                letterSpacing: "0.8px",
                transition: "all 0.1s ease",
                backgroundColor: isActive ? "var(--duo-blue-bg)" : "transparent",
                color: isActive ? "var(--duo-blue-dark)" : "var(--duo-text)",
                border: isActive ? "2px solid var(--duo-blue)" : "2px solid transparent",
              }}
            >
              <span style={{ fontSize: "20px" }}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}

        {/* ... MORE Navigation Button (Matching 3rd and 4th Screenshot) */}
        <div ref={moreRef} style={{ position: "relative" }}>
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setShowMoreMenu(!showMoreMenu);
            }}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "16px",
              padding: "12px 16px",
              borderRadius: "14px",
              fontWeight: 800,
              fontSize: "15px",
              letterSpacing: "0.8px",
              backgroundColor: showMoreMenu ? "var(--duo-surface)" : "transparent",
              color: "var(--duo-text)",
              border: showMoreMenu ? "2px solid var(--duo-border)" : "2px solid transparent",
              cursor: "pointer",
              outline: "none",
              transition: "all 0.1s ease",
            }}
            onMouseEnter={(e) => {
              if (!showMoreMenu) e.currentTarget.style.backgroundColor = "var(--duo-surface)";
            }}
            onMouseLeave={(e) => {
              if (!showMoreMenu) e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            {/* Purple circle with three dots icon matching Image 4 */}
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                backgroundColor: "#ce82ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                fontWeight: 900,
                fontSize: "16px",
                letterSpacing: "1px",
              }}
            >
              •••
            </div>
            <span>MORE</span>
          </button>

          {/* MORE Popover Menu (1:1 replica of Image 4) */}
          {showMoreMenu && (
            <div
              style={{
                position: "absolute",
                bottom: "calc(100% + 8px)",
                left: 0,
                width: "260px",
                backgroundColor: "var(--duo-canvas)",
                border: "2px solid var(--duo-border)",
                borderRadius: "18px",
                boxShadow: "0 12px 32px rgba(0,0,0,0.25)",
                padding: "8px 0",
                zIndex: 100,
                display: "flex",
                flexDirection: "column",
                animation: "fadeIn 0.15s ease",
              }}
            >
              {/* Item 1: Duolingo English Test with Green Owl Icon */}
              <a
                href="https://englishtest.duolingo.com"
                target="_blank"
                rel="noreferrer"
                onClick={() => playClickSound()}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "14px 18px",
                  textDecoration: "none",
                  color: "var(--duo-text)",
                  fontWeight: 800,
                  fontSize: "14px",
                  letterSpacing: "0.5px",
                  transition: "background-color 0.1s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--duo-surface)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <div
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    backgroundColor: "#58cc02",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontSize: "18px" }}>🦉</span>
                </div>
                <span>DUOLINGO ENGLISH TEST</span>
              </a>

              {/* Divider Line */}
              <div style={{ height: "1px", backgroundColor: "var(--duo-border)", margin: "4px 0" }} />

              {/* Item 2: SETTINGS */}
              <Link
                href="/settings"
                onClick={() => {
                  playClickSound();
                  setShowMoreMenu(false);
                }}
                style={{
                  padding: "12px 18px",
                  textDecoration: "none",
                  color: "var(--duo-text)",
                  fontWeight: 800,
                  fontSize: "14px",
                  letterSpacing: "0.8px",
                  transition: "background-color 0.1s ease",
                  display: "block",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--duo-surface)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                SETTINGS
              </Link>

              {/* Item 3: HELP */}
              <a
                href="https://support.duolingo.com"
                target="_blank"
                rel="noreferrer"
                onClick={() => playClickSound()}
                style={{
                  padding: "12px 18px",
                  textDecoration: "none",
                  color: "var(--duo-text)",
                  fontWeight: 800,
                  fontSize: "14px",
                  letterSpacing: "0.8px",
                  transition: "background-color 0.1s ease",
                  display: "block",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--duo-surface)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                HELP
              </a>

              {/* Item 4: LOG OUT */}
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setShowMoreMenu(false);
                  logout();
                }}
                style={{
                  width: "100%",
                  textAlign: "left",
                  background: "none",
                  border: "none",
                  padding: "12px 18px",
                  color: "var(--duo-red)",
                  fontWeight: 800,
                  fontSize: "14px",
                  letterSpacing: "0.8px",
                  cursor: "pointer",
                  transition: "background-color 0.1s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--duo-surface)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                LOG OUT
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Footer / User Profile & Actions */}
      <div style={{ paddingTop: "14px", borderTop: "2px solid var(--duo-border)", display: "flex", flexDirection: "column", gap: "8px" }}>
        {user && (
          <Link
            href="/profile"
            onClick={() => playClickSound()}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px 12px",
              borderRadius: "12px",
              textDecoration: "none",
              backgroundColor: "var(--duo-surface)",
              border: "2px solid var(--duo-border)",
            }}
          >
            <img
              src={user.avatar_url || "/mascot/duo-happy.svg"}
              alt={user.display_name}
              style={{ width: "30px", height: "30px", borderRadius: "50%" }}
            />
            <div style={{ display: "flex", flexDirection: "column", overflow: "hidden", flex: 1 }}>
              <span style={{ fontSize: "13px", fontWeight: 800, color: "var(--duo-text-dark)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user.display_name}
              </span>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--duo-text-muted)" }}>
                @{user.username}
              </span>
            </div>
          </Link>
        )}

        <button
          onClick={toggleTheme}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 12px",
            borderRadius: "12px",
            border: "2px solid var(--duo-border)",
            backgroundColor: "var(--duo-surface)",
            color: "var(--duo-text)",
            fontWeight: 700,
            fontSize: "13px",
            cursor: "pointer",
          }}
        >
          <span>{theme === "light" ? "☀️ Light" : "🌙 Dark"}</span>
          <span style={{ fontSize: "11px", color: "var(--duo-text-muted)" }}>Toggle</span>
        </button>
      </div>
    </aside>

    {/* Mobile Bottom Navigation Bar (< 768px viewports) */}
    <nav className="duo-bottom-nav">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href === "/learn" && pathname === "/");
        return (
          <Link
            key={`mobile-${item.href}`}
            href={item.href}
            className="duo-bottom-nav-item"
            onClick={() => playClickSound()}
            style={{
              backgroundColor: isActive ? "var(--duo-blue-bg)" : "transparent",
            }}
          >
            <span style={{ fontSize: "22px", lineHeight: 1 }}>{item.icon}</span>
            <span
              style={{
                fontSize: "10px",
                fontWeight: 800,
                marginTop: "3px",
                letterSpacing: "0.5px",
                color: isActive ? "var(--duo-blue)" : "var(--duo-text-muted)",
              }}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  </>
  );
}
