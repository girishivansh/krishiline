import { NextRequest, NextResponse } from "next/server";
import { authDb } from "@/lib/server/db";
import { hashPassword } from "@/lib/server/auth";

export async function POST(req: NextRequest) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || typeof token !== "string" || !newPassword || typeof newPassword !== "string") {
      return NextResponse.json(
        { success: false, message: "Valid reset token and new password are required." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: "New password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const userId = authDb.verifyAndConsumeResetToken(token);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Password reset link is invalid or has expired (15-minute validity). Please request a new link." },
        { status: 400 }
      );
    }

    const user = authDb.getUserById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User account not found." },
        { status: 404 }
      );
    }

    const passwordHash = await hashPassword(newPassword);

    authDb.updateUser(userId, {
      passwordHash,
      failedLoginAttempts: 0,
      lockUntil: undefined,
    });

    // Invalidate all existing sessions across devices
    authDb.deleteUserSessions(userId);

    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";
    authDb.logAudit({
      userId: user.id,
      identifier: user.identifier,
      action: "PASSWORD_RESET_COMPLETED",
      status: "SUCCESS",
      details: "Password reset completed via token. Sessions invalidated.",
      ip,
    });

    return NextResponse.json({
      success: true,
      message: "Password reset successfully! You can now log in with your new password.",
    });
  } catch (error) {
    console.error("Reset password API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to reset password. Please try again." },
      { status: 500 }
    );
  }
}
