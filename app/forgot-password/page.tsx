"use client";
import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight, AlertCircle, CheckCircle2, Loader2, KeyRound } from "lucide-react";

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resetUrl, setResetUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setResetUrl("");

    if (!identifier.trim()) {
      setError("Please enter your Employee ID, Phone Number, or Email.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: identifier.trim() }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok && data.success) {
        setSuccess(data.message);
        if (data.resetUrl) {
          setResetUrl(data.resetUrl);
        }
      } else {
        setError(data.message || "Failed to process request.");
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      setLoading(false);
      setError("Network or server connection failed.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md">
        <div className="text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-700 text-white shadow-md">
            <KeyRound size={28} />
          </div>
          <h1 className="mt-4 text-3xl font-black text-slate-900 tracking-tight">
            Account Recovery
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Request an authorized password reset token for your Krishi-Line official account.
          </p>
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-start gap-2.5 rounded-2xl bg-red-50 border border-red-200 p-4 text-xs sm:text-sm text-red-800">
                <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
                <p className="leading-snug">{error}</p>
              </div>
            )}

            {success && (
              <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs sm:text-sm text-emerald-900">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 size={18} className="text-emerald-700 shrink-0 mt-0.5" />
                  <p className="leading-snug font-medium">{success}</p>
                </div>

                {resetUrl && (
                  <div className="mt-4 border-t border-emerald-200/60 pt-3">
                    <p className="text-xs font-bold text-emerald-950 uppercase tracking-wider mb-1.5">
                      Security Reset Link (Valid for 15 minutes):
                    </p>
                    <Link
                      href={resetUrl}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-800 transition-colors shadow-2xs"
                    >
                      <span>Proceed to Reset Password Page →</span>
                    </Link>
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Employee ID, Mobile, or Official Email
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Mail size={18} />
                </div>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. EMP-1001 or 9876541234"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-700 py-3.5 px-4 text-sm font-bold text-white shadow-sm hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600/40 disabled:opacity-60 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Generating Secure Token...</span>
                </>
              ) : (
                <>
                  <span>Request Reset Link</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-5 text-center">
            <Link
              href="/login"
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
            >
              ← Back to Sign In Gateway
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
