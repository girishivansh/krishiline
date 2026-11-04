"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Leaf,
  Menu,
  X,
  Sprout,
  ClipboardCheck,
  PackageCheck,
  Wallet,
  Building2,
  Users,
  ShieldCheck,
  ArrowRight,
  KeyRound,
  LogOut,
  User,
  Languages,
} from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const NAV = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "How It Works", href: "/workflow" },
  { label: "Impact", href: "/#market" },
  { label: "Safeguards", href: "/#safeguards" },
  { label: "Contact", href: "/#contact" },
];

const FARMER_NAV = [
  { label: "Farmer Portal (Dashboard)", href: "/farmer" },
  { label: "Book 4-Hour Delivery Slot", href: "/farmer/book" },
  { label: "Digital QR Gate Token", href: "/farmer/qr" },
  { label: "7/12 Land & Yield Ceiling", href: "/farmer/land" },
  { label: "Digital Quality Receipts", href: "/farmer/receipts" },
  { label: "Direct DBT Payment Tracking", href: "/farmer/payments" },
];

const FOOTER_ROLES = [
  { label: "Unified Official Gateway Login", href: "/login" },
  { label: "Step 0 — Government Admin Setup", href: "/roles/admin" },
  { label: "Role 2 — Government Clerk", href: "/roles/clerk" },
  { label: "Role 3 — Warehouse Supervisor", href: "/roles/warehouse" },
  { label: "Role 4 — Center Accountant", href: "/roles/accountant" },
  { label: "Role 5 — Collector Admin Staff", href: "/roles/collector" },
  { label: "Role 6 — FPO Cooperative Portal", href: "/roles/fpo" },
];

