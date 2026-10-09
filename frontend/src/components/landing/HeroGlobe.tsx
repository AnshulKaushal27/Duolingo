"use client";

import React from "react";
import DuoLottie from "./DuoLottie";

export default function HeroGlobe() {
  return (
    <div
      className="_1ybpv"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <div
        className="_2mBtL _219j-"
        style={{
          width: "100%",
          maxWidth: "424px",
          aspectRatio: "1 / 1",
          filter: "drop-shadow(0 16px 32px rgba(0, 0, 0, 0.08))",
          transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.03) translateY(-4px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1) translateY(0)";
        }}
      >
        <DuoLottie
          animationPath="/lottie/hero_globe.json"
          loopSegment={[130, 290]}
          fallbackPicture={{
            desktop1x: "https://d35aaqx5ub95lt.cloudfront.net/images/splash/lottie/a02afa2792b8778d69101554fa0fbadd.png",
            desktop2x: "https://d35aaqx5ub95lt.cloudfront.net/images/splash/lottie/56afa7d9803ab5e57d99b4e4e0cd8932.png",
            mobile1x: "https://d35aaqx5ub95lt.cloudfront.net/images/splash/lottie/a774fe14d71e450d59a9bc4ed5d210c9.png",
            mobile2x: "https://d35aaqx5ub95lt.cloudfront.net/images/splash/lottie/ded26f174e26ad19d0a35cad7747c28c.png",
          }}
          fallbackSrc="https://d35aaqx5ub95lt.cloudfront.net/images/splash/lottie/56afa7d9803ab5e57d99b4e4e0cd8932.png"
          alt="Duolingo Characters on Earth rotating globe"
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </div>
  );
}
