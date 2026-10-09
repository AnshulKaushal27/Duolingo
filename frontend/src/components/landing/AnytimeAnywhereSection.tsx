"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import lottie, { AnimationItem } from "lottie-web";
import { playClickSound } from "@/lib/sound";

export default function AnytimeAnywhereSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<AnimationItem | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [readyToShow, setReadyToShow] = useState(false);

  const targetFrameRef = useRef(0);
  const currentFrameRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const isIntersectingRef = useRef(false);

  // Calculate current scroll progress based on trigger element
  const calcScrollProgress = useCallback(() => {
    if (!triggerRef.current) return 0;
    const rect = triggerRef.current.getBoundingClientRect();
    const vh = window.innerHeight;
    const totalDistance = vh + rect.height;
    const progress = (vh - rect.top) / totalDistance;
    return Math.min(Math.max(progress, 0), 1);
  }, []);

  const updateDynamicStyles = useCallback((progress: number) => {
    if (sectionRef.current) {
      let bg = "rgb(255, 255, 255)";
      if (progress >= 0.1 && progress <= 0.9) {
        const intensity = Math.sin(progress * Math.PI);
        const r = Math.round(255 - (255 - 220) * intensity);
        const g = Math.round(255 - (255 - 242) * intensity);
        bg = `rgb(${r}, ${g}, 255)`;
      }
      sectionRef.current.style.backgroundColor = bg;
    }
    if (titleRef.current) {
      titleRef.current.style.color = progress > 0.35 ? "rgb(var(--color-manta-ray))" : "#58cc02";
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    let isCancelled = false;

    // Load Lottie animation without autoplay
    const anim = lottie.loadAnimation({
      container: containerRef.current,
      renderer: "svg",
      loop: false,
      autoplay: false,
      path: "/lottie/anytime_anywhere.json",
    });

    animRef.current = anim;

    anim.addEventListener("DOMLoaded", () => {
      if (isCancelled) return;

      const currentProgress = calcScrollProgress();
      const initialFrame = currentProgress * 450;

      targetFrameRef.current = initialFrame;
      currentFrameRef.current = initialFrame;
      anim.goToAndStop(initialFrame, true);
      updateDynamicStyles(currentProgress);

      requestAnimationFrame(() => {
        if (isCancelled) return;
        requestAnimationFrame(() => {
          if (isCancelled) return;
          setReadyToShow(true);
        });
      });
    });

    // Smooth RAF loop for interpolation
    const updateLoop = () => {
      if (animRef.current && isIntersectingRef.current) {
        const diff = targetFrameRef.current - currentFrameRef.current;
        if (Math.abs(diff) > 0.08) {
          currentFrameRef.current += diff * 0.14;
          animRef.current.goToAndStop(currentFrameRef.current, true);
        }
      }
      rafIdRef.current = requestAnimationFrame(updateLoop);
    };
    rafIdRef.current = requestAnimationFrame(updateLoop);

    // Scroll listener throttled to RAF and only executed when section is intersecting
    let scrollTicking = false;
    const handleScroll = () => {
      if (!isIntersectingRef.current) return;
      if (!scrollTicking) {
        requestAnimationFrame(() => {
          const clampedProgress = calcScrollProgress();
          targetFrameRef.current = clampedProgress * 450;
          updateDynamicStyles(clampedProgress);
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // IntersectionObserver to pause work when off-screen
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isIntersectingRef.current = entry.isIntersecting;
          if (entry.isIntersecting) {
            const p = calcScrollProgress();
            targetFrameRef.current = p * 450;
            updateDynamicStyles(p);
          }
        });
      },
      { threshold: 0.01, rootMargin: "100px" }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      isCancelled = true;
      window.removeEventListener("scroll", handleScroll);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      observer.disconnect();
      anim.destroy();
      animRef.current = null;
    };
  }, [calcScrollProgress, updateDynamicStyles]);

  return (
    <section
      ref={sectionRef}
      className="Gijhh"
      style={{
        backgroundColor: "rgb(255, 255, 255)",
        transition: "background-color 0.15s ease-out",
        position: "relative",
        overflow: "hidden",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "60px 0",
      }}
    >
      <div
        className="_3pwPw"
        style={{
          width: "100%",
          maxWidth: "1728px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Title & App Store Badges */}
        <div
          className="_16Yyp"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: "28px",
            zIndex: 10,
            maxWidth: "600px",
            margin: "0 auto 16px",
          }}
        >
          <h1
            ref={titleRef}
            className="QO0Sm"
            style={{
              fontSize: "clamp(36px, 5vw, 56px)",
              fontWeight: 800,
              color: "#58cc02",
              lineHeight: 1.15,
              margin: 0,
              letterSpacing: "-0.5px",
              transition: "color 0.25s ease",
            }}
          >
            learn anytime, anywhere
          </h1>

          <div
            className="_1CMLi"
            style={{
              display: "flex",
              gap: "20px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {/* Apple Store Button */}
            <a
              className="_2V6ug _1ursp _7jW2t _133DB sknt2 _3-Y9x _3nMbq"
              href="https://itunes.apple.com/app/duolingo-learn-spanish-french/id570060128?mt=8"
              target="_blank"
              rel="noreferrer"
              onClick={() => playClickSound()}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 22px",
                borderRadius: "16px",
                backgroundColor: "#ffffff",
                border: "2px solid rgb(var(--color-swan))",
                borderBottom: "4px solid rgb(var(--color-swan))",
                textDecoration: "none",
                color: "rgb(var(--color-eel))",
                boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
                transition: "transform 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <svg viewBox="0 0 37 37" fill="none" width="28" height="28" style={{ color: "rgb(var(--color-eel))" }}>
                <path
                  d="M26.9039 19.1188C26.9363 16.611 28.2528 14.2945 30.3922 12.981C29.0364 11.0473 26.8469 9.86522 24.4843 9.7914C21.9986 9.53084 19.5888 11.2768 18.3221 11.2768C17.0309 11.2768 15.0807 9.81727 12.9806 9.86042C10.2174 9.94957 7.7038 11.4804 6.35946 13.8929C3.49663 18.8428 5.63205 26.1174 8.3744 30.1184C9.74645 32.0776 11.35 34.2661 13.4482 34.1885C15.5014 34.1035 16.2682 32.881 18.7466 32.881C21.202 32.881 21.9215 34.1885 24.0623 34.1392C26.2655 34.1035 27.6536 32.1713 28.9775 30.1935C29.9633 28.7975 30.7219 27.2546 31.2252 25.622C28.6084 24.5167 26.907 21.9562 26.9039 19.1188V19.1188Z"
                  fill="currentColor"
                />
                <path
                  d="M22.8604 7.16005C24.0617 5.71991 24.6535 3.86887 24.5102 2C22.6749 2.1925 20.9796 3.06846 19.7621 4.45334C18.5599 5.81971 17.9508 7.60728 18.0691 9.42235C19.929 9.44147 21.6949 8.60765 22.8604 7.16005V7.16005Z"
                  fill="currentColor"
                />
              </svg>
              <div style={{ textAlign: "left", lineHeight: 1.2 }}>
                <div style={{ fontSize: "10px", fontWeight: 700, color: "rgb(var(--color-hare))", textTransform: "uppercase" }}>Download on the</div>
                <div style={{ fontSize: "15px", fontWeight: 800 }}>App Store</div>
              </div>
            </a>

            {/* Google Play Button */}
            <a
              className="_2V6ug _1ursp _7jW2t _133DB sknt2 _3-Y9x _3nMbq"
              href="https://play.google.com/store/apps/details?hl=en&id=com.duolingo"
              target="_blank"
              rel="noreferrer"
              onClick={() => playClickSound()}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 22px",
                borderRadius: "16px",
                backgroundColor: "#ffffff",
                border: "2px solid rgb(var(--color-swan))",
                borderBottom: "4px solid rgb(var(--color-swan))",
                textDecoration: "none",
                color: "rgb(var(--color-eel))",
                boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
                transition: "transform 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <svg viewBox="0 0 37 37" fill="none" width="28" height="28" style={{ color: "rgb(var(--color-eel))" }}>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M3.80942 4.3203C3.80942 4.09554 3.82731 3.88521 3.86151 3.69016L17.8617 18.4703L3.83906 33.2741C3.81952 33.1218 3.80942 32.961 3.80942 32.792V4.3203ZM5.35237 35.0876C5.86758 35.1708 6.47838 35.0454 7.13188 34.6805L24.1811 25.1417L19.4773 20.1758L5.35237 35.0876ZM21.0928 18.4703L26.2937 23.9609L32.63 20.4164C34.4567 19.393 34.4567 17.7194 32.63 16.6985L26.1861 13.0933L21.0928 18.4703ZM24.0742 11.9117L7.13188 2.43299C6.60625 2.13818 6.10808 1.99915 5.66613 1.99915C5.60892 1.99915 5.55264 2.00146 5.49734 2.00606L19.4773 16.7648L24.0742 11.9117Z"
                  fill="currentColor"
                />
              </svg>
              <div style={{ textAlign: "left", lineHeight: 1.2 }}>
                <div style={{ fontSize: "10px", fontWeight: 700, color: "rgb(var(--color-hare))", textTransform: "uppercase" }}>Get it on</div>
                <div style={{ fontSize: "15px", fontWeight: 800 }}>Google Play</div>
              </div>
            </a>
          </div>
        </div>

        {/* Floating Phones Scroll-Animated Canvas */}
        <div
          className="_3IKl2"
          style={{
            display: "grid",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            width: "100%",
            maxWidth: "2000px",
            aspectRatio: "4100 / 2300",
            pointerEvents: "none",
          }}
        >
          {/* Static SVG Fallback before Lottie initializes */}
          <img
            alt="Duolingo on mobile devices"
            className="_2coJk"
            src="https://d35aaqx5ub95lt.cloudfront.net/images/splash/lottie/229d5f88cc9df2eb0b68f39466500911.svg"
            style={{
              gridColumn: 1,
              gridRow: 1,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              opacity: readyToShow ? 0 : 1,
              transition: "opacity 0.8s ease-in-out",
              pointerEvents: "none",
            }}
          />

          {/* Lottie SVG Render Container - exact 4100/2300 aspect ratio */}
          <div
            ref={containerRef}
            className="_2coJk"
            style={{
              gridColumn: 1,
              gridRow: 1,
              width: "100%",
              height: "100%",
              opacity: readyToShow ? 1 : 0,
              transition: "opacity 0.8s ease-in-out",
            }}
          />

          {/* Trigger zone for scroll mapping */}
          <div
            ref={triggerRef}
            className="Hlz_a"
            style={{
              position: "absolute",
              top: "20%",
              bottom: "20%",
              width: "100%",
              pointerEvents: "none",
            }}
          />
        </div>
      </div>
    </section>
  );
}
