"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { api, UserProfile } from "./api";

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<UserProfile>;
  signup: (data: { name: string; email: string; username: string; password: string }) => Promise<UserProfile>;
  socialLogin: (provider: "google" | "facebook") => Promise<UserProfile>;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
  updateUserLocally: (updater: (prev: UserProfile | null) => UserProfile | null) => void;
  updateGems: (gems: number) => void;
  updateHearts: (hearts: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  const refetchUser = async () => {
    try {
      const me = await api.getMe();
      setUser(me);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    async function initAuth() {
      try {
        const me = await api.getMe();
        setUser(me);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    initAuth();

    const handleBackendOnline = () => {
      initAuth();
    };

    const handleGemsUpdated = (e: any) => {
      if (typeof e.detail?.gems === "number") {
        setUser((prev) => (prev ? { ...prev, gems: e.detail.gems } : null));
      }
    };

    const handleHeartsUpdated = (e: any) => {
      if (typeof e.detail?.hearts === "number") {
        setUser((prev) => (prev ? { ...prev, hearts: e.detail.hearts } : null));
      }
    };

    window.addEventListener("duo:backend_online", handleBackendOnline);
    window.addEventListener("duo:gems_updated", handleGemsUpdated);
    window.addEventListener("duo:hearts_updated", handleHeartsUpdated);

    return () => {
      window.removeEventListener("duo:backend_online", handleBackendOnline);
      window.removeEventListener("duo:gems_updated", handleGemsUpdated);
      window.removeEventListener("duo:hearts_updated", handleHeartsUpdated);
    };
  }, []);

  const login = async (identifier: string, password: string): Promise<UserProfile> => {
    const loggedInUser = await api.login({ identifier, password });
    setUser(loggedInUser);
    return loggedInUser;
  };

  const signup = async (data: {
    name: string;
    email: string;
    username: string;
    password: string;
  }): Promise<UserProfile> => {
    const newUser = await api.signup(data);
    setUser(newUser);
    return newUser;
  };

  const socialLogin = async (provider: "google" | "facebook"): Promise<UserProfile> => {
    const socialUser = await api.socialLogin(provider);
    setUser(socialUser);
    return socialUser;
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (e) {
      console.error("Logout request error:", e);
    } finally {
      setUser(null);
      router.push("/auth/login");
    }
  };

  const updateUserLocally = (updater: (prev: UserProfile | null) => UserProfile | null) => {
    setUser(updater);
  };

  const updateGems = (gems: number) => {
    setUser((prev) => (prev ? { ...prev, gems } : null));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("duo:gems_updated", { detail: { gems } }));
    }
  };

  const updateHearts = (hearts: number) => {
    setUser((prev) => (prev ? { ...prev, hearts } : null));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("duo:hearts_updated", { detail: { hearts } }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        socialLogin,
        logout,
        refetchUser,
        updateUserLocally,
        updateGems,
        updateHearts,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
