import { NextRequest, NextResponse } from "next/server";
import { authDb } from "@/lib/server/db";
import { verifyPassword, setSessionCookie, toSafeUser } from "@/lib/server/auth";
import { ROLE_CONFIGS } from "@/lib/auth/rbac";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { identifier, password, rememberMe } = body;

    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || "unknown";

    if (!identifier || typeof identifier !== "string" || !password || typeof password !== "string") {
      return NextResponse.json(
        { success: false, message: "Please enter your Employee ID, Phone Number, or Email, and Password." },
        { status: 400 }
      );
    }

    const cleanIdentifier = identifier.trim();
    const user = authDb.getUserByIdentifier(cleanIdentifier);

    if (!user) {
      authDb.logAudit({
        identifier: cleanIdentifier,
        action: "LOGIN",
        status: "FAILED",
        details: "User identifier not found in registry",
        ip,
      });

      return NextResponse.json(
        { success: false, message: "Invalid credentials. Please verify your Employee ID / Mobile and password." },
        { status: 401 }
      );
    }

    // Check temporary lockout from brute-force attempts
    if (user.lockUntil && user.lockUntil > Date.now()) {
      const minutesRemaining = Math.ceil((user.lockUntil - Date.now()) / (60 * 1000));
      authDb.logAudit({
        userId: user.id,
        identifier: user.identifier,
        action: "LOGIN_LOCKED",
        status: "BLOCKED",
        details: `Account temporarily locked. ${minutesRemaining} minutes remaining.`,
        ip,
      });

      return NextResponse.json(
        {
          success: false,
          message: `Account is temporarily locked due to multiple consecutive failed attempts. Try again in ${minutesRemaining} minute(s) or reset your password.`,
        },
        { status: 423 }
      );
    }

    // Check account status
    if (user.status === "Blocked") {
      authDb.logAudit({
        userId: user.id,
        identifier: user.identifier,
        action: "LOGIN_BLOCKED",
        status: "BLOCKED",
        details: "Blocked account attempted login",
        ip,
      });

      return NextResponse.json(
        { success: false, message: "Your official account has been suspended by vigilance administration. Access denied." },
        { status: 403 }
      );
    }

    if (user.status === "Inactive") {
      return NextResponse.json(
        { success: false, message: "Your account is currently inactive. Please contact your center administrator." },
        { status: 403 }
      );
    }

    // Verify Password
    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      const { attempts, isLocked, lockUntil } = authDb.recordFailedLogin(user.id);
      authDb.logAudit({
        userId: user.id,
        identifier: user.identifier,
        action: "LOGIN_INCORRECT_PASSWORD",
        status: "FAILED",
        details: `Failed attempt #${attempts}`,
        ip,
      });

      if (isLocked && lockUntil) {
        return NextResponse.json(
          {
            success: false,
            message: "Too many failed login attempts. For security, this account has been locked for 15 minutes.",
          },
          { status: 423 }
        );
      }

      const remainingAttempts = Math.max(0, 5 - attempts);
      return NextResponse.json(
        {
          success: false,
          message: `Incorrect password. ${remainingAttempts > 0 ? `${remainingAttempts} attempt(s) remaining before temporary lockout.` : "Account locked."}`,
        },
        { status: 401 }
      );
    }

    // Successful login: reset failed counters
    authDb.resetFailedLogins(user.id);

    // Create session
    const session = authDb.createSession(user.id, user.role, !!rememberMe, ip, userAgent);

    // Set secure cookie
    await setSessionCookie(session);

    authDb.logAudit({
      userId: user.id,
      identifier: user.identifier,
      action: "LOGIN",
      status: "SUCCESS",
      details: `Role authenticated: ${user.role} (${user.roleTitle})`,
      ip,
    });

    const safeUser = toSafeUser(user);
    const redirectUrl = ROLE_CONFIGS[user.role]?.defaultDashboard || "/";

    return NextResponse.json({
      success: true,
      user: safeUser,
      redirectUrl,
      message: `Welcome, ${user.name}! Authenticated as ${safeUser.roleTitle}.`,
    });
  } catch (error: unknown) {
    if (error && typeof error === "object" && "digest" in error) {
      throw error;
    }
    console.error("Login API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal authentication server error. Please try again." },
      { status: 500 }
    );
  }
}
