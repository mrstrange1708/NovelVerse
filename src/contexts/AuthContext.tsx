"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { apiService, User } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  handleGoogleCallback: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [initializationComplete, setInitializationComplete] = useState(false);

  // Initial auth check on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = apiService.getToken();
        
        if (token) {
          const currentUser = await apiService.getCurrentUser();
          if (currentUser) {
            setUserState(currentUser);
            setIsAuthenticated(true);
          } else {
            // Invalid token, clear it
            apiService.removeToken();
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
        setInitializationComplete(true);
      }
    };

    initAuth();
  }, []); // Run only once on mount

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await apiService.login({ email, password });

      if (response.user && response.token) {
        setUserState(response.user);
        setIsAuthenticated(true);
      } else {
        throw new Error("Invalid login response");
      }
    } catch (error) {
      console.error("Login error:", error);
      setIsAuthenticated(false);
      setUserState(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    apiService.logout();
    setUserState(null);
    setIsAuthenticated(false);
  };

  const refreshUser = async () => {
    try {
      const currentUser = await apiService.getCurrentUser();
      if (currentUser) {
        setUserState(currentUser);
        setIsAuthenticated(true);
      } else {
        logout();
      }
    } catch (error) {
      console.error("Refresh user error:", error);
      logout();
    }
  };

  const handleGoogleCallback = async () => {
    try {
      setIsLoading(true);
      const user = await apiService.handleGoogleCallback();
      if (user) {
        setUserState(user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Google callback error:", error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshUser,
    handleGoogleCallback,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}