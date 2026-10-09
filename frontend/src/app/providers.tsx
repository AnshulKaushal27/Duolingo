"use client";

import React, { ReactNode } from "react";
import { AuthProvider } from "@/lib/auth-context";
import { OnboardingProvider } from "@/lib/onboarding-context";
import BackendWarmupBanner from "@/components/common/BackendWarmupBanner";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <OnboardingProvider>
        <BackendWarmupBanner />
        {children}
      </OnboardingProvider>
    </AuthProvider>
  );
}
