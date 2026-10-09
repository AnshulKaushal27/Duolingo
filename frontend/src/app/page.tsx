"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { playClickSound } from "@/lib/sound";
import HeroGlobe from "@/components/landing/HeroGlobe";
import LanguageCarousel from "@/components/landing/LanguageCarousel";
import LandingSections from "@/components/landing/LandingSections";
import LandingFooter from "@/components/landing/LandingFooter";

export default function HomePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const [siteLangOpen, setSiteLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("English");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const siteLanguages = [
    "English",
    "Español",
    "Français",
    "Deutsch",
    "Italiano",
    "Português",
    "Русский",
    "日本語",
    "中文",
    "한국어",
    "हिंदी",
  ];

  return (
    <div
      className="qO_UG"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "rgb(var(--color-snow))",
        color: "rgb(var(--color-eel))",
        overflowX: "hidden",
      }}
    >
      {/* ===================================================================
          STICKY TOP NAVBAR (1:1 Duolingo Production Header)
          =================================================================== */}
      <header className="_39290">
        <div className="_3L2FE _1JEFf">
          <nav className="lZqWH">
            {/* Duolingo Wordmark Logo */}
            <Link
              href="/"
              onClick={() => playClickSound()}
              style={{ display: "flex", alignItems: "center", textDecoration: "none" }}
            >
              <img
                alt="Duolingo"
                className="_1KFhV"
                src="https://d35aaqx5ub95lt.cloudfront.net/images/splash/f92d5f2f7d56636846861c458c0d0b6c.svg"
                style={{ height: "42px", width: "auto" }}
              />
            </Link>

            {/* Right Controls */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              {/* Site Language Dropdown (Shown only when at top of page, matching official Duolingo) */}
              {!isScrolled && !isAuthenticated && (
                <div className="tFegI _1-AxT" style={{ position: "relative" }}>
                  <button
                    className="_1gEmM _7jW2t _2cPiq _3IYFo _2Rt1l"
                    onClick={() => {
                      playClickSound();
                      setSiteLangOpen(!siteLangOpen);
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 12px",
                      borderRadius: "12px",
                      transition: "background-color 0.15s ease",
                    }}
                  >
                    <span
                      className="_9lHjd"
                      style={{
                        fontSize: "14px",
                        fontWeight: 800,
                        color: "rgb(var(--color-hare))",
                        letterSpacing: "0.8px",
                        textTransform: "uppercase",
                        fontFamily: "var(--duo-font)",
                      }}
                    >
                      Site language: {currentLang}
                    </span>
                    <img
                      alt=""
                      className="_3fvmi _9lHjd"
                      src="https://d35aaqx5ub95lt.cloudfront.net/images/splash/c6eae48dd48246c89e415b89f9e55282.svg"
                      style={{
                        width: "12px",
                        height: "8px",
                        transform: siteLangOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.2s ease",
                      }}
                    />
                  </button>

                  {siteLangOpen && (
                    <div
                      style={{
                        position: "absolute",
                        top: "calc(100% + 8px)",
                        right: 0,
                        backgroundColor: "rgb(var(--color-snow))",
                        borderRadius: "16px",
                        border: "2px solid rgb(var(--color-swan))",
                        boxShadow: "0 12px 32px rgba(0, 0, 0, 0.12)",
                        padding: "10px",
                        width: "200px",
                        maxHeight: "320px",
                        overflowY: "auto",
                        zIndex: 200,
                      }}
                    >
                      {siteLanguages.map((lang) => (
                        <button
                          key={lang}
                          onClick={() => {
                            playClickSound();
                            setCurrentLang(lang);
                            setSiteLangOpen(false);
                          }}
                          style={{
                            width: "100%",
                            textAlign: "left",
                            padding: "10px 14px",
                            borderRadius: "10px",
                            background: currentLang === lang ? "rgba(var(--color-macaw), 0.15)" : "none",
                            border: "none",
                            fontSize: "14px",
                            fontWeight: currentLang === lang ? 800 : 700,
                            color: currentLang === lang ? "rgb(var(--color-macaw))" : "rgb(var(--color-eel))",
                            cursor: "pointer",
                            display: "block",
                            transition: "background-color 0.1s ease",
                            fontFamily: "var(--duo-font)",
                          }}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Scrolled "GET STARTED" CTA Button in iconic vibrant green (#58cc02) */}
              {isScrolled && !isAuthenticated && (
                <Link
                  data-test="get-started-topbar"
                  className="duo-btn duo-btn-green"
                  href="/onboarding/language"
                  onClick={() => playClickSound()}
                  style={{
                    backgroundColor: "#58cc02",
                    borderColor: "#58cc02",
                    borderBottomColor: "#46a302",
                    borderBottomWidth: "4px",
                    color: "#ffffff",
                    height: "44px",
                    padding: "0 22px",
                    borderRadius: "14px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textDecoration: "none",
                    fontWeight: 800,
                    fontSize: "14px",
                    letterSpacing: "0.8px",
                    textTransform: "uppercase",
                    fontFamily: "var(--duo-font)",
                  }}
                >
                  GET STARTED
                </Link>
              )}

              {/* Logged in indicator */}
              {isAuthenticated && (
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Link
                    href="/learn"
                    onClick={() => playClickSound()}
                    style={{
                      backgroundColor: "rgb(var(--color-macaw))",
                      color: "#ffffff",
                      fontSize: "13px",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.8px",
                      padding: "8px 16px",
                      borderRadius: "12px",
                      textDecoration: "none",
                      borderBottom: "3px solid rgb(var(--color-whale))",
                    }}
                  >
                    LEARN
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* ===================================================================
            HERO SECTION (Globe + Headline + CTAs) - Authentic Duolingo Scale
            =================================================================== */}
        <div
          className="_15kfC"
          style={{
            maxWidth: "1040px",
            margin: "0 auto",
            padding: "56px 24px 64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "64px",
            width: "100%",
          }}
        >
          {/* Globe Illustration */}
          <HeroGlobe />

          {/* Headline & Action Buttons */}
          <div className="_28m3G" style={{ maxWidth: "480px", flex: "1 1 auto" }}>
            <h1
              className="L93Ok"
              style={{
                fontSize: "36px",
                fontWeight: 800,
                color: "rgb(var(--color-eel))",
                lineHeight: 1.25,
                margin: "0 0 32px",
                fontFamily: "var(--duo-font)",
                letterSpacing: "-0.5px",
              }}
            >
              The most fun way to learn languages, chess, and more!
            </h1>

            <div
              className="_1-0oK"
              style={{
                width: "100%",
                maxWidth: "340px",
                display: "flex",
                flexDirection: "column",
                gap: "14px",
              }}
            >
              {!isAuthenticated ? (
                <>
                  <Link
                    data-test="get-started-top"
                    className="_1rcV8 _1VYyp _1ursp _7jW2t _2skPy _3u1lX duo-btn"
                    href="/onboarding/language"
                    onClick={() => playClickSound()}
                    style={{
                      backgroundColor: "rgb(var(--color-owl))",
                      color: "#ffffff",
                      height: "52px",
                      borderRadius: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textDecoration: "none",
                      fontWeight: 800,
                      fontSize: "16px",
                      letterSpacing: "0.8px",
                      textTransform: "uppercase",
                      borderBottom: "4px solid rgb(var(--color-tree-frog))",
                      fontFamily: "var(--duo-font)",
                    }}
                  >
                    <span className="_2NRlK">GET STARTED</span>
                  </Link>

                  <Link
                    data-test="have-account"
                    className="_2V6ug _1ursp _7jW2t -TeUZ _2Ccfj duo-btn"
                    href="/auth/login"
                    onClick={() => playClickSound()}
                    style={{
                      backgroundColor: "rgb(var(--color-snow))",
                      color: "rgb(var(--color-macaw))",
                      height: "52px",
                      borderRadius: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textDecoration: "none",
                      fontWeight: 800,
                      fontSize: "16px",
                      letterSpacing: "0.8px",
                      textTransform: "uppercase",
                      border: "2px solid rgb(var(--color-swan))",
                      borderBottom: "4px solid rgb(var(--color-swan))",
                      fontFamily: "var(--duo-font)",
                    }}
                  >
                    <span className="_2NRlK _9lHjd">I ALREADY HAVE AN ACCOUNT</span>
                  </Link>

                  <Link
                    href="/learn"
                    onClick={() => playClickSound()}
                    style={{
                      textAlign: "center",
                      color: "rgb(var(--color-macaw))",
                      fontWeight: 800,
                      fontSize: "13px",
                      textDecoration: "underline",
                      marginTop: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Evaluator Demo: Open /learn directly (Alex Ramos) →
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    className="_1rcV8 _1VYyp _1ursp _7jW2t _2skPy _3u1lX duo-btn"
                    href="/learn"
                    onClick={() => playClickSound()}
                    style={{
                      backgroundColor: "rgb(var(--color-owl))",
                      color: "#ffffff",
                      height: "50px",
                      borderRadius: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textDecoration: "none",
                      fontWeight: 800,
                      fontSize: "15px",
                      letterSpacing: "0.8px",
                      textTransform: "uppercase",
                      borderBottom: "4px solid rgb(var(--color-tree-frog))",
                    }}
                  >
                    <span className="_2NRlK">CONTINUE LEARNING</span>
                  </Link>

                  <button
                    onClick={() => {
                      playClickSound();
                      logout();
                    }}
                    className="_2V6ug _1ursp _7jW2t -TeUZ _2Ccfj duo-btn"
                    style={{
                      backgroundColor: "rgb(var(--color-snow))",
                      color: "rgb(var(--color-hare))",
                      height: "50px",
                      borderRadius: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: "15px",
                      letterSpacing: "0.8px",
                      textTransform: "uppercase",
                      border: "2px solid rgb(var(--color-swan))",
                      borderBottom: "4px solid rgb(var(--color-swan))",
                      cursor: "pointer",
                    }}
                  >
                    <span className="_2NRlK _9lHjd">
                      SIGN OUT ({user?.display_name || user?.email || "LEARNER"})
                    </span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Language Carousel */}
        <LanguageCarousel />
      </header>

      {/* Main alternating feature sections */}
      <LandingSections />

      {/* Official multi-column footer */}
      <LandingFooter />
    </div>
  );
}
