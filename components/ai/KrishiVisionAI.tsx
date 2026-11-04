"use client";

import { useState, useEffect } from "react";
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Scan,
  ShieldCheck,
  Layers,
} from "lucide-react";
import { type Grade, GRADE_LABEL, GRADE_PRICES } from "@/lib/data";

interface KrishiVisionScanResult {
  grade: Grade;
  confidence: number;
  diameterMm: number;
  moisturePercent: number;
  defectsDetected: string[];
  sampleImage: string;
  verdict: string;
  tamperRisk: "Low" | "Moderate" | "High";
}

interface KrishiVisionAIProps {
  onGradeDetermined?: (grade: Grade, telemetry: KrishiVisionScanResult) => void;
  initialGrade?: Grade;
  batchNo?: string;
  context?: "clerk_intake" | "supervisor_spotcheck" | "standalone";
}

const PRESET_SAMPLES: Record<string, KrishiVisionScanResult> = {
  grade1: {
    grade: "1",
    confidence: 98.4,
    diameterMm: 58.4,
    moisturePercent: 11.2,
    defectsDetected: ["None (Intact Dry Papery Outer Scale)"],
    sampleImage: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80",
    verdict: "Compliant with NAFED Grade-1 Export Specification (55mm+ diameter, <12% moisture).",
    tamperRisk: "Low",
  },
  grade2: {
    grade: "2",
    confidence: 94.7,
    diameterMm: 45.2,
    moisturePercent: 13.5,
    defectsDetected: ["Minor outer tunic peeling (3.2%)"],
    sampleImage: "https://images.unsplash.com/photo-1508747703725-719777637510?w=600&auto=format&fit=crop&q=80",
    verdict: "Meets Domestic Standard Grade-2 Requirements (40-54mm, safe for 30-day buffer stocking).",
    tamperRisk: "Low",
  },
  grade3_reject: {
    grade: "3",
    confidence: 96.9,
    diameterMm: 34.8,
    moisturePercent: 19.4,
    defectsDetected: [
      "Early neck rot (Botrytis allii)",
      "High moisture content (>16% threshold)",
      "Non-Nashik cultivar skin phenotype (Potential MP dumping)",
    ],
    sampleImage: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&auto=format&fit=crop&q=80",
    verdict: "High Risk: Moisture exceeds safe ceiling. Severe post-harvest decay expected in buffer storage.",
    tamperRisk: "High",
  },
};

