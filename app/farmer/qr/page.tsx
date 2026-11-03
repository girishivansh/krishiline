"use client";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import Image from "next/image";
import { Download, Printer, Copy, Check } from "lucide-react";
import { Card, Field, inputCls, GhostButton, PageHead, Badge } from "@/components/ui";
import { useStore } from "@/lib/store";
import { grossFor, netFor, inr } from "@/lib/data";

export default function QrPage() {
  const { bookings } = useStore();
  const [id, setId] = useState(bookings[0]?.id ?? "");
  const [img, setImg] = useState("");
  const [copied, setCopied] = useState(false);
  const booking = bookings.find((b) => b.id === id) ?? bookings[0];

  useEffect(() => {
    if (!booking) return;
    const payload = JSON.stringify({ token: booking.token, farmer: "Ramesh Patil", centre: booking.centre, date: booking.date, slot: booking.slot, qtyKg: booking.quantityKg });
    QRCode.toDataURL(payload, { width: 320, margin: 2 }).then(setImg).catch(() => setImg(""));
  }, [booking]);

  if (!booking) return <p>No bookings yet. Book a slot first.</p>;

  return <div><PageHead title="QR Token" sub="Show this token at the centre gate for weighing and grading. The QR encodes the token, centre, date, slot and quantity — demo payload only." />
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="p-6 text-center"><Badge>{booking.status}</Badge>
        {img ? (
          <Image
            src={img}
            alt={`QR code for token ${booking.token}`}
            width={256}
            height={256}
            unoptimized
            className="mx-auto mt-4 h-64 w-64 rounded-2xl border"
          />
        ) : <p className="py-20 text-sm text-gray-500">Generating QR…</p>}
        <p className="mt-3 font-mono text-lg font-bold">{booking.token}</p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          {img && <a href={img} download={`${booking.token.replace(/[^a-zA-Z0-9_-]/g, "_")}.png`} className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white"><Download size={16} /> Download PNG</a>}
          <GhostButton onClick={() => window.print()}><Printer size={16} /> Print</GhostButton>
          <GhostButton onClick={() => { navigator.clipboard?.writeText(booking.token); setCopied(true); setTimeout(() => setCopied(false), 1500); }}>{copied ? <Check size={16} /> : <Copy size={16} />} {copied ? "Copied" : "Copy token"}</GhostButton>
        </div>
      </Card>
      <Card className="p-6 lg:col-span-2">
        <Field label="Choose booking"><select className={inputCls} value={booking.id} onChange={(e) => setId(e.target.value)}>{bookings.map((b) => <option key={b.id} value={b.id}>{b.displayDate} · {b.centreShort} · {b.quantityKg.toLocaleString("en-IN")} kg · {b.status}</option>)}</select></Field>
        <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-xl bg-gray-50 p-3"><dt className="text-gray-500">Farmer</dt><dd className="font-semibold">Ramesh Patil</dd></div>
          <div className="rounded-xl bg-gray-50 p-3"><dt className="text-gray-500">Centre</dt><dd className="font-semibold">{booking.centre}</dd></div>
          <div className="rounded-xl bg-gray-50 p-3"><dt className="text-gray-500">Date / slot</dt><dd className="font-semibold">{booking.displayDate} · {booking.slot}</dd></div>
          <div className="rounded-xl bg-gray-50 p-3"><dt className="text-gray-500">Crop / quantity</dt><dd className="font-semibold">{booking.crop} · {booking.quantityKg.toLocaleString("en-IN")} kg</dd></div>
          <div className="rounded-xl bg-gray-50 p-3"><dt className="text-gray-500">Grade / rate</dt><dd className="font-semibold">Grade {booking.grade} · ₹{booking.pricePerQuintal.toLocaleString("en-IN")} / quintal</dd></div>
          <div className="rounded-xl bg-gray-50 p-3"><dt className="text-gray-500">Amount</dt><dd className="font-semibold">Gross {inr(grossFor(booking))} · Net {inr(netFor(booking))} {booking.status === "Confirmed" ? "(estimated)" : ""}</dd></div>
        </dl>
        <h2 className="mt-6 font-bold">At the centre</h2><ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-gray-700"><li>Show this QR at the gate.</li><li>The clerk scans it and sees your land-record check and yield ceiling.</li><li>After weighing and grading, your digital receipt is issued against this same token.</li></ol>
        <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">Demo safeguard: a token is valid only for its own centre, date and 4-hour slot in this prototype&apos;s logic — the clerk screen rejects a mismatched token.</p>
      </Card>
    </div>
  </div>;
}
