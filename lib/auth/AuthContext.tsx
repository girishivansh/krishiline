"use client";
import React, { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { type SafeUser } from "@/lib/server/auth";
import { type UserRole, ROLE_CONFIGS } from "@/lib/auth/rbac";

interface AuthContextType {
  user: SafeUser | null;
  role: UserRole | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (identifier: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; message: string; redirectUrl?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => ({ success: false, message: "" }),
  logout: async () => {},
  refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SafeUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", {
        headers: { "Cache-Control": "no-cache" },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
          return;
        }
      }
      setUser(null);
    } catch (err) {
      console.error("Failed to fetch session:", err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchSession = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          headers: { "Cache-Control": "no-cache" },
        });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.authenticated && data.user) {
            setUser(data.user);
            return;
          }
        }
        if (isMounted) setUser(null);
      } catch (err) {
        console.error("Failed to fetch session:", err);
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchSession();
    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (identifier: string, password: string, rememberMe = true) => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password, rememberMe }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.user) {
        setUser(data.user);
        setIsLoading(false);
        const redirectUrl = data.redirectUrl || ROLE_CONFIGS[data.user.role as UserRole]?.defaultDashboard || "/";
        return {
          success: true,
          message: data.message || "Login successful!",
          redirectUrl,
        };
      } else {
        setIsLoading(false);
        return {
          success: false,
          message: data.message || "Login failed. Please verify your credentials.",
        };
      }
    } catch (err) {
      console.error("Login request failed:", err);
      setIsLoading(false);
      return {
        success: false,
        message: "Network or server connection failed. Please check your network.",
      };
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      setIsLoading(false);
      router.push("/login");
    } catch (err) {
      console.error("Logout error:", err);
      setUser(null);
      setIsLoading(false);
      router.push("/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role ?? null,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
