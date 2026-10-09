"use client";

import React, { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "var(--duo-canvas)",
          gap: "18px",
        }}
      >
        <img
          src="/mascot/duo-happy.svg"
          alt="Loading..."
          style={{
            width: "80px",
            height: "80px",
            animation: "bounce 1.2s infinite ease-in-out",
          }}
        />
        <span
          style={{
            fontWeight: 800,
            fontSize: "16px",
            color: "var(--duo-text-muted)",
            letterSpacing: "1px",
          }}
        >
          LOADING...
        </span>
      </div>
    );
  }

  return <>{children}</>;
}

