"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  IndianRupee,
  ShieldCheck,
  Clock,
  Users,
  Building2,
  ArrowRight,
  ClipboardCheck,
  PackageCheck,
  Wallet,
  ShieldAlert,
  Printer,
  TrendingUp,
  Leaf,
  Zap,
  Target,
  Layers,
  TriangleAlert,
  FileText,
  Check,
  Activity,
  Landmark,
  QrCode,
  Sparkles,
  Sprout,
} from "lucide-react";
import { DISTRICT, CENTRES } from "@/lib/data";

const ROLES = [
  {
    step: "01",
    role: "Farmer",
    title: "Farmer Web Portal",
    desc: "Self-service booking, 7/12 land record verification, guaranteed delivery slot token, and direct DBT tracker.",
    href: "/farmer",
    icon: Sprout,
    tags: ["Web Portal", "Land Records", "QR Token"],
  },
  {
    step: "02",
    role: "Mandi",
    title: "Government Clerk",
    desc: "Live trolley weighment, electronic quality grading, and tamper-proof thermal QR sticker generation.",
    href: "/roles/clerk",
    icon: ClipboardCheck,
    tags: ["Weigh & Grade", "Thermal QR Sticker", "Digital Receipt"],
  },
  {
    step: "03",
    role: "Warehouse",
    title: "Warehouse Supervisor",
    desc: "Gate security, physical batch inspection, and automated anti-cartel FIFO queue reordering.",
    href: "/roles/warehouse",
    icon: PackageCheck,
    tags: ["Live FIFO Queue", "Batch Inspection", "Gate Pass"],
  },
  {
    step: "04",
    role: "Finance",
    title: "Center Accountant",
    desc: "Automated digital ledger, transparent Mandi deductions, and direct PFMS DBT payment processing.",
    href: "/roles/accountant",
    icon: Wallet,
    tags: ["Digital Ledger", "PFMS Invoices", "Direct DBT Payout"],
  },
  {
    step: "05",
    role: "Vigilance",
    title: "Collector Admin Staff",
    desc: "District monitoring, cross-center variance detection, and automated anomaly vigilance alarms.",
    href: "/roles/collector",
    icon: Building2,
    tags: ["District Monitoring", "Variance Alarms", "Audit Logs"],
  },
  {
    step: "06",
    role: "Cooperative",
    title: "FPO Cooperative",
    desc: "Aggregated crop upload, cooperative member rosters, and collective bulk slot reservation.",
    href: "/roles/fpo",
    icon: Users,
    tags: ["Bulk Crop Roster", "Group Delivery Slots", "Member Tracking"],
  },
];

