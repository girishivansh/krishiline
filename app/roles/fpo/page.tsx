"use client";
import { useState } from "react";
import { Card, Badge, PageHead, PrimaryButton, GhostButton } from "@/components/ui";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { FPO_MEMBERS, FPO_GROUP_BOOKINGS, CENTRES, SLOTS, MOCK_DB, type FpoMember } from "@/lib/data";

const STEPS = ["Upload Farmers & Crop Details", "View Members & Eligibility", "Group Slot Booking", "Get Booking Confirmation", "Track Booking & Delivery Status"];

function sanitizeInput(val: string): string {
  return val.replace(/^[=+\-@\t\r]/, "").replace(/[<>"]/g, "").trim();
}

export default function FpoPage() {
  return (
    <ProtectedRoute requiredRole="fpo">
      <FpoDashboard />
    </ProtectedRoute>
  );
}

function FpoDashboard() {
  const [members, setMembers] = useState<FpoMember[]>(FPO_MEMBERS);
  const [csv, setCsv] = useState("");
  const [msg, setMsg] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Record<string, boolean>>({ "Ramesh Patil": true, "Suresh Jadhav": true, "Sunil Pawar": true });
  const [date, setDate] = useState("2026-11-09");
  const [slot, setSlot] = useState(SLOTS[0]);
  const [centreId, setCentreId] = useState("Nashik-1");
  const [groupBookings, setGroupBookings] = useState(FPO_GROUP_BOOKINGS.map((g) => ({ ...g, tab: g.status === "Completed" ? "Completed" : g.status === "In Progress" ? "Upcoming" : "Upcoming" })));
  const [tab, setTab] = useState("Upcoming");
  const [confirmation, setConfirmation] = useState<string | null>(null);

  const centre = CENTRES.find((c) => c.id === centreId) ?? CENTRES[0];
  const chosen = members.filter((m) => selected[m.name]);
  const totalQ = chosen.reduce((s, m) => s + m.eligibleQuintals, 0);
  const totalTonnes = totalQ / 10;
  const blockHours = totalTonnes < 50 ? 2 : totalTonnes <= 150 ? 4 : 6;
  const remainingTonnes = centre.capacityTonnes - centre.bookedTonnesToday - (confirmation ? totalTonnes : 0);

  const downloadTemplate = () => {
    const blob = new Blob(["Name,Village,Land (Acres)\nRamesh Patil,Kahan,2.0\nSuresh Jadhav,Kahan,1.5\n"], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    const url = URL.createObjectURL(blob);
    a.href = url;
    a.download = "krishi-line-fpo-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const uploadCsv = () => {
    const lines = csv.trim().split(/\r?\n/).filter(Boolean);
    if (!lines.length) { setMsg("Paste CSV rows first — Name, Village, Land (Acres)."); return; }
    const added: FpoMember[] = [];
    for (const line of lines) {
      const parts = line.split(",").map((s) => s.trim().replace(/^["']|["']$/g, ""));
      if (parts.length < 3) continue;
      const [name, village, acresStr] = parts;
      const cleanName = sanitizeInput(name);
      const cleanVillage = sanitizeInput(village);
      const acres = Number(acresStr);
      if (!cleanName || !cleanVillage || isNaN(acres) || acres <= 0) continue;
      if (members.some((m) => m.name === cleanName) || added.some((m) => m.name === cleanName)) continue;
      const inLandRecords = MOCK_DB.land.some((l) => l.holder.toLowerCase() === cleanName.toLowerCase() && l.village.toLowerCase() === cleanVillage.toLowerCase());
      added.push({ name: cleanName, village: cleanVillage, acres, eligibleQuintals: Math.round(acres * 60), status: inLandRecords ? "Verified" : "Pending" });
    }
    if (!added.length) { setMsg("No new members added — check the format, or these farmers are already members."); return; }
    setMembers((p) => [...p, ...added]);
    setMsg(`Uploaded & cross-verified ${added.length} farmer(s) against the mock land records. Eligible quantity = land × 60 quintals/acre. Members not found in land records are marked Pending.`);
    setCsv("");
  };

  const confirmBooking = () => {
    if (!chosen.length) { setMsg("Select at least one member farmer first."); return; }
    if (totalTonnes > remainingTonnes) { setMsg(`Booking of ${totalTonnes} tonnes exceeds remaining capacity (${remainingTonnes} tonnes). Reduce selection or choose another date/centre.`); return; }
    const conf = `FPO Group Delivery Confirmed ✓ · Date: ${date} · Slot: ${slot} (${blockHours}-hour dedicated block) · Centre: ${centre.name} · Farmers: ${chosen.length} · Quantity: ${totalQ.toLocaleString("en-IN")} quintals (${totalTonnes} tonnes). Digital notification synchronized with all ${chosen.length} member farmer portals.`;
    setConfirmation(conf);
    setGroupBookings((p) => [{ date, slot, farmers: chosen.length, qtyQuintals: totalQ, centre: centre.id, status: "Confirmed", tab: "Upcoming" }, ...p]);
    setMsg(conf);
  };

  const filteredMembers = members.filter((m) => !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.village.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <PageHead
        title="FPO Cooperative Dashboard"
        sub="Role 6 — Farmer Producer Organization bulk upload, member verification & group delivery scheduling. Group bookings get dedicated 2–6 hr blocks so member trolleys arrive together."
      />
      <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {STEPS.map((s, i) => (
          <div key={s} className="rounded-xl border border-gray-200 px-3 py-2.5 text-center text-xs font-bold text-gray-600">
            <span className="mr-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-pink-700 text-[11px] text-white">
              {i + 1}
            </span>
            {s}
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-sm text-gray-500">Total FPO members</p>
          <p className="text-2xl font-bold">{members.length}</p>
          <p className="text-xs text-gray-500">{members.filter((m) => m.status === "Verified").length} verified against land records</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-gray-500">Selected for group booking</p>
          <p className="text-2xl font-bold text-pink-700">{chosen.length} farmers · {totalQ.toLocaleString("en-IN")} qtl</p>
          <p className="text-xs text-gray-500">{totalTonnes} tonnes · requires {blockHours}-hour dedicated block</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-gray-500">Centre intake capacity ({centre.id})</p>
          <p className="text-2xl font-bold">{centre.bookedTonnesToday} / {centre.capacityTonnes} MT</p>
          <p className="text-xs text-gray-500">Remaining capacity: {remainingTonnes} tonnes</p>
        </Card>
      </div>

      {msg && <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900">{msg}</p>}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="font-bold">1 · Upload farmers &amp; crop details (CSV)</h2>
          <p className="text-xs text-gray-500">Paste comma-separated rows: Name, Village, Land (Acres). System auto-verifies each name against mock 7/12 land records.</p>
          <textarea
            value={csv}
            onChange={(e) => setCsv(e.target.value)}
            rows={4}
            className="mt-3 w-full rounded-xl border p-3 font-mono text-xs"
            placeholder="Ramesh Patil, Kahan, 2.0&#10;Suresh Jadhav, Kahan, 1.5&#10;Mahesh Kale, Kahan, 1.2"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <PrimaryButton onClick={uploadCsv}>Upload &amp; Verify against Land Records</PrimaryButton>
            <GhostButton onClick={downloadTemplate}>Download sample CSV template</GhostButton>
          </div>
          <h2 className="mt-6 font-bold">2 · Member roster &amp; eligible quota</h2>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search member by name or village…"
            className="mt-2 w-full rounded-xl border px-3 py-2 text-sm"
          />
          <table className="mt-3 w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="py-2"></th>
                <th>Name</th>
                <th>Village</th>
                <th>Land</th>
                <th>Eligible (qtl)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((m) => (
                <tr key={m.name} className="border-t border-gray-100">
                  <td className="py-2.5">
                    <input
                      type="checkbox"
                      checked={!!selected[m.name]}
                      onChange={(e) => setSelected((p) => ({ ...p, [m.name]: e.target.checked }))}
                    />
                  </td>
                  <td className="font-semibold">{m.name}</td>
                  <td>{m.village}</td>
                  <td>{m.acres} ac</td>
                  <td>{m.eligibleQuintals}</td>
                  <td><Badge tone={m.status === "Verified" ? "green" : "amber"}>{m.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-xs text-gray-500">Eligible quantity = land acres × 60 quintals/acre standard ceiling. Selecting rows adds them to step 3.</p>
        </Card>

        <Card className="p-5">
          <h2 className="font-bold">3 · Group slot booking</h2>
          <p className="text-xs text-gray-500">Choose a single block window so member trolleys arrive together — no separate slots.</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-gray-600">Procurement centre</label>
              <select
                value={centreId}
                onChange={(e) => setCentreId(e.target.value)}
                className="mt-1 w-full rounded-xl border px-3 py-2 text-sm font-semibold"
              >
                {CENTRES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600">Delivery date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 w-full rounded-xl border px-3 py-2 text-sm font-semibold"
              />
            </div>
          </div>
          <div className="mt-3">
            <label className="text-xs font-semibold text-gray-600">Booking slot (starts with)</label>
            <select
              value={slot}
              onChange={(e) => setSlot(e.target.value)}
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm font-semibold"
            >
              {SLOTS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="mt-4 rounded-xl bg-pink-50 p-4 text-sm text-pink-950">
            <p className="font-bold">Group block allocation: {blockHours} hours</p>
            <p className="mt-1 text-xs">Total volume: {totalTonnes} MT ({totalQ} quintals) across {chosen.length} member farmers. Rule: &lt;50 MT = 2 hr · 50–150 MT = 4 hr · &gt;150 MT = 6 hr dedicated window.</p>
            <p className="mt-2 text-xs font-semibold">Remaining capacity at {centre.name}: {remainingTonnes} MT</p>
          </div>
          <PrimaryButton onClick={confirmBooking} className="mt-4 w-full">
            4 · Confirm Group Booking ({chosen.length} farmers)
          </PrimaryButton>
          {confirmation && (
            <div className="mt-4 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900">
              <p className="font-bold">✓ Booking Confirmed &amp; Broadcasted</p>
              <p className="mt-1 text-xs">{confirmation}</p>
            </div>
          )}
        </Card>
      </div>

      <Card className="mt-6 p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">5 · Track group booking &amp; delivery status</h2>
          <div className="flex gap-2">
            {(["Upcoming", "Completed"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold ${tab === t ? "bg-pink-700 text-white" : "border text-gray-600 hover:bg-gray-50"}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <table className="mt-3 w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500">
              <th className="py-2">Date</th>
              <th>Slot</th>
              <th>Centre</th>
              <th>Farmers</th>
              <th>Quantity</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {groupBookings.filter((g) => g.tab === tab).map((g, i) => (
              <tr key={i} className="border-t border-gray-100">
                <td className="py-2.5 font-semibold">{g.date}</td>
                <td>{g.slot}</td>
                <td>{g.centre}</td>
                <td>{g.farmers} members</td>
                <td className="font-semibold">{g.qtyQuintals.toLocaleString("en-IN")} qtl</td>
                <td>
                  <Badge tone={g.status === "Completed" ? "green" : g.status === "In Progress" ? "amber" : "blue"}>
                    {g.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
