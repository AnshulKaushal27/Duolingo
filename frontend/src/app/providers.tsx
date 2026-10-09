"use client";

import React, { ReactNode } from "react";
import { AuthProvider } from "@/lib/auth-context";
import { OnboardingProvider } from "@/lib/onboarding-context";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <OnboardingProvider>{children}</OnboardingProvider>
    </AuthProvider>
  );
}
