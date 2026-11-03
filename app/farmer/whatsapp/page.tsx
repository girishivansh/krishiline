"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sprout, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui";

export default function WhatsAppExclusionRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect to the dedicated web-based Farmer Portal
    const timer = setTimeout(() => {
      router.replace("/farmer");
    }, 1200);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6 text-center">
      <Card className="max-w-lg p-8 sm:p-10 shadow-sm border-emerald-200">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 mb-4 border border-emerald-200">
          <Sprout size={32} />
        </div>
        <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full mb-3">
          Architecture Update
        </span>
        <h1 className="text-2xl font-black text-slate-900">
          Krishi-Line Web Farmer Portal
        </h1>
        <p className="mt-3 text-sm text-slate-600 leading-relaxed">
          In strict compliance with deployment requirements, all farmer operations — including 7/12 land verification, 4-hour slot scheduling, digital QR tokens, quality receipts, and PFMS DBT tracking — have been unified into the dedicated, responsive <b>Web Farmer Portal</b>.
        </p>
        <p className="mt-2 text-xs text-slate-400">
          Redirecting to the official Farmer Portal...
        </p>
        <div className="mt-6">
          <Link
            href="/farmer"
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-700 px-6 py-3 text-sm font-bold text-white shadow-xs hover:bg-emerald-800 transition-colors"
          >
            <span>Enter Farmer Portal</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </Card>
    </div>
  );
}