const LOGIN_GROUPS = [
  {
    category: "Unified Gateway",
    items: [
      {
        label: "Official Login Gateway",
        desc: "Step 0 — RBAC gateway with Employee ID verification",
        href: "/login",
        icon: KeyRound,
        tone: "text-emerald-700 bg-emerald-50",
      },
    ],
  },
  {
    category: "Procurement Center Officials",
    items: [
      {
        label: "Government Clerk",
        desc: "Weighing, grading & thermal stickers",
        href: "/roles/clerk",
        icon: ClipboardCheck,
        tone: "text-blue-700 bg-blue-50",
      },
      {
        label: "Warehouse Supervisor",
        desc: "Gate verification & queue check",
        href: "/roles/warehouse",
        icon: PackageCheck,
        tone: "text-orange-700 bg-orange-50",
      },
      {
        label: "Center Accountant",
        desc: "Digital ledger & PFMS DBT payout",
        href: "/roles/accountant",
        icon: Wallet,
        tone: "text-violet-700 bg-violet-50",
      },
    ],
  },
  {
    category: "Administration & Cooperatives",
    items: [
      {
        label: "Collector Admin",
        desc: "District vigilance & anomaly alarms",
        href: "/roles/collector",
        icon: Building2,
        tone: "text-amber-700 bg-amber-50",
      },
      {
        label: "FPO Cooperative",
        desc: "Bulk roster & group delivery slots",
        href: "/roles/fpo",
        icon: Users,
        tone: "text-rose-700 bg-rose-50",
      },
      {
        label: "Admin — Provisioning",
        desc: "Official onboarding & auth database",
        href: "/roles/admin",
        icon: ShieldCheck,
        tone: "text-slate-700 bg-slate-100",
      },
    ],
  },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const loginRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const { user, isAuthenticated, logout } = useAuth();
  const { language, toggleLanguage } = useLanguage();

  // Close dropdowns on outside click or Escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (loginRef.current && !loginRef.current.contains(event.target as Node)) {
        setLoginOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserDropdown(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setLoginOpen(false);
        setUserDropdown(false);
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const totalPortals = LOGIN_GROUPS.reduce((acc, g) => acc + g.items.length, 0);

  return (
    <header className="sticky top-0 z-40 border-b border-emerald-100 bg-white/95 backdrop-blur-md shadow-xs transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
        {/* Brand logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2 sm:gap-2.5 group">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-xs transition-transform duration-150 group-hover:scale-105">
            <Leaf size={20} className="fill-white/20" />
          </span>
          <span className="text-xl sm:text-2xl font-black tracking-tight text-emerald-950">
            Krishi-Line
          </span>
        </Link>

        {/* Desktop Main Navigation */}
        <nav className="hidden items-center gap-1 xl:gap-1.5 lg:flex" aria-label="Main Navigation">
          {NAV.map((n) => {
            const isActive = n.href === "/" ? pathname === "/" : pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-[#e8f5ec] text-[#1b7941]"
                    : "text-gray-700 hover:text-emerald-900 hover:bg-emerald-50/60"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side: Authenticated User Pill OR Login Dropdown & Farmer Portal button */}
        <div className="flex items-center gap-2 xl:gap-3 shrink-0">
          {/* Language Switcher */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50/70 px-3 py-1.5 text-xs font-bold text-emerald-900 hover:bg-emerald-100/80 transition-colors shadow-2xs"
            title="Switch Language / भाषा बदला"
          >
            <Languages size={14} className="text-emerald-700" />
            <span>{language === "en" ? "मराठी" : "English"}</span>
          </button>

          <Link
            href="/farmer"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-[#f4faf6] px-3.5 py-1.5 text-xs font-bold text-[#1b7941] hover:bg-[#e8f5ec] transition-colors"
          >
            <Sprout size={15} />
            <span>{language === "mr" ? "शेतकरी पोर्टल" : "Farmer Portal"}</span>
          </Link>

          {isAuthenticated && user ? (
            /* Authenticated User Menu */
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserDropdown((prev) => !prev)}
                className="flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-950 hover:bg-emerald-100 transition-colors shadow-2xs"
              >
                <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
                <span className="max-w-[120px] truncate sm:max-w-none">{user.name.split(" ")[0]}</span>
                <span className="hidden sm:inline rounded bg-emerald-200/70 px-1.5 py-0.5 text-[10px] text-emerald-900 font-bold uppercase">
                  {user.badge.split(" · ")[0]}
                </span>
              </button>

              {userDropdown && (
                <div className="absolute right-0 mt-2 w-72 origin-top-right rounded-2xl border border-emerald-100 bg-white p-3 shadow-2xl ring-1 ring-black/5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="border-b border-gray-100 pb-2 mb-2 px-2">
                    <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                    <p className="text-[11px] text-emerald-700 font-semibold">{user.roleTitle}</p>
                    <p className="text-[10px] text-gray-500 truncate mt-0.5">{user.centre || user.department}</p>
                  </div>

                  <div className="space-y-1">
                    <Link
                      href={user.defaultDashboard}
                      onClick={() => setUserDropdown(false)}
                      className="flex items-center justify-between rounded-xl px-2.5 py-2 text-xs font-bold text-slate-800 hover:bg-emerald-50 hover:text-emerald-900 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <User size={14} className="text-emerald-700" />
                        <span>Go to My Dashboard</span>
                      </span>
                      <ArrowRight size={13} className="text-gray-400" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdown(false);
                        logout();
                      }}
                      className="w-full flex items-center justify-between rounded-xl px-2.5 py-2 text-xs font-bold text-red-700 hover:bg-red-50 transition-colors text-left"
                    >
                      <span className="flex items-center gap-2">
                        <LogOut size={14} />
                        <span>Sign Out Securely</span>
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Unauthenticated Login Gateway Button */
            <div className="relative" ref={loginRef}>
              <button
                type="button"
                onClick={() => setLoginOpen((prev) => !prev)}
                className={`inline-flex whitespace-nowrap items-center gap-2 rounded-full px-5 py-2 text-sm font-bold shadow-xs transition-all active:scale-98 shrink-0 focus:outline-none ${
                  loginOpen
                    ? "bg-[#0b5c2f] text-white ring-2 ring-emerald-600/30"
                    : "bg-[#0d6e38] text-white hover:bg-[#0b5c2f]"
                }`}
                aria-expanded={loginOpen}
                aria-haspopup="menu"
              >
                <span>Login</span>
                <ArrowRight
                  size={14}
                  className={`transition-transform duration-200 ${loginOpen ? "rotate-90" : ""}`}
                />
              </button>

              {loginOpen && (
                <div
                  className="absolute right-0 mt-2 w-80 sm:w-96 origin-top-right rounded-2xl border border-emerald-100 bg-white p-3 shadow-2xl ring-1 ring-black/5 z-50 animate-in fade-in zoom-in-95 duration-100 max-h-[calc(100vh-80px)] overflow-y-auto"
                  role="menu"
                  aria-label="Login portals"
                >
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100 px-2">
                    <div>
                      <p className="text-xs font-bold text-emerald-900 uppercase tracking-wider">Select Login Portal</p>
                      <p className="text-[11px] text-gray-500">Access role-specific workflows &amp; dashboards</p>
                    </div>
                    <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      {totalPortals} Portals
                    </span>
                  </div>

                  <div className="space-y-3">
                    {LOGIN_GROUPS.map((group) => (
                      <div key={group.category}>
                        <p className="px-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                          {group.category}
                        </p>
                        <div className="space-y-1">
                          {group.items.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;
                            return (
                              <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setLoginOpen(false)}
                                className={`flex items-start gap-2.5 rounded-xl p-2 transition-colors ${
                                  isActive
                                    ? "bg-emerald-50/90 text-emerald-950 font-semibold ring-1 ring-emerald-200"
                                    : "text-gray-800 hover:bg-emerald-50/60 hover:text-emerald-900"
                                }`}
                                role="menuitem"
                              >
                                <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${item.tone}`}>
                                  <Icon size={15} />
                                </span>
                                <div className="min-w-0 flex-1 leading-tight">
                                  <p className="text-xs font-bold">{item.label}</p>
                                  <p className="text-[11px] text-gray-500 font-normal truncate">{item.desc}</p>
                                </div>
                                <ArrowRight size={13} className="mt-1 text-gray-400 shrink-0" />
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 border-t border-gray-100 pt-2 px-2">
                    <Link
                      href="/login"
                      onClick={() => setLoginOpen(false)}
                      className="block w-full text-center rounded-xl bg-emerald-700 py-2 text-xs font-bold text-white hover:bg-emerald-800 transition-colors shadow-xs"
                    >
                      Open Official Login Gateway →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mobile hamburger toggle */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl p-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-900 lg:hidden focus:outline-none"
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation menu"
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <nav
          className="border-t border-emerald-100 bg-white px-4 py-4 lg:hidden max-h-[calc(100vh-80px)] overflow-y-auto space-y-4"
          aria-label="Mobile Navigation"
        >
          {/* Mobile Language Switcher */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <span className="text-xs font-bold text-gray-600">Language / भाषा</span>
            <button
              type="button"
              onClick={toggleLanguage}
              className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-900"
            >
              <Languages size={13} className="text-emerald-700" />
              <span>{language === "en" ? "मराठी" : "English"}</span>
            </button>
          </div>
          {isAuthenticated && user && (
            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3.5">
              <p className="text-xs font-bold text-slate-900">{user.name}</p>
              <p className="text-[11px] text-emerald-800 font-medium">{user.roleTitle}</p>
              <div className="mt-3 flex gap-2">
                <Link
                  href={user.defaultDashboard}
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-xl bg-emerald-700 py-1.5 text-center text-xs font-bold text-white"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    setOpen(false);
                    logout();
                  }}
                  className="rounded-xl border border-red-200 bg-white px-3 py-1.5 text-xs font-bold text-red-700"
                >
                  Logout
                </button>
              </div>
            </div>
          )}

          <div>
            <p className="px-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Navigation</p>
            <div className="grid grid-cols-2 gap-1">
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-900"
                >
                  {n.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="px-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Farmer Portal</p>
            <Link
              href="/farmer"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between rounded-xl border border-emerald-200 bg-[#f4faf6] p-3 text-xs font-bold text-[#166534] hover:bg-[#eaf5ee]"
            >
              <span className="flex items-center gap-2">
                <Sprout size={18} className="text-[#16a34a]" />
                Farmer Self-Service Web Portal
              </span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div>
            <p className="px-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
              Official Portals &amp; Login
            </p>
            <div className="space-y-3">
              {LOGIN_GROUPS.map((group) => (
                <div key={group.category} className="space-y-1">
                  <p className="px-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    {group.category}
                  </p>
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl border border-gray-100 bg-gray-50/50 p-2.5 text-xs font-medium text-gray-800 hover:bg-emerald-50"
                      >
                        <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${item.tone}`}>
                          <Icon size={15} />
                        </span>
                        <div className="flex-1">
                          <p className="font-bold text-gray-900">{item.label}</p>
                          <p className="text-[10px] text-gray-500">{item.desc}</p>
                        </div>
                        <ArrowRight size={13} className="text-gray-400" />
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer id="contact" className="mt-12 border-t border-emerald-100 bg-emerald-950 text-emerald-100">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-4 sm:px-6">
        <div>
          <p className="flex items-center gap-2 text-lg font-bold text-white"><Sprout /> Krishi-Line</p>
          <p className="mt-2 text-sm text-emerald-200">
            Digital procurement infrastructure for agricultural produce — self-service booking, QR-verified intake, electronic grading, transparent ledgers, and direct DBT payments.
          </p>
          <p className="mt-3 text-sm text-emerald-200">
            Official Helpline: 1800-180-1551 (Kisan Call Centre) · Farmer Web Portal: Available 24/7
          </p>
        </div>
        <div>
          <p className="font-semibold text-white">Farmer Services</p>
          <ul className="mt-2 space-y-1.5 text-sm">
            {FARMER_NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="hover:text-white transition-colors">{n.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-semibold text-white">Institutional Portals</p>
          <ul className="mt-2 space-y-1.5 text-sm">
            {FOOTER_ROLES.map((r) => (
              <li key={r.href}>
                <Link href={r.href} className="hover:text-white transition-colors">{r.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-semibold text-white">Institutional Framework</p>
          <p className="mt-2 text-sm text-emerald-200 leading-relaxed">
            Built in alignment with Government of India Digital Public Infrastructure (DPI) guidelines, supporting NAFED, NCCF, and State Agricultural Marketing Boards. All transactions adhere to PFMS DBT protocols and AgriStack land registry standards.
          </p>
        </div>
      </div>
      <div className="border-t border-emerald-900/60 bg-emerald-950/80 px-4 py-4 text-center text-xs text-emerald-400">
        Krishi-Line National Agricultural Procurement Framework · All transactions verified with cryptographic audit trails.
      </div>
    </footer>
  );
}
