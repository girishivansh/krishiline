import { NextRequest, NextResponse } from "next/server";
import { authDb } from "@/lib/server/db";
import { hashPassword, setSessionCookie, toSafeUser } from "@/lib/server/auth";
import { type UserRole, ROLE_CONFIGS } from "@/lib/auth/rbac";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, identifier, email, phone, role, password, centre, village, landGat } = body;

    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";

    // Basic required fields validation
    if (!name || !identifier || !password) {
      return NextResponse.json(
        { success: false, message: "Name, User Identifier (Mobile/ID), and Password are required." },
        { status: 400 }
      );
    }

    // Role permission check: Only Farmer and FPO roles can self-register
    const targetRole: UserRole = role || "farmer";
    if (targetRole !== "farmer" && targetRole !== "fpo") {
      return NextResponse.json(
        {
          success: false,
          message: "Institutional and government roles (Clerk, Supervisor, Accountant, Collector) must be provisioned via the State Agriculture Master Registry (Admin Step 0). Public registration for these roles is restricted.",
        },
        { status: 403 }
      );
    }

    // Password strength check
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const cleanIdentifier = identifier.trim();

    // Check duplicate account
    const existing = authDb.getUserByIdentifier(cleanIdentifier);
    if (existing) {
      return NextResponse.json(
        { success: false, message: "An account with this Identifier / Phone / Email already exists." },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const roleConfig = ROLE_CONFIGS[targetRole];

    const newUser = authDb.createUser({
      identifier: cleanIdentifier,
      name: name.trim(),
      email: email ? email.trim() : undefined,
      phone: phone ? phone.trim() : undefined,
      role: targetRole,
      roleTitle: targetRole === "farmer" ? "Farmer / Producer" : "FPO Cooperative Manager",
      centre: centre || (targetRole === "farmer" ? "Nashik Procurement Center - 1" : "Nashik Agro Cluster"),
      passwordHash,
      emailVerified: !!email,
      phoneVerified: true,
      status: "Active",
    });

    authDb.logAudit({
      userId: newUser.id,
      identifier: newUser.identifier,
      action: "REGISTER",
      status: "SUCCESS",
      details: `Self-registered role: ${targetRole}. Village: ${village || "N/A"}, Gat: ${landGat || "N/A"}`,
      ip,
    });

    // Create session and set cookie immediately
    const session = authDb.createSession(newUser.id, newUser.role, true, ip);
    await setSessionCookie(session);

    return NextResponse.json({
      success: true,
      user: toSafeUser(newUser),
      redirectUrl: roleConfig.defaultDashboard,
      message: "Account registered successfully!",
    });
  } catch (error: unknown) {
    if (error && typeof error === "object" && "digest" in error) {
      throw error;
    }
    console.error("Register API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to register account. Please try again." },
      { status: 500 }
    );
  }
}
