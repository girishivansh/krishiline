"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  User,
  ArrowRight,
  ClipboardCheck,
  PackageCheck,
  Wallet,
  Building2,
  Users,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Loader2,
  KeyRound,
  Landmark,
} from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { ROLE_CONFIGS, type UserRole } from "@/lib/auth/rbac";

interface OfficialPreset {
  name: string;
  identifier: string;
  role: UserRole;
  roleTitle: string;
  centre: string;
  targetHref: string;
  icon: typeof ClipboardCheck;
}

const PRESET_OFFICIALS: OfficialPreset[] = [
  {
    name: "Sanjay Deshmukh",
    identifier: "EMP-1001",
    role: "clerk",
    roleTitle: "Government Mandi Clerk",
    centre: "Nashik Procurement Center - 1",
    targetHref: "/roles/clerk",
    icon: ClipboardCheck,
  },
  {
    name: "Anil Pawar",
    identifier: "EMP-1002",
    role: "warehouse",
    roleTitle: "Warehouse Supervisor",
    centre: "Nashik Procurement Center - 1",
    targetHref: "/roles/warehouse",
    icon: PackageCheck,
  },
  {
    name: "Meera Joshi",
    identifier: "EMP-1003",
    role: "accountant",
    roleTitle: "Center Accountant",
    centre: "Nashik Procurement Center - 1",
    targetHref: "/roles/accountant",
    icon: Wallet,
  },
  {
    name: "Rahul Verma",
    identifier: "EMP-1004",
    role: "collector",
    roleTitle: "Collector Admin Staff",
    centre: "Nashik District Headquarters",
    targetHref: "/roles/collector",
    icon: Building2,
  },
  {
    name: "Kisan Cooperative FPO",
    identifier: "EMP-FPO-01",
    role: "fpo",
    roleTitle: "FPO Cooperative Manager",
    centre: "Nashik Agro Cluster",
    targetHref: "/roles/fpo",
    icon: Users,
  },
  {
    name: "District Administrator",
    identifier: "EMP-ADMIN-01",
    role: "admin",
    roleTitle: "System Administrator",
    centre: "State IT / Agriculture Dept",
    targetHref: "/roles/admin",
    icon: ShieldCheck,
  },
];

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");

  const { login, user, isAuthenticated, isLoading: authLoading } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"official" | "farmer">("official");

  // If already authenticated, redirect to destination
  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      const destination = redirectParam || ROLE_CONFIGS[user.role]?.defaultDashboard || "/";
      router.push(destination);
    }
  }, [authLoading, isAuthenticated, user, redirectParam, router]);

  const handleSelectPreset = (preset: OfficialPreset) => {
    setIdentifier(preset.identifier);
    setPassword("Password@123");
    setError("");
    setSuccess(`Loaded credentials for ${preset.name} (${preset.roleTitle})`);
  };

  const handleFarmerPreset = () => {
    setIdentifier("9876541234");
    setPassword("Password@123");
    setError("");
    setSuccess("Loaded credentials for Ramesh Patil (Farmer / Producer)");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!identifier.trim()) {
      setError("Please enter your Employee ID, Mobile Number, or Email.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setSubmitting(true);
    const result = await login(identifier.trim(), password, rememberMe);
    setSubmitting(false);

    if (result.success) {
      setSuccess("Authentication verified! Redirecting to secure dashboard...");
      const target = redirectParam || result.redirectUrl || "/";
      setTimeout(() => {
        router.push(target);
      }, 400);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl">
        {/* National Emblem / Header Badge */}
        <div className="text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-700 text-white shadow-md">
            <Landmark size={28} />
          </div>
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-800">
              <ShieldCheck size={14} className="text-emerald-700" />
              <span>National Single Sign-On Gateway</span>
            </span>
          </div>
          <h1 className="mt-3 text-3xl font-black text-slate-900 tracking-tight sm:text-4xl">
            Krishi-Line Secure Login
          </h1>
          <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">
            Authorized portal access for Mandi Officials, Warehouse Supervisors, District Vigilance, and Producers.
          </p>
        </div>

        {/* Login Card */}
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
          {/* Role Category Tabs */}
          <div className="flex rounded-2xl bg-slate-100 p-1 mb-6 text-xs sm:text-sm font-bold">
            <button
              type="button"
              onClick={() => {
                setActiveTab("official");
                setError("");
                setSuccess("");
              }}
              className={`flex-1 rounded-xl py-2.5 transition-all text-center ${
                activeTab === "official"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Government Officials &amp; Mandi
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("farmer");
                setError("");
                setSuccess("");
              }}
              className={`flex-1 rounded-xl py-2.5 transition-all text-center ${
                activeTab === "farmer"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Producer / Farmer Portal
            </button>
          </div>

          {/* Quick-Select Verification Chips for Testing / Review */}
          <div className="mb-6 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 p-4">
            <p className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <KeyRound size={13} className="text-emerald-700" />
              <span>Quick-Test Role Credentials (Click to prefill)</span>
            </p>

            {activeTab === "official" ? (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {PRESET_OFFICIALS.map((preset) => {
                  const Icon = preset.icon;
                  const isSelected = identifier === preset.identifier;
                  return (
                    <button
                      key={preset.identifier}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`flex flex-col items-start rounded-xl border p-2.5 text-left transition-all ${
                        isSelected
                          ? "border-emerald-600 bg-emerald-100 text-emerald-950 font-bold shadow-xs"
                          : "border-slate-200 bg-white text-slate-700 hover:border-emerald-400 hover:bg-emerald-50/50"
                      }`}
                    >
                      <span className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                        <Icon size={13} className="text-emerald-700 shrink-0" />
                        <span className="truncate">{preset.identifier}</span>
                      </span>
                      <span className="mt-1 text-[11px] text-slate-500 truncate w-full">
                        {preset.roleTitle.split(" ")[0]} · {preset.name.split(" ")[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div>
                <button
                  type="button"
                  onClick={handleFarmerPreset}
                  className="w-full flex items-center justify-between rounded-xl border border-emerald-300 bg-white p-3 text-left hover:bg-emerald-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-emerald-700" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">Ramesh Patil (KL-FARMER-001)</p>
                      <p className="text-[11px] text-slate-500">Mobile: 9876541234 · Village Kahan, Gat 142/A</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                    Select Farmer
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-start gap-2.5 rounded-2xl bg-red-50 border border-red-200 p-4 text-xs sm:text-sm text-red-800">
                <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
                <p className="leading-snug">{error}</p>
              </div>
            )}

            {success && (
              <div className="flex items-start gap-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs sm:text-sm text-emerald-800">
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                <p className="leading-snug">{success}</p>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                {activeTab === "official" ? "Employee ID / Official Email" : "Registered Mobile / Farmer ID"}
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={activeTab === "official" ? "e.g. EMP-1001 or email" : "e.g. 9876541234 or KL-FARMER-001"}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password (default: Password@123)"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-11 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-xs font-medium text-slate-600">Remember session (30 days)</span>
              </label>

              <span className="text-[11px] text-slate-400 font-medium">
                SHA-256 / bcrypt encrypted
              </span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-700 py-3.5 px-4 text-sm font-bold text-white shadow-sm hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600/40 disabled:opacity-60 transition-all"
            >
              {submitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Registration link */}
          <div className="mt-6 border-t border-slate-100 pt-5 text-center">
            <p className="text-xs text-slate-600">
              New Producer or FPO Cluster?{" "}
              <Link
                href="/register"
                className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
              >
                Register Self-Service Account →
              </Link>
            </p>
            <p className="mt-2 text-[11px] text-slate-400 leading-relaxed">
              Official Mandi staff accounts are locked by the State Master Roster (Emp ID series EMP-1001 to EMP-1004).
            </p>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-700" />
            <span>NIST RBAC Compliant</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Lock size={14} className="text-emerald-700" />
            <span>HttpOnly Secure Cookies</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Landmark size={14} className="text-emerald-700" />
            <span>PFMS Audit Protected</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-700" />
            <p className="text-sm font-medium text-slate-600">Loading Krishi-Line Single Sign-On...</p>
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
