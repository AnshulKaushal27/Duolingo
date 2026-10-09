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
