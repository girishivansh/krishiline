"use client";
import { useState } from "react";
import Link from "next/link";
import {
  CalendarPlus,
  QrCode,
  LandPlot,
  ReceiptText,
  IndianRupee,
  ShieldCheck,
  Clock3,
  CheckCircle2,
  AlertCircle,
  Truck,
  ArrowRight,
  Eye,
  Download,
  X,
} from "lucide-react";
import { Card, Badge, PrimaryButton, GhostButton } from "@/components/ui";
import { useStore } from "@/lib/store";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  FARMER,
  totalKg,
  inr,
  grossFor,
  hamaliFor,
  netFor,
  totalNet,
  GRADE_LABEL,
  type Booking,
} from "@/lib/data";
import { downloadReceipt } from "@/lib/receipt";

export default function FarmerPortalDashboard() {
  const { bookings } = useStore();
  const { user } = useAuth();
  const [selectedReceipt, setSelectedReceipt] = useState<Booking | null>(null);

  // User details: Use authenticated user if role is farmer, else default demo profile (Ramesh Patil)
  const farmerName = user && user.role === "farmer" ? user.name : FARMER.name;
  const farmerId = user && user.role === "farmer" ? user.identifier : FARMER.farmerId;
  const village = FARMER.village;
  const gatNo = FARMER.gat;
  const landAcres = FARMER.landAcres;
  const eligibleQuintals = FARMER.eligibleQuintals;
  const yieldCeilingKg = FARMER.yieldCeilingKg;

  // Filter bookings for this farmer
  const farmerBookings = bookings.filter(
    (b) => b.farmer.toLowerCase() === farmerName.toLowerCase() || b.token.startsWith("KLN")
  );

  const upcomingBookings = farmerBookings.filter((b) => b.status === "Confirmed" || b.status === "In Yard");

  const activeBooking = upcomingBookings[0] ?? farmerBookings[0];

  const totalUsedKg = totalKg(farmerBookings);
  const remainingKg = Math.max(0, yieldCeilingKg - totalUsedKg);
  const percentUsed = Math.min(100, Math.round((totalUsedKg / yieldCeilingKg) * 100));

  const paidBookings = farmerBookings.filter((b) => b.paymentStatus === "Paid");
  const totalPaidNet = totalNet(paidBookings);
  const processingNet = totalNet(farmerBookings.filter((b) => b.paymentStatus === "Processing"));

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner / Farmer Identity & Land Record Status */}
      <div className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-900 p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-emerald-600/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-xs font-semibold text-emerald-200 border border-white/10 mb-3">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>Verified 7/12 Landholder · Season Rabi 2026</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{farmerName}</h1>
            <p className="mt-1 text-sm text-emerald-200">
              Farmer ID: <span className="font-mono font-bold text-white">{farmerId}</span> · Village:{" "}
              <span className="font-semibold text-white">{village}</span> (Nashik) · Gat Number:{" "}
              <span className="font-semibold text-white">{gatNo}</span> ({landAcres} Acres)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/farmer/book"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-emerald-950 shadow-sm hover:bg-emerald-50 transition-all"
            >
              <CalendarPlus size={16} className="text-emerald-700" />
              <span>Book Delivery Slot</span>
            </Link>
            <Link
              href="/farmer/qr"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-700/80 border border-emerald-500/40 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 transition-all"
            >
              <QrCode size={16} />
              <span>View Active QR Token</span>
            </Link>
          </div>
        </div>

        {/* Live Yield Ceiling & Payment Summary Metrics */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 pt-6 border-t border-white/10">
          <div className="rounded-2xl bg-white/5 p-3.5 border border-white/5">
            <p className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider">
              Season Yield Ceiling
            </p>
            <p className="mt-1 text-xl sm:text-2xl font-black">{yieldCeilingKg.toLocaleString("en-IN")} kg</p>
            <p className="text-[11px] text-emerald-200/70 mt-0.5">
              {eligibleQuintals} Quintals (60 qtl/acre)
            </p>
          </div>

          <div className="rounded-2xl bg-white/5 p-3.5 border border-white/5">
            <p className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider">
              Remaining Allowance
            </p>
            <p className="mt-1 text-xl sm:text-2xl font-black text-amber-300">
              {remainingKg.toLocaleString("en-IN")} kg
            </p>
            <p className="text-[11px] text-emerald-200/70 mt-0.5">{percentUsed}% ceiling utilized</p>
          </div>

          <div className="rounded-2xl bg-white/5 p-3.5 border border-white/5">
            <p className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider">
              Realized DBT Payout
            </p>
            <p className="mt-1 text-xl sm:text-2xl font-black text-emerald-300">{inr(totalPaidNet)}</p>
            <p className="text-[11px] text-emerald-200/70 mt-0.5">{paidBookings.length} direct transfers credited</p>
          </div>

          <div className="rounded-2xl bg-white/5 p-3.5 border border-white/5">
            <p className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider">
              Under Processing
            </p>
            <p className="mt-1 text-xl sm:text-2xl font-black">
              {processingNet > 0 ? inr(processingNet) : "₹0"}
            </p>
            <p className="text-[11px] text-emerald-200/70 mt-0.5">Central ledger verification</p>
          </div>
        </div>
      </div>

      {/* Active Slot Token & Capacity Security Card */}
      {activeBooking && (
        <Card className="p-6 border-emerald-200 bg-white shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 border border-emerald-300 px-3 py-1 text-xs font-bold text-emerald-900">
                  <Clock3 size={13} className="text-emerald-700" />
                  <span>Guaranteed 4-Hour Arrival Window</span>
                </span>
                <Badge tone={activeBooking.status === "Completed" ? "blue" : "green"}>
                  {activeBooking.status}
                </Badge>
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Token <span className="font-mono text-emerald-700">{activeBooking.token}</span> ·{" "}
                {activeBooking.centre}
              </h2>
              <p className="text-sm text-slate-600">
                Scheduled Slot: <b className="text-slate-900">{activeBooking.displayDate}</b> (
                <span className="font-semibold text-slate-800">{activeBooking.slot}</span>) · Expected Quantity:{" "}
                <b className="text-slate-900">{activeBooking.quantityKg.toLocaleString("en-IN")} kg</b> (
                {GRADE_LABEL[activeBooking.grade]})
              </p>
              <div className="flex flex-wrap gap-4 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <CheckCircle2 size={13} className="text-emerald-600" />
                  <span>2-Hour Automatic Gate Grace Period</span>
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 size={13} className="text-emerald-600" />
                  <span>10% Empty Hourly Cushion for Standby</span>
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 size={13} className="text-emerald-600" />
                  <span>Zero Tractor Rental Idling Losses</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/farmer/qr"
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-xs hover:bg-emerald-800 transition-colors"
              >
                <QrCode size={18} />
                <span>Show QR Pass at Gate</span>
              </Link>
            </div>
          </div>
        </Card>
      )}

      {/* 5 Core Farmer Operations (Functional Navigation Grid) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-black text-slate-900">Farmer Self-Service Operations</h2>
            <p className="text-xs text-slate-500">
              Direct digital access to verified land parcels, tokens, quality receipts, and treasury DBT payouts.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card 1: Slot Booking */}
          <Link
            href="/farmer/book"
            className="group relative flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all"
          >
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100 group-hover:scale-105 transition-transform">
                <CalendarPlus size={24} />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                1. Book Procurement Slot
              </h3>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                Select your preferred 4-hour window (8 AM-12 PM, 12 PM-4 PM, 4 PM-8 PM) against live descending center capacity.
              </p>
            </div>
            <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-emerald-700">
              <span>Book delivery slot</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 2: QR Token */}
          <Link
            href="/farmer/qr"
            className="group relative flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all"
          >
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 border border-blue-100 group-hover:scale-105 transition-transform">
                <QrCode size={24} />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                2. Digital QR Gate Token
              </h3>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                High-resolution gate pass hard-locked to your arrival window. Clerk scans this at the unloading dock in seconds.
              </p>
            </div>
            <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-blue-700">
              <span>View &amp; download token</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 3: 7/12 Land Records */}
          <Link
            href="/farmer/land"
            className="group relative flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all"
          >
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 border border-amber-100 group-hover:scale-105 transition-transform">
                <LandPlot size={24} />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                3. 7/12 Land Records &amp; Ceiling
              </h3>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                View verified MahaBhulekh cadastral parcel details, e-Peek Pahani crop survey, and statutory yield ceiling limits.
              </p>
            </div>
            <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-amber-700">
              <span>Inspect land limits</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 4: Receipts */}
          <Link
            href="/farmer/receipts"
            className="group relative flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all"
          >
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-700 border border-violet-100 group-hover:scale-105 transition-transform">
                <ReceiptText size={24} />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900 group-hover:text-violet-700 transition-colors">
                4. Digital Quality Receipts
              </h3>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                Tamper-proof digital receipts issued immediately upon unloading. Detailed scale weight, official FAQ grading, and deductions.
              </p>
            </div>
            <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-violet-700">
              <span>View receipts archive</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 5: DBT Payments */}
          <Link
            href="/farmer/payments"
            className="group relative flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all"
          >
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-100 group-hover:scale-105 transition-transform">
                <IndianRupee size={24} />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                5. PFMS DBT Payment Tracker
              </h3>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                Track payments from digital ledger approval to Public Financial Management System direct credit with bank UTR numbers.
              </p>
            </div>
            <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-emerald-800">
              <span>Track DBT payments</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 6: Standby Queue & Rollover Rules */}
          <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-slate-50/70 p-6">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-200 text-slate-700">
                <Truck size={24} />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900">
                Anti-Idling Operational Policy
              </h3>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                Late arrival? A 2-hour grace period applies. If delayed further, you move to the hourly 10% standby cushion or receive an 8 AM next-day VIP Priority pass.
              </p>
            </div>
            <div className="mt-5 text-[11px] font-semibold text-slate-500">
              No sleeping on the road · No rental loss
            </div>
          </div>
        </div>
      </div>

      {/* Recent Deliveries & Digital Receipts Table */}
      <Card className="overflow-hidden p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Procurement History &amp; Quality Slips</h2>
            <p className="text-xs text-slate-500">
              All electronic grading records, scale measurements, and payment settlements.
            </p>
          </div>
          <Link
            href="/farmer/receipts"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
          >
            View All Receipts →
          </Link>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm">
            <thead>
              <tr className="text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                <th className="py-2.5">Date &amp; Token</th>
                <th>Procurement Centre</th>
                <th>Weight (Scale)</th>
                <th>Quality Grade</th>
                <th>Net Payable</th>
                <th>Procurement Status</th>
                <th>Payment Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {farmerBookings.slice(0, 6).map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 font-semibold text-slate-900">
                    <div>{b.displayDate}</div>
                    <div className="font-mono text-xs text-slate-500">{b.token}</div>
                  </td>
                  <td className="text-slate-700">{b.centreShort}</td>
                  <td className="font-medium text-slate-800">
                    {b.quantityKg.toLocaleString("en-IN")} kg
                  </td>
                  <td>
                    <span className="inline-flex items-center gap-1 font-semibold text-xs text-slate-700">
                      <span>🧅</span>
                      <span>Grade {b.grade}</span>
                    </span>
                  </td>
                  <td className="font-bold text-slate-900">
                    <div>{inr(netFor(b))}</div>
                    <div className="text-[11px] font-normal text-slate-400">
                      Gross {inr(grossFor(b))}
                    </div>
                  </td>
                  <td>
                    <Badge tone={b.status === "Completed" ? "blue" : "green"}>{b.status}</Badge>
                  </td>
                  <td>
                    <Badge
                      tone={
                        b.paymentStatus === "Paid"
                          ? "green"
                          : b.paymentStatus === "Processing"
                          ? "amber"
                          : b.paymentStatus === "On Hold"
                          ? "red"
                          : "gray"
                      }
                    >
                      {b.paymentStatus}
                    </Badge>
                  </td>
                  <td className="text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => setSelectedReceipt(b)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                    >
                      <Eye size={14} />
                      <span>View</span>
                    </button>
                    {b.status === "Completed" && (
                      <button
                        type="button"
                        onClick={() => downloadReceipt(b)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900"
                      >
                        <Download size={14} />
                        <span>PDF</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Problem & Solution Explanation Card (The Real Truth Behind the Queues) */}
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50/50 p-6 sm:p-8">
        <h2 className="text-lg font-black text-emerald-950 flex items-center gap-2">
          <ShieldCheck size={20} className="text-emerald-700" />
          <span>The Krishi-Line Advantage: Ending Artificial Queue Extortion</span>
        </h2>
        <div className="mt-4 grid gap-6 md:grid-cols-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <div className="space-y-2 rounded-2xl bg-white p-5 border border-emerald-100">
            <p className="font-bold text-red-900 flex items-center gap-1.5">
              <AlertCircle size={16} className="text-red-600" />
              <span>The Ground Reality at Traditional Yards:</span>
            </p>
            <p>
              In conventional government mandi operations, multi-kilometer tractor lines and 4-day delays were artificially created by corrupt clerks. Farmers suffered up to <b>₹10,000 in rented tractor idling fees</b> while onions dehydrated in the blistering sun, losing vital moisture weight and receiving degraded quality ratings.
            </p>
            <p>
              Exhausted farmers were forced to leave, making room for corrupt networks to bring in cheap, low-grade out-of-state onions from Madhya Pradesh under forged paper registers.
            </p>
          </div>

          <div className="space-y-2 rounded-2xl bg-white p-5 border border-emerald-100">
            <p className="font-bold text-emerald-900 flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>The Krishi-Line Digital Solution:</span>
            </p>
            <p>
              <b>Guaranteed 4-Hour Windows:</b> Every farmer schedules an exact time block. You drive straight to the unloading platform, pull the lever, dump your onions, and head home in <b>45 minutes</b>.
            </p>
            <p>
              <b>Global Yield Ceilings:</b> A 2-acre plot is locked to a 120-quintal maximum production ceiling in the cloud database. No trader can dump 50 tonnes under a genuine farmer&apos;s name.
            </p>
            <p>
              <b>Direct PFMS DBT Payouts:</b> Paper slips are replaced with crypto-signed electronic receipts, compressing payment arrival from 4 weeks down to just <b>2 to 3 days</b>.
            </p>
          </div>
        </div>
      </div>

      {/* Modal for Viewing Full Digital Receipt */}
      {selectedReceipt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Digital Receipt"
        >
          <Card className="w-full max-w-xl p-6 sm:p-8 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full mb-1">
                  National Procurement Receipt
                </span>
                <h3 className="text-xl font-black text-slate-900">Krishi-Line Digital Quality Slip</h3>
                <p className="text-xs text-slate-500">
                  Unalterable electronic transaction record · NAFED / NCCF Nashik Model
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <dl className="mt-5 space-y-2.5 text-sm">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <dt className="text-slate-500">Receipt ID</dt>
                <dd className="font-mono font-bold text-slate-900">
                  {selectedReceipt.receiptId ?? `R-2026-${selectedReceipt.batchNo}`}
                </dd>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <dt className="text-slate-500">QR Gate Token</dt>
                <dd className="font-mono font-semibold text-emerald-700">{selectedReceipt.token}</dd>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <dt className="text-slate-500">Farmer / Producer</dt>
                <dd className="font-bold text-slate-900">{selectedReceipt.farmer}</dd>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <dt className="text-slate-500">Procurement Centre</dt>
                <dd className="font-semibold text-slate-800">{selectedReceipt.centre}</dd>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <dt className="text-slate-500">Slot &amp; Date</dt>
                <dd className="text-slate-800">
                  {selectedReceipt.displayDate} · {selectedReceipt.slot}
                </dd>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <dt className="text-slate-500">Scale Weight Measured</dt>
                <dd className="font-bold text-slate-900">
                  {selectedReceipt.quantityKg.toLocaleString("en-IN")} kg
                </dd>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <dt className="text-slate-500">Assigned FAQ Quality Grade</dt>
                <dd className="font-semibold text-emerald-800">
                  {GRADE_LABEL[selectedReceipt.grade]} @ {inr(selectedReceipt.pricePerQuintal)}/Quintal
                </dd>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <dt className="text-slate-500">Gross Procurement Amount</dt>
                <dd className="font-semibold text-slate-900">{inr(grossFor(selectedReceipt))}</dd>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2 text-red-700">
                <dt>Hamali (Labor Loading) Deduction</dt>
                <dd>− {inr(hamaliFor(selectedReceipt))} (₹100/qtl)</dd>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2 text-red-700">
                <dt>Mandi Operations Cess</dt>
                <dd>− ₹200</dd>
              </div>
              <div className="flex justify-between pt-2 text-base font-bold">
                <dt className="text-slate-900">Net Payable Amount</dt>
                <dd className="text-xl font-black text-emerald-700">{inr(netFor(selectedReceipt))}</dd>
              </div>
              {selectedReceipt.utr && (
                <div className="flex justify-between pt-2 border-t border-slate-100 text-xs">
                  <dt className="text-slate-500">PFMS DBT UTR Reference</dt>
                  <dd className="font-mono font-bold text-slate-700">{selectedReceipt.utr}</dd>
                </div>
              )}
            </dl>

            <div className="mt-6 flex flex-wrap gap-3">
              <PrimaryButton onClick={() => downloadReceipt(selectedReceipt)}>
                <Download size={16} />
                <span>Download HTML Receipt</span>
              </PrimaryButton>
              <GhostButton onClick={() => window.print()}>Print Receipt</GhostButton>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
