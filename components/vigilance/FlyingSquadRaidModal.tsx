"use client";

import { useState } from "react";
import {
  Zap,
  Printer,
  X,
  CheckCircle2,
} from "lucide-react";
import { type MandiGeoNode } from "./NashikMandiGeoMap";

interface FlyingSquadRaidModalProps {
  mandi: MandiGeoNode;
  onClose: () => void;
  onConfirmRaid: (mandiId: string, freezeTreasury: boolean) => void;
}

const OFFICER_IN_CHARGE = "Shri S. K. Deshmukh, IAS (Sub-Divisional Magistrate, Niphad)";
const SQUAD_UNITS = [
  "Sub-Divisional Magistrate (SDM) Vigilance Cell",
  "Controller of Legal Metrology (Weights & Measures)",
  "Maharashtra State Police Flying Squad Unit 4",
  "Independent Quality Assayer (Agmark Empanelled)",
];

export function FlyingSquadRaidModal({ mandi, onClose, onConfirmRaid }: FlyingSquadRaidModalProps) {
  const [freezeTreasury, setFreezeTreasury] = useState(true);
  const [isDispatched, setIsDispatched] = useState(false);

  const orderNumber = `NSK/VIGILANCE/PROC-2026-${mandi.id.toUpperCase().slice(0, 4)}-8842`;
  const timestampStr = "04 Nov 2026, 11:30 AM IST";

  const handleExecute = () => {
    setIsDispatched(true);
    onConfirmRaid(mandi.id, freezeTreasury);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="raid-order-title"
    >
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-rose-500/50 bg-slate-900 text-white shadow-2xl">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-rose-500/30 bg-rose-950/80 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-600 text-white shadow-md">
              <Zap size={20} className="fill-white" />
            </div>
            <div>
              <h3 id="raid-order-title" className="text-base font-black tracking-tight text-white">
                EMERGENCY FLYING SQUAD RAID DISPATCH
              </h3>
              <p className="text-xs text-rose-200">
                Collectorate of Nashik • District Vigilance &amp; Anti-Corruption Wing
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="max-h-[75vh] overflow-y-auto p-6 space-y-5 text-sm">
          {!isDispatched ? (
            <>
              {/* Order Metadata */}
              <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 space-y-2 text-xs">
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-slate-400">Order Reference</span>
                  <span className="font-mono font-bold text-amber-300">{orderNumber}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-slate-400">Target APMC Centre</span>
                  <span className="font-bold text-white">{mandi.name} ({mandi.taluka})</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-slate-400">Trigger Anomaly</span>
                  <span className="font-bold text-rose-400">
                    {mandi.grade1Pct}% Grade-1 intake (Baseline normal: {mandi.historicalNormalPct}%)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Issuing Magistrate</span>
                  <span className="font-semibold text-slate-200">District Magistrate / Collector, Nashik</span>
                </div>
              </div>

              {/* Composition of the Flying Squad */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">
                  Designated Multi-Agency Squad
                </label>
                <div className="space-y-1.5">
                  {SQUAD_UNITS.map((u, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2 text-xs text-slate-300"
                    >
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                      <span>{u}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Freeze Treasury Toggle */}
              <div className="rounded-2xl border border-rose-500/30 bg-rose-950/30 p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={freezeTreasury}
                    onChange={(e) => setFreezeTreasury(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-rose-400 text-rose-600 focus:ring-rose-500"
                  />
                  <div>
                    <span className="font-bold text-rose-200 block text-xs">
                      Invoke Immediate Mandi Payout Freeze (Emergency Firewall)
                    </span>
                    <span className="text-[11px] text-slate-400 leading-relaxed block mt-0.5">
                      Locks all PFMS direct benefit disbursement triggers for {mandi.name} until physical scale calibration and crate tally are reconciled by the flying squad.
                    </span>
                  </div>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleExecute}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white hover:from-rose-500 hover:to-red-500 transition-all shadow-lg active:scale-98"
                >
                  <Zap size={14} className="fill-white" />
                  <span>Execute Raid Order &amp; Dispatch Squad</span>
                </button>
              </div>
            </>
          ) : (
            /* Raid Dispatched Success & Document View */
            <div className="space-y-4">
              <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/40 p-4 text-center">
                <CheckCircle2 size={36} className="mx-auto text-emerald-400 mb-2" />
                <h4 className="text-base font-black text-white">RAID ORDER DISPATCHED VIA POLICE WIRELESS</h4>
                <p className="mt-1 text-xs text-slate-300">
                  Flying Squad unit ETA to {mandi.name}: <b>22 Minutes</b>.
                  {freezeTreasury && " Treasury disbursement lock has been applied to central ledger."}
                </p>
              </div>

              {/* Official Document Preview Card */}
              <div className="rounded-2xl border border-slate-700 bg-stone-50 p-5 text-slate-900 font-serif text-xs space-y-3 shadow-inner">
                <div className="text-center border-b-2 border-stone-800 pb-2">
                  <p className="font-bold text-[10px] tracking-widest uppercase">GOVERNMENT OF MAHARASHTRA</p>
                  <p className="font-bold text-xs uppercase">OFFICE OF THE DISTRICT COLLECTOR &amp; DISTRICT MAGISTRATE, NASHIK</p>
                  <p className="text-[10px] font-sans text-stone-600">ORDER UNDER ESSENTIAL COMMODITIES ACT • VIGILANCE DISPATCH</p>
                </div>

                <div className="flex justify-between text-[10px] font-sans">
                  <span>Order: <b>{orderNumber}</b></span>
                  <span>Date &amp; Time: <b>{timestampStr}</b></span>
                </div>

                <p className="text-[11px] leading-relaxed">
                  Whereas, automated telemetry and statistical variance algorithms of the Krishi-Line digital procurement grid have flagged abnormal Grade-1 intake ({mandi.grade1Pct}%) at <b>{mandi.name}</b>, creating prima facie evidence of illegal out-of-state produce dumping and clerk collusion:
                </p>

                <p className="text-[11px] leading-relaxed">
                  It is hereby ordered that a multi-agency Flying Squad led by <b>{OFFICER_IN_CHARGE}</b> proceed immediately to seal weighment bridges, confiscate unloading registers, and conduct spot optical audits under police escort.
                </p>

                <div className="pt-3 flex justify-between items-end border-t border-stone-300 font-sans text-[10px]">
                  <div>
                    <span className="text-stone-500 block">Status:</span>
                    <span className="font-bold text-emerald-700">DIGITALLY SIGNED &amp; DISPATCHED</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold block">[SEAL OF THE DISTRICT MAGISTRATE]</span>
                    <span className="text-stone-500">Nashik Collectorate, MH</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white"
                >
                  <Printer size={14} />
                  <span>Print Official Order</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-500"
                >
                  Close &amp; Return to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
