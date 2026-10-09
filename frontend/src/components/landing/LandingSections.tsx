"use client";

import React from "react";
import Link from "next/link";
import { playClickSound } from "@/lib/sound";
import DuoLottie from "./DuoLottie";
import AnytimeAnywhereSection from "./AnytimeAnywhereSection";

export default function LandingSections() {
  return (
    <main style={{ width: "100%", display: "flex", flexDirection: "column", fontFamily: "var(--duo-font)" }}>
      {/* ===================================================================
          SECTION 0: free. fun. effective.
          =================================================================== */}
      <section className="uU0-M" style={{ padding: "96px 24px" }}>
        <section
          className="_3k9io"
          style={{
            maxWidth: "1040px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "64px",
            flexWrap: "wrap",
          }}
        >
          <div className="_2Yq-n" style={{ flex: "1 1 380px", maxWidth: "520px" }}>
            <h2
              className="_3X-2C"
              style={{
                fontSize: "clamp(38px, 4.5vw, 48px)",
                fontWeight: 800,
                color: "rgb(var(--color-owl))",
                lineHeight: 1.15,
                margin: "0 0 20px",
                letterSpacing: "-0.5px",
                fontFamily: "var(--duo-font)",
              }}
            >
              free. fun. effective.
            </h2>
            <p
              className="KsAV5"
              style={{
                fontSize: "19px",
                lineHeight: 1.6,
                color: "rgb(var(--color-hare))",
                fontWeight: 600,
                margin: 0,
              }}
            >
              <span>
                Learning with Duolingo is fun, and{" "}
                <Link
                  className="_1F7oE"
                  href="/onboarding/language"
                  style={{ color: "rgb(var(--color-macaw))", fontWeight: 700, textDecoration: "none" }}
                >
                  research shows that it works
                </Link>
                ! With quick, bite-sized lessons, you&apos;ll earn points and unlock new levels while gaining real-world communication skills.
              </span>
            </p>
          </div>
          <div className="_1RIBh" style={{ flex: "1 1 380px", display: "flex", justifyContent: "center" }}>
            <div style={{ width: "100%", maxWidth: "480px", aspectRatio: "1/1" }}>
              <DuoLottie
                animationPath="/lottie/free_fun_effective.json"
                fallbackSrc="https://d35aaqx5ub95lt.cloudfront.net/images/splash/lottie/23ab11cb1e1a9aff54facdf57833373d.svg"
                alt="free. fun. effective."
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </div>
        </section>
      </section>

      {/* ===================================================================
          SECTION 1: backed by science
          =================================================================== */}
      <section
        className="_36L7f _3k9io"
        style={{
          padding: "96px 24px",
        }}
      >
        <div
          style={{
            maxWidth: "1040px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "64px",
            flexWrap: "wrap-reverse",
          }}
        >
          <div className="_1RIBh" style={{ flex: "1 1 380px", display: "flex", justifyContent: "center" }}>
            <div style={{ width: "100%", maxWidth: "480px", aspectRatio: "1/1" }}>
              <DuoLottie
                animationPath="/lottie/backed_by_science.json"
                fallbackSrc="https://d35aaqx5ub95lt.cloudfront.net/images/splash/lottie/08ec8d0260c55c054e1b97bcbc96ea0f.svg"
                alt="backed by science"
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </div>
          <div className="_2Yq-n" style={{ flex: "1 1 380px", maxWidth: "520px" }}>
            <h2
              className="_3X-2C"
              style={{
                fontSize: "clamp(38px, 4.5vw, 48px)",
                fontWeight: 800,
                color: "rgb(var(--color-owl))",
                lineHeight: 1.15,
                margin: "0 0 20px",
                letterSpacing: "-0.5px",
                fontFamily: "var(--duo-font)",
              }}
            >
              backed by science
            </h2>
            <p
              className="KsAV5"
              style={{
                fontSize: "19px",
                lineHeight: 1.6,
                color: "rgb(var(--color-hare))",
                fontWeight: 600,
                margin: 0,
              }}
            >
              We use a combination of research-backed teaching methods and delightful content to create courses that effectively teach reading, writing, listening, and speaking skills!
            </p>
          </div>
        </div>
      </section>

      {/* ===================================================================
          SECTION 2: stay motivated
          =================================================================== */}
      <section
        className="_3k9io"
        style={{
          padding: "96px 24px",
        }}
      >
        <div
          style={{
            maxWidth: "1040px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "64px",
            flexWrap: "wrap",
          }}
        >
          <div className="_2Yq-n" style={{ flex: "1 1 380px", maxWidth: "520px" }}>
            <h2
              className="_3X-2C"
              style={{
                fontSize: "clamp(38px, 4.5vw, 48px)",
                fontWeight: 800,
                color: "rgb(var(--color-owl))",
                lineHeight: 1.15,
                margin: "0 0 20px",
                letterSpacing: "-0.5px",
                fontFamily: "var(--duo-font)",
              }}
            >
              stay motivated
            </h2>
            <p
              className="KsAV5"
              style={{
                fontSize: "19px",
                lineHeight: 1.6,
                color: "rgb(var(--color-hare))",
                fontWeight: 600,
                margin: 0,
              }}
            >
              We make it easy to form a habit of language learning with game-like features, fun challenges, and reminders from our friendly mascot, Duo the owl.
            </p>
          </div>
          <div className="_1RIBh" style={{ flex: "1 1 380px", display: "flex", justifyContent: "center" }}>
            <div style={{ width: "100%", maxWidth: "480px", aspectRatio: "1/1" }}>
              <DuoLottie
                animationPath="/lottie/stay_motivated.json"
                fallbackSrc="https://d35aaqx5ub95lt.cloudfront.net/images/splash/lottie/833a22b2834050d139f266a29899bb00.svg"
                alt="stay motivated"
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          SECTION 3: personalized learning
          =================================================================== */}
      <section
        className="_36L7f _3k9io"
        style={{
          padding: "96px 24px",
        }}
      >
        <div
          style={{
            maxWidth: "1040px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "64px",
            flexWrap: "wrap-reverse",
          }}
        >
          <div className="_1RIBh" style={{ flex: "1 1 380px", display: "flex", justifyContent: "center" }}>
            <div style={{ width: "100%", maxWidth: "480px", aspectRatio: "1/1" }}>
              <DuoLottie
                animationPath="/lottie/personalized_learning.json"
                fallbackSrc="https://d35aaqx5ub95lt.cloudfront.net/images/splash/lottie/9d3c2c99dd19996319a372f79b2ed3c1.svg"
                alt="personalized learning"
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </div>
          <div className="_2Yq-n" style={{ flex: "1 1 380px", maxWidth: "520px" }}>
            <h2
              className="_3X-2C"
              style={{
                fontSize: "clamp(38px, 4.5vw, 48px)",
                fontWeight: 800,
                color: "rgb(var(--color-owl))",
                lineHeight: 1.15,
                margin: "0 0 20px",
                letterSpacing: "-0.5px",
                fontFamily: "var(--duo-font)",
              }}
            >
              personalized learning
            </h2>
            <p
              className="KsAV5"
              style={{
                fontSize: "19px",
                lineHeight: 1.6,
                color: "rgb(var(--color-hare))",
                fontWeight: 600,
                margin: 0,
              }}
            >
              Combining the best of AI and language science, lessons are tailored to help you learn at just the right level and pace.
            </p>
          </div>
        </div>
      </section>

      {/* ===================================================================
          SECTION 4: learn anytime, anywhere (Scroll-tied animation)
          =================================================================== */}
      <AnytimeAnywhereSection />

      {/* ===================================================================
          SECTION 5: Super Duolingo
          =================================================================== */}
      <section
        className="LlPOq"
        style={{
          padding: "96px 24px",
          background: "linear-gradient(180deg, #101e3d 0%, #0a1128 100%)",
          color: "#ffffff",
        }}
      >
        <div
          className="_35MAo"
          style={{
            maxWidth: "1040px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "64px",
            flexWrap: "wrap",
          }}
        >
          <div className="_2VZpU" style={{ flex: "1 1 360px", display: "flex", justifyContent: "center" }}>
            <div style={{ width: "100%", maxWidth: "420px", aspectRatio: "1/1" }}>
              <DuoLottie
                animationPath="/lottie/super_duolingo.json"
                fallbackSrc="https://d35aaqx5ub95lt.cloudfront.net/images/splash/lottie/22fce01f6df43e0472d7585afad9a43a.svg"
                alt="Super Duolingo characters"
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </div>
          <div className="A6fCq" style={{ flex: "1 1 420px", maxWidth: "540px" }}>
            <div style={{ marginBottom: "24px" }}>
              <picture>
                <source
                  height="91"
                  media="(min-width: 768px)"
                  srcSet="https://d35aaqx5ub95lt.cloudfront.net/images/splash/3a733db6d6873e1a915f70cf72554ce3.svg"
                  width="605"
                />
                <img
                  alt="Super Duolingo"
                  className="_26IYs"
                  height="55"
                  src="https://d35aaqx5ub95lt.cloudfront.net/images/splash/dd7453522d3192d4df06d4652508b8bc.svg"
                  width="339"
                  style={{ width: "100%", maxWidth: "400px", height: "auto" }}
                />
              </picture>
            </div>
            <p style={{ fontSize: "19px", color: "rgba(255, 255, 255, 0.85)", marginBottom: "32px", lineHeight: 1.6, fontWeight: 600 }}>
              Speed up your learning with Super Duolingo! Enjoy unlimited hearts, no ads, and personalized practice reviews.
            </p>
            <Link
              href="/shop"
              onClick={() => playClickSound()}
              className="_2V6ug _1ursp _7jW2t _1L3MW _2Ccfj duo-btn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#ffffff",
                color: "#1cb0f6",
                fontWeight: 800,
                fontSize: "16px",
                letterSpacing: "0.8px",
                textTransform: "uppercase",
                padding: "16px 36px",
                borderRadius: "16px",
                textDecoration: "none",
                borderBottom: "4px solid #bde6fa",
                fontFamily: "var(--duo-font)",
              }}
            >
              <span className="_2NRlK">TRY 1 WEEK FREE</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ===================================================================
          SECTION 6: Duolingo English Test
          =================================================================== */}
      <section
        className="_3dG3I"
        style={{
          padding: "96px 24px",
        }}
      >
        <section
          className="_3k9io"
          style={{
            maxWidth: "1040px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "64px",
            flexWrap: "wrap",
          }}
        >
          <div className="_2Yq-n" style={{ flex: "1 1 380px", maxWidth: "520px" }}>
            <h2
              className="_3X-2C"
              style={{
                fontSize: "clamp(38px, 4.5vw, 48px)",
                fontWeight: 800,
                color: "rgb(var(--color-owl))",
                lineHeight: 1.15,
                margin: "0 0 20px",
                letterSpacing: "-0.5px",
                fontFamily: "var(--duo-font)",
              }}
            >
              duolingo english test
            </h2>
            <p
              className="KsAV5"
              style={{
                fontSize: "19px",
                lineHeight: 1.6,
                color: "rgb(var(--color-hare))",
                fontWeight: 600,
                marginBottom: "32px",
              }}
            >
              Our convenient, fast, and affordable English test integrates the latest assessment science and AI — empowering anyone to accurately test their English where and when they&apos;re at their best.
            </p>
            <a
              className="_2V6ug _1ursp _7jW2t _1L3MW _2Ccfj duo-btn"
              href="https://englishtest.duolingo.com/en"
              target="_blank"
              rel="noreferrer"
              onClick={() => playClickSound()}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgb(var(--color-snow))",
                color: "rgb(var(--color-macaw))",
                fontWeight: 800,
                fontSize: "16px",
                letterSpacing: "0.8px",
                textTransform: "uppercase",
                padding: "16px 36px",
                borderRadius: "16px",
                textDecoration: "none",
                border: "2px solid rgb(var(--color-swan))",
                borderBottom: "4px solid rgb(var(--color-swan))",
                fontFamily: "var(--duo-font)",
              }}
            >
              <span className="_2NRlK">Certify your English</span>
            </a>
          </div>
          <div className="_1RIBh" style={{ flex: "1 1 380px", display: "flex", justifyContent: "center" }}>
            <div style={{ width: "100%", maxWidth: "480px", aspectRatio: "1/1" }}>
              <DuoLottie
                animationPath="/lottie/english_test.json"
                fallbackSrc="https://d35aaqx5ub95lt.cloudfront.net/images/splash/lottie/a50e95b2b4e8c91d610b9c7318389c1e.svg"
                alt="duolingo english test"
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </div>
        </section>
      </section>      {/* ===================================================================
          SECTION 7: learn a language with duolingo (Bottom CTA Big Island)
          =================================================================== */}
      <section
        className="F71XF"
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          position: "relative",
          width: "100%",
          overflow: "hidden",
          backgroundColor: "rgb(var(--color-snow))",
          margin: 0,
          padding: 0,
        }}
      >
        {/* Left green wing filling screen > 1440px to connect seamlessly to footer */}
        <div
          className="_3zmWG"
          style={{
            background: "#58cc02",
            flex: 1,
            height: "450px",
            alignSelf: "flex-end",
          }}
        />

        {/* Center content container up to 1440px wide */}
        <div
          className="_1fSpL"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            maxWidth: "1440px",
            width: "100%",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Headline + CTA Button */}
          <div
            className="_3qFL2"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "28px",
              maxWidth: "100%",
              padding: "80px 24px 24px",
              zIndex: 2,
              position: "relative",
              textAlign: "center",
            }}
          >
            <h1
              className="_1FmL9"
              style={{
                fontSize: "clamp(36px, 4.5vw, 56px)",
                fontWeight: 800,
                color: "#58cc02",
                lineHeight: 1.15,
                margin: 0,
                letterSpacing: "-0.5px",
                fontFamily: "var(--duo-font)",
                maxWidth: "500px",
                textAlign: "center",
              }}
            >
              learn a language<br />with duolingo
            </h1>
            <Link
              className="_1rcV8 _1VYyp _1ursp _7jW2t _3Wy9F _3u1lX duo-btn duo-btn-green"
              href="/onboarding/language"
              onClick={() => playClickSound()}
              style={{
                backgroundColor: "#58cc02",
                borderColor: "#58cc02",
                borderBottomColor: "#46a302",
                borderBottomWidth: "4px",
                color: "#ffffff",
                padding: "16px 44px",
                fontSize: "17px",
                fontWeight: 800,
                borderRadius: "16px",
                textDecoration: "none",
                display: "inline-block",
                fontFamily: "var(--duo-font)",
                letterSpacing: "0.8px",
                textTransform: "uppercase",
              }}
            >
              <span className="_2NRlK">GET STARTED</span>
            </Link>
          </div>

          {/* Big Green Island Illustration with Duo owl inside phone */}
          <div
            className="dPoY0"
            style={{
              width: "100%",
              display: "block",
              position: "relative",
              lineHeight: 0,
              margin: 0,
              padding: 0,
              pointerEvents: "none",
            }}
          >
            <img
              src="/images/duo_parade.svg"
              alt="learn a language with duolingo"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                margin: 0,
                padding: 0,
              }}
            />
          </div>
        </div>

        {/* Right green wing filling screen > 1440px to connect seamlessly to footer */}
        <div
          className="_3zmWG"
          style={{
            background: "#58cc02",
            flex: 1,
            height: "450px",
            alignSelf: "flex-end",
          }}
        />
      </section>
    </main>
  );
}
