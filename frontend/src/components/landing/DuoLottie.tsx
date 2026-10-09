"use client";

import React, { useEffect, useRef, useState } from "react";
import lottie, { AnimationItem } from "lottie-web";

interface DuoLottieProps {
  animationPath: string;
  className?: string;
  style?: React.CSSProperties;
  loop?: boolean;
  autoplay?: boolean;
  loopSegment?: [number, number];
  fallbackSrc?: string;
  fallbackPicture?: {
    desktop1x: string;
    desktop2x: string;
    mobile1x: string;
    mobile2x: string;
  };
  alt?: string;
}

export default function DuoLottie({
  animationPath,
  className,
  style,
  loop = true,
  autoplay = true,
  loopSegment,
  fallbackSrc,
  fallbackPicture,
  alt = "Duolingo animation",
}: DuoLottieProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<AnimationItem | null>(null);
  const [readyToShow, setReadyToShow] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    let isCancelled = false;

    // Load Lottie animation
    const anim = lottie.loadAnimation({
      container: containerRef.current,
      renderer: "svg",
      loop: loopSegment ? false : loop,
      autoplay: !loopSegment && autoplay,
      path: animationPath,
    });

    animRef.current = anim;

    anim.addEventListener("DOMLoaded", () => {
      if (isCancelled) return;
      if (loopSegment) {
        anim.playSegments(loopSegment, true);
        anim.setLoop(true);
      }
      // Wait for the browser to actually paint the Lottie SVG
      // before starting the crossfade, preventing the "pop"
      requestAnimationFrame(() => {
        if (isCancelled) return;
        requestAnimationFrame(() => {
          if (isCancelled) return;
          setReadyToShow(true);
        });
      });
    });

    // Pause animation when off-screen to preserve 60 FPS performance
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (animRef.current) {
            if (entry.isIntersecting) {
              animRef.current.play();
            } else {
              animRef.current.pause();
            }
          }
        });
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      isCancelled = true;
      observer.disconnect();
      anim.destroy();
      animRef.current = null;
    };
  }, [animationPath, loop, autoplay, loopSegment]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
      className={className}
    >
      {/* Official Duolingo Responsive Picture Fallback */}
      {fallbackPicture && (
        <picture
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            opacity: readyToShow ? 0 : 1,
            transition: "opacity 0.8s ease-in-out",
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <source
            media="(min-width: 768px)"
            srcSet={`${fallbackPicture.desktop1x}, ${fallbackPicture.desktop2x} 2x`}
          />
          <source
            srcSet={`${fallbackPicture.mobile1x}, ${fallbackPicture.mobile2x} 2x`}
          />
          <img
            src={fallbackPicture.desktop2x}
            alt={alt}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        </picture>
      )}

      {/* Fallback image shown until Lottie frames mount (standard img) */}
      {!fallbackPicture && fallbackSrc && (
        <img
          src={fallbackSrc}
          alt={alt}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
            opacity: readyToShow ? 0 : 1,
            transition: "opacity 0.8s ease-in-out",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Lottie SVG Render Target */}
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: readyToShow ? 1 : 0,
          transition: "opacity 0.8s ease-in-out",
        }}
      />
    </div>
  );
}

