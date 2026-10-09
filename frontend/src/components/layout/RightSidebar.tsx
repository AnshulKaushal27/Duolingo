"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import HeartsModal from "./HeartsModal";
import { playClickSound } from "@/lib/sound";
import { api } from "@/lib/api";

interface RightSidebarProps {
  streak: number;
  gems: number;
  hearts: number;
  xp: number;
  courseCode?: string;
  courseTitle?: string;
  onHeartsUpdated: (newHearts: number, newGems: number) => void;
  onCourseSwitched?: (code: string) => void;
}

const AVAILABLE_COURSES = [
  { code: "es", title: "Spanish", flag: "/images/flags/es.svg", level: "Section 1 • 6 Units" },
  { code: "ja", title: "Japanese", flag: "/images/flags/ja.svg", level: "Section 1 • Hiragana & 6 Units" },
  { code: "fr", title: "French", flag: "/images/flags/fr.svg", level: "Section 1 • Intro" },
  { code: "de", title: "German", flag: "/images/flags/de.svg", level: "Section 1 • Basics" },
  { code: "chess", title: "Chess", flag: "/images/flags/chess.svg", level: "Section 1 • Openings" },
];

export default function RightSidebar({
  streak,
  gems,
  hearts,
  xp,
  courseCode = "es",
  courseTitle = "Spanish",
  onHeartsUpdated,
  onCourseSwitched,
}: RightSidebarProps) {
  const router = useRouter();
  const [heartsModalOpen, setHeartsModalOpen] = useState(false);

  // Active hover dropdown state: 'course' | 'streak' | 'gems' | 'hearts' | null
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (menu: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  // 7-day streak calendar days (Mon - Sun)
  const daysOfWeek = ["M", "T", "W", "T", "F", "S", "S"];
  const currentDayIndex = (new Date().getDay() + 6) % 7; // 0 = Mon, 6 = Sun

  return (
    <>
      {/* Mobile & Tablet Compact Top Stats Bar (< 1024px) */}
      <header className="duo-mobile-topbar">
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <img
            src={`/images/flags/${courseCode}.svg`}
            alt={courseTitle}
            style={{ width: "24px", height: "18px", borderRadius: "3px", objectFit: "cover" }}
          />
        </div>

        <div
          style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}
          onClick={() => playClickSound()}
        >
          <img src="/icons/streak-flame.svg" alt="Streak" style={{ width: "22px", height: "22px" }} />
          <span style={{ fontWeight: 800, fontSize: "14px", color: "var(--duo-orange)" }}>{streak}</span>
        </div>

        <div
          style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}
          onClick={() => playClickSound()}
        >
          <img src="/icons/gem.svg" alt="Gems" style={{ width: "22px", height: "22px" }} />
          <span style={{ fontWeight: 800, fontSize: "14px", color: "var(--duo-blue)" }}>{gems}</span>
        </div>

        <div
          style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}
          onClick={() => {
            playClickSound();
            setHeartsModalOpen(true);
          }}
        >
          <img src="/icons/heart.svg" alt="Hearts" style={{ width: "22px", height: "22px" }} />
          <span style={{ fontWeight: 800, fontSize: "14px", color: "var(--duo-red)" }}>{hearts}</span>
        </div>
      </header>

      <aside
        className="duo-right-sidebar"
        style={{
          padding: "20px 24px",
          gap: "24px",
        }}
      >
        {/* Top Floating Stats Bar with Authentic Hover Dropdown Menus */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "6px 0",
            position: "relative",
          }}
        >
          {/* 1. COURSE FLAG BUTTON */}
          <div
            style={{ position: "relative" }}
            onMouseEnter={() => handleMouseEnter("course")}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              onClick={() => {
                playClickSound();
                setActiveDropdown(activeDropdown === "course" ? null : "course");
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 10px",
                borderRadius: "14px",
                border: "2px solid var(--duo-border)",
                backgroundColor: activeDropdown === "course" ? "var(--duo-surface)" : "var(--duo-canvas)",
                cursor: "pointer",
                fontWeight: 800,
                fontSize: "14px",
                color: "var(--duo-text)",
                outline: "none",
                transition: "all 0.12s ease",
              }}
              title="Switch course"
            >
              <img
                src={`/images/flags/${courseCode}.svg`}
                alt={courseTitle}
                style={{
                  width: "28px",
                  height: "20px",
                  borderRadius: "4px",
                  objectFit: "cover",
                  display: "block",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              />
              <span style={{ fontSize: "11px", color: "var(--duo-text-muted)" }}>▼</span>
            </button>

            {/* Language Dropdown Popover */}
            {activeDropdown === "course" && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 10px)",
                  left: 0,
                  width: "280px",
                  backgroundColor: "var(--duo-canvas)",
                  border: "2px solid var(--duo-border)",
                  borderRadius: "18px",
                  boxShadow: "0 12px 32px rgba(0,0,0,0.22)",
                  padding: "16px",
                  zIndex: 100,
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  animation: "fadeIn 0.15s ease",
                }}
              >
                <div style={{ fontSize: "12px", fontWeight: 800, color: "var(--duo-text-muted)", letterSpacing: "0.8px", textTransform: "uppercase" }}>
                  MY COURSES
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {AVAILABLE_COURSES.map((c) => {
                    const isCurrent = c.code === courseCode;
                    return (
                      <div
                        key={c.code}
                        onClick={async () => {
                          playClickSound();
                          if (!isCurrent) {
                            try {
                              localStorage.setItem("duo_active_course", c.code);
                              await api.switchCourse(c.code).catch(() => {});
                              window.dispatchEvent(
                                new CustomEvent("duo:course_changed", {
                                  detail: { code: c.code, title: c.title },
                                })
                              );
                              if (onCourseSwitched) {
                                onCourseSwitched(c.code);
                              } else {
                                router.push(`/learn?course=${c.code}`);
                              }
                            } catch (e) {
                              console.error(e);
                            }
                          }
                          setActiveDropdown(null);
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "10px 12px",
                          borderRadius: "14px",
                          backgroundColor: isCurrent ? "var(--duo-surface)" : "transparent",
                          border: isCurrent ? "2px solid var(--duo-border)" : "2px solid transparent",
                          cursor: "pointer",
                          transition: "background-color 0.1s ease",
                        }}
                        onMouseEnter={(e) => {
                          if (!isCurrent) e.currentTarget.style.backgroundColor = "var(--duo-surface)";
                        }}
                        onMouseLeave={(e) => {
                          if (!isCurrent) e.currentTarget.style.backgroundColor = "transparent";
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <img
                            src={c.flag}
                            alt={c.title}
                            style={{ width: "32px", height: "24px", borderRadius: "4px", objectFit: "cover" }}
                          />
                          <div>
                            <div style={{ fontWeight: 800, fontSize: "15px", color: "var(--duo-text)" }}>
                              {c.title}
                            </div>
                            <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--duo-text-muted)" }}>
                              {c.level}
                            </div>
                          </div>
                        </div>
                        {isCurrent && (
                          <span style={{ color: "var(--duo-green)", fontWeight: 900, fontSize: "16px" }}>✓</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div style={{ height: "1px", backgroundColor: "var(--duo-border)", margin: "4px 0" }} />

                <Link
                  href="/onboarding/language"
                  onClick={() => playClickSound()}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    padding: "10px 14px",
                    borderRadius: "14px",
                    border: "2px dashed var(--duo-border)",
                    textDecoration: "none",
                    fontWeight: 800,
                    fontSize: "13px",
                    color: "var(--duo-blue)",
                    letterSpacing: "0.5px",
                  }}
                >
                  <span>+</span>
                  <span>ADD A NEW COURSE</span>
                </Link>
              </div>
            )}
          </div>

          {/* 2. STREAK FLAME BUTTON */}
          <div
            style={{ position: "relative" }}
            onMouseEnter={() => handleMouseEnter("streak")}
            onMouseLeave={handleMouseLeave}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontWeight: 800,
                fontSize: "15px",
                color: "var(--duo-orange)",
                cursor: "pointer",
                padding: "6px 8px",
                borderRadius: "12px",
                backgroundColor: activeDropdown === "streak" ? "var(--duo-surface)" : "transparent",
                transition: "background-color 0.12s ease",
              }}
              onClick={() => {
                playClickSound();
                setActiveDropdown(activeDropdown === "streak" ? null : "streak");
              }}
            >
              <img src="/icons/streak-flame.svg" alt="Streak" style={{ width: "24px", height: "24px" }} />
              <span>{streak}</span>
            </div>

            {/* Streak Dropdown Popover */}
            {activeDropdown === "streak" && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 10px)",
                  right: "-40px",
                  width: "290px",
                  backgroundColor: "var(--duo-canvas)",
                  border: "2px solid var(--duo-border)",
                  borderRadius: "18px",
                  boxShadow: "0 12px 32px rgba(0,0,0,0.22)",
                  padding: "18px",
                  zIndex: 100,
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  animation: "fadeIn 0.15s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <img src="/icons/streak-flame.svg" alt="Streak" style={{ width: "36px", height: "36px" }} />
                  <div>
                    <h4 style={{ fontSize: "18px", fontWeight: 800, color: "var(--duo-text)" }}>
                      {streak} day streak!
                    </h4>
                    <p style={{ fontSize: "12px", color: "var(--duo-text-muted)", fontWeight: 600 }}>
                      Practice today to keep it active
                    </p>
                  </div>
                </div>

                {/* 7-Day Calendar Streak Visual */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "12px 8px",
                    backgroundColor: "var(--duo-surface)",
                    borderRadius: "14px",
                  }}
                >
                  {daysOfWeek.map((day, idx) => {
                    const isStreakDay = idx <= currentDayIndex;
                    return (
                      <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                        <span style={{ fontSize: "11px", fontWeight: 800, color: "var(--duo-text-muted)" }}>
                          {day}
                        </span>
                        <div
                          style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "50%",
                            backgroundColor: isStreakDay ? "var(--duo-orange)" : "transparent",
                            border: isStreakDay ? "none" : "2px solid var(--duo-border)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#ffffff",
                            fontSize: "13px",
                            fontWeight: 800,
                          }}
                        >
                          {isStreakDay ? "🔥" : ""}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <p style={{ fontSize: "12px", fontWeight: 700, color: "var(--duo-text-muted)", textAlign: "center", margin: 0 }}>
                  Practice each day so your streak won&apos;t reset!
                </p>
              </div>
            )}
          </div>

          {/* 3. GEMS BUTTON */}
          <div
            style={{ position: "relative" }}
            onMouseEnter={() => handleMouseEnter("gems")}
            onMouseLeave={handleMouseLeave}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontWeight: 800,
                fontSize: "15px",
                color: "var(--duo-blue)",
                cursor: "pointer",
                padding: "6px 8px",
                borderRadius: "12px",
                backgroundColor: activeDropdown === "gems" ? "var(--duo-surface)" : "transparent",
                transition: "background-color 0.12s ease",
              }}
              onClick={() => {
                playClickSound();
                setActiveDropdown(activeDropdown === "gems" ? null : "gems");
              }}
            >
              <img src="/icons/gem.svg" alt="Gems" style={{ width: "22px", height: "22px" }} />
              <span>{gems}</span>
            </div>

            {/* Gems Dropdown Popover */}
            {activeDropdown === "gems" && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 10px)",
                  right: "-20px",
                  width: "270px",
                  backgroundColor: "var(--duo-canvas)",
                  border: "2px solid var(--duo-border)",
                  borderRadius: "18px",
                  boxShadow: "0 12px 32px rgba(0,0,0,0.22)",
                  padding: "18px",
                  zIndex: 100,
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  animation: "fadeIn 0.15s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <img src="/icons/gem.svg" alt="Gems" style={{ width: "36px", height: "36px" }} />
                  <div>
                    <h4 style={{ fontSize: "18px", fontWeight: 800, color: "var(--duo-text)" }}>
                      {gems} Gems
                    </h4>
                    <p style={{ fontSize: "12px", color: "var(--duo-text-muted)", fontWeight: 600 }}>
                      Duolingo Currency
                    </p>
                  </div>
                </div>

                <p style={{ fontSize: "13px", color: "var(--duo-text)", lineHeight: 1.4, margin: 0 }}>
                  You have <strong>{gems} gems</strong>. Spend them on streak freezes, heart refills, and outfits in the Shop!
                </p>

                <Link
                  href="/shop"
                  onClick={() => playClickSound()}
                  className="duo-btn duo-btn-blue"
                  style={{ width: "100%", padding: "10px", fontSize: "13px", textDecoration: "none" }}
                >
                  GO TO SHOP
                </Link>
              </div>
            )}
          </div>

          {/* 4. HEARTS BUTTON */}
          <div
            style={{ position: "relative" }}
            onMouseEnter={() => handleMouseEnter("hearts")}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => {
                playClickSound();
                setHeartsModalOpen(true);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontWeight: 800,
                fontSize: "15px",
                color: "var(--duo-red)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "6px 8px",
                borderRadius: "12px",
                backgroundColor: activeDropdown === "hearts" ? "var(--duo-surface)" : "transparent",
                transition: "background-color 0.12s ease",
              }}
            >
              <img src="/icons/heart.svg" alt="Hearts" style={{ width: "22px", height: "22px" }} />
              <span>{hearts}</span>
            </button>

            {/* Hearts Dropdown Popover */}
            {activeDropdown === "hearts" && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 10px)",
                  right: 0,
                  width: "280px",
                  backgroundColor: "var(--duo-canvas)",
                  border: "2px solid var(--duo-border)",
                  borderRadius: "18px",
                  boxShadow: "0 12px 32px rgba(0,0,0,0.22)",
                  padding: "18px",
                  zIndex: 100,
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                  animation: "fadeIn 0.15s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <img src="/icons/heart.svg" alt="Hearts" style={{ width: "36px", height: "36px" }} />
                  <div>
                    <h4 style={{ fontSize: "18px", fontWeight: 800, color: "var(--duo-text)" }}>
                      {hearts} / 5 Hearts
                    </h4>
                    <p style={{ fontSize: "12px", color: "var(--duo-text-muted)", fontWeight: 600 }}>
                      {hearts === 5 ? "Full Health" : "Hearts depleted"}
                    </p>
                  </div>
                </div>

                <p style={{ fontSize: "13px", color: "var(--duo-text)", lineHeight: 1.4, margin: 0 }}>
                  {hearts === 5
                    ? "You have full health! Complete lessons without mistakes to maintain your streak."
                    : "Need more hearts? Practice skills to earn hearts back without spending gems!"}
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <Link
                    href="/practice"
                    onClick={() => playClickSound()}
                    className="duo-btn duo-btn-blue"
                    style={{ width: "100%", padding: "10px", fontSize: "13px", textDecoration: "none" }}
                  >
                    PRACTICE FOR HEARTS
                  </Link>

                  <button
                    onClick={() => {
                      playClickSound();
                      setActiveDropdown(null);
                      setHeartsModalOpen(true);
                    }}
                    className="duo-btn duo-btn-outline"
                    style={{ width: "100%", padding: "10px", fontSize: "13px" }}
                  >
                    REFILL HEARTS
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Super Duolingo Promo Card (Matching 3rd Screenshot) */}
        <div
          style={{
            padding: "20px",
            borderRadius: "20px",
            border: "2px solid var(--duo-border)",
            backgroundColor: "var(--duo-canvas)",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Header row with Super badge and winged mascot */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <span
                style={{
                  display: "inline-block",
                  padding: "4px 10px",
                  borderRadius: "8px",
                  background: "linear-gradient(90deg, #58cc02, #1cb0f6, #ce82ff)",
                  color: "#ffffff",
                  fontSize: "11px",
                  fontWeight: 900,
                  letterSpacing: "0.8px",
                  marginBottom: "8px",
                }}
              >
                SUPER
              </span>
              <h4 style={{ fontWeight: 800, fontSize: "17px", color: "var(--duo-text)", margin: "0 0 4px 0" }}>
                Try Super for free
              </h4>
              <p style={{ fontSize: "13px", color: "var(--duo-text-muted)", lineHeight: 1.35, margin: 0, maxWidth: "180px" }}>
                No ads, personalized practice, and unlimited Legendary!
              </p>
            </div>

            {/* Glowing Super Duo Winged Icon */}
            <div
              style={{
                width: "68px",
                height: "68px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #1cb0f6 0%, #ce82ff 50%, #ff4b4b 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 16px rgba(206, 130, 255, 0.4)",
              }}
            >
              <span style={{ fontSize: "36px" }}>🦉</span>
            </div>
          </div>

          <Link
            href="/shop"
            onClick={() => playClickSound()}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "12px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #1cb0f6 0%, #58cc02 100%)",
              color: "#ffffff",
              fontWeight: 800,
              fontSize: "14px",
              letterSpacing: "0.8px",
              textDecoration: "none",
              textTransform: "uppercase",
              boxShadow: "0 4px 0 #1899d6",
              transition: "transform 0.08s ease",
            }}
          >
            TRY 1 WEEK FREE
          </Link>
        </div>

        {/* Unlock Leaderboards Card (Matching 3rd Screenshot) */}
        <div
          style={{
            padding: "20px",
            borderRadius: "20px",
            border: "2px solid var(--duo-border)",
            backgroundColor: "var(--duo-canvas)",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <h4 style={{ fontWeight: 800, fontSize: "17px", color: "var(--duo-text)", margin: 0 }}>
            Unlock Leaderboards!
          </h4>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                backgroundColor: "var(--duo-surface)",
                border: "2px solid var(--duo-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
              }}
            >
              🛡️
            </div>
            <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--duo-text-muted)", lineHeight: 1.35, margin: 0 }}>
              Complete 2 more lessons to start competing
            </p>
          </div>
        </div>

        {/* Daily Quests Card (Matching 3rd Screenshot) */}
        <div
          style={{
            padding: "20px",
            borderRadius: "20px",
            border: "2px solid var(--duo-border)",
            backgroundColor: "var(--duo-canvas)",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h4 style={{ fontWeight: 800, fontSize: "17px", color: "var(--duo-text)", margin: 0 }}>
              Daily Quests
            </h4>
            <Link
              href="/quests"
              style={{ fontSize: "13px", fontWeight: 800, color: "var(--duo-blue)", textDecoration: "none" }}
            >
              VIEW ALL
            </Link>
          </div>

          {/* Quest item 1 */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ fontSize: "24px" }}>⚡</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: 700, marginBottom: "4px" }}>
                <span>Earn 20 XP</span>
                <span style={{ color: "var(--duo-text-muted)" }}>{Math.min(20, xp % 30)} / 20</span>
              </div>
              <div className="duo-progress-track" style={{ height: "10px" }}>
                <div className="duo-progress-fill" style={{ width: `${Math.min(100, ((xp % 30) / 20) * 100)}%` }} />
              </div>
            </div>
            <img src="/icons/chest.svg" alt="Chest" style={{ width: "24px", height: "24px" }} />
          </div>
        </div>
      </aside>

      {/* Hearts Modal */}
      <HeartsModal
        isOpen={heartsModalOpen}
        onClose={() => setHeartsModalOpen(false)}
        hearts={hearts}
        gems={gems}
        onHeartsUpdated={onHeartsUpdated}
      />
    </>
  );
}
