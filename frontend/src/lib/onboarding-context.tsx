"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface OnboardingState {
  targetLanguage: string;
  targetLanguageName: string;
  referralSource: string;
  motivation: string;
  proficiencyLevel: number; // 1 to 5
  startChoice: "scratch" | "placement";
  placementUnit: number; // 1, 2, or 3
  dailyGoalXp: number; // 10, 20, 30, 50
  guestCompletedLesson: boolean;
  guestXp: number;
}

interface OnboardingContextType {
  state: OnboardingState;
  setTargetLanguage: (code: string, name: string) => void;
  setReferralSource: (source: string) => void;
  setMotivation: (motivation: string) => void;
  setProficiencyLevel: (level: number) => void;
  setStartChoice: (choice: "scratch" | "placement") => void;
  setPlacementUnit: (unit: number) => void;
  setDailyGoalXp: (xp: number) => void;
  completeGuestLesson: (xpAwarded: number) => void;
  resetOnboarding: () => void;
}

const defaultState: OnboardingState = {
  targetLanguage: "es",
  targetLanguageName: "Spanish",
  referralSource: "",
  motivation: "",
  proficiencyLevel: 1,
  startChoice: "scratch",
  placementUnit: 1,
  dailyGoalXp: 20,
  guestCompletedLesson: false,
  guestXp: 0,
};

const STORAGE_KEY = "duo_onboarding_state";

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OnboardingState>(defaultState);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        setState(JSON.parse(saved));
      }
    } catch {
      // Ignore sessionStorage errors
    }
  }, []);

  const updateState = (updater: (prev: OnboardingState) => OnboardingState) => {
    setState((prev) => {
      const next = updater(prev);
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  const setTargetLanguage = (code: string, name: string) => {
    updateState((prev) => ({ ...prev, targetLanguage: code, targetLanguageName: name }));
  };

  const setReferralSource = (source: string) => {
    updateState((prev) => ({ ...prev, referralSource: source }));
  };

  const setMotivation = (motivation: string) => {
    updateState((prev) => ({ ...prev, motivation }));
  };

  const setProficiencyLevel = (level: number) => {
    updateState((prev) => ({ ...prev, proficiencyLevel: level }));
  };

  const setStartChoice = (choice: "scratch" | "placement") => {
    updateState((prev) => ({ ...prev, startChoice: choice }));
  };

  const setPlacementUnit = (unit: number) => {
    updateState((prev) => ({ ...prev, placementUnit: unit }));
  };

  const setDailyGoalXp = (xp: number) => {
    updateState((prev) => ({ ...prev, dailyGoalXp: xp }));
  };

  const completeGuestLesson = (xpAwarded: number) => {
    updateState((prev) => ({
      ...prev,
      guestCompletedLesson: true,
      guestXp: prev.guestXp + xpAwarded,
    }));
  };

  const resetOnboarding = () => {
    setState(defaultState);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  return (
    <OnboardingContext.Provider
      value={{
        state,
        setTargetLanguage,
        setReferralSource,
        setMotivation,
        setProficiencyLevel,
        setStartChoice,
        setPlacementUnit,
        setDailyGoalXp,
        completeGuestLesson,
        resetOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
}
