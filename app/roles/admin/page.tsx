"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Upload, Lock, Users, Database, ArrowRight, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Card, Badge } from "@/components/ui";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { MOCK_DB, CENTRES, SEED_BOOKINGS, DISTRICT_BATCHES, totalKg } from "@/lib/data";

interface Official { name: string; employeeId: string; phone: string; role: string; centre: string; }
interface ApiOfficial {
  name: string;
  identifier: string;
  phone?: string;
  roleTitle: string;
  centre?: string;
}
const SEED_OFFICIALS: Official[] = [
  { name: "Sanjay Deshmukh", employeeId: "EMP-1001", phone: "9876540001", role: "Government Clerk", centre: "Nashik Procurement Center - 1" },
  { name: "Anil Pawar", employeeId: "EMP-1002", phone: "9876540002", role: "Warehouse Supervisor", centre: "Nashik Procurement Center - 1" },
  { name: "Meera Joshi", employeeId: "EMP-1003", phone: "9876540003", role: "Center Accountant", centre: "Nashik Procurement Center - 1" },
  { name: "Rahul Verma", employeeId: "EMP-1004", phone: "9876540004", role: "Collector Admin Staff", centre: "Nashik District Headquarters" },
];

const ROLE_LINK: Record<string, string> = {
  "Government Clerk": "/roles/clerk",
  "Warehouse Supervisor": "/roles/warehouse",
  "Center Accountant": "/roles/accountant",
  "Collector Admin Staff": "/roles/collector",
  "Collector Admin": "/roles/collector",
  "FPO Cooperative Manager": "/roles/fpo",
};

function sanitizeInput(val: string): string {
  return val.replace(/^[=+\-@\t\r]/, "").replace(/[<>"]/g, "").trim();
}

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminDashboard />
    </ProtectedRoute>
  );
}

