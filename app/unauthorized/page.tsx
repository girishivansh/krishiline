"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShieldAlert, ArrowRight, LogOut, Home, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { ROLE_CONFIGS, type UserRole } from "@/lib/auth/rbac";

export default function UnauthorizedPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center p-6">
          <Loader2 size={32} className="animate-spin text-emerald-700" />
        </div>
      }
    >
      <UnauthorizedContent />
    </Suspense>
  );
}

function UnauthorizedContent() {
  const searchParams = useSearchParams();
  const attempted = searchParams.get("attempted") || "this portal";
  const { user, logout } = useAuth();

  const userRole = user?.role as UserRole | undefined;
  const userConfig = userRole ? ROLE_CONFIGS[userRole] : null;

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
          <h1 className="mt-3 text-3xl font-black text-slate-900 tracking-tight">
            Unauthorized Portal Access
          </h1>
          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
            Access to <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-slate-800">{attempted}</code> is restricted. Under the NAFED/NCCF National Procurement Framework, operational tasks and digital ledgers are strictly segregated by role-based authority.
          </p>

          {user ? (
            <div className="mt-5 rounded-2xl bg-slate-50 border border-slate-200 p-4 text-xs sm:text-sm text-slate-700">
              <p>
                <b>Current User:</b> {user.name} ({user.identifier})
              </p>
              <p className="mt-1">
                <b>Assigned Role:</b> {user.roleTitle} — {user.department}
              </p>
              <p className="mt-1">
                <b>Centre:</b> {user.centre || "Not assigned"}
              </p>
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-600">
              Please sign in with valid government official credentials authorized for this division.
            </p>
          )}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {userConfig ? (
            <Link
              href={userConfig.defaultDashboard}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-emerald-800 transition-colors"
            >
              <span>Go to Your Authorized Dashboard ({userConfig.title})</span>
              <ArrowRight size={16} />
            </Link>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-emerald-800 transition-colors"
            >
              <span>Sign In to Your Account</span>
              <ArrowRight size={16} />
            </Link>
          )}

          {user && (
            <button
              onClick={() => logout()}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <LogOut size={16} />
              <span>Log Out</span>
            </button>
          )}

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Home size={16} />
            <span>Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
