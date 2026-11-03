"use client";
import React, { useEffect, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { ShieldAlert, ArrowRight, LogOut, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { type UserRole, ROLE_CONFIGS } from "@/lib/auth/rbac";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole | UserRole[];
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isLoading, isAuthenticated, router, pathname]);

  // Loading state: prevent flashing protected content before authentication checks complete
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 shadow-sm animate-pulse">
          <Loader2 size={32} className="animate-spin" />
        </div>
        <h2 className="mt-5 text-lg font-bold text-slate-800">Verifying Digital Credentials</h2>
        <p className="mt-1.5 text-sm text-slate-500 max-w-sm">
          Authenticating official session with the Krishi-Line state security gateway...
        </p>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated || !user) {
    return null; // Will redirect via useEffect
  }

  // Check role authorization
  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    // Admin has overarching administrative clearance across institutional portals
    const hasPermission = user.role === "admin" || roles.includes(user.role);

    if (!hasPermission) {
      const allowedConfig = ROLE_CONFIGS[user.role];
      const targetConfig = roles.length === 1 ? ROLE_CONFIGS[roles[0]] : null;

      return (
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
          <div className="overflow-hidden rounded-3xl border border-red-200 bg-white p-8 sm:p-10 shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 border border-red-200 text-red-600">
              <ShieldAlert size={32} />
            </div>

            <div className="mt-6">
              <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-red-700 bg-red-50 border border-red-200 px-3 py-1 rounded-full">
                Security Clearance Protocol 403
              </span>
              <h1 className="mt-3 text-2xl font-black text-slate-900">
                Restricted Operational Portal
              </h1>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                You are currently signed in as <b>{user.name}</b> with the designation{" "}
                <span className="font-semibold text-slate-800">{user.roleTitle}</span> ({user.department}).
              </p>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                This portal requires{" "}
                <b>{targetConfig?.title || roles.join(" / ")}</b> administrative permissions. Cross-role operational actions are strictly sequestered by the National Procurement Audit Framework.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={allowedConfig?.defaultDashboard || "/"}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-emerald-800 transition-colors"
              >
                <span>Return to Your Dashboard ({allowedConfig?.title})</span>
                <ArrowRight size={16} />
              </Link>
              <button
                onClick={() => logout()}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <LogOut size={16} />
                <span>Switch Officer Account</span>
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  // Authenticated & authorized
  return <>{children}</>;
}
