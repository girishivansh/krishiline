"use client";
import Link from "next/link";
import { Sprout, ClipboardCheck, Wallet, Building2, Users, PackageCheck, ShieldCheck, ArrowRight, Database } from "lucide-react";
import { Card, Badge } from "@/components/ui";
import { MOCK_DB, SEED_BOOKINGS, DISTRICT_BATCHES, CENTRES } from "@/lib/data";

const ROLES = [
  { n: "1", icon: Sprout, title: "Farmer Web Portal", sub: "Web self-service booking, 7/12 verification & digital receipts", href: "/farmer", color: "bg-blue-600", feats: ["Land verification", "4-hour slot booking", "QR token", "Digital receipt", "DBT payment tracker"] },
  { n: "2", icon: ClipboardCheck, title: "Government Clerk", sub: "Weighing, grading, receipt generation & QR sticker printing", href: "/roles/clerk", color: "bg-emerald-700", feats: ["QR scan & verify", "Enter weight & grade", "Quality grading", "Digital receipt", "Print QR sticker"] },
  { n: "3", icon: PackageCheck, title: "Warehouse Supervisor", sub: "Batch verification, queue management & fraud prevention", href: "/roles/warehouse", color: "bg-orange-600", feats: ["Live batch queue", "QR scan & inspect", "Approve or flag", "Physical verification", "Real-time updates"] },
  { n: "4", icon: Wallet, title: "Center Accountant", sub: "Digital ledger, deductions & payment processing", href: "/roles/accountant", color: "bg-violet-700", feats: ["Verified entries", "Calculate payable amount", "Bank verification", "Digital signature", "PFMS submission (DBT)"] },
  { n: "5", icon: Building2, title: "Collector Admin Staff", sub: "District monitoring, anomaly detection & vigilance alerts", href: "/roles/collector", color: "bg-amber-600", feats: ["District overview", "Grade comparison", "Red flag alerts", "Investigations", "Reports & export"] },
  { n: "6", icon: Users, title: "FPO Cooperative", sub: "Bulk crop upload, group booking & member management", href: "/roles/fpo", color: "bg-rose-600", feats: ["Bulk farmer upload", "Member management", "Group slot booking", "Booking tracking", "Live status updates"] },
];

const FLOW = [
  { step: "Step 0", title: "Admin setup (Role Provisioning)", desc: "Admin provisions officials via master CSV; only verified Employee IDs clear the login gate.", href: "/roles/admin" },
  { step: "Step 1A", title: "Farmer books via Web Portal", desc: "Farmer logs into Web Portal → village + Gat + Farmer ID verification → yield-ceiling calculation → 4-hour slot selection → digital QR token.", href: "/farmer" },
  { step: "Step 1D", title: "FPO bulk booking & capacity logic", desc: "FPO uploads member roster; backend aggregates verified yields and locks custom 2–6 hr time block against the 1,000-tonne daily cap.", href: "/roles/fpo" },
  { step: "Step 2", title: "Clerk weighs & grades at dock", desc: "Scan token → verify → tractor unloads on dock → enter weight → pick grade → digital receipt synced to web portal → thermal QR sticker prints.", href: "/roles/clerk" },
  { step: "Step 3", title: "Hamals bag & tag batch", desc: "Loose onions packed into gunny bags, sticky QR label slapped on first bag, trolley pushed to godown.", href: "/roles/warehouse" },
  { step: "Step 4", title: "Supervisor gate verification & audits", desc: "FIFO queue; Green Pass for ~90%, mandatory Orange surprise scan for 15–20% random + 100% Grade-1. Flag freezes transaction row.", href: "/roles/warehouse" },
  { step: "Step 5", title: "Accountant ledger review → PFMS DBT", desc: "Auto-synced ledger, Hamali deductions, bank verification, digital signature, PFMS batch — direct DBT payout to farmer.", href: "/roles/accountant" },
];

