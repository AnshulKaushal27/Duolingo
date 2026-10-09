"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { playClickSound } from "@/lib/sound";
import languages from "@/data/carousel_languages.json";

export default function LanguageCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    playClickSound();
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -360 : 360;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="_3XjUp" style={{ display: "flex", width: "100%", justifyContent: "center", borderTop: "2px solid rgb(var(--color-swan))", borderBottom: "2px solid rgb(var(--color-swan))", fontFamily: "var(--duo-font)" }}>
      <nav className="zU2RQ _3isJn" style={{ maxWidth: "1040px", width: "100%", margin: "0 auto", padding: "16px 20px" }}>
        {/* Left Arrow Button */}
        <button
          onClick={() => scroll("left")}
          className="yg19_ _219j-"
          aria-label="Previous languages"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "40px",
            height: "40px",
            color: "rgb(var(--color-hare))",
            transition: "transform 0.15s ease",
          }}
        >
          <svg className="yg19_ _219j-" fill="none" viewBox="0 0 16 16" width="22" height="22">
            <path d="M10 2L4 8L10 14" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
          </svg>
        </button>

        {/* Scrollable Language List */}
        <div className="I36m9" ref={scrollRef} style={{ flex: 1, overflowX: "auto" }}>
          <ul
            className="_399s9"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "28px",
              listStyle: "none",
              margin: 0,
              padding: "6px 12px",
              width: "max-content",
            }}
          >
            {languages.map((lang, index) => (
              <li key={`${lang.name}-${index}`}>
                <Link
                  className="_1nZQi"
                  href="/onboarding/language"
                  onClick={() => playClickSound()}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                    padding: "8px 14px",
                    borderRadius: "14px",
                    transition: "background-color 0.15s ease",
                  }}
                >
                  <img
                    src={lang.flag}
                    alt={lang.name}
                    className="_1RsYI"
                    style={{ height: "32px", width: "42px", objectFit: "contain" }}
                  />
                  <span
                    className="_2qfTm"
                    style={{
                      fontSize: "15px",
                      fontWeight: 800,
                      color: "rgb(var(--color-hare))",
                      letterSpacing: "0.8px",
                      textTransform: "uppercase",
                      fontFamily: "var(--duo-font)",
                    }}
                  >
                    {lang.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={() => scroll("right")}
          className="yg19_ _219j-"
          aria-label="Next languages"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "40px",
            height: "40px",
            color: "rgb(var(--color-hare))",
            transition: "transform 0.15s ease",
          }}
        >
          <svg className="yg19_ _219j-" fill="none" viewBox="0 0 16 16" width="22" height="22">
            <path d="M6 2L12 8L6 14" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
          </svg>
        </button>
      </nav>
    </div>
  );
}