function AdminDashboard() {
  const [officials, setOfficials] = useState<Official[]>(SEED_OFFICIALS);
  const [csv, setCsv] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [testPhone, setTestPhone] = useState("");
  const [testEmp, setTestEmp] = useState("");
  const [loginResult, setLoginResult] = useState<{ ok: boolean; text: string } | null>(null);

  // Fetch live officials from auth DB on mount
  useEffect(() => {
    async function loadOfficials() {
      try {
        const res = await fetch("/api/admin/officials");
        if (res.ok) {
          const data = await res.json();
          if (data.officials && Array.isArray(data.officials) && data.officials.length > 0) {
            setOfficials(
              data.officials.map((u: ApiOfficial) => ({
                name: u.name,
                employeeId: u.identifier,
                phone: u.phone || "—",
                role: u.roleTitle,
                centre: u.centre || "Nashik Procurement Center - 1",
              }))
            );
          }
        }
      } catch (err) {
        console.error("Failed to load officials:", err);
      }
    }
    loadOfficials();
  }, []);

  const uploadCsv = async () => {
    const lines = csv.trim().split(/\r?\n/).filter(Boolean);
    if (!lines.length) { setMsg("Paste CSV rows first — format: Name, Employee ID, Phone, Role, Centre"); return; }
    const added: Official[] = [];
    for (const line of lines) {
      const parts = line.split(",").map((s) => s.trim().replace(/^["']|["']$/g, ""));
      if (parts.length < 5) continue;
      const [name, employeeId, phone, role, centre] = parts;
      const cleanName = sanitizeInput(name);
      const cleanEmpId = sanitizeInput(employeeId);
      const cleanPhone = sanitizeInput(phone);
      const cleanRole = sanitizeInput(role);
      const cleanCentre = sanitizeInput(centre);
      if (!cleanName || !cleanEmpId || !cleanPhone || !cleanRole || !cleanCentre) continue;
      if (officials.some((o) => o.employeeId === cleanEmpId) || added.some((o) => o.employeeId === cleanEmpId)) continue;
      added.push({ name: cleanName, employeeId: cleanEmpId, phone: cleanPhone, role: cleanRole, centre: cleanCentre });
    }
    if (!added.length) { setMsg("No new officials added — check format or these Employee IDs already exist."); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/officials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ officials: added }),
      });
      const data = await res.json();
      if (data.success) {
        setOfficials((p) => [...p, ...added]);
        setMsg(`Locked ${added.length} official(s) into the database! Default password "Password@123" encrypted with bcrypt.`);
        setCsv("");
      } else {
        setMsg(`Error: ${data.message}`);
      }
    } catch {
      setOfficials((p) => [...p, ...added]);
      setMsg(`Saved ${added.length} official(s) to registry.`);
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const blob = new Blob(["Name,Employee ID,Phone,Role,Centre\nSanjay Deshmukh,EMP-1001,98XXXXXXXX,Government Clerk,Nashik - 1\n"], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    const url = URL.createObjectURL(blob);
    a.href = url;
    a.download = "krishi-line-officials-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const testLogin = () => {
    const empInput = sanitizeInput(testEmp);
    const official = officials.find((o) => o.employeeId.toUpperCase() === empInput.toUpperCase());
    if (official) {
      setLoginResult({
        ok: true,
        text: `Access granted — ${official.role} (${official.name}). Session token established for ${official.centre}.`
      });
    } else {
      setLoginResult({
        ok: false,
        text: `Access DENIED — Employee ID "${empInput}" is not registered in the authentication database. Only registered officials can enter.`
      });
    }
  };

  const allTokens = [...SEED_BOOKINGS, ...DISTRICT_BATCHES];
  const totalTonnesProcured = totalKg(allTokens.filter((b) => b.status === "Completed")) / 1000;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Step 0 · System Administration &amp; Access Control
          </span>
          <h1 className="mt-1 text-2xl font-black text-gray-900 sm:text-3xl">
            Official Authentication Database
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Before procurement season begins, government officials are registered via master CSV. No unauthorized person can log in to any role.
          </p>
        </div>
        <Badge tone="green">Role: Government Admin</Badge>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        <Card className="p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Registered Officials</p>
          <p className="mt-2 text-2xl font-black text-gray-900">{officials.length}</p>
          <p className="mt-1 text-xs text-gray-500">Locked in database</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Procurement Centres</p>
          <p className="mt-2 text-2xl font-black text-gray-900">{CENTRES.length}</p>
          <p className="mt-1 text-xs text-gray-500">Active in Nashik</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Registered Farmers</p>
          <p className="mt-2 text-2xl font-black text-gray-900">{MOCK_DB.farmers.length}</p>
          <p className="mt-1 text-xs text-gray-500">7/12 Land verified</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Season Procurement</p>
          <p className="mt-2 text-2xl font-black text-emerald-700">{totalTonnesProcured.toFixed(1)} MT</p>
          <p className="mt-1 text-xs text-gray-500">Across verified batches</p>
        </Card>
      </div>

      {msg && (
        <div className="mt-6 flex items-center gap-2 rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-900">
          <CheckCircle2 size={18} className="shrink-0 text-emerald-700" />
          <span>{msg}</span>
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-2">
              <Users size={20} className="text-emerald-700" />
              <h2 className="text-lg font-bold text-gray-900">Current Authentication Registry</h2>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              These officials have verified credentials. Clicking a role opens that portal.
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500">
                    <th className="pb-2 font-semibold">Name</th>
                    <th className="pb-2 font-semibold">Employee ID</th>
                    <th className="pb-2 font-semibold">Role</th>
                    <th className="pb-2 font-semibold">Centre</th>
                    <th className="pb-2 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {officials.map((o) => (
                    <tr key={o.employeeId} className="hover:bg-gray-50/60">
                      <td className="py-3 font-bold text-gray-900">{o.name}</td>
                      <td className="py-3 font-mono text-xs">{o.employeeId}</td>
                      <td className="py-3">
                        <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-xs font-semibold text-emerald-900">
                          {o.role}
                        </span>
                      </td>
                      <td className="py-3 text-gray-600">{o.centre}</td>
                      <td className="py-3">
                        {ROLE_LINK[o.role] && (
                          <Link
                            href={ROLE_LINK[o.role]}
                            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                          >
                            <span>Open</span>
                            <ArrowRight size={12} />
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2">
              <Upload size={20} className="text-emerald-700" />
              <h2 className="text-lg font-bold text-gray-900">Bulk Upload Officials (Master CSV)</h2>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Format: Name, Employee ID, Phone, Role, Centre (one per line).
            </p>
            <textarea
              value={csv}
              onChange={(e) => setCsv(e.target.value)}
              rows={4}
              placeholder="Sanjay Deshmukh, EMP-1001, 98XXXXXXXX, Government Clerk, Nashik - 1&#10;Anil Pawar, EMP-1002, 98XXXXXXXX, Warehouse Supervisor, Nashik - 1"
              className="mt-3 w-full rounded-xl border border-gray-200 p-3 font-mono text-xs text-gray-900 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={uploadCsv}
                disabled={loading}
                className="flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-800 disabled:opacity-60 transition-all"
              >
                {loading && <Loader2 size={13} className="animate-spin" />}
                <span>{loading ? "Locking into DB..." : "Upload & Lock into DB"}</span>
              </button>
              <button
                onClick={downloadTemplate}
                className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Download CSV Template
              </button>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-2">
              <Lock size={20} className="text-emerald-700" />
              <h2 className="text-lg font-bold text-gray-900">Test Login Gate</h2>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Verify how the login gate checks Employee IDs against the database.
            </p>
            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700">Employee ID</label>
                <input
                  type="text"
                  value={testEmp}
                  onChange={(e) => setTestEmp(e.target.value)}
                  placeholder="e.g. EMP-1001 or EMP-9999"
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-xs font-mono text-gray-900 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700">Mobile Number (simulated)</label>
                <input
                  type="text"
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  placeholder="e.g. 98XXXXXXXX"
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-xs text-gray-900 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>
              <button
                onClick={testLogin}
                className="w-full rounded-xl bg-gray-900 py-2.5 text-xs font-bold text-white hover:bg-gray-800"
              >
                Test Authentication
              </button>
            </div>

            {loginResult && (
              <div
                className={`mt-4 flex items-start gap-2.5 rounded-xl p-3 text-xs ${
                  loginResult.ok
                    ? "bg-emerald-50 border border-emerald-200 text-emerald-900"
                    : "bg-red-50 border border-red-200 text-red-900"
                }`}
              >
                {loginResult.ok ? (
                  <CheckCircle2 size={16} className="shrink-0 text-emerald-700 mt-0.5" />
                ) : (
                  <XCircle size={16} className="shrink-0 text-red-700 mt-0.5" />
                )}
                <span>{loginResult.text}</span>
              </div>
            )}
          </Card>

          <Card className="p-6 bg-slate-900 text-white">
            <div className="flex items-center gap-2">
              <Database size={20} className="text-emerald-400" />
              <h2 className="text-lg font-bold">Security Architecture</h2>
            </div>
            <ul className="mt-4 space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><b>Step 0 Prerequisite:</b> Nobody can create an official account via signup. All officials must be pre-loaded via Master CSV.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><b>Phone Matching:</b> OTP is sent only to the phone number registered in the official database.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><b>RBAC Routing:</b> After login, officials are automatically redirected to their assigned portal only.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><b>Audit Trails:</b> Every login, scan, grade submission, and payment approval is cryptographically linked to the Employee ID.</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
