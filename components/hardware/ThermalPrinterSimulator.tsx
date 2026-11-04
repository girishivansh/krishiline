"use client";

import { useState } from "react";
import {
  Printer,
  Wifi,
  CheckCircle2,
} from "lucide-react";

interface ThermalPrinterProps {
  batchNo: string;
  farmer: string;
  weightKg: number;
  grade?: string;
  gradeLabel: string;
  dateStr: string;
  token: string;
  qrCodeUrl: string;
  onPrinted?: () => void;
}

export function ThermalPrinterSimulator({
  batchNo,
  farmer,
  weightKg,
  gradeLabel,
  dateStr,
  token,
  qrCodeUrl,
  onPrinted,
}: ThermalPrinterProps) {
  const [isPrinting, setIsPrinting] = useState(false);
  const [hasPrinted, setHasPrinted] = useState(false);
  const [printProgress, setPrintProgress] = useState(0);

  const handlePrint = () => {
    setIsPrinting(true);
    setPrintProgress(0);
    setHasPrinted(false);

    const interval = setInterval(() => {
      setPrintProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setIsPrinting(false);
          setHasPrinted(true);
          if (onPrinted) onPrinted();
          return 100;
        }
        return p + 25;
      });
    }, 250);
  };

  return (
    <div className="rounded-2xl border border-slate-700/60 bg-slate-900 p-5 text-white shadow-xl">
      {/* Device Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-emerald-400">
            <Printer size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-tight text-white">
                Zebra ZQ521 Mobile Thermal Printer
              </span>
              <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 text-[9px] font-mono text-emerald-400">
                BLUETOOTH 5.2
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Station ID: KL-NSK-GATE-PRT-02 • 203 DPI</p>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-3 text-[10px] font-mono">
          <div className="flex items-center gap-1 text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>PAIRED</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <Wifi size={11} />
            <span>MANDI MESH</span>
          </div>
        </div>
      </div>

      {/* Main Printer Body & Paper Output Slot */}
      <div className="mt-4 flex flex-col items-center">
        {/* Paper feeder lip */}
        <div className="relative w-full max-w-sm rounded-t-lg bg-slate-950 py-1.5 px-4 text-center border-t-2 border-slate-700">
          <div className="mx-auto h-1 w-48 rounded-full bg-slate-800 shadow-inner" />
          <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500">
            Thermal Roll Output Slot
          </span>
        </div>

        {/* Animated Thermal Label Dispenser */}
        <div
          className={`w-full max-w-sm bg-stone-100 text-slate-900 rounded-b-xl shadow-2xl transition-all duration-500 overflow-hidden border-x border-b border-stone-300 relative ${
            isPrinting ? "opacity-95" : hasPrinted ? "opacity-100" : "opacity-40"
          }`}
          style={{
            maxHeight: isPrinting ? `${(printProgress / 100) * 360}px` : hasPrinted ? "380px" : "110px",
          }}
        >
          {/* Security destructible serrated edge indicator */}
          <div className="h-1.5 w-full bg-stone-300 border-b border-dashed border-stone-400" />

          {/* Tamper-evident background pattern */}
          <div className="p-4 relative">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:8px_8px]" />

            {/* Label Header */}
            <div className="flex items-center justify-between border-b-2 border-black pb-2">
              <div>
                <h4 className="text-xs font-black tracking-tighter uppercase">KRISHI-LINE GOVT BUFFER</h4>
                <p className="text-[9px] font-mono">NAFED / NCCF NASHIK DIVISION</p>
              </div>
              <span className="rounded border border-black px-1.5 py-0.5 text-[10px] font-mono font-black">
                PASS: GATE-FIFO
              </span>
            </div>

            {/* Label Content */}
            <div className="mt-3 flex gap-3">
              {/* QR Code Container with Destructible Watermark */}
              <div className="relative flex flex-col items-center justify-center rounded border border-black p-1 bg-white">
                {qrCodeUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={qrCodeUrl}
                    alt={`Batch ${batchNo} QR Label`}
                    className="h-28 w-28 object-contain"
                  />
                ) : (
                  <div className="h-28 w-28 flex items-center justify-center text-[10px] font-mono">
                    Generating...
                  </div>
                )}
                <span className="text-[8px] font-mono font-bold mt-0.5 tracking-widest">{batchNo}</span>
              </div>

              {/* Specs */}
              <div className="flex-1 space-y-1 text-[11px] font-mono">
                <div>
                  <span className="text-slate-500 text-[9px] block">FARMER / AADHAAR HASH</span>
                  <span className="font-bold text-xs">{farmer}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[9px] block">NET SCALE WEIGHT</span>
                  <span className="font-black text-sm text-emerald-800">{weightKg.toLocaleString("en-IN")} KG</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[9px] block">VERIFIED GRADE</span>
                  <span className="font-bold">{gradeLabel}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[9px] block">SLOT TOKEN & DATE</span>
                  <span>{token} • {dateStr}</span>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="mt-2.5 rounded bg-stone-200/80 p-1.5 text-[8px] font-mono text-stone-700 border border-stone-300">
              <span className="font-bold">SECURITY WARNING:</span> Tamper-evident ultra-destructible vinyl substrate. Any attempt to peel or swap will shred the label into confetti. Barcode valid only for FIFO Gate Queue.
            </div>
          </div>
        </div>

        {/* Printing Progress Bar */}
        {isPrinting && (
          <div className="mt-3 w-full max-w-sm space-y-1">
            <div className="flex justify-between text-[10px] font-mono text-emerald-400">
              <span>THERMAL FEED HEAD IN PROGRESS...</span>
              <span>{printProgress}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-200"
                style={{ width: `${printProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5 w-full max-w-sm">
          {!hasPrinted ? (
            <button
              type="button"
              disabled={isPrinting}
              onClick={handlePrint}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg hover:bg-emerald-500 active:scale-98 transition-all disabled:opacity-50"
            >
              <Printer size={15} />
              <span>{isPrinting ? "Printing Label..." : "Print Destructible Thermal QR Label"}</span>
            </button>
          ) : (
            <div className="flex w-full items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                <CheckCircle2 size={16} />
                <span>Label Dispensed Successfully!</span>
              </div>
              <button
                type="button"
                onClick={handlePrint}
                className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-[11px] font-semibold text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              >
                Reprint Slip
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
