"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useOnboarding } from "@/lib/onboarding-context";
import { playClickSound } from "@/lib/sound";

interface CourseOption {
  id: string;
  name: string;
  flag: string;
  learners: string;
}

const COURSES: CourseOption[] = [
  { id: "es", name: "Spanish", flag: "/images/flags/es.svg", learners: "42M learners" },
  { id: "fr", name: "French", flag: "/images/flags/fr.svg", learners: "22.7M learners" },
  { id: "chess", name: "Chess", flag: "/images/flags/chess.svg", learners: "" },
  { id: "en", name: "English", flag: "/images/flags/en.svg", learners: "19.8M learners" },
  { id: "ja", name: "Japanese", flag: "/images/flags/ja.svg", learners: "17.9M learners" },
  { id: "de", name: "German", flag: "/images/flags/de.svg", learners: "15.9M learners" },
  { id: "math", name: "Math", flag: "/images/flags/math.svg", learners: "" },
  { id: "hi", name: "Hindi", flag: "/images/flags/hi.svg", learners: "13.6M learners" },
  { id: "it", name: "Italian", flag: "/images/flags/it.svg", learners: "10.2M learners" },
  { id: "ko", name: "Korean", flag: "/images/flags/ko.svg", learners: "12.1M learners" },
  { id: "zh", name: "Chinese", flag: "/images/flags/zh.svg", learners: "9.2M learners" },
  { id: "pt", name: "Portuguese", flag: "/images/flags/pt.svg", learners: "4.6M learners" },
];

const SITE_LANGUAGES = [
  "English",
  "Español",
  "Français",
  "Deutsch",
  "Italiano",
  "Português",
  "日本語",
  "中文",
  "हिन्दी",
];

export default function LanguagePickerPage() {
  const router = useRouter();
  const { state, setTargetLanguage } = useOnboarding();
  const [selected, setSelected] = useState<string>(state.targetLanguage || "");
  const [siteLang, setSiteLang] = useState<string>("ENGLISH");
  const [showLangMenu, setShowLangMenu] = useState<boolean>(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  // Close site language dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setShowLangMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (course: CourseOption) => {
    setSelected(course.id);
    playClickSound();
    setTargetLanguage(course.id, course.name);

    // Tactile delay matching Duolingo's authentic registration transition
    setTimeout(() => {
      router.push("/welcome");
    }, 280);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#ffffff", display: "flex", flexDirection: "column" }}>
      {/* Duolingo Register Top Header (1:1 replica of duolingo.com/register) */}
      <header
        style={{
          width: "100%",
          height: "70px",
          borderBottom: "2px solid #e5e5e5",
          backgroundColor: "#ffffff",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: "1040px",
            height: "100%",
            margin: "0 auto",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Duolingo Logo (Owl Mascot + Wordmark) */}
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              outline: "none",
            }}
            aria-label="Duolingo Home"
          >
            <img
              src="/images/duo-logo-full.svg"
              alt="Duolingo"
              style={{
                height: "36px",
                width: "auto",
                display: "block",
              }}
            />
          </Link>

          {/* Site Language Dropdown */}
          <div ref={langMenuRef} style={{ position: "relative" }}>
            <button
              type="button"
              onClick={() => setShowLangMenu(!showLangMenu)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 12px",
                borderRadius: "12px",
                color: "#777777",
                fontSize: "13px",
                fontWeight: 800,
                letterSpacing: "0.8px",
                textTransform: "uppercase",
                outline: "none",
                transition: "color 0.15s ease, background-color 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#4b4b4b";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#777777";
              }}
            >
              <span>SITE LANGUAGE: {siteLang}</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  transform: showLangMenu ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease",
                }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {showLangMenu && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 6px)",
                  right: 0,
                  backgroundColor: "#ffffff",
                  border: "2px solid #e5e5e5",
                  borderRadius: "16px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  padding: "8px 0",
                  minWidth: "180px",
                  zIndex: 100,
                  maxHeight: "320px",
                  overflowY: "auto",
                }}
              >
                {SITE_LANGUAGES.map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => {
                      setSiteLang(lang.toUpperCase());
                      setShowLangMenu(false);
                    }}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "10px 18px",
                      background: "none",
                      border: "none",
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#4b4b4b",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f7f7f7";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <span>{lang}</span>
                    {siteLang === lang.toUpperCase() && (
                      <span style={{ color: "#58cc02", fontWeight: 800 }}>✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main
        style={{
          flex: 1,
          width: "100%",
          maxWidth: "1040px",
          margin: "0 auto",
          padding: "48px 24px 64px 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Title */}
        <h1
          style={{
            fontSize: "32px",
            fontWeight: 800,
            color: "#3c3c3c",
            textAlign: "center",
            margin: "0 0 40px 0",
            letterSpacing: "-0.2px",
          }}
        >
          I want to learn...
        </h1>

        {/* 4-Column Course Cards Grid */}
        <div
          className="duo-courses-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "18px",
            width: "100%",
          }}
        >
          {COURSES.map((course) => {
            const isSelected = selected === course.id;
            return (
              <button
                key={course.id}
                type="button"
                onClick={() => handleSelect(course)}
                style={{
                  minHeight: "182px",
                  padding: "24px 16px 20px 16px",
                  borderRadius: "20px",
                  border: isSelected ? "2px solid #cecece" : "2px solid #e5e5e5",
                  borderBottom: isSelected ? "4px solid #cecece" : "4px solid #e5e5e5",
                  backgroundColor: isSelected ? "#e5e5e5" : "#ffffff",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  outline: "none",
                  transition: "background-color 0.12s ease, border-color 0.12s ease, transform 0.08s ease, border-bottom-width 0.08s ease",
                  userSelect: "none",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = "#f7f7f7";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = "#ffffff";
                  }
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = "translateY(2px)";
                  e.currentTarget.style.borderBottomWidth = "2px";
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = "translateY(0px)";
                  e.currentTarget.style.borderBottomWidth = "4px";
                }}
              >
                {/* 3D Flag / Subject Icon */}
                <div
                  style={{
                    width: "82px",
                    height: "64px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "14px",
                  }}
                >
                  <img
                    src={course.flag}
                    alt={course.name}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                      display: "block",
                    }}
                  />
                </div>

                {/* Course Name */}
                <div
                  style={{
                    fontSize: "19px",
                    fontWeight: 800,
                    color: "#3c3c3c",
                    marginBottom: course.learners ? "4px" : "0px",
                    textAlign: "center",
                    lineHeight: 1.2,
                  }}
                >
                  {course.name}
                </div>

                {/* Learners Count */}
                {course.learners ? (
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#777777",
                      textAlign: "center",
                      lineHeight: 1.2,
                    }}
                  >
                    {course.learners}
                  </div>
                ) : (
                  <div style={{ height: "17px" }} />
                )}
              </button>
            );
          })}
        </div>
      </main>

      {/* Responsive Grid CSS */}
      <style jsx>{`
        @media (max-width: 900px) {
          .duo-courses-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 14px !important;
          }
        }
        @media (max-width: 480px) {
          .duo-courses-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
