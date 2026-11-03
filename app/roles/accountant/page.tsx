"use client";
import { useState } from "react";
import { Card, Badge, PageHead, PrimaryButton } from "@/components/ui";
import { useStore } from "@/lib/store";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { grossFor, hamaliFor, netFor, inr, totalNet, GRADE_LABEL } from "@/lib/data";

const STEPS = ["View Verified Entries", "Calculate Payable Amount", "Verify Bank Details", "Approve & Digital Sign", "Submit to PFMS", "Track Payment Status"];

export default function AccountantPage() {
  return (
    <ProtectedRoute requiredRole="accountant">
      <AccountantDashboard />
    </ProtectedRoute>
  );
}

function AccountantDashboard() {
  const { bookings, updateBooking } = useStore();
  const [msg, setMsg] = useState("");
  const [selected, setSelected] = useState<Record<string, boolean>>({ B00124: true, B00125: true, B00126: true });
  const [signed, setSigned] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const completed = bookings
    .filter((b) => b.status === "Completed")
    .sort((a, b) => b.date.localeCompare(a.date));

  const ledger = completed.filter((b) => b.batchNo.startsWith("B0012"));
  const activeLedger = ledger.length > 0 ? ledger : completed.slice(0, 5);

  const [detailId, setDetailId] = useState<string>(
    () => (activeLedger.find((b) => b.batchNo === "B00124") ?? activeLedger[0])?.id ?? ""
  );

  const detail = bookings.find((b) => b.id === detailId) ?? activeLedger[0];

  const selectedRows = activeLedger.filter(
    (b) => selected[b.batchNo] && b.paymentStatus !== "On Hold" && b.warehouseStatus !== "Flagged"
  );
  const pfmsTotal = totalNet(selectedRows);
  const paidNet = totalNet(bookings.filter((b) => b.paymentStatus === "Paid"));
  const processingNet = totalNet(bookings.filter((b) => b.paymentStatus === "Processing"));

  const isDetailHeld = detail?.paymentStatus === "On Hold" || detail?.warehouseStatus === "Flagged";

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <PageHead
        title="Center Accountant Dashboard"
        sub="Role 4 — Digital ledger, deductions & payment processing. No manual data entry: verified rows arrive automatically, the system pre-calculates the net payable, and a flagged row never gets an Approve button."
      />
      <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {STEPS.map((s, i) => (
          <div key={s} className="rounded-xl border border-gray-200 px-3 py-2.5 text-center text-xs font-bold text-gray-600">
            <span className="mr-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-violet-700 text-[11px] text-white">
              {i + 1}
            </span>
            {s}
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-sm text-gray-500">Ledger total (completed, net)</p>
          <p className="text-2xl font-bold">{inr(totalNet(completed))}</p>
          <p className="text-xs text-gray-500">District ledger: All ({completed.length}) · Ready ({processingNet > 0 ? "Active" : "Cleared"})</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-gray-500">Already credited (demo)</p>
          <p className="text-2xl font-bold text-emerald-700">{inr(paidNet)}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-gray-500">Awaiting release</p>
          <p className="text-2xl font-bold text-amber-700">{inr(processingNet)}</p>
        </Card>
      </div>

      {msg && <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900">{msg}</p>}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="overflow-x-auto p-5">
          <h2 className="font-bold">1 · Verified procurement entries</h2>
          <p className="text-xs text-gray-500">Only supervisor-approved batches reach this ledger. Select rows for the PFMS batch.</p>
          <table className="mt-3 w-full min-w-[520px] text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="py-2"></th>
                <th>Batch</th>
                <th>Farmer</th>
                <th>Weight</th>
                <th>Grade</th>
                <th>Net payable</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {activeLedger.map((b) => {
                const held = b.paymentStatus === "On Hold" || b.warehouseStatus === "Flagged";
                return (
                  <tr
                    key={b.batchNo}
                    onClick={() => setDetailId(b.id)}
                    className={`cursor-pointer border-t border-gray-100 ${
                      detail?.id === b.id ? "bg-violet-50/60" : ""
                    }`}
                  >
                    <td className="py-3">
                      <input
                        type="checkbox"
                        checked={!!selected[b.batchNo]}
                        disabled={held}
                        onChange={(e) => setSelected((p) => ({ ...p, [b.batchNo]: e.target.checked }))}
                      />
                    </td>
                    <td className="font-semibold">{b.batchNo}</td>
                    <td>{b.farmer}</td>
                    <td>{b.quantityKg.toLocaleString("en-IN")} kg</td>
                    <td>{GRADE_LABEL[b.grade].split(" (")[0]}</td>
                    <td className="font-semibold">{inr(netFor(b))}</td>
                    <td>
                      <Badge tone={b.paymentStatus === "Paid" ? "green" : held ? "red" : "amber"}>
                        {held ? "On Hold" : b.paymentStatus}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="mt-2 text-xs text-gray-500">Click a row to see its full calculation, bank check and payment action.</p>
        </Card>

        <Card className="p-5">
          <h2 className="font-bold">2 · Amount calculation — {detail ? `${detail.batchNo} · ${detail.farmer}` : "—"}</h2>
          {detail ? (
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between border-b pb-2">
                <dt className="text-gray-500">Weight / Grade / Rate</dt>
                <dd className="font-semibold">
                  {detail.quantityKg.toLocaleString("en-IN")} kg · {GRADE_LABEL[detail.grade]} · {inr(detail.pricePerQuintal)}/qtl
                </dd>
              </div>
              <div className="flex justify-between border-b pb-2">
                <dt className="text-gray-500">Gross amount</dt>
                <dd className="font-semibold">{inr(grossFor(detail))}</dd>
              </div>
              <div className="flex justify-between border-b pb-2">
                <dt className="text-gray-500">Hamali deduction (₹100/quintal)</dt>
                <dd>− {inr(hamaliFor(detail))}</dd>
              </div>
              <div className="flex justify-between border-b pb-2">
                <dt className="text-gray-500">Other deductions</dt>
                <dd>− ₹200</dd>
              </div>
              <div className="flex justify-between text-base">
                <dt className="font-bold">Net payable</dt>
                <dd className="font-bold text-emerald-800">{inr(netFor(detail))}</dd>
              </div>
            </dl>
          ) : (
            <p className="mt-3 text-sm text-gray-500">Select a row on the left.</p>
          )}

          <h3 className="mt-5 font-bold">3 · Bank verification</h3>
          <p className="mt-1 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
            ✓ Bank account verified — {detail?.farmer ?? ""}: SBI · A/c No: XXXX 1234 · IFSC: SBIN0001234 · Aadhaar Linked · Name matches government land registry.
          </p>

          <h3 className="mt-5 font-bold">4–5 · Digital signature &amp; PFMS</h3>
          <p className="mt-1 text-sm text-gray-600">
            Selected entries: <b>{selectedRows.length}</b> · Total amount: <b>{inr(pfmsTotal)}</b>
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <PrimaryButton
              onClick={() => {
                setSigned(true);
                setMsg("Digital signature applied to the selected batch. The batch is now ready for PFMS submission.");
              }}
            >
              Apply digital signature
            </PrimaryButton>
            <PrimaryButton
              onClick={() => {
                if (!signed) {
                  setMsg("Apply the digital signature first (step 4).");
                  return;
                }
                setSubmitted(true);
                selectedRows.forEach((row) => {
                  if (row.paymentStatus !== "Paid") {
                    updateBooking(row.id, {
                      paymentStatus: "Paid",
                      utr: `DEMO-UTR-887${row.batchNo.slice(-3)}`,
                    });
                  }
                });
                setMsg(
                  `Batch of ${selectedRows.length} entries (${inr(pfmsTotal)}) submitted to the PFMS DBT gateway! UTR numbers generated and updated live across portals.`
                );
              }}
              className={signed ? "" : "opacity-60"}
            >
              Submit to PFMS
            </PrimaryButton>
          </div>

          {submitted && (
            <ul className="mt-3 space-y-1 text-sm text-emerald-800 font-medium">
              <li>✓ Data validated against acreage yield ceilings</li>
              <li>✓ Cryptographic digital signature applied</li>
              <li>✓ Submitted to PFMS DBT gateway</li>
              <li>✓ Direct Bank Transfer settlement executed</li>
            </ul>
          )}

          {detail && !isDetailHeld && detail.paymentStatus !== "Paid" && (
            <button
              onClick={() => {
                updateBooking(detail.id, {
                  paymentStatus: "Paid",
                  utr: `DEMO-UTR-887${detail.batchNo.slice(-3)}`,
                });
                setMsg(
                  `${detail.batchNo} (${detail.farmer}) released — marked Paid. The farmer's Web Portal and payment history reflect the credit immediately.`
                );
              }}
              className="mt-3 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
            >
              Approve &amp; release this row
            </button>
          )}

          {isDetailHeld && (
            <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-800">
              Fraud firewall: this row was flagged at the warehouse gate or frozen by Vigilance. The accountant never receives an “Approve Payout” option for it — the money stays in the treasury, so no refund is ever needed.
            </p>
          )}
        </Card>
      </div>

      <Card className="mt-6 overflow-x-auto p-5">
        <h2 className="font-bold">6 · Track payment status</h2>
        <p className="text-xs text-gray-500">
          District tracking: All completed batches. Changes here propagate instantly to the Farmer Web Portal and payment receipts.
        </p>
        <table className="mt-3 w-full min-w-[560px] text-sm">
          <thead>
            <tr className="text-left text-gray-500">
              <th className="py-2">Batch</th>
              <th>Farmer</th>
              <th>Net amount</th>
              <th>Status</th>
              <th>UTR</th>
            </tr>
          </thead>
          <tbody>
            {activeLedger.map((b) => (
              <tr key={b.batchNo} className="border-t border-gray-100">
                <td className="py-3 font-semibold">{b.batchNo}</td>
                <td>{b.farmer}</td>
                <td>{inr(netFor(b))}</td>
                <td>
                  <Badge
                    tone={
                      b.paymentStatus === "Paid"
                        ? "green"
                        : b.paymentStatus === "On Hold" || b.warehouseStatus === "Flagged"
                        ? "red"
                        : "amber"
                    }
                  >
                    {b.warehouseStatus === "Flagged" || b.paymentStatus === "On Hold" ? "On Hold" : b.paymentStatus}
                  </Badge>
                </td>
                <td className="text-gray-600">{b.utr ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 text-xs text-gray-500">
          Cross-portal sync active: approving a row here updates the live store, and checking the farmer web portal or payments page will immediately show the UTR and paid net amount.
        </p>
      </Card>
    </div>
  );
}
