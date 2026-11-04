"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Play,
  RotateCcw,
  ShieldAlert,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Award,
  Zap,
  Cpu,
  X,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { useAuth } from "@/lib/auth/AuthContext";
import { type Booking } from "@/lib/data";

export function JudgeShowcaseHub() {
  const router = useRouter();
  const { bookings, addBooking, updateBooking, resetDemo } = useStore();
  const { login } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"scenarios" | "roles" | "simulation">("scenarios");
  const [simStep, setSimStep] = useState<number>(0);
  const [simRunning, setSimRunning] = useState(false);
  const [simLog, setSimLog] = useState<string[]>([]);

  // Quick Role Switching
  const handleSwitchRole = async (empId: string, targetRoute: string) => {
    try {
      await login(empId, "Password@123", true);
      router.push(targetRoute);
      setIsOpen(false);
    } catch {
      router.push(targetRoute);
      setIsOpen(false);
    }
  };

  // Scenario 2: Clerk Bribery Attempt Caught by Supervisor Orange Scan
  const triggerBriberyBust = () => {
    const target = bookings.find((b) => b.batchNo === "B00126") ?? bookings[0];
    if (target) {
      updateBooking(target.id, {
        warehouseStatus: "Flagged",
        paymentStatus: "On Hold",
      });
      router.push("/roles/warehouse");
    }
  };

  // Scenario 3: Rented Tractor Breakdown & Standby Queue Auto-Rollover
  const triggerTractorBreakdown = () => {
    router.push("/farmer");
  };

  // Scenario 4: Statistical Variance Alarm & Flying Squad Raid
  const triggerVarianceAlarm = () => {
    router.push("/roles/collector");
  };

  // Full End-to-End Automated Procurement Simulation
  const runEndToEndSimulation = async () => {
    setSimRunning(true);
    setSimStep(1);
    setSimLog(["[Step 1/6] Initiating Farmer Slot Booking for Ramesh Patil..."]);

    const tokenNum = Math.floor(10000 + Math.random() * 90000);
    const token = `KLN${tokenNum}`;
    const batchNo = `B00${tokenNum.toString().slice(-3)}`;
    const newBooking: Booking = {
      id: `sim-${Date.now()}`,
      batchNo,
      token,
      receiptId: null,
      farmer: "Ramesh Patil",
      village: "Kahan",
      date: "2026-11-09",
      displayDate: "09 Nov 2026",
      centre: "Nashik Procurement Center - 1",
      centreShort: "Nashik - 1",
      crop: "Onion",
      quantityKg: 1250,
      grade: "1",
      pricePerQuintal: 1850,
      status: "Confirmed",
      paymentStatus: "Estimated",
      utr: null,
      slot: "08:00 AM - 12:00 PM",
      trolley: "MH-15-TR-9901",
      bags: 55,
      warehouseStatus: "Pending",
    };

    addBooking(newBooking);

    await new Promise((r) => setTimeout(r, 1200));
    setSimStep(2);
    setSimLog((p) => [
      ...p,
      `[Step 2/6] Farmer arrives at unloading dock during 4-hr slot. Loose onions dumped on floor.`,
    ]);

    await new Promise((r) => setTimeout(r, 1200));
    setSimStep(3);
    updateBooking(newBooking.id, {
      status: "Completed",
      receiptId: `R-2026-${batchNo}`,
      paymentStatus: "Processing",
    });
    setSimLog((p) => [
      ...p,
      `[Step 3/6] Clerk weighs 1,250 kg scale reading. Evaluated as Grade-1 Premium (₹1,850/qtl). Thermal QR sticker printed.`,
    ]);

    await new Promise((r) => setTimeout(r, 1200));
    setSimStep(4);
    updateBooking(newBooking.id, {
      warehouseStatus: "Approved",
    });
    setSimLog((p) => [
      ...p,
      `[Step 4/6] Hamals bag onions. Warehouse Supervisor inspects trolley at barricade -> Green Pass Granted!`,
    ]);

    await new Promise((r) => setTimeout(r, 1200));
    setSimStep(5);
    setSimLog((p) => [
      ...p,
      `[Step 5/6] Center Accountant verifies ledger deductions (Hamali: ₹1,250, Net: ₹21,675) & signs batch with crypto key.`,
    ]);

    await new Promise((r) => setTimeout(r, 1200));
    setSimStep(6);
    const utr = `PFMS-DBT-UTR-${Math.floor(100000 + Math.random() * 900000)}`;
    updateBooking(newBooking.id, {
      paymentStatus: "Paid",
      utr,
    });
    setSimLog((p) => [
      ...p,
      `[Step 6/6] ✅ PFMS DBT direct bank transfer executed! Credited ₹21,675 directly to Farmer account (UTR: ${utr}).`,
    ]);

    setSimRunning(false);
  };

  return (
    <>
      {/* Floating Trigger Dock for Judges (Pinned at Bottom Center) */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
        <div className="flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-slate-900/90 px-3.5 py-2 shadow-2xl backdrop-blur-md text-white">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-black tracking-wide bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              SEVA FIRST 2026
            </span>
          </div>

          <div className="h-4 w-px bg-white/20 mx-1" />

          <button
            type="button"
            onClick={() => setIsOpen((p) => !p)}
            className="flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white hover:bg-emerald-500 transition-colors shadow-xs"
          >
            <Sparkles size={13} className="text-emerald-200" />
            <span>Judge Showcase Hub</span>
            {isOpen ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
          </button>

          <Link
            href="/demo"
            className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300 hover:text-white px-2 py-0.5 transition-colors"
          >
            <Cpu size={12} />
            <span>Interactive Demo</span>
          </Link>
        </div>
      </div>

      {/* Slide-Up Executive Evaluation Drawer */}
      {isOpen && (
        <div
          className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-3xl border-t border-emerald-300/40 bg-slate-900/95 p-6 text-white shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom duration-300 sm:px-10"
          role="dialog"
          aria-modal="true"
          aria-label="SEVA FIRST Judge Showcase Hub"
        >
          <div className="mx-auto max-w-5xl">
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white shadow-md">
                  <Award size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black tracking-tight">
                      SEVA FIRST Innovation Showcase Hub
                    </h2>
                    <span className="rounded-full bg-emerald-400/20 border border-emerald-400/30 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                      Live Simulation Controller
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Interactive evaluation suite for hackathon judges — test operational safeguards, role transitions, and anti-corruption firewalls.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => resetDemo()}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-white/20 hover:text-white transition-colors"
                  title="Reset Demo Data to Initial Canonical State"
                >
                  <RotateCcw size={13} />
                  <span>Reset Demo State</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="mt-4 flex gap-2 border-b border-white/10 pb-3 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab("scenarios")}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2 transition-all ${
                  activeTab === "scenarios"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <ShieldAlert size={14} />
                <span>Operational Edge Scenarios (4 Safeguards)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("simulation")}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2 transition-all ${
                  activeTab === "simulation"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Play size={14} />
                <span>1-Click End-to-End Simulation</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("roles")}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2 transition-all ${
                  activeTab === "roles"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Zap size={14} />
                <span>1-Click Role Persona Switcher</span>
              </button>
            </div>

            {/* Tab 1: Operational Edge Scenarios */}
            {activeTab === "scenarios" && (
              <div className="mt-6 space-y-4">
                <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
                  {/* Scenario 1 */}
                  <div className="flex flex-col justify-between rounded-2xl border border-red-500/30 bg-red-950/20 p-4 hover:border-red-400 transition-all">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-900/40 border border-red-500/30 px-2 py-0.5 rounded-md">
                        Safeguard #1
                      </span>
                      <h3 className="mt-2 text-sm font-bold text-white">
                        Out-of-State MP Onion Dumping Scheme
                      </h3>
                      <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                        A corrupt trader tries to book 50 tonnes of cheap MP onions under a genuine 2-acre farmer profile.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-white/10">
                      <p className="text-[11px] font-semibold text-red-300">
                        Firewall: 7/12 Yield Ceiling locks profile globally at 120 quintals (12 MT).
                      </p>
                      <Link
                        href="/farmer/book"
                        onClick={() => setIsOpen(false)}
                        className="mt-3 flex items-center justify-between rounded-xl bg-red-600/80 px-3 py-2 text-xs font-bold text-white hover:bg-red-600 transition-colors"
                      >
                        <span>Test Yield Block in Portal</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>

                  {/* Scenario 2 */}
                  <div className="flex flex-col justify-between rounded-2xl border border-orange-500/30 bg-orange-950/20 p-4 hover:border-orange-400 transition-all">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 bg-orange-900/40 border border-orange-500/30 px-2 py-0.5 rounded-md">
                        Safeguard #2
                      </span>
                      <h3 className="mt-2 text-sm font-bold text-white">
                        Clerk-Farmer Bribery Quality Fraud
                      </h3>
                      <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                        Clerk takes a bribe to falsely log rotten onions as Grade-1 Premium.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-white/10">
                      <p className="text-[11px] font-semibold text-orange-300">
                        Firewall: Supervisor Orange Surprise Scan triggers &rarr; Data Mismatch freezes funds.
                      </p>
                      <button
                        type="button"
                        onClick={triggerBriberyBust}
                        className="mt-3 w-full flex items-center justify-between rounded-xl bg-orange-600/80 px-3 py-2 text-xs font-bold text-white hover:bg-orange-600 transition-colors"
                      >
                        <span>Execute Supervisor Catch</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Scenario 3 */}
                  <div className="flex flex-col justify-between rounded-2xl border border-blue-500/30 bg-blue-950/20 p-4 hover:border-blue-400 transition-all">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-900/40 border border-blue-500/30 px-2 py-0.5 rounded-md">
                        Safeguard #3
                      </span>
                      <h3 className="mt-2 text-sm font-bold text-white">
                        Rented Tractor Breakdown / Late Arrival
                      </h3>
                      <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                        Farmer’s rented tractor suffers a puncture and arrives 3 hours past their 4-hour slot.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-white/10">
                      <p className="text-[11px] font-semibold text-blue-300">
                        Firewall: 10% hourly cushion standby queue + 8 AM next-day VIP Priority pass.
                      </p>
                      <button
                        type="button"
                        onClick={triggerTractorBreakdown}
                        className="mt-3 w-full flex items-center justify-between rounded-xl bg-blue-600/80 px-3 py-2 text-xs font-bold text-white hover:bg-blue-600 transition-colors"
                      >
                        <span>Simulate Standby Buffer</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Scenario 4 */}
                  <div className="flex flex-col justify-between rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4 hover:border-amber-400 transition-all">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-900/40 border border-amber-500/30 px-2 py-0.5 rounded-md">
                        Safeguard #4
                      </span>
                      <h3 className="mt-2 text-sm font-bold text-white">
                        Three-Way Cartel Statistical Variance
                      </h3>
                      <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                        Clerk, supervisor, and farmer collude. Center B logs 72% Grade-1 vs 28% district baseline.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-white/10">
                      <p className="text-[11px] font-semibold text-amber-300">
                        Firewall: Collector Level-3 Red Flag &rarr; Flying Squad dispatched + Treasury Freeze.
                      </p>
                      <button
                        type="button"
                        onClick={triggerVarianceAlarm}
                        className="mt-3 w-full flex items-center justify-between rounded-xl bg-amber-600/80 px-3 py-2 text-xs font-bold text-white hover:bg-amber-600 transition-colors"
                      >
                        <span>View Collector Radar</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: 1-Click End-to-End Simulation */}
            {activeTab === "simulation" && (
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-white">
                      Automated 6-Step Procurement Simulation
                    </h3>
                    <p className="text-xs text-slate-400">
                      Runs the complete multi-stakeholder transaction flow in real time across the database and state engine.
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={simRunning}
                    onClick={runEndToEndSimulation}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 px-5 py-2.5 text-xs font-bold text-white hover:from-emerald-500 hover:to-teal-400 disabled:opacity-50 transition-all shadow-md"
                  >
                    <Play size={14} className={simRunning ? "animate-spin" : ""} />
                    <span>{simRunning ? "Running Simulation..." : "Launch 1-Click Simulation"}</span>
                  </button>
                </div>

                {/* Stepper Timeline */}
                <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-6 text-center text-xs">
                  {[
                    "1. Slot Booking",
                    "2. Yard Arrival",
                    "3. Clerk Weigh & Grade",
                    "4. Gate Pass",
                    "5. Ledger Review",
                    "6. PFMS DBT Credit",
                  ].map((stepLabel, idx) => {
                    const stepNum = idx + 1;
                    const isDone = simStep >= stepNum;
                    const isCurrent = simStep === stepNum;
                    return (
                      <div
                        key={stepLabel}
                        className={`rounded-xl border p-2.5 transition-all ${
                          isCurrent
                            ? "border-emerald-400 bg-emerald-500/20 text-emerald-200 font-bold"
                            : isDone
                            ? "border-emerald-500/40 bg-emerald-900/30 text-emerald-300"
                            : "border-white/10 bg-white/5 text-slate-500"
                        }`}
                      >
                        <div
                          className={`mx-auto mb-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                            isDone ? "bg-emerald-500 text-slate-900" : "bg-white/10 text-slate-400"
                          }`}
                        >
                          {isDone ? "✓" : stepNum}
                        </div>
                        <span className="truncate block">{stepLabel}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Console Log Stream */}
                {simLog.length > 0 && (
                  <div className="mt-4 rounded-xl bg-black/60 p-3.5 font-mono text-[11px] text-emerald-300 space-y-1 max-h-40 overflow-y-auto border border-emerald-500/20">
                    {simLog.map((log, i) => (
                      <div key={i} className="leading-snug">
                        {log}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: 1-Click Role Persona Switcher */}
            {activeTab === "roles" && (
              <div className="mt-6">
                <p className="text-xs text-slate-400 mb-3">
                  Instantly authenticate and teleport between operational portals as authorized officials:
                </p>
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
                  {[
                    {
                      name: "Ramesh Patil",
                      role: "Farmer / Producer",
                      id: "9876541234",
                      href: "/farmer",
                      color: "border-emerald-500/40 hover:bg-emerald-950/40",
                    },
                    {
                      name: "Sanjay Deshmukh",
                      role: "Mandi Clerk",
                      id: "EMP-1001",
                      href: "/roles/clerk",
                      color: "border-blue-500/40 hover:bg-blue-950/40",
                    },
                    {
                      name: "Anil Pawar",
                      role: "Warehouse Supervisor",
                      id: "EMP-1002",
                      href: "/roles/warehouse",
                      color: "border-orange-500/40 hover:bg-orange-950/40",
                    },
                    {
                      name: "Meera Joshi",
                      role: "Center Accountant",
                      id: "EMP-1003",
                      href: "/roles/accountant",
                      color: "border-violet-500/40 hover:bg-violet-950/40",
                    },
                    {
                      name: "Rahul Verma",
                      role: "Collector Admin",
                      id: "EMP-1004",
                      href: "/roles/collector",
                      color: "border-amber-500/40 hover:bg-amber-950/40",
                    },
                    {
                      name: "Kisan Cooperative",
                      role: "FPO Manager",
                      id: "EMP-FPO-01",
                      href: "/roles/fpo",
                      color: "border-rose-500/40 hover:bg-rose-950/40",
                    },
                  ].map((persona) => (
                    <button
                      key={persona.id}
                      type="button"
                      onClick={() => handleSwitchRole(persona.id, persona.href)}
                      className={`flex flex-col items-start rounded-2xl border p-3 text-left transition-all bg-white/5 ${persona.color}`}
                    >
                      <span className="text-xs font-bold text-white truncate w-full">{persona.name}</span>
                      <span className="text-[11px] text-emerald-400 font-semibold truncate w-full mt-0.5">
                        {persona.role}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400 mt-2 bg-black/40 px-1.5 py-0.5 rounded">
                        {persona.id}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
