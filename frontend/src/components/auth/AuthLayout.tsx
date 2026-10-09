"use client";

import React, { ReactNode } from "react";
import Link from "next/link";

interface AuthLayoutProps {
  children: ReactNode;
  headerActionLabel?: string;
  headerActionHref?: string;
}

export default function AuthLayout({
  children,
  headerActionLabel = "SIGN UP",
  headerActionHref = "/auth/signup",
}: AuthLayoutProps) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "var(--duo-canvas)",
        color: "var(--duo-text)",
      }}
    >
      {/* Top Header */}
      <header
        style={{
          height: "72px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 28px",
          borderBottom: "2px solid var(--duo-border)",
        }}
      >
        {/* Brand Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
          }}
        >
          <img
            src="/mascot/duo-happy.svg"
            alt="Duolingo"
            style={{ width: "38px", height: "38px" }}
          />
          <span
            style={{
              color: "var(--duo-green)",
              fontWeight: 900,
              fontSize: "30px",
              letterSpacing: "-0.5px",
            }}
          >
            duolingo
          </span>
        </Link>

        {/* Top-Right Action Button */}
        {headerActionLabel && headerActionHref && (
          <Link
            href={headerActionHref}
            className="duo-btn duo-btn-outline"
            style={{
              fontSize: "14px",
              padding: "10px 20px",
              borderRadius: "14px",
              textDecoration: "none",
            }}
          >
            {headerActionLabel}
          </Link>
        )}
      </header>

      {/* Main Content Area */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 16px 60px 16px",
          width: "100%",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "400px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {children}
        </div>
      </main>

      {/* Footer Terms */}
      <footer
        style={{
          textAlign: "center",
          padding: "20px 16px",
          borderTop: "1px solid var(--duo-border)",
          fontSize: "13px",
          color: "var(--duo-text-muted)",
          fontWeight: 600,
        }}
      >
        <span>
          By using Duolingo, you agree to our{" "}
          <span style={{ color: "var(--duo-blue)", cursor: "pointer" }}>Terms</span> and{" "}
          <span style={{ color: "var(--duo-blue)", cursor: "pointer" }}>Privacy Policy</span>.
        </span>
      </footer>
    </div>
  );
}
