"use client";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, Badge, PageHead, PrimaryButton } from "@/components/ui";
import { useStore } from "@/lib/store";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DISTRICT, CENTRE_COMPARISON, SUSPICIOUS, INVESTIGATIONS } from "@/lib/data";
import { NashikMandiGeoMap, type MandiGeoNode } from "@/components/vigilance/NashikMandiGeoMap";
import { FlyingSquadRaidModal } from "@/components/vigilance/FlyingSquadRaidModal";

const GRADE_CHART = [
  { centre: "Center A", "Grade-1": 42, "Grade-2": 30, "Grade-3": 20 },
  { centre: "Center B", "Grade-1": 82, "Grade-2": 45, "Grade-3": 35 },
  { centre: "Center C", "Grade-1": 58, "Grade-2": 38, "Grade-3": 30 },
];

function sanitizeCsvCell(val: unknown): string {
  const str = String(val ?? "").replace(/"/g, '""');
  const safeStr = /^[=+\-@\t\r]/.test(str) ? `'${str}` : str;
  return `"${safeStr}"`;
}

export default function CollectorPage() {
  return (
    <ProtectedRoute requiredRole="collector">
      <CollectorDashboard />
    </ProtectedRoute>
  );
}

function CollectorDashboard() {
  const { bookings, updateBooking } = useStore();
  const [actions, setActions] = useState<Record<string, string>>({});
  const [reportMsg, setReportMsg] = useState("");
  const [raidTargetMandi, setRaidTargetMandi] = useState<MandiGeoNode | null>(null);
  const otherCentres = DISTRICT.quintalsProcured - CENTRE_COMPARISON.reduce((s, c) => s + c.qtyQuintals, 0);

  const freezeBatch = (batchNo: string) => {
    setActions((p) => ({ ...p, [batchNo]: "Frozen" }));
    const match = bookings.find((b) => b.batchNo === batchNo);
    if (match) {
      updateBooking(match.id, { paymentStatus: "On Hold", warehouseStatus: "Flagged" });
    }
  };

  const investigateBatch = (batchNo: string) => {
    setActions((p) => ({ ...p, [batchNo]: "Investigating" }));
  };

  const raiseFullInvestigation = () => {
    setActions((p) => ({ ...p, B00124: "Investigating", B00156: "Investigating", B00178: "Frozen" }));
    const b178 = bookings.find((b) => b.batchNo === "B00178" || b.batchNo === "B00127");
    if (b178) {
      updateBooking(b178.id, { paymentStatus: "On Hold", warehouseStatus: "Flagged" });
    }
  };

  const handleConfirmRaid = (mandiId: string, freezeTreasury: boolean) => {
    setActions((p) => ({ ...p, B00124: "Investigating", B00156: "Investigating", B00178: "Frozen", B00126: "Frozen" }));
    if (freezeTreasury) {
      bookings.forEach((b) => {
        if (b.centreShort?.toLowerCase().includes("nashik") || b.centre?.toLowerCase().includes("nashik")) {
          if (b.paymentStatus === "Estimated" || b.paymentStatus === "Processing") {
            updateBooking(b.id, { paymentStatus: "On Hold", warehouseStatus: "Flagged" });
          }
        }
      });
    }
  };

  const downloadReport = () => {
    const rawRows = [
      ["Krishi-Line District Report — Nashik (demo data)"],
      [],
      ["Centre", "Qty (quintals)", "Grade-1 %", "Status"],
      ...CENTRE_COMPARISON.map((c) => [c.centre, c.qtyQuintals, c.grade1Pct, c.status]),
      ["Other 7 centres", otherCentres, "—", "—"],
      ["TOTAL", DISTRICT.quintalsProcured, "—", "—"],
      [],
      ["Suspicious entries"],
      ["Batch", "Farmer", "Issue", "Action"],
      ...SUSPICIOUS.map((s) => [s.batchNo, s.farmer, s.issue, actions[s.batchNo] ?? "Pending"])
    ];

    const csvContent = rawRows.map((r) => r.map(sanitizeCsvCell).join(",")).join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    const url = URL.createObjectURL(blob);
    a.href = url;
    a.download = "krishi-line-nashik-district-report.csv";
    a.click();
    URL.revokeObjectURL(url);
    setReportMsg("Report downloaded (CSV). District totals in it reconcile: the 5 centres shown + the other 7 centres = 24,560 quintals.");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <PageHead
        title="Collector Admin Dashboard"
        sub="Role 5 — District monitoring, anomaly detection & vigilance alerts. District figures are illustrative demo scope; the centre table and grade chart are the working demo data."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-5">
          <p className="text-sm text-gray-500">Centres</p>
          <p className="text-2xl font-bold">{DISTRICT.centres}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-gray-500">Quintals procured</p>
          <p className="text-2xl font-bold">{DISTRICT.quintalsProcured.toLocaleString("en-IN")}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-gray-500">Farmers</p>
          <p className="text-2xl font-bold">{DISTRICT.farmers.toLocaleString("en-IN")}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-gray-500">Grade split</p>
          <p className="text-2xl font-bold">G1 {DISTRICT.grade1Pct}% · G2 {DISTRICT.grade2Pct}% · G3 {DISTRICT.grade3Pct}%</p>
        </Card>
      </div>

      {/* Interactive Nashik District APMC Geo-Spatial Vigilance Grid */}
      <div className="mt-6">
        <NashikMandiGeoMap
          onDispatchRaid={(mandi) => setRaidTargetMandi(mandi)}
        />
      </div>

      {raidTargetMandi && (
        <FlyingSquadRaidModal
          mandi={raidTargetMandi}
          onClose={() => setRaidTargetMandi(null)}
          onConfirmRaid={handleConfirmRaid}
        />
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="overflow-x-auto p-5">
          <h2 className="font-bold">2 · Monitor centre-wise performance</h2>
          <table className="mt-3 w-full min-w-[420px] text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="py-2">Center</th>
                <th>Total Qty (Quintals)</th>
                <th>Grade-1 (%)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {CENTRE_COMPARISON.map((c) => (
                <tr key={c.centre} className="border-t border-gray-100">
                  <td className="py-3 font-semibold">{c.centre}</td>
                  <td>{c.qtyQuintals.toLocaleString("en-IN")}</td>
                  <td className={c.grade1Pct >= 60 ? "font-bold text-red-700" : ""}>{c.grade1Pct}%</td>
                  <td>
                    <Badge tone={c.status === "High Risk" ? "red" : c.status === "Watch" ? "amber" : "green"}>
                      {c.status}
                    </Badge>
                  </td>
                </tr>
              ))}
              <tr className="border-t border-gray-200 font-semibold">
                <td className="py-3">Other 7 centres</td>
                <td>{otherCentres.toLocaleString("en-IN")}</td>
                <td>—</td>
                <td>—</td>
              </tr>
              <tr className="border-t-2 border-gray-300 font-bold">
                <td className="py-3">District total</td>
                <td>{DISTRICT.quintalsProcured.toLocaleString("en-IN")}</td>
                <td>{DISTRICT.grade1Pct}% avg</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </Card>

        <Card className="p-5">
          <h2 className="font-bold">3 · Detect anomalies &amp; variance</h2>
          <p className="text-xs text-gray-500">Grade distribution comparison — Center B is the outlier.</p>
          <div className="mt-3 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={GRADE_CHART}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="centre" />
                <YAxis unit="%" />
                <Tooltip formatter={(v) => [`${v}%`, "Share"]} />
                <Legend />
                <Bar dataKey="Grade-1" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Grade-2" fill="#16a34a" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Grade-3" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-800">
            ⚠ Anomaly detected! Center B has 72% Grade-1 while nearby centers average 28–35%. This is a Level-3 red flag: the variance alarm fires on the Collector&apos;s screen and an independent External Vigilance Flying Squad is dispatched for a surprise physical raid that very day.
          </p>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="overflow-x-auto p-5">
          <h2 className="font-bold">4 · Investigate &amp; take action — suspicious entries</h2>
          <table className="mt-3 w-full min-w-[480px] text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="py-2">Batch</th>
                <th>Farmer</th>
                <th>Issue</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {SUSPICIOUS.map((s) => {
                const match = bookings.find((b) => b.batchNo === s.batchNo);
                const isFrozen = actions[s.batchNo] === "Frozen" || match?.paymentStatus === "On Hold";
                const isInvestigating = actions[s.batchNo] === "Investigating";

                return (
                  <tr key={s.batchNo} className="border-t border-gray-100">
                    <td className="py-3 font-semibold">{s.batchNo}</td>
                    <td>{s.farmer}</td>
                    <td>{s.issue}</td>
                    <td>
                      {isFrozen ? (
                        <Badge tone="red">Frozen</Badge>
                      ) : isInvestigating ? (
                        <Badge tone="blue">Investigating</Badge>
                      ) : (
                        <span className="flex gap-2">
                          <button
                            onClick={() => investigateBatch(s.batchNo)}
                            className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                          >
                            Investigate
                          </button>
                          <button
                            onClick={() => freezeBatch(s.batchNo)}
                            className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50"
                          >
                            Freeze
                          </button>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <button
            onClick={raiseFullInvestigation}
            className="mt-3 w-full rounded-xl bg-red-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-800"
          >
            Raise Vigilance Investigation
          </button>
          <p className="mt-2 text-xs text-gray-500">
            Freezing a batch locks its payout in the treasury — no money moves until the investigation clears it. These are demo flags on demo data, not findings about any real person or centre.
          </p>
        </Card>

        <Card className="p-5">
          <h2 className="font-bold">5 · Monitor resolution &amp; reports</h2>
          <div className="mt-3 flex gap-2 text-sm">
            <Badge>All (12)</Badge>
            <Badge tone="amber">In Progress (5)</Badge>
            <Badge tone="green">Resolved (6)</Badge>
            <Badge tone="gray">New (1)</Badge>
          </div>
          <table className="mt-3 w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="py-2">Center</th>
                <th>Issue</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {INVESTIGATIONS.map((i) => (
                <tr key={i.centre + i.issue} className="border-t border-gray-100">
                  <td className="py-3 font-semibold">{i.centre}</td>
                  <td>{i.issue}</td>
                  <td>
                    <Badge tone={i.status === "Resolved" ? "green" : i.status === "In Progress" ? "amber" : "gray"}>
                      {i.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <PrimaryButton className="mt-4" onClick={downloadReport}>
            Generate Report (CSV)
          </PrimaryButton>
          {reportMsg && <p className="mt-2 text-sm font-medium text-emerald-800">{reportMsg}</p>}
        </Card>
      </div>

      <Card className="mt-6 p-5">
        <h2 className="font-bold">Benefits</h2>
        <ul className="mt-2 grid gap-1 text-sm text-gray-700 sm:grid-cols-2">
          <li>✓ Real-time monitoring of all procurement centers</li>
          <li>✓ Early detection of corruption patterns</li>
          <li>✓ Data-driven vigilance investigation</li>
          <li>✓ Prevents fake / out-of-state procurement</li>
          <li>✓ Protects government treasury (freeze suspicious payments)</li>
          <li>✓ Complete visibility with reports and analytics</li>
        </ul>
      </Card>
    </div>
  );
}