const SAFEGUARDS = [
  {
    icon: Clock,
    title: "Standby Queue & Dynamic Capacity Buffer",
    desc: "Centres schedule to 90% capacity, retaining a 10% hourly cushion. Deliveries outside their 4-hour window transition smoothly to the Standby Queue or receive an automated Next-Day Priority Token.",
  },
  {
    icon: PackageCheck,
    title: "Dynamic FIFO Queue Reconciliation",
    desc: "When trolleys arrive out of scheduled sequence at the mandi gate, scanning the QR token instantly synchronizes the warehouse inspection queue to ensure strictly chronological, anti-favoritism processing.",
  },
  {
    icon: Printer,
    title: "Tamper-Evident Thermal QR Seals",
    desc: "Mandi weighment slips utilize destructible thermal substrate labels that fragment upon peeling, preventing physical transfer between batches while matching the cryptographic digital ledger.",
  },
  {
    icon: ShieldAlert,
    title: "Multi-Tier Variance Alarms & Treasury Locks",
    desc: "Global acreage yield ceilings (e.g. 120 quintals per 2 acres) cross-reference satellite crop surveys. Outlier grading distributions (e.g. 70%+ Grade-1 vs. 30% regional norm) automatically freeze disbursements pending Collector review.",
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero — matches the target design mockup */}
      <section id="about" className="relative overflow-hidden bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pt-8 pb-14 sm:px-6 sm:pt-12 sm:pb-16 lg:grid-cols-12 lg:gap-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6"
          >
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#e8f5ec] border border-[#c6e7d0] px-3.5 py-1 text-xs font-bold text-[#1b7941]">
              <Leaf size={14} className="fill-[#1b7941] text-[#1b7941]" />
              <span>NAFED / NCCF – Nashik Model</span>
            </div>

            {/* Headline */}
            <div className="mt-4">
              <h1 className="text-4xl font-black tracking-tight text-[#0f172a] sm:text-5xl lg:text-6xl leading-[1.08]">
                Fair Prices<br />
                <span className="text-[#15803d]">For Our Farmers</span>
              </h1>
              <div className="mt-1">
                <svg className="w-24 sm:w-28 text-[#16a34a]" viewBox="0 0 100 10" fill="none">
                  <path d="M 4 7 Q 50 1 96 6" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {/* Description */}
            <p className="mt-4 max-w-xl text-base text-slate-600 sm:text-lg leading-relaxed font-normal">
              A transparent digital procurement platform to eliminate middlemen, prevent corruption and ensure timely payments.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <Link
                href="/farmer"
                className="inline-flex items-center gap-2 rounded-2xl bg-[#0d6e38] px-6 py-3.5 text-sm sm:text-base font-bold text-white shadow-xs hover:bg-[#095229] transition-all"
              >
                Get Started <ArrowRight size={18} />
              </Link>
            </div>

            {/* 3 Feature Badges */}
            <div className="mt-10 flex flex-wrap items-center gap-6 sm:gap-8 pt-2">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eaf5ee] text-[#16a34a]">
                  <ShieldCheck size={22} />
                </div>
                <div className="leading-tight">
                  <p className="text-xs sm:text-sm font-bold text-slate-900">Transparent</p>
                  <p className="text-xs sm:text-sm font-bold text-slate-900">Procurement</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eaf5ee] text-[#16a34a]">
                  <IndianRupee size={20} className="font-bold" />
                </div>
                <div className="leading-tight">
                  <p className="text-xs sm:text-sm font-bold text-slate-900">Fair</p>
                  <p className="text-xs sm:text-sm font-bold text-slate-900">Market Prices</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eaf5ee] text-[#16a34a]">
                  <Zap size={20} className="fill-[#16a34a] text-[#16a34a]" />
                </div>
                <div className="leading-tight">
                  <p className="text-xs sm:text-sm font-bold text-slate-900">Faster</p>
                  <p className="text-xs sm:text-sm font-bold text-slate-900">Payments</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Hero Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 relative flex items-center justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-lg lg:max-w-xl xl:max-w-2xl transform lg:scale-110 xl:scale-115 origin-center lg:origin-right transition-transform">
              <Image
                src="/farmer-hero.png"
                alt="Fair Prices For Our Farmers - Krishi-Line NAFED/NCCF procurement"
                width={1008}
                height={928}
                priority
                className="h-auto w-full object-contain"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Real-Time Procurement Telemetry Section */}
      <section id="market" className="relative bg-[#fbfdfc] py-16 sm:py-20 border-t border-emerald-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#e8f5ec] border border-[#c6e7d0] px-3.5 py-1 text-xs font-bold text-[#1b7941] mb-3">
              <Activity size={14} className="text-[#1b7941]" />
              <span>District Scale &amp; Telemetry</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 sm:text-4xl lg:text-5xl tracking-tight leading-tight">
              Real-Time <span className="text-[#15803d]">Procurement Metrics</span>
            </h2>
            <div className="mt-2.5 h-1.5 w-16 rounded-full bg-[#16a34a]" />
            <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed font-normal">
              Live district-wide intake monitoring, throughput analytics, and automated Direct Benefit Transfer reconciliation across Nashik Mandis.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Leaf,
                value: `${DISTRICT.quintalsProcured.toLocaleString("en-IN")} Qtl`,
                label: "District Verified Intake",
                note: `${DISTRICT.farmers.toLocaleString("en-IN")} registered farmers across Nashik district`,
              },
              {
                icon: IndianRupee,
                value: "₹31.45 Cr",
                label: "Net DBT Disbursed",
                note: "Direct bank account settlement via PFMS with zero leakage",
              },
              {
                icon: Building2,
                value: `${DISTRICT.centres} Mandis`,
                label: "Operational Mandis",
                note: "Synchronized digital weighbridges & optical grading units",
              },
              {
                icon: Clock,
                value: "< 42 Mins",
                label: "Avg. Mandi Turnaround",
                note: "Guaranteed 4-hour slot windows eliminate overnight queues",
              },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.label}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#d8ecd8] bg-white p-6 sm:p-7 shadow-xs hover:border-[#16a34a]/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div>
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eaf5ee] border border-[#c6e7d0] text-[#16a34a] shadow-2xs transition-transform duration-300 group-hover:scale-105">
                      <Icon size={20} strokeWidth={2.2} />
                    </div>
                    <p className="mt-5 text-3xl font-black text-slate-900 tracking-tight">
                      {s.value}
                    </p>
                    <p className="mt-1.5 text-sm font-bold text-slate-800">
                      {s.label}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                      {s.note}
                    </p>
                  </div>
                  <div className="absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-[#e8f5ec]/70 pointer-events-none transition-transform duration-300 group-hover:scale-125" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Role-wise workflow — One Platform, Every Role */}
      <section className="bg-white py-16 sm:py-24 border-t border-emerald-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#e8f5ec] border border-[#c6e7d0] px-3.5 py-1 text-xs font-bold text-[#1b7941] mb-3">
              <Users size={14} className="text-[#1b7941]" />
              <span>Multi-Role Architecture</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 sm:text-4xl lg:text-5xl tracking-tight leading-tight">
              One Platform, <span className="text-[#15803d]">Every Role</span>
            </h2>
            <div className="mt-2.5 h-1.5 w-16 rounded-full bg-[#16a34a]" />
            <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed font-normal">
              A transparent digital procurement platform — explore six specialized role portals designed for farmers, mandis, and district administration.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ROLES.map((r) => {
              const Icon = r.icon;
              return (
                <Link key={r.title} href={r.href} className="group">
                  <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-[#d8ecd8] bg-white p-6 sm:p-7 shadow-xs hover:border-[#16a34a]/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div>
                      {/* Top Row: Icon tile + Role Step Tag */}
                      <div className="flex items-center justify-between">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eaf5ee] border border-[#c6e7d0] text-[#16a34a] shadow-2xs transition-transform duration-300 group-hover:scale-105">
                          <Icon size={20} strokeWidth={2.2} />
                        </div>
                        <span className="inline-flex items-center rounded-full bg-[#e8f5ec] border border-[#c6e7d0] px-3 py-1 text-[11px] font-bold text-[#1b7941] tracking-wide">
                          {r.role} · {r.step}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <h3 className="mt-4 text-lg font-black text-[#0f172a] group-hover:text-[#15803d] transition-colors leading-tight">
                        {r.title}
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                        {r.desc}
                      </p>

                      {/* Clean Tag Pills */}
                      <div className="mt-4 flex flex-wrap gap-1.5 relative z-10">
                        {r.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-lg bg-[#f4faf6] border border-[#cce8d5] px-2.5 py-1 text-[11px] font-semibold text-[#166534] transition-colors group-hover:bg-[#eaf5ee] group-hover:border-[#16a34a]/40"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-[#e8f5ec]/70 pointer-events-none transition-transform duration-300 group-hover:scale-125" />
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Trust Safeguards Bar */}
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#d8ecd8] bg-[#f8fbf9] px-6 py-4 text-xs sm:text-sm font-semibold text-slate-700">
            <span className="flex items-center gap-2"><ShieldCheck className="text-emerald-700" size={18} /> Transparent Procurement</span>
            <span className="flex items-center gap-2"><Users className="text-emerald-700" size={18} /> Role-Based Access Control</span>
            <span className="flex items-center gap-2"><TrendingUp className="text-emerald-700" size={18} /> Real-Time Sync</span>
            <span className="flex items-center gap-2"><ShieldAlert className="text-emerald-700" size={18} /> Anomaly Alarms</span>
            <span className="flex items-center gap-2"><IndianRupee className="text-emerald-700" size={18} /> Direct PFMS DBT</span>
          </div>
        </div>
      </section>

      {/* The Challenge / The Problem Section */}
      <section id="problem" className="relative overflow-hidden bg-white py-16 sm:py-24 border-t border-emerald-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-stretch gap-10 lg:grid-cols-12 lg:gap-14">
            {/* Left Column: Heading, Subtitle & Why Krishi-Line (stretched to match right cards height) */}
            <div className="lg:col-span-5 flex flex-col justify-between h-full">
              <div>
                {/* Pill Badge */}
                <div className="inline-flex items-center gap-2 rounded-full bg-[#e8f5ec] border border-[#c6e7d0] px-3.5 py-1 text-xs font-bold text-[#1b7941]">
                  <Target size={15} className="text-[#1b7941]" />
                  <span>The Problem</span>
                </div>

                {/* Heading */}
                <div className="mt-4">
                  <h2 className="text-4xl font-black tracking-tight text-[#0f172a] sm:text-5xl lg:text-6xl">
                    The <span className="text-[#15803d]">Challenge</span>
                  </h2>
                  <div className="mt-2.5 h-1.5 w-16 rounded-full bg-[#16a34a]" />
                </div>

                {/* Subtitle */}
                <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-md">
                  Farmers face multiple challenges in the onion procurement process, leading to losses and lack of trust.
                </p>
              </div>

              {/* Why Krishi-Line? — Aligned flush to the bottom level of right cards */}
              <div className="pt-5 border-t border-slate-100 max-w-md mt-6 lg:mt-0">
                <span className="inline-block text-[11px] font-black uppercase tracking-wider text-[#15803d] bg-[#e8f5ec] border border-[#c6e7d0] px-2.5 py-0.5 rounded-full mb-1.5">
                  Why Krishi-Line?
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  A Better Procurement Experience
                </h3>

                <ul className="mt-3.5 space-y-2.5">
                  <li className="flex items-start gap-2.5">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#eaf5ee] text-[#16a34a] mt-0.5">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-snug">
                      <strong className="font-bold text-slate-900">Planned Arrivals</strong> – Book a delivery slot and reduce unnecessary waiting.
                    </p>
                  </li>

                  <li className="flex items-start gap-2.5">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#eaf5ee] text-[#16a34a] mt-0.5">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-snug">
                      <strong className="font-bold text-slate-900">Verified Transactions</strong> – Maintain digital records of weighing and quality grading.
                    </p>
                  </li>

                  <li className="flex items-start gap-2.5">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#eaf5ee] text-[#16a34a] mt-0.5">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-snug">
                      <strong className="font-bold text-slate-900">Clear Payment Tracking</strong> – Check procurement and payment status in one place.
                    </p>
                  </li>
                </ul>

                <p className="mt-4 text-xs sm:text-sm font-extrabold text-[#15803d] tracking-wide">
                  One platform. Every transaction. Greater transparency.
                </p>
              </div>
            </div>

            {/* Right Column: 2x2 Grid of 4 Problem Cards */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              <div className="group relative overflow-hidden rounded-3xl border border-[#d8ecd8] bg-white p-8 sm:p-10 flex flex-col items-center justify-center text-center shadow-xs hover:shadow-md hover:-translate-y-1 transition-all">
                <div className="mb-5 flex h-14 w-14 items-center justify-center text-[#16a34a]">
                  <Layers size={46} strokeWidth={2.2} />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  Manual &amp;<br />Slow Process
                </h3>
                <div className="absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-[#e8f5ec]/70 pointer-events-none transition-transform group-hover:scale-110" />
              </div>

              <div className="group relative overflow-hidden rounded-3xl border border-[#d8ecd8] bg-white p-8 sm:p-10 flex flex-col items-center justify-center text-center shadow-xs hover:shadow-md hover:-translate-y-1 transition-all">
                <div className="mb-5 flex h-14 w-14 items-center justify-center text-[#16a34a]">
                  <TriangleAlert size={46} strokeWidth={2.2} />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  Middlemen &amp;<br />Leakage
                </h3>
                <div className="absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-[#e8f5ec]/70 pointer-events-none transition-transform group-hover:scale-110" />
              </div>

              <div className="group relative overflow-hidden rounded-3xl border border-[#d8ecd8] bg-white p-8 sm:p-10 flex flex-col items-center justify-center text-center shadow-xs hover:shadow-md hover:-translate-y-1 transition-all">
                <div className="mb-5 flex h-14 w-14 items-center justify-center text-[#16a34a]">
                  <IndianRupee size={46} strokeWidth={2.4} />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  Unfair<br />Pricing
                </h3>
                <div className="absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-[#e8f5ec]/70 pointer-events-none transition-transform group-hover:scale-110" />
              </div>

              <div className="group relative overflow-hidden rounded-3xl border border-[#d8ecd8] bg-white p-8 sm:p-10 flex flex-col items-center justify-center text-center shadow-xs hover:shadow-md hover:-translate-y-1 transition-all">
                <div className="mb-5 flex h-14 w-14 items-center justify-center text-[#16a34a]">
                  <FileText size={46} strokeWidth={2.2} />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  Lack of<br />Transparency
                </h3>
                <div className="absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-[#e8f5ec]/70 pointer-events-none transition-transform group-hover:scale-110" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Safeguards — Institutional Integrity */}
      <section id="safeguards" className="relative bg-[#fbfdfc] py-16 sm:py-24 border-t border-emerald-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#e8f5ec] border border-[#c6e7d0] px-3.5 py-1 text-xs font-bold text-[#1b7941] mb-3">
              <ShieldCheck size={14} className="text-[#1b7941]" />
              <span>System Integrity &amp; Safeguards</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 sm:text-4xl lg:text-5xl tracking-tight leading-tight">
              Multi-Tier <span className="text-[#15803d]">Fraud Prevention</span>
            </h2>
            <div className="mt-2.5 h-1.5 w-16 rounded-full bg-[#16a34a]" />
            <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed font-normal">
              Built-in institutional checks ensure queue discipline, tamper-evident physical tracking, and treasury security across every stage of the procurement cycle.
            </p>
          </div>

          {/* Safeguards Grid */}
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {SAFEGUARDS.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.title}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#d8ecd8] bg-white p-7 sm:p-8 shadow-xs hover:border-[#16a34a]/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div>
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#eaf5ee] border border-[#c6e7d0] text-[#16a34a] shadow-2xs transition-transform duration-300 group-hover:scale-105">
                      <Icon size={22} strokeWidth={2.2} />
                    </div>
                    <h3 className="mt-5 text-xl font-black text-slate-900 leading-snug">
                      {s.title}
                    </h3>
                    <p className="mt-2.5 text-sm text-slate-600 leading-relaxed font-normal">
                      {s.desc}
                    </p>
                  </div>
                  <div className="absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-[#e8f5ec]/70 pointer-events-none transition-transform duration-300 group-hover:scale-125" />
                </div>
              );
            })}
          </div>

          {/* Safeguard Portals Quick Access */}
          <div className="mt-10 flex flex-wrap items-center gap-3.5">
            <Link
              href="/roles/collector"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#0d6e38] px-5 py-3 text-sm font-bold text-white shadow-xs hover:bg-[#095229] transition-all"
            >
              Collector Vigilance Portal <ArrowRight size={16} />
            </Link>
            <Link
              href="/roles/warehouse"
              className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-slate-800 hover:bg-gray-50 transition-all shadow-2xs"
            >
              Warehouse Gate Protocol
            </Link>
            <Link
              href="/farmer"
              className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-slate-800 hover:bg-gray-50 transition-all shadow-2xs"
            >
              Farmer Web Portal
            </Link>
          </div>
        </div>
      </section>

      {/* Institutional Operating Model & National Architecture */}
      <section id="resources" className="bg-white py-16 sm:py-24 border-t border-emerald-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#e8f5ec] border border-[#c6e7d0] px-3.5 py-1 text-xs font-bold text-[#1b7941] mb-3">
              <Layers size={14} className="text-[#1b7941]" />
              <span>National DPI Standards</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 sm:text-4xl lg:text-5xl tracking-tight leading-tight">
              Institutional Architecture &amp; <span className="text-[#15803d]">AgriStack Integration</span>
            </h2>
            <div className="mt-2.5 h-1.5 w-16 rounded-full bg-[#16a34a]" />
            <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed font-normal">
              Built to operate as an institutional digital public good, seamlessly interoperable with state land registries, certified mandi sensors, and central payment gateways.
            </p>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            {/* Column 1: Operating Model */}
            <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#d8ecd8] bg-white p-8 sm:p-9 shadow-xs hover:shadow-lg transition-all duration-300">
              <div>
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#eaf5ee] border border-[#c6e7d0] text-[#16a34a] shadow-2xs">
                  <Building2 size={24} strokeWidth={2.2} />
                </div>
                <h3 className="mt-5 text-2xl font-black text-slate-900 leading-tight">
                  Operating &amp; Sustainability Framework
                </h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed font-normal">
                  A structured B2G framework ensuring zero cost to farmers while supporting procurement agencies with reliable, end-to-end digital auditability.
                </p>

                <ul className="mt-6 space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#eaf5ee] text-[#16a34a] mt-0.5">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Government B2G Enterprise Framework</p>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                        Seasonal operational deployment with nodal agencies (NAFED / NCCF) covering standardized cloud infrastructure, thermal printing kits, and weighbridge IoT integration.
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#eaf5ee] text-[#16a34a] mt-0.5">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">FPO &amp; Cooperative Enablement</p>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                        Dedicated bulk intake portals for Farmer Producer Organizations, enabling consolidated member scheduling, shared logistics, and automated ledger disbursements.
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#eaf5ee] text-[#16a34a] mt-0.5">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Anonymized Macro Market Intelligence</p>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                        Aggregated district supply volumes, moisture content, and grading distributions informing national buffer stock management and market price stabilization.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="absolute -bottom-8 -right-8 h-28 w-28 rounded-full bg-[#e8f5ec]/70 pointer-events-none" />
            </div>

            {/* Column 2: Technical DPI Roadmap */}
            <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#d8ecd8] bg-white p-8 sm:p-9 shadow-xs hover:shadow-lg transition-all duration-300">
              <div>
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#eaf5ee] border border-[#c6e7d0] text-[#16a34a] shadow-2xs">
                  <Layers size={24} strokeWidth={2.2} />
                </div>
                <h3 className="mt-5 text-2xl font-black text-slate-900 leading-tight">
                  AgriStack &amp; DPI Interoperability
                </h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed font-normal">
                  Architected for out-of-the-box integration with India&apos;s Digital Public Infrastructure and state land record APIs.
                </p>

                <ul className="mt-6 space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#eaf5ee] text-[#16a34a] mt-0.5">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">National Farmer Registry (AgriStack)</p>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                        Automated verification against state land registries (e.g. MahaBhulekh / e-Pik Pahani) to validate land ownership, survey numbers (Gat), and crop yields prior to token generation.
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#eaf5ee] text-[#16a34a] mt-0.5">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Electronic Weighbridge &amp; Optical Grading</p>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                        Certified digital load-cell integration with automated weigh slips and standardized computer vision quality grading, eliminating manual recording errors.
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#eaf5ee] text-[#16a34a] mt-0.5">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Direct Benefit Transfer via PFMS</p>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                        Direct integration with the Public Financial Management System (PFMS) and RBI e-Kuber pipeline, ensuring guaranteed T+1 direct bank disbursement to farmer accounts.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="absolute -bottom-8 -right-8 h-28 w-28 rounded-full bg-[#e8f5ec]/70 pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner & District Procurement Nodes */}
      <section className="bg-[#fbfdfc] py-16 sm:py-24 border-t border-emerald-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* High-Impact Green Banner with Rich Stylish Background */}
          <div className="relative overflow-hidden rounded-[32px] border border-emerald-500/30 bg-gradient-to-br from-[#052e16] via-[#094824] to-[#0f6836] p-8 sm:p-12 lg:p-14 text-white shadow-2xl">
            {/* 1. Fine Micro-Dot Mesh Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1.2px,transparent_1.2px)] [background-size:24px_24px] opacity-15 [mask-image:radial-gradient(ellipse_at_top_right,black_60%,transparent_100%)] pointer-events-none" />

            {/* 2. Topographic & Orbital SVG Contour Waves */}
            <svg
              className="absolute inset-0 h-full w-full pointer-events-none"
              viewBox="0 0 1200 600"
              fill="none"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <linearGradient id="cta-wave-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6ee7b7" stopOpacity="0.28" />
                  <stop offset="50%" stopColor="#34d399" stopOpacity="0.14" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
                </linearGradient>
                <linearGradient id="cta-circle-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a7f3d0" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#059669" stopOpacity="0.03" />
                </linearGradient>
              </defs>

              {/* Concentric orbital radar rings on the right */}
              <circle cx="960" cy="300" r="120" stroke="url(#cta-circle-grad)" strokeWidth="1.5" strokeDasharray="4 6" />
              <circle cx="960" cy="300" r="210" stroke="url(#cta-circle-grad)" strokeWidth="1.5" />
              <circle cx="960" cy="300" r="320" stroke="url(#cta-circle-grad)" strokeWidth="1.5" strokeDasharray="8 8" />
              <circle cx="960" cy="300" r="460" stroke="url(#cta-circle-grad)" strokeWidth="1.5" />
              <circle cx="960" cy="300" r="620" stroke="url(#cta-circle-grad)" strokeWidth="1" strokeDasharray="3 7" />

              {/* Flowing topographic contour waves across bottom & right */}
              <path d="M 150 600 C 450 500, 680 220, 1200 160" stroke="url(#cta-wave-grad)" strokeWidth="2" />
              <path d="M 50 600 C 380 440, 720 160, 1200 70" stroke="url(#cta-wave-grad)" strokeWidth="1.5" strokeDasharray="6 4" />
              <path d="M 300 600 C 580 470, 780 290, 1200 250" stroke="url(#cta-wave-grad)" strokeWidth="1.5" />
              <path d="M 0 460 C 320 340, 580 130, 1020 0" stroke="url(#cta-wave-grad)" strokeWidth="1.5" strokeDasharray="5 5" />
            </svg>

            {/* 3. Glowing Ambient Aurora Flares */}
            <div className="absolute -top-32 -right-32 h-[420px] w-[420px] rounded-full bg-emerald-400/25 blur-[90px] pointer-events-none" />
            <div className="absolute top-1/2 right-1/4 h-72 w-72 rounded-full bg-teal-300/15 blur-[80px] pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-black/45 blur-3xl pointer-events-none" />

            {/* 4. Top subtle glass reflection line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-300/40 to-transparent pointer-events-none" />

            {/* Grid Layout: Left Content + Right Floating Glass Card */}
            <div className="relative z-10 grid items-center gap-10 lg:grid-cols-12">
              {/* Left Column: Headlines & CTA */}
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md border border-white/20 px-3.5 py-1 text-xs font-bold text-emerald-100 mb-4 shadow-xs">
                  <Landmark size={14} className="text-emerald-200" />
                  <span>National Operational Framework</span>
                </div>
                <h2 className="text-3xl font-black text-white sm:text-4xl lg:text-5xl tracking-tight leading-tight">
                  Experience Transparent Procurement Today
                </h2>
                <p className="mt-4 text-base sm:text-lg text-emerald-100 leading-relaxed font-normal max-w-xl">
                  Follow the complete digital journey — from farmer web self-booking and electronic mandi grading to automated PFMS direct benefit transfer.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3.5">
                  <Link
                    href="/farmer"
                    className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm sm:text-base font-bold text-[#0d6e38] shadow-md hover:bg-emerald-50 transition-all"
                  >
                    Enter Farmer Portal <ArrowRight size={18} />
                  </Link>
                  <Link
                    href="/workflow"
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/30 bg-white/10 backdrop-blur-md px-6 py-3.5 text-sm sm:text-base font-bold text-white hover:bg-white/20 transition-all shadow-xs"
                  >
                    Explore Full Workflow
                  </Link>
                </div>

                {/* Trust Badges */}
                <div className="mt-8 flex flex-wrap items-center gap-4 text-xs font-medium text-emerald-200/90 pt-3 border-t border-white/10">
                  <span className="flex items-center gap-1.5">
                    <Check size={14} className="text-emerald-300 font-bold" /> 18 Mandis Active
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check size={14} className="text-emerald-300 font-bold" /> 100% PFMS DBT Settlement
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check size={14} className="text-emerald-300 font-bold" /> Zero Intermediary Leakage
                  </span>
                </div>
              </div>

              {/* Right Column: Floating Glassmorphic Digital Intake Pass */}
              <div className="lg:col-span-5 relative flex items-center justify-center lg:justify-end">
                <div className="relative w-full max-w-sm rounded-3xl border border-white/25 bg-white/[0.12] p-6 sm:p-7 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:border-white/40 hover:scale-[1.02]">
                  {/* Top Bar of Glass Card */}
                  <div className="flex items-center justify-between border-b border-white/15 pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/25 border border-white/20 text-emerald-200">
                        <QrCode size={18} />
                      </div>
                      <div>
                        <p className="text-xs font-black text-white tracking-wide">Digital Intake Pass</p>
                        <p className="text-[11px] text-emerald-200/80 font-mono">#NSK-2026-4402</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/20 border border-emerald-300/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
                      Live Verified
                    </span>
                  </div>

                  {/* Body Details */}
                  <div className="mt-4 space-y-2.5 text-xs">
                    <div className="flex justify-between items-center text-emerald-100">
                      <span className="text-emerald-200/70">Mandi Centre</span>
                      <span className="font-bold text-white">Lasalgaon Central</span>
                    </div>
                    <div className="flex justify-between items-center text-emerald-100">
                      <span className="text-emerald-200/70">Farmer</span>
                      <span className="font-bold text-white">Ramesh V. Patil</span>
                    </div>
                    <div className="flex justify-between items-center text-emerald-100">
                      <span className="text-emerald-200/70">Produce &amp; Grade</span>
                      <span className="font-bold text-white">Red Onion · Grade-1</span>
                    </div>
                    <div className="flex justify-between items-center text-emerald-100">
                      <span className="text-emerald-200/70">Verified Net Weight</span>
                      <span className="font-bold text-white font-mono">2,450 kg (24.5 Qtl)</span>
                    </div>
                  </div>

                  {/* Direct Payout Strip */}
                  <div className="mt-5 rounded-2xl bg-black/25 border border-white/10 p-3.5 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-wider text-emerald-300">PFMS DBT Disbursed</p>
                      <p className="text-base font-black text-white">₹71,700</p>
                    </div>
                    <span className="rounded-full bg-emerald-400/20 border border-emerald-300/40 px-2.5 py-1 text-[11px] font-bold text-emerald-200">
                      T+1 Settled ✓
                    </span>
                  </div>

                  {/* Floating Turnaround Pill */}
                  <div className="absolute -top-3.5 -right-3.5 rounded-full bg-gradient-to-r from-emerald-300 to-teal-200 px-3.5 py-1 text-[11px] font-black text-emerald-950 shadow-lg border border-white/40 flex items-center gap-1">
                    <Sparkles size={12} className="fill-emerald-950" /> 38 Min Turnaround
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Active District Procurement Centres */}
          <div className="mt-14">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Nashik District Operational Mandis
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  Real-time capacity, scheduled delivery slots, and daily intake volume across pilot centres.
                </p>
              </div>
              <Link
                href="/roles/collector"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#15803d] hover:text-[#0d6e38] transition-colors"
              >
                View all district centres <ArrowRight size={14} />
              </Link>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-3">
              {CENTRES.slice(0, 3).map((c) => (
                <div
                  key={c.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#d8ecd8] bg-white p-6 shadow-xs hover:border-[#16a34a]/60 hover:shadow-lg transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#166534] bg-[#eaf5ee] border border-[#c6e7d0] px-2.5 py-0.5 rounded-full">
                        {c.id}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        Live Intake
                      </span>
                    </div>

                    <h4 className="mt-3 text-base font-black text-slate-900">
                      {c.name}
                    </h4>
                    <p className="mt-1 text-xs text-slate-500">
                      Nashik Agricultural Marketing Division
                    </p>

                    <div className="mt-4 space-y-2 pt-3 border-t border-slate-100">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Slot Allocation</span>
                        <span className="font-bold text-slate-800">{c.slotsBooked} / {c.slotCapacity} slots</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#16a34a]"
                          style={{ width: `${Math.min(100, Math.round((c.slotsBooked / c.slotCapacity) * 100))}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="text-slate-500">Today&apos;s Intake</span>
                        <span className="font-bold text-slate-800">{c.bookedTonnesToday} / {c.capacityTonnes} MT</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
