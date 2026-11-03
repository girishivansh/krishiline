"use client";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import Image from "next/image";
import { ScanLine, Lock, Scale, Printer, CheckCircle2, MessageCircle } from "lucide-react";
import { Card, Field, inputCls, PrimaryButton, GhostButton, PageHead, Empty } from "@/components/ui";
import { useStore } from "@/lib/store";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { grossFor, hamaliFor, netFor, inr, GRADE_PRICES, GRADE_LABEL, type Grade } from "@/lib/data";

const STEPS = ["Scan Farmer QR Token", "Verify Details", "Enter Weight", "Select Quality Grade", "Generate Receipt", "Print QR Sticker"];

export default function ClerkPage() {
  return (
    <ProtectedRoute requiredRole="clerk">
      <ClerkDashboard />
    </ProtectedRoute>
  );
}

function ClerkDashboard() {
  const { bookings, updateBooking } = useStore();
  const [token, setToken] = useState("");
  const [step, setStep] = useState(1);
  const [msg, setMsg] = useState("");
  const [weight, setWeight] = useState(1250);
  const [grade, setGrade] = useState<Grade>("1");
  const [receiptSent, setReceiptSent] = useState(false);
  const [stickerQr, setStickerQr] = useState("");

  const found = bookings.find((b) => b.token.toLowerCase() === token.trim().toLowerCase());
  const queue = bookings.filter((b) => b.status !== "Completed");
  const safeWeight = isNaN(weight) || weight <= 0 ? 0 : weight;
  const gross = found ? Math.round((safeWeight / 100) * GRADE_PRICES[grade]) : 0;
  const net = found ? gross - safeWeight - 200 : 0;

  useEffect(() => {
    if (step === 6 && found) {
      QRCode.toDataURL(`KRISHI-LINE|Batch:${found.batchNo}|Token:${found.token}|Weight:${safeWeight}kg|Grade:${grade}|Date:${found.displayDate}`, { width: 220, margin: 1 }).then(setStickerQr).catch(() => {});
    }
  }, [step, found, safeWeight, grade]);

  const load = () => {
    if (!found) { setMsg("No booking matches that token. Try KLN12360 (confirmed, gradeable) or KLN12345 (already completed, locked)."); return; }
    setWeight(found.quantityKg); setGrade(found.grade); setReceiptSent(false); setStep(2); setMsg(`Found: ${found.farmer} · ${found.displayDate} · ${found.centreShort} · booked ${found.quantityKg.toLocaleString("en-IN")} kg.`);
  };
  const submitGrade = () => {
    if (!found) return;
    if (safeWeight <= 0) { setMsg("Invalid weight reading. Please enter a valid measured weight in kg."); return; }
    if (found.status === "Completed") { setMsg("This booking is already graded and locked — it cannot be edited."); return; }
    updateBooking(found.id, { status: "Completed", quantityKg: safeWeight, grade, pricePerQuintal: GRADE_PRICES[grade], receiptId: `R-2026-${found.batchNo}`, paymentStatus: "Processing" });
    setReceiptSent(true); setStep(5);
    setMsg(`Graded as ${GRADE_LABEL[grade]} at ${inr(GRADE_PRICES[grade])}/quintal. Gross ${inr(gross)} · Hamali −${inr(safeWeight)} · Other −₹200 · Net ${inr(net)}. Digital quality receipt issued, synced to the farmer's web portal, and locked against edits.`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <PageHead
        title="Government Clerk Dashboard"
        sub="Role 2 — Weighing, grading, receipt generation & QR sticker printing. Six steps, exactly as the workflow: scan → verify → weigh → grade → receipt → sticker."
      />
      <div className="mt-2 grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {STEPS.map((s, i) => (
          <div
            key={s}
            className={`rounded-xl border px-3 py-2.5 text-center text-xs font-bold ${
              step === i + 1
                ? "border-emerald-600 bg-emerald-50 text-emerald-900"
                : step > i + 1
                ? "border-emerald-200 bg-emerald-50/50 text-emerald-800"
                : "border-gray-200 text-gray-500"
            }`}
          >
            <span className="mr-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-700 text-[11px] text-white">
              {i + 1}
            </span>
            {s}
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="p-6">
          <h2 className="flex items-center gap-2 font-bold"><ScanLine /> 1 · Scan / enter QR token</h2>
          <div className="mt-4 space-y-3">
            <Field label="Token">
              <input className={inputCls} value={token} onChange={(e) => setToken(e.target.value)} placeholder="e.g. KLN12360" />
            </Field>
            <PrimaryButton onClick={load}>Find booking</PrimaryButton>
          </div>
          {msg && <p className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-900">{msg}</p>}
          <p className="mt-3 text-xs text-gray-500">Demo tokens: <b>KLN12360</b> (confirmed, gradeable) · <b>KLN12345</b> (22 Oct, already graded &amp; locked).</p>
          <h3 className="mt-6 font-bold">Today&apos;s queue (ungraded)</h3>
          <ul className="mt-2 space-y-2">
            {queue.length ? (
              queue.map((b) => (
                <li key={b.id}>
                  <button onClick={() => setToken(b.token)} className="w-full rounded-xl border px-3 py-2 text-left text-sm hover:bg-emerald-50">
                    <b>{b.token}</b> · {b.displayDate} · {b.quantityKg.toLocaleString("en-IN")} kg · {b.status}
                  </button>
                </li>
              ))
            ) : (
              <Empty text="Queue is clear — every demo booking is graded." />
            )}
          </ul>
        </Card>
        <Card className="p-6 lg:col-span-2">
          {!found ? (
            <Empty text="Enter a token on the left to start the 6-step flow." />
          ) : (
            <>
              {step === 2 && (
                <div>
                  <h2 className="text-lg font-bold">2 · Farmer details</h2>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 text-sm">
                    <div className="rounded-xl bg-emerald-50 p-4">
                      <p className="text-gray-500">Farmer</p>
                      <p className="text-base font-bold">{found.farmer}</p>
                      <p className="text-gray-600">Village: {found.village} · Land: 2.0 Acres · Eligible: 120 Quintals</p>
                    </div>
                    <div className="rounded-xl bg-emerald-50 p-4">
                      <p className="text-gray-500">Booking slot</p>
                      <p className="text-base font-bold">{found.displayDate}</p>
                      <p className="text-gray-600">{found.slot} · {found.centre}</p>
                    </div>
                  </div>
                  <p className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-900">
                    <CheckCircle2 size={16} /> Valid Token · Land verified (demo) · Within yield ceiling
                  </p>
                  {found.status === "Completed" ? (
                    <p className="mt-4 flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-3 text-sm font-medium">
                      <Lock size={16} /> Already graded &amp; locked. Receipt {found.receiptId} · {GRADE_LABEL[found.grade]} · Gross {inr(grossFor(found))} · Net {inr(netFor(found))}. Editing is blocked by design.
                    </p>
                  ) : (
                    <PrimaryButton className="mt-4" onClick={() => setStep(3)}>Verified — enter weight →</PrimaryButton>
                  )}
                </div>
              )}
              {step === 3 && (
                <div>
                  <h2 className="flex items-center gap-2 text-lg font-bold"><Scale /> 3 · Enter weight</h2>
                  <p className="mt-1 text-sm text-gray-600">Weigh the onions and enter the weight. The scale is connected in this demo — use the steppers or type the reading.</p>
                  <div className="mt-4 flex items-end gap-3">
                    <input type="number" min={1} value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="w-40 rounded-xl border px-4 py-3 text-2xl font-bold" />
                    <span className="pb-3 font-semibold text-gray-600">kg</span>
                  </div>
                  <div className="mt-3 flex gap-2">
                    {[10, 50, 100].map((d) => (
                      <button key={d} onClick={() => setWeight((w) => w + d)} className="rounded-lg border px-3 py-1.5 text-sm font-semibold hover:bg-emerald-50">
                        + {d}
                      </button>
                    ))}
                    <button onClick={() => setWeight((w) => Math.max(0, w - 10))} className="rounded-lg border px-3 py-1.5 text-sm font-semibold hover:bg-gray-50">
                      − 10
                    </button>
                  </div>
                  <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                    <CheckCircle2 size={14} /> Scale Connected
                  </p>
                  <div className="mt-4 flex gap-2">
                    <GhostButton onClick={() => setStep(2)}>← Back</GhostButton>
                    <PrimaryButton onClick={() => setStep(4)}>Weight {safeWeight.toLocaleString("en-IN")} kg — select grade →</PrimaryButton>
                  </div>
                </div>
              )}
              {step === 4 && (
                <div>
                  <h2 className="text-lg font-bold">4 · Select quality grade</h2>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {(["1", "2", "3"] as Grade[]).map((g) => (
                      <button
                        key={g}
                        onClick={() => setGrade(g)}
                        className={`rounded-2xl border-2 p-4 text-left ${grade === g ? "border-emerald-600 bg-emerald-50" : "border-gray-200 hover:border-emerald-300"}`}
                      >
                        <span className="text-2xl">🧅</span>
                        <p className="mt-1 font-bold">{GRADE_LABEL[g]}</p>
                        <p className="text-sm text-gray-600">{inr(GRADE_PRICES[g])} / quintal</p>
                        <p className="text-sm font-semibold text-emerald-800">
                          {inr(Math.round((safeWeight / 100) * GRADE_PRICES[g]))} for {safeWeight.toLocaleString("en-IN")} kg
                        </p>
                      </button>
                    ))}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <GhostButton onClick={() => setStep(3)}>← Back</GhostButton>
                    <PrimaryButton onClick={submitGrade}>Submit grading &amp; generate receipt →</PrimaryButton>
                  </div>
                </div>
              )}
              {step === 5 && (
                <div>
                  <h2 className="flex items-center gap-2 text-lg font-bold"><MessageCircle className="text-emerald-700" /> 5 · Receipt sent</h2>
                  {receiptSent ? (
                    <div className="mt-4 rounded-2xl bg-emerald-50 p-5">
                      <p className="flex items-center gap-2 text-lg font-bold text-emerald-900"><CheckCircle2 /> Digital Quality Receipt Issued &amp; Synced to Farmer Portal</p>
                      <p className="mt-2 text-sm text-gray-700">
                        Your procurement is completed!<br />
                        Weight: {safeWeight.toLocaleString("en-IN")} kg · {GRADE_LABEL[grade]} · Rate: {inr(GRADE_PRICES[grade])} / Quintal<br />
                        Gross: {inr(gross)} · Hamali: −{inr(hamaliFor({ quantityKg: safeWeight }))} · Other: −₹200 · <b>Net Payable: {inr(net)}</b>
                      </p>
                      <p className="mt-2 text-sm text-gray-500">
                        Receipt {found.receiptId ?? `R-2026-${found.batchNo}`} · Token {found.token} · {found.displayDate} · The receipt is now locked against edits.
                      </p>
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-gray-600">Complete steps 3–4 to generate the receipt.</p>
                  )}
                  <div className="mt-4 flex gap-2">
                    <GhostButton onClick={() => setStep(4)}>← Back</GhostButton>
                    <PrimaryButton onClick={() => { if (receiptSent) setStep(6); }} className={!receiptSent ? "opacity-60" : ""}>
                      Receipt sent — print QR sticker →
                    </PrimaryButton>
                  </div>
                </div>
              )}
              {step === 6 && (
                <div>
                  <h2 className="flex items-center gap-2 text-lg font-bold"><Printer /> 6 · Print QR sticker</h2>
                  <p className="mt-1 text-sm text-gray-600">
                    The portable Bluetooth thermal printer on the clerk&apos;s desk prints a weather-proof, self-adhesive QR label the moment the receipt is generated. The labour team sticks it on the first jute bag — the warehouse supervisor scans this exact label at the gate.
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-6 rounded-2xl border p-5">
                    {stickerQr ? (
                      <Image
                        src={stickerQr}
                        alt="QR sticker for this batch"
                        width={176}
                        height={176}
                        unoptimized
                        className="h-44 w-44 rounded-lg border"
                      />
                    ) : (
                      <div className="flex h-44 w-44 items-center justify-center rounded-lg border text-sm text-gray-500">Generating QR…</div>
                    )}
                    <div className="text-sm">
                      <p className="font-bold">Krishi-Line</p>
                      <p>Batch No: {found.batchNo}</p>
                      <p>Weight: {safeWeight.toLocaleString("en-IN")} kg</p>
                      <p>Grade: {grade === "1" ? "1 (Premium)" : grade === "2" ? "2 (Standard)" : "3 (Lower)"}</p>
                      <p>Date: {found.displayDate}</p>
                      <p className="mt-2 text-xs text-gray-500">Ultra-destructible label: peeling shreds it into confetti, so tag-swapping is physically impossible.</p>
                      <a href={stickerQr} download={`${found.batchNo}-sticker.png`} className="mt-3 inline-block rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white">
                        Download sticker PNG
                      </a>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <GhostButton onClick={() => setStep(5)}>← Back</GhostButton>
                    <PrimaryButton onClick={() => { setToken(""); setStep(1); setMsg("Sticker printed. Next farmer in the queue, please."); }}>
                      Done — next token
                    </PrimaryButton>
                  </div>
                </div>
              )}
            </>
          )}
        </Card>
      </div>
      <Card className="mt-6 p-5">
        <h3 className="font-bold">Outcome</h3>
        <ul className="mt-2 space-y-1 text-sm text-gray-700">
          <li className="flex gap-2"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-700" />Accurate and transparent procurement entry</li>
          <li className="flex gap-2"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-700" />Instant digital receipt to farmer</li>
          <li className="flex gap-2"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-700" />Every batch has a QR label for full tracking</li>
        </ul>
      </Card>
    </div>
  );
}
