"use client";

import { useState } from "react";
import {
  ShieldAlert,
  Zap,
  Crosshair,
} from "lucide-react";

export interface MandiGeoNode {
  id: string;
  name: string;
  taluka: string;
  coords: { x: number; y: number }; // Relative percentage coordinates in Nashik SVG map
  riskLevel: "CRITICAL" | "MODERATE" | "NORMAL";
  grade1Pct: number;
  historicalNormalPct: number;
  todayIntakeMt: number;
  capacityMt: number;
  activeTrolleys: number;
  flagsCount: number;
  suspectedIssue?: string;
}

export const NASHIK_MANDIS: MandiGeoNode[] = [
  {
    id: "lasalgaon",
    name: "Lasalgaon Main APMC",
    taluka: "Niphad",
    coords: { x: 68, y: 52 },
    riskLevel: "CRITICAL",
    grade1Pct: 74,
    historicalNormalPct: 28,
    todayIntakeMt: 864,
    capacityMt: 1000,
    activeTrolleys: 42,
    flagsCount: 7,
    suspectedIssue: "Grade-1 over-reporting (+46% above agro-climatic normal). Suspected MP trader blend.",
  },
  {
    id: "pimpalgaon",
    name: "Pimpalgaon Baswant APMC",
    taluka: "Niphad",
    coords: { x: 52, y: 44 },
    riskLevel: "NORMAL",
    grade1Pct: 31,
    historicalNormalPct: 30,
    todayIntakeMt: 712,
    capacityMt: 900,
    activeTrolleys: 28,
    flagsCount: 0,
  },
  {
    id: "kalwan",
    name: "Kalwan Sub-Mandi",
    taluka: "Kalwan",
    coords: { x: 45, y: 22 },
    riskLevel: "MODERATE",
    grade1Pct: 44,
    historicalNormalPct: 32,
    todayIntakeMt: 520,
    capacityMt: 750,
    activeTrolleys: 18,
    flagsCount: 2,
    suspectedIssue: "Standby quota surge detected during 12:00-14:00 window.",
  },
  {
    id: "yeola",
    name: "Yeola Procurement Center",
    taluka: "Yeola",
    coords: { x: 82, y: 64 },
    riskLevel: "NORMAL",
    grade1Pct: 29,
    historicalNormalPct: 27,
    todayIntakeMt: 410,
    capacityMt: 600,
    activeTrolleys: 14,
    flagsCount: 1,
  },
  {
    id: "dindori",
    name: "Dindori Agri-Terminal",
    taluka: "Dindori",
    coords: { x: 38, y: 40 },
    riskLevel: "NORMAL",
    grade1Pct: 26,
    historicalNormalPct: 25,
    todayIntakeMt: 380,
    capacityMt: 550,
    activeTrolleys: 11,
    flagsCount: 0,
  },
  {
    id: "chandwad",
    name: "Chandwad APMC Yard",
    taluka: "Chandwad",
    coords: { x: 58, y: 32 },
    riskLevel: "MODERATE",
    grade1Pct: 48,
    historicalNormalPct: 31,
    todayIntakeMt: 490,
    capacityMt: 700,
    activeTrolleys: 21,
    flagsCount: 3,
    suspectedIssue: "3 repeat slot cancellations followed by immediate rebooking from single IP.",
  },
];

interface NashikMandiGeoMapProps {
  onSelectMandi?: (mandi: MandiGeoNode) => void;
  onDispatchRaid?: (mandi: MandiGeoNode) => void;
}

