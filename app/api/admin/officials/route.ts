import { NextRequest, NextResponse } from "next/server";
import { authDb } from "@/lib/server/db";
import { hashPassword } from "@/lib/server/auth";
import { type UserRole, ROLE_CONFIGS } from "@/lib/auth/rbac";

export async function GET() {
  try {
    const all = authDb.listUsers();
    // Return institutional officials and managers
    const officials = all.filter((u) => u.role !== "farmer");
    return NextResponse.json({ success: true, officials });
  } catch (error: unknown) {
    if (error && typeof error === "object" && "digest" in error) {
      throw error;
    }
    console.error("Admin officials GET error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch officials roster." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { officials } = body;

    if (!Array.isArray(officials) || officials.length === 0) {
      return NextResponse.json(
        { success: false, message: "Invalid payload: officials array required." },
        { status: 400 }
      );
    }

    const defaultPasswordHash = await hashPassword("Password@123");
    const created: string[] = [];
    const skipped: string[] = [];

    const roleMap: Record<string, UserRole> = {
      clerk: "clerk",
      "government clerk": "clerk",
      warehouse: "warehouse",
      "warehouse supervisor": "warehouse",
      accountant: "accountant",
      "center accountant": "accountant",
      collector: "collector",
      "collector admin": "collector",
      fpo: "fpo",
      "fpo cooperative": "fpo",
      admin: "admin",
      administrator: "admin",
    };

    for (const item of officials) {
      const empId = String(item.employeeId || item.identifier || "").trim().toUpperCase();
      const name = String(item.name || "").trim();
      const phone = String(item.phone || "").trim();
      const rawRole = String(item.role || "clerk").trim().toLowerCase();
      const centre = String(item.centre || "Nashik Procurement Center - 1").trim();

      if (!empId || !name) continue;

      const existing = authDb.getUserByIdentifier(empId);
      if (existing) {
        skipped.push(empId);
        continue;
      }

      const role: UserRole = roleMap[rawRole] || "clerk";
      const config = ROLE_CONFIGS[role];

      authDb.createUser({
        identifier: empId,
        name,
        phone: phone || undefined,
        email: `${empId.toLowerCase()}@krishiline.gov.in`,
        role,
        roleTitle: config.title,
        centre,
        passwordHash: defaultPasswordHash,
        emailVerified: true,
        phoneVerified: Boolean(phone),
      });

      authDb.logAudit({
        identifier: empId,
        action: "OFFICIAL_PROVISIONED",
        status: "SUCCESS",
        details: `Provisioned as ${config.title} at ${centre} via Admin Step 0`,
        ip: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1",
      });

      created.push(empId);
    }

    return NextResponse.json({
      success: true,
      message: `Successfully provisioned ${created.length} official(s). ${skipped.length} existing skipped.`,
      created,
      skipped,
    });
  } catch (error: unknown) {
    if (error && typeof error === "object" && "digest" in error) {
      throw error;
    }
    console.error("Admin officials POST error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to provision officials." },
      { status: 500 }
    );
  }
}