export function KrishiVisionAI({
  onGradeDetermined,
  initialGrade = "1",
  batchNo,
  context = "clerk_intake",
}: KrishiVisionAIProps) {
  const [selectedPreset, setSelectedPreset] = useState<"grade1" | "grade2" | "grade3_reject">(
    initialGrade === "2" ? "grade2" : initialGrade === "3" ? "grade3_reject" : "grade1"
  );
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [activeResult, setActiveResult] = useState<KrishiVisionScanResult | null>(
    PRESET_SAMPLES[initialGrade === "2" ? "grade2" : initialGrade === "3" ? "grade3_reject" : "grade1"]
  );

  const startScan = (presetKey: "grade1" | "grade2" | "grade3_reject") => {
    setSelectedPreset(presetKey);
    setIsScanning(true);
    setScanProgress(0);
    setActiveResult(null);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          const result = PRESET_SAMPLES[presetKey];
          setActiveResult(result);
          if (onGradeDetermined) {
            onGradeDetermined(result.grade, result);
          }
          return 100;
        }
        return prev + 20;
      });
    }, 180);
  };

  useEffect(() => {
    // Notify parent on initial mount
    if (activeResult && onGradeDetermined) {
      onGradeDetermined(activeResult.grade, activeResult);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-emerald-500/30 bg-slate-950 text-white shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-slate-900/90 px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-black shadow-xs">
            <Scan size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold tracking-tight text-white">
                Krishi-Vision™ Optical Quality & Moisture Analyzer
              </h3>
              <span className="rounded-full bg-emerald-500/20 border border-emerald-400/40 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                v2.4 CV Model
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {context === "supervisor_spotcheck"
                ? "Warehouse Barricade: 10% Surprise Sampling Anti-Bribery Verification"
                : "Dock Intake: Standardized Non-Subjective Grade & Moisture Enforcement"}
              {batchNo ? ` • Batch ${batchNo}` : ""}
            </p>
          </div>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-800/80 p-1">
          <button
            type="button"
            onClick={() => startScan("grade1")}
            disabled={isScanning}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
              selectedPreset === "grade1"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-300 hover:text-white hover:bg-white/5"
            }`}
          >
            Sample A (Grade 1)
          </button>
          <button
            type="button"
            onClick={() => startScan("grade2")}
            disabled={isScanning}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
              selectedPreset === "grade2"
                ? "bg-amber-600 text-white shadow-xs"
                : "text-slate-300 hover:text-white hover:bg-white/5"
            }`}
          >
            Sample B (Grade 2)
          </button>
          <button
            type="button"
            onClick={() => startScan("grade3_reject")}
            disabled={isScanning}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
              selectedPreset === "grade3_reject"
                ? "bg-rose-600 text-white shadow-xs"
                : "text-slate-300 hover:text-white hover:bg-white/5"
            }`}
          >
            Sample C (Rot / Dump)
          </button>
        </div>
      </div>

      {/* Main Viewport */}
      <div className="grid grid-cols-1 gap-6 p-5 lg:grid-cols-12">
        {/* Optical Scanner Feed (Left 7 Cols) */}
        <div className="relative aspect-video overflow-hidden rounded-xl border border-white/15 bg-black lg:col-span-7">
          {/* Background simulated sample onion */}
          {activeResult && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={activeResult.sampleImage}
              alt="Optical Inspection Crate Sample"
              className="h-full w-full object-cover opacity-75 transition-opacity"
            />
          )}

          {/* Optical Reticle & HUD Overlay */}
          <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between">
            {/* Top HUD */}
            <div className="flex items-center justify-between text-[11px] font-mono text-emerald-400">
              <div className="flex items-center gap-1.5 bg-black/70 rounded-md px-2 py-1 backdrop-blur-xs">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                <span>OPTICAL SPECTRAL SENSOR: LIVE</span>
              </div>
              <div className="bg-black/70 rounded-md px-2 py-1 backdrop-blur-xs">
                FPS: 60 • ISO: 400 • RES: 4K UHD
              </div>
            </div>

            {/* Bounding Box Visual with Calipers */}
            <div className="relative mx-auto my-auto h-44 w-44 rounded-2xl border-2 border-dashed border-emerald-400/80 shadow-[0_0_25px_rgba(16,185,129,0.25)] flex items-center justify-center">
              {/* Corner brackets */}
              <div className="absolute -top-1.5 -left-1.5 h-4 w-4 border-t-2 border-l-2 border-emerald-300" />
              <div className="absolute -top-1.5 -right-1.5 h-4 w-4 border-t-2 border-r-2 border-emerald-300" />
              <div className="absolute -bottom-1.5 -left-1.5 h-4 w-4 border-b-2 border-l-2 border-emerald-300" />
              <div className="absolute -bottom-1.5 -right-1.5 h-4 w-4 border-b-2 border-r-2 border-emerald-300" />

              {/* Crosshair */}
              <div className="h-px w-6 bg-emerald-400/50" />
              <div className="h-6 w-px bg-emerald-400/50 absolute" />

              {/* Active Dimension Pill */}
              {activeResult && !isScanning && (
                <div className="absolute -bottom-7 rounded-md bg-emerald-500 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-950 shadow-md">
                  Ø {activeResult.diameterMm} mm
                </div>
              )}
            </div>

            {/* Scan Sweep Bar Animation */}
            {isScanning && (
              <div
                className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#34d399] transition-all duration-150"
                style={{ top: `${scanProgress}%` }}
              />
            )}

            {/* Bottom HUD */}
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
              <div className="bg-black/70 rounded-md px-2 py-1 backdrop-blur-xs">
                CALIBRATION: NASHIK APMC BENCHMARK 2026
              </div>
              <div className="bg-black/70 rounded-md px-2 py-1 backdrop-blur-xs text-emerald-400">
                LAT: 20.0063° N, 73.7903° E
              </div>
            </div>
          </div>

          {/* Scanning Progress Overlay */}
          {isScanning && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center p-6">
              <RefreshCw className="h-9 w-9 text-emerald-400 animate-spin mb-3" />
              <div className="text-sm font-bold text-white mb-1">
                Analyzing Optical Geometry & Water Content...
              </div>
              <p className="text-xs text-slate-400 mb-3">
                Applying Sobel edge-detection and near-infrared moisture inference
              </p>
              <div className="w-56 h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-200"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-emerald-400 mt-2">{scanProgress}% COMPLETE</span>
            </div>
          )}
        </div>

        {/* Telemetry & Verified Result (Right 5 Cols) */}
        <div className="flex flex-col justify-between space-y-4 lg:col-span-5">
          {activeResult ? (
            <div className="space-y-3.5">
              {/* Verdict Banner */}
              <div
                className={`rounded-xl border p-3.5 ${
                  activeResult.grade === "1"
                    ? "border-emerald-500/40 bg-emerald-950/40 text-emerald-200"
                    : activeResult.grade === "2"
                    ? "border-amber-500/40 bg-amber-950/40 text-amber-200"
                    : "border-rose-500/40 bg-rose-950/40 text-rose-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {activeResult.grade === "1" ? (
                      <CheckCircle2 size={18} className="text-emerald-400" />
                    ) : activeResult.grade === "2" ? (
                      <AlertTriangle size={18} className="text-amber-400" />
                    ) : (
                      <ShieldCheck size={18} className="text-rose-400" />
                    )}
                    <span className="text-xs font-black uppercase tracking-wider">
                      {GRADE_LABEL[activeResult.grade]}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold bg-white/10 px-2 py-0.5 rounded-md">
                    ₹{GRADE_PRICES[activeResult.grade].toLocaleString("en-IN")}/qtl
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-300">
                  {activeResult.verdict}
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="rounded-xl border border-white/10 bg-slate-900 p-3">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    Bulb Diameter (Ø)
                  </div>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-lg font-black text-white">{activeResult.diameterMm}</span>
                    <span className="text-xs text-slate-400">mm</span>
                  </div>
                  <span className="text-[10px] text-emerald-400">
                    {activeResult.diameterMm >= 55 ? "✓ Grade 1 Standard" : "Standard Grade 2"}
                  </span>
                </div>

                <div className="rounded-xl border border-white/10 bg-slate-900 p-3">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    Moisture Content
                  </div>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span
                      className={`text-lg font-black ${
                        activeResult.moisturePercent > 15 ? "text-rose-400" : "text-emerald-400"
                      }`}
                    >
                      {activeResult.moisturePercent}%
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {activeResult.moisturePercent <= 14 ? "Safe Buffer Storage" : "⚠ Spoilage Risk"}
                  </span>
                </div>

                <div className="rounded-xl border border-white/10 bg-slate-900 p-3">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    AI Confidence Score
                  </div>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-lg font-black text-teal-300">{activeResult.confidence}%</span>
                  </div>
                  <span className="text-[10px] text-teal-400">Sub-millimeter accuracy</span>
                </div>

                <div className="rounded-xl border border-white/10 bg-slate-900 p-3">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    Tamper / Origin Risk
                  </div>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span
                      className={`text-base font-bold ${
                        activeResult.tamperRisk === "High"
                          ? "text-rose-400"
                          : activeResult.tamperRisk === "Moderate"
                          ? "text-amber-400"
                          : "text-emerald-400"
                      }`}
                    >
                      {activeResult.tamperRisk}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">Cross-verified cultivar</span>
                </div>
              </div>

              {/* Detected Anomalies */}
              <div className="rounded-xl border border-white/10 bg-slate-900/60 p-3 text-xs">
                <div className="font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Layers size={13} className="text-emerald-400" />
                  <span>Defects & Surface Features:</span>
                </div>
                <ul className="space-y-1 text-slate-400 text-[11px]">
                  {activeResult.defectsDetected.map((defect, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-400">•</span>
                      <span>{defect}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-white/10 text-xs text-slate-500">
              Run optical scan to display telemetry
            </div>
          )}

          {/* Action Trigger */}
          <div className="pt-2">
            <button
              type="button"
              disabled={isScanning}
              onClick={() => startScan(selectedPreset)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:from-emerald-500 hover:to-teal-400 transition-all shadow-md active:scale-98 disabled:opacity-50"
            >
              <Sparkles size={14} />
              <span>{isScanning ? "Processing Spectral Frame..." : "Re-Scan Sample Optical Frame"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