export function NashikMandiGeoMap({ onSelectMandi, onDispatchRaid }: NashikMandiGeoMapProps) {
  const [selectedMandi, setSelectedMandi] = useState<MandiGeoNode>(NASHIK_MANDIS[0]);

  const handleSelect = (mandi: MandiGeoNode) => {
    setSelectedMandi(mandi);
    if (onSelectMandi) onSelectMandi(mandi);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-900 text-white shadow-xl">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-950/80 px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">
            <Crosshair size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold tracking-tight text-white">
                Nashik District APMC Geo-Spatial Vigilance Grid
              </h3>
              <span className="rounded-full bg-rose-500/20 border border-rose-500/40 px-2 py-0.5 text-[10px] font-mono text-rose-300">
                1 CRITICAL ALERT
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Real-time statistical anomaly monitoring across 6 key APMC procurement yards
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1 text-rose-400">
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
            Critical Variance
          </span>
          <span className="flex items-center gap-1 text-amber-400">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            Watchlist
          </span>
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Normal
          </span>
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Map Viewport (Left 7 Cols) */}
        <div className="relative aspect-[4/3] bg-slate-950 p-6 lg:col-span-7 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-800">
          {/* Stylized District Border SVG */}
          <svg
            viewBox="0 0 500 400"
            className="w-full h-full max-h-[380px] drop-shadow-[0_0_20px_rgba(16,185,129,0.05)]"
          >
            {/* Nashik District Perimeter Outline */}
            <polygon
              points="140,50 260,30 380,70 450,160 470,260 400,350 280,380 160,360 80,280 60,180 80,100"
              fill="#0f172a"
              stroke="#334155"
              strokeWidth="2.5"
              strokeDasharray="4 2"
              className="transition-all"
            />

            {/* Taluka Boundary Lines */}
            <path
              d="M 140,50 Q 250,180 280,380 M 60,180 Q 250,200 470,260 M 260,30 Q 260,200 160,360"
              stroke="#1e293b"
              strokeWidth="1.5"
              fill="none"
            />

            {/* Godavari River Flow Line */}
            <path
              d="M 90,190 Q 200,230 320,240 T 460,270"
              stroke="#0ea5e9"
              strokeWidth="2"
              strokeOpacity="0.4"
              strokeDasharray="6 3"
              fill="none"
            />
            <text x="330" y="235" fill="#38bdf8" fontSize="9" opacity="0.6" fontFamily="monospace">
              Godavari River Basin
            </text>

            {/* District Label */}
            <text x="170" y="80" fill="#475569" fontSize="13" fontWeight="bold" letterSpacing="4">
              NASHIK DISTRICT
            </text>

            {/* Nodes */}
            {NASHIK_MANDIS.map((m) => {
              const cx = (m.coords.x / 100) * 500;
              const cy = (m.coords.y / 100) * 400;
              const isSelected = selectedMandi.id === m.id;
              const isCritical = m.riskLevel === "CRITICAL";
              const isModerate = m.riskLevel === "MODERATE";

              const color = isCritical ? "#f43f5e" : isModerate ? "#f59e0b" : "#10b981";

              return (
                <g
                  key={m.id}
                  className="cursor-pointer transition-transform hover:scale-110"
                  onClick={() => handleSelect(m)}
                >
                  {/* Ping animation for critical node */}
                  {isCritical && (
                    <circle cx={cx} cy={cy} r="18" fill="none" stroke="#f43f5e" strokeWidth="1.5" opacity="0.7">
                      <animate attributeName="r" values="8;24" dur="1.8s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.8;0" dur="1.8s" repeatCount="indefinite" />
                    </circle>
                  )}

                  {/* Outer selection ring */}
                  {isSelected && (
                    <circle cx={cx} cy={cy} r="14" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 2" />
                  )}

                  {/* Central Node Circle */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSelected ? "9" : "7"}
                    fill={color}
                    stroke="#020617"
                    strokeWidth="2"
                  />

                  {/* Mandi Name Label */}
                  <text
                    x={cx}
                    y={cy - 12}
                    textAnchor="middle"
                    fill={isSelected ? "#ffffff" : "#94a3b8"}
                    fontSize="10"
                    fontWeight={isSelected ? "bold" : "normal"}
                    className="select-none"
                  >
                    {m.name.split(" ")[0]}
                  </text>
                  <text
                    x={cx}
                    y={cy + 17}
                    textAnchor="middle"
                    fill={color}
                    fontSize="8"
                    fontFamily="monospace"
                    fontWeight="bold"
                    className="select-none"
                  >
                    {m.grade1Pct}% G1
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Quick Map Legend */}
          <div className="absolute bottom-3 left-4 rounded-lg bg-slate-900/90 border border-slate-800 p-2 text-[10px] text-slate-400 backdrop-blur-xs font-mono">
            <div>Click nodes to inspect center telemetry</div>
            <div>Lasalgaon: +46% Grade-1 anomaly</div>
          </div>
        </div>

        {/* Selected Mandi Telemetry & Action Panel (Right 5 Cols) */}
        <div className="p-5 lg:col-span-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  TALUKA: {selectedMandi.taluka.toUpperCase()}
                </span>
                <h4 className="text-base font-black text-white">{selectedMandi.name}</h4>
              </div>

              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                  selectedMandi.riskLevel === "CRITICAL"
                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                    : selectedMandi.riskLevel === "MODERATE"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                }`}
              >
                {selectedMandi.riskLevel} RISK
              </span>
            </div>

            {/* Suspicious Issue Callout */}
            {selectedMandi.suspectedIssue && (
              <div className="mt-3 rounded-xl border border-rose-500/40 bg-rose-950/40 p-3 text-xs text-rose-200">
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <ShieldAlert size={14} className="text-rose-400 shrink-0" />
                  <span>Automated Vigilance Warning:</span>
                </div>
                <p className="text-[11px] leading-relaxed text-rose-300/90">
                  {selectedMandi.suspectedIssue}
                </p>
              </div>
            )}

            {/* Metrics Breakdown */}
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <div className="text-[10px] uppercase font-bold text-slate-400">Grade 1 Ratio</div>
                <div className="mt-1 flex items-baseline gap-1">
                  <span
                    className={`text-xl font-black ${
                      selectedMandi.grade1Pct > 50 ? "text-rose-400" : "text-white"
                    }`}
                  >
                    {selectedMandi.grade1Pct}%
                  </span>
                  <span className="text-[10px] text-slate-500">vs {selectedMandi.historicalNormalPct}% norm</span>
                </div>
                <div className="mt-1 text-[9px] font-mono text-slate-400">
                  Deviation: {selectedMandi.grade1Pct > selectedMandi.historicalNormalPct ? "+" : ""}
                  {selectedMandi.grade1Pct - selectedMandi.historicalNormalPct}%
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <div className="text-[10px] uppercase font-bold text-slate-400">Today Intake</div>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-xl font-black text-white">{selectedMandi.todayIntakeMt}</span>
                  <span className="text-xs text-slate-400">/ {selectedMandi.capacityMt} MT</span>
                </div>
                <div className="mt-1 text-[9px] font-mono text-emerald-400">
                  {Math.round((selectedMandi.todayIntakeMt / selectedMandi.capacityMt) * 100)}% Yard Saturation
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <div className="text-[10px] uppercase font-bold text-slate-400">Active Trolleys</div>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-xl font-black text-white">{selectedMandi.activeTrolleys}</span>
                  <span className="text-xs text-slate-400">in yard</span>
                </div>
                <div className="mt-1 text-[9px] text-slate-400">FIFO gate controlled</div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <div className="text-[10px] uppercase font-bold text-slate-400">Flags Raised</div>
                <div className="mt-1 flex items-baseline gap-1">
                  <span
                    className={`text-xl font-black ${
                      selectedMandi.flagsCount > 0 ? "text-amber-400" : "text-emerald-400"
                    }`}
                  >
                    {selectedMandi.flagsCount}
                  </span>
                  <span className="text-xs text-slate-400">frozen rows</span>
                </div>
                <div className="mt-1 text-[9px] text-slate-400">Awaiting SDM review</div>
              </div>
            </div>
          </div>

          {/* Executive Action Controls */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            {selectedMandi.riskLevel === "CRITICAL" ? (
              <button
                type="button"
                onClick={() => onDispatchRaid && onDispatchRaid(selectedMandi)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-rose-500 transition-all shadow-lg active:scale-98"
              >
                <Zap size={14} className="fill-white" />
                <span>Issue Flying Squad Raid Order &amp; Freeze Treasury</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onDispatchRaid && onDispatchRaid(selectedMandi)}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
              >
                <ShieldAlert size={14} />
                <span>Dispatch Routine Audit Team</span>
              </button>
            )}

            <p className="text-[10px] text-center text-slate-500">
              Authority under Section 144 / Essential Commodities Act 1955
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
