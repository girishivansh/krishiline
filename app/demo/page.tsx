"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Award,
  Play,
  RotateCcw,
  ArrowRight,
} from "lucide-react";
import { Card, Badge } from "@/components/ui";
import { useStore } from "@/lib/store";
import { type Booking } from "@/lib/data";

export default function DemoShowcasePage() {
  const { addBooking, updateBooking, resetDemo } = useStore();

  const [simStep, setSimStep] = useState<number>(0);
  const [simRunning, setSimRunning] = useState(false);
  const [simLog, setSimLog] = useState<string[]>([]);

  const runSimulation = async () => {
    setSimRunning(true);
    setSimStep(1);
    setSimLog(["[Step 1/6] Farmer Ramesh Patil logs into Web Portal → Selects 4-Hour Window (8:00 AM - 12:00 PM)."]);

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
      trolley: "MH-15-TR-8812",
      bags: 54,
      warehouseStatus: "Pending",
    };

    addBooking(newBooking);

    await new Promise((r) => setTimeout(r, 1100));
    setSimStep(2);
    setSimLog((p) => [
      ...p,
      `[Step 2/6] Farmer arrives at yard within window. Dumps onions on dock in 45 mins. No tractor idling.`,
    ]);

    await new Promise((r) => setTimeout(r, 1100));
    setSimStep(3);
    updateBooking(newBooking.id, {
      status: "Completed",
      receiptId: `R-2026-${batchNo}`,
      paymentStatus: "Processing",
    });
    setSimLog((p) => [
      ...p,
      `[Step 3/6] Clerk logs 1,250 kg scale reading. Krishi-Vision AI rates as Grade-1 (₹1,850/qtl). Thermal label printed.`,
    ]);

    await new Promise((r) => setTimeout(r, 1100));
    setSimStep(4);
    updateBooking(newBooking.id, {
      warehouseStatus: "Approved",
    });
    setSimLog((p) => [
      ...p,
      `[Step 4/6] Hamals roll trolley to godown. Supervisor matches batch #B00${batchNo.slice(-3)} -> Green Pass Approved!`,
    ]);

    await new Promise((r) => setTimeout(r, 1100));
    setSimStep(5);
    setSimLog((p) => [
      ...p,
      `[Step 5/6] Center Accountant verifies pre-calculated deductions (Gross: ₹23,125 - Hamali: ₹1,250 - Cess: ₹200 = Net: ₹21,675) & signs batch.`,
    ]);

    await new Promise((r) => setTimeout(r, 1100));
    setSimStep(6);
    const utr = `PFMS-DBT-UTR-${Math.floor(100000 + Math.random() * 900000)}`;
    updateBooking(newBooking.id, {
      paymentStatus: "Paid",
      utr,
    });
    setSimLog((p) => [
      ...p,
      `[Step 6/6] ✅ PFMS DBT direct bank transfer executed! ₹21,675 credited directly to Ramesh Patil's SBI savings account (UTR: ${utr}).`,
    ]);

    setSimRunning(false);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 space-y-10">
      {/* Hackathon Header Banner */}
      <div className="rounded-3xl border border-emerald-300/60 bg-gradient-to-br from-emerald-900 via-slate-900 to-emerald-950 p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-400/20 border border-emerald-300/40 px-3.5 py-1 text-xs font-bold text-emerald-200 mb-4">
            <Award size={14} className="text-emerald-300" />
            <span>SEVA FIRST – Rashtriya Youth Innovation Challenge 2026</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Krishi-Line: Next-Generation <span className="text-emerald-400">Anti-Corruption</span> Mandi Procurement Engine
          </h1>
          <p className="mt-4 max-w-3xl text-sm sm:text-base text-emerald-100 leading-relaxed font-normal">
            A unified digital public infrastructure (DPI) platform engineered to demolish artificial tractor queues, prevent illegal out-of-state onion dumping, eliminate loose paper tampering, and compress farmer DBT payouts from 4 weeks to 2 days.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={simRunning}
              onClick={runSimulation}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-md hover:bg-emerald-400 disabled:opacity-50 transition-all"
            >
              <Play size={16} />
              <span>{simRunning ? "Simulating Procurement..." : "Launch Live End-to-End Simulation"}</span>
            </button>
            <button
              type="button"
              onClick={() => resetDemo()}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3.5 text-sm font-bold text-white hover:bg-white/20 transition-all"
            >
              <RotateCcw size={15} />
              <span>Reset Demo State</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Simulation Stepper & Console */}
      <Card className="p-6 sm:p-8 border-emerald-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              Live State Engine
            </span>
            <h2 className="mt-1 text-xl font-bold text-slate-900">
              Interactive 6-Step Procurement Simulation
            </h2>
            <p className="text-xs text-slate-500">
              Witness real-time state synchronization across all 6 stakeholder dashboards as a batch progresses from booking to treasury credit.
            </p>
          </div>
          <Badge tone={simRunning ? "amber" : simStep === 6 ? "green" : "gray"}>
            {simRunning ? "Simulation In-Flight" : simStep === 6 ? "Cycle Completed" : "Ready"}
          </Badge>
        </div>

        {/* 6 Step Cards */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-6">
          {[
            { num: 1, title: "1. Farmer Slot", desc: "4-Hour guaranteed window" },
            { num: 2, title: "2. Yard Dock", desc: "45-min dump & go" },
            { num: 3, title: "3. Clerk Weigh", desc: "Digital FAQ grade" },
            { num: 4, title: "4. Gate Audit", desc: "FIFO Green Pass" },
            { num: 5, title: "5. Ledger Sign", desc: "Pre-calculated Hamali" },
            { num: 6, title: "6. PFMS DBT", desc: "Direct bank credit" },
          ].map((s) => {
            const isDone = simStep >= s.num;
            const isCurrent = simStep === s.num;
            return (
              <div
                key={s.num}
                className={`rounded-2xl border p-3.5 text-center transition-all ${
                  isCurrent
                    ? "border-emerald-600 bg-emerald-50 ring-2 ring-emerald-600/20"
                    : isDone
                    ? "border-emerald-300 bg-emerald-50/60"
                    : "border-slate-200 bg-slate-50/60 text-slate-400"
                }`}
              >
                <div
                  className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                    isDone ? "bg-emerald-700 text-white" : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {isDone ? "✓" : s.num}
                </div>
                <p className="mt-2 text-xs font-bold text-slate-900 truncate">{s.title}</p>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">{s.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Execution Log */}
        {simLog.length > 0 && (
          <div className="mt-5 rounded-2xl bg-slate-950 p-4 font-mono text-xs text-emerald-400 space-y-1.5 border border-slate-800">
            {simLog.map((log, i) => (
              <div key={i} className="leading-relaxed">
                {log}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* The 4 Operational Anti-Corruption Firewalls */}
      <div>
        <div className="mb-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            Core Hackathon Innovation
          </span>
          <h2 className="mt-2 text-2xl font-black text-slate-900">
            The 4 Anti-Corruption Firewalls
          </h2>
          <p className="text-sm text-slate-600">
            How Krishi-Line systematically dismantles every loophole identified in traditional procurement yards.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {/* Firewall 1 */}
          <Card className="p-6 border-slate-200 hover:border-emerald-400 transition-all">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 font-bold">
                01
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  Global 7/12 Yield Ceiling Lock
                </h3>
                <p className="text-xs font-semibold text-emerald-700">
                  Crushing Out-of-State Madhya Pradesh Onion Dumping
                </p>
                <p className="text-xs text-slate-600 leading-relaxed pt-1">
                  <b>The Scam:</b> Corrupt traders purchase cheap, low-grade onions from Madhya Pradesh and sneak them into Maharashtra government mandis under genuine farmers&apos; names.
                  <br />
                  <b>Krishi-Line Firewall:</b> System binds cadastral parcel records to an algorithmic production ceiling (60 quintals / 6 tonnes per acre). A 2-acre farmer is permanently capped at 120 quintals for the season. Any attempt to file 50 tonnes is automatically blocked globally in the database.
                </p>
                <div className="pt-2">
                  <Link
                    href="/farmer/land"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                  >
                    <span>Inspect 7/12 Land Registry Simulation</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          </Card>

          {/* Firewall 2 */}
          <Card className="p-6 border-slate-200 hover:border-emerald-400 transition-all">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-800 font-bold">
                02
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  Guaranteed 4-Hour Windows &amp; 10% Hourly Cushion
                </h3>
                <p className="text-xs font-semibold text-blue-700">
                  Eliminating Artificial Tractor Queue Extortion
                </p>
                <p className="text-xs text-slate-600 leading-relaxed pt-1">
                  <b>The Scam:</b> Corrupt clerks deliberately stall gate entries to create 4-day queues. Farmers lose ₹10,000 in rented tractor fees and onions lose moisture weight in the sun.
                  <br />
                  <b>Krishi-Line Firewall:</b> Guaranteed 4-hour slot windows with 45-minute dump-and-leave docks. Centres book only up to 90% capacity, leaving a 10% hourly cushion. Late arrivals get a 2-hour grace period or next-day 8:00 AM VIP Priority Pass.
                </p>
                <div className="pt-2">
                  <Link
                    href="/farmer/book"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-800"
                  >
                    <span>Test Capacity Countdown Engine</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          </Card>

          {/* Firewall 3 */}
          <Card className="p-6 border-slate-200 hover:border-emerald-400 transition-all">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-800 font-bold">
                03
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  Orange Surprise Scan &amp; Destructible QR Labels
                </h3>
                <p className="text-xs font-semibold text-orange-700">
                  Busting Clerk-Farmer Bribe Alliances
                </p>
                <p className="text-xs text-slate-600 leading-relaxed pt-1">
                  <b>The Scam:</b> A corrupt clerk takes a bribe and marks rotten onions as Grade-1 Premium.
                  <br />
                  <b>Krishi-Line Firewall:</b> Barricaded single-file entry forces trolleys to approach supervisor desk in FIFO sequence. 100% of Grade-1 batches trigger an Orange Surprise Scan flashing expected quality. Flagging freezes the row instantly—preventing treasury funds from being disbursed.
                </p>
                <div className="pt-2">
                  <Link
                    href="/roles/warehouse"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-700 hover:text-orange-800"
                  >
                    <span>View Warehouse Supervisor FIFO Queue</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          </Card>

          {/* Firewall 4 */}
          <Card className="p-6 border-slate-200 hover:border-emerald-400 transition-all">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-800 font-bold">
                04
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  Statistical Variance Alarms &amp; Flying Squads
                </h3>
                <p className="text-xs font-semibold text-amber-700">
                  Defeating the Three-Way Internal Cartel
                </p>
                <p className="text-xs text-slate-600 leading-relaxed pt-1">
                  <b>The Scam:</b> Clerk, supervisor, and farmer team up to split government money three ways.
                  <br />
                  <b>Krishi-Line Firewall:</b> Central database compares grade distributions across neighboring centers. If Center B reports 72% Grade-1 while nearby centers average 28–35%, a Level-3 Red Flag is triggered, dispatches an external Flying Squad raid, and freezes treasury payouts.
                </p>
                <div className="pt-2">
                  <Link
                    href="/roles/collector"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800"
                  >
                    <span>Explore District Collector Vigilance Radar</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Role Navigation Grid */}
      <Card className="p-6 sm:p-8">
        <h2 className="text-lg font-black text-slate-900">
          Explore All 6 Role-Based Operational Portals
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          Every persona interface is tailored specifically for their ground operational responsibilities.
        </p>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              role: "Farmer Web Portal",
              step: "Role 1",
              href: "/farmer",
              desc: "Web self-service booking, 7/12 land ceiling verification, digital QR pass, and live PFMS DBT tracker.",
              color: "text-emerald-700 bg-emerald-50 border-emerald-200",
            },
            {
              role: "Mandi Clerk",
              step: "Role 2",
              href: "/roles/clerk",
              desc: "6-step dock workflow: QR scan, scale weight, visual FAQ grading, digital quality receipt, and thermal sticker print.",
              color: "text-blue-700 bg-blue-50 border-blue-200",
            },
            {
              role: "Warehouse Supervisor",
              step: "Role 3",
              href: "/roles/warehouse",
              desc: "FIFO trolley queue, 1-second Green Pass approval, mandatory Orange Surprise Scan, and mismatch freezing.",
              color: "text-orange-700 bg-orange-50 border-orange-200",
            },
            {
              role: "Center Accountant",
              step: "Role 4",
              href: "/roles/accountant",
              desc: "Automated digital ledger, automatic Hamali deductions, cryptographic digital signature, and PFMS DBT batch release.",
              color: "text-violet-700 bg-violet-50 border-violet-200",
            },
            {
              role: "Collector Admin Staff",
              step: "Role 5",
              href: "/roles/collector",
              desc: "District vigilance overview, cross-center grade distribution comparison, Level-3 red flag alarms, and flying squad raids.",
              color: "text-amber-700 bg-amber-50 border-amber-200",
            },
            {
              role: "FPO Cooperative Manager",
              step: "Role 6",
              href: "/roles/fpo",
              desc: "Member roster CSV upload, automated 7/12 land cross-verification, and dynamic 2-to-6-hour dedicated time-block allocation.",
              color: "text-rose-700 bg-rose-50 border-rose-200",
            },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col justify-between rounded-2xl border p-4 hover:shadow-md transition-all group"
            >
              <div>
                <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border mb-2 ${item.color}`}>
                  {item.step}
                </span>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {item.role}
                </h3>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-emerald-700">
                <span>Enter Portal</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