export default function WorkflowPage() {
  const tokens = [...SEED_BOOKINGS, ...DISTRICT_BATCHES];
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Badge>NAFED / NCCF · Nashik Model</Badge>
      <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl text-slate-900 tracking-tight">
        Role-Wise <span className="text-[#15803d]">Workflow &amp; Features</span>
      </h1>
      <p className="mt-1 max-w-3xl text-sm sm:text-base text-gray-600">
        A complete system overview. One unified codebase that changes its layout by login role — the farmer sees web-based slot booking, the clerk sees grading, the supervisor sees the gate queue, the accountant sees the ledger, the collector sees the district, and the FPO sees group bookings.
      </p>

      {/* 6 Role Cards (Matching PDF Page 1) */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ROLES.map((r) => (
          <Link key={r.n} href={r.href}>
            <Card className="group h-full p-5 transition hover:-translate-y-0.5 hover:shadow-md border border-[#d8ecd8]">
              <div className="flex items-center gap-3">
                <span className={`flex h-10 w-10 items-center justify-center rounded-full font-bold text-white ${r.color}`}>
                  {r.n}
                </span>
                <span className={`rounded-xl p-2 ${r.color} bg-opacity-10`}>
                  <r.icon size={20} className="text-emerald-800" />
                </span>
              </div>
              <h3 className="mt-3 font-bold text-slate-900">{r.title}</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-snug">{r.sub}</p>
              <ul className="mt-3 space-y-1.5 text-xs text-gray-700">
                {r.feats.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <ShieldCheck size={14} className="shrink-0 text-[#16a34a]" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#15803d]">
                View role portal <ArrowRight size={14} />
              </span>
            </Card>
          </Link>
        ))}
      </div>

      <h2 className="mt-12 text-2xl font-bold text-slate-900">End-to-End Operational Lifecycle</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {FLOW.map((f) => (
          <Link key={f.step} href={f.href}>
            <Card className="flex gap-4 p-5 hover:shadow-md border border-[#d8ecd8] transition-all">
              <span className="shrink-0 rounded-lg bg-[#0d6e38] px-3 py-1.5 text-xs font-bold text-white h-fit">
                {f.step}
              </span>
              <span>
                <b className="text-slate-900 text-sm">{f.title}</b>
                <p className="mt-1 text-xs text-gray-600 leading-relaxed">{f.desc}</p>
              </span>
            </Card>
          </Link>
        ))}
      </div>

      <h2 id="mock-db" className="mt-12 flex items-center gap-2 text-2xl font-bold text-slate-900">
        <Database className="text-[#15803d]" /> Single Mock Database Architecture — 4 Tables
      </h2>
      <p className="mt-1 text-sm text-gray-600">
        The prototype runs on ONE centralized mock database engine. Demo Farmer ID is the primary key; Village + Gat are composite foreign keys. Real-time relational logic enforces yield ceilings and capacity countdowns.
      </p>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card className="overflow-x-auto p-5 border border-[#d8ecd8]">
          <h3 className="font-bold text-slate-900">Table 1 — Farmer Registry</h3>
          <table className="mt-2 w-full text-xs">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="py-2">Farmer ID</th>
                <th>Name</th>
                <th>Village</th>
                <th>Phone ends</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_DB.farmers.map((f) => (
                <tr key={f.farmerId} className="border-t border-gray-100">
                  <td className="py-2 font-mono text-[11px] text-emerald-800 font-bold">{f.farmerId}</td>
                  <td className="font-medium">{f.name}</td>
                  <td>{f.village}</td>
                  <td>…{f.phoneEnding}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card className="overflow-x-auto p-5 border border-[#d8ecd8]">
          <h3 className="font-bold text-slate-900">Table 2 — 7/12 Land Records (MahaBhulekh Simulation)</h3>
          <table className="mt-2 w-full text-xs">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="py-2">Farmer ID</th>
                <th>Village</th>
                <th>Gat No.</th>
                <th>Acres</th>
                <th>Recorded Holder</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_DB.land.map((l) => (
                <tr key={l.farmerId} className="border-t border-gray-100">
                  <td className="py-2 font-mono text-[11px] text-emerald-800 font-bold">{l.farmerId}</td>
                  <td>{l.village}</td>
                  <td className="font-bold">{l.gat}</td>
                  <td>{l.acres}</td>
                  <td>{l.holder}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card className="overflow-x-auto p-5 border border-[#d8ecd8]">
          <h3 className="font-bold text-slate-900">Table 3 — Crop Records (e-Peek Pahani Simulation)</h3>
          <table className="mt-2 w-full text-xs">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="py-2">Farmer ID</th>
                <th>Gat No.</th>
                <th>Season</th>
                <th>Crop</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_DB.crops.map((c) => (
                <tr key={c.farmerId} className="border-t border-gray-100">
                  <td className="py-2 font-mono text-[11px] text-emerald-800 font-bold">{c.farmerId}</td>
                  <td className="font-bold">{c.gat}</td>
                  <td>{c.season}</td>
                  <td>{c.crop}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card className="overflow-x-auto p-5 border border-[#d8ecd8]">
          <h3 className="font-bold text-slate-900">Table 4 — Token &amp; Capacity Ledger</h3>
          <p className="mt-0.5 text-xs text-gray-500">{tokens.length} tokens logged · daily center cap 1,000 tonnes</p>
          <table className="mt-2 w-full text-xs">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="py-2">Token</th>
                <th>Batch</th>
                <th>Date</th>
                <th>Qty</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {tokens.slice(0, 8).map((t) => (
                <tr key={t.id} className="border-t border-gray-100">
                  <td className="py-2 font-mono text-[11px] text-[#15803d] font-bold">{t.token}</td>
                  <td>{t.batchNo}</td>
                  <td>{t.displayDate}</td>
                  <td>{t.quantityKg.toLocaleString("en-IN")} kg</td>
                  <td>
                    <span className="rounded bg-emerald-50 text-[#166534] px-1.5 py-0.5 text-[10px] font-bold">
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2.5 text-xs text-gray-500">
            Descending capacity countdown (today): {CENTRES.slice(0, 3).map((c) => `${c.id}: ${(c.capacityTonnes - c.bookedTonnesToday).toLocaleString("en-IN")} t left`).join(" · ")}
          </p>
        </Card>
      </div>

      <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-t pt-6 text-xs sm:text-sm text-gray-700">
        <span className="flex items-center gap-2"><ShieldCheck className="text-[#16a34a]" /> Transparent Procurement</span>
        <span>Role-Based Access Control</span>
        <span>Real-Time Data Sync</span>
        <span>Fraud Detection &amp; Prevention</span>
        <span>Faster Payments (DBT via PFMS)</span>
        <span>Farmer Friendly &amp; Easy to Use</span>
        <span className="ml-auto font-bold text-emerald-950">Better Farmers. Fair Markets. Brighter India.</span>
      </div>
    </div>
  );
}
